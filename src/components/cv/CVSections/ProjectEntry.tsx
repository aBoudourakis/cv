import styles from './CVSections.module.scss';

interface IProjectEntryProps {
	page?: number;
	period: string;
	title: string;
	source: string;
	sourceUrl?: string;
	source2?: string;
	sourceUrl2?: string;
	description: string;
}

export default function ProjectEntry({
	period, title, source, sourceUrl, source2, sourceUrl2, description
                                     }:IProjectEntryProps) {
  return <div className={styles.ProjectEntry}>
	  <div className={styles.Period}>{period}</div>
	  <div className={styles.Content}>
		  <div className={styles.Title}>{title}</div>
		  <div className={styles.Subtitle}>
			  <a className={styles.SourceLink} href={sourceUrl} target="_blank" rel="noopener noreferrer">
				  {source}
			  </a>
		  </div>
		  {sourceUrl2 && sourceUrl2.length > 0 && source2 && source2.length > 0 && (
			  <div className={styles.Subtitle}>
				  <a className={styles.SourceLink} href={sourceUrl2} target="_blank" rel="noopener noreferrer">
					  {source2}
				  </a>
			  </div>
		  )}
		  <div className={styles.Description}>{description}</div>
	  </div>
  </div>;
}