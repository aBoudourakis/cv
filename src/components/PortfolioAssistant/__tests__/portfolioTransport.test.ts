import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AssistantTransportError } from 'familiar-js';
import { PortfolioChatTransport } from '../portfolioTransport.ts';

function jsonResponse(body: unknown, ok = true, status = 200) {
	return { ok, status, json: async () => body } as Response;
}

describe('PortfolioChatTransport', () => {
	beforeEach(() => {
		vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
		vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');
		vi.stubGlobal('fetch', vi.fn());
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
	});

	it('posts the question/conversation with Supabase auth headers and a turnstile placeholder', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ answer: 'Hi', sources: [], requestId: 'r1' }));

		await new PortfolioChatTransport(AssistantTransportError).send({ question: 'Hello?', conversation: [] });

		const [url, init] = vi.mocked(fetch).mock.calls[0];
		expect(url).toBe('https://example.supabase.co/functions/v1/portfolio-chat');
		expect(init?.headers).toMatchObject({ apikey: 'test-anon-key', Authorization: 'Bearer test-anon-key' });
		const body = JSON.parse(init!.body as string);
		expect(body.question).toBe('Hello?');
		expect(typeof body.turnstileToken).toBe('string');
		expect(body.turnstileToken.length).toBeGreaterThan(0);
	});

	it('maps a successful response into familiar-js sources', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(
			jsonResponse({
				answer: 'He has built several React interfaces.',
				sources: [{ id: 's1', title: 'Dealio', category: 'experience', sectionId: 'cv-experience' }],
				requestId: 'r1',
			}),
		);

		const result = await new PortfolioChatTransport(AssistantTransportError).send({ question: 'React?', conversation: [] });

		expect(result.answer).toBe('He has built several React interfaces.');
		expect(result.sources?.[0].title).toBe('Experience · Dealio');
	});

	it('throws a rate-limit AssistantTransportError on a 429', async () => {
		vi.mocked(fetch).mockResolvedValueOnce(
			jsonResponse({ error: 'RATE_LIMITED', message: "You've reached the question limit for now." }, false, 429),
		);

		const transport = new PortfolioChatTransport(AssistantTransportError);
		await expect(transport.send({ question: 'Hello?', conversation: [] })).rejects.toMatchObject({
			kind: 'rate-limit',
			message: "You've reached the question limit for now.",
		});
	});

	it('throws a network AssistantTransportError when the fetch itself fails', async () => {
		vi.mocked(fetch).mockRejectedValueOnce(new Error('network down'));

		const transport = new PortfolioChatTransport(AssistantTransportError);
		await expect(transport.send({ question: 'Hello?', conversation: [] })).rejects.toMatchObject({ kind: 'network' });
	});

	it('throws a server AssistantTransportError without calling fetch when env vars are missing', async () => {
		vi.stubEnv('VITE_SUPABASE_URL', '');
		vi.stubEnv('VITE_SUPABASE_ANON_KEY', '');

		const transport = new PortfolioChatTransport(AssistantTransportError);
		await expect(transport.send({ question: 'Hello?', conversation: [] })).rejects.toBeInstanceOf(AssistantTransportError);
		expect(fetch).not.toHaveBeenCalled();
	});
});
