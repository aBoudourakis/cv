/**
 * Copy and tuning constants passed into familiar-js's FamiliarAssistantConfig
 * (see PortfolioAssistant.tsx). No pre-existing suggested-questions list was
 * found elsewhere in the repo (rag/ only defines chunking/ingestion, not
 * example questions), so this is the single source of truth.
 */

export const ASSISTANT_TITLE = 'Ask about Athinodoros';
export const ASSISTANT_SUBTITLE = 'Clip · Portfolio Assistant';

export const ASSISTANT_INTRO =
	"Hi! I can answer questions about experience, projects, technologies and education.";

export const ASSISTANT_DISCLOSURE =
	"AI-powered. Answers are generated from Athinodoros' CV and portfolio information.";

export const SUGGESTED_QUESTIONS: string[] = [
	'What experience does he have with React?',
	'Has he worked with real-time systems?',
	'What UI/UX experience does he have?',
	'Does he have AI or machine learning experience?',
	'Tell me about the COVID-19 shield initiative.',
];

/**
 * How many prior turns familiar-js sends back as conversation context — the
 * server enforces its own cap regardless (see DEFAULTS in
 * supabase/functions/portfolio-chat/index.ts). Kept in sync manually, the
 * same way rag/ingest.ts's embedding switch is.
 */
export const MAX_CONVERSATION_MESSAGES = 10;
