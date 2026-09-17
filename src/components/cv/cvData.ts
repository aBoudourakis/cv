// Structured content extracted from `src/assets/Athinodoros Boudourakis CV 2026.pdf`.
// Every top level entry is tagged with the original PDF `page` it belongs to so the
// UI can render an anchor point for each page while keeping a single, continuously
// scrollable document.

export interface ContactLink {
	label: string;
	href?: string;
	icon: 'phone' | 'email' | 'linkedin' | 'portfolio' | 'github' | 'npm';
}

export type BulletItem = string | { name: string; url: string; description: string };

export interface ExperienceItem {
	page: number;
	period: string;
	title: string;
	company: string;
	companyUrl?: string;
	location: string;
	bullets: BulletItem[];
}

export interface SkillCategory {
	page?: number;
	id?: string;
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
	period?: string;
	year?: string;
	title: string;
	subtitle?: string;
	description?: string;
	institution?: string;
	issuer?: string;
	organization?: string;
	institutionUrl?: string;
	location?: string;
	link?: string;
}

export interface SeminarItem {
	page: number;
	year: string;
	title: string;
	description?: string;
}

export interface AwardItem {
	page: number;
	year: string;
	title: string;
	subtitle?: string;
	link?: string;
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
	subtitle?: string;
	subtitle2?: string;
	source?: string;
	sourceUrl?: string;
	source2?: string;
	sourceUrl2?: string;
	source3?: string;
	sourceUrl3?: string;
	description?: string;
	bullets?: string[];
	technologies?: string[] | string;
}

export const totalPages = 2;

export const header = {
	name: 'Athinodoros Boudourakis',
	title: 'Front-End Software Engineer',
	tagline: 'React · Vue.js · Flutter',
	summary:
		'Front-end engineer with 10+ years building production React and Vue applications across fintech, ' +
		'shipping and cybersecurity — focused on component architecture, performance, and accessible, ' +
		'well-designed interfaces.',
	page: 1,
};

export const contactLinks: ContactLink[] = [
	// { label: '+357 96452647', icon: 'phone' },
	{ label: 'a.boudourakis@gmail.com', href: 'mailto:a.boudourakis@gmail.com', icon: 'email' },
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/athinodoros-boudourakis-25498041', icon: 'linkedin' },
	{ label: 'Portfolio', href: '/portfolio', icon: 'portfolio' },
	{ label: 'GitHub', href: 'https://github.com/aBoudourakis', icon: 'github' },
	{ label: 'npm', href: 'https://www.npmjs.com/~giftofathena', icon: 'npm' },
];

