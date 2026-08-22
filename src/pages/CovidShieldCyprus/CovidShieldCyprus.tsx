import styles from './CovidShieldCyprus.module.scss';
import {galleryImages, logoImage} from './covidShieldCyprusData';

/**
 * Standalone, deliberately unbranded page for the COVID-19 Shield Cyprus volunteer
 * initiative. Rendered through BlankLayout (no app navigation/branding) — see
 * router configuration in main.tsx.
 */
export default function CovidShieldCyprus() {
	return (
		<div className={styles.CovidShieldCyprus}>
			<header className={styles.Intro}>
				<div className={styles.HeaderRow}>
					<img
						className={styles.Logo}
						src={logoImage.src}
						alt={logoImage.alt}
						width={logoImage.width}
						height={logoImage.height}
						loading="eager"
						decoding="async"
					/>

					<div className={styles.Heading}>
						<h1 className={styles.Title}>COVID-19 Shield Cyprus</h1>
						<p className={styles.Subtitle}>Community Volunteer Initiative · 2020</p>
					</div>
				</div>

				<div className={styles.Description}>
					<p className={styles.Paragraph}>
						During the initial COVID-19 outbreak in Cyprus, I was one of the first 10 volunteers who
						helped form a grassroots initiative focused on producing and supplying 3D-printed
						protective face shields for hospitals, clinics, doctors and frontline medical staff. The
						initiative later expanded to approximately 100 contributors.
					</p>

					<p className={styles.Paragraph}>
						My contribution included 3D printing face-shield components, supporting the preparation
						and distribution process, and creating the initiative's logo and delivery-label visual
						identity.
					</p>
				</div>
			</header>

			<section className={styles.Gallery} aria-label="Photo gallery">
				{galleryImages.map((image) => (
					<figure className={styles.GalleryItem} key={image.number}>
						<img
							className={styles.GalleryImage}
							src={image.src}
							alt={image.alt}
							width={image.width}
							height={image.height}
							loading="lazy"
							decoding="async"
						/>
					</figure>
				))}
			</section>
		</div>
	);
}
