/**
 * Creates Supabase Auth users for demo accounts.
 * Run once after seed.sql: npm run db:seed-auth
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 * Demo password for all accounts: Demo@123
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

const DEMO_PASSWORD = "Demo@123";

const DEMO_USERS = [
  {
    id: "00000000-0000-0000-0000-000000000004",
    email: "aarav@gmail.com",
    name: "Aarav Reddy",
    role: "TOURIST",
  },
  {
    id: "00000000-0000-0000-0000-000000000010",
    email: "imran@himalayan.in",
    name: "Imran Khan",
    role: "OPERATOR",
  },
  {
    id: "00000000-0000-0000-0000-000000000001",
    email: "rajiv@jktourism.gov.in",
    name: "Sh. Rajiv Mehta, IAS",
    role: "GOVT_OFFICER",
  },
];

function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), ".env.local");
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq);
      const value = trimmed.slice(eq + 1);
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local optional if vars already exported
  }
}

async function main() {
  loadEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  for (const user of DEMO_USERS) {
    const { data: existing } = await supabase.auth.admin.getUserById(user.id);

    if (existing?.user) {
      const { error } = await supabase.auth.admin.updateUserById(user.id, {
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: { name: user.name, role: user.role },
      });
      if (error) {
        console.error(`Failed to update ${user.email}:`, error.message);
      } else {
        console.log(`Updated auth user: ${user.email}`);
      }
    } else {

      const { data, error } = await supabase.auth.admin.createUser({
        id: user.id,
        email: user.email,
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: { name: user.name, role: user.role },
      });

      if (error) {
        console.error(`Failed to create ${user.email}:`, error.message);
      } else {
        console.log(`Created auth user: ${user.email} (${data.user.id})`);
      }
    }

    const { error: profileError } = await supabase.from("users").upsert(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        password_hash: "$2b$10$placeholder_hash_seed",
      },
      { onConflict: "id" }
    );

    if (profileError) {
      console.error(`Failed to upsert profile ${user.email}:`, profileError.message);
    }
  }

  console.log("\nDone. Demo password:", DEMO_PASSWORD);
}

main();
