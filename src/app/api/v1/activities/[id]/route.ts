import { fail, handleRouteError, ok } from "@/lib/api/http";
import { getActivityWithOperator } from "@/lib/services";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await getActivityWithOperator(id);

    if (!result) return fail("Activity not found", 404);
    return ok({ activity: result.activity, operator: result.operator });
  } catch (err) {
    return handleRouteError(err);
  }
}
