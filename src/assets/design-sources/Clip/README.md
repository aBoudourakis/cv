# Clip mascot — source art

Full-resolution originals for the "Clip" portfolio-assistant mascot, passed
to familiar-js's `mascotAssets` config in
`src/components/PortfolioAssistant/PortfolioAssistant.tsx`. These are the
source files a re-export would start from; the app only ever loads the
optimized WebP derivatives in `public/images/Clip/wizard/`.

Kept here (under `src/assets`, outside `public/`) rather than alongside the
optimized files so they aren't copied into the production build — the
top-level PNGs previously sat in `public/images/Clip/` and shipped ~7.5 MB of
unused originals to every visitor's deploy target (never fetched by the app
itself, but still published). Moved out as part of the 2026-09 performance
pass.

`wizard/` holds the current skin actually wired into the app (already
optimized WebP, no PNG originals kept alongside it); the top-level PNGs are
the prior "Clip" skin, kept as reference.