export const experience: ExperienceItem[] = [
	{
		page: 1,
		period: '07.2023 – 10.2026',
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
		company: 'Bernhard Schulte Shipmanagement',
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
			{name: 'Watch Cinematic Trailer', url: 'https://www.youtube.com/watch?v=-cYUbAW83so', description: 'YouTube link'},
			'UI Gamification Elements Design (Graphics and Audio)',
			'Product & content marketing regulation',
			'Acted as a content writer for microtransaction features',
		],
	},
	{
		page: 1,
		period: '2011 – 2017',
		title: 'Web & Graphics Design - Brand Identity',
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
		id: 'frontend-engineering',
		label: 'Frontend Engineering',
		items: [
			'JavaScript',
			'TypeScript',
			'React',
			'Next.js',
			'Vue.js',
			'Dart',
			'Swift',
			'Redux Toolkit',
			'HTML5',
			'CSS / SCSS',
			'Material UI (MUI)',
			'AG Grid',
			'Fluent UI',
			'Vuetify',
			'Quasar Framework',
			'Vite',
		],
	},
	{
		page: 1,
		id: 'frontend-architecture',
		label: 'Frontend Architecture',
		items: [
			'Component Architecture',
			'State Management',
			'Design Systems',
			'Responsive Design',
			'Accessibility',
			'Frontend Performance Optimisation',
			'Cross-browser Development',
		],
	},
	{
		page: 1,
		id: 'web-application-technologies',
		label: 'Frontend Architecture & Web Engineering',
		items: [
			'REST APIs',
			'Server-Sent Events (SSE)',
			'WebSocket',
			'Real-time Applications',
			'OAuth 2.0 / OpenID Connect (OIDC)',
			'Keycloak',
		],
	},
	{
		page: 1,
		id: 'engineering-quality',
		label: 'Engineering Quality',
		items: [
			'Jest',
			'Vitest',
			'React Testing Library',
			'Unit Testing',
			'Integration Testing',
			'Code Review',
			'ESLint',
		],
	},
	{
		page: 1,
		id: 'development-delivery',
		label: 'Development & Delivery',
		items: [
			'Git',
			'GitHub',
			'GitLab',
			'CI/CD',
			'GitHub Actions',
			'npm',
			'Docker',
			'Browser DevTools',
			'WebStorm',
			'VS Code',
		],
	},
	{
		page: 1,
		id: 'ai-assisted-engineering',
		label: 'AI-Assisted Engineering',
		items: [
			'GitHub Copilot',
			'Claude Code',
			'ChatGPT / OpenAI Codex',
			'Ollama',
			'Local LLM Workflows',
			'AI-assisted Refactoring',
			'AI-assisted Code Review',
		],
	},
	{
		page: 1,
		id: 'ui-ux-visual-design',
		label: 'UI / UX & Visual Design',
		items: [
			'UI / UX Design',
			'Interface Design',
			'Visual Hierarchy',
			'Interaction Design',
			'Prototyping',
			'Adobe XD',
			'Adobe Photoshop',
			'Adobe Illustrator',
		],
	},
	{
		page: 1,
		id: 'additional-development',
		label: 'Additional Development',
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
		page: 1,
		id: 'machine-learning-data',
		label: 'Machine Learning & Data',
		items: [
			'PyTorch',
			'TensorFlow',
			'Apache Spark',
			'Hadoop',
		],
	},
	{
		page: 1,
		id: '3d-spatial-design',
		label: '3D & Spatial Design',
		items: [
			'Autodesk Maya',
			'Blender',
			'ZBrush',
			'AutoCAD',
		],
	},
	{
		page: 1,
		id: 'multimedia',
		label: 'Multimedia',
		items: [
			'Adobe Premiere Pro',
			'Adobe After Effects',
			'Adobe Audition',
			'Steinberg Cubase',
		],
	},
	{
		page: 1,
		id: 'platforms',
		label: 'Platforms',
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
		institution: 'Cypus University of Technology',
		institutionUrl: 'https://www.cut.ac.cy/',
		location: 'Limassol, Cyprus',
		thesis: 'Thesis: "Multimodal Deep Learning for Predicting and Detecting Optimal Medical Conditions of a Patient"',
	},
	{
		page: 2,
		period: '2013 – 2017',
		title: 'BSc in Computer Engineering & Informatics',
		institution: 'Cypus University of Technology',
		institutionUrl: 'https://www.cut.ac.cy/',
		location: 'Limassol, Cyprus',
	},
	{
		page: 2,
		period: '2005 – 2007',
		title: 'BSc in Electrical and Computer Engineering',
		institution: 'Aristotle University of Thessaloniki (partial studies)',
		institutionUrl: 'https://www.auth.gr/en/',
		location: 'Thessaloniki, Greece',
	},
];

export const certificates: CertificateItem[] = [
	{
		page: 2,
		period: '2023 - present',
		title: 'Online Courses',
		subtitle: 'Certificates in Vue JS 2 / React / Next.js / Remix.js / Flutter & Dart',
		institution: 'UDEMY',
		institutionUrl: 'https://www.udemy.com/',
		location: 'online',
	},
];

export const seminars: SeminarItem[] = [
	{
		page: 2,
		year: '2018',
		title: 'Seminar in "Growth Hacking"',
		description: 'Panis Pieri, Growth Hacker & Digital Marketing Expert (20+ years experience)',
	},
	{
		page: 2,
		year: '2017',
		title: 'Seminar in "UX Research at Google"',
		description: 'Katie Tzanidou, User Experience (UX) Research Manager at Google UK',
	},
];

