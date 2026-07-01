-- Kashmir Central Tourism - Comprehensive Seed Data
-- Run in Supabase SQL Editor (bypasses RLS as postgres role)
-- Safe to re-run: truncates and re-inserts all data

BEGIN;

-- Add elevation column if it doesn't exist (optional field)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'activities' AND column_name = 'elevation'
  ) THEN
    ALTER TABLE activities ADD COLUMN elevation TEXT;
  END IF;
END $$;

TRUNCATE TABLE
  incident_actions,
  compliance_checks,
  reviews,
  bookings,
  incidents,
  events,
  slots,
  activity_includes,
  activities,
  operators,
  users,
  districts
RESTART IDENTITY CASCADE;

-- ============================================================================
-- DISTRICTS - All major tourism districts of J&K
-- ============================================================================
INSERT INTO districts (id, name, slug, total_bookings, total_revenue, alert_status) VALUES
  ('00000000-0000-0000-0000-0000000000d1', 'Srinagar',   'srinagar',   12450, 18500000, 'ACTIVE'),
  ('00000000-0000-0000-0000-0000000000d2', 'Gulmarg',    'gulmarg',    9820,  15200000, 'ACTIVE'),
  ('00000000-0000-0000-0000-0000000000d3', 'Pahalgam',   'pahalgam',   6340,  9800000,  'ACTIVE'),
  ('00000000-0000-0000-0000-0000000000d4', 'Sonamarg',   'sonamarg',   4210,  6500000,  'MODERATE'),
  ('00000000-0000-0000-0000-0000000000d5', 'Baramulla',  'baramulla',  3890,  5700000,  'ACTIVE'),
  ('00000000-0000-0000-0000-0000000000d6', 'Ganderbal',  'ganderbal',  2780,  4100000,  'MODERATE'),
  ('00000000-0000-0000-0000-0000000000d7', 'Anantnag',   'anantnag',   2340,  3400000,  'ACTIVE'),
  ('00000000-0000-0000-0000-0000000000d8', 'Kupwara',    'kupwara',    1560,  2300000,  'MODERATE'),
  ('00000000-0000-0000-0000-0000000000d9', 'Bandipora',  'bandipora',  1280,  1900000,  'MODERATE'),
  ('00000000-0000-0000-0000-0000000000da', 'Kargil',     'kargil',     980,   1500000,  'ALERT'),
  ('00000000-0000-0000-0000-0000000000db', 'Leh',        'leh',        2150,  3200000,  'ACTIVE'),
  ('00000000-0000-0000-0000-0000000000dc', 'Pulwama',    'pulwama',    1120,  1600000,  'MODERATE');

