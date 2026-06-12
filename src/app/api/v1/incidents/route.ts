import { handleRouteError, ok } from "@/lib/api/http";
import { getIncidents } from "@/lib/services";

export async function GET() {
  try {
    const incidents = await getIncidents();
    return ok(incidents);
  } catch (err) {
    return handleRouteError(err);
  }
}
