/**
 * Runs rag/evaluation/questions.json against the live knowledge base and
 * reports whether each question's top matches include at least one of its
 * expectedCategories — a lightweight signal for retrieval quality (task §31:
 * "verify retrieval quality rather than merely verifying that the API
 * returns HTTP 200").
 *
 * This makes real embedding-provider API calls (one per question) and is NOT
 * part of `npm test` — see rag/embeddings.ts for the required env vars.
 *
 * Usage:
 *   npm run rag:evaluate
 *   npm run rag:evaluate -- --top-k=8 --threshold=0.2
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { embedContents, requireEnv } from '../embeddings.ts';

for (const envFile of ['.env.local', '.env']) {
	try {
		process.loadEnvFile(envFile);
	} catch {
		// optional
	}
}

const DEFAULT_TOP_K = 5;
const DEFAULT_MATCH_THRESHOLD = 0.3;

interface EvalQuestion {
	id: string;
	type: string;
	question: string;
	expectedCategories: string[];
	notes?: string;
}

interface MatchRow {
	id: string;
	category: string;
	title: string;
	similarity: number;
}

function parseArgs(argv: string[]): { topK: number; threshold: number } {
	let topK = Number(process.env.RAG_TOP_K ?? DEFAULT_TOP_K);
	let threshold = Number(process.env.RAG_MATCH_THRESHOLD ?? DEFAULT_MATCH_THRESHOLD);
	for (const arg of argv) {
		if (arg.startsWith('--top-k=')) topK = Number(arg.slice('--top-k='.length));
		else if (arg.startsWith('--threshold=')) threshold = Number(arg.slice('--threshold='.length));
	}
	return { topK, threshold };
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
		body: JSON.stringify({ query_embedding: queryEmbedding, match_threshold: matchThreshold, match_count: matchCount }),
	});
	if (!response.ok) {
		const body = await response.text();
		throw new Error(`match_portfolio_documents RPC failed (${response.status}): ${body}`);
	}
	return (await response.json()) as MatchRow[];
}

async function main() {
	const { topK, threshold } = parseArgs(process.argv.slice(2));
	const supabaseUrl = requireEnv('SUPABASE_URL');
	const serviceRoleKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

	const questionsPath = fileURLToPath(new URL('./questions.json', import.meta.url));
	const { questions } = JSON.parse(readFileSync(questionsPath, 'utf-8')) as { questions: EvalQuestion[] };

	console.log(`Evaluating ${questions.length} questions (top-k=${topK}, threshold=${threshold})...\n`);

	let passed = 0;
	let checked = 0;

	for (const q of questions) {
		const [embedding] = await embedContents([q.question]);
		const matches = await matchPortfolioDocuments(supabaseUrl, serviceRoleKey, embedding, threshold, topK);
		const matchedCategories = new Set(matches.map((m) => m.category));

		if (q.expectedCategories.length === 0) {
			console.log(`[--] ${q.id} (${q.type}): "${q.question}"`);
			console.log(`     ${matches.length} match(es): ${matches.map((m) => `${m.category}/${m.id}`).join(', ') || '(none)'}`);
			continue;
		}

		checked += 1;
		const hit = q.expectedCategories.some((category) => matchedCategories.has(category));
		if (hit) passed += 1;
		console.log(`[${hit ? 'OK' : 'FAIL'}] ${q.id} (${q.type}): "${q.question}"`);
		console.log(`     expected one of: ${q.expectedCategories.join(', ')}`);
		console.log(`     got: ${matches.map((m) => `${m.category}/${m.id} (${m.similarity.toFixed(3)})`).join(', ') || '(none)'}`);
	}

	console.log(`\n${passed}/${checked} category-scored questions matched at least one expected category.`);
	if (passed < checked) {
		process.exitCode = 1;
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
