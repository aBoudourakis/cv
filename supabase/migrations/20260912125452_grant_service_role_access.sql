-- Supabase changed its cloud default so newly created tables/functions are no
-- longer automatically reachable via the Data API (PostgREST), even for
-- service_role — see https://github.com/orgs/supabase/discussions/45329.
-- Explicit GRANTs are now required and are the permanent fix going forward
-- (the auto_expose_new_tables config flag that used to paper over this is
-- being removed).
--
-- Deliberately NOT granting anon/authenticated here: portfolio_documents has
-- RLS enabled with zero policies (see the Stage 1 migration), and nothing in
-- this app talks to it directly except the Edge Function via the
-- service_role key. Keeping anon/authenticated with no table-level grant at
-- all is an extra layer of defense on top of RLS, not a workaround for it.

grant select, insert, update, delete on public.portfolio_documents to service_role;

grant execute on function public.match_portfolio_documents(vector(1024), float, int) to service_role;
