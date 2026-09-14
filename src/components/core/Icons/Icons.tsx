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

/** Used by the Beyond Work music player's play/pause control (see MusicWorkCard.tsx). */
export function PauseIcon() {
	return (
		<svg
			className="ab-icon ab-icon--pause"
			viewBox="0 0 24 24"
			aria-hidden="true"
			focusable="false"
		>
			<path d="M7 5h3v14H7zm7 0h3v14h-3z" fill="currentColor" />
		</svg>
	);
}

/** Used by the Beyond Work "Interests & Activities" info control (see InterestActivityItem.tsx). */
export function InfoIcon() {
	return (
		<svg
			className="ab-icon ab-icon--info"
			viewBox="0 0 24 24"
			aria-hidden="true"
			focusable="false"
		>
			<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
			<line x1="12" y1="11" x2="12" y2="16.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
			<circle cx="12" cy="7.75" r="1.15" fill="currentColor" />
		</svg>
	);
}

/** Used by the Beyond Work Art & Design lightbox's close control (see ArtWorkLightbox.tsx). */
export function CloseIcon() {
	return (
		<svg
			className="ab-icon ab-icon--close"
			viewBox="0 0 24 24"
			aria-hidden="true"
			focusable="false"
		>
			<path
				d="M6 6l12 12M18 6L6 18"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	);
}

/** A single quiet spinner arc, rotated via CSS — used while a music sample is loading. */
export function LoadingIcon() {
	return (
		<svg
			className="ab-icon ab-icon--loading"
			viewBox="0 0 24 24"
			aria-hidden="true"
			focusable="false"
		>
			<path
				d="M12 3a9 9 0 1 0 9 9"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</svg>
	);
}
