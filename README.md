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

## Application routes

| Route | Description |
| --- | --- |
| `/` | Curriculum vitae |
| `/portfolio` | Selected work samples up to 2017 |
| `/contact` | Contact page |

## Technology

- React 19
- TypeScript
- Vite
- React Router
- SCSS modules
- React Compiler
- Oxlint

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

## Project structure

```text
src/
├── components/
│   ├── core/       # Navigation, footer, and theme controls
│   └── cv/         # CV content, data, and section components
├── layouts/        # Shared application layout
├── pages/          # CV, portfolio, and contact routes
├── styles/         # Global styles and visual effects
└── assets/         # Fonts, images, and the source CV PDF
public/
├── certificates/   # Certificate documents
└── *.pdf           # Portfolio work samples
```

The CV content is maintained as structured data in `src/components/cv/cvData.ts`, keeping the presentation components separate from the professional profile content.

## Deployment

Pushes to the `main` branch build the Vite application and deploy the generated `dist/` directory to GitHub Pages through the workflow in `.github/workflows/deploy.yml`.
