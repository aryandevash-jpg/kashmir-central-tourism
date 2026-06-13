/**
 * Verifies demo auth + profile access.
 * Run: npm run db:verify-auth
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

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

const DEMO = [
  { email: "aarav@gmail.com", role: "TOURIST" },
  { email: "imran@himalayan.in", role: "OPERATOR" },
  { email: "rajiv@jktourism.gov.in", role: "GOVT_OFFICER" },
];

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !serviceKey || !publishableKey) {
  console.error("Missing Supabase env vars in .env.local");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  console.log("Auth verification\n");

  let rlsBlocked = false;

  for (const account of DEMO) {
    const { data: authUser } = await admin.auth.admin.listUsers();
    const found = authUser?.users?.find((u) => u.email === account.email);
    const { data: profile } = await admin
      .from("users")
      .select("id, role")
      .eq("email", account.email)
      .maybeSingle();

    const client = createClient(url, publishableKey);
    const { error: signInError } = await client.auth.signInWithPassword({
      email: account.email,
      password: "Demo@123",
    });

    let authedProfile = null;
    if (!signInError) {
      const { data: rows } = await client
        .from("users")
        .select("role")
        .eq("email", account.email);
      authedProfile = rows?.[0] ?? null;
      if (!authedProfile) rlsBlocked = true;
    }

    console.log(`${account.email}`);
    console.log(`  auth user: ${found ? "ok" : "MISSING"}`);
    console.log(`  public.users (admin): ${profile ? profile.role : "MISSING"}`);
    console.log(
      `  public.users (signed-in): ${authedProfile ? authedProfile.role : signInError ? signInError.message : "BLOCKED BY RLS"}`
    );
    console.log();
  }

  if (rlsBlocked) {
    console.log("RLS is blocking profile reads for signed-in users.");
    console.log("Fix: add DATABASE_URL to .env.local, then run:");
    console.log("  npm run db:apply-auth");
    console.log("Or paste supabase/auth-migration.sql then supabase/rls-policies.sql into the Supabase SQL Editor.");
    process.exit(1);
  }

  console.log("All checks passed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
