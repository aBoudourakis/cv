// Page-local content for the "Beyond Work" page — kept separate from
// presentation (BeyondWork.tsx) and styling (BeyondWork.module.scss),
// mirroring the project's data/component/style separation used elsewhere
// (see cvData.ts for the CV, covidShieldCyprusData.ts for the standalone
// COVID Shield Cyprus page).
//
// `BeyondWorkEntry` intentionally stays generic — a title, an optional
// description, an optional flat list of items — so later additions (per-item
// descriptions, images, audio/video samples, links, dates) can be layered on
// by extending the interface itself, without reshaping the sections that
// render it.

export interface BeyondWorkEntry {
	title: string;
	description?: string;
	items?: string[];
}

export interface disciplineEntry {
	name: string;
	description?: string;
	items?: string[] | any[];
}

export interface musicWorkEntry {
	/** Stable identifier — used as the React key and to track per-track playback state, so it must stay constant even if title/order change. */
	id: string;
	/** Public-root path under /public/audio, e.g. '/audio/Snowglobe_demo.mp3'. */
	file?: string;
	title: string;
	type?: string;
	instruments?: string[];
	description?: string;
}

export interface WorkingTrait {
	title: string;
	description: string;
}

export const intro = {
	heading: 'Beyond Work',
	paragraph:
		'A little more about the interests, disciplines and experiences that influence how I think, create and work.',
};

/** "Interests & Creative Work" — grouped by discipline rather than exhaustively itemised. */
export const creativeInterests: BeyondWorkEntry[] = [
	{
		title: 'Music',
		items: ['Guitar', 'Bass Guitar', 'Composition'],
	},
	{
		title: 'Visual Art',
		items: ['Drawing', 'Pencil', 'Oil Painting', 'Acrylic Painting'],
	},
];

export const musicWorksIntro = 'A selection of short excerpts from original musical work.';

export const musicWorks: musicWorkEntry[] = [
	{
		id: 'snowglobe',
		file: '/audio/Snowglobe_demo.mp3',
		title: 'Snowglobe',
		type: 'Composition',
		description: 'A heavy metal composition.',
		instruments: ['Electric Guitars', 'Bass Guitar', 'Drums'],
	},
	{
		id: 'avalanche',
		file: '/audio/Avalanche_demo.mp3',
		title: 'Avalanche',
		type: 'Composition',
		description: 'A heavy metal composition.',
		instruments: ['Electric Guitars', 'Bass Guitar', 'Drums'],
	},
	{
		id: 'dmc-cover',
		file: '/audio/DMC_demo.mp3',
		title: 'DMC anime intro gut guitar cover',
		type: 'Cover',
		description: 'A guitar cover of the Devil May Cry anime intro.',
		instruments: ['Classical Guitars'],
	}
];

export const interestsActivities = [
	{
		name: 'Martial Arts',
		description: 'Practiced Kung Fu and Tai Chi intensively for approximately 8 years.',
		more: [
			{title: 'Hapkido', description: '1 year'},
			{title: 'Ying Jow Pai Kung Fu', description: '1 year'},
			{title: 'Northern Fist Shaolin Kung Fu', description: '6 years'},
			{title: 'Traditional Yang Style Tai Chi', description: '2 years'},
			{title: 'Wu Style Tai Chi', description: '1 year'},
		]
	},
	{
		name: 'Archery',
		description: 'Approximately 2 years of consistent recurve bow practice',
	},
	{
		name: 'Kayaking',
		description: 'An outdoor sport I practiced regularly for several years.',
	},
	{
		name: 'Fishing',
		description: 'A former recreational hobby, mainly early-morning small-boat fishing with rod and net equipment.',
	}
];

/** "How I Work" — transferable characteristics, each with its own short description rather than a bare word cloud. */
export const workingTraits: WorkingTrait[] = [
	{
		title: 'Creative + Analytical',
		description:
			'I naturally combine visual thinking with technical problem-solving, whether working on an interface, software architecture, music or visual art.',
	},
	{
		title: 'Attention to Detail',
		description:
			'I tend to notice small inconsistencies in interfaces, interactions and workflows and prefer resolving the underlying cause rather than masking the symptom.',
	},
	{
		title: 'Questioning Assumptions',
		description:
			'I tend to question existing decisions when I believe there may be a clearer, simpler or more effective solution.',
	},
	{
		title: 'Ownership',
		description:
			'I enjoy being involved from early ideas through implementation and refinement rather than working only on isolated development tasks.',
	},
	{
		title: 'Continuous Learning',
		description:
			'My interests regularly cross software engineering, UI/UX, AI, design, art and other disciplines, and I tend to learn through building and experimentation.',
	},
];

/**
 * Later categories (Community & Volunteering, Side Projects, Design
 * Influences, Technology Interests, ...) can be added as further
 * `BeyondWorkEntry[]` / `WorkingTrait[]` exports and rendered as additional
 * <section>s in BeyondWork.tsx without changing this file's shape.
 */
