/**
 * Seed Supabase with sample data.
 *
 * Auth (first match wins):
 *   1. SUPABASE_SERVICE_ROLE_KEY — bypasses RLS (recommended)
 *   2. DATABASE_URL — runs supabase/seed.sql via direct Postgres
 *   3. NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY — requires dev insert RLS policies
 *
 * Run: npm run db:seed
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import postgres from "postgres";

function loadEnv() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i);
    const val = t.slice(i + 1);
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const databaseUrl = process.env.DATABASE_URL;

async function seedViaSqlFile() {
  const seedPath = resolve(process.cwd(), "supabase/seed.sql");
  const sql = postgres(databaseUrl, { max: 1 });
  try {
    await sql.file(seedPath);
    console.log("  ✓ seed.sql executed via DATABASE_URL");
  } finally {
    await sql.end();
  }
}

function getSupabaseClient() {
  const key = serviceKey || publishableKey;
  if (!url || !key) return null;
  if (!serviceKey) {
    console.warn(
      "Using publishable key — insert may fail unless dev RLS policies are applied.\n" +
        "Prefer SUPABASE_SERVICE_ROLE_KEY or DATABASE_URL.\n"
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const supabase = getSupabaseClient();

const PLACEHOLDER_HASH = "$2b$10$placeholder_hash_seed";

const IDS = {
  users: {
    rajiv: "00000000-0000-0000-0000-000000000001",
    imran: "00000000-0000-0000-0000-000000000002",
    sara: "00000000-0000-0000-0000-000000000003",
    aarav: "00000000-0000-0000-0000-000000000004",
    alpine: "00000000-0000-0000-0000-000000000005",
    valley: "00000000-0000-0000-0000-000000000006",
    kargil: "00000000-0000-0000-0000-000000000007",
  },
  operators: {
    himalayan: "00000000-0000-0000-0000-000000000010",
    shikara: "00000000-0000-0000-0000-000000000011",
    alpine: "00000000-0000-0000-0000-000000000012",
    valley: "00000000-0000-0000-0000-000000000013",
    kargil: "00000000-0000-0000-0000-000000000014",
  },
  activities: {
    gondola: "00000000-0000-0000-0000-000000000020",
    trek: "00000000-0000-0000-0000-000000000021",
    shikara: "00000000-0000-0000-0000-000000000022",
  },
  bookings: {
    b1: "00000000-0000-0000-0000-000000000030",
    b2: "00000000-0000-0000-0000-000000000031",
  },
  slotGondola: "00000000-0000-0000-0000-000000000040",
  slotShikara: "00000000-0000-0000-0000-000000000041",
};

async function upsert(table, rows) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw new Error(`${table}: ${error.message}`);
  console.log(`  ✓ ${table} (${rows.length} rows)`);
}

async function main() {
  console.log("Seeding Supabase…\n");

  if (databaseUrl) {
    await seedViaSqlFile();
    console.log("\n✅ Seed complete!");
    return;
  }

  if (!supabase) {
    console.error(
      "Missing credentials in .env.local. Add one of:\n" +
        "  • SUPABASE_SERVICE_ROLE_KEY (Project Settings → API → service_role)\n" +
        "  • DATABASE_URL (Project Settings → Database → connection string)\n" +
        "  • Or paste supabase/seed.sql into the Supabase SQL Editor"
    );
    process.exit(1);
  }

  await upsert("districts", [
    { id: "00000000-0000-0000-0000-0000000000d1", name: "Srinagar", slug: "srinagar", total_bookings: 8420, total_revenue: 11000000, alert_status: "ACTIVE" },
    { id: "00000000-0000-0000-0000-0000000000d2", name: "Gulmarg", slug: "gulmarg", total_bookings: 6180, total_revenue: 9000000, alert_status: "ACTIVE" },
    { id: "00000000-0000-0000-0000-0000000000d3", name: "Pahalgam", slug: "pahalgam", total_bookings: 3940, total_revenue: 5000000, alert_status: "MODERATE" },
    { id: "00000000-0000-0000-0000-0000000000d4", name: "Sonamarg", slug: "sonamarg", total_bookings: 2100, total_revenue: 3200000, alert_status: "MODERATE" },
    { id: "00000000-0000-0000-0000-0000000000d5", name: "Kargil", slug: "kargil", total_bookings: 1340, total_revenue: 2000000, alert_status: "ALERT" },
    { id: "00000000-0000-0000-0000-0000000000d6", name: "Anantnag", slug: "anantnag", total_bookings: 2890, total_revenue: 3800000, alert_status: "ACTIVE" },
  ]);

  await upsert("users", [
    { id: IDS.users.rajiv, name: "Rajiv Mehta", email: "rajiv@jktourism.gov.in", phone: "9419000001", role: "GOVT_OFFICER", password_hash: PLACEHOLDER_HASH },
    { id: IDS.users.imran, name: "Imran Khan", email: "imran@himalayan.in", phone: "9419000002", role: "OPERATOR", password_hash: PLACEHOLDER_HASH },
    { id: IDS.users.sara, name: "Sara Wani", email: "sara@dallake.in", phone: "9419000003", role: "OPERATOR", password_hash: PLACEHOLDER_HASH },
    { id: IDS.users.aarav, name: "Aarav Reddy", email: "aarav@gmail.com", phone: "9419000004", role: "TOURIST", password_hash: PLACEHOLDER_HASH },
    { id: IDS.users.alpine, name: "Farooq Dar", email: "farooq@alpine.in", phone: "9419000005", role: "OPERATOR", password_hash: PLACEHOLDER_HASH },
    { id: IDS.users.valley, name: "Nazir Bhat", email: "nazir@valleyview.in", phone: "9419000006", role: "OPERATOR", password_hash: PLACEHOLDER_HASH },
    { id: IDS.users.kargil, name: "Tashi Wangchuk", email: "tashi@kargiladv.in", phone: "9419000007", role: "OPERATOR", password_hash: PLACEHOLDER_HASH },
  ]);

  await upsert("operators", [
    { id: IDS.operators.himalayan, user_id: IDS.users.imran, company_name: "Himalayan Trails Co.", license_no: "JK-OP-2291", activity_type: "GONDOLA", district: "Baramulla", license_status: "VALID", license_expiry: "2026-08-12", insurance_expiry: "2025-08-12", safety_rating: 4.8, last_inspection: "2025-03-02", compliance_status: "COMPLIANT", experience_years: 7, is_verified: true },
    { id: IDS.operators.shikara, user_id: IDS.users.sara, company_name: "Dal Lake Shikara Union", license_no: "JK-OP-1182", activity_type: "WATER_TOUR", district: "Srinagar", license_status: "VALID", license_expiry: "2026-03-28", insurance_expiry: "2025-03-28", safety_rating: 4.5, last_inspection: "2025-02-14", compliance_status: "COMPLIANT", experience_years: 5, is_verified: true },
    { id: IDS.operators.alpine, user_id: IDS.users.alpine, company_name: "Alpine Expeditions Pvt Ltd.", license_no: "JK-OP-3340", activity_type: "TREKKING", district: "Ganderbal", license_status: "VALID", license_expiry: "2026-01-15", insurance_expiry: "2025-06-20", safety_rating: 4.6, last_inspection: "2025-01-28", compliance_status: "AT_RISK", experience_years: 9, is_verified: true },
    { id: IDS.operators.valley, user_id: IDS.users.valley, company_name: "Valley View Tours", license_no: "JK-OP-4412", activity_type: "SIGHTSEEING", district: "Anantnag", license_status: "EXPIRING_SOON", license_expiry: "2025-07-01", insurance_expiry: "2025-04-10", safety_rating: 4.2, last_inspection: "2024-11-05", compliance_status: "AT_RISK", experience_years: 4, is_verified: false },
    { id: IDS.operators.kargil, user_id: IDS.users.kargil, company_name: "Kargil Adventure Co.", license_no: "JK-OP-5501", activity_type: "RAFTING", district: "Kargil", license_status: "EXPIRED", license_expiry: "2024-12-01", insurance_expiry: "2024-10-15", safety_rating: 3.1, compliance_status: "NON_COMPLIANT", experience_years: 2, is_verified: false },
  ]);

  await upsert("activities", [
    { id: IDS.activities.gondola, operator_id: IDS.operators.himalayan, title: "Gulmarg Gondola Ride", description: "Glide above the snow-draped meadows of Gulmarg on Asia's highest cable car.", district: "Baramulla", location_name: "Gondola Base Station, Gulmarg", latitude: 34.0484, longitude: 74.3805, category: "GONDOLA", difficulty: "MODERATE", duration_minutes: 240, cover_image_url: "/activities/gondola.jpg", base_price: 1800, is_active: true },
    { id: IDS.activities.trek, operator_id: IDS.operators.himalayan, title: "Frozen Lake Trek", description: "Trek through alpine meadows to a frozen glacial lake at 3,800m.", district: "Ganderbal", location_name: "Sonamarg Base Camp", latitude: 34.3027, longitude: 75.2892, category: "TREKKING", difficulty: "HARD", duration_minutes: 480, cover_image_url: "/activities/trek.jpg", base_price: 1800, is_active: true },
    { id: IDS.activities.shikara, operator_id: IDS.operators.shikara, title: "Shikara at Sunrise", description: "Drift across the mirror-calm Dal Lake at dawn.", district: "Srinagar", location_name: "Dal Lake, Nehru Park Ghat", latitude: 34.09, longitude: 74.82, category: "WATER_TOUR", difficulty: "EASY", duration_minutes: 90, cover_image_url: "/activities/shikara.jpg", base_price: 950, is_active: true },
  ]);

  await upsert("activity_includes", [
    { id: "00000000-0000-0000-0000-0000000000a1", activity_id: IDS.activities.gondola, item_name: "Guide" },
    { id: "00000000-0000-0000-0000-0000000000a2", activity_id: IDS.activities.gondola, item_name: "Gear" },
    { id: "00000000-0000-0000-0000-0000000000a3", activity_id: IDS.activities.gondola, item_name: "Lunch" },
    { id: "00000000-0000-0000-0000-0000000000a4", activity_id: IDS.activities.gondola, item_name: "Transport" },
    { id: "00000000-0000-0000-0000-0000000000a5", activity_id: IDS.activities.trek, item_name: "Guide" },
    { id: "00000000-0000-0000-0000-0000000000a6", activity_id: IDS.activities.trek, item_name: "Gear" },
    { id: "00000000-0000-0000-0000-0000000000a7", activity_id: IDS.activities.shikara, item_name: "Guide" },
  ]);

  // Generate slots: next 14 days × 4 times × 3 activities
  const times = ["08:00:00", "10:30:00", "13:00:00", "15:30:00"];
  const activityIds = [IDS.activities.gondola, IDS.activities.trek, IDS.activities.shikara];
  const slots = [];
  let slotIdx = 0;

  for (const activityId of activityIds) {
    for (let day = 1; day <= 14; day++) {
      const d = new Date();
      d.setDate(d.getDate() + day);
      const slotDate = d.toISOString().split("T")[0];
      for (const slotTime of times) {
        slotIdx++;
        const bookedCount = slotTime === "13:00:00" && day % 3 === 0 ? 20 : Math.min(day, 7);
        const id =
          activityId === IDS.activities.gondola && day === 1 && slotTime === "08:00:00"
            ? IDS.slotGondola
            : activityId === IDS.activities.shikara && day === 1 && slotTime === "08:00:00"
              ? IDS.slotShikara
              : `00000000-0000-0000-0000-${String(100 + slotIdx).padStart(12, "0")}`;
        slots.push({
          id,
          activity_id: activityId,
          slot_date: slotDate,
          slot_time: slotTime,
          capacity: 20,
          booked_count: bookedCount,
          is_available: bookedCount < 20,
        });
      }
    }
  }
  await upsert("slots", slots);

  await upsert("bookings", [
    { id: IDS.bookings.b1, user_id: IDS.users.aarav, slot_id: IDS.slotGondola, activity_id: IDS.activities.gondola, group_size: 2, subtotal: 3600, taxes: 648, total: 4248, status: "CONFIRMED", qr_code_token: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", booked_at: "2025-03-10T10:00:00Z", confirmed_at: "2025-03-10T10:01:00Z" },
    { id: IDS.bookings.b2, user_id: IDS.users.aarav, slot_id: IDS.slotShikara, activity_id: IDS.activities.shikara, group_size: 1, subtotal: 950, taxes: 171, total: 1121, status: "PENDING", qr_code_token: "b2c3d4e5-f6a7-8901-bcde-f1234567890a", booked_at: "2025-03-11T14:30:00Z" },
  ]);

  await upsert("reviews", [
    { id: "00000000-0000-0000-0000-0000000000f1", booking_id: IDS.bookings.b1, user_id: IDS.users.aarav, activity_id: IDS.activities.gondola, rating: 4.8, comment: "Breathtaking views! Well organized." },
  ]);

  await upsert("incidents", [
    { id: "00000000-0000-0000-0000-0000000000e1", operator_id: IDS.operators.alpine, activity_id: IDS.activities.trek, reported_by: IDS.users.rajiv, title: "Trekker Injury — Sonamarg Trail 4", description: "Solo trekker sustained ankle fracture on Trail 4 near Thajiwas Glacier. Rescue team dispatched.", severity: "CRITICAL", status: "OPEN", district: "Ganderbal", occurred_at: "2025-06-11T13:58:00Z" },
    { id: "00000000-0000-0000-0000-0000000000e2", operator_id: IDS.operators.himalayan, activity_id: IDS.activities.gondola, reported_by: IDS.users.imran, title: "Equipment Failure — Gondola Phase II", description: "Mechanical fault detected in Phase II cable system during routine inspection.", severity: "HIGH", status: "UNDER_REVIEW", district: "Baramulla", occurred_at: "2025-06-10T09:30:00Z" },
    { id: "00000000-0000-0000-0000-0000000000e3", operator_id: IDS.operators.valley, reported_by: IDS.users.rajiv, title: "Overcrowding — Pahalgam Valley Point", description: "Excessive tourist density at Betaab Valley viewpoint exceeded safe capacity limits.", severity: "HIGH", status: "UNDER_REVIEW", district: "Anantnag", occurred_at: "2025-06-09T11:00:00Z" },
    { id: "00000000-0000-0000-0000-0000000000e4", operator_id: IDS.operators.shikara, activity_id: IDS.activities.shikara, reported_by: IDS.users.aarav, title: "Minor Capsize — Dal Lake Shikara", description: "Shikara tipped during sudden wind gust. All passengers rescued safely.", severity: "LOW", status: "RESOLVED", district: "Srinagar", occurred_at: "2025-06-05T16:20:00Z", resolved_at: "2025-06-06T10:00:00Z" },
  ]);

  await upsert("incident_actions", [
    { id: "00000000-0000-0000-0000-0000000000f2", incident_id: "00000000-0000-0000-0000-0000000000e1", actor_id: IDS.users.rajiv, action_type: "REPORTED", acted_at: "2025-06-11T13:58:00Z" },
    { id: "00000000-0000-0000-0000-0000000000f3", incident_id: "00000000-0000-0000-0000-0000000000e1", actor_id: IDS.users.rajiv, action_type: "REVIEWED", note: "Rescue team dispatched", acted_at: "2025-06-11T14:05:00Z" },
  ]);

  await upsert("compliance_checks", [
    { id: "00000000-0000-0000-0000-0000000000c1", operator_id: IDS.operators.himalayan, inspector_id: IDS.users.rajiv, inspection_date: "2025-03-02", score: 4.85, result: "PASS", notes: "All safety equipment verified." },
    { id: "00000000-0000-0000-0000-0000000000c2", operator_id: IDS.operators.shikara, inspector_id: IDS.users.rajiv, inspection_date: "2025-02-14", score: 4.50, result: "PASS" },
    { id: "00000000-0000-0000-0000-0000000000c3", operator_id: IDS.operators.kargil, inspector_id: IDS.users.rajiv, inspection_date: "2024-10-01", score: 2.80, result: "FAIL", notes: "Expired insurance and license." },
  ]);

  console.log("\n✅ Seed complete!");
}

main().catch((err) => {
  console.error("\n❌ Seed failed:", err.message);
  process.exit(1);
});
