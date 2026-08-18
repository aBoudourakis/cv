import {useEffect, useRef} from 'react';
import styles from './CVContent.module.scss';
import {
	certificates,
	contactLinks,
	education,
	experience,
	header,
	languages,
	projects,
	seminars,
	skills,
	// totalPages,
	type ContactLink,
} from './cvData';

/** Small inline icon set used for the contact list, kept dependency-free. */
const CONTACT_ICONS: Record<ContactLink['icon'], React.ReactNode> = {
	phone: (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path
				d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.4 21 3 13.6 3 4.4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1.1l-2.2 2.2z"/>
		</svg>
	),
	email: (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path
				d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 2.2V17h16V8.2l-8 5-8-5zm.8-.2 7.2 4.5L19.2 8H4.8z"/>
		</svg>
	),
	linkedin: (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path
				d="M6.94 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM3.5 8.5h3.9V21H3.5V8.5zm6.7 0h3.74v1.71h.05c.52-.98 1.8-2.02 3.7-2.02 3.96 0 4.69 2.6 4.69 5.99V21h-3.9v-6.02c0-1.44-.03-3.28-2-3.28-2 0-2.31 1.56-2.31 3.18V21h-3.9V8.5z"/>
		</svg>
	),
	portfolio: (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path
				d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm7.94 9h-3.06c-.12-2.1-.62-4-1.34-5.4A8.02 8.02 0 0 1 19.94 11zM12 4c.9 1.1 1.7 3.2 1.94 6h-3.88C10.3 7.2 11.1 5.1 12 4zM4.06 13h3.06c.12 2.1.62 4 1.34 5.4A8.02 8.02 0 0 1 4.06 13zm3.06-2H4.06a8.02 8.02 0 0 1 4.4-5.4C7.74 7 7.24 8.9 7.12 11zM12 20c-.9-1.1-1.7-3.2-1.94-6h3.88C13.7 16.8 12.9 18.9 12 20zm2.06-1.6c.72-1.4 1.22-3.3 1.34-5.4h3.06a8.02 8.02 0 0 1-4.4 5.4z"/>
		</svg>
	),
	github: (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path
				d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.68-4.57 4.92.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2z"/>
		</svg>
	),
};

// type PageId = 1 | 2;

