import { handleRouteError, ok } from "@/lib/api/http";
import { handleAuthError } from "@/lib/api/auth";
import { requireOperatorId } from "@/lib/auth/session";
import { getOperatorBookings } from "@/lib/services";

export async function GET() {
  try {
    const { operatorId } = await requireOperatorId();
    const bookings = await getOperatorBookings(operatorId);
    return ok(bookings);
  } catch (err) {
    return handleAuthError(err);
  }
}