-- ============================================================================
-- USERS - Government officers, operators, and tourists
-- ============================================================================
INSERT INTO users (id, name, email, phone, role, password_hash) VALUES
  -- Government Officers
  ('00000000-0000-0000-0000-000000000001', 'Sh. Rajiv Mehta, IAS',  'rajiv@jktourism.gov.in',   '9419000001', 'GOVT_OFFICER', '$2b$10$placeholder_hash'),
  ('00000000-0000-0000-0000-000000000002', 'Dr. Farzana Sheikh',    'farzana@jktourism.gov.in', '9419000002', 'GOVT_OFFICER', '$2b$10$placeholder_hash'),
  
  -- Operators
  ('00000000-0000-0000-0000-000000000010', 'Imran Khan',           'imran@himalayan.in',        '9419100001', 'OPERATOR', '$2b$10$placeholder_hash'),
  ('00000000-0000-0000-0000-000000000011', 'Sara Wani',            'sara@dallake.in',           '9419100002', 'OPERATOR', '$2b$10$placeholder_hash'),
  ('00000000-0000-0000-0000-000000000012', 'Farooq Ahmad Dar',     'farooq@alpineexp.in',       '9419100003', 'OPERATOR', '$2b$10$placeholder_hash'),
  ('00000000-0000-0000-0000-000000000013', 'Nazir Ahmed Bhat',     'nazir@valleyview.in',       '9419100004', 'OPERATOR', '$2b$10$placeholder_hash'),
  ('00000000-0000-0000-0000-000000000014', 'Tashi Wangchuk',       'tashi@kargiladv.in',        '9419100005', 'OPERATOR', '$2b$10$placeholder_hash'),
  ('00000000-0000-0000-0000-000000000015', 'Mohammad Ashraf',      'ashraf@gondolatours.in',    '9419100006', 'OPERATOR', '$2b$10$placeholder_hash'),
  ('00000000-0000-0000-0000-000000000016', 'Gulzar Ahmad',         'gulzar@kashmirrafting.in',  '9419100007', 'OPERATOR', '$2b$10$placeholder_hash'),
  ('00000000-0000-0000-0000-000000000017', 'Showkat Hussain',      'showkat@pahalgamtrek.in',   '9419100008', 'OPERATOR', '$2b$10$placeholder_hash'),
  
  -- Tourists
  ('00000000-0000-0000-0000-000000000004', 'Aarav Reddy',          'aarav@gmail.com',           '9419200001', 'TOURIST', '$2b$10$placeholder_hash'),
  ('00000000-0000-0000-0000-000000000020', 'Priya Sharma',         'priya.sharma@gmail.com',    '9419200002', 'TOURIST', '$2b$10$placeholder_hash'),
  ('00000000-0000-0000-0000-000000000021', 'Rahul Kumar',          'rahul.kumar@gmail.com',     '9419200003', 'TOURIST', '$2b$10$placeholder_hash'),
  ('00000000-0000-0000-0000-000000000022', 'Sneha Patel',          'sneha.patel@gmail.com',     '9419200004', 'TOURIST', '$2b$10$placeholder_hash'),
  ('00000000-0000-0000-0000-000000000023', 'Vikram Singh',         'vikram.singh@gmail.com',    '9419200005', 'TOURIST', '$2b$10$placeholder_hash'),
  ('00000000-0000-0000-0000-000000000024', 'Anita Desai',          'anita.desai@gmail.com',     '9419200006', 'TOURIST', '$2b$10$placeholder_hash');

-- ============================================================================
-- EVENTS - Government advisories and important announcements
-- ============================================================================
INSERT INTO events (id, title, message, district, category, priority, starts_at, ends_at, is_published, is_important, source_label, created_by) VALUES
  ('00000000-0000-0000-0000-00000000e101',
   'Official Advisory',
   'Weather update, route changes, and event announcements are available for today.',
   NULL,
   'GENERAL',
   'HIGH',
   NOW() - interval '3 hours',
   NOW() + interval '2 days',
   true,
   true,
   'Official advisory',
   '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-00000000e102',
   'Sunrise Trek Slots Open',
   'New sunrise trek slots for Sonamarg have opened for this weekend. Arrive 30 minutes early for safety checks.',
   'Ganderbal',
   'CULTURE',
   'MEDIUM',
   NOW() - interval '6 hours',
   NOW() + interval '5 days',
   true,
   true,
   'Tourism operations desk',
   '00000000-0000-0000-0000-000000000001'),
  ('00000000-0000-0000-0000-00000000e103',
   'Dal Lake Morning Briefing',
   'Boat safety briefing is mandatory at 6:00 AM for all sunrise shikara passengers.',
   'Srinagar',
   'SAFETY',
   'HIGH',
   NOW() - interval '12 hours',
   NOW() + interval '10 days',
   true,
   true,
   'Lake safety control room',
   '00000000-0000-0000-0000-000000000002'),
  ('00000000-0000-0000-0000-00000000e104',
   'Traffic Diversion Near Gulmarg Road',
   'Temporary diversion in place due to hillside repair work. Expect 20-30 minutes additional travel time.',
   'Baramulla',
   'TRAFFIC',
   'MEDIUM',
   NOW() - interval '1 day',
   NOW() + interval '3 days',
   true,
   false,
   'District transport cell',
   '00000000-0000-0000-0000-000000000002');

