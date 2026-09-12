/**
 * Embedding-provider abstraction shared by rag/ingest.ts and rag/search.ts.
 * Both run under Node/tsx in this same directory, so it's safe to share this
 * via a normal import (unlike supabase/functions/portfolio-chat/index.ts,
 * which duplicates this logic instead — Deno can't reliably bundle a shared
 * module from outside supabase/functions/ on `supabase functions deploy`).
 *
 * Provider is switchable via EMBEDDING_PROVIDER (default "mistral"), per
 * docs/RAG Portfolio Assistant Implementation Specification.md §5.
 *
 * Required env (never VITE_-prefixed — this never runs in the browser):
 *   EMBEDDING_PROVIDER        (optional, "mistral" | "openai", defaults to "mistral")
 *   MISTRAL_API_KEY           (required when EMBEDDING_PROVIDER=mistral)
 *   MISTRAL_EMBEDDING_MODEL   (optional, defaults to mistral-embed)
 *   OPENAI_API_KEY            (required when EMBEDDING_PROVIDER=openai)
 *   OPENAI_EMBEDDING_MODEL    (optional, defaults to text-embedding-3-small)
 */

// Must match the vector(N) dimension in the current migration.
export const EMBEDDING_DIMENSION = 1024;

export function requireEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		console.error(`Missing required environment variable: ${name}`);
		process.exit(1);
	}
	return value;
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

export async function embedContents(contents: string[]): Promise<number[][]> {
	const provider = process.env.EMBEDDING_PROVIDER ?? 'mistral';
	if (provider === 'mistral') return embedWithMistral(contents);
	if (provider === 'openai') return embedWithOpenAI(contents);
	throw new Error(`Unknown EMBEDDING_PROVIDER: "${provider}" (expected "mistral" or "openai").`);
}
