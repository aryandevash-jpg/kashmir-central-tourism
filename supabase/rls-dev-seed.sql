-- Dev-only: allow npm run db:seed with publishable key
-- Run once in SQL Editor if you prefer CLI seeding over seed.sql

ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dev seed insert districts" ON districts FOR INSERT WITH CHECK (true);
CREATE POLICY "Dev seed insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Dev seed insert operators" ON operators FOR INSERT WITH CHECK (true);
CREATE POLICY "Dev seed insert activities" ON activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Dev seed insert includes" ON activity_includes FOR INSERT WITH CHECK (true);
CREATE POLICY "Dev seed insert slots" ON slots FOR INSERT WITH CHECK (true);
CREATE POLICY "Dev seed insert incidents" ON incidents FOR INSERT WITH CHECK (true);
CREATE POLICY "Dev seed insert reviews" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Dev seed insert compliance" ON compliance_checks FOR INSERT WITH CHECK (true);
CREATE POLICY "Dev seed insert actions" ON incident_actions FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read compliance" ON compliance_checks FOR SELECT USING (true);
CREATE POLICY "Public read actions" ON incident_actions FOR SELECT USING (true);
