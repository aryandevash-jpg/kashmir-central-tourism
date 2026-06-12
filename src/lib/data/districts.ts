import { districts as mockDistricts } from "@/lib/mock-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { DbDistrict } from "@/lib/supabase/database.types";
import type { District } from "@/lib/types";
import { withEmptyFallback } from "./fallback";
import { mapDistrict } from "./mappers";

export async function getDistricts(): Promise<District[]> {
  if (!isSupabaseConfigured()) return mockDistricts;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("districts")
      .select("*")
      .order("total_bookings", { ascending: false });

    if (error || !data) return mockDistricts;
    return withEmptyFallback(
      (data as DbDistrict[]).map(mapDistrict),
      mockDistricts
    );
  } catch {
    return mockDistricts;
  }
}
