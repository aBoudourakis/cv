# Task: Implement the "Clip" Portfolio RAG Assistant UI

I am attaching a visual concept image for the assistant UI.

Use that image as the primary visual reference for this task.

The goal is to implement a polished, production-quality floating RAG assistant in my existing online CV/portfolio application.

The assistant should be inspired by the nostalgic concept of classic desktop assistants such as Clippy, but it MUST NOT be a direct copy of Microsoft's Clippy.

Create an original paperclip-inspired assistant character and integrate it into the existing design system of this portfolio.

The feature already has / will have a RAG backend.

This task is mainly about:
- the assistant launcher
- mascot
- popover / chat panel
- suggested questions
- interaction states
- responsive behaviour
- accessibility
- styling
- animation

Do not redesign unrelated parts of the application.

---

# 1. First inspect the existing application

Before making changes:

1. Inspect the current React/Vite/TypeScript architecture.
2. Identify:
    - current component conventions
    - styling system
    - SCSS/CSS module conventions
    - dark/light theme implementation
    - design tokens / CSS variables
    - breakpoints
    - existing button/input/popover components
    - current RAG/chat API integration if already present
3. Reuse existing conventions wherever possible.

Do not introduce a new UI framework unless one is already being used.

Do not perform unrelated refactors.

---

# 2. Git

Work only on the existing RAG feature branch.

Expected branch:

feature/rag-portfolio-assistant

Do not merge into main.

If the branch is not active, stop and report before modifying anything.

---

# 3. Design direction

Use the attached concept image as the visual reference.

The overall style should feel:

- retro-modern
- professional
- slightly nostalgic
- playful but not childish
- polished enough for a senior engineer's portfolio
- understated rather than cartoon-heavy

The visual concept is:

1990s desktop assistant inspiration
+
modern 2026 portfolio UI

The mascot should subtly suggest:

"I've been working with interfaces long enough to remember this era."

but the UI must still feel contemporary.

---

# 4. Mascot

Create an ORIGINAL paperclip-inspired assistant.

Do not reproduce Microsoft's Clippy exactly.

Create the production mascot as SVG, NOT as PNG.

Preferred implementation:

src/assets/assistant/clip.svg

or, if animation/control is easier:

src/components/PortfolioAssistant/ClipMascot.tsx

with inline SVG.

Prefer inline React SVG if it makes state-based animation and theme integration significantly cleaner.

The mascot should have:

- paperclip-like main body
- metallic / silver appearance
- subtle blue tones
- small warm gold highlights
- expressive but restrained eyes
- simple original geometry
- clean silhouette at small sizes

It must remain recognizable at approximately:

48px
56px
64px

and scale cleanly to approximately:

90–120px

inside the opened panel.

Avoid over-detailed illustration that becomes illegible at small sizes.

---

# 5. Theme integration

Use the existing portfolio color system.

Where applicable, incorporate:

- royal / deep blue
- graphite / navy
- silver
- subtle gold accent

Do not hard-code a completely separate palette if equivalent CSS variables already exist.

The assistant must support:

- light mode
- dark mode

The mascot SVG should preferably use CSS-custom-property-driven colors where practical.

Example concept:

--assistant-metal
--assistant-highlight
--assistant-accent
--assistant-surface
--assistant-border

Only introduce new variables if needed.

---

# 6. Closed launcher

Create a floating assistant launcher positioned near the bottom-right of the viewport.

The launcher should be approximately:

56px–64px

on desktop.

It should contain the mascot.

Desktop behaviour:

Idle:
- mascot visible
- subtle circular surface/background
- very restrained shadow/glow
- no constant distracting animation

Hover:
- slight mascot movement / tilt
- subtle gold accent
- tooltip appears:

"Ask about Athinodoros"

The tooltip should appear beside or above the launcher.

The launcher should feel visually integrated with the portfolio rather than like a third-party widget.

---

# 7. Animation states

Implement several subtle mascot states.

## Idle

- almost static
- optional very slow blink
- no bouncing

## Hover

