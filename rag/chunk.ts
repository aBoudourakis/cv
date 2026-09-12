/**
 * Builds RAG knowledge-base chunks directly from the existing structured CV
 * data (`src/components/cv/cvData.ts`) — this is the single source of truth
 * for both the CV UI and the RAG ingestion pipeline; nothing here duplicates
 * or edits that file.
 *
 * Design notes (see docs/RAG Portfolio Assistant Implementation Specification.md, §6-8):
 * - `certificates` and `certificates2` (two arrays sharing one type in
 *   cvData.ts) are merged here into one credential list, tagged as
 *   'award' when `subtitle === 'Award'` and 'certification' otherwise —
 *   cvData.ts itself is left untouched.
 * - `sectionId` uses the live CVContent.tsx anchors (cv-profile, cv-experience,
 *   cv-skills, cv-education, cv-certifications, cv-projects) so a chat source
 *   can scroll to the right part of the site; the original PDF `page` is kept
 *   in `metadata` for reference only.
 * - Sparse skill categories (Platforms, Multimedia, 3D & Spatial Design) are
 *   combined into one "Additional Tools & Interests" chunk since each is well
 *   under the ~200-500 token/chunk target on its own.
 */

import {
	certificates,
	certificates2,
	education,
	experience,
	header,
	languages,
	projects,
	seminars,
	skills,
	type BulletItem,
} from '../src/components/cv/cvData.ts';
import type { PortfolioChunk } from './types.ts';

function slugify(value: string): string {
	return value
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '') // strip diacritics
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function flattenBullets(bullets: BulletItem[] = []): string[] {
	return bullets.map((bullet) =>
		typeof bullet === 'string' ? bullet : `${bullet.name} — ${bullet.description}`,
	);
}

const SKILLS_MERGED_ID = 'skill-additional-tools-and-interests';
const SKILLS_MERGE_LABELS = new Set(['Platforms', 'Multimedia', '3D & Spatial Design']);

