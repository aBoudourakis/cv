-- Switches the knowledge-base embedding dimension from 1536 (OpenAI
-- text-embedding-3-small) to 1024 (Mistral's mistral-embed, the default
-- embedding provider as of rag/ingest.ts and the portfolio-chat Edge
-- Function). No portfolio_documents rows have real embeddings ingested yet,
-- so there is no data migration concern here — this only changes the column
-- and function type.
--
-- If the embedding provider changes again to one with a different output
-- dimension, this is the pattern to follow: alter the column, drop the old
-- function overload (CREATE OR REPLACE does not change existing parameter
-- types — it would just add a second overload), and recreate it.

alter table portfolio_documents
  alter column embedding type vector(1024);

drop index if exists portfolio_documents_embedding_idx;
create index portfolio_documents_embedding_idx
  on portfolio_documents using hnsw (embedding vector_cosine_ops);

drop function if exists match_portfolio_documents(vector(1536), float, int);

create or replace function match_portfolio_documents(
  query_embedding vector(1024),
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
