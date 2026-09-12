import { useCallback, useRef, useState } from 'react';
import { MAX_CONVERSATION_MESSAGES } from './constants.ts';
import type { ChatMessage, ConversationEntry, ConversationStatus, PortfolioChatResponse } from './types.ts';

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

function statusForErrorCode(code: string | undefined): ConversationStatus {
	if (code === 'RATE_LIMITED' || code === 'DAILY_LIMIT_REACHED' || code === 'MONTHLY_LIMIT_REACHED') {
		return 'rate_limited';
	}
	if (code === 'CHAT_DISABLED') return 'unavailable';
	return 'error';
}

export interface UseAssistantChatResult {
	entries: ConversationEntry[];
	isSending: boolean;
	/** Set when required frontend env vars are missing — surfaced as an "unavailable" notice rather than a crash. */
	configError: string | null;
	sendQuestion: (question: string) => void;
	resetConversation: () => void;
}

export function useAssistantChat(): UseAssistantChatResult {
	/** STATE **/
	const [entries, setEntries] = useState<ConversationEntry[]>([]);
	const [isSending, setIsSending] = useState(false);

	/** REFS **/
	// Belt-and-suspenders alongside isSending/disabled UI: guards against a
	// resubmit landing between a click and the next render.
	const pendingRef = useRef(false);

	const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
	const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
	const configError =
		!supabaseUrl || !supabaseAnonKey
			? 'The portfolio assistant is not configured yet. Please check back later.'
			: null;

	/** CONSTS **/
	const resetConversation = useCallback(() => {
		setEntries([]);
	}, []);

	const sendQuestion = useCallback(
		(rawQuestion: string) => {
			const question = rawQuestion.trim();
			if (!question || pendingRef.current) return;

			if (configError) {
				setEntries((previous) => [
					...previous,
					{ id: createId(), role: 'user', content: question, status: 'done' },
					{ id: createId(), role: 'assistant', content: configError, status: 'unavailable' },
				]);
				return;
			}

			pendingRef.current = true;
			setIsSending(true);

			const userEntry: ConversationEntry = { id: createId(), role: 'user', content: question, status: 'done' };
			const thinkingEntry: ConversationEntry = { id: createId(), role: 'assistant', content: '', status: 'thinking' };

			// History as of *before* this turn, capped the same way the server caps it.
			let historyForRequest: ChatMessage[] = [];
			setEntries((previous) => {
				historyForRequest = previous
					.filter((entry): entry is ConversationEntry & { status: 'done' | 'no_context' } =>
						entry.status === 'done' || entry.status === 'no_context',
					)
					.slice(-MAX_CONVERSATION_MESSAGES)
					.map((entry) => ({ role: entry.role, content: entry.content }));
				return [...previous, userEntry, thinkingEntry];
			});

			void (async () => {
				try {
					const response = await fetch(`${supabaseUrl}${FUNCTION_PATH}`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							apikey: supabaseAnonKey!,
							Authorization: `Bearer ${supabaseAnonKey}`,
						},
						body: JSON.stringify({
							question,
							conversation: historyForRequest,
							turnstileToken: getPlaceholderTurnstileToken(),
						}),
					});

					const body = await response.json().catch(() => null);

					if (!response.ok) {
						const message =
							typeof body?.message === 'string' ? body.message : 'Something went wrong. Please try again.';
						const status = statusForErrorCode(body?.error);
						setEntries((previous) =>
							previous.map((entry) => (entry.id === thinkingEntry.id ? { ...entry, content: message, status } : entry)),
						);
						return;
					}

					const data = body as PortfolioChatResponse;
					setEntries((previous) =>
						previous.map((entry) =>
							entry.id === thinkingEntry.id
								? {
										...entry,
										content: data.answer,
										status: data.sources.length === 0 ? 'no_context' : 'done',
										sources: data.sources,
									}
								: entry,
						),
					);
				} catch {
					setEntries((previous) =>
						previous.map((entry) =>
							entry.id === thinkingEntry.id
								? {
										...entry,
										content: "Couldn't reach the portfolio assistant. Please check your connection and try again.",
										status: 'error',
									}
								: entry,
						),
					);
				} finally {
					pendingRef.current = false;
					setIsSending(false);
				}
			})();
		},
		[configError, supabaseAnonKey, supabaseUrl],
	);

	return { entries, isSending, configError, sendQuestion, resetConversation };
}
