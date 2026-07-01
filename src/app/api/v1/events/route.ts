import { fail, handleRouteError, ok } from "@/lib/api/http";
import { handleAuthError } from "@/lib/api/auth";
import { requireRole } from "@/lib/auth/session";
import { createEvent, getGovEvents, getPublishedEvents, updateEvent } from "@/lib/services";
import type { EventCategory, EventPriority } from "@/lib/types";

const categories: EventCategory[] = ["GENERAL", "SAFETY", "WEATHER", "TRAFFIC", "CULTURE"];
const priorities: EventPriority[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeUnpublished = searchParams.get("includeUnpublished") === "true";

  if (includeUnpublished) {
    try {
      await requireRole(["GOVT_OFFICER", "SUPER_ADMIN"]);
      const events = await getGovEvents();
      return ok(events);
    } catch (err) {
      return handleAuthError(err);
    }
  }

  try {
    const events = await getPublishedEvents();
    return ok(events);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(request: Request) {
  try {
    const profile = await requireRole(["GOVT_OFFICER", "SUPER_ADMIN"]);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return fail("Invalid JSON body");
    }

    const raw = body as Record<string, unknown>;
    const title = typeof raw.title === "string" ? raw.title.trim() : "";
    const message = typeof raw.message === "string" ? raw.message.trim() : "";
    const district = typeof raw.district === "string" ? raw.district.trim() : undefined;
    const category = typeof raw.category === "string" ? (raw.category as EventCategory) : undefined;
    const priority = typeof raw.priority === "string" ? (raw.priority as EventPriority) : undefined;
    const startsAt = typeof raw.startsAt === "string" ? raw.startsAt : undefined;
    const endsAt = typeof raw.endsAt === "string" ? raw.endsAt : undefined;
    const isPublished = typeof raw.isPublished === "boolean" ? raw.isPublished : true;
    const isImportant = typeof raw.isImportant === "boolean" ? raw.isImportant : true;
    const sourceLabel = typeof raw.sourceLabel === "string" ? raw.sourceLabel.trim() : undefined;

    if (!title) return fail("Title is required", 422);
    if (!message) return fail("Message is required", 422);
    if (!category || !categories.includes(category)) return fail("Valid category is required", 422);
    if (!priority || !priorities.includes(priority)) return fail("Valid priority is required", 422);

    const event = await createEvent({
      title,
      message,
      district,
      category,
      priority,
      startsAt,
      endsAt,
      isPublished,
      isImportant,
      sourceLabel,
      createdBy: profile.id,
    });
    return ok(event, 201);
  } catch (err) {
    return handleAuthError(err);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireRole(["GOVT_OFFICER", "SUPER_ADMIN"]);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return fail("Invalid JSON body");
    }

    const raw = body as Record<string, unknown>;
    const eventId = typeof raw.eventId === "string" ? raw.eventId : "";
    const patch = (raw.patch ?? {}) as Record<string, unknown>;

    if (!eventId) return fail("Event ID is required", 422);

    const category = typeof patch.category === "string" ? (patch.category as EventCategory) : undefined;
    const priority = typeof patch.priority === "string" ? (patch.priority as EventPriority) : undefined;
    if (category && !categories.includes(category)) return fail("Invalid category", 422);
    if (priority && !priorities.includes(priority)) return fail("Invalid priority", 422);

    const event = await updateEvent(eventId, {
      title: typeof patch.title === "string" ? patch.title.trim() : undefined,
      message: typeof patch.message === "string" ? patch.message.trim() : undefined,
      district: typeof patch.district === "string" ? patch.district.trim() : undefined,
      category,
      priority,
      startsAt: typeof patch.startsAt === "string" ? patch.startsAt : undefined,
      endsAt: typeof patch.endsAt === "string" ? patch.endsAt : undefined,
      isPublished: typeof patch.isPublished === "boolean" ? patch.isPublished : undefined,
      isImportant: typeof patch.isImportant === "boolean" ? patch.isImportant : undefined,
      sourceLabel: typeof patch.sourceLabel === "string" ? patch.sourceLabel.trim() : undefined,
    });

    return ok(event);
  } catch (err) {
    return handleAuthError(err);
  }
}
