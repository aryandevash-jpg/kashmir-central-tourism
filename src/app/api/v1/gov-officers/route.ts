import { fail, handleRouteError, ok } from "@/lib/api/http";
import { handleAuthError } from "@/lib/api/auth";
import { requireRole } from "@/lib/auth/session";
import { createGovOfficer } from "@/lib/data/gov-officers";

export async function POST(request: Request) {
  try {
    await requireRole(["GOVT_OFFICER", "SUPER_ADMIN"]);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return fail("Invalid JSON body");
    }

    const raw = body as Record<string, unknown>;
    const name = typeof raw.name === "string" ? raw.name.trim() : "";
    const email = typeof raw.email === "string" ? raw.email.trim() : "";
    const phone = typeof raw.phone === "string" ? raw.phone.trim() : undefined;

    if (!name) return fail("Officer name is required", 422);
    if (!email) return fail("Email is required", 422);

    const officer = await createGovOfficer({ name, email, phone });
    return ok(officer, 201);
  } catch (err) {
    return handleAuthError(err);
  }
}
