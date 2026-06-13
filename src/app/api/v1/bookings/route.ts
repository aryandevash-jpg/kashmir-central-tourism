import { fail, handleRouteError, ok } from "@/lib/api/http";
import { handleAuthError } from "@/lib/api/auth";
import { requireAuth } from "@/lib/auth/session";
import {
  createBooking,
  getActivityById,
  getBookingsForUser,
  getSlotByActivityDateTime,
} from "@/lib/services";
import { validateBookingInput } from "@/lib/validation/booking";

export async function GET() {
  try {
    const profile = await requireAuth();
    const bookings = await getBookingsForUser(profile.id);
    return ok(bookings);
  } catch (err) {
    return handleAuthError(err);
  }
}

export async function POST(request: Request) {
  try {
    const profile = await requireAuth();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return fail("Invalid JSON body");
    }

    const raw = body as Record<string, unknown>;
    const activityId = typeof raw.activityId === "string" ? raw.activityId : "";
    const slotDate = typeof raw.slotDate === "string" ? raw.slotDate : "";
    const slotTime = typeof raw.slotTime === "string" ? raw.slotTime : "";
    const groupSize =
      typeof raw.groupSize === "number" || typeof raw.groupSize === "string"
        ? raw.groupSize
        : NaN;

    const validation = validateBookingInput({
      activityId,
      slotDate,
      slotTime,
      groupSize: groupSize as number,
    });

    const parsedSize =
      typeof groupSize === "string" ? parseInt(groupSize, 10) : (groupSize as number);

    if (!validation.valid) {
      const message = Object.values(validation.errors).join(" ");
      return fail(message, 422);
    }

    const activity = await getActivityById(activityId);
    if (!activity) return fail("Activity not found", 404);

    if (!activity.isActive) {
      return fail("This activity is not available for booking", 403);
    }

    const slot = await getSlotByActivityDateTime(activityId, slotDate, slotTime);
    if (!slot) return fail("Slot not found for selected date and time", 404);
    if (!slot.isAvailable || slot.bookedCount >= slot.capacity) {
      return fail("Slot unavailable", 409);
    }

    if (slot.bookedCount + parsedSize > slot.capacity) {
      return fail(`Only ${slot.capacity - slot.bookedCount} spots left in this slot`, 409);
    }

    const result = await createBooking({
      userId: profile.id,
      activityId,
      slotId: slot.id,
      groupSize: parsedSize,
      basePrice: activity.basePrice,
    });

    return ok(result, 201);
  } catch (err) {
    return handleAuthError(err);
  }
}