-- ============================================================================
-- OPERATORS - Tourism service providers
-- ============================================================================
INSERT INTO operators (id, user_id, company_name, license_no, activity_type, district, license_status, license_expiry, insurance_expiry, safety_rating, last_inspection, compliance_status, experience_years, is_verified) VALUES
  ('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000010', 'Himalayan Trails Co.',           'JK-OP-2291', 'GONDOLA',       'Baramulla',  'VALID',         '2026-08-12', '2025-12-31', 4.85, '2025-03-02', 'COMPLIANT',     8, true),
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000011', 'Dal Lake Shikara Union',         'JK-OP-1182', 'WATER_TOUR',    'Srinagar',   'VALID',         '2026-03-28', '2025-11-15', 4.60, '2025-02-14', 'COMPLIANT',     12, true),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000012', 'Alpine Expeditions Pvt Ltd.',    'JK-OP-3340', 'TREKKING',      'Ganderbal',  'VALID',         '2026-01-15', '2025-09-20', 4.70, '2025-01-28', 'COMPLIANT',     10, true),
  ('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000013', 'Valley View Tours',              'JK-OP-4412', 'SIGHTSEEING',   'Anantnag',   'EXPIRING_SOON', '2025-07-15', '2025-06-10', 4.20, '2024-11-05', 'AT_RISK',       5, false),
  ('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000014', 'Kargil Adventure Co.',           'JK-OP-5501', 'RAFTING',       'Kargil',     'EXPIRED',       '2024-12-01', '2024-10-15', 3.20, NULL,         'NON_COMPLIANT', 3, false),
  ('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000015', 'Gulmarg Gondola Services',       'JK-OP-6623', 'GONDOLA',       'Baramulla',  'VALID',         '2026-06-30', '2025-10-25', 4.90, '2025-04-10', 'COMPLIANT',     15, true),
  ('00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000016', 'Kashmir Valley Rafting',         'JK-OP-7734', 'RAFTING',       'Pahalgam',   'VALID',         '2026-02-28', '2025-08-30', 4.45, '2025-02-20', 'COMPLIANT',     7, true),
  ('00000000-0000-0000-0000-000000000107', '00000000-0000-0000-0000-000000000017', 'Pahalgam Trekking Adventures',   'JK-OP-8845', 'TREKKING',      'Anantnag',   'VALID',         '2026-04-15', '2025-11-20', 4.55, '2025-03-15', 'COMPLIANT',     9, true);

