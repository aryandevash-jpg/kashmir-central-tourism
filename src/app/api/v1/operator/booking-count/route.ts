import { fail, ok } from "@/lib/api/http";
import { handleAuthError } from "@/lib/api/auth";
import { requireOperatorId } from "@/lib/auth/session";
import { getOperatorBookingCount } from "@/lib/data/bookings";

export async function GET() {
  try {
    const { operatorId } = await requireOperatorId();
    const count = await getOperatorBookingCount(operatorId);
    return ok({ count });
  } catch (err) {
    return handleAuthError(err);
  }
}
