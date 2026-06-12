import {
  getAvailableDates as mockGetAvailableDates,
  getSlotsForActivity as mockGetSlotsForActivity,
  slots as mockSlots,
} from "@/lib/mock-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { DbSlot } from "@/lib/supabase/database.types";
import type { Slot } from "@/lib/types";
import { withEmptyFallback } from "./fallback";
import { mapSlot } from "./mappers";

export async function getSlotsForActivity(
  activityId: string,
  date?: string
): Promise<Slot[]> {
  if (!isSupabaseConfigured()) return mockGetSlotsForActivity(activityId, date);

  try {
    const supabase = await createClient();
    let query = supabase
      .from("slots")
      .select("*")
      .eq("activity_id", activityId)
      .gte("slot_date", new Date().toISOString().split("T")[0])
      .order("slot_date")
      .order("slot_time");

    if (date) query = query.eq("slot_date", date);

    const { data, error } = await query;
    if (error || !data) return mockGetSlotsForActivity(activityId, date);
    const mapped = (data as DbSlot[]).map(mapSlot);
    return withEmptyFallback(mapped, mockGetSlotsForActivity(activityId, date));
  } catch {
    return mockGetSlotsForActivity(activityId, date);
  }
}

export async function getAvailableDates(activityId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) return mockGetAvailableDates(activityId);

  try {
    const slots = await getSlotsForActivity(activityId);
    const available = slots.filter((s) => s.isAvailable);
    return [...new Set(available.map((s) => s.slotDate))].sort();
  } catch {
    return mockGetAvailableDates(activityId);
  }
}

export async function getSlotByActivityDateTime(
  activityId: string,
  date: string,
  time: string
): Promise<Slot | undefined> {
  const slots = await getSlotsForActivity(activityId, date);
  return slots.find((s) => s.slotTime === time || s.slotTime.startsWith(time));
}
