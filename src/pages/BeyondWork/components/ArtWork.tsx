import {useState} from 'react';
import styles from './ArtWork.module.scss';
import ArtWorkLightbox from './ArtWorkLightbox';
import {artWorkSubSection1, artWorkSubSection2} from '../values';
import type {ArtWorkItem, ArtWorksSection} from '../values';

const subSections: ArtWorksSection[] = [artWorkSubSection1, artWorkSubSection2];

/**
 * "Art & Design" — a couple of lightweight subsections (Physical/Digital),
 * each a row of wide thumbnails (the source images are themselves wide
 * multi-panel process shots — sketch/painting/final, wireframe/render —
 * so a fixed-height, auto-width strip shows them at their natural shape
 * rather than cropping into a forced aspect ratio). Clicking a thumbnail
 * opens the full image in a modal (see ArtWorkLightbox.tsx) instead of
 * embedding full-resolution artwork directly in the page.
 */
export default function ArtWork() {
	const [openItem, setOpenItem] = useState<ArtWorkItem | null>(null);

	return (
		<div className={styles.ArtWork}>
			{subSections.map((subSection) => {
				if (!subSection.items || subSection.items.length === 0) return null;

				return (
					<div className={styles.SubSection} key={subSection.title}>
						<h3 className={styles.SubSectionTitle}>{subSection.title}</h3>
						{subSection.description && (
							<p className={styles.SubSectionDescription}>{subSection.description}</p>
						)}

						<div className={styles.ThumbnailRow}>
							{subSection.items.map((item) => (
								<button
									key={item.file}
									type="button"
									className={styles.Thumbnail}
									onClick={() => setOpenItem(item)}
									aria-haspopup="dialog"
								>
									<img
										src={item.file}
										alt={item.title}
										width={item.width}
										height={item.height}
										loading="lazy"
										decoding="async"
									/>
								</button>
							))}
						</div>
					</div>
				);
			})}

			{openItem && <ArtWorkLightbox item={openItem} onClose={() => setOpenItem(null)}/>}
		</div>
	);
}
