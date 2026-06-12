import { isSupabaseConfigured } from "@/lib/services";
import { ok } from "@/lib/api/http";

export async function GET() {
  return ok({
    status: "ok",
    service: "kashmir-central-tourism",
    storage: isSupabaseConfigured() ? "supabase" : "mock",
  });
}
