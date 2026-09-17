import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PortfolioAssistant from '../PortfolioAssistant.tsx';
import { ASSISTANT_TITLE } from '../constants.ts';

const LAUNCHER_NAME = ASSISTANT_TITLE;

function renderAssistant() {
	return render(
		<MemoryRouter>
			<PortfolioAssistant />
		</MemoryRouter>,
	);
}

// The widget itself is dynamically imported (see PortfolioAssistant.tsx), so
// the launcher only appears in the DOM once that import resolves.
async function findLauncher() {
	return screen.findByRole('button', { name: LAUNCHER_NAME });
}

async function openPanel(user: ReturnType<typeof userEvent.setup>) {
	await user.click(await findLauncher());
	return screen.findByRole('dialog');
}

function jsonResponse(body: unknown, ok = true, status = 200) {
	return { ok, status, json: async () => body } as Response;
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

		const launcher = await findLauncher();
		await openPanel(user);

		await user.click(screen.getByRole('button', { name: /close assistant/i }));

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		expect(launcher).toHaveFocus();
	});

	it('closes on Escape and restores focus to the launcher', async () => {
		const user = userEvent.setup();
		renderAssistant();

		const launcher = await findLauncher();
		await openPanel(user);

		await user.keyboard('{Escape}');

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		expect(launcher).toHaveFocus();
	});

	it('lets a visitor switch between the built-in mascot presets via the header dropdown', async () => {
		const user = userEvent.setup();
		renderAssistant();
		await openPanel(user);

		// familiar-js 0.4.5 added a persistent header control for this, distinct
		// from the "Change mascot" *suggestion chip* (also present since we set
		// mascotPicker: true) which posts a one-off picker into the conversation.
		const trigger = screen.getByRole('button', { name: 'Change mascot', expanded: false });
		await user.click(trigger);

		const picker = await screen.findByRole('group', { name: /choose a mascot/i });
		expect(within(picker).getAllByRole('button')).toHaveLength(4);
		expect(within(picker).getByLabelText(/clip \(current mascot\)/i)).toBeInTheDocument();

		await user.click(within(picker).getByRole('button', { name: /switch to wizard/i }));

		// Picking an option closes the dropdown without touching the conversation.
		await waitFor(() => expect(screen.queryByRole('group', { name: /choose a mascot/i })).not.toBeInTheDocument());
		expect(trigger).toHaveFocus();

		// Reopening reflects the live selection (this is what 0.4.5 fixed).
		await user.click(trigger);
		const reopenedPicker = await screen.findByRole('group', { name: /choose a mascot/i });
		expect(within(reopenedPicker).getByLabelText(/wizard \(current mascot\)/i)).toBeInTheDocument();
	});

	it('cannot submit an empty or whitespace-only question', async () => {
		const user = userEvent.setup();
		renderAssistant();
		await openPanel(user);

		await user.click(screen.getByRole('button', { name: /send question/i }));
		expect(fetch).not.toHaveBeenCalled();

		await user.type(screen.getByRole('textbox', { name: /ask a question/i }), '   ');
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
		// A hidden copy of the suggestion chips (including this exact text)
		// stays in the DOM once the conversation starts, so several assertions
		// below use getAllByText rather than assuming a single match.
		await user.click(screen.getByRole('button', { name: question }));

		// The question is echoed back as a user message.
		expect(screen.getAllByText(question).length).toBeGreaterThan(0);
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
		expect(screen.getByRole('link', { name: 'Experience · Dealio' })).toBeInTheDocument();

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
