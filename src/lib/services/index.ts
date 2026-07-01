/**
 * Next.js backend service layer.
 * Server Components and /api/v1 routes call these functions.
 * All data access requires Supabase to be configured.
 */

export {
  getActivities,
  getActivityById,
  getActivityWithOperator,
  getOperatorForActivity,
  getActivitiesByOperator,
  createActivity,
} from "@/lib/data/activities";

export {
  getSlotsForActivity,
  getAvailableDates,
  getSlotByActivityDateTime,
} from "@/lib/data/slots";

export {
  getOperators,
  getOperatorById,
  getOperatorByUserId,
  createOperator,
} from "@/lib/data/operators";

export {
  getBookingsForUser,
  getOperatorBookings,
  getOperatorBookingCount,
  createBooking,
} from "@/lib/data/bookings";

export type {
  BookingWithDetails,
  CreateBookingInput,
  CreateBookingResult,
} from "@/lib/data/bookings";

export { getDistricts } from "@/lib/data/districts";
export {
  getIncidents,
  getIncidentsByReporter,
  updateIncidentStatus,
  createIncident,
} from "@/lib/data/incidents";
export {
  getPublishedEvents,
  getImportantEvents,
  getGovEvents,
  createEvent,
  updateEvent,
} from "@/lib/data/events";

export { isSupabaseConfigured } from "@/lib/supabase/server";
