import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AssistantSources from '../AssistantSources.tsx';
import type { PortfolioSource } from '../types.ts';

function renderSources(sources: PortfolioSource[]) {
	return render(
		<MemoryRouter>
			<AssistantSources sources={sources} />
		</MemoryRouter>,
	);
}

describe('AssistantSources', () => {
	it('renders an assistant-only source (no url, no sectionId) as plain non-clickable text', () => {
		renderSources([
			{ id: 'knowledge-engineering-working-style', title: 'Engineering Working Style', category: 'working-style', source: 'Working Style' },
		]);

		expect(screen.getByText('Working Style · Engineering Working Style')).toBeInTheDocument();
		expect(screen.queryByRole('button')).not.toBeInTheDocument();
		expect(screen.queryByRole('link')).not.toBeInTheDocument();
	});

	it('formats known assistant-only categories with friendly labels', () => {
		renderSources([{ id: 'k1', title: 'AI, RAG and AI-Assisted Development', category: 'ai-rag' }]);
		expect(screen.getByText('AI & RAG · AI, RAG and AI-Assisted Development')).toBeInTheDocument();
	});

	it('falls back to a Title Case label for an unmapped kebab-case category', () => {
		renderSources([{ id: 'k2', title: 'Some Entry', category: 'some-future-category' }]);
		expect(screen.getByText('Some Future Category · Some Entry')).toBeInTheDocument();
	});

	it('still renders a public CV source with an internal path as a clickable button', () => {
		renderSources([{ id: 'project-covid', title: 'COVID-19 Initiative', category: 'project', url: '/covid-shield-cyprus' }]);
		expect(screen.getByRole('button', { name: 'Projects · COVID-19 Initiative' })).toBeInTheDocument();
	});

	it('renders nothing when there are no sources', () => {
		const { container } = renderSources([]);
		expect(container).toBeEmptyDOMElement();
	});
});
