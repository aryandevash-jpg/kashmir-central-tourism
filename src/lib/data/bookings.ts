import { bookings as mockBookings, operatorBookings as mockOperatorBookings } from "@/lib/mock-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { DbBooking, DbSlot } from "@/lib/supabase/database.types";
import type { Booking, BookingStatus } from "@/lib/types";
import { calcBookingTotals } from "@/lib/utils";
import { withEmptyFallback } from "./fallback";
import { mapBooking } from "./mappers";

/** Demo tourist from seed data — replace with auth session later */
export const DEMO_TOURIST_ID = "00000000-0000-0000-0000-000000000004";
export const DEMO_OPERATOR_ID = "00000000-0000-0000-0000-000000000010";

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
  if (!isSupabaseConfigured()) {
    return mockBookings.filter((b) => b.userId === userId);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", userId)
      .order("booked_at", { ascending: false });

    if (error || !data) return mockBookings.filter((b) => b.userId === userId);
    const mapped = (data as DbBooking[]).map(mapBooking);
    return withEmptyFallback(
      mapped,
      mockBookings.filter((b) => b.userId === userId)
    );
  } catch {
    return mockBookings.filter((b) => b.userId === userId);
  }
}

export async function getOperatorBookings(
  operatorId: string
): Promise<BookingWithDetails[]> {
  if (!isSupabaseConfigured()) return mockOperatorBookings;

  try {
    const supabase = await createClient();
    const { data: activities } = await supabase
      .from("activities")
      .select("id, title")
      .eq("operator_id", operatorId);

    if (!activities?.length) return mockOperatorBookings;

    const activityRows = activities as { id: string; title: string }[];
    const activityIds = activityRows.map((a) => a.id);
    const titleMap = new Map(activityRows.map((a) => [a.id, a.title]));

    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*")
      .in("activity_id", activityIds)
      .order("booked_at", { ascending: false })
      .limit(20);

    if (error || !bookings?.length) return mockOperatorBookings;

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
  } catch {
    return mockOperatorBookings;
  }
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

export async function createBooking(
  input: CreateBookingInput
): Promise<CreateBookingResult> {
  const { subtotal, taxes, total } = calcBookingTotals(
    input.basePrice,
    input.groupSize
  );

  if (!isSupabaseConfigured()) {
    return {
      bookingId: crypto.randomUUID(),
      qrCodeToken: crypto.randomUUID(),
      total,
    };
  }

  const supabase = await createClient();

  const { data: slot, error: slotError } = await supabase
    .from("slots")
    .select("*")
    .eq("id", input.slotId)
    .single();

  const dbSlot = slot as DbSlot;
  if (slotError || !dbSlot) {
    return {
      bookingId: crypto.randomUUID(),
      qrCodeToken: crypto.randomUUID(),
      total,
    };
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

  if (bookingError || !booking) throw new Error(bookingError?.message ?? "Booking failed");

  const newBooked = dbSlot.booked_count + input.groupSize;
  await supabase
    .from("slots")
    .update({
      booked_count: newBooked,
      is_available: newBooked < dbSlot.capacity,
    })
    .eq("id", input.slotId);

  const created = booking as { id: string; qr_code_token: string; total: number };
  return {
    bookingId: created.id,
    qrCodeToken: created.qr_code_token,
    total: Number(created.total),
  };
}
