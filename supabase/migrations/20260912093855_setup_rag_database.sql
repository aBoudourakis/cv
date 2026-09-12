-- RAG Portfolio Assistant: knowledge base schema
-- Enables pgvector, creates the portfolio_documents table used as the
-- vector knowledge base for the portfolio chat assistant, and exposes a
-- similarity-search RPC function for the (server-side only) Edge Function
-- to call. The table is fully locked down via RLS: no public policies are
-- defined, so only the service-role key (used server-side) can read/write.

create extension if not exists vector;

create table portfolio_documents (
  id            text primary key,        -- deterministic slug, e.g. "experience-dealio"
  content       text not null,
  embedding     vector(1536),             -- text-embedding-3-small
  category      text not null,            -- profile | experience | skill | education | certification | award | seminar | language | project
  title         text not null,
  source        text,                     -- e.g. "Dealio Ltd."
  source_url    text,                     -- external link or internal route (e.g. /covid-shield-cyprus)
  section_id    text,                     -- live CV anchor, e.g. "cv-experience" (nullable for standalone pages)
  metadata      jsonb not null default '{}'::jsonb,  -- pdf page, period/year, location, etc.
  content_hash  text not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index portfolio_documents_embedding_idx
  on portfolio_documents using hnsw (embedding vector_cosine_ops);

create index portfolio_documents_category_idx
  on portfolio_documents (category);

alter table portfolio_documents enable row level security;
-- Intentionally no policies: anon/authenticated get zero direct access.
-- Only the service-role key (used server-side by the Edge Function) can read/write.

create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger portfolio_documents_set_updated_at
  before update on portfolio_documents
  for each row execute function set_updated_at();

create or replace function match_portfolio_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
) returns table (
  id text, content text, category text, title text,
  source text, source_url text, section_id text,
  metadata jsonb, similarity float
)
language sql stable
as $$
  select id, content, category, title, source, source_url, section_id, metadata,
         1 - (embedding <=> query_embedding) as similarity
  from portfolio_documents
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
