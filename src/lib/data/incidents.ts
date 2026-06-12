import { incidents as mockIncidents } from "@/lib/mock-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { DbIncident } from "@/lib/supabase/database.types";
import type { Incident } from "@/lib/types";
import { withEmptyFallback } from "./fallback";
import { mapIncident } from "./mappers";

export async function getIncidents(): Promise<Incident[]> {
  if (!isSupabaseConfigured()) return mockIncidents;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .order("occurred_at", { ascending: false });

    if (error || !data) return mockIncidents;
    return withEmptyFallback(
      (data as DbIncident[]).map(mapIncident),
      mockIncidents
    );
  } catch {
    return mockIncidents;
  }
}
