-- Run in Supabase SQL Editor after your schema + seeds.
-- Allow publishable (client) role read on public tables and insert on bookings.

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_includes ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read activities" ON activities FOR SELECT USING (true);
CREATE POLICY "Public read includes" ON activity_includes FOR SELECT USING (true);
CREATE POLICY "Public read slots" ON slots FOR SELECT USING (true);
CREATE POLICY "Public read operators" ON operators FOR SELECT USING (true);
CREATE POLICY "Public read districts" ON districts FOR SELECT USING (true);
CREATE POLICY "Public read incidents" ON incidents FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public read users" ON users FOR SELECT USING (true);
CREATE POLICY "Public read bookings" ON bookings FOR SELECT USING (true);

CREATE POLICY "Anon insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon update slots" ON slots FOR UPDATE USING (true);
