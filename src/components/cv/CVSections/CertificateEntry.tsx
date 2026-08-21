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
			<div className={styles.Year}>{year}</div>
			<div className={styles.Content}>
				<div className={styles.Title}>
					{link && link.length > 0 ? (
						<a
							href={
								link.startsWith('http://') ||
								link.startsWith('https://') ||
								link.startsWith('/')
									? link
									: `https://${link}`
							}
							target="_blank"
							rel="noopener noreferrer"
						>
							<span style={{marginLeft: '-24px'}}>🔗</span> {title}
						</a>
					) : (
						title
					)}
				</div>
				{subtitle && <div className={styles.Subtitle}>{subtitle}</div>}
				{description && <div className={styles.Description}>{description}</div>}
				{issuer && <div className={styles.Issuer}>{issuer}</div>}
				{organization && <div className={styles.Organization}>{organization}</div>}
			</div>
		</article>
	);
}