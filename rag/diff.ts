/**
 * Pure content-hashing/diffing logic extracted from rag/ingest.ts so it can be
 * unit-tested without a live Supabase connection or embedding-provider calls
 * (rag/__tests__/diff.test.ts). No behaviour change from the inline version
 * this replaced — same sha256-of-content hash, same unchanged/changed/delete
 * partitioning.
 */

import { createHash } from 'node:crypto';
import type { PortfolioChunk } from './types.ts';

export function hashContent(content: string): string {
	return createHash('sha256').update(content).digest('hex');
}

export interface ExistingRow {
	id: string;
	content_hash: string;
}

export interface ChunkDiff {
	/** Chunks whose id already exists in portfolio_documents with a matching content_hash — skipped, no embedding call. */
	unchanged: PortfolioChunk[];
	/** New chunks, or existing ones whose content changed — (re-)embedded and upserted. */
	changed: { chunk: PortfolioChunk; hash: string }[];
	/** Ids present in portfolio_documents but no longer produced by the current chunk set — deleted. */
	idsToDelete: string[];
}

/**
 * Partitions `chunks` (the full current set — public CV + enabled
 * assistant_knowledge rows) against the existing portfolio_documents rows by
 * comparing sha256 content hashes, so ingestion only (re-)embeds what
 * actually changed.
 */
export function diffChunks(chunks: PortfolioChunk[], existingRows: ExistingRow[]): ChunkDiff {
	const existingHashById = new Map(existingRows.map((row) => [row.id, row.content_hash]));
	const ids = new Set(chunks.map((chunk) => chunk.id));

	const unchanged: PortfolioChunk[] = [];
	const changed: { chunk: PortfolioChunk; hash: string }[] = [];

	for (const chunk of chunks) {
		const hash = hashContent(chunk.content);
		if (existingHashById.get(chunk.id) === hash) {
			unchanged.push(chunk);
		} else {
			changed.push({ chunk, hash });
		}
	}

	const idsToDelete = existingRows.map((row) => row.id).filter((id) => !ids.has(id));

	return { unchanged, changed, idsToDelete };
}
