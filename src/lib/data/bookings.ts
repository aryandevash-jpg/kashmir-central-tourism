import { createClient } from "@/lib/supabase/server";
import { requireSupabase } from "@/lib/supabase/require";
import type { DbBooking, DbSlot } from "@/lib/supabase/database.types";
import type { Booking, BookingStatus } from "@/lib/types";
import { calcBookingTotals } from "@/lib/utils";
import { mapBooking } from "./mappers";

export interface BookingWithDetails {
  id: string;
  traveller: string;
  guests: number;
  activity: string;
  date: string;
  amount: number;
  status: BookingStatus;
}

export async function getBookingsForUser(userId: string): Promise<Booking[]> {
  requireSupabase();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", userId)
    .order("booked_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as DbBooking[]).map(mapBooking);
}

export async function getOperatorBookings(operatorId: string): Promise<BookingWithDetails[]> {
  requireSupabase();
  const supabase = await createClient();

  const { data: activities, error: actError } = await supabase
    .from("activities")
    .select("id, title")
    .eq("operator_id", operatorId);

  if (actError) throw actError;
  if (!activities?.length) return [];

  const activityRows = activities as { id: string; title: string }[];
  const activityIds = activityRows.map((a) => a.id);
  const titleMap = new Map(activityRows.map((a) => [a.id, a.title]));

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("*")
    .in("activity_id", activityIds)
    .order("booked_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  if (!bookings?.length) return [];

  const bookingRows = bookings as DbBooking[];
  const userIds = [...new Set(bookingRows.map((b) => b.user_id))];
  const slotIds = [...new Set(bookingRows.map((b) => b.slot_id))];

  const [{ data: users }, { data: slots }] = await Promise.all([
    supabase.from("users").select("id, name").in("id", userIds),
    supabase.from("slots").select("id, slot_date").in("id", slotIds),
  ]);

  const userMap = new Map(
    (users as { id: string; name: string }[] | null)?.map((u) => [u.id, u.name]) ?? []
  );
  const slotMap = new Map(
    (slots as { id: string; slot_date: string }[] | null)?.map((s) => [s.id, s.slot_date]) ?? []
  );

  return bookingRows.map((b) => ({
    id: b.id,
    traveller: userMap.get(b.user_id) ?? "Guest",
    guests: b.group_size,
    activity: titleMap.get(b.activity_id) ?? "Activity",
    date: slotMap.get(b.slot_id) ?? b.booked_at.split("T")[0],
    amount: Number(b.total),
    status: b.status as BookingStatus,
  }));
}

export interface CreateBookingInput {
  userId: string;
  activityId: string;
  slotId: string;
  groupSize: number;
  basePrice: number;
}

export interface CreateBookingResult {
  bookingId: string;
  qrCodeToken: string;
  total: number;
}

export async function createBooking(input: CreateBookingInput): Promise<CreateBookingResult> {
  requireSupabase();
  const { subtotal, taxes, total } = calcBookingTotals(input.basePrice, input.groupSize);
  const supabase = await createClient();

  const { data: slot, error: slotError } = await supabase
    .from("slots")
    .select("*")
    .eq("id", input.slotId)
    .single();

  const dbSlot = slot as DbSlot | null;
  if (slotError || !dbSlot) {
    throw new Error(slotError?.message ?? "Slot not found");
  }
  if (dbSlot.booked_count + input.groupSize > dbSlot.capacity) {
    throw new Error("Slot is full");
  }

  const { data: booking, error: bookingError } = await supabase
    .from("bookings")
    .insert({
      user_id: input.userId,
      slot_id: input.slotId,
      activity_id: input.activityId,
      group_size: input.groupSize,
      subtotal,
      taxes,
      total,
      status: "CONFIRMED",
      confirmed_at: new Date().toISOString(),
    })
    .select("id, qr_code_token, total")
    .single();

  if (bookingError || !booking) {
    throw new Error(bookingError?.message ?? "Booking failed");
  }

  const created = booking as { id: string; qr_code_token: string; total: number };
  return {
    bookingId: created.id,
    qrCodeToken: created.qr_code_token,
    total: Number(created.total),
  };
}
