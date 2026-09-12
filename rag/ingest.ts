/**
 * Deterministic, idempotent ingestion of the portfolio knowledge base into
 * Supabase/pgvector. Safe to run repeatedly: chunks whose content hasn't
 * changed are left untouched (no embedding call, no write); only new or
 * changed chunks are (re-)embedded and upserted; chunks no longer produced
 * by buildChunks() are deleted.
 *
 * Usage:
 *   npm run rag:ingest            -- embeds + writes changes
 *   npm run rag:ingest -- --dry-run  -- prints the diff only, no API calls, no writes
 *
 * Embedding provider is switchable via EMBEDDING_PROVIDER (default "mistral"),
 * per docs/RAG Portfolio Assistant Implementation Specification.md §5's
 * requirement to keep embeddings behind a small provider abstraction. The
 * vector dimension is fixed by the database column (see the
 * switch_embeddings_to_mistral migration) — swapping to a provider with a
 * different output dimension needs a matching migration, not just an env
 * var change. Keep this in sync with supabase/functions/portfolio-chat/index.ts,
 * which duplicates the same provider logic (Deno can't reliably bundle a
 * shared module from outside supabase/functions/ on deploy).
 *
 * Required env (never VITE_-prefixed — this never runs in the browser):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   EMBEDDING_PROVIDER        (optional, "mistral" | "openai", defaults to "mistral")
 *   MISTRAL_API_KEY           (required when EMBEDDING_PROVIDER=mistral)
 *   MISTRAL_EMBEDDING_MODEL   (optional, defaults to mistral-embed)
 *   OPENAI_API_KEY            (required when EMBEDDING_PROVIDER=openai)
 *   OPENAI_EMBEDDING_MODEL    (optional, defaults to text-embedding-3-small)
 *
 * Loaded automatically from .env.local if present (Node's native
 * process.loadEnvFile — no dotenv dependency needed).
 */

import { createHash } from 'node:crypto';
import { buildChunks } from './chunk.ts';
import type { PortfolioChunk } from './types.ts';

for (const envFile of ['.env.local', '.env']) {
	try {
		process.loadEnvFile(envFile);
	} catch {
		// optional — fall through to relying on already-exported env vars
	}
}

const DRY_RUN = process.argv.includes('--dry-run');

// Must match the vector(N) dimension in the current migration.
const EMBEDDING_DIMENSION = 1024;

function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		console.error(`Missing required environment variable: ${name}`);
		process.exit(1);
	}
	return value;
}

function hashContent(content: string): string {
	return createHash('sha256').update(content).digest('hex');
}

interface ExistingRow {
	id: string;
	content_hash: string;
}

async function supabaseRequest(
	supabaseUrl: string,
	serviceRoleKey: string,
	path: string,
	init: RequestInit = {},
): Promise<Response> {
	const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
		...init,
		headers: {
			apikey: serviceRoleKey,
			Authorization: `Bearer ${serviceRoleKey}`,
			'Content-Type': 'application/json',
			...init.headers,
		},
	});
	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Supabase request failed (${response.status} ${path}): ${body}`);
	}
	return response;
}

async function fetchExistingRows(supabaseUrl: string, serviceRoleKey: string): Promise<ExistingRow[]> {
	const response = await supabaseRequest(
		supabaseUrl,
		serviceRoleKey,
		'portfolio_documents?select=id,content_hash',
	);
	return (await response.json()) as ExistingRow[];
}

function parseEmbeddingResponse(json: { data: { embedding: number[]; index: number }[] }, count: number): number[][] {
	const embeddings = new Array<number[]>(count);
	for (const item of json.data) {
		embeddings[item.index] = item.embedding;
	}
	return embeddings;
}

// Fails fast with a clear message instead of letting a dimension mismatch
// surface later as an opaque Postgres error on insert.
function assertDimension(embeddings: number[][], model: string): void {
	for (const embedding of embeddings) {
		if (embedding.length !== EMBEDDING_DIMENSION) {
			throw new Error(
				`Model "${model}" returned a ${embedding.length}-dimension embedding, expected ${EMBEDDING_DIMENSION}. ` +
					'Update EMBEDDING_DIMENSION (and the matching database migration) if you intend to use this model.',
			);
		}
	}
}

async function embedWithMistral(contents: string[]): Promise<number[][]> {
	const apiKey = requireEnv('MISTRAL_API_KEY');
	const model = process.env.MISTRAL_EMBEDDING_MODEL ?? 'mistral-embed';

	const response = await fetch('https://api.mistral.ai/v1/embeddings', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		// mistral-embed rejects output_dimension outright ("This model does not
		// support output_dimension") — it always returns a fixed 1024-dim vector,
		// which is why EMBEDDING_DIMENSION is set to 1024 rather than requested.
		body: JSON.stringify({ model, input: contents }),
	});
	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Mistral embeddings request failed (${response.status}): ${body}`);
	}
	const json = (await response.json()) as { data: { embedding: number[]; index: number }[] };
	const embeddings = parseEmbeddingResponse(json, contents.length);
	assertDimension(embeddings, model);
	return embeddings;
}

