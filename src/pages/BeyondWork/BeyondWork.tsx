import styles from './BeyondWork.module.scss';
import MusicWorks from './components/MusicWorks';
import {
	creativeInterests,
	disciplines,
	disciplinesIntro,
	intro,
	workingTraits,
} from './values';

/**
 * Secondary, online-only page giving a curated glimpse beyond the CV/Portfolio
 * — hobbies, disciplines and ways of working. Deliberately editorial rather
 * than another skills list: see values.ts for the content this renders.
 *
 * Not part of the printable CV — the CV export is a static PDF asset
 * (see CVContent.tsx), so this page is naturally outside it, but the .BeyondWork
 * root also carries an explicit @media print rule (see BeyondWork.module.scss)
 * in case anything on the site ever prints the live app shell.
 */
export default function BeyondWork() {
	return (
		<div className={styles.BeyondWork}>
			<div className={styles.ScrollArea}>
				<div className={styles.Content}>
					<header className={styles.Intro}>
						<p className={styles.Eyebrow}>A little more, off the résumé</p>
						<h1 className={styles.Title}>{intro.heading}</h1>
						<p className={styles.IntroText}>{intro.paragraph}</p>
					</header>

					<section className={styles.Section} aria-labelledby="beyond-work-interests">
						<h2 className={styles.SectionHeading} id="beyond-work-interests">
							Interests &amp; Creative Work
						</h2>
						<div className={styles.EntryGroup}>
							{creativeInterests.map((entry) => (
								<div className={styles.Entry} key={entry.title}>
									<h3 className={styles.EntryTitle}>{entry.title}</h3>
									{entry.items && entry.items.length > 0 && (
										<p className={styles.EntryItems}>{entry.items.join(' · ')}</p>
									)}
									{entry.description && (
										<p className={styles.EntryDescription}>{entry.description}</p>
									)}
								</div>
							))}
						</div>
					</section>

					<MusicWorks/>

					<section className={styles.Section} aria-labelledby="beyond-work-disciplines">
						<h2 className={styles.SectionHeading} id="beyond-work-disciplines">
							Disciplines &amp; Activities
						</h2>
						<div className={styles.Entry}>
							<h3 className={styles.EntryTitle}>{disciplinesIntro.title}</h3>
							{disciplinesIntro.description && (
								<p className={styles.EntryDescription}>{disciplinesIntro.description}</p>
							)}
						</div>
						<ul className={styles.DisciplineList}>
							{disciplines.map((discipline) => (
								<li className={styles.DisciplineItem} key={discipline.title}>
									{discipline.title}
								</li>
							))}
						</ul>
					</section>

					<section className={styles.Section} aria-labelledby="beyond-work-how-i-work">
						<h2 className={styles.SectionHeading} id="beyond-work-how-i-work">
							How I Work
						</h2>
						<div className={styles.TraitGroup}>
							{workingTraits.map((trait) => (
								<div className={styles.Trait} key={trait.title}>
									<h3 className={styles.TraitTitle}>{trait.title}</h3>
									<p className={styles.TraitDescription}>{trait.description}</p>
								</div>
							))}
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}
