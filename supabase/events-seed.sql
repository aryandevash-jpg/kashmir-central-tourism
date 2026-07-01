-- Events-only seed (idempotent)
-- Inserts/upserts sample published event banners.

INSERT INTO events (
  id, title, message, district, category, priority,
  starts_at, ends_at, is_published, is_important, source_label, created_by
) VALUES
  (
    '00000000-0000-0000-0000-00000000e101',
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
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    '00000000-0000-0000-0000-00000000e102',
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
    '00000000-0000-0000-0000-000000000001'
  ),
  (
    '00000000-0000-0000-0000-00000000e103',
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
    '00000000-0000-0000-0000-000000000002'
  ),
  (
    '00000000-0000-0000-0000-00000000e104',
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
    '00000000-0000-0000-0000-000000000002'
  )
ON CONFLICT (id) DO UPDATE
SET
  title = EXCLUDED.title,
  message = EXCLUDED.message,
  district = EXCLUDED.district,
  category = EXCLUDED.category,
  priority = EXCLUDED.priority,
  starts_at = EXCLUDED.starts_at,
  ends_at = EXCLUDED.ends_at,
  is_published = EXCLUDED.is_published,
  is_important = EXCLUDED.is_important,
  source_label = EXCLUDED.source_label,
  created_by = EXCLUDED.created_by,
  updated_at = now();
