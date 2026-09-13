-- Extends portfolio_documents with the visibility/priority bookkeeping
-- needed to support the assistant-only knowledge layer (see the
-- add_assistant_knowledge migration and rag/assistantKnowledge.ts).
--
-- Every row ingested from the public CV data (rag/chunk.ts) defaults to
-- visibility='public'; rows ingested from assistant_knowledge carry
-- visibility='assistant_only'. This is internal bookkeeping/debugging only —
-- supabase/functions/portfolio-chat/index.ts's response never forwards it to
-- visitors (see its toSource()).
--
-- priority (1-3, mirrored from assistant_knowledge.priority; public CV rows
-- default to 1) is a modest ranking signal folded into match_portfolio_documents
-- below as a small additive nudge — never a substitute for semantic
-- similarity, and never enough to pull a semantically irrelevant row above a
-- relevant one.

alter table portfolio_documents
  add column visibility text not null default 'public' check (visibility in ('public', 'assistant_only')),
  add column priority smallint not null default 1 check (priority between 1 and 3);

create index portfolio_documents_visibility_idx on portfolio_documents (visibility);

-- CREATE OR REPLACE can't change a function's return type, so the previous
-- overload (see the switch_embeddings_to_mistral migration for why this drop
-- + recreate pattern is used whenever the signature changes) must be dropped
-- first.
drop function if exists match_portfolio_documents(vector(1024), float, int);

create or replace function match_portfolio_documents(
  query_embedding vector(1024),
  match_threshold float,
  match_count int
) returns table (
  id text, content text, category text, title text,
  source text, source_url text, section_id text,
  metadata jsonb, visibility text, priority smallint, similarity float
)
language sql stable
as $$
  select id, content, category, title, source, source_url, section_id,
         metadata, visibility, priority,
         1 - (embedding <=> query_embedding) as similarity
  from portfolio_documents
  where 1 - (embedding <=> query_embedding) > match_threshold
  -- Ranking uses similarity plus a small priority nudge (+0.01 per priority
  -- point above 1, so at most +0.02) purely to break near-ties between
  -- otherwise-comparable matches — the match_threshold filter above is
  -- unaffected, so priority alone can never pull in a row semantic search
  -- wouldn't already consider relevant.
  order by (1 - (embedding <=> query_embedding)) + (priority - 1) * 0.01 desc
  limit match_count;
$$;

-- Re-grant: dropping/recreating the function drops its previous grant too
-- (see the grant_service_role_access migration for why this is required at
-- all). Deliberately NOT granting anon/authenticated.
grant execute on function public.match_portfolio_documents(vector(1024), float, int) to service_role;
