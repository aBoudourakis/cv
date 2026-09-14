import type {ReactNode} from 'react';

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

export interface InterestActivityMoreItem {
	title: string;
	description?: string;
}

/**
 * The optional "more" detail behind an interest/activity's info icon.
 * Deliberately a plain union rather than a `{type: ...}` discriminated one —
 * the real data today only ever needs the structured-item-list form, with
 * plain text or a custom ReactNode anticipated as the only other cases (see
 * InterestActivityItem.tsx, which tells the list form apart from everything
 * else with a runtime shape check rather than a stored tag).
 */
export type InterestActivityMore = InterestActivityMoreItem[] | ReactNode;

export interface InterestActivity {
	name: string;
	description?: string;
	/** Only rendered as an info icon + popover when present and non-empty — see InterestActivityItem.tsx. */
	more?: InterestActivityMore;
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

export interface MusicWorksSection {
	title: string;
	description?: string;
	/** Rendered behind an info icon next to the heading — see components/InfoPopover.tsx. */
	more?: InterestActivityMore;
}

export const musicWorksSection: MusicWorksSection = {
	title: 'Music & Composition',
	description: 'A selection of short excerpts from original musical work.',
	more: 'None of the music featured here is AI-generated — every track was composed, performed, mixed and orchestrated by me, years before generative AI became part of modern creative workflows. The one exception concerns originality, not this AI notice: the Devil May Cry intro guitar cover is my performance of an existing arrangement by Rangran rather than an original composition of mine.',
}

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
		id: 'snowglobe2',
		file: '/audio/Snowglobe_demo_pt2.mp3',
		title: 'Snowglobe Part 2',
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
		description: 'A guitar cover of the Devil May Cry anime intro by Rangran.',
		instruments: ['Classical Guitars'],
	}
];

export interface ArtWorkItem {
	title: string;
	/** Public-root path under /public/art, e.g. '/art/paintings/paintings_01.webp'. */
	file: string;
}

export interface ArtWorksSection {
	title: string;
	description?: string;
	/** Rendered behind an info icon next to the heading — see components/InfoPopover.tsx. */
	more?: InterestActivityMore;
	items?: ArtWorkItem[];
}

export const artWorkSection: ArtWorksSection = {
	title: 'Art & Design',
	description: 'A selection of original visual art work and graphic design.',
	more: 'The visual artwork featured here is a small selection of my original creative work produced over the years, spanning drawing, painting, 3D design and graphic design. Created using a variety of traditional and digital techniques, these pieces reflect my personal style, experimentation and interest in visual composition, storytelling and creative expression.',
}

export const artWorkSubSection1: ArtWorksSection = {
	title: 'Physical',
	description: 'A selection of original Physical design work.',
	// more: 'The paintings featured here are a small selection of my original creative work produced over the years, spanning drawing, painting, 3D design and graphic design. Created using a variety of traditional and digital techniques, these pieces reflect my personal style, experimentation and interest in visual composition, storytelling and creative expression.',
	items: [
		{
			title: 'Acrylics and pencil on canvas',
			file: '/art/paintings/paintings_01.webp',
		},
		{
			title: 'Oil and pencil on canvas',
			file: '/art/paintings/paintings_02.webp',
		},
		{
			title: 'Acrylics and pencil on canvas',
			file: '/art/paintings/paintings_03.webp',
		},
		{
			title: 'Acrylics and pencil on canvas',
			file: '/art/paintings/paintings_04.webp',
		},
	]
}

export const artWorkSubSection2: ArtWorksSection = {
	title: 'Digital',
	description: 'A selection of original Digital design work.',
	// more: 'The digital design work featured here is a small selection of my original creative work produced over the years, spanning drawing, painting, 3D design and graphic design. Created using a variety of traditional and digital techniques, these pieces reflect my personal style, experimentation and interest in visual composition, storytelling and creative expression.',
	items: [
		{
			title: '3D Bell Modelling, Camera Matching, Lighting & CGI Compositing',
			file: '/art/digital/digital_01.webp',
		},
		{
			title: '3D Car Modelling, Camera Matching, Lighting & CGI Compositing',
			file: '/art/digital/digital_02.webp',
		},
		{
			title: 'Photomanipulation & Digital Compositing',
			file: '/art/digital/digital_03.webp',
		},
	]
}

export const interestsActivities: InterestActivity[] = [
	{
		name: 'Martial Arts',
		description: 'Practiced Kung Fu and Tai Chi intensively for approximately 10 years.',
		more: [
			{title: 'Hapkido', description: '1 year'},
			{title: 'Ying Jow Pai Kung Fu', description: '1 year'},
			{title: 'Northern Fist Shaolin Kung Fu', description: '4 years'},
			{title: 'Traditional Yang Style Tai Chi', description: '2 years'},
			{title: "Kung Fu To'a", description: '2 years'},
			{title: 'Wu Style Tai Chi', description: '1 year'},
		]
	},
	{
		name: 'Archery',
		description: 'Approximately 2 years of recurve bow training',
	},
	{
		name: 'Kayaking',
		description: 'An outdoor sport I practiced regularly for some years.',
	},
	{
		name: 'Fishing',
		description: 'A former recreational hobby, mainly early-morning small-boat fishing with rod and net equipment.',
	}
];

export interface WorkingTraitsSection {
	title: string;
	description?: string;
}

export const workingTraitsSection: WorkingTraitsSection = {
	title: 'And Somehow, Back to Work',
	description: 'My interests and experiences beyond work, together with years of professional practice and continuous learning, have gradually shaped the way I think, create, collaborate and approach my work.',
}

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
	{
		title: 'AI-Assisted, Human-Reviewed',
		description:
			'I use AI tools to accelerate development and improve productivity, while maintaining active oversight of the process through continuous review, validation and testing to ensure correctness, maintainability and edge-case coverage.',
	},
];

/**
 * Later categories (Community & Volunteering, Side Projects, Design
 * Influences, Technology Interests, ...) can be added as further
 * `BeyondWorkEntry[]` / `WorkingTrait[]` exports and rendered as additional
 * <section>s in BeyondWork.tsx without changing this file's shape.
 */
