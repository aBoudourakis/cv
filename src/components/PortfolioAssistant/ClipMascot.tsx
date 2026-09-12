import { useEffect, useState, type CSSProperties } from 'react';
import styles from './ClipMascot.module.scss';
import type { MascotState } from './types';

interface ClipMascotProps {
	/** Drives which illustration is shown — kept separate from any network state. */
	state: MascotState;
	/** Rendered size in px. Designed to stay legible at 48–64px and scale cleanly up to ~90–120px. */
	size?: number;
	className?: string;
}

/**
 * Idle-only blink cycle: eyes open for a long, restful stretch, then blink
 * quickly through half-closed → closed → half-closed before settling back —
 * a still, standby feel rather than a constantly-animated one.
 */
type BlinkPhase = 'eyesOpen' | 'closing' | 'closed';

const IDLE_BLINK_SEQUENCE: { phase: BlinkPhase; holdMs: number }[] = [
	{ phase: 'eyesOpen', holdMs: 3000 },
	{ phase: 'closing', holdMs: 120 },
	{ phase: 'closed', holdMs: 220 },
	{ phase: 'closing', holdMs: 120 },
];

const IMAGE_BASE = '/images/Clip/optimized';

function getMascotImageSrc(state: MascotState, blinkPhase: BlinkPhase): string {
	if (state === 'hover') return `${IMAGE_BASE}/Clip_hover.webp`;
	if (state === 'thinking') return `${IMAGE_BASE}/Clip_thinking.webp`;
	if (state === 'open') return `${IMAGE_BASE}/Clip_focused.webp`;

	// Idle — cycles through the blink sequence.
	if (blinkPhase === 'closing') return `${IMAGE_BASE}/Clip_eyes_closing.webp`;
	if (blinkPhase === 'closed') return `${IMAGE_BASE}/Clip_eyes_closed.webp`;
	return `${IMAGE_BASE}/Clip_idle.webp`;
}

/**
 * "Clip" — the portfolio assistant mascot, illustrated (see
 * public/images/Clip/) rather than drawn as inline SVG. Each visual state
 * (idle/hover/thinking/open) maps to its own image; idle additionally cycles
 * through a short blink sequence on a loop (docs/Clip_bot_specification.md
 * #7 — restrained, no constant motion).
 *
 * Reduced motion is handled globally (src/styles/global.scss zeroes all
 * animation/transition durations under prefers-reduced-motion) for the CSS
 * transitions here; the blink *sequence* itself is a deliberate, infrequent
 * state change (not a continuous animation) so it isn't gated by that rule.
 */
export default function ClipMascot({ state, size = 56, className }: ClipMascotProps) {
	/** STATE **/
	const [blinkPhase, setBlinkPhase] = useState<BlinkPhase>('eyesOpen');

	/** Runs the blink loop only while idle; any other state holds its own static image. */
	useEffect(() => {
		if (state !== 'idle') {
			setBlinkPhase('eyesOpen');
			return;
		}

		let cancelled = false;
		let index = 0;
		let timer: ReturnType<typeof setTimeout>;

		const step = () => {
			if (cancelled) return;
			const { phase, holdMs } = IDLE_BLINK_SEQUENCE[index];
			setBlinkPhase(phase);
			timer = setTimeout(() => {
				index = (index + 1) % IDLE_BLINK_SEQUENCE.length;
				step();
			}, holdMs);
		};
		step();

		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	}, [state]);

	const style = { '--assistant-mascot-size': `${size}px` } as CSSProperties;

	/** RENDER **/
	return (
		<div className={[styles.MascotRoot, className].filter(Boolean).join(' ')} data-state={state} style={style} aria-hidden="true">
			<img
				className={styles.MascotImage}
				src={getMascotImageSrc(state, blinkPhase)}
				alt=""
				draggable={false}
			/>
		</div>
	);
}
