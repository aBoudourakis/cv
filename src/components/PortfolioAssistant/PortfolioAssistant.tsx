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
		// Closing (via the close button, Escape, or otherwise) always returns
		// focus to the launcher (docs/Clip_bot_specification.md #15).
		launcherRef.current?.focus();
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
