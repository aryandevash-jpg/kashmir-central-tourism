-- Auth + RBAC migration for Kashmir Central Tourism
-- Run in Supabase SQL Editor AFTER schema.sql and seed.sql

-- Link public.users to Supabase Auth (same UUID)
ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_id_fkey;

-- password_hash no longer used (Supabase Auth handles credentials)
ALTER TABLE public.users
  ALTER COLUMN password_hash DROP NOT NULL;

-- ---------------------------------------------------------------------------
-- Helper functions for RLS
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.current_operator_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.operators WHERE user_id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_gov_officer()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role IN ('GOVT_OFFICER', 'SUPER_ADMIN') FROM public.users WHERE id = auth.uid()),
    false
  )
$$;

CREATE OR REPLACE FUNCTION public.is_operator()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role = 'OPERATOR' FROM public.users WHERE id = auth.uid()),
    false
  )
$$;

CREATE OR REPLACE FUNCTION public.is_tourist()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role = 'TOURIST' FROM public.users WHERE id = auth.uid()),
    false
  )
$$;

-- Auto-create profile on Supabase Auth signup (self-serve tourists)
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role, password_hash)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    CASE
      WHEN COALESCE(NEW.raw_app_meta_data->>'provisioned', 'false') = 'true'
        THEN COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'TOURIST')
      ELSE 'TOURIST'
    END,
    'supabase_auth'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- Keep slot capacity in sync when a booking is created
CREATE OR REPLACE FUNCTION public.on_booking_insert_update_slot()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.slots
  SET
    booked_count = booked_count + NEW.group_size,
    is_available = (booked_count + NEW.group_size < capacity)
  WHERE id = NEW.slot_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Slot not found';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS booking_insert_update_slot ON public.bookings;
CREATE TRIGGER booking_insert_update_slot
  AFTER INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.on_booking_insert_update_slot();
