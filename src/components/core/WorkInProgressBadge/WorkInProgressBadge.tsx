import {useEffect, useId, useLayoutEffect, useMemo, useRef, useState} from 'react';
import type {FocusEvent, MouseEvent as ReactMouseEvent, RefObject} from 'react';
import styles from './WorkInProgressBadge.module.scss';

/** Grace period before a hover-triggered close actually fires, so moving the
 *  pointer from the badge into the tooltip doesn't flicker it shut. */
const HOVER_CLOSE_DELAY_MS = 150;

/** Centralized copy — reused for every WorkInProgressBadge instance so the
 *  explanation never has to be duplicated per call site. */
export const WORK_IN_PROGRESS_MESSAGE =
	'This page is a work in progress and is likely to evolve with future changes, additions, and refinements.';

export type WorkInProgressBadgeVariant = 'short' | 'long';

interface WorkInProgressBadgeProps {
	/** 'short' renders "WIP", 'long' renders "Work in progress" (visually uppercased to match the site's eyebrow treatment). */
	variant?: WorkInProgressBadgeVariant;
	/** Accessible name for the trigger — e.g. "Beyond Work status: Work in Progress". */
	label?: string;
	/** Which edge of the trigger the tooltip's own edge anchors to. 'start' (default) suits a badge with room to its right (e.g. the hero eyebrow); 'end' suits one sitting near the right edge of its container (e.g. the nav), so the tooltip opens leftward instead of overflowing the viewport. */
	align?: 'start' | 'end';
	/** If the tooltip's default position would overlap this element, it drops down to open just below it instead — e.g. the hero's <h1>, which otherwise sits too close beneath the badge for a multi-line tooltip to clear. Left unset (as in the nav), the tooltip just uses its default position. */
	avoidElementRef?: RefObject<HTMLElement | null>;
	className?: string;
}

/**
 * A small, muted status marker with a tooltip explaining what it means —
 * used next to "Beyond Work" in the main nav (see NavBar.tsx) and beside
 * the Beyond Work hero eyebrow (see BeyondWork.tsx). Lives in core/ rather
 * than pages/BeyondWork/components/ since the nav usage needs it with no
 * dependency on that page's own data model.
 *
 * A genuine ARIA tooltip (role="tooltip" + aria-describedby) rather than a
 * dialog-style popover like InfoPopover.tsx — its content is always the
 * same short, non-interactive sentence, which is exactly what the tooltip
 * pattern is for. It still needs to be reachable on touch (a pure
 * hover-only tooltip isn't touch-accessible), so the trigger is a real
 * <button> that also toggles open on click/tap; hover-to-open and
 * focus-to-open are both gated behind hover-capability detection to avoid
 * a tap on touch firing both a synthetic focus and a click in the same
 * gesture, which would immediately reopen-then-close it.
 */
export default function WorkInProgressBadge({
	variant = 'short',
	label = 'Beyond Work status: Work in Progress',
	align = 'start',
	avoidElementRef,
	className,
}: WorkInProgressBadgeProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [pushDownBy, setPushDownBy] = useState<number | null>(null);
	const wrapperRef = useRef<HTMLSpanElement | null>(null);
	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const tooltipRef = useRef<HTMLSpanElement | null>(null);
	const closeTimerRef = useRef<number | undefined>(undefined);
	const tooltipId = useId();

	/** Measured once per open, against the tooltip's own default (CSS) position —
	 *  if it would overlap `avoidElementRef`, push it down to clear that element's
	 *  bottom edge instead. Runs before paint so there's no visible jump. */
	useLayoutEffect(() => {
		if (!isOpen || !avoidElementRef?.current || !tooltipRef.current || !wrapperRef.current) {
			setPushDownBy(null);
			return;
		}

		const tooltipRect = tooltipRef.current.getBoundingClientRect();
		const avoidRect = avoidElementRef.current.getBoundingClientRect();
		const overlaps = !(
			tooltipRect.bottom <= avoidRect.top ||
			tooltipRect.top >= avoidRect.bottom ||
			tooltipRect.right <= avoidRect.left ||
			tooltipRect.left >= avoidRect.right
		);

		if (!overlaps) {
			setPushDownBy(null);
			return;
		}

		const wrapperRect = wrapperRef.current.getBoundingClientRect();
		setPushDownBy(avoidRect.bottom + 8 - wrapperRect.top);
	}, [isOpen, avoidElementRef]);

	const supportsHover = useMemo(
		() => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
		[]
	);

	const cancelScheduledClose = () => {
		if (closeTimerRef.current !== undefined) {
			window.clearTimeout(closeTimerRef.current);
			closeTimerRef.current = undefined;
		}
	};

	const openNow = () => {
		cancelScheduledClose();
		setIsOpen(true);
	};

	const scheduleClose = () => {
		cancelScheduledClose();
		closeTimerRef.current = window.setTimeout(() => setIsOpen(false), HOVER_CLOSE_DELAY_MS);
	};

	/** Outside click/tap and Escape both close the tooltip while it's open. */
	useEffect(() => {
		if (!isOpen) return;

		const handlePointerDown = (event: MouseEvent) => {
			if (!wrapperRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false);
				triggerRef.current?.focus();
			}
		};

		document.addEventListener('mousedown', handlePointerDown);
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('mousedown', handlePointerDown);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen]);

	useEffect(() => () => cancelScheduledClose(), []);

	/** Same hover-then-click race guard as InfoPopover: on a hover-capable
	 *  device, a real mouse click always follows the same gesture's
	 *  mouseenter (which already opened it), so a click there just ensures
	 *  it's open rather than toggling it shut; keyboard activation
	 *  (detail === 0) and touch (no hover wired up at all) still toggle. */
	const handleTriggerClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
		cancelScheduledClose();
		const isKeyboardActivation = event.detail === 0;
		if (supportsHover && !isKeyboardActivation) {
			setIsOpen(true);
		} else {
			setIsOpen((open) => !open);
		}
	};

	/** Closing on blur-out-of-wrapper covers keyboard users tabbing away. */
	const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
		if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
			setIsOpen(false);
		}
	};

	const badgeClassName = [styles.Badge, variant === 'long' ? styles.BadgeLong : '', className]
		.filter(Boolean)
		.join(' ');

	return (
		<span
			ref={wrapperRef}
			className={styles.Wrapper}
			onMouseEnter={supportsHover ? openNow : undefined}
			onMouseLeave={supportsHover ? scheduleClose : undefined}
			onBlur={handleBlur}
		>
			<button
				ref={triggerRef}
				type="button"
				className={badgeClassName}
				aria-label={label}
				aria-describedby={tooltipId}
				onClick={handleTriggerClick}
				onFocus={supportsHover ? openNow : undefined}
			>
				{variant === 'long' ? 'Work in progress' : 'WIP'}
			</button>

			{isOpen && (
				<span
					ref={tooltipRef}
					id={tooltipId}
					role="tooltip"
					className={`${styles.Tooltip} ${align === 'end' ? styles.TooltipAlignEnd : ''}`}
					style={pushDownBy !== null ? {top: pushDownBy} : undefined}
				>
					{WORK_IN_PROGRESS_MESSAGE}
				</span>
			)}
		</span>
	);
}