-- ============================================================================
-- ACTIVITIES - Tourism experiences
-- ============================================================================
INSERT INTO activities (id, operator_id, title, description, district, location_name, latitude, longitude, category, difficulty, duration_minutes, cover_image_url, base_price, is_active, elevation) VALUES
  -- Himalayan Trails activities
  ('00000000-0000-0000-0000-000000000200', '00000000-0000-0000-0000-000000000100',
   'Gulmarg Gondola Ride - Phase I',
   'Experience the breathtaking beauty of Kashmir from Asia''s highest cable car. Phase I takes you from Gulmarg to Kongdori at 2,690m elevation, offering panoramic views of the Himalayan peaks.',
   'Baramulla', 'Gondola Base Station, Gulmarg', 34.0484, 74.3805,
   'GONDOLA', 'EASY', 180, '/activities/gondola.jpg', 1500.00, true, '2,690m'),
   
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000100',
   'Gulmarg Gondola - Phase II Summit',
   'Continue to Apharwat Peak at 3,950m for stunning views of Nanga Parbat and the surrounding glaciers. Best experienced in clear weather conditions.',
   'Baramulla', 'Kongdori Station, Gulmarg', 34.0420, 74.3850,
   'GONDOLA', 'MODERATE', 240, '/activities/gondola2.jpg', 2200.00, true, '3,950m'),
   
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000100',
   'Frozen Lake Trek - Alpather',
   'Trek through pristine alpine meadows to the frozen Alpather Lake at 4,390m. A challenging day hike with rewarding views of snow-capped peaks.',
   'Ganderbal', 'Sonamarg Base Camp', 34.3027, 75.2892,
   'TREKKING', 'HARD', 480, '/activities/trek.jpg', 2500.00, true, '4,390m'),

  -- Dal Lake Shikara Union activities
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000101',
   'Shikara Sunrise Experience',
   'Drift across the mirror-calm Dal Lake at dawn as the first rays of sun illuminate the Zabarwan mountains. Includes hot Kahwa tea and traditional breakfast.',
   'Srinagar', 'Dal Lake, Nehru Park Ghat', 34.0900, 74.8200,
   'WATER_TOUR', 'EASY', 120, '/activities/shikara.jpg', 1200.00, true, NULL),
   
  ('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000101',
   'Dal Lake Sunset Cruise',
   'A romantic evening shikara ride through the floating gardens and houseboats as the sun sets over the Pir Panjal range.',
   'Srinagar', 'Dal Lake, Boulevard Road Ghat', 34.0850, 74.8250,
   'WATER_TOUR', 'EASY', 90, '/activities/shikara-sunset.jpg', 950.00, true, NULL),
   
  ('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000101',
   'Floating Market Visit',
   'Experience the unique floating vegetable market of Dal Lake where locals trade from their shikaras. Early morning tour with photography opportunities.',
   'Srinagar', 'Dal Lake, Floating Market', 34.0950, 74.8150,
   'WATER_TOUR', 'EASY', 150, '/activities/floating-market.jpg', 800.00, true, NULL),

  -- Alpine Expeditions activities
  ('00000000-0000-0000-0000-000000000206', '00000000-0000-0000-0000-000000000102',
   'Great Lakes Trek - Day 1',
   'Begin the legendary Kashmir Great Lakes trek from Sonamarg. Day 1 covers the trail to Nichnai Pass with camping at scenic meadows.',
   'Ganderbal', 'Sonamarg Trailhead', 34.3100, 75.2950,
   'TREKKING', 'HARD', 600, '/activities/great-lakes.jpg', 3500.00, true, '3,800m'),
   
  ('00000000-0000-0000-0000-000000000207', '00000000-0000-0000-0000-000000000102',
   'Thajiwas Glacier Walk',
   'A relatively easy trek to the Thajiwas Glacier with opportunities for snow play even in summer. Suitable for families.',
   'Ganderbal', 'Sonamarg, Thajiwas Parking', 34.2950, 75.2880,
   'TREKKING', 'MODERATE', 240, '/activities/thajiwas.jpg', 1500.00, true, '3,050m'),

  -- Valley View Tours activities
  ('00000000-0000-0000-0000-000000000208', '00000000-0000-0000-0000-000000000103',
   'Pahalgam Valley Tour',
   'Full day sightseeing tour covering Betaab Valley, Chandanwari, and Aru Valley. Includes vehicle and guide.',
   'Anantnag', 'Pahalgam Bus Stand', 34.0161, 75.3150,
   'SIGHTSEEING', 'EASY', 480, '/activities/pahalgam.jpg', 2000.00, true, '2,740m'),

  -- Gulmarg Gondola Services activities
  ('00000000-0000-0000-0000-000000000209', '00000000-0000-0000-0000-000000000105',
   'Skiing Lesson - Beginner',
   'Learn to ski on the legendary slopes of Gulmarg with certified instructors. Equipment rental included.',
   'Baramulla', 'Gulmarg Ski School', 34.0490, 74.3810,
   'SKIING', 'EASY', 180, '/activities/skiing.jpg', 3000.00, true, '2,690m'),
   
  ('00000000-0000-0000-0000-000000000210', '00000000-0000-0000-0000-000000000105',
   'Advanced Skiing - Full Day',
   'Full day skiing access for experienced skiers. Includes lift pass and equipment. Instructor available on request.',
   'Baramulla', 'Gulmarg Gondola Base', 34.0484, 74.3805,
   'SKIING', 'HARD', 480, '/activities/skiing-adv.jpg', 5500.00, true, '3,950m'),

  -- Kashmir Valley Rafting activities
  ('00000000-0000-0000-0000-000000000211', '00000000-0000-0000-0000-000000000106',
   'Lidder River Rafting',
   'Thrilling Grade II-III rapids on the Lidder River with experienced river guides. All safety equipment provided.',
   'Anantnag', 'Pahalgam Rafting Point', 34.0100, 75.3100,
   'RAFTING', 'MODERATE', 150, '/activities/rafting.jpg', 1800.00, true, NULL),

  -- Pahalgam Trekking Adventures activities
  ('00000000-0000-0000-0000-000000000212', '00000000-0000-0000-0000-000000000107',
   'Aru Valley Trek',
   'Scenic trek through the beautiful Aru Valley with meadows, streams, and mountain views. Perfect for nature lovers.',
   'Anantnag', 'Aru Village', 34.0800, 75.2700,
   'TREKKING', 'EASY', 300, '/activities/aru.jpg', 1200.00, true, '2,500m'),
   
  ('00000000-0000-0000-0000-000000000213', '00000000-0000-0000-0000-000000000107',
   'Tarsar Marsar Lakes Trek',
   'Multi-day trek to the stunning twin alpine lakes. One of the most beautiful treks in Kashmir.',
   'Anantnag', 'Aru Village Basecamp', 34.0800, 75.2700,
   'TREKKING', 'HARD', 2880, '/activities/tarsar.jpg', 12000.00, true, '4,000m');

