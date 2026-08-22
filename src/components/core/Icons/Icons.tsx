/**
 * Minimal, dependency-free inline icon set shared by CV entries to give a
 * subtle, consistent affordance to external "proof of work" links (project
 * links, videos, certificates) without turning every entry into a card.
 */
export function ExternalLinkIcon() {
	return (
		<svg
			className="ab-icon ab-icon--external"
			viewBox="0 0 24 24"
			aria-hidden="true"
			focusable="false"
		>
			<path
				d="M14 5h5v5m0-5L10 14M9 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.6"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export function PlayIcon() {
	return (
		<svg
			className="ab-icon ab-icon--play"
			viewBox="0 0 24 24"
			aria-hidden="true"
			focusable="false"
		>
			<path d="M8 5v14l11-7-11-7z" fill="currentColor" />
		</svg>
	);
}
