import type { FamiliarSource } from 'familiar-js';
import { formatCategory } from './formatCategory.ts';
import { toSectionLink } from './sectionLink.ts';
import type { PortfolioSource } from './types.ts';

/**
 * Maps a PortfolioSource (the Edge Function's richer citation shape) onto
 * familiar-js's FamiliarSource ({ title, url? }). A source is only ever made
 * clickable when it carries a route/section the app actually has — never
 * fabricated (docs/Clip_bot_specification.md #12).
 */
export function toFamiliarSource(source: PortfolioSource): FamiliarSource {
	const label = `${formatCategory(source.category)} · ${source.title}`;
	const url = source.url?.startsWith('/') ? source.url : source.sectionId ? toSectionLink(source.sectionId) : source.url;
	return { title: label, url };
}
