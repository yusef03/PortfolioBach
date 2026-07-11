-- ============================================================================
-- Migration: changelog — published-Flag + unique(version)
-- Datum:     2026-05-29
-- Zweck:     B2 (Changelog Admin UI)
--   1. published-Spalte → Entwürfe ("→ CL") bleiben unsichtbar bis published=true
--   2. unique(version)  → keine doppelten Versionen mehr möglich
--
-- Ausführen im Supabase SQL-Editor (TablePlus: Cmd+A markieren, sonst läuft
-- nur das Statement unter dem Cursor).
-- WICHTIG: VOR dem nächsten `node scripts/build-roadmap.mjs` ausführen,
-- da der Build-Query jetzt nach published=true filtert.
-- ============================================================================

-- 1. published-Flag (default false = Entwurf)
alter table changelog
  add column if not exists published boolean not null default false;

-- 2. Bestehende Releases (v1.0.0 – v1.3.0) sind echte Releases → live schalten
update changelog set published = true;

-- 3. Doppelte Versionen verhindern (zusätzlich zum Code-Check im Admin)
--    Schlägt fehl, falls bereits Duplikate existieren — dann erst bereinigen.
alter table changelog
  add constraint changelog_version_unique unique (version);
