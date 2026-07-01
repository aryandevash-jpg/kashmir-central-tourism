/**
 * Applies events-only DB changes via direct Postgres.
 *
 * Safe default:
 *   - supabase/events-migration.sql
 *
 * Optional sample events:
 *   --with-seed
 *   Also applies:
 *   - supabase/events-seed.sql
 *
 * Requires DATABASE_URL in .env.local.
 *
 * Usage:
 *   npm run db:apply-events
 *   npm run db:apply-events -- --with-seed
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
const withSeed = process.argv.includes("--with-seed");

if (!databaseUrl) {
  console.error(
    "Missing DATABASE_URL in .env.local.\n" +
      "Add your Supabase Postgres connection string, then re-run:\n" +
      "  npm run db:apply-events\n\n" +
      "Or run this file manually in Supabase SQL Editor:\n" +
      "  supabase/events-migration.sql"
  );
  process.exit(1);
}

const files = withSeed
  ? ["events-migration.sql", "events-seed.sql"]
  : ["events-migration.sql"];

if (withSeed) {
  console.warn("Applying sample event rows from supabase/events-seed.sql.");
}

async function main() {
  const sql = postgres(databaseUrl, { max: 1 });
  try {
    for (const file of files) {
      const filePath = resolve(process.cwd(), "supabase", file);
      console.log(`Applying ${file}...`);
      await sql.file(filePath);
      console.log(`  ✓ ${file}`);
    }
    console.log("\nDone.");
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
