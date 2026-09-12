-- The add_rate_limiting_and_analytics migration granted INSERT on
-- rag_request_log and rag_analytics_events to service_role, but a bigserial
-- primary key's implicit sequence needs its own explicit grant too (same
-- "nothing is auto-exposed" project setting noted in supabase/config.toml
-- and in that migration's own comment) — without it, inserts fail with
-- "permission denied for sequence rag_request_log_id_seq".
grant usage, select on sequence rag_request_log_id_seq to service_role;
grant usage, select on sequence rag_analytics_events_id_seq to service_role;
