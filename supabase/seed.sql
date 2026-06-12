-- Sample data seed — run in Supabase SQL Editor (bypasses RLS as postgres role)
-- Select ALL of this file and run as one query. Safe to re-run.

BEGIN;

TRUNCATE TABLE
  incident_actions,
  compliance_checks,
  reviews,
  bookings,
  incidents,
  slots,
  activity_includes,
  activities,
  operators,
  users,
  districts
RESTART IDENTITY CASCADE;

INSERT INTO districts (id, name, slug, total_bookings, total_revenue, alert_status) VALUES
  ('00000000-0000-0000-0000-0000000000d1', 'Srinagar',  'srinagar',  8420, 11000000, 'ACTIVE'),
  ('00000000-0000-0000-0000-0000000000d2', 'Gulmarg',   'gulmarg',   6180,  9000000, 'ACTIVE'),
  ('00000000-0000-0000-0000-0000000000d3', 'Pahalgam',  'pahalgam',  3940,  5000000, 'MODERATE'),
  ('00000000-0000-0000-0000-0000000000d4', 'Sonamarg',  'sonamarg',  2100,  3200000, 'MODERATE'),
  ('00000000-0000-0000-0000-0000000000d5', 'Kargil',    'kargil',    1340,  2000000, 'ALERT'),
  ('00000000-0000-0000-0000-0000000000d6', 'Anantnag',  'anantnag',  2890,  3800000, 'ACTIVE');

INSERT INTO users (id, name, email, phone, role, password_hash) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Rajiv Mehta',   'rajiv@jktourism.gov.in', '9419000001', 'GOVT_OFFICER', '$2b$10$placeholder_hash_seed'),
  ('00000000-0000-0000-0000-000000000002', 'Imran Khan',    'imran@himalayan.in',     '9419000002', 'OPERATOR',     '$2b$10$placeholder_hash_seed'),
  ('00000000-0000-0000-0000-000000000003', 'Sara Wani',     'sara@dallake.in',        '9419000003', 'OPERATOR',     '$2b$10$placeholder_hash_seed'),
  ('00000000-0000-0000-0000-000000000004', 'Aarav Reddy',   'aarav@gmail.com',        '9419000004', 'TOURIST',      '$2b$10$placeholder_hash_seed'),
  ('00000000-0000-0000-0000-000000000005', 'Farooq Dar',    'farooq@alpine.in',       '9419000005', 'OPERATOR',     '$2b$10$placeholder_hash_seed'),
  ('00000000-0000-0000-0000-000000000006', 'Nazir Bhat',    'nazir@valleyview.in',    '9419000006', 'OPERATOR',     '$2b$10$placeholder_hash_seed'),
  ('00000000-0000-0000-0000-000000000007', 'Tashi Wangchuk','tashi@kargiladv.in',     '9419000007', 'OPERATOR',     '$2b$10$placeholder_hash_seed');

INSERT INTO operators (id, user_id, company_name, license_no, activity_type, district, license_status, license_expiry, insurance_expiry, safety_rating, last_inspection, compliance_status, experience_years, is_verified) VALUES
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002', 'Himalayan Trails Co.',       'JK-OP-2291', 'GONDOLA',     'Baramulla', 'VALID',         '2026-08-12', '2025-08-12', 4.80, '2025-03-02', 'COMPLIANT',     7, true),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000003', 'Dal Lake Shikara Union',     'JK-OP-1182', 'WATER_TOUR',  'Srinagar',  'VALID',         '2026-03-28', '2025-03-28', 4.50, '2025-02-14', 'COMPLIANT',     5, true),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000005', 'Alpine Expeditions Pvt Ltd.','JK-OP-3340', 'TREKKING',    'Ganderbal', 'VALID',         '2026-01-15', '2025-06-20', 4.60, '2025-01-28', 'AT_RISK',       9, true),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000006', 'Valley View Tours',          'JK-OP-4412', 'SIGHTSEEING', 'Anantnag',  'EXPIRING_SOON', '2025-07-01', '2025-04-10', 4.20, '2024-11-05', 'AT_RISK',       4, false),
  ('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000007', 'Kargil Adventure Co.',       'JK-OP-5501', 'RAFTING',     'Kargil',    'EXPIRED',       '2024-12-01', '2024-10-15', 3.10, NULL,         'NON_COMPLIANT', 2, false);

