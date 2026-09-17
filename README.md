# Athos CV

Personal CV and portfolio website for **Athinodoros Boudourakis**, a front-end engineer based in Limassol, Cyprus.

The site presents professional experience, technical skills, education, certifications, languages, and selected projects in a responsive web CV. It also includes a PDF archive of earlier work samples and links to external professional profiles.

## Highlights

- Interactive CV with work experience, skills, academics, certificates, awards, and projects
- Selected work samples embedded from a portfolio PDF
- Links to LinkedIn, GitHub, project websites, and certificate documents
- Responsive layout with light and dark theme support
- Client-side routing with React Router
- Automated production deployment to GitHub Pages
- "Clip" — a floating, RAG-powered portfolio assistant that answers visitor questions grounded in the CV/portfolio content (see [Portfolio Assistant](#portfolio-assistant))

## Application routes

| Route | Description |
| --- | --- |
| `/CV` (also `/cv`) | Curriculum vitae — the default view |
| `/portfolio` (also `/Portfolio`) | Selected work samples up to 2017 |
| `/covid-shield-cyprus` | COVID-19 Protective Face Shield Initiative case study |
| `/` and any unmatched path | Redirects to `/CV` |

## Technology

- React 19
- TypeScript
- Vite
- React Router
- SCSS modules
- React Compiler
- Oxlint
- Vitest & Testing Library (component tests)
- Supabase (Postgres/pgvector + Edge Functions) for the portfolio assistant's RAG backend
- Mistral AI (embeddings + generation, pinned model snapshots) for the portfolio assistant

## Getting started

### Prerequisites

- Node.js 22 or later
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The development server uses the local HTTPS configuration for `dev.athos-cv.com`. Ensure the certificates in `.cert/` are available when running the configured server.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

### Lint the project

```bash
npm run lint
```

### Run tests

```bash
npm run test        # single run (vitest run)
npm run test:watch  # watch mode
```

## Project structure

```text
src/
├── components/
│   ├── core/                # Navigation, footer, and theme controls
│   ├── cv/                  # CV content, data, and section components
│   └── PortfolioAssistant/  # "Clip" — the floating RAG assistant UI (see below)
├── layouts/        # Shared application layout
├── pages/          # CV, portfolio, and COVID-19 case-study routes
├── styles/         # Global styles and visual effects
├── test/           # Vitest setup (jsdom polyfills, RTL cleanup)
└── assets/         # Fonts, images, and the source CV PDF
public/
├── certificates/   # Certificate documents
└── *.pdf           # Portfolio work samples
rag/                # Knowledge-base chunking/ingestion for the portfolio assistant (npm run rag:ingest)
supabase/           # Database migrations + the portfolio-chat Edge Function
```

The CV content is maintained as structured data in `src/components/cv/cvData.ts`, keeping the presentation components separate from the professional profile content.

## Portfolio Assistant

"Clip" is a floating assistant launcher (bottom-right on every CV/Portfolio page) that answers visitor questions using retrieval-augmented generation grounded in the CV/portfolio content — see `docs/Clip_bot_specification.md` for the UI spec and `docs/RAG Portfolio Assistant Implementation Specification.md` for the end-to-end architecture.

The knowledge base is built from two sources: the public CV/portfolio data (`src/components/cv/cvData.ts`) and a curated, recruiter-facing `assistant_knowledge` table (working style, career preferences, architectural priorities, etc.) that isn't necessarily rendered on the CV page itself — see spec §39, "Assistant-Only Professional Knowledge Layer", for how the two are combined and how to add/update/disable an entry.

The widget itself is [`familiar-js`](https://github.com/aBoudourakis/familiar-js) (a separate, standalone package); `src/components/PortfolioAssistant/` is a thin integration layer around it — `PortfolioAssistant.tsx` mounts/tears down the `FamiliarAssistant` class and reroutes its internal links through React Router, and `portfolioTransport.ts` is the custom `Transport` that calls the already-deployed `supabase/functions/portfolio-chat` Edge Function and maps its response (categorized/section-linked sources) onto familiar-js's plainer `{ title, url? }` shape. To run it locally against the real backend, set these in `.env.local` (see `.env.example`):

```text
VITE_SUPABASE_URL=       # the Supabase project URL
VITE_SUPABASE_ANON_KEY=  # the project's anon/publishable key — never the service-role key
```

Without them, the assistant still renders (launcher, mascot, suggested questions) but shows a friendly "not configured yet" notice instead of calling the backend — it never crashes or silently fails.

Cloudflare Turnstile bot verification is not wired into the frontend yet (see `portfolioTransport.ts`); the Edge Function currently only checks that a token was sent, not that it's valid.

The mascot uses familiar-js's own bundled artwork for its four built-in presets (`Clip`/`Lens`/`Seer`/`Wizard`, with the "Change mascot" picker enabled) rather than a custom skin — familiar-js merges any `mascotAssets` override on top of every preset, not just one, so a custom skin would make all four choices in the switcher look identical. Archived custom-skin source art (not currently wired in) lives in `src/assets/design-sources/Clip/` — see its README for why.

## Deployment

Pushes to the `main` branch build the Vite application and deploy the generated `dist/` directory to GitHub Pages through the workflow in `.github/workflows/deploy.yml`.

The build step needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set as **repository secrets** (Settings → Secrets and variables → Actions) — Vite bakes `VITE_`-prefixed values into the bundle at build time, so without them the deployed site's portfolio assistant always shows its "not configured yet" state, regardless of which page a visitor is on. Use the same values as your local `.env.local` — but **without** the surrounding single quotes `.env.local` uses for shell-style values (e.g. paste `https://xxxx.supabase.co`, not `'https://xxxx.supabase.co'`). GitHub Actions secrets are raw strings with no shell parsing, so a pasted quote becomes part of the URL and silently breaks it into a same-origin relative request instead of an absolute one.

## Changelog

Notable changes are tracked in [CHANGELOG.md](CHANGELOG.md).
