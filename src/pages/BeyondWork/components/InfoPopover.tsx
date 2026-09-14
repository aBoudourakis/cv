import {useEffect, useId, useMemo, useRef, useState} from 'react';
import type {FocusEvent, MouseEvent as ReactMouseEvent} from 'react';
import styles from './InfoPopover.module.scss';
import {InfoIcon} from 'src/components/core/Icons/Icons.tsx';
import type {InterestActivityMore, InterestActivityMoreItem} from '../values';

/** Grace period before a hover-triggered close actually fires, so moving the
 *  pointer from the info button into the popover doesn't flicker it shut. */
const HOVER_CLOSE_DELAY_MS = 150;

/**
 * Distinguishes the structured `InterestActivityMoreItem[]` form of `more`
 * from plain text/a custom ReactNode — both of the latter render fine as-is
 * via `{more}` (React handles strings/elements/node-arrays natively), so
 * this is the one case that needs telling apart before rendering.
 */
function isMoreItemList(value: unknown): value is InterestActivityMoreItem[] {
	return Array.isArray(value) && value.every((item) => (
		typeof item === 'object' && item !== null && typeof (item as Record<string, unknown>).title === 'string'
	));
}

function hasMoreContent(more: InterestActivityMore | undefined): boolean {
	if (more === undefined || more === null || more === '') return false;
	if (Array.isArray(more)) return more.length > 0;
	return true;
}

interface InfoPopoverProps {
	/** Used to build the trigger's accessible label ("More information about {label}") and the popover's own aria-label. */
	label: string;
	more: InterestActivityMore | undefined;
}

/**
 * A small "(i)" trigger that reveals extra detail — text, a structured item
 * list, or custom ReactNode — in a lightweight popover. Originally built for
 * "Interests & Activities" entries (see InterestActivityItem.tsx) and reused
 * as-is next to the "Music & Composition" heading for its authorship/AI
 * notice (see BeyondWork.tsx) — anywhere a `more`-shaped value needs an
 * optional, on-demand disclosure next to a title.
 *
 * Renders nothing when `more` is empty, so callers don't need to gate this
 * themselves — matches "no icon for entries without extra detail".
 */
export default function InfoPopover({label, more}: InfoPopoverProps) {
	const [isOpen, setIsOpen] = useState(false);
	const wrapperRef = useRef<HTMLSpanElement | null>(null);
	const triggerRef = useRef<HTMLButtonElement | null>(null);
	const closeTimerRef = useRef<number | undefined>(undefined);
	const popoverId = useId();

	/** Hover-to-open is only wired up on pointer-capable desktops — on touch, only tapping opens it, avoiding "ghost hover" flicker from synthetic mouse events. */
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

	/** Outside click/tap and Escape both close the popover while it's open — not just hover-out, so it never depends on hover alone. */
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

	/** Clear any pending hover-close timer if the component unmounts mid-delay. */
	useEffect(() => () => cancelScheduledClose(), []);

	if (!hasMoreContent(more)) return null;

	/**
	 * On a hover-capable device, a real mouse click is always preceded by the
	 * same gesture's `mouseenter` (which already opened it) — toggling here
	 * too would immediately close what hover just opened. `event.detail === 0`
	 * reliably identifies a keyboard-triggered click (Enter/Space), where no
	 * hover happened, so that case still toggles normally; touch devices
	 * (no hover wired up at all) always toggle too.
	 */
	const handleTriggerClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
		cancelScheduledClose();
		const isKeyboardActivation = event.detail === 0;
		if (supportsHover && !isKeyboardActivation) {
			setIsOpen(true);
		} else {
			setIsOpen((open) => !open);
		}
	};

	/** Closing on blur-out-of-wrapper covers keyboard users tabbing away without pressing Escape. */
	const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
		if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
			setIsOpen(false);
		}
	};

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
				className={styles.Trigger}
				aria-label={`More information about ${label}`}
				aria-haspopup="dialog"
				aria-expanded={isOpen}
				aria-controls={popoverId}
				onClick={handleTriggerClick}
			>
				<InfoIcon/>
			</button>

			{isOpen && (
				<div
					id={popoverId}
					role="dialog"
					aria-label={`${label} details`}
					className={styles.Popover}
				>
					<MoreContent more={more}/>
				</div>
			)}
		</span>
	);
}

/** Renders whichever form `more` takes: a structured item list gets its own compact layout; text/ReactNode content passes straight through. */
export function MoreContent({more}: {more: InterestActivityMore | undefined}) {
	if (isMoreItemList(more)) {
		return (
			<ul className={styles.MoreList}>
				{more.map((item) => (
					<li className={styles.MoreItem} key={item.title}>
						<span className={styles.MoreItemTitle}>{item.title}</span>
						{item.description && <span className={styles.MoreItemDescription}>{item.description}</span>}
					</li>
				))}
			</ul>
		);
	}

	return <div className={styles.MoreText}>{more}</div>;
}
