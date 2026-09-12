import { forwardRef, useState } from 'react';
import styles from './AssistantLauncher.module.scss';
import ClipMascot from './ClipMascot.tsx';
import { LAUNCHER_TOOLTIP } from './constants.ts';

interface AssistantLauncherProps {
	isOpen: boolean;
	onOpen: () => void;
}

const TOOLTIP_ID = 'portfolio-assistant-tooltip';

/**
 * The closed, floating launcher button. A real <button> (never a clickable
 * div) — its accessible name comes from aria-label, not the hover tooltip
 * (docs/Clip_bot_specification.md #6/#15).
 */
const AssistantLauncher = forwardRef<HTMLButtonElement, AssistantLauncherProps>(function AssistantLauncher(
	{ isOpen, onOpen },
	ref,
) {
	/** STATE **/
	const [isHovering, setIsHovering] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	const showHint = (isHovering || isFocused) && !isOpen;
	const mascotState = isHovering || isFocused ? 'hover' : 'idle';

	/** RENDER **/
	return (
		<div className={styles.LauncherWrap}>
			<span
				id={TOOLTIP_ID}
				role="tooltip"
				className={`${styles.Tooltip} ${showHint ? styles.TooltipVisible : ''}`}
			>
				{LAUNCHER_TOOLTIP}
			</span>

			<button
				ref={ref}
				type="button"
				className={styles.LauncherButton}
				aria-label="Ask about Athinodoros — portfolio assistant"
				aria-haspopup="dialog"
				aria-expanded={isOpen}
				aria-describedby={TOOLTIP_ID}
				onClick={onOpen}
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
			>
				<span className={styles.Ring} aria-hidden="true" />
				<ClipMascot state={mascotState} size={70} />
			</button>
		</div>
	);
});

export default AssistantLauncher;
