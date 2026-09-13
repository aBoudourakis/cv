import { describe, expect, it } from 'vitest';
import { buildChunks } from '../chunk.ts';
import { toAssistantChunk, type AssistantKnowledgeRow } from '../assistantKnowledge.ts';

/**
 * Covers the actual merge rag/ingest.ts performs (public CV chunks +
 * assistant_knowledge chunks feeding the same portfolio_documents table)
 * without needing a live Supabase connection — the assistant rows are
 * supplied directly rather than fetched.
 */
function assistantRow(overrides: Partial<AssistantKnowledgeRow> = {}): AssistantKnowledgeRow {
	return {
		id: 'id-1',
		slug: 'engineering-working-style',
		title: 'Engineering Working Style',
		content: 'He values ownership and maintainability.',
		category: 'working-style',
		source_label: 'Working Style',
		priority: 2,
		metadata: {},
		enabled: true,
		...overrides,
	};
}

describe('merging public CV chunks with assistant_knowledge chunks', () => {
	it('produces no id collisions between the two sources', () => {
		const publicChunks = buildChunks();
		const assistantChunks = [assistantRow(), assistantRow({ id: 'id-2', slug: 'career-direction', title: 'Career Direction' })].map(
			toAssistantChunk,
		);

		const ids = [...publicChunks, ...assistantChunks].map((chunk) => chunk.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('keeps public chunks defaulting to visibility undefined (ingest.ts treats that as "public")', () => {
		const publicChunks = buildChunks();
		expect(publicChunks.every((chunk) => chunk.visibility === undefined)).toBe(true);
	});

	it('tags every assistant_knowledge-derived chunk as assistant_only', () => {
		const assistantChunks = [assistantRow()].map(toAssistantChunk);
		expect(assistantChunks.every((chunk) => chunk.visibility === 'assistant_only')).toBe(true);
	});

	it('preserves each assistant chunk\'s category rather than collapsing it into a public CV category', () => {
		const chunk = toAssistantChunk(assistantRow({ category: 'ai-rag' }));
		expect(chunk.category).toBe('ai-rag');
	});
});