export const certificates2: CertificateItem[] = [
	{
		page: 2,
		title: "AI Agents & Workflows - The Practical Guide",
		subtitle: "Certificate",
		year: "2025",
		link: "ude.my/UC-2d342be5-78a0-4d2b-9046-3b7cf54697ac",
		issuer: "Udemy - Maximilian Schwarzmüller",
		organization: "Udemy"
	},
	{
		page: 2,
		title: "Local LLMs via Ollama & LM Studio - The Practical Guide",
		subtitle: "Certificate",
		year: "2025",
		link: "ude.my/UC-585a9a2c-3bc4-47bc-83f0-5cacb119daf0",
		issuer: "Udemy - Maximilian Schwarzmüller",
		organization: "Udemy"
	},
	{
		page: 2,
		title: "Cyprus Seeds for the Future Scholarship 2024",
		subtitle: "Award",
		description: "Awarded in recognition of outstanding potential, dedication, and commitment to excellence",
		year: "2025",
		link: '/certificates/AthinodorosBoudourakis_Huawei_Award_20250312162504.pdf',
		issuer: "Huawei Technologies (Cyprus) Co. Ltd",
		organization: "Huawei Technologies (Cyprus) Co. Ltd"
	},
	{
		page: 2,
		title: "Flutter & Dart - The Complete Guide",
		subtitle: "Certificate",
		year: "2023",
		link: "ude.my/UC-59c3d1d4-10f9-46ad-a6de-bb4ebdb4d63a",
		issuer: "Academind by Udemy - Maximilian Schwarzmüller",
		organization: "Udemy"
	},
	{
		page: 2,
		title: "Remix.js - The Practical Guide",
		subtitle: "Certificate",
		year: "2023",
		link: "ude.my/UC-86591a0b-376d-46fc-82b0-08fbb2c8d285",
		issuer: "Academind by Udemy - Maximilian Schwarzmüller",
		organization: "Udemy"
	},
	{
		page: 2,
		title: "AI-900T00 - Microsoft Azure AI Fundamentals",
		subtitle: "Microsoft Certificate of Achievement",
		description: "Successfully completed the Microsoft Official Course. Course duration: 1 day",
		year: "2022",
		link: '/certificates/AthinodorosBoudourakisAI-900T00.pdf',
		issuer: "George Lialiaris",
		organization: "Microsoft"
	},
	{
		page: 2,
		title: "Next.js & React - The Complete Guide (incl. Two Paths!)",
		subtitle: "Certificate",
		year: "2022",
		link: "ude.my/UC-94a13e25-f8ec-4982-b719-ba97ccb32e12",
		issuer: "Udemy - Maximilian Schwarzmüller",
		organization: "Udemy"
	},
	{
		page: 2,
		title: "Azure Data Fundamentals",
		subtitle: "Microsoft Certified",
		description: "Successfully completed the requirements of Azure Data Fundamentals",
		year: "2022",
		// link: "verify.certiport.com: wYcQK-2FMz",
		link: "https://www.certiport.com/portal/Pages/PrintTranscriptInfo.aspx?action=Cert&id=456&cvid=8604R9cIWbvURhlkTAKoew==",
		issuer: "Satya Nadella",
		organization: "Microsoft"
	},
	{
		page: 2,
		title: "Vue JS 2 - The Complete Guide (incl. Vue Router & Vuex)",
		subtitle: "Certificate",
		year: "2020",
		link: "ude.my/UC-bf3b87a1-6faf-4821-aa30-8d0baebea7b0",
		issuer: "Udemy - Maximilian Schwarzmüller",
		organization: "Udemy"
	},
	{
		page: 2,
		title: "React - The Complete Guide (incl Hooks, React Router, Redux)",
		subtitle: "Certificate",
		year: "2020",
		link: "ude.my/UC-1717b593-efd9-4293-8113-b846869f9923",
		issuer: "Academind by Udemy - Maximilian Schwarzmüller",
		organization: "Udemy"
	}
];

export const languages: LanguageItem[] = [
	{ page: 2, language: 'English', level: 'Fluent' },
	{ page: 2, language: 'Greek', level: 'Native' },
	{ page: 2, language: 'Russian & German', level: 'Basic' },
];

