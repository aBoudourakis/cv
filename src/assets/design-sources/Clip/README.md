# Clip mascot — source art

Full-resolution/archived source art for a custom "Clip" portfolio-assistant
mascot skin. **Not currently wired into the app** — the assistant
(`src/components/PortfolioAssistant/PortfolioAssistant.tsx`) uses
familiar-js's own built-in mascot presets (`Clip`/`Lens`/`Seer`/`Wizard`) with
its mascot-switcher enabled, and familiar-js merges any `mascotAssets`
override on top of *every* preset rather than just one, so a custom skin here
would make all four choices in the switcher look identical. See the
"Category badges"/"Switching approach" decisions in git history around
2026-09 for the reasoning.

Kept here (under `src/assets`, outside `public/`) as archived reference
rather than deleted — useful again if familiar-js adds a way to scope
`mascotAssets` to a single preset, or if the switcher is ever dropped in
favor of a single custom skin.

- Top-level PNGs: the original custom "Clip" skin.
- `wizard/`: a newer custom skin (already-optimized WebP), prepared but not
  wired in for the reason above.
