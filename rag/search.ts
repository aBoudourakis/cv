/**
 * Manual retrieval-verification tool: embeds a question the same way
 * rag/ingest.ts embeds chunks, calls the match_portfolio_documents RPC, and
 * prints the top matches with their similarity scores.
 *
 * This is the way to confirm *semantic* retrieval is working (not just that
 * rows exist in the table), and doubles as a tool for tuning
 * RAG_MATCH_THRESHOLD / RAG_TOP_K before wiring them into the Edge Function.
 *
 * Usage:
 *   npm run rag:search -- "What React experience does he have?"
 *   npm run rag:search -- "..." --top-k=8
 *   npm run rag:search -- "..." --threshold=0.15
 *
 * Defaults match supabase/functions/portfolio-chat/index.ts's DEFAULTS
 * (TOP_K: 5, MATCH_THRESHOLD: 0.3) so results here are representative of
 * what the deployed function would retrieve, unless overridden with the
 * flags above or the RAG_TOP_K / RAG_MATCH_THRESHOLD env vars.
 *
 * Required env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, plus the
 * embedding-provider env vars documented in rag/embeddings.ts.
 */

import { embedContents, requireEnv } from './embeddings.ts';

for (const envFile of ['.env.local', '.env']) {
	try {
		process.loadEnvFile(envFile);
	} catch {
		// optional — fall through to relying on already-exported env vars
	}
}

const DEFAULT_TOP_K = 5;
const DEFAULT_MATCH_THRESHOLD = 0.3;

interface MatchRow {
	id: string;
	content: string;
	category: string;
	title: string;
	source: string | null;
	source_url: string | null;
	section_id: string | null;
	metadata: Record<string, unknown>;
	visibility: string;
	priority: number;
	similarity: number;
}

function parseArgs(argv: string[]): { question: string; topK: number; threshold: number } {
	const positional: string[] = [];
	let topK = Number(process.env.RAG_TOP_K ?? DEFAULT_TOP_K);
	let threshold = Number(process.env.RAG_MATCH_THRESHOLD ?? DEFAULT_MATCH_THRESHOLD);

	for (const arg of argv) {
		if (arg.startsWith('--top-k=')) {
			topK = Number(arg.slice('--top-k='.length));
		} else if (arg.startsWith('--threshold=')) {
			threshold = Number(arg.slice('--threshold='.length));
		} else if (arg === '--dry-run') {
			// no-op here — kept only so a stray copy-paste of ingest's flag doesn't error out
		} else if (!arg.startsWith('--')) {
			positional.push(arg);
		}
	}

	const question = positional.join(' ').trim();
	if (!question) {
		console.error('Usage: npm run rag:search -- "your question" [--top-k=5] [--threshold=0.3]');
		process.exit(1);
	}
	if (!Number.isInteger(topK) || topK <= 0) {
		console.error(`Invalid --top-k: ${topK} (must be a positive integer).`);
		process.exit(1);
	}
	if (!Number.isFinite(threshold) || threshold < -1 || threshold > 1) {
		console.error(`Invalid --threshold: ${threshold} (must be a number between -1 and 1).`);
		process.exit(1);
	}

	return { question, topK, threshold };
}

async function matchPortfolioDocuments(
	supabaseUrl: string,
	serviceRoleKey: string,
	queryEmbedding: number[],
	matchThreshold: number,
	matchCount: number,
): Promise<MatchRow[]> {
	const response = await fetch(`${supabaseUrl}/rest/v1/rpc/match_portfolio_documents`, {
		method: 'POST',
		headers: {
			apikey: serviceRoleKey,
			Authorization: `Bearer ${serviceRoleKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query_embedding: queryEmbedding,
			match_threshold: matchThreshold,
			match_count: matchCount,
		}),
	});
	if (!response.ok) {
		const body = await response.text();
		throw new Error(`match_portfolio_documents RPC failed (${response.status}): ${body}`);
	}
	return (await response.json()) as MatchRow[];
}

function previewOf(content: string, maxLength = 160): string {
	const collapsed = content.replace(/\s+/g, ' ').trim();
	return collapsed.length > maxLength ? `${collapsed.slice(0, maxLength)}…` : collapsed;
}

async function main() {
	const { question, topK, threshold } = parseArgs(process.argv.slice(2));

	const supabaseUrl = requireEnv('SUPABASE_URL');
	const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

	console.log(`Question: "${question}"`);
	console.log(`top-k=${topK} threshold=${threshold}\n`);

	const [queryEmbedding] = await embedContents([question]);
	const matches = await matchPortfolioDocuments(supabaseUrl, serviceRoleKey, queryEmbedding, threshold, topK);

	if (matches.length === 0) {
		console.log(`No matches above similarity threshold ${threshold}. Try a lower --threshold to see what's nearby.`);
		return;
	}

	matches.forEach((match, index) => {
		console.log(
			`${index + 1}. [${match.similarity.toFixed(4)}] ${match.title} (${match.category}, id=${match.id}, ` +
				`${match.visibility}, priority=${match.priority})`,
		);
		console.log(`   ${previewOf(match.content)}`);
		if (match.source_url) {
			console.log(`   source: ${match.source ?? match.source_url} — ${match.source_url}`);
		} else if (match.source) {
			console.log(`   source: ${match.source}`);
		}
		console.log('');
	});
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
