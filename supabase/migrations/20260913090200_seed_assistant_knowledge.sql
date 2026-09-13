-- Seeds the assistant-only knowledge layer with curated, recruiter-facing
-- professional context. This is the version-controlled source of truth for
-- these rows — edit this content by adding a NEW migration with an insert
-- (same upsert-by-slug shape as below), not by hand-editing rows in
-- Supabase Studio or in portfolio_documents directly. See
-- docs/RAG Portfolio Assistant Implementation Specification.md, "Assistant-
-- Only Professional Knowledge Layer", for the day-to-day editing workflow.
--
-- Deliberately excludes anything about medical history, disability,
-- family, finances, salary, political/religious views, or other sensitive
-- personal information — this layer stays strictly professional. Preference
-- statements (e.g. "prefers React/TypeScript roles") are phrased as
-- preferences, not as absolute claims about ability or willingness.
--
-- `on conflict (slug) do update` makes this safe to replay (e.g. against a
-- reset local database) without duplicating rows.

insert into assistant_knowledge (slug, title, content, category, source_label, priority)
values
  (
    'professional-positioning',
    'Senior Front-End / UI Engineer Profile',
    $$Athinodoros is a senior Front-End Engineer with a strong UI/UX focus and roughly nine years of professional frontend/UI experience. His work combines hands-on frontend engineering with product thinking, interface architecture, interaction design, and implementation of polished user experiences. He is strongest in complex frontend applications rather than simple marketing websites, particularly data-heavy SPAs, real-time interfaces, internal platforms, dashboards, monitoring tools, and product interfaces where usability, performance, and maintainability matter. He is most interested in Senior, Lead, Staff, or hands-on Team Lead frontend roles where he can combine coding with architecture, technical ownership, mentoring, code quality, and cross-team collaboration.$$,
    'professional-summary',
    'Professional Summary',
    3
  ),
  (
    'core-frontend-stack',
    'Primary Front-End Technologies',
    $$Athinodoros works primarily with JavaScript and TypeScript and has extensive experience with React-based frontend development. His frontend technology experience includes HTML5, CSS/SCSS, JavaScript, TypeScript, React, Redux Toolkit, Vite, Vue.js, Next.js, MUI, AG Grid, Fluent UI, Vuetify, and Quasar. He prefers conventional component styling approaches such as CSS/SCSS and established component systems such as MUI for professional application development.$$,
    'frontend-engineering',
    'Frontend Engineering',
    3
  ),
  (
    'frontend-architecture',
    'Frontend Architecture and Web Technologies',
    $$Athinodoros has experience designing and maintaining complex frontend application architecture. Relevant areas include component architecture, frontend state management, REST API integration, Server-Sent Events, WebSockets, real-time data applications, OAuth, OpenID Connect, Keycloak, responsive application design, accessibility, cross-browser development, frontend performance optimisation, and CI/CD workflows. He tends to think about frontend engineering as application architecture rather than just implementation of individual screens.$$,
    'architecture',
    'Frontend Architecture',
    3
  ),
  (
    'realtime-data-experience',
    'Real-Time and Data-Heavy UI Experience',
    $$Athinodoros has substantial experience building data-heavy and real-time frontend applications. Examples include interfaces that consume Server-Sent Events and WebSocket-style real-time streams, update large data grids, maintain application state as events arrive, display notifications, and provide operators with continuously updating information. He has worked with React, TypeScript, Redux Toolkit, AG Grid Enterprise, RxJS-style reactive event handling, SSE connectivity monitoring, snapshot/delta updates, and high-frequency UI state changes. A recurring concern in this work has been balancing responsiveness, correctness, performance, and clear visual communication of changing data.$$,
    'realtime-systems',
    'Real-Time Systems',
    3
  ),
  (
    'ui-ux-strength',
    'UI/UX and Product Interface Experience',
    $$Athinodoros has a strong UI/UX orientation in addition to frontend engineering. He pays particular attention to information hierarchy, interaction design, usability, visual consistency, responsive behaviour, accessibility, product polish, animation only where it improves usability, design systems, component consistency, and clarity in complex interfaces. He often works across the boundary between development and design rather than treating them as completely separate disciplines. His visual design background also includes experience with tools such as Photoshop, Illustrator, Adobe XD, InDesign, and AutoCAD.$$,
    'ui-ux',
    'UI/UX',
    3
  ),
  (
    'startup-experience',
    'Startup Environment Experience',
    $$Athinodoros has several years of experience working in startup environments, including Silensec and Dealio. He is comfortable with ambiguity, changing requirements, rapid iteration, direct product impact, working across role boundaries, taking ownership of features, collaborating closely with product and design, and building features from early concepts into production interfaces. He values environments where engineers have visible ownership and influence over the product rather than only implementing isolated tickets.$$,
    'startup-experience',
    'Startup Experience',
    3
  ),
  (
    'engineering-working-style',
    'Engineering Working Style',
    $$Athinodoros tends to question assumptions and implementation choices in order to find a better technical or product solution rather than automatically accepting the first proposed approach. He values ownership, maintainability, thoughtful architecture, practical performance optimisation, polished UX, consistency, and clear reasoning behind technical decisions. He enjoys building products and interfaces from scratch and iterating them until they are both technically robust and visually polished.$$,
    'working-style',
    'Working Style',
    2
  ),
  (
    'technical-leadership-interests',
    'Technical Leadership Interests',
    $$Athinodoros is interested in roles that combine hands-on frontend development with technical leadership. This includes frontend architecture, mentoring, code quality, reviewing implementation decisions, setting frontend conventions, helping teams structure reusable components, collaborating with product and design, and improving engineering consistency. He does not want a role that removes him completely from hands-on development.$$,
    'leadership',
    'Technical Leadership',
    2
  ),
  (
    'ai-rag-experience',
    'AI, RAG and AI-Assisted Development',
    $$Athinodoros has been actively expanding his practical experience with AI-assisted software development, Retrieval-Augmented Generation, and agentic development workflows. Relevant tools and interests include Claude Code, GitHub Copilot, ChatGPT, Ollama, local coding models, embeddings, vector databases, semantic search, RAG, AI-assisted application development, and AI-driven UI features. He is particularly interested in integrating AI into real products rather than treating it only as a standalone chatbot. This portfolio assistant itself is an example of that interest: it uses semantic retrieval over curated professional data and generates grounded answers based on retrieved context.$$,
    'ai-rag',
    'AI & RAG',
    3
  ),
  (
    'machine-learning-background',
    'Machine Learning and Data Science Background',
    $$Athinodoros holds an MSc in Data Science and Engineering in addition to his undergraduate computing background. His technical exposure includes machine learning, deep learning, PyTorch, TensorFlow, Hadoop, and Spark. His academic work included multimodal deep-learning-related research. His professional identity remains primarily frontend/UI engineering, while AI and data science provide complementary technical depth.$$,
    'education',
    'Education',
    2
  ),
  (
    'development-tooling',
    'Development Tooling',
    $$Athinodoros regularly works with modern frontend and software-development tooling including Git, GitHub, GitLab, GitHub Actions, CI/CD, npm, yarn, pnpm, WebStorm, VS Code, Docker, Claude Code, GitHub Copilot, and Ollama. He is comfortable experimenting with development tooling and AI-assisted workflows to improve productivity while still reviewing architecture and implementation decisions himself.$$,
    'tooling',
    'Tooling',
    2
  ),
  (
    'career-direction',
    'Career Direction',
    $$Athinodoros is primarily interested in Senior Front-End Engineer, Lead Front-End Engineer, Frontend Team Lead, and Staff-level frontend/UI engineering roles where appropriate. He prefers roles that involve React and TypeScript, complex product interfaces, UI/UX ownership, frontend architecture, design systems, data-heavy interfaces, real-time applications, developer tools, AI products, creative tools, productivity/collaboration software, education and learning products, and interactive consumer products. Remote Europe/EMEA-friendly roles are particularly attractive.$$,
    'career-preferences',
    'Career Preferences',
    2
  ),
  (
    'preferred-product-domains',
    'Preferred Product Domains',
    $$Athinodoros currently prefers to avoid finance-focused projects and companies. He is particularly interested in products involving developer tools, AI, creative software, collaboration/productivity, education, learning platforms, gaming or gamification, media, design platforms, cybersecurity that is not primarily finance-related, and interactive consumer products. When discussing potential career fit, avoid recommending finance, fintech, payments, trading, crypto, banking, or risk-management companies as preferred targets for him.$$,
    'career-preferences',
    'Career Preferences',
    2
  ),
  (
    'frontend-technology-preferences',
    'Frontend Technology Preferences',
    $$For future roles, Athinodoros strongly prefers React and TypeScript-oriented frontend work. He is currently not targeting roles centered around Angular or Svelte. He also generally prefers conventional CSS/SCSS and established component frameworks over frontend stacks dominated by Tailwind, shadcn/ui, or Radix-style composition. These are career preferences and should not be misrepresented as a lack of technical ability.$$,
    'career-preferences',
    'Career Preferences',
    2
  ),
  (
    'complex-ui-example',
    'Example of Complex Frontend Work',
    $$One example of Athinodoros' complex frontend work is a React and TypeScript monitoring application involving Redux Toolkit, MUI, AG Grid Enterprise, real-time Server-Sent Events, authentication with Keycloak, large data grids, snapshot and delta updates, real-time notifications, connectivity monitoring, responsive layouts, and persisted UI state. The engineering challenge was not merely displaying data, but keeping a continuously updating interface performant, understandable, and predictable for users.$$,
    'interview-example',
    'Example Work',
    3
  ),
  (
    'design-and-engineering-combination',
    'Combining Engineering and Visual Design',
    $$Athinodoros' profile combines frontend engineering with visual and interaction design experience. This allows him to evaluate an interface from both perspectives: whether it is technically sound, and whether it is understandable and comfortable to use. He tends to care about details such as spacing, hierarchy, transitions, typography, component consistency, responsive behaviour, and visual feedback rather than treating these as purely cosmetic concerns.$$,
    'ui-ux',
    'UI/UX',
    2
  ),
  (
    'product-building-preference',
    'Building Products from Scratch',
    $$Athinodoros particularly enjoys building applications and features from an early stage. He prefers work where he can participate in decisions about application structure, UI architecture, component patterns, interaction design, technology choices, product behaviour, performance, and usability. He tends to find greenfield or substantial product-building work more engaging than narrowly scoped maintenance work.$$,
    'project-ownership',
    'Project Ownership',
    2
  )
on conflict (slug) do update set
  title = excluded.title,
  content = excluded.content,
  category = excluded.category,
  source_label = excluded.source_label,
  priority = excluded.priority,
  updated_at = now();