INSERT INTO activities (id, operator_id, title, description, district, location_name, latitude, longitude, category, difficulty, duration_minutes, cover_image_url, base_price, is_active) VALUES
  ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000010',
   'Gulmarg Gondola Ride',
   'Glide above the snow-draped meadows of Gulmarg on Asia''s highest cable car.',
   'Baramulla', 'Gondola Base Station, Gulmarg', 34.0484, 74.3805,
   'GONDOLA', 'MODERATE', 240, '/activities/gondola.jpg', 1800.00, true),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000010',
   'Frozen Lake Trek',
   'Trek through alpine meadows to a frozen glacial lake at 3,800m.',
   'Ganderbal', 'Sonamarg Base Camp', 34.3027, 75.2892,
   'TREKKING', 'HARD', 480, '/activities/trek.jpg', 1800.00, true),
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000011',
   'Shikara at Sunrise',
   'Drift across the mirror-calm Dal Lake at dawn.',
   'Srinagar', 'Dal Lake, Nehru Park Ghat', 34.0900, 74.8200,
   'WATER_TOUR', 'EASY', 90, '/activities/shikara.jpg', 950.00, true);

INSERT INTO activity_includes (id, activity_id, item_name) VALUES
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000020', 'Guide'),
  ('00000000-0000-0000-0000-0000000000a2', '00000000-0000-0000-0000-000000000020', 'Gear'),
  ('00000000-0000-0000-0000-0000000000a3', '00000000-0000-0000-0000-000000000020', 'Lunch'),
  ('00000000-0000-0000-0000-0000000000a4', '00000000-0000-0000-0000-000000000020', 'Transport'),
  ('00000000-0000-0000-0000-0000000000a5', '00000000-0000-0000-0000-000000000021', 'Guide'),
  ('00000000-0000-0000-0000-0000000000a6', '00000000-0000-0000-0000-000000000021', 'Gear'),
  ('00000000-0000-0000-0000-0000000000a7', '00000000-0000-0000-0000-000000000022', 'Guide');

-- Slots: next 21 days × 4 times × 3 activities (mostly open; a few fully booked)
INSERT INTO slots (id, activity_id, slot_date, slot_time, capacity, booked_count, is_available)
SELECT
  CASE
    WHEN a.id = '00000000-0000-0000-0000-000000000020'::uuid AND s.day = 2 AND t.slot_time = '10:30'::time
      THEN '00000000-0000-0000-0000-000000000040'::uuid
    WHEN a.id = '00000000-0000-0000-0000-000000000022'::uuid AND s.day = 3 AND t.slot_time = '08:00'::time
      THEN '00000000-0000-0000-0000-000000000041'::uuid
    WHEN a.id = '00000000-0000-0000-0000-000000000021'::uuid AND s.day = 4 AND t.slot_time = '08:00'::time
      THEN '00000000-0000-0000-0000-000000000042'::uuid
    ELSE gen_random_uuid()
  END,
  a.id,
  (CURRENT_DATE + s.day)::date,
  t.slot_time,
  20,
  CASE
    WHEN t.slot_time = '13:00'::time AND s.day % 7 = 0 THEN 20
    ELSE ((s.day + a.idx) % 4) + 2
  END,
  NOT (t.slot_time = '13:00'::time AND s.day % 7 = 0)
FROM
  (VALUES
    ('00000000-0000-0000-0000-000000000020'::uuid, 0),
    ('00000000-0000-0000-0000-000000000021'::uuid, 1),
    ('00000000-0000-0000-0000-000000000022'::uuid, 2)
  ) AS a(id, idx),
  generate_series(1, 21) AS s(day),
  (VALUES
    ('08:00'::time),
    ('10:30'::time),
    ('13:00'::time),
    ('15:30'::time)
  ) AS t(slot_time);