-- ============================================================================
-- ACTIVITY INCLUDES - What's included in each activity
-- ============================================================================
INSERT INTO activity_includes (id, activity_id, item_name) VALUES
  -- Gulmarg Gondola Phase I
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000200', 'Guide'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000200', 'Insurance'),
  
  -- Gulmarg Gondola Phase II
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000201', 'Guide'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000201', 'Insurance'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000201', 'Gear'),
  
  -- Frozen Lake Trek
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000202', 'Guide'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000202', 'Gear'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000202', 'Lunch'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000202', 'Transport'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000202', 'Insurance'),
  
  -- Shikara Sunrise
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000203', 'Guide'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000203', 'Lunch'),
  
  -- Shikara Sunset
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000204', 'Guide'),
  
  -- Great Lakes Trek
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000206', 'Guide'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000206', 'Gear'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000206', 'Lunch'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000206', 'Transport'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000206', 'Insurance'),
  
  -- Thajiwas Glacier
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000207', 'Guide'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000207', 'Gear'),
  
  -- Skiing Beginner
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000209', 'Gear'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000209', 'Insurance'),
  
  -- Rafting
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000211', 'Gear'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000211', 'Insurance'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000211', 'Guide');

-- ============================================================================
-- SLOTS - Available booking slots for activities (next 30 days)
-- ============================================================================
INSERT INTO slots (id, activity_id, slot_date, slot_time, capacity, booked_count, is_available)
SELECT
  gen_random_uuid(),
  a.id,
  (CURRENT_DATE + s.day)::date,
  t.slot_time,
  CASE 
    WHEN a.category = 'GONDOLA' THEN 50
    WHEN a.category = 'WATER_TOUR' THEN 8
    WHEN a.category = 'TREKKING' THEN 15
    WHEN a.category = 'SKIING' THEN 20
    WHEN a.category = 'RAFTING' THEN 12
    ELSE 20
  END,
  CASE 
    WHEN t.slot_time = '13:00'::time AND s.day % 5 = 0 THEN 
      CASE WHEN a.category = 'GONDOLA' THEN 50 WHEN a.category = 'WATER_TOUR' THEN 8 ELSE 15 END
    ELSE ((s.day + EXTRACT(EPOCH FROM t.slot_time)::int / 3600) % 6) + 1
  END,
  NOT (t.slot_time = '13:00'::time AND s.day % 5 = 0)
FROM
  activities a,
  generate_series(1, 30) AS s(day),
  (VALUES ('08:00'::time), ('10:30'::time), ('13:00'::time), ('15:30'::time)) AS t(slot_time)
WHERE a.is_active = true;

-- ============================================================================
-- BOOKINGS - Sample bookings for demo user
-- ============================================================================
INSERT INTO bookings (id, user_id, slot_id, activity_id, group_size, subtotal, taxes, total, status, qr_code_token, booked_at, confirmed_at) 
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000004'::uuid,
  s.id,
  s.activity_id,
  2,
  a.base_price * 2,
  ROUND(a.base_price * 2 * 0.18),
  ROUND(a.base_price * 2 * 1.18),
  'CONFIRMED',
  gen_random_uuid(),
  NOW() - (random() * interval '7 days'),
  NOW() - (random() * interval '6 days')
FROM slots s
JOIN activities a ON s.activity_id = a.id
WHERE s.slot_date = CURRENT_DATE + 3
  AND s.slot_time = '10:30'
  AND a.id IN ('00000000-0000-0000-0000-000000000200', '00000000-0000-0000-0000-000000000203')
LIMIT 2;

