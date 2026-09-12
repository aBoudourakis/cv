import { useEffect, useRef, useState, type CSSProperties } from 'react';
import styles from './ClipMascot.module.scss';
import type { MascotState } from './types';

interface ClipMascotProps {
	/** Drives the animation/expression — kept separate from any network state. */
	state: MascotState;
	/** Rendered size in px. Designed to stay legible at 48–64px and scale cleanly up to ~90–120px. */
	size?: number;
	className?: string;
}

const MAX_PUPIL_OFFSET = 1.6;

/**
 * Original paperclip-inspired mascot ("Clip") — an inline SVG so its colors
 * follow the --assistant-* theme tokens and its states are plain CSS classes
 * (see docs/Clip_bot_specification.md #4/#19). Deliberately not a copy of
 * Microsoft's Clippy: a symmetrical double-loop silhouette with restrained,
 * simple eyes rather than an illustrated face/eyebrows.
 *
 * Reduced motion is handled globally (src/styles/global.scss zeroes all
 * animation/transition durations under prefers-reduced-motion), so no
 * additional handling is needed here.
 */
export default function ClipMascot({ state, size = 56, className }: ClipMascotProps) {
	/** REFS **/
	const rootRef = useRef<HTMLDivElement | null>(null);

	/** STATE **/
	// Subtle "eyes follow the cursor" micro-interaction, restrained to hover only.
	const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });

	useEffect(() => {
		if (state !== 'hover') {
			setPupilOffset({ x: 0, y: 0 });
		}
	}, [state]);

	const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
		if (state !== 'hover') return;
		const rect = rootRef.current?.getBoundingClientRect();
		if (!rect) return;
		const relativeX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
		const relativeY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
		setPupilOffset({
			x: Math.max(-1, Math.min(1, relativeX)) * MAX_PUPIL_OFFSET,
			y: Math.max(-1, Math.min(1, relativeY)) * MAX_PUPIL_OFFSET,
		});
	};

	const style = {
		'--assistant-mascot-size': `${size}px`,
		'--pupil-x': `${pupilOffset.x}px`,
		'--pupil-y': `${pupilOffset.y}px`,
	} as CSSProperties;

	return (
		<div
			ref={rootRef}
			className={[styles.MascotRoot, className].filter(Boolean).join(' ')}
			data-state={state}
			style={style}
			onMouseMove={handleMouseMove}
			aria-hidden="true"
		>
			<svg className={styles.MascotSvg} viewBox="0 0 64 96" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<linearGradient id="clipMetalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="var(--assistant-metal)" />
						<stop offset="45%" stopColor="var(--assistant-highlight)" />
						<stop offset="100%" stopColor="var(--assistant-metal-strong)" />
					</linearGradient>
				</defs>

				{/* Body — two centered stadium loops, the classic flattened paperclip silhouette. */}
				<rect
					className={styles.ClipOuter}
					x="15" y="8" width="34" height="72" rx="17"
					fill="none" stroke="url(#clipMetalGradient)" strokeWidth="7"
				/>
				<rect
					className={styles.ClipInner}
					x="23" y="18" width="18" height="52" rx="9"
					fill="none" stroke="url(#clipMetalGradient)" strokeWidth="6"
				/>

				{/* Small warm gold highlights — a restrained "glint", not a full glow. */}
				<path className={styles.Highlight} d="M20 15c1.5-2.5 3.4-4 5.8-4.6" fill="none" strokeLinecap="round" strokeWidth="3" />
				<path className={styles.Highlight} d="M26 22c1-1.6 2.3-2.6 3.9-3" fill="none" strokeLinecap="round" strokeWidth="2.2" />

				{/* Eyes — expressive but restrained: no eyebrows/mouth. */}
				<g className={styles.Eye}>
					<circle cx="26" cy="30" r="5.4" fill="var(--assistant-eye-sclera, #F7F9FC)" stroke="var(--assistant-border)" strokeWidth="0.75" />
					<circle className={styles.Pupil} cx="26" cy="30" r="2.3" fill="var(--assistant-eye-pupil, #1B2233)" />
				</g>
				<g className={styles.Eye}>
					<circle cx="38" cy="30" r="5.4" fill="var(--assistant-eye-sclera, #F7F9FC)" stroke="var(--assistant-border)" strokeWidth="0.75" />
					<circle className={styles.Pupil} cx="38" cy="30" r="2.3" fill="var(--assistant-eye-pupil, #1B2233)" />
				</g>
			</svg>

			{state === 'thinking' && (
				<div className={styles.ThinkingBubble}>
					<span className={styles.Dot} />
					<span className={styles.Dot} />
					<span className={styles.Dot} />
				</div>
			)}
		</div>
	);
}