export default function CVContent() {
	/** REFS **/
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const pageAnchorRefs = useRef<Map<number, HTMLElement>>(new Map());

	/** STATE **/
	// const [activePage, setActivePage] = useState<number>(1);
	//
	// const pages = useMemo<PageId[]>(
	// 	() => Array.from({ length: totalPages }, (_, i) => (i + 1) as PageId),
	// 	[]
	// );

	/**
	 * Tracks which PDF page anchor is currently closest to the top of the
	 * scroll container so the page navigation indicator stays in sync while
	 * the user scrolls through the single continuous document.
	 */
	useEffect(() => {
		const root = scrollRef.current;
		if (!root) return;

		const observer = new IntersectionObserver(
			(_entries) => {
				// const visible = entries
				// 	.filter((entry) => entry.isIntersecting)
				// 	.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

				// if (visible.length > 0) {
				// 	const page = Number((visible[0].target as HTMLElement).dataset.pageAnchor);
				// 	if (!Number.isNaN(page)) setActivePage(page);
				// }
			},
			{root, rootMargin: '0px 0px -70% 0px', threshold: 0}
		);

		pageAnchorRefs.current.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, []);

	/** Registers an element as the anchor point for a given PDF page number. **/
	const registerPageAnchor = (page: number) => (el: HTMLElement | null) => {
		if (el) pageAnchorRefs.current.set(page, el);
	};

	// /** Smoothly scrolls the internal container to the anchor of the requested page. **/
	// const scrollToPage = (page: number) => {
	// 	pageAnchorRefs.current.get(page)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	// };

	/** RENDER **/
	return (
		<div className={styles.CVContent}>
			{/*<nav className={styles.pageNav} aria-label="CV page navigation">*/}
			{/*	{pages.map((page) => (*/}
			{/*		<button*/}
			{/*			key={page}*/}
			{/*			type="button"*/}
			{/*			className={`${styles.pageNavButton} ${activePage === page ? styles.pageNavButtonActive : ''}`}*/}
			{/*			onClick={() => scrollToPage(page)}*/}
			{/*			aria-current={activePage === page}*/}
			{/*		>*/}
			{/*			{page}*/}
			{/*		</button>*/}
			{/*	))}*/}
			{/*</nav>*/}

			<div className={styles.scrollArea} ref={scrollRef}>
				<header
					className={styles.cvHeader}
					id="cv-page-1"
					ref={registerPageAnchor(1)}
					data-page-anchor={1}
				>
					<p className={styles.cvEyebrow}>Curriculum Vitae</p>
					<h1 className={styles.cvName}>{header.name}</h1>
					{/*<p className={styles.cvJobTitle}>{header.title}</p>*/}
					<p className={styles.cvTagline}>{header.title}</p>
					{/*<p className={styles.cvTagline}>{header.tagline}</p>*/}
					<ul className={styles.contactList}>
						{contactLinks.map((link) => (
							<li className={styles.contactItem} key={link.label}>
								<span className={styles.contactIcon}>{CONTACT_ICONS[link.icon]}</span>
								{link.href ? (
									<a className={styles.contactLink} href={link.href} target="_blank" rel="noreferrer">
										{link.label}
									</a>
								) : (
									<span className={styles.contactText}>{link.label}</span>
								)}
							</li>
						))}
					</ul>
				</header>

				<section className={styles.cvSection}>
					<h2 className={styles.sectionHeading}>Work Experience</h2>
					{experience.map((item) => (
						<article className={styles.entry} key={`${item.company}-${item.period}`}>
							<div className={styles.entryPeriod}>
								{item.period}
							</div>
							<div className={styles.entryBody}>
								<div className={styles.entryTitle}>{item.title}</div>
								<div className={styles.entryOrg}>
									{item.companyUrl ? (
										<a className={styles.entryLink} href={item.companyUrl} target="_blank" rel="noreferrer">
											{item.company}
										</a>
									) : (
										<span>{item.company}</span>
									)}
									{item.location && <span className={styles.entryLocation}>{item.location}</span>}
								</div>
								{item.bullets.length > 0 && (
									<ul className={styles.bulletList}>
										{item.bullets.map(((bullet: string | any, experienceBulletIndex: number) => (
											<li className={styles.bulletItem}
											    key={`${item.company}-experience-bullet-${experienceBulletIndex}`}>
												{typeof bullet === 'string' ? bullet : bullet.name ? (
													<a className={styles.entryLink} href={bullet.url} target="_blank" rel="noreferrer" title={bullet.description}>
														{bullet.name}
													</a>
												) : (
													<span>{bullet.url}</span>
												)}
											</li>
										)))}
									</ul>
								)}
							</div>
						</article>
					))}
				</section>

				<section className={styles.cvSection}>
					<h2 className={styles.sectionHeading}>IT Skills</h2>
					<div className={styles.skillGrid}>
						{skills.map((category, index) => {
							const isPageBreak = index > 0 && category.page !== skills[index - 1].page;
							return (
								<div className={styles.skillGroup} key={category.label}>
									{isPageBreak && (
										<span
											className={styles.pageAnchor}
											id={`cv-page-${category.page}`}
											ref={registerPageAnchor(category.page)}
											data-page-anchor={category.page}
										/>
									)}
									<h3 className={styles.skillGroupTitle}>{category.label}</h3>
									<ul className={styles.skillList}>
										{category.items.map((skill) => (
											<li className={styles.skillItem} key={skill}>
												{skill}
											</li>
										))}
									</ul>
								</div>
							);
						})}
					</div>
				</section>

				<section className={styles.cvSection}>
					<h2 className={styles.sectionHeading}>Academics</h2>

					<h3 className={styles.subsectionHeading}>Education</h3>
					{education.map((item) => (
						<article className={styles.entry} key={`${item.title}-${item.period}`}>
							<div className={styles.entryHead}>
								<span className={styles.entryPeriod}>{item.period}</span>
								<h4 className={styles.entryTitle}>{item.title}</h4>
							</div>
							<p className={styles.entryOrg}>
								{item.institutionUrl ? (
									<a className={styles.entryLink} href={item.institutionUrl} target="_blank" rel="noreferrer">
										{item.institution}
									</a>
								) : (
									<span>{item.institution}</span>
								)}
							</p>
							{item.thesis && <p className={styles.entryNote}>Thesis: {item.thesis}</p>}
						</article>
					))}

					{certificates.map((item) => (
						<article className={styles.entry} key={`${item.title}-${item.period}`}>
							<div className={styles.entryHead}>
								<span className={styles.entryPeriod}>{item.period}</span>
								<h4 className={styles.entryTitle}>{item.title}</h4>
							</div>
							<p className={styles.entryOrg}>
								{item.institutionUrl ? (
									<a className={styles.entryLink} href={item.institutionUrl} target="_blank" rel="noreferrer">
										{item.institution}
									</a>
								) : (
									<span>{item.institution}</span>
								)}
							</p>
						</article>
					))}

					<h3 className={styles.subsectionHeading}>Seminars</h3>
					{seminars.map((item) => (
						<article className={styles.entry} key={`${item.title}-${item.year}`}>
							<div className={styles.entryHead}>
								<span className={styles.entryPeriod}>{item.year}</span>
								<h4 className={styles.entryTitle}>{item.title}</h4>
							</div>
							{item.description && <p className={styles.entryNote}>{item.description}</p>}
						</article>
					))}

					<h3 className={styles.subsectionHeading}>Languages</h3>
					<ul className={styles.languageList}>
						{languages.map((item) => (
							<li className={styles.languageItem} key={item.language}>
								<span className={styles.languageName}>{item.language}</span>
								<span className={styles.languageLevel}>{item.level}</span>
							</li>
						))}
					</ul>
				</section>

				<section className={styles.cvSection}>
					<h2 className={styles.sectionHeading}>Projects</h2>
					{projects.map((item) => (
						<article className={styles.entry} key={item.title}>
							<div className={styles.entryHead}>
								<span className={styles.entryPeriod}>{item.period}</span>
								<h3 className={styles.entryTitle}>{item.title}</h3>
							</div>
							<p className={styles.entryOrg}>
								{item.sourceUrl ? (
									<a className={styles.entryLink} href={item.sourceUrl} target="_blank" rel="noreferrer">
										{item.source}
									</a>
								) : (
									<span>{item.source}</span>
								)}
							</p>
							<p className={styles.entryNote}>{item.description}</p>
						</article>
					))}
				</section>
			</div>
		</div>
	);
}
