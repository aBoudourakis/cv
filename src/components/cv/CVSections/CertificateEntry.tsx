import styles from './CVSections.module.scss';

interface ICertificateEntryProps {
	page?: number;
	title: string;
	subtitle?: string;
	description?: string;
	year?: string;
	link?: string;
	issuer?: string;
	organization?: string;
}

export default function CertificateEntry({
	title,
  subtitle,
  description,
	year,
  link,
  issuer,
  organization
}: ICertificateEntryProps) {
	return (
		<article className={styles.CertificateEntry}>
			<div className={styles.Title}>{title}</div>
			{subtitle && <div className={styles.Subtitle}>{subtitle}</div>}
			{description && <div className={styles.Description}>{description}</div>}
			{year && <div className={styles.Year}>{year}</div>}
			{link && <div className={styles.Link}>{link}</div>}
			{issuer && <div className={styles.Issuer}>{issuer}</div>}
			{organization && <div className={styles.Organization}>{organization}</div>}
		</article>
	);
}