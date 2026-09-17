const CATEGORY_LABELS: Record<string, string> = {
	// Public CV/portfolio categories (rag/chunk.ts).
	profile: 'Profile',
	experience: 'Experience',
	skill: 'Skills',
	education: 'Education',
	certification: 'Certifications',
	award: 'Awards',
	seminar: 'Seminars',
	language: 'Languages',
	project: 'Projects',
	// Assistant-only knowledge-layer categories (rag/assistantKnowledge.ts) —
	// friendly labels only; never the raw assistant_knowledge slug/id (task §11).
	'professional-summary': 'Professional Summary',
	'frontend-engineering': 'Frontend Engineering',
	'ui-ux': 'UI/UX',
	architecture: 'Frontend Architecture',
	'realtime-systems': 'Real-Time Systems',
	'startup-experience': 'Startup Experience',
	leadership: 'Technical Leadership',
	'working-style': 'Working Style',
	'project-ownership': 'Project Ownership',
	'ai-rag': 'AI & RAG',
	tooling: 'Tooling',
	'career-preferences': 'Career Preferences',
	'technical-decision': 'Technical Decisions',
	'interview-example': 'Example Work',
};

/** Falls back to a Title Case rendering of an unmapped kebab-case category rather than "unknown". */
export function formatCategory(category: string): string {
	if (CATEGORY_LABELS[category]) return CATEGORY_LABELS[category];
	return category
		.split('-')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}
