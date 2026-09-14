import {useRef} from 'react';
import styles from './BeyondWork.module.scss';
import MusicWorks from './components/MusicWorks';
import ArtWork from './components/ArtWork';
import InterestActivityItem from './components/InterestActivityItem';
import InfoPopover from './components/InfoPopover';
import WorkInProgressBadge from 'src/components/core/WorkInProgressBadge/WorkInProgressBadge.tsx';
import {
	artWorkSection,
	interestsActivities,
	intro,
	musicWorksSection,
	workingTraits,
	workingTraitsSection,
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
	/** Lets the hero's WorkInProgressBadge detect and avoid overlapping the title with its tooltip — see WorkInProgressBadge.tsx's avoidElementRef. */
	const titleRef = useRef<HTMLHeadingElement | null>(null);

	return (
		<div className={styles.BeyondWork}>
			<div className={styles.ScrollArea}>
				<div className={styles.Content}>
					<header className={styles.Intro}>
						<div className={styles.EyebrowRow}>
							<p className={styles.Eyebrow}>A little more, off the résumé</p>
							<WorkInProgressBadge variant="long" avoidElementRef={titleRef}/>
						</div>
						<h1 className={styles.Title} ref={titleRef}>{intro.heading}</h1>
						<p className={styles.IntroText}>{intro.paragraph}</p>
					</header>

					<section className={styles.Section} aria-labelledby="beyond-work-music">
						<div className={styles.SectionHeadingRow}>
							<h2 className={styles.SectionHeading} id="beyond-work-music">{musicWorksSection.title}</h2>
							<InfoPopover label={musicWorksSection.title} more={musicWorksSection.more}/>
						</div>
						<p className={styles.SectionIntro}>{musicWorksSection.description}</p>
						<MusicWorks/>
					</section>

					<section className={styles.Section} aria-labelledby="beyond-work-art">
						<div className={styles.SectionHeadingRow}>
							<h2 className={styles.SectionHeading} id="beyond-work-art">{artWorkSection.title}</h2>
							<InfoPopover label={artWorkSection.title} more={artWorkSection.more}/>
						</div>
						<p className={styles.SectionIntro}>{artWorkSection.description}</p>
						<ArtWork/>
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

					<section className={styles.Section} aria-labelledby="beyond-work-outro">
						<h2 className={styles.SectionHeading} id="beyond-work-outro">{workingTraitsSection.title}</h2>
						<p className={styles.SectionIntro}>{workingTraitsSection.description}</p>

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
