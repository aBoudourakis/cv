/**
 * Shared shape for a single knowledge-base chunk, mirroring the columns of
 * the `portfolio_documents` table (minus `embedding`/`content_hash`, which
 * `ingest.ts` computes) — see supabase/migrations/20260912093855_setup_rag_database.sql
 * and supabase/migrations/20260913090100_add_portfolio_documents_visibility_priority.sql.
 */
export interface PortfolioChunk {
	/** Deterministic slug, stable across ingestion runs (e.g. "experience-dealio-ltd"). */
	id: string;
	/** The text that gets embedded and sent to the LLM as retrieved context. */
	content: string;
	category:
		// Public CV/portfolio categories — built from src/components/cv/cvData.ts by rag/chunk.ts.
		| 'profile'
		| 'experience'
		| 'skill'
		| 'education'
		| 'certification'
		| 'award'
		| 'seminar'
		| 'language'
		| 'project'
		// Assistant-only knowledge-layer categories — built from the `assistant_knowledge`
		// table by rag/assistantKnowledge.ts. See docs/RAG Portfolio Assistant Implementation
		// Specification.md, "Assistant-Only Professional Knowledge Layer".
		| 'professional-summary'
		| 'frontend-engineering'
		| 'ui-ux'
		| 'architecture'
		| 'realtime-systems'
		| 'startup-experience'
		| 'leadership'
		| 'working-style'
		| 'project-ownership'
		| 'ai-rag'
		| 'tooling'
		| 'career-preferences'
		| 'technical-decision'
		| 'interview-example';
	title: string;
	source?: string;
	sourceUrl?: string;
	/** Live CV anchor id from CVContent.tsx's SECTION_NAV, e.g. "cv-experience". */
	sectionId?: string;
	metadata?: Record<string, unknown>;
	/**
	 * Where this chunk originated. Defaults to 'public' (rag/ingest.ts fills this
	 * in when absent, so rag/chunk.ts's public CV chunks don't need to set it).
	 * Stored on portfolio_documents for internal debugging only — never exposed
	 * as-is to the frontend (supabase/functions/portfolio-chat/index.ts's
	 * `toSource()` doesn't forward it).
	 */
	visibility?: 'public' | 'assistant_only';
	/**
	 * Modest retrieval ranking signal: 1 = supporting/general, 2 = relevant,
	 * 3 = strong/authoritative. Defaults to 1. Used only as a small tie-breaking
	 * boost in match_portfolio_documents — it must never override semantic
	 * relevance (see that function's definition).
	 */
	priority?: 1 | 2 | 3;
}
