import type { AssistantRequest, AssistantResponse, AssistantTransportError, Transport } from 'familiar-js';
import { toFamiliarSource } from './toFamiliarSource.ts';
import type { PortfolioChatResponse } from './types.ts';

const FUNCTION_PATH = '/functions/v1/portfolio-chat';

function createId(): string {
	if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
	return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

/**
 * Cloudflare Turnstile is not wired into the frontend yet — see
 * "# 19. Bot Protection" in docs/RAG Portfolio Assistant Implementation
 * Specification.md. supabase/functions/portfolio-chat/index.ts currently
 * only checks that a non-empty token was sent (shape, not a real
 * verification), so a placeholder keeps the request contract satisfied
 * without blocking this UI task on standing up the Turnstile widget.
 * Replace this with the widget's real token once it exists.
 */
function getPlaceholderTurnstileToken(): string {
	return `pending-${createId()}`;
}

// Defends against a very easy mistake: .env.local writes VITE_SUPABASE_URL
// shell-style with surrounding quotes (VITE_SUPABASE_URL='https://...'),
// which is fine for Node's own env-file loader but NOT for a value pasted
// verbatim into a GitHub Actions secret — secrets are raw strings, quotes
// and all. A quoted value no longer starts with "http", so the browser
// treats it as a *relative* path on the current page's own origin instead
// of an absolute URL, silently sending the request to the wrong place.
function sanitizeEnvUrl(value: string | undefined): string | undefined {
	const trimmed = value?.trim().replace(/^['"]|['"]$/g, '');
	return trimmed || undefined;
}

function kindForErrorCode(code: string | undefined): AssistantTransportError['kind'] {
	if (code === 'RATE_LIMITED' || code === 'DAILY_LIMIT_REACHED' || code === 'MONTHLY_LIMIT_REACHED') return 'rate-limit';
	if (code === 'CHAT_DISABLED') return 'server';
	return 'unknown';
}

/** Constructor shape of familiar-js's AssistantTransportError, injected rather than imported at runtime — see the comment on the constructor below. */
type AssistantTransportErrorCtor = new (message: string, kind?: AssistantTransportError['kind']) => AssistantTransportError;

/**
 * Calls the same Supabase Edge Function the previous hand-rolled UI used,
 * preserving its auth headers, request shape (including the Turnstile
 * placeholder) and error-code-to-UI mapping, while adapting the response
 * into familiar-js's { answer, sources } shape.
 */
export class PortfolioChatTransport implements Transport {
	private readonly supabaseUrl?: string;
	private readonly supabaseAnonKey?: string;
	private readonly TransportError: AssistantTransportErrorCtor;

	/**
	 * Takes the AssistantTransportError class rather than importing it itself —
	 * familiar-js is dynamically imported in PortfolioAssistant.tsx to keep its
	 * ~900KB (gzipped) of bundled mascot art out of the main chunk; a static
	 * runtime import here would pull the whole package back into it anyway.
	 */
	constructor(TransportError: AssistantTransportErrorCtor) {
		this.TransportError = TransportError;
		this.supabaseUrl = sanitizeEnvUrl(import.meta.env.VITE_SUPABASE_URL);
		this.supabaseAnonKey = sanitizeEnvUrl(import.meta.env.VITE_SUPABASE_ANON_KEY);
	}

	async send(request: AssistantRequest, signal?: AbortSignal): Promise<AssistantResponse> {
		if (!this.supabaseUrl || !this.supabaseAnonKey || !/^https?:\/\//.test(this.supabaseUrl)) {
			throw new this.TransportError('The portfolio assistant is not configured yet. Please check back later.', 'server');
		}

		let response: Response;
		try {
			response = await fetch(`${this.supabaseUrl}${FUNCTION_PATH}`, {
				method: 'POST',
				signal,
				headers: {
					'Content-Type': 'application/json',
					apikey: this.supabaseAnonKey,
					Authorization: `Bearer ${this.supabaseAnonKey}`,
				},
				body: JSON.stringify({
					question: request.question,
					conversation: request.conversation,
					turnstileToken: getPlaceholderTurnstileToken(),
				}),
			});
		} catch {
			throw new this.TransportError(
				"Couldn't reach the portfolio assistant. Please check your connection and try again.",
				'network',
			);
		}

		const body = await response.json().catch(() => null);

		if (!response.ok) {
			const message = typeof body?.message === 'string' ? body.message : 'Something went wrong. Please try again.';
			throw new this.TransportError(message, kindForErrorCode(body?.error));
		}

		const data = body as PortfolioChatResponse;
		return {
			answer: data.answer,
			sources: data.sources.map(toFamiliarSource),
		};
	}
}
