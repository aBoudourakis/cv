/**
 * Frontend-owned mirror of the API contract implemented by
 * supabase/functions/portfolio-chat/index.ts (PortfolioSource,
 * PortfolioChatResponse and its ErrorCode union) — kept separate from an
 * import since the Edge Function and the Vite app are built/deployed
 * independently.
 */

export interface PortfolioSource {
	id: string;
	title: string;
	category: string;
	source?: string;
	url?: string;
	sectionId?: string;
}

export interface PortfolioChatResponse {
	answer: string;
	sources: PortfolioSource[];
	cached?: boolean;
	requestId: string;
}

/** Backend error codes — see supabase/functions/portfolio-chat/index.ts's ErrorCode union. */
export type PortfolioChatErrorCode =
	| 'INVALID_REQUEST'
	| 'QUESTION_TOO_LONG'
	| 'RATE_LIMITED'
	| 'DAILY_LIMIT_REACHED'
	| 'MONTHLY_LIMIT_REACHED'
	| 'CHAT_DISABLED'
	| 'AI_PROVIDER_ERROR'
	| 'INTERNAL_ERROR';
