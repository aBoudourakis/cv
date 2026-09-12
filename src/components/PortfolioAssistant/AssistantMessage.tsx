import styles from './AssistantMessage.module.scss';
import AssistantSources from './AssistantSources.tsx';
import { ErrorIcon } from './icons.tsx';
import type { ConversationEntry } from './types.ts';

interface AssistantMessageProps {
	entry: ConversationEntry;
}

const NOTICE_STATUSES = new Set(['error', 'rate_limited', 'unavailable']);

/**
 * A single turn in the conversation. Kept compact and readable rather than a
 * giant chat bubble (docs/Clip_bot_specification.md #11) — the user's
 * question gets a small filled bubble, Clip's replies are a plain block with
 * a thin accent bar, matching the rest of the site's understated styling.
 */
export default function AssistantMessage({ entry }: AssistantMessageProps) {
	if (entry.role === 'user') {
		return (
			<div className={styles.Row} data-role="user">
				<p className={styles.UserBubble}>{entry.content}</p>
			</div>
		);
	}

	if (entry.status === 'thinking') {
		return (
			<div className={styles.Row} data-role="assistant">
				<div className={styles.AssistantBlock} data-tone="thinking">
					<span className={styles.ThinkingDots} aria-hidden="true">
						<span />
						<span />
						<span />
					</span>
					<span className={styles.VisuallyHidden}>Clip is thinking…</span>
				</div>
			</div>
		);
	}

	const isNotice = NOTICE_STATUSES.has(entry.status);
	const tone = isNotice ? 'notice' : entry.status === 'no_context' ? 'muted' : 'default';

	return (
		<div className={styles.Row} data-role="assistant">
			<div className={styles.AssistantBlock} data-tone={tone}>
				{isNotice && <ErrorIcon />}
				<div className={styles.AssistantContent}>
					<p className={styles.AssistantText}>{entry.content}</p>
					{entry.sources && entry.sources.length > 0 && <AssistantSources sources={entry.sources} />}
				</div>
			</div>
		</div>
	);
}