- tiny tilt / lean
- eyes can shift slightly toward cursor if practical
- subtle gold border/glow

## Thinking

While waiting for the RAG response:

- subtle eye movement OR
- tiny ellipsis bubble OR
- minimal document/typing animation

Do not use large bouncing animations.

## Open

When opening the panel:

- launcher transitions into / visually connects to the panel
- mascot may move into the panel header

## Reduced motion

Respect:

@media (prefers-reduced-motion: reduce)

Disable non-essential motion when reduced-motion is enabled.

---

# 8. Assistant panel

Clicking the launcher should open a floating panel.

Desktop target width:

approximately 380px–420px

Do not make it unnecessarily large.

The panel should resemble the attached concept:

Header:
- mascot
- title:
  "Ask about Athinodoros"
- close button

Intro copy:

"Hi! I can answer questions about experience, projects, technologies and education."

Keep this concise.

Add a subtle divider.

---

# 9. Suggested questions

When no conversation has started, show a section:

Suggested questions

Suggested buttons/chips:

- What experience does he have with React?
- Has he worked with real-time systems?
- What UI/UX experience does he have?
- Does he have AI or machine learning experience?
- Tell me about the COVID-19 shield initiative.

If the actual project already contains suggested questions from the RAG implementation, reuse that source rather than duplicating them.

Each suggestion should behave exactly like entering that question manually.

Style:

- rounded but not overly pill-like
- compact
- easy to scan
- clear hover state
- keyboard accessible

Do not make every UI element heavily rounded.

---

# 10. Input area

At the bottom of the panel implement:

text input / textarea
+
send button

Placeholder:

"Ask a question..."

Requirements:

- Enter sends
- Shift+Enter creates a newline if multiline input is supported
- sending disabled for empty/whitespace input
- input length respects existing backend limit
- show remaining/maximum length only if it improves UX
- disable repeated submissions while a request is pending unless the current architecture explicitly supports it

Use an icon-only send button if consistent with the reference image.

Provide accessible labels.

---

# 11. Chat messages

If RAG chat UI already exists, integrate the new visual design with the existing logic.

Do not rewrite working backend logic unnecessarily.

Messages should support:

User message
Assistant message
Loading/thinking state
Error state
Rate-limit state
No-context state
Sources/citations

Assistant answers should remain readable and compact.

Do not use giant chat bubbles.

---

# 12. Sources

If the RAG response includes sources, render them beneath the answer.

Example:

Sources

Experience · Dealio
Skills · Frontend Development

If a source contains a valid route/section link, make it clickable.

If not, display it as text.

Do not fabricate links.

Sources should be visually secondary but clearly available.

---

# 13. AI disclosure

Include a small unobtrusive line near the bottom:

"AI-powered. Answers are generated from Athinodoros' CV and portfolio information."

If an existing disclosure already exists, reuse it.

Do not make it visually dominant.

---

# 14. Mobile behaviour

On mobile, do not simply shrink the desktop panel.

Use an appropriate responsive layout.

Preferred behaviour:

- launcher remains bottom-right
- opened assistant becomes either:
    - bottom sheet
    - nearly full-width card
    - compact full-screen panel on very narrow devices

Respect safe areas:

env(safe-area-inset-bottom)

Do not overlap browser navigation or important site controls.

The input must remain usable when the mobile keyboard opens.

---

# 15. Accessibility

This feature must be fully keyboard accessible.

Requirements:

- launcher is a real button
- tooltip does not replace accessible naming
- opening the panel moves focus appropriately
- closing restores focus to the launcher
- Escape closes the panel
- Tab order is logical
- close/send buttons have aria-labels
- loading status uses suitable aria-live behaviour
- response arrival is accessible to screen readers
- visible focus styles
- sufficient contrast
- reduced-motion support

Do not use clickable divs where semantic buttons are appropriate.

---

# 16. Positioning / collisions

Inspect the existing website before choosing exact offsets.

Ensure the assistant does not cover:

- theme toggle
- navigation
- important footer links
- mobile navigation
- cookie/privacy controls if present

Use responsive offsets if needed.

---

