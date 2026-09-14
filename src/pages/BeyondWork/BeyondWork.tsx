import styles from './BeyondWork.module.scss';
import MusicWorks from './components/MusicWorks';
import InterestActivityItem from './components/InterestActivityItem';
import {
	interestsActivities,
	intro, musicWorksIntro,
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

					<section className={styles.Section} aria-labelledby="beyond-work-music">
						<h2 className={styles.SectionHeading} id="beyond-work-music">Music &amp; Composition</h2>
						<p className={styles.SectionIntro}>{musicWorksIntro}</p>
					<MusicWorks/>
					</section>

					<section className={styles.Section} aria-labelledby="beyond-work-interests-activities">
						<h2 className={styles.SectionHeading} id="beyond-work-interests-activities">
							Interests &amp; Activities
						</h2>
						<ul className={styles.ActivityList}>
							{interestsActivities.map((activity) => (
								<InterestActivityItem activity={activity} key={activity.name}/>
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
