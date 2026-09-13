/**
 * Reads the curated, recruiter-facing `assistant_knowledge` table and
 * converts its enabled rows into the same PortfolioChunk shape rag/chunk.ts
 * builds from the public CV data, so rag/ingest.ts can embed both sources
 * into portfolio_documents uniformly.
 *
 * `assistant_knowledge` is the source of truth for professional context that
 * is deliberately NOT rendered on the public CV/portfolio site (working
 * style, career preferences, real-time/AI project depth, etc.) — see
 * docs/RAG Portfolio Assistant Implementation Specification.md, "Assistant-
 * Only Professional Knowledge Layer", and the seed data in
 * supabase/migrations/20260913090200_seed_assistant_knowledge.sql.
 *
 * The table is locked down by RLS with zero anon/authenticated policies
 * (same pattern as portfolio_documents) — only the service-role key used
 * here by rag/ingest.ts can read it.
 */

import type { PortfolioChunk } from './types.ts';

/** Row shape of `assistant_knowledge` — see the migration that creates the table. */
export interface AssistantKnowledgeRow {
	id: string;
	slug: string;
	title: string;
	content: string;
	category: string;
	source_label: string | null;
	priority: number;
	metadata: Record<string, unknown>;
	enabled: boolean;
}

const SELECT_COLUMNS = 'id,slug,title,content,category,source_label,priority,metadata,enabled';

/**
 * Fetches only `enabled=true` rows — disabled entries are excluded here
 * (rather than filtered client-side) so an ingestion run never even embeds
 * them, and a previously-ingested-then-disabled entry is picked up by
 * rag/ingest.ts's normal "no longer produced" deletion pass.
 */
export async function fetchAssistantKnowledgeRows(
	supabaseUrl: string,
	serviceRoleKey: string,
): Promise<AssistantKnowledgeRow[]> {
	const response = await fetch(
		`${supabaseUrl}/rest/v1/assistant_knowledge?select=${SELECT_COLUMNS}&enabled=eq.true`,
		{
			headers: {
				apikey: serviceRoleKey,
				Authorization: `Bearer ${serviceRoleKey}`,
			},
		},
	);
	if (!response.ok) {
		const body = await response.text();
		throw new Error(`Supabase request failed (${response.status} assistant_knowledge): ${body}`);
	}
	return (await response.json()) as AssistantKnowledgeRow[];
}

/**
 * Deterministic chunk id for a knowledge-base row, namespaced with
 * "knowledge-" so it can never collide with a rag/chunk.ts id (those are
 * namespaced by CV section, e.g. "experience-", "skill-") even if a slug and
 * a CV entry happen to share a name.
 */
export function assistantKnowledgeChunkId(slug: string): string {
	return `knowledge-${slug}`;
}

/**
 * Pure row → chunk mapping (no network) so it's directly unit-testable.
 * Deliberately sets neither `sourceUrl` nor `sectionId` — assistant-only
 * knowledge doesn't live on a page the CV can link or scroll to, so
 * AssistantSources.tsx renders it as plain (non-clickable) text rather than
 * fabricating a link (task §11).
 */
export function toAssistantChunk(row: AssistantKnowledgeRow): PortfolioChunk {
	const priority = row.priority === 2 || row.priority === 3 ? row.priority : 1;
	return {
		id: assistantKnowledgeChunkId(row.slug),
		content: row.content,
		category: row.category as PortfolioChunk['category'],
		title: row.title,
		source: row.source_label ?? undefined,
		visibility: 'assistant_only',
		priority,
		metadata: { ...row.metadata, assistantKnowledgeId: row.id, slug: row.slug },
	};
}
