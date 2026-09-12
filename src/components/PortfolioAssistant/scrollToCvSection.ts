/**
 * Navigates to a CV section anchor from anywhere in the app (the assistant
 * panel is mounted at the app root, so a source can be cited while the
 * visitor is on the Portfolio page, not just the CV page).
 *
 * CVContent.tsx renders each section with a real DOM id (e.g. "cv-experience"),
 * so once the CV route is mounted, a plain scrollIntoView is enough — no need
 * to reach into CVContent's own ref map.
 */
export function scrollToCvSection(sectionId: string, navigate: (path: string) => void): void {
	const prefersReducedMotion =
		typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	const scrollNow = () => {
		document.getElementById(sectionId)?.scrollIntoView({
			behavior: prefersReducedMotion ? 'auto' : 'smooth',
			block: 'start',
		});
	};

	if (window.location.pathname.toLowerCase() === '/cv') {
		scrollNow();
		return;
	}

	navigate('/CV');
	// The CV route mounts on the next render(s) — wait a couple of frames
	// rather than guessing a fixed timeout.
	requestAnimationFrame(() => requestAnimationFrame(scrollNow));
}
