-- Assistant-only professional knowledge layer: a dedicated source of truth
-- for curated, recruiter-facing professional context that is NOT necessarily
-- rendered on the public CV/portfolio site (working style, career
-- preferences, project depth, etc.) — see docs/RAG Portfolio Assistant
-- Implementation Specification.md, "Assistant-Only Professional Knowledge
-- Layer".
--
-- This table is a source of truth, NOT the retrieval index: rag/ingest.ts
-- reads its enabled rows (via rag/assistantKnowledge.ts), chunks/embeds them
-- exactly like the public CV data, and writes the result into
-- portfolio_documents alongside the public chunks. Nothing queries this
-- table at request time — supabase/functions/portfolio-chat/index.ts only
-- ever talks to portfolio_documents.
--
-- Same locked-down RLS pattern as portfolio_documents (see the
-- setup_rag_database migration): RLS enabled, zero anon/authenticated
-- policies, explicit grants to service_role only. It must never become a
-- publicly queryable/writable endpoint.

create extension if not exists pgcrypto;

create table assistant_knowledge (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,        -- deterministic key ingestion addresses rows by, e.g. "professional-positioning"
  title         text not null,
  content       text not null,               -- the text embedded and sent to the LLM as retrieved context
  category      text not null,               -- professional-summary | frontend-engineering | ui-ux | architecture | realtime-systems | startup-experience | leadership | working-style | project-ownership | ai-rag | tooling | education | career-preferences | technical-decision | interview-example
  source_label  text,                        -- friendly provenance shown as the citation's "source", e.g. "Professional Summary" — never a fabricated URL
  visibility    text not null default 'assistant_only' check (visibility = 'assistant_only'),
  priority      smallint not null default 1 check (priority between 1 and 3),  -- 1 = supporting/general, 2 = relevant, 3 = strong/authoritative
  metadata      jsonb not null default '{}'::jsonb,
  enabled       boolean not null default true,  -- disabled rows are skipped by rag/ingest.ts and pruned from portfolio_documents on the next run
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index assistant_knowledge_category_idx on assistant_knowledge (category);
create index assistant_knowledge_enabled_idx on assistant_knowledge (enabled);

alter table assistant_knowledge enable row level security;
-- Intentionally no policies: anon/authenticated get zero direct access,
-- same as portfolio_documents. Only the service-role key (used server-side
-- by rag/ingest.ts) can read/write.

-- Reuses the set_updated_at() trigger function already created by the
-- setup_rag_database migration for portfolio_documents.
create trigger assistant_knowledge_set_updated_at
  before update on assistant_knowledge
  for each row execute function set_updated_at();

-- Explicit grant — new tables aren't auto-exposed to any role, service_role
-- included (see the grant_service_role_access migration for the full
-- explanation). Deliberately NOT granting anon/authenticated: this table
-- must never be reachable by the browser bundle, only by rag/ingest.ts
-- running with SUPABASE_SERVICE_ROLE_KEY.
grant select, insert, update, delete on public.assistant_knowledge to service_role;
