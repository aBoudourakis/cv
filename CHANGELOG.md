# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.2] - 2026-09-12

### Added

- "Clip" mascot now uses illustrated artwork (`public/images/Clip/`) instead of a hand-drawn SVG, with dedicated idle/hover/thinking/focused states.
- Idle blink cycle: eyes open for ~3s, then blink quickly through closing → closed → closing before returning to idle, looping continuously.
- Persistent gold ring badge behind the launcher icon, sized and positioned independently of the mascot so it stays visible and matches the reference concept art.

### Changed

- Source artwork re-encoded as 360px WebP for the assets actually loaded at runtime (~5.9MB → ~208KB across all states); original PNGs kept as source material.
- Enlarged the launcher mascot (~75%) and tuned the ring's size, position, and hover opacity/transition for better visual balance.

## [1.2.2] - 2026-09-12

### Added

- Floating "Clip" portfolio assistant: launcher, panel, suggested questions, chat messages, source citations, and AI-use disclosure (see `docs/Clip_bot_specification.md`).
- Original SVG mascot with idle/hover/thinking/open states, large expressive eyes, eyebrows, nose and mouth rendered as bent wire (superseded by illustrated artwork in 1.3.x).
- Vitest + Testing Library test suite covering the assistant UI (open/close, focus handling, suggested questions, loading/error/rate-limit states, source rendering).

### Changed

- `portfolio-chat` Edge Function generation switched from Anthropic to Mistral (pinned to `mistral-small-2603`, not a `-latest` alias) behind a `GENERATION_PROVIDER` switch; Anthropic kept as a fallback path rather than removed.
- Grounding system prompt tightened to stop the model from emitting inline markdown citations, since sources are already rendered separately in the UI.

### Fixed

- Missing database sequence grants (`rag_request_log_id_seq`, `rag_analytics_events_id_seq`) that silently broke rate limiting after the previous migration.

## [1.1.1] - 2026-09-12

### Added

- Retrieval-augmented generation backend for the portfolio assistant: Supabase Postgres + pgvector schema, `match_portfolio_documents` similarity search, and the `portfolio-chat` Edge Function (request validation, retrieval, grounded generation, source metadata).
- Deterministic knowledge-base ingestion pipeline (`rag/chunk.ts`, `rag/ingest.ts`, `rag/embeddings.ts`, `rag/search.ts`) driven by the existing CV data.
- Per-visitor and site-wide rate limiting, a server-side kill switch, and best-effort anonymous usage analytics.

## [1.0.23] - 2026-09-11

_Consolidated summary of `1.0.1`–`1.0.23`, released incrementally between 2026-08-22 and 2026-09-11._

### Added

- Download button for the CV PDF, and a "Projects" section navigation anchor with scroll-spy.
- GitHub Pages deployment workflow (`.github/workflows/deploy.yml`).

### Changed

- Numerous content, terminology, and structural refinements to `cvData.ts` and the CV section components (experience, certificates, education, projects).
- Section navigation, scrollbar, and brand-wordmark styling adjusted for readability and cross-browser consistency (notably Chrome's `color-scheme` handling).

### Fixed

- Routing edge cases around `/CV` vs `/cv` and the catch-all redirect.
- Assorted copy fixes (contributor counts, award/certificate categorization, terminology).

## [1.0.0] - 2026-08-21

### Added

- Initial production release of the CV web app: profile, work experience, technical skills, education, certificates & awards, languages, seminars, and projects sections.
- Portfolio page rendering selected work-sample images, and a dedicated COVID-19 Protective Face Shield Initiative case-study page.
- Light/dark theme support with a persistent theme switch.

## [0.2.5] - 2026-08-21

_Consolidated summary of `0.2.0`–`0.2.5`._

### Added

- Certificate, language, project, and seminar entry components, and the certificate/work-sample PDF assets they reference.
- Portfolio PDF viewer.

## [0.1.3] - 2026-08-19

### Added

- `CVContent` component and structured CV data (`cvData.ts`) sourced from the CV PDF.
- Footer and theme-switch core components.

## [0.0.0] - 2026-08-13

### Added

- Initial project scaffold: React 19 + Vite + TypeScript + React Compiler + Oxlint.
