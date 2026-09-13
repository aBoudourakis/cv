/**
 * Deterministic, idempotent ingestion of the portfolio knowledge base into
 * Supabase/pgvector. Safe to run repeatedly: chunks whose content hasn't
 * changed are left untouched (no embedding call, no write); only new or
 * changed chunks are (re-)embedded and upserted; chunks no longer produced
 * by buildChunks() + the enabled assistant_knowledge rows are deleted.
 *
 * Ingests TWO sources into the same portfolio_documents table:
 *   - the public CV/portfolio data (rag/chunk.ts, from src/components/cv/cvData.ts)
 *   - the curated, recruiter-facing assistant_knowledge table (rag/assistantKnowledge.ts) —
 *     professional context that isn't necessarily rendered on the CV itself.
 * See docs/RAG Portfolio Assistant Implementation Specification.md, "Assistant-Only
 * Professional Knowledge Layer", for the full picture.
 *
 * Usage:
 *   npm run rag:ingest            -- embeds + writes changes
 *   npm run rag:ingest -- --dry-run  -- prints the diff only, no API calls, no writes
 *
 * --dry-run never touches the network (no Supabase reads, no embedding calls),
 * so it also can't preview assistant_knowledge chunks — those live only in
 * Supabase, unlike the public chunks which are built locally from cvData.ts.
 * The dry-run output says so explicitly.
 *
 * Embedding provider logic lives in rag/embeddings.ts (shared with
 * rag/search.ts). See that file for the required EMBEDDING_PROVIDER,
 * MISTRAL_... and OPENAI_... env vars, and note it's deliberately
 * duplicated (not imported) in supabase/functions/portfolio-chat/index.ts —
 * Deno can't reliably bundle a shared module from outside
 * supabase/functions/ on `supabase functions deploy`.
 *
 * Required env (never VITE_-prefixed — this never runs in the browser):
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   ...plus the embedding-provider env vars documented in rag/embeddings.ts
 *
 * Loaded automatically from .env.local if present (Node's native
 * process.loadEnvFile — no dotenv dependency needed).
 */

import { buildChunks } from './chunk.ts';
import type { PortfolioChunk } from './types.ts';
import { embedContents, requireEnv } from './embeddings.ts';
import { diffChunks, type ExistingRow } from './diff.ts';
import { fetchAssistantKnowledgeRows, toAssistantChunk } from './assistantKnowledge.ts';

for (const envFile of ['.env.local', '.env']) {
	try {
		process.loadEnvFile(envFile);
	} catch {
		// optional — fall through to relying on already-exported env vars
	}
}

const DRY_RUN = process.argv.includes('--dry-run');

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
		visibility: chunk.visibility ?? 'public',
		priority: chunk.priority ?? 1,
		content_hash: contentHash,
	};
}

async function main() {
	const supabaseUrl = DRY_RUN ? undefined : requireEnv('SUPABASE_URL');
	const serviceRoleKey = DRY_RUN ? undefined : requireEnv('SUPABASE_SERVICE_ROLE_KEY');

	const publicChunks = buildChunks();
	let assistantChunks: PortfolioChunk[] = [];
	if (supabaseUrl && serviceRoleKey) {
		const assistantRows = await fetchAssistantKnowledgeRows(supabaseUrl, serviceRoleKey);
		assistantChunks = assistantRows.map(toAssistantChunk);
	} else {
		console.log('--dry-run: skipping assistant_knowledge (requires SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY) — showing public CV chunks only.');
	}
	const chunks = [...publicChunks, ...assistantChunks];

	const ids = new Set(chunks.map((chunk) => chunk.id));
	if (ids.size !== chunks.length) {
		console.error('Duplicate chunk ids detected — aborting:', [...chunks.map((c) => c.id)].filter((id, i, arr) => arr.indexOf(id) !== i));
		process.exit(1);
	}

	const existingRows = supabaseUrl && serviceRoleKey ? await fetchExistingRows(supabaseUrl, serviceRoleKey) : [];
	const { unchanged, changed, idsToDelete } = diffChunks(chunks, existingRows);

	console.log(
		`Chunks: ${chunks.length} total (${publicChunks.length} public, ${assistantChunks.length} assistant-only) — ` +
			`${changed.length} new/changed, ${unchanged.length} unchanged, ${idsToDelete.length} to delete.`,
	);
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