async function embedWithOpenAI(contents: string[]): Promise<number[][]> {
	const apiKey = requireEnv('OPENAI_API_KEY');
	const model = process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small';

	const response = await fetch('https://api.openai.com/v1/embeddings', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ model, input: contents, dimensions: EMBEDDING_DIMENSION }),
	});
	if (!response.ok) {
		const body = await response.text();
		throw new Error(`OpenAI embeddings request failed (${response.status}): ${body}`);
	}
	const json = (await response.json()) as { data: { embedding: number[]; index: number }[] };
	const embeddings = parseEmbeddingResponse(json, contents.length);
	assertDimension(embeddings, model);
	return embeddings;
}

async function embedContents(contents: string[]): Promise<number[][]> {
	const provider = process.env.EMBEDDING_PROVIDER ?? 'mistral';
	if (provider === 'mistral') return embedWithMistral(contents);
	if (provider === 'openai') return embedWithOpenAI(contents);
	throw new Error(`Unknown EMBEDDING_PROVIDER: "${provider}" (expected "mistral" or "openai").`);
}

function toRow(chunk: PortfolioChunk, embedding: number[], contentHash: string) {
	return {
		id: chunk.id,
		content: chunk.content,
		embedding,
		category: chunk.category,
		title: chunk.title,
		source: chunk.source ?? null,
		source_url: chunk.sourceUrl ?? null,
		section_id: chunk.sectionId ?? null,
		metadata: chunk.metadata ?? {},
		content_hash: contentHash,
	};
}

async function main() {
	const chunks = buildChunks();

	const ids = new Set(chunks.map((chunk) => chunk.id));
	if (ids.size !== chunks.length) {
		console.error('Duplicate chunk ids detected — aborting:', [...chunks.map((c) => c.id)].filter((id, i, arr) => arr.indexOf(id) !== i));
		process.exit(1);
	}

	const supabaseUrl = DRY_RUN ? undefined : requireEnv('SUPABASE_URL');
	const serviceRoleKey = DRY_RUN ? undefined : requireEnv('SUPABASE_SERVICE_ROLE_KEY');

	const existingRows = DRY_RUN ? [] : await fetchExistingRows(supabaseUrl!, serviceRoleKey!);
	const existingHashById = new Map(existingRows.map((row) => [row.id, row.content_hash]));

	const unchanged: PortfolioChunk[] = [];
	const changed: { chunk: PortfolioChunk; hash: string }[] = [];

	for (const chunk of chunks) {
		const hash = hashContent(chunk.content);
		if (existingHashById.get(chunk.id) === hash) {
			unchanged.push(chunk);
		} else {
			changed.push({ chunk, hash });
		}
	}

	const idsToDelete = existingRows.map((row) => row.id).filter((id) => !ids.has(id));

	console.log(`Chunks: ${chunks.length} total — ${changed.length} new/changed, ${unchanged.length} unchanged, ${idsToDelete.length} to delete.`);
	if (changed.length > 0) {
		console.log('New/changed:', changed.map(({ chunk }) => chunk.id).join(', '));
	}
	if (idsToDelete.length > 0) {
		console.log('To delete:', idsToDelete.join(', '));
	}

	if (DRY_RUN) {
		console.log('\n--dry-run: no embeddings generated, no writes made.');
		return;
	}

	if (changed.length > 0) {
		const embeddings = await embedContents(changed.map(({ chunk }) => chunk.content));
		const rows = changed.map(({ chunk, hash }, index) => toRow(chunk, embeddings[index], hash));

		await supabaseRequest(supabaseUrl!, serviceRoleKey!, 'portfolio_documents', {
			method: 'POST',
			headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
			body: JSON.stringify(rows),
		});
		console.log(`Upserted ${rows.length} row(s).`);
	}

	if (idsToDelete.length > 0) {
		// Delete only the rows whose id is in the obsolete set — NOT "not.in", which
		// would delete everything else in the table.
		const filter = idsToDelete.map((id) => encodeURIComponent(id)).join(',');
		await supabaseRequest(supabaseUrl!, serviceRoleKey!, `portfolio_documents?id=in.(${filter})`, {
			method: 'DELETE',
			headers: { Prefer: 'return=minimal' },
		});
		console.log(`Deleted ${idsToDelete.length} obsolete row(s).`);
	}

	console.log('Ingestion complete.');
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
