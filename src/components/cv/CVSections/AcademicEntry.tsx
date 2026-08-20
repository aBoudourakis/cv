import type {ReactNode} from "react";
import styles from "./CVSections.module.scss";

interface IAcademicEntryProps {
	period?: string;
	title: string;
	subtitle?: string | ReactNode;
	institution?: string;
	institutionUrl?: string;
	location?: string;
}

export default function AcademicEntry({
	                                      period,
	                                      title,
	                                      subtitle,
	                                      institution,
	                                      institutionUrl,
	                                      location
                                      }: IAcademicEntryProps) {
	if (!period || !title) return null;

	return (
		<article className={styles.AcademicEntry}>
			<div className={styles.Period}>{period}</div>
			<div className={styles.Content}>
				<div className={styles.Title}>{title}</div>
				{subtitle && <div className={styles.Subtitle}>{subtitle}</div>}
				<div className={styles.Institution}>
					{institutionUrl ? (
						<a href={institutionUrl} target="_blank" rel="noopener noreferrer">
							{institution}
						</a>
					) : (
						institution
					)}
				</div>
				<div className={styles.Location}>{location}</div>
			</div>
		</article>
	);
}