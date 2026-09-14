# Clip mascot — source art

Full-resolution originals for the "Clip" portfolio-assistant mascot (see
`src/components/PortfolioAssistant/ClipMascot.tsx`). These are the source
files a re-export would start from; the app only ever loads the optimized
WebP derivatives in `public/images/Clip/optimized/`.

Kept here (under `src/assets`, outside `public/`) rather than alongside the
optimized files so they aren't copied into the production build — they were
previously sitting in `public/images/Clip/` and shipping ~7.5 MB of unused
PNGs to every visitor's deploy target (never fetched by the app itself, but
still published). Moved out as part of the 2026-09 performance pass.