export function buildChunks(): PortfolioChunk[] {
	const chunks: PortfolioChunk[] = [];

	// --- Profile -----------------------------------------------------------
	chunks.push({
		id: 'profile',
		category: 'profile',
		title: `${header.name} — Profile`,
		sectionId: 'cv-profile',
		metadata: { page: header.page },
		content: `${header.name} is a ${header.title} (${header.tagline}). ${header.summary}`,
	});

	// --- Experience ----------------------------------------------------------
	for (const item of experience) {
		const bulletText = flattenBullets(item.bullets).join(' ');
		chunks.push({
			id: `experience-${slugify(item.company)}`,
			category: 'experience',
			title: `${item.title} at ${item.company}`,
			source: item.company,
			sourceUrl: item.companyUrl,
			sectionId: 'cv-experience',
			metadata: { period: item.period, location: item.location, page: item.page },
			content:
				`${item.title} at ${item.company}` +
				(item.location ? ` (${item.location})` : '') +
				`, ${item.period}. ${bulletText}`,
		});
	}

	// --- Skills --------------------------------------------------------------
	const mergedSkillItems: string[] = [];
	const mergedSkillLabels: string[] = [];
	for (const category of skills) {
		if (SKILLS_MERGE_LABELS.has(category.label)) {
			mergedSkillItems.push(...category.items);
			mergedSkillLabels.push(category.label);
			continue;
		}
		chunks.push({
			id: `skill-${category.id ?? slugify(category.label)}`,
			category: 'skill',
			title: category.label,
			sectionId: 'cv-skills',
			metadata: { page: category.page },
			content: `${category.label}: ${category.items.join(', ')}.`,
		});
	}
	if (mergedSkillItems.length > 0) {
		chunks.push({
			id: SKILLS_MERGED_ID,
			category: 'skill',
			title: 'Additional Tools & Interests',
			sectionId: 'cv-skills',
			metadata: { mergedFrom: mergedSkillLabels },
			content: `Additional tools and interests (${mergedSkillLabels.join(', ')}): ${mergedSkillItems.join(', ')}.`,
		});
	}

	// --- Education -------------------------------------------------------------
	for (const item of education) {
		chunks.push({
			id: `education-${slugify(item.institution)}-${slugify(item.period)}`,
			category: 'education',
			title: item.title,
			source: item.institution,
			sourceUrl: item.institutionUrl,
			sectionId: 'cv-education',
			metadata: { period: item.period, location: item.location, page: item.page },
			content:
				`${item.title}, ${item.institution} (${item.location}), ${item.period}.` +
				(item.thesis ? ` ${item.thesis}` : ''),
		});
	}

	// --- Certifications & Awards (certificates + certificates2, merged) --------
	// `certificates` renders under the Education section in the live CV;
	// `certificates2` renders under its own "Certificates & Awards" section —
	// section_id below reflects where each one actually appears on the site.
	for (const item of certificates) {
		const yearOrPeriod = item.year ?? item.period ?? '';
		chunks.push({
			id: `credential-${slugify(item.title)}-${slugify(yearOrPeriod)}`,
			category: 'certification',
			title: item.title,
			source: item.institution,
			sourceUrl: item.institutionUrl ?? item.link,
			sectionId: 'cv-education',
			metadata: { period: item.period, year: item.year, location: item.location, page: item.page },
			content:
				`${item.title}${item.subtitle ? `: ${item.subtitle}` : ''}, ${item.institution ?? ''} (${yearOrPeriod}).` +
				(item.description ? ` ${item.description}` : ''),
		});
	}
	for (const item of certificates2) {
		const yearOrPeriod = item.year ?? item.period ?? '';
		const isAward = item.subtitle === 'Award';
		const sourceLabel = item.issuer ?? item.organization ?? item.institution;
		chunks.push({
			id: `credential-${slugify(item.title)}-${slugify(yearOrPeriod)}`,
			category: isAward ? 'award' : 'certification',
			title: item.title,
			source: sourceLabel,
			sourceUrl: item.link ?? item.institutionUrl,
			sectionId: 'cv-certifications',
			metadata: { period: item.period, year: item.year, location: item.location, page: item.page, subtitle: item.subtitle },
			content:
				`${item.title}${!isAward && item.subtitle ? ` (${item.subtitle})` : ''}, issued by ${sourceLabel ?? 'unknown'} (${yearOrPeriod}).` +
				(item.description ? ` ${item.description}` : ''),
		});
	}

	// --- Seminars ----------------------------------------------------------------
	for (const item of seminars) {
		chunks.push({
			id: `seminar-${slugify(item.title)}`,
			category: 'seminar',
			title: item.title,
			sectionId: 'cv-education',
			metadata: { year: item.year, page: item.page },
			content: `${item.title} (${item.year}).${item.description ? ` ${item.description}` : ''}`,
		});
	}

	// --- Languages (single combined chunk — short, no benefit to splitting) ------
	chunks.push({
		id: 'languages',
		category: 'language',
		title: 'Languages',
		sectionId: 'cv-education',
		content: `Languages: ${languages.map((item) => `${item.language} (${item.level})`).join(', ')}.`,
	});

	// --- Projects ------------------------------------------------------------------
	for (const item of projects) {
		// The COVID-19 initiative's third link is an on-site route — prefer that as
		// the clickable source_url over the external news/Facebook links, but keep
		// the primary `source` label (e.g. "News Page") rather than swapping in
		// source3's label ("Photographic Footage"), which reads poorly as a citation.
		const sourceUrl = item.sourceUrl3 ?? item.sourceUrl;
		const source = item.source;
		const bulletText = flattenBullets(item.bullets).join(' ');
		chunks.push({
			id: `project-${slugify(item.title)}`,
			category: 'project',
			title: item.title,
			source,
			sourceUrl,
			sectionId: 'cv-projects',
			metadata: {
				period: item.period,
				page: item.page,
				links: [
					{ label: item.source, url: item.sourceUrl },
					{ label: item.source2, url: item.sourceUrl2 },
					{ label: item.source3, url: item.sourceUrl3 },
				].filter((link) => link.label && link.url),
			},
			content: `${item.title} (${item.period}).${item.description ? ` ${item.description}` : ''} ${bulletText}`.trim(),
		});
	}

	return chunks;
}
