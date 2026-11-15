-- Applied to Supabase project ynstvmzhtzokvllrnjtn (Family Health Hub).
-- Isolated trafficreport schema with owner-only RLS and private audio bucket.
-- Live migration names: trafficreport_isolated_incidents_and_audio_storage,
-- trafficreport_authenticated_rpc_access.
-- Do not replay blindly: policies/functions may already exist.
-- API access uses public.trafficreport_list_incidents() and
-- public.trafficreport_upsert_incident(jsonb), both SECURITY INVOKER.
-- Audio: storage.objects path <auth.uid()>/<incident uuid>/original.webm
-- Existing Family Health Hub tables and buckets are not modified.

## Status

- DB and storage migrations: applied and read-only verified.
- Web v0.4.0: committed to main; GitHub Pages workflow runs on push.
- User login, RLS, sync, audio upload: require end-to-end account/device test.
- Reverse geocoding and external AI: still unconnected (provider credentials and privacy controls needed).
- GitHub Pages live URL and Android APK build: not independently verified.
- No automated background cloud sync; manual sync is provided.
- The two applications share Supabase Auth and project quotas; avoid sharing a device session between users.
