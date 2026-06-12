import { handleRouteError, ok } from "@/lib/api/http";
import { getOperators } from "@/lib/services";

export async function GET() {
  try {
    const operators = await getOperators();
    return ok(operators);
  } catch (err) {
    return handleRouteError(err);
  }
}
