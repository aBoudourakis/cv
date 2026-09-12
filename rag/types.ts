/**
 * Shared shape for a single knowledge-base chunk, mirroring the columns of
 * the `portfolio_documents` table (minus `embedding`/`content_hash`, which
 * `ingest.ts` computes) — see supabase/migrations/20260912093855_setup_rag_database.sql.
 */
export interface PortfolioChunk {
	/** Deterministic slug, stable across ingestion runs (e.g. "experience-dealio-ltd"). */
	id: string;
	/** The text that gets embedded and sent to the LLM as retrieved context. */
	content: string;
	category:
		| 'profile'
		| 'experience'
		| 'skill'
		| 'education'
		| 'certification'
		| 'award'
		| 'seminar'
		| 'language'
		| 'project';
	title: string;
	source?: string;
	sourceUrl?: string;
	/** Live CV anchor id from CVContent.tsx's SECTION_NAV, e.g. "cv-experience". */
	sectionId?: string;
	metadata?: Record<string, unknown>;
}
