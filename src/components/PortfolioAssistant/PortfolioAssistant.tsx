import { lazy, Suspense, useRef, useState } from 'react';
import styles from './PortfolioAssistant.module.scss';
import AssistantLauncher from './AssistantLauncher.tsx';
import { useAssistantChat } from './useAssistantChat.ts';

// The panel (messages, sources, input) only loads once a visitor actually
// opens the assistant — the closed launcher stays lightweight
// (docs/Clip_bot_specification.md #21).
const AssistantPanel = lazy(() => import('./AssistantPanel.tsx'));

/**
 * Floating "Clip" portfolio assistant — mounted once near the root of the
 * app. Owns open/close + focus-restoration; network/message state lives in
 * useAssistantChat, visual mascot state lives in the child components.
 */
export default function PortfolioAssistant() {
	/** REFS **/
	const launcherRef = useRef<HTMLButtonElement | null>(null);

	/** STATE **/
	const [isOpen, setIsOpen] = useState(false);
	const chat = useAssistantChat();

	/** CONSTS **/
	const handleClose = () => {
		setIsOpen(false);

		const launcher = launcherRef.current;
		if (!launcher) return;

		// Closing (via the close button, Escape, or otherwise) always returns
		// focus to the launcher (docs/Clip_bot_specification.md #15) — needed
		// for keyboard and VoiceOver users regardless of how this close was
		// triggered. But iOS Safari/Chrome (WebKit) shows the launcher's
		// `:focus-visible` ring on this programmatic focus() even when the
		// close itself was a plain touch tap (Chromium correctly suppresses
		// it there). Suppress the ring with an inline style — it outranks the
		// CSS rule's specificity without needing `!important` — and clear the
		// override on the next blur, so a later *real* keyboard Tab onto the
		// launcher still shows the ring normally.
		launcher.style.outline = 'none';
		const clearRingSuppression = () => {
			launcher.style.outline = '';
			launcher.removeEventListener('blur', clearRingSuppression);
		};
		launcher.addEventListener('blur', clearRingSuppression);
		launcher.focus({ preventScroll: true });
	};

	/** RENDER **/
	return (
		<div className={styles.Root} data-open={isOpen}>
			<div className={styles.LauncherLayer}>
				<AssistantLauncher ref={launcherRef} isOpen={isOpen} onOpen={() => setIsOpen(true)} />
			</div>

			{isOpen && (
				<Suspense fallback={null}>
					<AssistantPanel onClose={handleClose} chat={chat} />
				</Suspense>
			)}
		</div>
	);
}
