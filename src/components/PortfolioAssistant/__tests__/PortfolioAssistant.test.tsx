import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PortfolioAssistant from '../PortfolioAssistant.tsx';

const LAUNCHER_NAME = /ask about athinodoros — portfolio assistant/i;

function renderAssistant() {
	return render(
		<MemoryRouter>
			<PortfolioAssistant />
		</MemoryRouter>,
	);
}

async function openPanel(user: ReturnType<typeof userEvent.setup>) {
	await user.click(screen.getByRole('button', { name: LAUNCHER_NAME }));
	return screen.findByRole('dialog');
}

function jsonResponse(body: unknown, ok = true, status = 200) {
	return {
		ok,
		status,
		json: async () => body,
	} as Response;
}

describe('PortfolioAssistant', () => {
	beforeEach(() => {
		vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co');
		vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');
		vi.stubGlobal('fetch', vi.fn());
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
	});

	it('opens the panel from the launcher and closes it with the close button, restoring focus', async () => {
		const user = userEvent.setup();
		renderAssistant();

		const launcher = screen.getByRole('button', { name: LAUNCHER_NAME });
		await openPanel(user);

		await user.click(screen.getByRole('button', { name: /close assistant/i }));

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		expect(launcher).toHaveFocus();
	});

	it('closes on Escape and restores focus to the launcher', async () => {
		const user = userEvent.setup();
		renderAssistant();

		const launcher = screen.getByRole('button', { name: LAUNCHER_NAME });
		await openPanel(user);

		await user.keyboard('{Escape}');

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		expect(launcher).toHaveFocus();
	});

	it('cannot submit an empty or whitespace-only question', async () => {
		const user = userEvent.setup();
		renderAssistant();
		await openPanel(user);

		expect(screen.getByRole('button', { name: /send question/i })).toBeDisabled();

		await user.type(screen.getByRole('textbox', { name: /ask a question/i }), '   ');
		expect(screen.getByRole('button', { name: /send question/i })).toBeDisabled();

		await user.keyboard('{Enter}');
		expect(fetch).not.toHaveBeenCalled();
	});

	it('submits a suggested question exactly like typing it manually, showing a thinking state then the answer with sources', async () => {
		const user = userEvent.setup();
		let resolveFetch!: (value: Response) => void;
		vi.mocked(fetch).mockReturnValueOnce(new Promise((resolve) => (resolveFetch = resolve)));

		renderAssistant();
		await openPanel(user);

		const question = 'What experience does he have with React?';
		await user.click(screen.getByRole('button', { name: question }));

		// The question is echoed back as a user message.
		expect(screen.getByText(question)).toBeInTheDocument();
		// Thinking state is visible while the request is in flight (once in the
		// message list, once in the visually-hidden aria-live announcement).
		expect(screen.getAllByText(/clip is thinking/i).length).toBeGreaterThan(0);

		resolveFetch(
			jsonResponse({
				answer: 'He has built several React/TypeScript interfaces.',
				sources: [
					{ id: 'skill-frontend', title: 'Frontend Development', category: 'skill' },
					{ id: 'experience-dealio', title: 'Dealio', category: 'experience', sectionId: 'cv-experience' },
				],
				requestId: 'req-1',
			}),
		);

		await waitFor(() =>
			expect(screen.getAllByText('He has built several React/TypeScript interfaces.').length).toBeGreaterThan(0),
		);
		expect(screen.getByText('Skills · Frontend Development')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Experience · Dealio' })).toBeInTheDocument();

		const [, requestInit] = vi.mocked(fetch).mock.calls[0];
		const requestBody = JSON.parse(requestInit!.body as string);
		expect(requestBody.question).toBe(question);
	});

	it('shows a friendly notice when the server returns a rate-limit error', async () => {
		const user = userEvent.setup();
		vi.mocked(fetch).mockResolvedValueOnce(
			jsonResponse(
				{ error: 'RATE_LIMITED', message: "You've reached the question limit for now — please try again later." },
				false,
				429,
			),
		);

		renderAssistant();
		await openPanel(user);

		await user.type(screen.getByRole('textbox', { name: /ask a question/i }), 'Hello?');
		await user.click(screen.getByRole('button', { name: /send question/i }));

		await waitFor(() => expect(screen.getAllByText(/reached the question limit/i).length).toBeGreaterThan(0));
	});

	it('shows an error state when the request fails outright', async () => {
		const user = userEvent.setup();
		vi.mocked(fetch).mockRejectedValueOnce(new Error('network down'));

		renderAssistant();
		await openPanel(user);

		await user.type(screen.getByRole('textbox', { name: /ask a question/i }), 'Hello?');
		await user.keyboard('{Enter}');

		await waitFor(() => expect(screen.getAllByText(/couldn't reach the portfolio assistant/i).length).toBeGreaterThan(0));
	});
});