# 17. Component architecture

Prefer a modular structure similar to:

src/components/PortfolioAssistant/
PortfolioAssistant.tsx
PortfolioAssistant.module.scss
AssistantLauncher.tsx
AssistantPanel.tsx
ClipMascot.tsx
SuggestedQuestions.tsx
AssistantMessage.tsx
AssistantSources.tsx
types.ts

Adapt this to existing repository conventions.

Do not create unnecessary abstraction.

---

# 18. State architecture

Keep visual/UI state separate from RAG/network logic where practical.

Possible state:

isOpen
isHovering
isThinking
messages
inputValue
error

If equivalent hooks/services already exist, reuse them.

Avoid unnecessary global state.

This component probably does not need Redux unless the application already treats this type of state globally.

---

# 19. SVG implementation

The mascot must be vector-based.

Do not use the attached PNG mockup as a production asset.

Use the image only as inspiration.

Create an original SVG.

The SVG should:

- use clean paths/shapes
- avoid excessive path complexity
- scale correctly
- avoid fixed raster dimensions
- support dark/light theme where practical
- allow basic animation using CSS classes
- avoid embedded base64 assets
- avoid unnecessary SVG filters that are expensive to render

Use simple gradients only if they materially improve the metallic appearance.

---

# 20. Styling quality

The visual treatment should resemble the reference image:

- dark/navy glass-like surface in dark mode
- subtle border
- gentle shadow
- silver/blue mascot
- small gold highlights
- professional typography
- comfortable spacing
- clean input
- restrained suggestion buttons

Avoid:

- giant glassmorphism blur
- excessive glow
- neon cyberpunk styling
- purple generic-AI gradients
- excessive gradients
- constant mascot movement
- overly childish facial expressions

---

# 21. Performance

The assistant should not meaningfully increase initial page load.

Prefer:

- CSS animation
- SVG
- lazy-loading assistant panel logic where sensible

Avoid:

- animation libraries just for a few simple transitions
- large image assets
- Lottie unless already in the project
- unnecessary third-party chatbot libraries

The closed launcher should be lightweight.

---

# 22. Optional micro-interactions

Only implement these if they remain subtle and performant:

- mascot eyes move slightly on hover
- tiny blink every long interval
- eyes look toward input while typing
- thinking ellipsis bubble
- slight lean when launcher is hovered
- small gold highlight when a response arrives

Do NOT implement all of these if they make the UI distracting.

Choose restraint over novelty.

---

# 23. Naming

Use:

Clip

as the internal mascot name.

The user-facing feature title should primarily remain:

Ask about Athinodoros

Do not make "Clip" more prominent than the professional purpose of the feature.

Possible tiny secondary text:

"Clip · Portfolio Assistant"

is acceptable if it fits naturally.

---

# 24. Do not change backend behaviour unnecessarily

If RAG is already implemented:

- keep the current API contract
- keep rate limiting
- keep Turnstile
- keep source metadata
- keep Mistral generation
- keep OpenAI embeddings
- keep existing cost controls

This task is primarily a visual/UI upgrade.

Only change backend code if required for UI integration.

---

# 25. Testing

Add/update tests for:

- launcher opens panel
- close button closes panel
- Escape closes panel
- focus returns to launcher
- suggested question submits correctly
- empty input cannot submit
- loading/thinking state appears
- error state appears
- sources render
- rate-limit message renders
- mobile layout where feasible

Do not make live paid AI calls in tests.

Mock the RAG endpoint.

---

# 26. Final verification

Run the repository's available:

lint
typecheck
tests
build

Also manually verify:

- desktop light theme
- desktop dark theme
- mobile light theme
- mobile dark theme
- keyboard-only operation
- reduced-motion mode

Do not merge the branch.

---

# 27. Completion report

When finished, report:

1. files created
2. files modified
3. where the SVG mascot lives
4. how the mascot states work
5. responsive behaviour
6. accessibility work completed
7. tests added
8. build/test results
9. any design differences from the attached reference and why
10. anything I should visually review before merging

Do not merge until I approve the result.