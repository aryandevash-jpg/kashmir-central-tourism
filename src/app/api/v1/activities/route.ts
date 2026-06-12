import { handleRouteError, ok } from "@/lib/api/http";
import { getActivities } from "@/lib/services";
import type { ActivityCategory } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as ActivityCategory | null;
    const operatorId = searchParams.get("operatorId");

    if (operatorId) {
      const { getActivitiesByOperator } = await import("@/lib/services");
      const activities = await getActivitiesByOperator(operatorId);
      return ok(activities);
    }

    const activities = await getActivities(category ?? undefined);
    return ok(activities);
  } catch (err) {
    return handleRouteError(err);
  }
}
