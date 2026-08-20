// Structured content extracted from `src/assets/Athinodoros Boudourakis CV 2026.pdf`.
// Every top level entry is tagged with the original PDF `page` it belongs to so the
// UI can render an anchor point for each page while keeping a single, continuously
// scrollable document.

export interface ContactLink {
	label: string;
	href?: string;
	icon: 'phone' | 'email' | 'linkedin' | 'portfolio' | 'github';
}

export interface ExperienceItem {
	page: number;
	period: string;
	title: string;
	company: string;
	companyUrl?: string;
	location: string;
	bullets: string[] | { name: string; url: string; description: string }[];
}

export interface SkillCategory {
	page: number;
	label: string;
	items: string[];
}

export interface EducationItem {
	page: number;
	period: string;
	title: string;
	institution: string;
	institutionUrl?: string;
	location: string;
	thesis?: string;
}

export interface CertificateItem {
	page: number;
	period: string;
	title: string;
	institution: string;
	institutionUrl?: string;
	location: string;
}

export interface SeminarItem {
	page: number;
	year: string;
	title: string;
	description?: string;
}

export interface LanguageItem {
	page: number;
	language: string;
	level: string;
}

export interface ProjectItem {
	page: number;
	period: string;
	title: string;
	source: string;
	sourceUrl?: string;
	description: string;
}

export const totalPages = 2;

export const header = {
	name: 'Athinodoros Boudourakis',
	title: 'Front-End Developer',
	tagline: 'ReactJS - VueJS - Flutter',
	page: 1,
};

export const contactLinks: ContactLink[] = [
	// { label: '+357 96452647', icon: 'phone' },
	{ label: 'a.boudourakis@gmail.com', href: 'mailto:a.boudourakis@gmail.com', icon: 'email' },
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/athinodoros-boudourakis-25498041', icon: 'linkedin' },
	{ label: 'Portfolio', href: 'https://athos-cv.web.app/Portfolio', icon: 'portfolio' },
	{ label: 'GitHub', href: 'https://github.com/aBoudourakis', icon: 'github' },
];

export const experience: ExperienceItem[] = [
	{
		page: 1,
		period: '07.2023 – present',
		title: 'Front-end Developer',
		company: 'Dealio Ltd.',
		companyUrl: 'https://dealio.ai/',
		location: 'Limassol, Cyprus',
		bullets: [
			'VueJS application development & maintenance of a risk management platform for the financial industry',
			'ReactJs & Flutter application development for version 2',
			'Graphics Design & Marketing Coordination',
		],
	},
	{
		page: 1,
		period: '05.2021 – 06.2023',
		title: 'Software Developer',
		company: 'Bernhard Schulte Management',
		companyUrl: 'https://www.bs-shipmanagement.com/',
		location: 'Limassol, Cyprus',
		bullets: [
			'Intranet React development using Microsoft Sharepoint',
			'Developed from scratch a web-application using NextJS for an internal client',
		],
	},
	{
		page: 1,
		period: '07.2017 – 04.2021',
		title: 'Front-end Developer',
		company: 'G&N Silensec Ltd. – CyberRanges',
		companyUrl: 'https://www.silensec.com/',
		location: 'Limassol, Cyprus',
		bullets: [
			'Developed the Cyber Range training platform using VueJS',
			'Carried out product gamification features design',
			'Led the Graphics Design team',
			'Co-directed a Cinematic trailer for the application',
			'Built UI Elements for graphics and audio interface',
			'Product & content marketing regulation',
			'Acted as a content writer for microtransaction features',
		],
	},
	{
		page: 1,
		period: '2011 – 2017',
		title: 'Web & Graphics Designer',
		company: 'Freelancer',
		location: '',
		bullets: [
			{name: 'Marios Vourgos', url: 'https://mariosvourgos.com', description: 'Artist Portfolio website'},
			{name: 'GDIE LTD', url: 'https://GDIELTD.com/', description: 'Oil and Gas company website'},
			{name: 'CEB Business Development', url: 'https://cebbdevelopment.com/', description: 'Oil and Gas company website'},
			{name: 'Talis Limited', url: 'https://talislimited.com', description: 'Company website'}
		],
	},
];

