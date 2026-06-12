import { fail, handleRouteError, ok } from "@/lib/api/http";
import { getActivityById, getAvailableDates, getSlotsForActivity } from "@/lib/services";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const activity = await getActivityById(id);
    if (!activity) return fail("Activity not found", 404);

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") ?? undefined;

    const [slots, availableDates] = await Promise.all([
      getSlotsForActivity(id, date),
      date ? Promise.resolve([]) : getAvailableDates(id),
    ]);

    return ok({ slots, availableDates });
  } catch (err) {
    return handleRouteError(err);
  }
}
