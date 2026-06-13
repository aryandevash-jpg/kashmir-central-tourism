import { fail, handleRouteError, ok } from "@/lib/api/http";
import { handleAuthError } from "@/lib/api/auth";
import { requireAuth, requireRole } from "@/lib/auth/session";
import { getIncidents, getIncidentsByReporter, updateIncidentStatus } from "@/lib/services";
import { createIncident } from "@/lib/data/incidents";
import type { IncidentSeverity } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const profile = await requireAuth();
    const { searchParams } = new URL(request.url);
    const mine = searchParams.get("mine") === "true";

    if (mine) {
      const incidents = await getIncidentsByReporter(profile.id);
      return ok(incidents);
    }

    await requireRole(["GOVT_OFFICER", "SUPER_ADMIN"]);
    const incidents = await getIncidents();
    return ok(incidents);
  } catch (err) {
    return handleAuthError(err);
  }
}

export async function PATCH(request: Request) {
  try {
    const profile = await requireRole(["GOVT_OFFICER", "SUPER_ADMIN"]);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return fail("Invalid JSON body");
    }

    const raw = body as Record<string, unknown>;
    const incidentId = typeof raw.incidentId === "string" ? raw.incidentId : "";
    const action = typeof raw.action === "string" ? raw.action : "";
    const note = typeof raw.note === "string" ? raw.note : undefined;

    if (!incidentId) return fail("Incident ID is required", 422);
    if (!["escalate", "resolve"].includes(action)) return fail("Invalid action", 422);

    const result = await updateIncidentStatus(
      incidentId,
      action as "escalate" | "resolve",
      profile.id,
      note
    );
    return ok(result);
  } catch (err) {
    return handleAuthError(err);
  }
}

export async function POST(request: Request) {
  try {
    const profile = await requireRole(["TOURIST"]);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return fail("Invalid JSON body");
    }

    const raw = body as Record<string, unknown>;
    const operatorId = typeof raw.operatorId === "string" ? raw.operatorId.trim() : "";
    const activityId = typeof raw.activityId === "string" ? raw.activityId.trim() : undefined;
    const title = typeof raw.title === "string" ? raw.title.trim() : "";
    const description = typeof raw.description === "string" ? raw.description.trim() : "";
    const severity = typeof raw.severity === "string" ? (raw.severity as IncidentSeverity) : "";
    const district = typeof raw.district === "string" ? raw.district.trim() : "";
    const occurredAt = typeof raw.occurredAt === "string" ? raw.occurredAt : undefined;

    if (!operatorId) return fail("Operator is required", 422);
    if (!title) return fail("Title is required", 422);
    if (!description) return fail("Description is required", 422);
    if (!["LOW", "HIGH", "CRITICAL"].includes(severity)) return fail("Invalid severity", 422);
    if (!district) return fail("District is required", 422);

    const incident = await createIncident({
      operatorId,
      activityId: activityId || undefined,
      reportedBy: profile.id,
      title,
      description,
      severity: severity as IncidentSeverity,
      district,
      occurredAt,
    });

    return ok(incident, 201);
  } catch (err) {
    return handleAuthError(err);
  }
}
