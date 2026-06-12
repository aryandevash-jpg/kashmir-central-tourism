-- Kashmir Central Tourism — full schema
-- Run once in Supabase SQL Editor (before seed.sql)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('TOURIST', 'OPERATOR', 'GOVT_OFFICER', 'SUPER_ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE activity_category AS ENUM ('TREKKING', 'GONDOLA', 'WATER_TOUR', 'SKIING', 'CAMPING', 'RAFTING', 'SIGHTSEEING', 'PARAGLIDING', 'MOUNTAINEERING');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE difficulty_level AS ENUM ('EASY', 'MODERATE', 'HARD');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE license_status AS ENUM ('VALID', 'EXPIRING_SOON', 'EXPIRED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE compliance_status AS ENUM ('COMPLIANT', 'AT_RISK', 'NON_COMPLIANT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE incident_severity AS ENUM ('LOW', 'HIGH', 'CRITICAL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE incident_status AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE incident_action_type AS ENUM ('REPORTED', 'ESCALATED', 'REVIEWED', 'RESOLVED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE alert_status AS ENUM ('ACTIVE', 'MODERATE', 'ALERT');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE compliance_result AS ENUM ('PASS', 'FAIL', 'CONDITIONAL');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15),
    role user_role NOT NULL DEFAULT 'TOURIST',
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS operators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    license_no VARCHAR(100) UNIQUE NOT NULL,
    activity_type activity_category NOT NULL,
    district VARCHAR(100) NOT NULL,
    license_status license_status NOT NULL DEFAULT 'VALID',
    license_expiry DATE NOT NULL,
    insurance_expiry DATE NOT NULL,
    safety_rating NUMERIC(3,2) NOT NULL DEFAULT 0,
    last_inspection DATE,
    compliance_status compliance_status NOT NULL DEFAULT 'COMPLIANT',
    experience_years INT NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    district VARCHAR(100) NOT NULL,
    location_name VARCHAR(200),
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    category activity_category NOT NULL,
    difficulty difficulty_level,
    duration_minutes INT NOT NULL,
    cover_image_url TEXT,
    base_price NUMERIC(10,2) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activity_includes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    item_name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    slot_time TIME NOT NULL,
    capacity INT NOT NULL,
    booked_count INT NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT true,
    UNIQUE (activity_id, slot_date, slot_time)
);

CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    slot_id UUID NOT NULL REFERENCES slots(id),
    activity_id UUID NOT NULL REFERENCES activities(id),
    group_size INT NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL,
    taxes NUMERIC(10,2) NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    status booking_status NOT NULL DEFAULT 'PENDING',
    qr_code_token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    booked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    confirmed_at TIMESTAMPTZ,
    CONSTRAINT taxes_check CHECK (ABS(taxes - subtotal * 0.18) < 0.01),
    CONSTRAINT total_check CHECK (ABS(total - (subtotal + taxes)) < 0.01),
    CONSTRAINT group_size_positive CHECK (group_size > 0)
);

CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id),
    user_id UUID NOT NULL REFERENCES users(id),
    activity_id UUID NOT NULL REFERENCES activities(id),
    rating NUMERIC(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES operators(id),
    activity_id UUID REFERENCES activities(id),
    reported_by UUID NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    severity incident_severity NOT NULL,
    status incident_status NOT NULL DEFAULT 'OPEN',
    district VARCHAR(100) NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL,
    resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS incident_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES users(id),
    action_type incident_action_type NOT NULL,
    note TEXT,
    acted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    total_bookings INT NOT NULL DEFAULT 0,
    total_revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
    alert_status alert_status NOT NULL DEFAULT 'ACTIVE',
    synced_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS compliance_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID NOT NULL REFERENCES operators(id),
    inspector_id UUID NOT NULL REFERENCES users(id),
    inspection_date DATE NOT NULL,
    score NUMERIC(4,2) NOT NULL,
    result compliance_result NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
