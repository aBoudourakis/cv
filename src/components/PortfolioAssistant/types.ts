/**
 * Shared types for the "Clip" portfolio assistant UI.
 *
 * These mirror the API contract already implemented by
 * supabase/functions/portfolio-chat/index.ts (PortfolioChatRequest,
 * PortfolioSource, PortfolioChatResponse and its ErrorCode union) — kept as a
 * separate, frontend-owned copy rather than an import, since the Edge
 * Function and the Vite app are built/deployed independently.
 */

export type ChatRole = 'user' | 'assistant';

/** One turn of prior conversation, sent back to the server for follow-up questions. */
export interface ChatMessage {
	role: ChatRole;
	content: string;
}

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

/** UI-facing status for a single conversation entry. */
export type ConversationStatus =
	| 'thinking'
	| 'done'
	| 'no_context'
	| 'error'
	| 'rate_limited'
	| 'unavailable';

/** One rendered turn in the panel — either the visitor's question or Clip's reply. */
export interface ConversationEntry {
	id: string;
	role: ChatRole;
	content: string;
	status: ConversationStatus;
	sources?: PortfolioSource[];
}

/** Visual/animation state driving ClipMascot — separate from network state. */
export type MascotState = 'idle' | 'hover' | 'thinking' | 'open';
