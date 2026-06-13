import { fail, handleRouteError, ok } from "@/lib/api/http";
import { handleAuthError } from "@/lib/api/auth";
import { requireOperatorId } from "@/lib/auth/session";
import { getActivities, getActivitiesByOperator } from "@/lib/services";
import { createActivity } from "@/lib/data/activities";
import type { ActivityCategory, DifficultyLevel } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as ActivityCategory | null;
  const operatorId = searchParams.get("operatorId");

  if (operatorId) {
    try {
      const { operatorId: sessionOperatorId } = await requireOperatorId();
      if (operatorId !== sessionOperatorId) {
        return fail("Forbidden", 403);
      }
      const activities = await getActivitiesByOperator(operatorId);
      return ok(activities);
    } catch (err) {
      return handleAuthError(err);
    }
  }

  try {
    const activities = await getActivities(category ?? undefined);
    return ok(activities);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(request: Request) {
  try {
    const { operatorId } = await requireOperatorId();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return fail("Invalid JSON body");
    }

    const raw = body as Record<string, unknown>;

    const title = typeof raw.title === "string" ? raw.title.trim() : "";
    const description = typeof raw.description === "string" ? raw.description.trim() : "";
    const district = typeof raw.district === "string" ? raw.district.trim() : "";
    const locationName = typeof raw.locationName === "string" ? raw.locationName.trim() : "";
    const category = typeof raw.category === "string" ? (raw.category as ActivityCategory) : null;
    const difficulty =
      typeof raw.difficulty === "string" ? (raw.difficulty as DifficultyLevel) : "MODERATE";
    const durationMinutes = typeof raw.durationMinutes === "number" ? raw.durationMinutes : 120;
    const basePrice = typeof raw.basePrice === "number" ? raw.basePrice : 1000;
    const coverImageUrl =
      typeof raw.coverImageUrl === "string"
        ? raw.coverImageUrl
        : "/activities/default.jpg";
    const includes = Array.isArray(raw.includes)
      ? raw.includes.filter((i): i is string => typeof i === "string")
      : [];
    const elevation = typeof raw.elevation === "string" ? raw.elevation : undefined;

    if (!title) return fail("Title is required", 422);
    if (!description) return fail("Description is required", 422);
    if (!district) return fail("District is required", 422);
    if (!locationName) return fail("Location name is required", 422);
    if (!category) return fail("Category is required", 422);
    if (durationMinutes < 30) return fail("Duration must be at least 30 minutes", 422);
    if (basePrice < 100) return fail("Price must be at least ₹100", 422);

    const activity = await createActivity({
      operatorId,
      title,
      description,
      district,
      locationName,
      category,
      difficulty,
      durationMinutes,
      basePrice,
      coverImageUrl,
      includes,
      elevation,
    });

    return ok(activity, 201);
  } catch (err) {
    return handleAuthError(err);
  }
}