export const projects: ProjectItem[] = [
	{
		page: 2,
		period: '2026 – Present',
		title: 'Interactive Online CV & Portfolio',
		source: 'Personal Project',
		sourceUrl: 'https://athinodoros.boudourakis.com',
		description:
			'Built an interactive React + Vite + TypeScript CV and portfolio application with Supabase, GitHub Pages hosting, GitHub Actions CI/CD, responsive theming, optimized media content, and “Clip” — a RAG-powered AI assistant using embeddings, semantic vector search and pgvector-backed retrieval to answer questions from curated personal and professional knowledge.',
		technologies:
			'React · TypeScript · Vite · Supabase · RAG · pgvector · GitHub Actions · CI/CD',
	},
	{
		page: 2,
		period: '2017 – 2021',
		title: 'Cyber Range training platform',
		source: 'Cyber Ranges',
		sourceUrl: 'https://app.cyberranges.com',
		description: 'Cyber security training platform used for National competitions in the Middle East and Africa',
		technologies: ['Vue.js', 'Quasar Framework', 'D3.js', 'Adobe Photoshop', 'Adobe Illustrator', 'Adobe Audition'],
	},
	{
		page: 2,
		period: '2021',
		title: 'COVID-19 Protective Face Shield Initiative — Cyprus',
		source: 'News Page',
		sourceUrl: 'https://en.philenews.com/local/citizens-make-hundreds-of-face-shields-per-day-for-limassol-hospital/',
		source2: 'Facebook Page',
		sourceUrl2: 'https://www.facebook.com/groups/872505479922591',
		source3: 'Photographic Footage',
		sourceUrl3: '/covid-shield-cyprus',
		description: 'One of the first 10 volunteers who helped form a grassroots 3D-printing initiative during the initial COVID-19 outbreak in Cyprus, which later expanded to more than 70 contributors producing protective face shields for hospitals, clinics and medical professionals.',
		bullets: [
			'One of the first 10 volunteers who helped form a grassroots 3D-printing initiative during the initial COVID-19 outbreak in Cyprus.',
			'Contributed to the production of protective face shields for hospitals, clinics and medical professionals.',
			'Supported an initiative that later expanded to more than 70 contributors.',
			'Designed the group’s logo used in communication channels.'
		],
		technologies: ['Artillery Sidewinder X1', 'Cura Slicer', 'Adobe Illustrator'],
	},
	{
		page: 2,
		period: '2020',
		title: 'InterPrice',
		source: 'InterPrice',
		sourceUrl: 'https://interprice.io/',
		source2: 'Web3 fintech platform developed for selected affiliates',
		sourceUrl2: 'https://digicash.synapse.gr',
		description: 'cryptocurrency wallet integration, peer-to-peer asset transfers, crypto-denominated lending,\n' +
			'and digital currency payments',
		technologies: ['Vue.js', 'Quasar Framework', 'Flutter', 'Firebase', 'Ethers.js', 'Web3'],
	},
	{
		page: 2,
		period: '2017',
		title: 'Research Projects and Payments Management System',
		source: 'Cyprus University of Technology',
		sourceUrl: 'https://www.cut.ac.cy/',
		description: 'Web-based application for payments and research projects management.',
		technologies: ['PHP', 'SQL', 'AJAX', 'jQuery'],
	},
	{
		page: 2,
		period: '2016',
		title: 'Pathfinder — Digital Art & Audiovisual Production',
		source: 'Skitali / nowwhat',
		sourceUrl: 'https://nowwhat.com.cy/projects/skitali/aboudourakis/',
		description: 'Original audiovisual artwork created for Skitali, a collaborative video-art project and digital archive supported by the Cyprus Ministry of Education and Culture',
		technologies: [
			'Steinberg Cubase',
			'Adobe Premiere Pro',
			'Nikon Camera',
			'BC Rich Beast NJ Electric Guitar',
			'Digitech GNX4',
			'Custom-Built Cello',
			'Behringer B-1 Microphone',
		],
	},
	{
		page: 2,
		period: '2016',
		title: '3D Modelling & Digitalization of Cultural Heritage content',
		source: 'APSIDA',
		sourceUrl: 'https://apsida.cut.ac.cy/collections/show/141',
		description: '3D Models of Cultural Heritage content of Cyprus aggregated into Europeana',
		technologies: ['Autodesk Maya', 'Adobe Photoshop'],
	},
	{
		page: 2,
		period: '2015',
		title: 'Complete Management System - Fasouri Watermania Waterpark',
		source: 'Fasouri Watermania Waterpark',
		description: 'Staff management - Stock Control - Machinery - Maintenance Management (Mobile First - Employees Tablets)',
		technologies: ['HTML', 'jQuery', 'SQL', 'AJAX'],
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
