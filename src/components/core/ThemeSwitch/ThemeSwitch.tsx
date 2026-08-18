import './theme-switch.scss';
import { useState } from 'react';

export default function ThemeSwitch() {
	/** PRES **/
	const [isDarkMode, setIsDarkMode] = useState(() =>
		document.body.classList.contains('dark-mode')
	);

	/** CONSTS **/

	/**
	 * Toggle theme between light and dark mode by adding/removing the 'dark-mode' class to the body element.
	 */
	const toggleSwitch = () => {
		const body = document.body;
		const nextIsDarkMode = !isDarkMode;
		body.classList.toggle('dark-mode', nextIsDarkMode);
		setIsDarkMode(nextIsDarkMode);
	}

	/** RENDER  **/
	return (
		<div className="theme-switch">
			<button
				type="button"
				className="theme-switch-button"
				onClick={toggleSwitch}
				aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
				title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
			>
				{isDarkMode ? (
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<circle cx="12" cy="12" r="4" />
						<path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
					</svg>
				) : (
					<svg viewBox="0 0 24 24" aria-hidden="true">
						<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
					</svg>
				)}
			</button>
		</div>
	);
}