INSERT INTO bookings (id, user_id, slot_id, activity_id, group_size, subtotal, taxes, total, status, qr_code_token, booked_at, confirmed_at) VALUES
  ('00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000040', '00000000-0000-0000-0000-000000000020', 2, 3600, 648, 4248, 'CONFIRMED', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', now() - interval '3 days', now() - interval '3 days'),
  ('00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000041', '00000000-0000-0000-0000-000000000022', 1, 950, 171, 1121, 'PENDING', 'b2c3d4e5-f6a7-8901-bcde-f1234567890a', now() - interval '1 day', NULL),
  ('00000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000042', '00000000-0000-0000-0000-000000000021', 3, 5400, 972, 6372, 'COMPLETED', 'c3d4e5f6-a7b8-9012-cdef-1234567890ab', now() - interval '14 days', now() - interval '14 days');

INSERT INTO reviews (id, booking_id, user_id, activity_id, rating, comment) VALUES
  ('00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000020', 4.8, 'Breathtaking views! Well organized.');

INSERT INTO incidents (id, operator_id, activity_id, reported_by, title, description, severity, status, district, occurred_at, resolved_at) VALUES
  ('00000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000001', 'Trekker Injury — Sonamarg Trail 4', 'Solo trekker sustained ankle fracture on Trail 4 near Thajiwas Glacier. Rescue team dispatched.', 'CRITICAL', 'OPEN', 'Ganderbal', '2025-06-11T13:58:00Z', NULL),
  ('00000000-0000-0000-0000-0000000000e2', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000002', 'Equipment Failure — Gondola Phase II', 'Mechanical fault detected in Phase II cable system during routine inspection.', 'HIGH', 'UNDER_REVIEW', 'Baramulla', '2025-06-10T09:30:00Z', NULL),
  ('00000000-0000-0000-0000-0000000000e3', '00000000-0000-0000-0000-000000000013', NULL, '00000000-0000-0000-0000-000000000001', 'Overcrowding — Pahalgam Valley Point', 'Excessive tourist density at Betaab Valley viewpoint exceeded safe capacity limits.', 'HIGH', 'UNDER_REVIEW', 'Anantnag', '2025-06-09T11:00:00Z', NULL),
  ('00000000-0000-0000-0000-0000000000e4', '00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000004', 'Minor Capsize — Dal Lake Shikara', 'Shikara tipped during sudden wind gust. All passengers rescued safely.', 'LOW', 'RESOLVED', 'Srinagar', '2025-06-05T16:20:00Z', '2025-06-06T10:00:00Z');

INSERT INTO incident_actions (id, incident_id, actor_id, action_type, note, acted_at) VALUES
  ('00000000-0000-0000-0000-0000000000f2', '00000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-000000000001', 'REPORTED', NULL, '2025-06-11T13:58:00Z'),
  ('00000000-0000-0000-0000-0000000000f3', '00000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-000000000001', 'REVIEWED', 'Rescue team dispatched', '2025-06-11T14:05:00Z');

INSERT INTO compliance_checks (id, operator_id, inspector_id, inspection_date, score, result, notes) VALUES
  ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', '2025-03-02', 4.85, 'PASS', 'All safety equipment verified.'),
  ('00000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', '2025-02-14', 4.50, 'PASS', NULL),
  ('00000000-0000-0000-0000-0000000000c3', '00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000001', '2024-10-01', 2.80, 'FAIL', 'Expired insurance and license.');

COMMIT;

-- Verify (should show 3 activities, 6 districts, 252 slots, 3 bookings)
SELECT 'districts' AS entity, count(*)::int AS rows FROM districts
UNION ALL SELECT 'users', count(*)::int FROM users
UNION ALL SELECT 'operators', count(*)::int FROM operators
UNION ALL SELECT 'activities', count(*)::int FROM activities
UNION ALL SELECT 'slots', count(*)::int FROM slots
UNION ALL SELECT 'bookings', count(*)::int FROM bookings;
