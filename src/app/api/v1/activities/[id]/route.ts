import { fail, handleRouteError, ok } from "@/lib/api/http";
import { getActivityById, getOperatorForActivity } from "@/lib/services";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [activity, operator] = await Promise.all([
      getActivityById(id),
      getOperatorForActivity(id),
    ]);

    if (!activity) return fail("Activity not found", 404);
    return ok({ activity, operator });
  } catch (err) {
    return handleRouteError(err);
  }
}