-- Add a pending booking
INSERT INTO bookings (id, user_id, slot_id, activity_id, group_size, subtotal, taxes, total, status, qr_code_token, booked_at, confirmed_at)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000004'::uuid,
  s.id,
  s.activity_id,
  3,
  a.base_price * 3,
  ROUND(a.base_price * 3 * 0.18),
  ROUND(a.base_price * 3 * 1.18),
  'PENDING',
  gen_random_uuid(),
  NOW() - interval '1 day',
  NULL
FROM slots s
JOIN activities a ON s.activity_id = a.id
WHERE s.slot_date = CURRENT_DATE + 5
  AND s.slot_time = '08:00'
  AND a.id = '00000000-0000-0000-0000-000000000202'
LIMIT 1;

-- Add a completed booking
INSERT INTO bookings (id, user_id, slot_id, activity_id, group_size, subtotal, taxes, total, status, qr_code_token, booked_at, confirmed_at)
SELECT
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000004'::uuid,
  s.id,
  s.activity_id,
  2,
  a.base_price * 2,
  ROUND(a.base_price * 2 * 0.18),
  ROUND(a.base_price * 2 * 1.18),
  'COMPLETED',
  gen_random_uuid(),
  NOW() - interval '14 days',
  NOW() - interval '14 days'
FROM slots s
JOIN activities a ON s.activity_id = a.id
WHERE s.slot_date = CURRENT_DATE - 10
  AND s.slot_time = '10:30'
  AND a.id = '00000000-0000-0000-0000-000000000204'
LIMIT 1;

-- ============================================================================
-- REVIEWS - Customer reviews
-- ============================================================================
INSERT INTO reviews (id, booking_id, user_id, activity_id, rating, comment) 
SELECT
  gen_random_uuid(),
  b.id,
  b.user_id,
  b.activity_id,
  4.5 + (random() * 0.5),
  CASE (random() * 3)::int
    WHEN 0 THEN 'Absolutely breathtaking experience! The views were incredible and our guide was very knowledgeable.'
    WHEN 1 THEN 'Well organized tour with professional staff. Would definitely recommend to others.'
    WHEN 2 THEN 'Amazing adventure! The scenery was beyond words. Will come back again.'
    ELSE 'Fantastic experience from start to finish. Great value for money!'
  END
FROM bookings b
WHERE b.status = 'COMPLETED'
LIMIT 5;

-- ============================================================================
-- INCIDENTS - Safety incidents
-- ============================================================================
INSERT INTO incidents (id, operator_id, activity_id, reported_by, title, description, severity, status, district, occurred_at, resolved_at) VALUES
  ('00000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000001', 
   'Trekker Injury — Sonamarg Trail 4', 
   'Solo trekker sustained ankle fracture on Trail 4 near Thajiwas Glacier during descent. Emergency rescue team was dispatched. Patient evacuated to Srinagar hospital.',
   'CRITICAL', 'OPEN', 'Ganderbal', NOW() - interval '2 hours', NULL),
   
  ('00000000-0000-0000-0000-0000000000e2', '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000010', 
   'Equipment Fault — Gondola Phase II', 
   'Mechanical fault detected in Phase II cable system during routine morning inspection. Gondola operations suspended pending investigation by technical team.',
   'HIGH', 'UNDER_REVIEW', 'Baramulla', NOW() - interval '12 hours', NULL),
   
  ('00000000-0000-0000-0000-0000000000e3', '00000000-0000-0000-0000-000000000103', NULL, '00000000-0000-0000-0000-000000000001', 
   'Overcrowding — Betaab Valley Viewpoint', 
   'Tourist density at Betaab Valley main viewpoint exceeded safe capacity limits during peak hours. Traffic management deployed.',
   'HIGH', 'UNDER_REVIEW', 'Anantnag', NOW() - interval '1 day', NULL),
   
  ('00000000-0000-0000-0000-0000000000e4', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000004', 
   'Minor Capsize — Dal Lake Shikara', 
   'Shikara tipped during sudden wind gust near Nehru Park. All 4 passengers wearing life jackets were rescued safely within minutes. No injuries reported.',
   'LOW', 'RESOLVED', 'Srinagar', NOW() - interval '5 days', NOW() - interval '4 days'),
   
  ('00000000-0000-0000-0000-0000000000e5', '00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000211', '00000000-0000-0000-0000-000000000001', 
   'Near Miss — Lidder River Rafting', 
   'Raft briefly capsized at Grade III rapid. All participants wearing safety gear, no injuries. Operator warned about adherence to safety protocols.',
   'LOW', 'RESOLVED', 'Anantnag', NOW() - interval '10 days', NOW() - interval '9 days');