export const skills: SkillCategory[] = [
	{
		page: 1,
		label: 'Frontend Development',
		items: [
			'HTML5',
			'CSS / SCSS',
			'JavaScript',
			'TypeScript',
			'React',
			'Next.js',
			'Vue.js',
			'Redux Toolkit',
			'MUI',
			'AG Grid',
			'Fluent UI',
			'Vuetify',
			'Quasar',
			'Vite',
		],
	},
	{
		page: 1,
		label: 'Architecture & Web Technologies',
		items: [
			'REST APIs',
			'Server-Sent Events (SSE)',
			'WebSockets',
			'Frontend Architecture',
			'State Management',
			'Component Architecture',
			'Frontend Performance Optimisation',
			'OAuth / OpenID Connect',
			'Keycloak',
			'Accessibility',
			'Responsive Design',
		],
	},
	{
		page: 1,
		label: 'Development & Tooling',
		items: [
			'Git',
			'GitHub',
			'GitLab',
			'CI/CD',
			'GitHub Actions',
			'npm',
			'Docker',
			'WebStorm',
			'VS Code',
			'Browser DevTools',
			'ESLint',
		],
	},
	{
		page: 1,
		label: 'Testing & Quality',
		items: [
			'Jest',
			'Vitest',
			'React Testing Library',
			'Unit Testing',
			'Integration Testing',
			'Code Review',
		],
	},
	{
		page: 1,
		label: 'AI-Assisted Development',
		items: [
			'GitHub Copilot',
			'Claude Code',
			'ChatGPT / Codex',
			'Ollama',
			'Local LLM Workflows',
			'AI-assisted Refactoring & Code Review',
		],
	},

	{
		page: 2,
		label: 'Additional Technologies',
		items: [
			'Python',
			'PHP',
			'Java',
			'C++',
			'Flutter',
			'SharePoint',
			'SPFx',
		],
	},
	{
		page: 2,
		label: 'Machine Learning & Data',
		items: [
			'PyTorch',
			'TensorFlow',
			'Apache Spark',
			'Hadoop',
		],
	},
	{
		page: 2,
		label: 'UI / UX & Design Systems',
		items: [
			'UI / UX Design',
			'Design Systems',
			'Responsive Design',
			'Accessibility',
			'Adobe XD',
			'Adobe Photoshop',
			'Adobe Illustrator',
			'AutoCAD',
		],
	},
	{
		page: 2,
		label: '3D Design & Animation',
		items: [
			'Autodesk Maya',
			'Blender',
			'ZBrush',
		],
	},
	{
		page: 2,
		label: 'Multimedia',
		items: [
			'Adobe Premiere Pro',
			'Adobe After Effects',
			'Adobe Audition',
			'Steinberg Cubase',
		],
	},
	{
		page: 2,
		label: 'Platforms & Environments',
		items: [
			'Windows',
			'macOS',
		],
	},
];
export const education: EducationItem[] = [
	{
		page: 2,
		period: '2021 – 2025',
		title: 'MSc in Data Science and Engineering',
		institution: 'CUT, Limassol, Cyprus',
		institutionUrl: 'https://www.cut.ac.cy/',
		location: 'Limassol, Cyprus',
		thesis: '"Multimodal Deep Learning for Predicting and Detecting Optimal Medical Conditions of a Patient"',
	},
	{
		page: 2,
		period: '2013 – 2017',
		title: 'BSc in Computer Engineering & Informatics',
		institution: 'CUT, Limassol, Cyprus',
		institutionUrl: 'https://www.cut.ac.cy/',
		location: 'Limassol, Cyprus',
	},
	{
		page: 2,
		period: '2005 – 2007',
		title: 'BSc in Electrical and Computer Engineering',
		institution: 'AUTH, Thessaloniki, Greece',
		institutionUrl: 'https://www.auth.gr/en/',
		location: 'Thessaloniki, Greece',
	},
];

export const certificates: CertificateItem[] = [
	{
		page: 2,
		period: '2023 - present',
		title: 'Certificates in Vue JS 2 / React / Next.js / Remix.js / Flutter & Dart',
		institution: 'UDEMY, online',
		institutionUrl: 'https://www.udemy.com/',
		location: 'online',
	},
];

export const seminars: SeminarItem[] = [
	{
		page: 2,
		year: '2018',
		title: 'Seminar in "Growth Hacking"',
	},
	{
		page: 2,
		year: '2017',
		title: 'Seminar in "UX Research at Google"',
		description: 'by Katie Tzanidou, User Experience (UX) Research Manager at Google UK',
	},
];

export const languages: LanguageItem[] = [
	{ page: 2, language: 'English', level: 'Fluent' },
	{ page: 2, language: 'Greek', level: 'Native' },
	{ page: 2, language: 'Russian & German', level: 'Basic' },
];

export const projects: ProjectItem[] = [
	{
		page: 2,
		period: '2021',
		title: 'Cyber Range training platform',
		source: 'app.cyberranges.com',
		sourceUrl: 'https://app.cyberranges.com',
		description: 'Cyber security training platform used for National competitions in the Middle East and Africa',
	},
	{
		page: 2,
		period: '2017',
		title: 'Research Projects and Payments Management System',
		source: 'Cyprus University of Technology',
		sourceUrl: 'https://www.cut.ac.cy/',
		description: 'Web-based application for payments and research projects management.',
	},
	{
		page: 2,
		period: '2016',
		title: '3D Modelling & Digitalization of Cultural Heritage content',
		source: 'EUROPEANA',
		sourceUrl: 'http://www.europeana.eu/',
		description: '3D Modelling & Digitalization of Cultural Heritage content',
	},
];

export type academicEntryModel = {
	period: string;
	title: string;
	subtitle?: string;
	institution?: string;
	location?: string;
	description?: string;
}
