/**
 * Applies auth-migration.sql + rls-policies.sql via direct Postgres.
 * Requires DATABASE_URL in .env.local (Supabase → Project Settings → Database).
 *
 * Run: npm run db:apply-auth
 */
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

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error(
    "Missing DATABASE_URL in .env.local.\n" +
      "Add your Supabase Postgres connection string, then re-run:\n" +
      "  npm run db:apply-auth\n\n" +
      "Or run these files manually in the Supabase SQL Editor:\n" +
      "  1. supabase/auth-migration.sql\n" +
      "  2. supabase/rls-policies.sql"
  );
  process.exit(1);
}

const files = ["auth-migration.sql", "rls-policies.sql"];

async function main() {
  const sql = postgres(databaseUrl, { max: 1 });
  try {
    for (const file of files) {
      const filePath = resolve(process.cwd(), "supabase", file);
      console.log(`Applying ${file}…`);
      await sql.file(filePath);
      console.log(`  ✓ ${file}`);
    }
    console.log("\nDone. Run npm run db:verify-auth to confirm.");
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
