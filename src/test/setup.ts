import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// @testing-library/react's automatic afterEach(cleanup) only registers
// itself when it detects a global `afterEach` — this project's vitest.config
// doesn't enable `test.globals`, so it's wired up explicitly here instead.
afterEach(() => cleanup());

// jsdom doesn't implement matchMedia — several components query
// `prefers-reduced-motion` directly (ClipMascot/CVContent/NavBar).
if (!window.matchMedia) {
	window.matchMedia = (query: string) =>
		({
			matches: false,
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		}) as unknown as MediaQueryList;
}

// jsdom doesn't implement scrollIntoView either (used by AssistantSources'
// scroll-to-CV-section behaviour and CVContent).
if (!Element.prototype.scrollIntoView) {
	Element.prototype.scrollIntoView = () => {};
}
