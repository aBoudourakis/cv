import {useEffect, useMemo, useRef, useState} from 'react';
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
	certificates2,
	type ContactLink,
} from './cvData';
import SkillEntry from "src/components/cv/CVSections/SkillEntry.tsx";
import AcademicEntry from "src/components/cv/CVSections/AcademicEntry.tsx";
import SeminarEntry from "src/components/cv/CVSections/SeminarEntry.tsx";
import LanguageEntry from "src/components/cv/CVSections/LanguageEntry.tsx";
import ProjectEntry from "src/components/cv/CVSections/ProjectEntry.tsx";
import CertificateEntry from "src/components/cv/CVSections/CertificateEntry.tsx";
import {ExternalLinkIcon, PlayIcon} from "src/components/core/Icons/Icons.tsx";

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

/** Sections surfaced in the discreet CV section index (desktop side rail / mobile tab strip). */
const SECTION_NAV = [
	{id: 'cv-profile', label: 'Profile'},
	{id: 'cv-experience', label: 'Experience'},
	{id: 'cv-skills', label: 'Technical Skills'},
	{id: 'cv-education', label: 'Education'},
	{id: 'cv-certifications', label: 'Certifications'},
	{id: 'cv-projects', label: 'Projects'},
] as const;

type SectionId = typeof SECTION_NAV[number]['id'];

/** Resolves whether a bullet/link points at a YouTube video, to show a play affordance instead of an external-link one. */
function isVideoLink(url: string) {
	return url.includes('youtube') || url.includes('youtu.be');
}

