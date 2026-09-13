import { afterEach, describe, expect, it, vi } from 'vitest';
import {
	assistantKnowledgeChunkId,
	fetchAssistantKnowledgeRows,
	toAssistantChunk,
	type AssistantKnowledgeRow,
} from '../assistantKnowledge.ts';

function row(overrides: Partial<AssistantKnowledgeRow> = {}): AssistantKnowledgeRow {
	return {
		id: 'row-id-1',
		slug: 'working-style',
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

function jsonResponse(body: unknown, ok = true, status = 200) {
	return { ok, status, json: async () => body, text: async () => JSON.stringify(body) } as Response;
}

describe('toAssistantChunk', () => {
	it('maps category, priority, title and content straight through', () => {
		const chunk = toAssistantChunk(row());

		expect(chunk.category).toBe('working-style');
		expect(chunk.priority).toBe(2);
		expect(chunk.title).toBe('Engineering Working Style');
		expect(chunk.content).toBe('He values ownership and maintainability.');
	});

	it('marks the chunk visibility as assistant_only', () => {
		expect(toAssistantChunk(row()).visibility).toBe('assistant_only');
	});

	it('namespaces the chunk id with "knowledge-" so it cannot collide with a public CV chunk id', () => {
		const chunk = toAssistantChunk(row({ slug: 'profile' }));
		expect(chunk.id).toBe('knowledge-profile');
		expect(chunk.id).toBe(assistantKnowledgeChunkId('profile'));
	});

	it('never sets a sourceUrl or sectionId — assistant-only sources get no fabricated link', () => {
		const chunk = toAssistantChunk(row());
		expect(chunk.sourceUrl).toBeUndefined();
		expect(chunk.sectionId).toBeUndefined();
	});

	it('uses source_label as the friendly source, falling back to undefined when absent', () => {
		expect(toAssistantChunk(row({ source_label: 'Working Style' })).source).toBe('Working Style');
		expect(toAssistantChunk(row({ source_label: null })).source).toBeUndefined();
	});

	it('clamps an out-of-range priority to 1 rather than propagating bad data', () => {
		// @ts-expect-error -- intentionally malformed input to test the guard
		expect(toAssistantChunk(row({ priority: 99 })).priority).toBe(1);
	});
});

describe('fetchAssistantKnowledgeRows', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('requests only enabled rows and returns them as-is', async () => {
		const rows = [row()];
		const fetchMock = vi.fn().mockResolvedValue(jsonResponse(rows));
		vi.stubGlobal('fetch', fetchMock);

		const result = await fetchAssistantKnowledgeRows('https://example.supabase.co', 'service-role-key');

		expect(result).toEqual(rows);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toContain('/rest/v1/assistant_knowledge');
		expect(url).toContain('enabled=eq.true');
		expect((init.headers as Record<string, string>).apikey).toBe('service-role-key');
	});

	it('throws with the response body when the request fails', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ message: 'nope' }, false, 500)));

		await expect(fetchAssistantKnowledgeRows('https://example.supabase.co', 'key')).rejects.toThrow(/500/);
	});
});
