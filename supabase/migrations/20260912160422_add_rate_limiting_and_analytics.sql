-- Stage 3a: rate limiting, global usage caps, and lightweight anonymous
-- analytics for the portfolio-chat Edge Function. Turnstile (bot
-- verification) and caching are deliberately NOT part of this migration —
-- they land separately.
--
-- Design notes:
--   * One shared log table backs BOTH per-visitor and global counters. A
--     "global" count is just "how many rows in this window, any visitor";
--     a "per-visitor" count adds a visitor_hash filter. This keeps the two
--     kinds of limit trivially consistent with each other.
--   * Windows are ROLLING (last 1h / 24h / 30d), not calendar-aligned. This
--     is simpler than tracking calendar-day/month boundaries and avoids a
--     "resets at midnight" cliff. Flagged for review — swap for
--     calendar-aligned windows later if preferred.
--   * visitor_hash is an HMAC of the visitor's IP computed by the Edge
--     Function using a server-side secret (RATE_LIMIT_HASH_SECRET) — the
--     raw IP is never sent to or stored in the database.
--   * Same locked-down RLS pattern as portfolio_documents: RLS enabled,
--     zero public policies, explicit grants to service_role only. Nothing
--     here is reachable by anon/authenticated even at the table-privilege
--     level.

create table if not exists rag_request_log (
  id bigserial primary key,
  visitor_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists rag_request_log_created_at_idx
  on rag_request_log (created_at);

create index if not exists rag_request_log_visitor_hash_created_at_idx
  on rag_request_log (visitor_hash, created_at);

alter table rag_request_log enable row level security;

create table if not exists rag_analytics_events (
  id bigserial primary key,
  event_type text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists rag_analytics_events_created_at_idx
  on rag_analytics_events (created_at);

create index if not exists rag_analytics_events_event_type_created_at_idx
  on rag_analytics_events (event_type, created_at);

alter table rag_analytics_events enable row level security;

-- Small aggregate view for the "admin/debug query" §28 of the spec asks
-- for — query this from the Supabase SQL editor (or any service_role
-- client) to see daily counts per event type without touching raw rows.
create or replace view rag_analytics_daily as
select
  date_trunc('day', created_at) as day,
  event_type,
  count(*) as event_count
from rag_analytics_events
group by 1, 2
order by 1 desc, 2;

-- Atomically checks all four limits against the log and, if none are
-- exceeded, records this request in the same statement (so the "did this
-- request count" decision and "count it" action can't drift apart under
-- concurrent requests from the same or different visitors). Returns jsonb
-- so the Edge Function can parse a single, simple shape:
--   {"allowed": true}
--   {"allowed": false, "reason": "hourly" | "daily" | "global_daily" | "global_monthly"}
--
-- Concurrent requests arriving in the same instant could both pass the
-- check before either's insert is visible to the other — acceptable at
-- this scale (a personal-portfolio demo, not a billing-critical system);
-- the global caps still bound the worst case tightly.
create or replace function check_rag_rate_limit(
  p_visitor_hash text,
  p_hourly_limit int,
  p_daily_limit int,
  p_global_daily_limit int,
  p_global_monthly_limit int
) returns jsonb
language plpgsql
as $$
declare
  v_hourly_count int;
  v_daily_count int;
  v_global_daily_count int;
  v_global_monthly_count int;
begin
  select
    count(*) filter (where visitor_hash = p_visitor_hash and created_at > now() - interval '1 hour'),
    count(*) filter (where visitor_hash = p_visitor_hash and created_at > now() - interval '1 day'),
    count(*) filter (where created_at > now() - interval '1 day'),
    count(*) filter (where created_at > now() - interval '30 days')
  into v_hourly_count, v_daily_count, v_global_daily_count, v_global_monthly_count
  from rag_request_log
  where created_at > now() - interval '30 days';

  if v_hourly_count >= p_hourly_limit then
    return jsonb_build_object('allowed', false, 'reason', 'hourly');
  elsif v_daily_count >= p_daily_limit then
    return jsonb_build_object('allowed', false, 'reason', 'daily');
  elsif v_global_daily_count >= p_global_daily_limit then
    return jsonb_build_object('allowed', false, 'reason', 'global_daily');
  elsif v_global_monthly_count >= p_global_monthly_limit then
    return jsonb_build_object('allowed', false, 'reason', 'global_monthly');
  end if;

  insert into rag_request_log (visitor_hash) values (p_visitor_hash);
  return jsonb_build_object('allowed', true);
end;
$$;

-- Opportunistically called by the Edge Function (small random chance per
-- request) instead of depending on pg_cron, so operational-data growth
-- stays bounded without an extra scheduling dependency. Windows are kept
-- comfortably longer than the limit windows above (35 days vs. the 30-day
-- global-monthly window; 90 days for analytics, which are aggregated and
-- cheap to keep longer).
create or replace function cleanup_rag_operational_data() returns void
language sql
as $$
  delete from rag_request_log where created_at < now() - interval '35 days';
  delete from rag_analytics_events where created_at < now() - interval '90 days';
$$;

-- Explicit grants — see the grant_service_role_access migration for why
-- these are required (Supabase no longer auto-exposes new tables/functions
-- to any role, service_role included). Deliberately NOT granting
-- anon/authenticated: nothing in this app talks to these tables except the
-- Edge Function via the service_role key.
grant select, insert, delete on rag_request_log to service_role;
grant select, insert, delete on rag_analytics_events to service_role;
grant select on rag_analytics_daily to service_role;
grant execute on function check_rag_rate_limit(text, int, int, int, int) to service_role;
grant execute on function cleanup_rag_operational_data() to service_role;
