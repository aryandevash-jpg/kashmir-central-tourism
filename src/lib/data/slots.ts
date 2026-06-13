import { createClient } from "@/lib/supabase/server";
import { requireSupabase } from "@/lib/supabase/require";
import type { DbSlot } from "@/lib/supabase/database.types";
import type { Slot } from "@/lib/types";
import { addDaysLocal, localDateString } from "@/lib/utils";
import { mapSlot } from "./mappers";

const DEFAULT_SLOT_TIMES = ["08:00", "10:30", "13:00", "15:30"];

export async function generateDefaultSlotsForActivity(activityId: string): Promise<void> {
  requireSupabase();
  const supabase = await createClient();
  const slots = [];

  for (let day = 1; day <= 30; day++) {
    const dateStr = addDaysLocal(day);
    for (const time of DEFAULT_SLOT_TIMES) {
      slots.push({
        activity_id: activityId,
        slot_date: dateStr,
        slot_time: time,
        capacity: 20,
        booked_count: 0,
        is_available: true,
      });
    }
  }

  const { error } = await supabase.from("slots").insert(slots);
  if (error) throw new Error(error.message);
}

async function ensureFutureSlots(activityId: string): Promise<void> {
  requireSupabase();
  const supabase = await createClient();
  const today = localDateString();
  const { count, error } = await supabase
    .from("slots")
    .select("*", { count: "exact", head: true })
    .eq("activity_id", activityId)
    .gte("slot_date", today)
    .eq("is_available", true);

  if (error) return;
  if ((count ?? 0) > 0) return;

  await generateDefaultSlotsForActivity(activityId);
}

export async function getSlotsForActivity(activityId: string, date?: string): Promise<Slot[]> {
  requireSupabase();
  const supabase = await createClient();
  const today = localDateString();
  let query = supabase
    .from("slots")
    .select("*")
    .eq("activity_id", activityId)
    .gte("slot_date", today)
    .order("slot_date")
    .order("slot_time");

  if (date) query = query.eq("slot_date", date);

  let { data, error } = await query;
  if (error) throw error;

  if (!date && (!data || data.length === 0)) {
    await ensureFutureSlots(activityId);
    ({ data, error } = await query);
    if (error) throw error;
  }

  return ((data ?? []) as DbSlot[]).map(mapSlot);
}

export async function getAvailableDates(activityId: string): Promise<string[]> {
  const slots = await getSlotsForActivity(activityId);
  const available = slots.filter((s) => s.isAvailable && s.bookedCount < s.capacity);
  return [...new Set(available.map((s) => s.slotDate))].sort();
}

export async function getSlotByActivityDateTime(
  activityId: string,
  date: string,
  time: string
): Promise<Slot | undefined> {
  requireSupabase();
  const supabase = await createClient();
  const timeVariants = time.length === 5 ? [time, `${time}:00`] : [time, time.slice(0, 5)];

  const { data, error } = await supabase
    .from("slots")
    .select("*")
    .eq("activity_id", activityId)
    .eq("slot_date", date)
    .in("slot_time", timeVariants);

  if (error) throw error;
  if (!data?.length) return undefined;

  const row =
    (data as DbSlot[]).find((s) => {
      const normalized = s.slot_time.length > 5 ? s.slot_time.slice(0, 5) : s.slot_time;
      return normalized === time || s.slot_time === time;
    }) ?? (data[0] as DbSlot);

  return mapSlot(row);
}
