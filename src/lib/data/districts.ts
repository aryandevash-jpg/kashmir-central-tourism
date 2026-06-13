import { createClient } from "@/lib/supabase/server";
import { requireSupabase } from "@/lib/supabase/require";
import type { DbDistrict } from "@/lib/supabase/database.types";
import type { District } from "@/lib/types";
import { mapDistrict } from "./mappers";

export async function getDistricts(): Promise<District[]> {
  requireSupabase();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("districts")
    .select("*")
    .order("total_bookings", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as DbDistrict[]).map(mapDistrict);
}