-- ============================================================================
-- INCIDENT ACTIONS - Audit trail
-- ============================================================================
INSERT INTO incident_actions (id, incident_id, actor_id, action_type, note, acted_at) VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-000000000001', 'REPORTED', 'Emergency response initiated', NOW() - interval '2 hours'),
  (gen_random_uuid(), '00000000-0000-0000-0000-0000000000e2', '00000000-0000-0000-0000-000000000001', 'REPORTED', NULL, NOW() - interval '12 hours'),
  (gen_random_uuid(), '00000000-0000-0000-0000-0000000000e2', '00000000-0000-0000-0000-000000000001', 'REVIEWED', 'Technical team dispatched for inspection', NOW() - interval '10 hours'),
  (gen_random_uuid(), '00000000-0000-0000-0000-0000000000e4', '00000000-0000-0000-0000-000000000001', 'REPORTED', NULL, NOW() - interval '5 days'),
  (gen_random_uuid(), '00000000-0000-0000-0000-0000000000e4', '00000000-0000-0000-0000-000000000001', 'RESOLVED', 'All passengers safe, operator counseled on weather monitoring', NOW() - interval '4 days');

-- ============================================================================
-- COMPLIANCE CHECKS - Operator inspections
-- ============================================================================
INSERT INTO compliance_checks (id, operator_id, inspector_id, inspection_date, score, result, notes) VALUES
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000001', '2025-03-02', 4.85, 'PASS', 'All safety equipment verified. Excellent record maintenance.'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', '2025-02-14', 4.60, 'PASS', 'Life jackets and rescue equipment in good condition.'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', '2025-01-28', 4.70, 'PASS', 'Trekking gear meets standards. Guide certifications verified.'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', '2024-11-05', 3.80, 'CONDITIONAL', 'Insurance renewal pending. Follow-up inspection required.'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000001', '2024-10-01', 2.50, 'FAIL', 'Expired license and insurance. Operations suspended until compliance.'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000001', '2025-04-10', 4.90, 'PASS', 'State-of-the-art equipment. Exemplary safety standards.'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000001', '2025-02-20', 4.45, 'PASS', 'Rafting equipment checked. Guide training certificates valid.'),
  (gen_random_uuid(), '00000000-0000-0000-0000-000000000107', '00000000-0000-0000-0000-000000000001', '2025-03-15', 4.55, 'PASS', 'Well-maintained gear. First aid kits fully stocked.');

-- ============================================================================
-- RLS write policies for API routes (idempotent)
-- ============================================================================
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_includes ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anon insert activities" ON activities;
CREATE POLICY "Anon insert activities" ON activities FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anon insert activity_includes" ON activity_includes;
CREATE POLICY "Anon insert activity_includes" ON activity_includes FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anon insert slots" ON slots;
CREATE POLICY "Anon insert slots" ON slots FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anon insert bookings" ON bookings;
CREATE POLICY "Anon insert bookings" ON bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anon update slots" ON slots;
CREATE POLICY "Anon update slots" ON slots FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anon update incidents" ON incidents;
CREATE POLICY "Anon update incidents" ON incidents FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anon insert incident_actions" ON incident_actions;
CREATE POLICY "Anon insert incident_actions" ON incident_actions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read events" ON events;
CREATE POLICY "Public read events" ON events FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Gov manage events" ON events;
CREATE POLICY "Gov manage events" ON events FOR ALL USING (true);

COMMIT;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
SELECT 'districts' AS entity, count(*)::int AS rows FROM districts
UNION ALL SELECT 'users', count(*)::int FROM users
UNION ALL SELECT 'operators', count(*)::int FROM operators
UNION ALL SELECT 'activities', count(*)::int FROM activities
UNION ALL SELECT 'slots', count(*)::int FROM slots
UNION ALL SELECT 'bookings', count(*)::int FROM bookings
UNION ALL SELECT 'incidents', count(*)::int FROM incidents
UNION ALL SELECT 'events', count(*)::int FROM events
UNION ALL SELECT 'reviews', count(*)::int FROM reviews
ORDER BY entity;
