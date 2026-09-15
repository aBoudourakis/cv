import styles from './CVSections.module.scss';
import {ExternalLinkIcon} from "src/components/core/Icons/Icons.tsx";

interface IProjectEntryProps {
	page?: number;
	period: string;
	title: string;
	source?: string;
	sourceUrl?: string;
	source2?: string;
	sourceUrl2?: string;
	source3?: string;
	sourceUrl3?: string;
	description?: string;
	technologies?: string[] | string;
}

/** Array entries are joined visually with the same `·` separator used by string entries entered as-is. */
function formatTechnologies(technologies?: string[] | string): string | undefined {
	if (!technologies) return undefined;
	return Array.isArray(technologies) ? technologies.join(' · ') : technologies;
}

export default function ProjectEntry({
	period, title, source, sourceUrl, source2, sourceUrl2, source3, sourceUrl3, description, technologies
                                     }:IProjectEntryProps) {
  const technologiesText = formatTechnologies(technologies);

  return <div className={styles.ProjectEntry}>
	  <div className={styles.Period}>{period}</div>
	  <div className={styles.Content}>
		  <div className={styles.Title}>{title}</div>
		  <div className={styles.Subtitle}>
			  {sourceUrl && <a className={styles.SourceLink} href={sourceUrl} target="_blank" rel="noopener noreferrer">
				  {source}
				  <ExternalLinkIcon/>
			  </a>}
		  </div>
		  {sourceUrl2 && sourceUrl2.length > 0 && source2 && source2.length > 0 && (
			  <div className={styles.Subtitle}>
				  <a className={styles.SourceLink} href={sourceUrl2} target="_blank" rel="noopener noreferrer">
					  {source2}
					  <ExternalLinkIcon/>
				  </a>
			  </div>
		  )}
		  {sourceUrl3 && sourceUrl3.length > 0 && source3 && source3.length > 0 && (
			  <div className={styles.Subtitle}>
				  <a className={styles.SourceLink} href={sourceUrl3} target="_blank" rel="noopener noreferrer">
					  {source3}
					  <ExternalLinkIcon/>
				  </a>
			  </div>
		  )}
		  <div className={styles.Description}>{description}</div>
		  {technologiesText && <div className={styles.Technologies}>{technologiesText}</div>}
	  </div>
  </div>;
}