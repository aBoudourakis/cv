import { describe, expect, it } from 'vitest';
import { toFamiliarSource } from '../toFamiliarSource.ts';
import { sectionIdFromLink } from '../sectionLink.ts';

describe('toFamiliarSource', () => {
	it('leaves an assistant-only source (no url, no sectionId) without a url, so familiar-js renders it as plain text', () => {
		const result = toFamiliarSource({
			id: 'knowledge-engineering-working-style',
			title: 'Engineering Working Style',
			category: 'working-style',
			source: 'Working Style',
		});
		expect(result).toEqual({ title: 'Working Style · Engineering Working Style', url: undefined });
	});

	it('formats known assistant-only categories with friendly labels', () => {
		const result = toFamiliarSource({ id: 'k1', title: 'AI, RAG and AI-Assisted Development', category: 'ai-rag' });
		expect(result.title).toBe('AI & RAG · AI, RAG and AI-Assisted Development');
	});

	it('falls back to a Title Case label for an unmapped kebab-case category', () => {
		const result = toFamiliarSource({ id: 'k2', title: 'Some Entry', category: 'some-future-category' });
		expect(result.title).toBe('Some Future Category · Some Entry');
	});

	it('passes an internal path url through unchanged', () => {
		const result = toFamiliarSource({ id: 'project-covid', title: 'COVID-19 Initiative', category: 'project', url: '/covid-shield-cyprus' });
		expect(result).toEqual({ title: 'Projects · COVID-19 Initiative', url: '/covid-shield-cyprus' });
	});

	it('encodes a sectionId as a decodable internal link when there is no url', () => {
		const result = toFamiliarSource({ id: 'experience-dealio', title: 'Dealio', category: 'experience', sectionId: 'cv-experience' });
		expect(result.url).toBeDefined();
		expect(sectionIdFromLink(result.url!)).toBe('cv-experience');
	});

	it('prefers an internal path url over sectionId when both are present', () => {
		const result = toFamiliarSource({ id: 'x', title: 'X', category: 'project', url: '/x', sectionId: 'cv-x' });
		expect(result.url).toBe('/x');
	});

	it('passes an external url through unchanged', () => {
		const result = toFamiliarSource({ id: 'ext', title: 'External Ref', category: 'award', url: 'https://example.com/award' });
		expect(result.url).toBe('https://example.com/award');
	});
});
