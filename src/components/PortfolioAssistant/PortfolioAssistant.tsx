import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './familiar-theme.scss';
import {
	ASSISTANT_DISCLOSURE,
	ASSISTANT_INTRO,
	ASSISTANT_SUBTITLE,
	ASSISTANT_TITLE,
	MAX_CONVERSATION_MESSAGES,
	SUGGESTED_QUESTIONS,
} from './constants.ts';
import { PortfolioChatTransport } from './portfolioTransport.ts';
import { scrollToCvSection } from './scrollToCvSection.ts';
import { sectionIdFromLink } from './sectionLink.ts';

const MASCOT_BASE = '/images/Clip/wizard';

/**
 * Mounts the familiar-js assistant widget — a self-contained DOM class, not
 * a React tree — into a ref'd container, and tears it down on unmount.
 */
export default function PortfolioAssistant() {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const navigate = useNavigate();
	// familiar-js's click listener is attached once at mount; a ref keeps it
	// calling the latest `navigate` from react-router without re-mounting the widget.
	const navigateRef = useRef(navigate);
	navigateRef.current = navigate;

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		let assistant: import('familiar-js').FamiliarAssistant | undefined;
		let cancelled = false;

		// familiar-js's own bundle inlines all four mascot presets' artwork as
		// base64 (~900KB gzipped) even though every state below is overridden —
		// deferred so that dead weight never sits in the app's main chunk.
		void Promise.all([import('familiar-js'), import('familiar-js/styles.css')]).then(([{ FamiliarAssistant, AssistantTransportError }]) => {
			if (cancelled) return;

			assistant = new FamiliarAssistant({
				container,
				transport: new PortfolioChatTransport(AssistantTransportError),
				title: ASSISTANT_TITLE,
				subtitle: ASSISTANT_SUBTITLE,
				greeting: ASSISTANT_INTRO,
				disclosure: ASSISTANT_DISCLOSURE,
				suggestions: SUGGESTED_QUESTIONS,
				historyLimit: MAX_CONVERSATION_MESSAGES,
				// Pinned rather than 'auto': familiar-js's own dark/auto variants are
				// selected via an attribute selector ([data-familiar-theme=...]),
				// which out-specificities familiar-theme.scss's plain .familiar-assistant
				// override — pinning 'light' keeps familiar-js on its base (attribute-less)
				// rule so our site-palette mapping (which already tracks body.dark-mode
				// on its own) is the only thing setting these variables.
				theme: 'light',
				mascot: 'Clip',
				mascotAssets: {
					idle: `${MASCOT_BASE}/idle.webp`,
					hover: `${MASCOT_BASE}/hover.webp`,
					thinking: `${MASCOT_BASE}/thinking.webp`,
					open: `${MASCOT_BASE}/focused.webp`,
					// No dedicated error frame exists yet — idle reads better than a mismatched built-in fallback.
					error: `${MASCOT_BASE}/idle.webp`,
					eyesClosing: `${MASCOT_BASE}/closing.webp`,
					eyesClosed: `${MASCOT_BASE}/closed.webp`,
				},
				mascotPicker: false,
			});
		});

		// familiar-js's FamiliarSource only carries { title, url }, so CV-section
		// citations are encoded as fake internal links (see sectionLink.ts) and
		// decoded back here, and plain internal paths get client-side routing
		// instead of a full page navigation.
		function handleClick(event: MouseEvent) {
			const anchor = (event.target as HTMLElement | null)?.closest('a.familiar-sources__link');
			const href = anchor?.getAttribute('href');
			if (!href) return;

			const sectionId = sectionIdFromLink(href);
			if (sectionId) {
				event.preventDefault();
				scrollToCvSection(sectionId, navigateRef.current);
				return;
			}

			if (href.startsWith('/')) {
				event.preventDefault();
				navigateRef.current(href);
			}
		}

		container.addEventListener('click', handleClick);

		return () => {
			cancelled = true;
			container.removeEventListener('click', handleClick);
			assistant?.destroy();
		};
	}, []);

	return <div className="portfolio-assistant-mount" ref={containerRef} />;
}
