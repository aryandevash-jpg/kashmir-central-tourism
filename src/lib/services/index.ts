/**
 * Next.js backend service layer.
 * Server Components and /api/v1 routes both call these functions.
 * Connects to Supabase when env vars are set; falls back to local data otherwise.
 */

export {
  getActivities,
  getActivityById,
  getOperatorForActivity,
  getActivitiesByOperator,
} from "@/lib/data/activities";

export {
  getSlotsForActivity,
  getAvailableDates,
  getSlotByActivityDateTime,
} from "@/lib/data/slots";

export { getOperators, getOperatorById } from "@/lib/data/operators";

export {
  getBookingsForUser,
  getOperatorBookings,
  createBooking,
  DEMO_TOURIST_ID,
  DEMO_OPERATOR_ID,
} from "@/lib/data/bookings";

export type {
  BookingWithDetails,
  CreateBookingInput,
  CreateBookingResult,
} from "@/lib/data/bookings";

export { getDistricts } from "@/lib/data/districts";
export { getIncidents } from "@/lib/data/incidents";

export { isSupabaseConfigured } from "@/lib/supabase/server";
