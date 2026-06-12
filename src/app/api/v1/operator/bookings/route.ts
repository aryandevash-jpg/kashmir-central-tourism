import { handleRouteError, ok } from "@/lib/api/http";
import { DEMO_OPERATOR_ID, getOperatorBookings } from "@/lib/services";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const operatorId = searchParams.get("operatorId") ?? DEMO_OPERATOR_ID;
    const bookings = await getOperatorBookings(operatorId);
    return ok(bookings);
  } catch (err) {
    return handleRouteError(err);
  }
}
