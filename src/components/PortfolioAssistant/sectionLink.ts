/**
 * familiar-js's FamiliarSource only carries { title, url } — no sectionId —
 * so a CV-section citation is encoded as a fake internal URL and decoded
 * back out by a click listener in PortfolioAssistant.tsx, which calls
 * scrollToCvSection instead of letting the browser navigate there.
 */
const SECTION_LINK_PREFIX = '/CV#assistant-section:';

export function toSectionLink(sectionId: string): string {
	return `${SECTION_LINK_PREFIX}${sectionId}`;
}

export function sectionIdFromLink(href: string): string | null {
	return href.startsWith(SECTION_LINK_PREFIX) ? href.slice(SECTION_LINK_PREFIX.length) : null;
}
