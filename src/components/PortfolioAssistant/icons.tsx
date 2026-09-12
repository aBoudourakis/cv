/**
 * Minimal, dependency-free inline icons scoped to the portfolio assistant —
 * follows the same convention as src/components/core/Icons/Icons.tsx, kept
 * separate since these are specific to the assistant panel's chrome.
 */

export function CloseIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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

export function SendIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
			<path
				d="M4 12l16-8-6 8 6 8-16-8z"
				fill="currentColor"
			/>
		</svg>
	);
}

export function ErrorIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
			<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
			<path d="M12 7v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
			<circle cx="12" cy="16.2" r="1" fill="currentColor" />
		</svg>
	);
}
