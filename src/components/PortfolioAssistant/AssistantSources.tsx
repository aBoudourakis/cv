import { useNavigate } from 'react-router-dom';
import styles from './AssistantSources.module.scss';
import { ExternalLinkIcon } from 'src/components/core/Icons/Icons.tsx';
import { scrollToCvSection } from './scrollToCvSection.ts';
import type { PortfolioSource } from './types.ts';

const CATEGORY_LABELS: Record<string, string> = {
	profile: 'Profile',
	experience: 'Experience',
	skill: 'Skills',
	education: 'Education',
	certification: 'Certifications',
	award: 'Awards',
	seminar: 'Seminars',
	language: 'Languages',
	project: 'Projects',
};

function formatCategory(category: string): string {
	return CATEGORY_LABELS[category] ?? (category.charAt(0).toUpperCase() + category.slice(1));
}

interface AssistantSourcesProps {
	sources: PortfolioSource[];
}

/**
 * Renders the sources returned alongside a grounded answer. A source is only
 * ever made clickable when it carries a route/section the app actually has —
 * never fabricated (docs/Clip_bot_specification.md #12).
 */
export default function AssistantSources({ sources }: AssistantSourcesProps) {
	const navigate = useNavigate();

	if (sources.length === 0) return null;

	return (
		<div className={styles.Sources}>
			<p className={styles.SourcesLabel}>Sources</p>
			<ul className={styles.SourcesList}>
				{sources.map((source) => {
					const label = `${formatCategory(source.category)} · ${source.title}`;
					const isInternalPath = source.url?.startsWith('/');
					const isExternalUrl = source.url && !isInternalPath;

					if (isInternalPath) {
						return (
							<li key={source.id}>
								<button
									type="button"
									className={styles.SourceLink}
									onClick={() => navigate(source.url!)}
								>
									{label}
								</button>
							</li>
						);
					}

					if (source.sectionId) {
						return (
							<li key={source.id}>
								<button
									type="button"
									className={styles.SourceLink}
									onClick={() => scrollToCvSection(source.sectionId!, navigate)}
								>
									{label}
								</button>
							</li>
						);
					}

					if (isExternalUrl) {
						return (
							<li key={source.id}>
								<a
									className={styles.SourceLink}
									href={source.url}
									target="_blank"
									rel="noreferrer"
								>
									{label}
									<ExternalLinkIcon />
								</a>
							</li>
						);
					}

					return (
						<li key={source.id} className={styles.SourceText}>
							{label}
						</li>
					);
				})}
			</ul>
		</div>
	);
}
