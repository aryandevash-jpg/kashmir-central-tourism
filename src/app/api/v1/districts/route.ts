import { handleRouteError, ok } from "@/lib/api/http";
import { getDistricts } from "@/lib/services";

export async function GET() {
  try {
    const districts = await getDistricts();
    return ok(districts);
  } catch (err) {
    return handleRouteError(err);
  }
}
