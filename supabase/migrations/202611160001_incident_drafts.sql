-- Apply to a dedicated Supabase project only after verifying the target project.
create table if not exists public.incident_drafts (
 id uuid primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 occurred_at timestamptz not null,
 latitude double precision,
 longitude double precision,
 gps_accuracy_m double precision,
 road_address text,
 jibun_address text,
 verified_place text,
 incident_type text not null default '교통위반',
 vehicle_plate text,
 transcript text,
 report_draft text,
 audio_object_path text,
 updated_at timestamptz not null default now(),
 created_at timestamptz not null default now()
);
create index if not exists incident_drafts_user_time_idx on public.incident_drafts(user_id,occurred_at desc);
alter table public.incident_drafts enable row level security;
revoke all on public.incident_drafts from anon;
grant select,insert,update,delete on public.incident_drafts to authenticated;
drop policy if exists incident_drafts_owner_select on public.incident_drafts;
create policy incident_drafts_owner_select on public.incident_drafts for select to authenticated using ((select auth.uid())=user_id);
drop policy if exists incident_drafts_owner_insert on public.incident_drafts;
create policy incident_drafts_owner_insert on public.incident_drafts for insert to authenticated with check ((select auth.uid())=user_id);
drop policy if exists incident_drafts_owner_update on public.incident_drafts;
create policy incident_drafts_owner_update on public.incident_drafts for update to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
drop policy if exists incident_drafts_owner_delete on public.incident_drafts;
create policy incident_drafts_owner_delete on public.incident_drafts for delete to authenticated using ((select auth.uid())=user_id);
-- Audio storage bucket/policies must be configured separately after project selection.
