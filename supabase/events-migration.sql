-- Events-only migration (idempotent)
-- Safe to run multiple times.

DO $$ BEGIN
  CREATE TYPE event_category AS ENUM ('GENERAL', 'SAFETY', 'WEATHER', 'TRAFFIC', 'CULTURE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE event_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  district VARCHAR(100),
  category event_category NOT NULL DEFAULT 'GENERAL',
  priority event_priority NOT NULL DEFAULT 'MEDIUM',
  starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT true,
  is_important BOOLEAN NOT NULL DEFAULT true,
  source_label VARCHAR(120),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT events_window_valid CHECK (ends_at IS NULL OR ends_at >= starts_at)
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "events_select_published" ON events;
CREATE POLICY "events_select_published" ON events
  FOR SELECT USING (is_published = true OR public.is_gov_officer());

DROP POLICY IF EXISTS "events_insert_gov" ON events;
CREATE POLICY "events_insert_gov" ON events
  FOR INSERT WITH CHECK (
    public.is_gov_officer()
    AND created_by = auth.uid()
  );

DROP POLICY IF EXISTS "events_update_gov" ON events;
CREATE POLICY "events_update_gov" ON events
  FOR UPDATE USING (public.is_gov_officer());
