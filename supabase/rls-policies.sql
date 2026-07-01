-- RBAC policies — run after schema.sql, seed.sql, and auth-migration.sql
-- Replaces open anon policies with role-based access control

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_includes ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop legacy open policies
DROP POLICY IF EXISTS "Public read activities" ON activities;
DROP POLICY IF EXISTS "Public read includes" ON activity_includes;
DROP POLICY IF EXISTS "Public read slots" ON slots;
DROP POLICY IF EXISTS "Public read operators" ON operators;
DROP POLICY IF EXISTS "Public read districts" ON districts;
DROP POLICY IF EXISTS "Public read incidents" ON incidents;
DROP POLICY IF EXISTS "Public read reviews" ON reviews;
DROP POLICY IF EXISTS "Public read users" ON users;
DROP POLICY IF EXISTS "Public read bookings" ON bookings;
DROP POLICY IF EXISTS "Anon insert bookings" ON bookings;
DROP POLICY IF EXISTS "Anon update slots" ON slots;
DROP POLICY IF EXISTS "Anon insert activities" ON activities;
DROP POLICY IF EXISTS "Anon insert activity_includes" ON activity_includes;
DROP POLICY IF EXISTS "Anon insert slots" ON slots;
DROP POLICY IF EXISTS "Anon update incidents" ON incidents;
DROP POLICY IF EXISTS "Anon insert incident_actions" ON incident_actions;
DROP POLICY IF EXISTS "Public read events" ON events;

-- ---------------------------------------------------------------------------
-- USERS
-- ---------------------------------------------------------------------------
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "users_select_gov" ON users
  FOR SELECT USING (public.is_gov_officer());

CREATE POLICY "users_insert_gov" ON users
  FOR INSERT WITH CHECK (public.is_gov_officer());

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (id = auth.uid() OR public.is_gov_officer());

-- ---------------------------------------------------------------------------
-- OPERATORS
-- ---------------------------------------------------------------------------
CREATE POLICY "operators_select_public_verified" ON operators
  FOR SELECT USING (
    is_verified = true
    OR user_id = auth.uid()
    OR public.is_gov_officer()
  );

CREATE POLICY "operators_insert_gov" ON operators
  FOR INSERT WITH CHECK (public.is_gov_officer());

CREATE POLICY "operators_update_gov" ON operators
  FOR UPDATE USING (public.is_gov_officer());

-- ---------------------------------------------------------------------------
-- ACTIVITIES
-- ---------------------------------------------------------------------------
CREATE POLICY "activities_select" ON activities
  FOR SELECT USING (
    is_active = true
    OR operator_id = public.current_operator_id()
    OR public.is_gov_officer()
  );

CREATE POLICY "activities_insert_operator" ON activities
  FOR INSERT WITH CHECK (
    public.is_operator()
    AND operator_id = public.current_operator_id()
  );

CREATE POLICY "activities_update_operator" ON activities
  FOR UPDATE USING (
    operator_id = public.current_operator_id()
    OR public.is_gov_officer()
  );

-- ---------------------------------------------------------------------------
-- ACTIVITY INCLUDES
-- ---------------------------------------------------------------------------
CREATE POLICY "includes_select" ON activity_includes
  FOR SELECT USING (true);

CREATE POLICY "includes_insert_operator" ON activity_includes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM activities a
      WHERE a.id = activity_id
        AND (a.operator_id = public.current_operator_id() OR public.is_gov_officer())
    )
  );

-- ---------------------------------------------------------------------------
-- SLOTS
-- ---------------------------------------------------------------------------
CREATE POLICY "slots_select" ON slots
  FOR SELECT USING (true);

CREATE POLICY "slots_insert_operator" ON slots
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM activities a
      WHERE a.id = activity_id
        AND (a.operator_id = public.current_operator_id() OR public.is_gov_officer())
    )
  );

-- ---------------------------------------------------------------------------
-- BOOKINGS
-- ---------------------------------------------------------------------------
CREATE POLICY "bookings_select" ON bookings
  FOR SELECT USING (
    user_id = auth.uid()
    OR public.is_gov_officer()
    OR EXISTS (
      SELECT 1 FROM activities a
      WHERE a.id = activity_id
        AND a.operator_id = public.current_operator_id()
    )
  );

CREATE POLICY "bookings_insert_tourist" ON bookings
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL
    AND user_id = auth.uid()
    AND public.is_tourist()
  );

-- ---------------------------------------------------------------------------
-- INCIDENTS
-- ---------------------------------------------------------------------------
CREATE POLICY "incidents_select" ON incidents
  FOR SELECT USING (
    reported_by = auth.uid()
    OR public.is_gov_officer()
    OR operator_id = public.current_operator_id()
  );

CREATE POLICY "incidents_insert_tourist" ON incidents
  FOR INSERT WITH CHECK (
    public.is_tourist()
    AND reported_by = auth.uid()
  );

CREATE POLICY "incidents_update_gov" ON incidents
  FOR UPDATE USING (public.is_gov_officer());

-- ---------------------------------------------------------------------------
-- INCIDENT ACTIONS
-- ---------------------------------------------------------------------------
CREATE POLICY "incident_actions_select" ON incident_actions
  FOR SELECT USING (
    public.is_gov_officer()
    OR EXISTS (
      SELECT 1 FROM incidents i
      WHERE i.id = incident_id
        AND (i.reported_by = auth.uid() OR i.operator_id = public.current_operator_id())
    )
  );

CREATE POLICY "incident_actions_insert" ON incident_actions
  FOR INSERT WITH CHECK (
    actor_id = auth.uid()
    AND (
      public.is_gov_officer()
      OR public.is_tourist()
    )
  );

-- ---------------------------------------------------------------------------
-- EVENTS
-- ---------------------------------------------------------------------------
CREATE POLICY "events_select_published" ON events
  FOR SELECT USING (is_published = true OR public.is_gov_officer());

CREATE POLICY "events_insert_gov" ON events
  FOR INSERT WITH CHECK (
    public.is_gov_officer()
    AND created_by = auth.uid()
  );

CREATE POLICY "events_update_gov" ON events
  FOR UPDATE USING (public.is_gov_officer());

-- ---------------------------------------------------------------------------
-- DISTRICTS & REVIEWS (read-only catalog data)
-- ---------------------------------------------------------------------------
CREATE POLICY "districts_select" ON districts
  FOR SELECT USING (true);

CREATE POLICY "reviews_select" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_insert_tourist" ON reviews
  FOR INSERT WITH CHECK (public.is_tourist() AND user_id = auth.uid());
