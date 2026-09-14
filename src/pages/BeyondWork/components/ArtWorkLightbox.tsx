import {useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import type {MouseEvent as ReactMouseEvent} from 'react';
import styles from './ArtWorkLightbox.module.scss';
import {CloseIcon} from 'src/components/core/Icons/Icons.tsx';
import type {ArtWorkItem} from '../values';

const FOCUSABLE_SELECTOR = 'button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])';

/**
 * DesktopLayout's own content region (see desktopLayout.tsx) — the page area
 * between the sticky nav and footer. Portaling here rather than rendering
 * in place sidesteps two problems at once: it escapes BeyondWork's own
 * `.Content` element, whose page-entrance animation leaves it with a
 * non-`none` `transform` (animation-fill-mode: both holds the final
 * keyframe), which creates a CSS containing block that would otherwise clip
 * a `position: absolute`/`fixed` descendant to that narrow reading column;
 * and it lets the backdrop span the full nav-to-footer area (this same id)
 * rather than just the ~740px text column, without covering the nav/footer
 * themselves.
 */
const PORTAL_TARGET_ID = 'app-content-region';

interface ArtWorkLightboxProps {
	item: ArtWorkItem;
	onClose: () => void;
}

/**
 * Full-size view of one artwork, opened from ArtWork.tsx's thumbnail grid.
 * A real modal (unlike the small InfoPopover elsewhere on this page): dimmed
 * backdrop, focus trapped inside while open, Escape or a backdrop click
 * closes it, and focus returns to whichever thumbnail opened it — mirrors
 * the focus-trap/Escape convention already used by the portfolio assistant
 * panel (see AssistantPanel.tsx) for a non-modal-but-focus-managed surface.
 */
export default function ArtWorkLightbox({item, onClose}: ArtWorkLightboxProps) {
	const dialogRef = useRef<HTMLDivElement | null>(null);
	const closeButtonRef = useRef<HTMLButtonElement | null>(null);
	const previouslyFocusedRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
		closeButtonRef.current?.focus();

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
				return;
			}
			if (event.key !== 'Tab') return;

			const dialog = dialogRef.current;
			if (!dialog) return;
			const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
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

		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			previouslyFocusedRef.current?.focus();
		};
	}, [onClose]);

	/** Closing on a direct backdrop click — clicks that bubble up from inside the dialog itself don't match `currentTarget`. */
	const handleBackdropClick = (event: ReactMouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) onClose();
	};

	const portalTarget = document.getElementById(PORTAL_TARGET_ID) ?? document.body;

	return createPortal(
		<div className={styles.Backdrop} onMouseDown={handleBackdropClick}>
			<div
				ref={dialogRef}
				className={styles.Dialog}
				role="dialog"
				aria-modal="true"
				aria-label={item.title}
			>
				<button
					ref={closeButtonRef}
					type="button"
					className={styles.CloseButton}
					aria-label="Close"
					onClick={onClose}
				>
					<CloseIcon/>
				</button>

				<div className={styles.ImageWrap}>
					<img className={styles.Image} src={item.file} alt={item.title}/>
				</div>
				<p className={styles.Caption}>{item.title}</p>
			</div>
		</div>,
		portalTarget
	);
}
