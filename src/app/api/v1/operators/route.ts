import { fail, handleRouteError, ok } from "@/lib/api/http";
import { handleAuthError } from "@/lib/api/auth";
import { requireRole } from "@/lib/auth/session";
import { getOperators } from "@/lib/services";
import { createOperator } from "@/lib/data/operators";
import type { ActivityCategory } from "@/lib/types";

export async function GET() {
  try {
    await requireRole(["GOVT_OFFICER", "SUPER_ADMIN", "TOURIST", "OPERATOR"]);
    const operators = await getOperators();
    return ok(operators);
  } catch (err) {
    return handleAuthError(err);
  }
}

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
    const companyName = typeof raw.companyName === "string" ? raw.companyName.trim() : "";
    const licenseNo = typeof raw.licenseNo === "string" ? raw.licenseNo.trim() : "";
    const activityType =
      typeof raw.activityType === "string" ? (raw.activityType as ActivityCategory) : "";
    const district = typeof raw.district === "string" ? raw.district.trim() : "";
    const licenseExpiry = typeof raw.licenseExpiry === "string" ? raw.licenseExpiry : "";
    const insuranceExpiry = typeof raw.insuranceExpiry === "string" ? raw.insuranceExpiry : "";
    const experienceYears = typeof raw.experienceYears === "number" ? raw.experienceYears : 0;

    if (!name) return fail("Contact name is required", 422);
    if (!email) return fail("Email is required", 422);
    if (!companyName) return fail("Company name is required", 422);
    if (!licenseNo) return fail("License number is required", 422);
    if (!activityType) return fail("Activity type is required", 422);
    if (!district) return fail("District is required", 422);
    if (!licenseExpiry) return fail("License expiry date is required", 422);
    if (!insuranceExpiry) return fail("Insurance expiry date is required", 422);

    const operator = await createOperator({
      name,
      email,
      phone,
      companyName,
      licenseNo,
      activityType,
      district,
      licenseExpiry,
      insuranceExpiry,
      experienceYears,
    });

    return ok(operator, 201);
  } catch (err) {
    return handleAuthError(err);
  }
}
