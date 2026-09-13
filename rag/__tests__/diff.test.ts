import { describe, expect, it } from 'vitest';
import { diffChunks, hashContent } from '../diff.ts';
import type { PortfolioChunk } from '../types.ts';

function chunk(overrides: Partial<PortfolioChunk> & Pick<PortfolioChunk, 'id' | 'content'>): PortfolioChunk {
	return { category: 'profile', title: 'Title', ...overrides };
}

describe('hashContent', () => {
	it('is deterministic for the same content', () => {
		expect(hashContent('hello world')).toBe(hashContent('hello world'));
	});

	it('changes when content changes', () => {
		expect(hashContent('hello world')).not.toBe(hashContent('hello there'));
	});
});

describe('diffChunks', () => {
	it('treats a chunk as unchanged when its content hash matches the existing row (no re-embedding)', () => {
		const c = chunk({ id: 'profile', content: 'Same content.' });
		const { unchanged, changed } = diffChunks([c], [{ id: 'profile', content_hash: hashContent('Same content.') }]);

		expect(unchanged).toEqual([c]);
		expect(changed).toEqual([]);
	});

	it('treats a chunk as changed when its content differs from the existing row (triggers re-embedding)', () => {
		const c = chunk({ id: 'profile', content: 'New content.' });
		const { unchanged, changed } = diffChunks([c], [{ id: 'profile', content_hash: hashContent('Old content.') }]);

		expect(unchanged).toEqual([]);
		expect(changed).toEqual([{ chunk: c, hash: hashContent('New content.') }]);
	});

	it('treats a chunk with no existing row as changed (new chunk)', () => {
		const c = chunk({ id: 'new-chunk', content: 'Brand new.' });
		const { changed } = diffChunks([c], []);

		expect(changed).toEqual([{ chunk: c, hash: hashContent('Brand new.') }]);
	});

	it('marks existing rows no longer produced by the current chunk set for deletion', () => {
		const c = chunk({ id: 'still-here', content: 'Kept.' });
		const { idsToDelete } = diffChunks(
			[c],
			[
				{ id: 'still-here', content_hash: hashContent('Kept.') },
				{ id: 'gone-now', content_hash: 'irrelevant' },
			],
		);

		expect(idsToDelete).toEqual(['gone-now']);
	});

	it('handles a mix of public and assistant-only chunks together', () => {
		const publicChunk = chunk({ id: 'profile', content: 'Public profile.' });
		const assistantChunk = chunk({
			id: 'knowledge-working-style',
			content: 'Curated working style.',
			category: 'working-style',
			visibility: 'assistant_only',
			priority: 2,
		});

		const { unchanged, changed, idsToDelete } = diffChunks(
			[publicChunk, assistantChunk],
			[{ id: 'profile', content_hash: hashContent('Public profile.') }],
		);

		expect(unchanged).toEqual([publicChunk]);
		expect(changed).toEqual([{ chunk: assistantChunk, hash: hashContent('Curated working style.') }]);
		expect(idsToDelete).toEqual([]);
	});
});