export default function CVContent() {
	/** REFS **/
	const scrollRef = useRef<HTMLDivElement | null>(null);
	const sectionRefs = useRef<Map<SectionId, HTMLElement>>(new Map());

	/** STATE **/
	const [activeSection, setActiveSection] = useState<SectionId>(SECTION_NAV[0].id);

	const prefersReducedMotion = useMemo(
		() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
		[]
	);

	/** Tracks the last section anchor to cross the activation line while scrolling. */
	useEffect(() => {
		const root = scrollRef.current;
		if (!root) return;

		const updateActiveSection = () => {
			const activationLine = root.getBoundingClientRect().top + root.clientHeight * 0.3;
			let currentSection: SectionId = SECTION_NAV[0].id;

			SECTION_NAV.forEach(({id}) => {
				const section = sectionRefs.current.get(id);
				if (section && section.getBoundingClientRect().top <= activationLine) {
					currentSection = id;
				}
			});

			setActiveSection(currentSection);
		};

		updateActiveSection();
		root.addEventListener('scroll', updateActiveSection, {passive: true});
		window.addEventListener('resize', updateActiveSection);

		return () => {
			root.removeEventListener('scroll', updateActiveSection);
			window.removeEventListener('resize', updateActiveSection);
		};
	}, []);

	/** Registers an element as the anchor point for a given CV section. **/
	const registerSection = (id: SectionId) => (el: HTMLElement | null) => {
		if (el) sectionRefs.current.set(id, el);
	};

	/** Smoothly scrolls the internal container to the requested section, respecting reduced-motion preference. **/
	const scrollToSection = (id: SectionId) => {
		sectionRefs.current.get(id)?.scrollIntoView({
			behavior: prefersReducedMotion ? 'auto' : 'smooth',
			block: 'start',
		});
	};

	/** RENDER **/
	return (
		<div className={styles.CVContent}>
			<nav className={styles.sectionNav} aria-label="CV section navigation">
				{SECTION_NAV.map((section) => (
					<button
						key={section.id}
						type="button"
						className={`${styles.sectionNavButton} ${activeSection === section.id ? styles.sectionNavButtonActive : ''}`}
						onClick={() => scrollToSection(section.id)}
						aria-current={activeSection === section.id ? 'true' : undefined}
					>
						{section.label}
					</button>
				))}
			</nav>

			<div className={styles.scrollArea} ref={scrollRef}>
				<header
					className={styles.cvHeader}
					id="cv-profile"
					ref={registerSection('cv-profile')}
				>
					<p className={styles.cvEyebrow}>Curriculum Vitae</p>
					<h1 className={styles.cvName}>{header.name}</h1>
					<p className={styles.cvJobTitle}>{header.title}</p>
					<p className={styles.cvSummary}>{header.summary}</p>
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

				<section className={styles.cvSection} id="cv-experience" ref={registerSection('cv-experience')}>
					<h2 className={styles.sectionHeading}>Work Experience</h2>
					{experience.map((item) => (
						<article className={styles.entry} key={`${item.company}-${item.period}`}>
							<div className={styles.entryPeriod}>
								{item.period}
							</div>
							<div className={styles.entryHead}>
								<div className={styles.entryOrg}>
									{item.companyUrl ? (
										<a className={styles.entryCompanyLink} href={item.companyUrl} target="_blank" rel="noreferrer">
											{item.company}
											<ExternalLinkIcon/>
										</a>
									) : (
										<span className={styles.entryCompany}>{item.company}</span>
									)}
									{item.location && <span className={styles.entryLocation}>{item.location}</span>}
								</div>
								<div className={styles.entryTitle}>{item.title}</div>
							</div>
							<div className={styles.entryBody}>
								{item.bullets.length > 0 && (
									<ul className={styles.bulletList}>
										{item.bullets.map(((bullet: string | any, experienceBulletIndex: number) => (
											<li className={styles.bulletItem}
											    key={`${item.company}-experience-bullet-${experienceBulletIndex}`}>
												{typeof bullet === 'string' ? bullet : bullet.name ? (
													<a className={styles.entryLink} href={bullet.url} target="_blank" rel="noreferrer"
													   title={bullet.description}>
														{isVideoLink(bullet.url) ? <PlayIcon/> : null}
														{bullet.name}
														{!isVideoLink(bullet.url) && <ExternalLinkIcon/>}
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

				<section className={styles.cvSection} id="cv-skills" ref={registerSection('cv-skills')}>
					<h2 className={styles.sectionHeading}>Technical Skills</h2>
					<div className={styles.skillGroups}>
						{skills.map((category) => (
							<div className={styles.skillGroup} key={category.label}>
								<SkillEntry skill={category}/>
							</div>
						))}
					</div>
				</section>

				<section className={styles.cvSection} id="cv-education" ref={registerSection('cv-education')}>
					<h2 className={styles.sectionHeading}>Education</h2>

					{education.map((item) => (
						<AcademicEntry
							period={item.period}
							title={item.title}
							subtitle={item.thesis}
							institution={item.institution}
							institutionUrl={item.institutionUrl}
							location={item.location}
							key={`${item.title}-${item.period}`}
						/>
					))}

					{certificates.map((item) => (
						<AcademicEntry
							period={item.period}
							title={item.title}
							subtitle={item.subtitle}
							institution={item.institution}
							institutionUrl={item.institutionUrl}
							location={item.location}
							key={`${item.title}-${item.period}`}
						/>
					))}

					<h3 className={styles.subsectionHeading}>Seminars</h3>
					{seminars.map((item) => (
						<SeminarEntry
							key={`${item.title}-${item.year}`}
							period={item.year}
							title={item.title}
							subtitle={item.description}
						/>
					))}

					<h3 className={styles.subsectionHeading}>Languages</h3>
					<ul className={styles.languageList}>
						{languages.map((item) => (
							<LanguageEntry
								key={`lanuage-entry-key-${item.language}`}
								language={item.language}
								level={item.level}
							/>
						))}
					</ul>
				</section>

				<section className={styles.cvSection} id="cv-certifications" ref={registerSection('cv-certifications')}>
					<h2 className={styles.sectionHeading}>Certificates & Awards</h2>
					<div className={styles.skillList}>
						{certificates2.map((certificate) => (
							<CertificateEntry
								key={`${certificate.title}-${certificate.year}`}
								title={certificate.title}
								subtitle={certificate.subtitle}
								description={certificate.description}
								year={certificate.year}
								link={certificate.link}
								issuer={certificate.issuer}
								organization={certificate.organization}
							/>
						))}
					</div>
				</section>

				<section className={styles.cvSection} ref={registerSection('cv-projects')} id="cv-projects">
					<h2 className={styles.sectionHeading}>Projects</h2>
					{projects.map((item) => (
						<ProjectEntry
							key={`${item.title}-${item.period}`}
							period={item.period}
							title={item.title}
							source={item.source}
							source2={item.source2}
							sourceUrl={item.sourceUrl}
							sourceUrl2={item.sourceUrl2}
							source3={item.source3}
							sourceUrl3={item.sourceUrl3}
							description={item.description}
						/>
					))}
				</section>
			</div>
		</div>
	);
}
