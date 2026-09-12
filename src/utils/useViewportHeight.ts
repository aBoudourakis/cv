import { useEffect } from 'react';

/**
 * Keeps a `--app-vh` custom property on the document root in sync with the
 * true visible viewport height (via the visualViewport API where available).
 *
 * Exists because `100dvh` alone isn't reliably recomputed by every mobile
 * browser as a collapsible browser-chrome toolbar shows/hides on scroll —
 * Chrome on iOS in particular layers its own toolbar behaviour on top of
 * shared WebKit viewport handling, which can leave `100dvh`-sized layouts
 * shorter than the actual visible area (a gap of raw page background below
 * the footer, with fixed-position elements like the assistant launcher
 * appearing to float in it). `layouts.module.scss` prefers this value over
 * `100dvh` when it's been set; `100dvh`/`100vh` remain the fallback for the
 * brief moment before this effect's first run, and for browsers without
 * the visualViewport API at all.
 */
export function useViewportHeight(): void {
	useEffect(() => {
		const root = document.documentElement;

		const setVh = () => {
			const height = window.visualViewport?.height ?? window.innerHeight;
			root.style.setProperty('--app-vh', `${height}px`);
		};

		setVh();
		window.visualViewport?.addEventListener('resize', setVh);
		window.addEventListener('resize', setVh);

		return () => {
			window.visualViewport?.removeEventListener('resize', setVh);
			window.removeEventListener('resize', setVh);
		};
	}, []);
}
