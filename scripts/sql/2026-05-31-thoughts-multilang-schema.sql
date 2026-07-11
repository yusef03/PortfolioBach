-- ============================================================================
-- Migration: Thoughts → Multi-Sprachen-Schema
-- Datum: 2026-05-31
--
-- ACHTUNG: Diese Migration löscht die bestehende thoughts-Tabelle!
-- Vorher sicherstellen, dass keine wichtigen Posts verloren gehen.
--
-- Ausführen im Supabase SQL-Editor (Cmd+A, dann Run)
-- ============================================================================

-- ── 1. Alte Tabelle sichern (optional, als Backup) ────────────────────────────
-- CREATE TABLE IF NOT EXISTS thoughts_backup_2026_05_31 AS SELECT * FROM thoughts;

-- ── 2. Abhängige Policies löschen ────────────────────────────────────────────
DROP POLICY IF EXISTS "thoughts_public_read"  ON thoughts;
DROP POLICY IF EXISTS "thoughts_admin_all"    ON thoughts;

-- ── 3. Tabelle neu anlegen ────────────────────────────────────────────────────
DROP TABLE IF EXISTS thoughts;

CREATE TABLE thoughts (
  -- ─── Identität ─────────────────────────────────────────────────────────────
  id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             TEXT          NOT NULL UNIQUE,

  -- ─── Englisch (Pflicht) ────────────────────────────────────────────────────
  title_en         TEXT          NOT NULL,
  excerpt_en       TEXT,
  content_en       TEXT          NOT NULL DEFAULT '',

  -- ─── Deutsch (optional) ────────────────────────────────────────────────────
  title_de         TEXT,
  excerpt_de       TEXT,
  content_de       TEXT,

  -- ─── Arabisch (optional) ───────────────────────────────────────────────────
  title_ar         TEXT,
  excerpt_ar       TEXT,
  content_ar       TEXT,

  -- ─── Sprachneutrale Felder ─────────────────────────────────────────────────
  cover_image_url  TEXT,
  tags             TEXT[]        NOT NULL DEFAULT '{}',
  reading_minutes  SMALLINT,
  status           TEXT          NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft', 'published')),
  published_at     TIMESTAMPTZ,

  -- ─── Timestamps ────────────────────────────────────────────────────────────
  created_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- ── 4. Indizes ────────────────────────────────────────────────────────────────
CREATE INDEX thoughts_status_published_at ON thoughts (status, published_at DESC);
CREATE INDEX thoughts_slug                ON thoughts (slug);
CREATE INDEX thoughts_tags                ON thoughts USING GIN (tags);

-- ── 5. GRANTs (Tabellen-Ebene) ───────────────────────────────────────────────
-- WICHTIG: Supabase hat ZWEI Berechtigungs-Schichten — GRANTs (hier) UND RLS (unten).
-- Fehlt der GRANT, kommt "permission denied for table thoughts", egal wie die
-- RLS-Policies aussehen. Beide Schichten sind nötig.
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT                         ON thoughts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON thoughts TO authenticated;
GRANT ALL                            ON thoughts TO service_role;

-- ── 6. RLS aktivieren ────────────────────────────────────────────────────────
ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;

-- Öffentlicher Lesezugriff: nur published Posts
CREATE POLICY "thoughts_public_read"
  ON thoughts FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Admin (authenticated) kann alles lesen + schreiben
CREATE POLICY "thoughts_admin_all"
  ON thoughts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── 7. Storage-Policies für thoughts-media Bucket ────────────────────────────
-- (Falls der Bucket noch nicht existiert: Storage → New Bucket → "thoughts-media", Public: false)
-- Dann diese Policies anlegen:

-- Authenticated Users dürfen hochladen
CREATE POLICY "thoughts_media_authenticated_upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'thoughts-media');

-- Authenticated Users dürfen löschen
CREATE POLICY "thoughts_media_authenticated_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'thoughts-media');

-- Authenticated Users dürfen aktualisieren (upsert für Cover-Ersetzen)
CREATE POLICY "thoughts_media_authenticated_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'thoughts-media');

-- Öffentlicher Lesezugriff (Portfolio zeigt die Bilder)
CREATE POLICY "thoughts_media_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'thoughts-media');

-- ── Fertig ────────────────────────────────────────────────────────────────────
-- Tabelle ist bereit. Neue Posts über das Admin Panel anlegen.
