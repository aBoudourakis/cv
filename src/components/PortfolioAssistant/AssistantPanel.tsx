import { useEffect, useRef, useState } from 'react';
import styles from './AssistantPanel.module.scss';
import ClipMascot from './ClipMascot.tsx';
import SuggestedQuestions from './SuggestedQuestions.tsx';
import AssistantMessage from './AssistantMessage.tsx';
import { CloseIcon, SendIcon } from './icons.tsx';
import { ASSISTANT_DISCLOSURE, ASSISTANT_INTRO, ASSISTANT_SUBTITLE, ASSISTANT_TITLE, INPUT_PLACEHOLDER, MAX_QUESTION_LENGTH } from './constants.ts';
import type { UseAssistantChatResult } from './useAssistantChat.ts';

const TITLE_ID = 'portfolio-assistant-title';

const FOCUSABLE_SELECTOR =
	'button:not(:disabled), textarea:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex="-1"])';

interface AssistantPanelProps {
	onClose: () => void;
	chat: UseAssistantChatResult;
}

/**
 * The opened floating panel — header, intro, suggestions/messages and input.
 * A non-modal dialog: the rest of the page stays reachable, but focus is kept
 * inside while open and Escape/close return focus to the launcher (handled
 * one level up, in PortfolioAssistant.tsx).
 */
export default function AssistantPanel({ onClose, chat }: AssistantPanelProps) {
	/** REFS **/
	const panelRef = useRef<HTMLDivElement | null>(null);
	const closeButtonRef = useRef<HTMLButtonElement | null>(null);
	const messageListRef = useRef<HTMLDivElement | null>(null);
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	/** STATE **/
	const [inputValue, setInputValue] = useState('');

	const { entries, isSending, sendQuestion, resetConversation } = chat;
	const hasConversation = entries.length > 0;

	/** Move focus into the panel on open. **/
	useEffect(() => {
		closeButtonRef.current?.focus();
	}, []);

	/** Keep the latest message in view. **/
	useEffect(() => {
		const list = messageListRef.current;
		if (!list) return;
		list.scrollTop = list.scrollHeight;
	}, [entries]);

	/** Lightweight focus trap + Escape-to-close, scoped to this panel. **/
	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Escape') {
			event.stopPropagation();
			onClose();
			return;
		}
		if (event.key !== 'Tab') return;

		const panel = panelRef.current;
		if (!panel) return;
		const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
		if (focusable.length === 0) return;

		const first = focusable[0];
		const last = focusable[focusable.length - 1];

		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	};

	const submitQuestion = (question: string) => {
		if (!question.trim() || isSending) return;
		sendQuestion(question);
		setInputValue('');
		textareaRef.current?.focus();
	};

	const handleInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			submitQuestion(inputValue);
		}
	};

	const latestEntry = entries[entries.length - 1];
	const liveAnnouncement =
		latestEntry?.role === 'assistant'
			? latestEntry.status === 'thinking'
				? 'Clip is thinking…'
				: latestEntry.content
			: '';

	const canSend = inputValue.trim().length > 0 && !isSending;

	/** RENDER **/
	return (
		<div
			ref={panelRef}
			className={styles.Panel}
			role="dialog"
			aria-labelledby={TITLE_ID}
			onKeyDown={handleKeyDown}
		>
			<header className={styles.Header}>
				<ClipMascot state={isSending ? 'thinking' : 'open'} size={44} />
				<div className={styles.HeaderText}>
					<h2 id={TITLE_ID} className={styles.Title}>{ASSISTANT_TITLE}</h2>
					<p className={styles.Subtitle}>{ASSISTANT_SUBTITLE}</p>
				</div>
				<button
					ref={closeButtonRef}
					type="button"
					className={styles.CloseButton}
					aria-label="Close assistant"
					onClick={onClose}
				>
					<CloseIcon />
				</button>
			</header>

			{!hasConversation && <p className={styles.Intro}>{ASSISTANT_INTRO}</p>}

			<div className={styles.Divider} />

			<div className={styles.Body} ref={messageListRef}>
				{hasConversation ? (
					<div className={styles.MessageList}>
						{entries.map((entry) => (
							<AssistantMessage key={entry.id} entry={entry} />
						))}
					</div>
				) : (
					<SuggestedQuestions onSelect={submitQuestion} disabled={isSending} />
				)}
			</div>

			<div className={styles.VisuallyHidden} aria-live="polite" aria-atomic="true">
				{liveAnnouncement}
			</div>

			<div className={styles.InputRow}>
				<textarea
					ref={textareaRef}
					className={styles.Input}
					placeholder={INPUT_PLACEHOLDER}
					aria-label="Ask a question"
					value={inputValue}
					maxLength={MAX_QUESTION_LENGTH}
					rows={1}
					disabled={isSending}
					onChange={(event) => setInputValue(event.target.value)}
					onKeyDown={handleInputKeyDown}
				/>
				<button
					type="button"
					className={styles.SendButton}
					aria-label="Send question"
					disabled={!canSend}
					onClick={() => submitQuestion(inputValue)}
				>
					<SendIcon />
				</button>
			</div>

			<div className={styles.Footer}>
				<p className={styles.Disclosure}>{ASSISTANT_DISCLOSURE}</p>
				{hasConversation && (
					<button type="button" className={styles.ClearButton} onClick={resetConversation}>
						Clear conversation
					</button>
				)}
			</div>
		</div>
	);
}
