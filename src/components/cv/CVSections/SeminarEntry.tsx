import styles from './CVSections.module.scss';

interface ISeminarEntryProps {
	page?: number;
	period: string;
	title: string;
	subtitle?: string;
}

export default function SeminarEntry(
	{period, title, subtitle}: ISeminarEntryProps
) {
	/** RENDER **/
	if (!period || !title) return null;

	return (
		<article className={styles.SeminarEntry}>
			<div className={styles.Period}>
				{period}</div>
			<div className={styles.Content}>
				<div className={styles.Label}>{title}</div>
				{subtitle && <div className={styles.Subtitle}>{subtitle}</div>}
			</div>
		</article>
	);
}