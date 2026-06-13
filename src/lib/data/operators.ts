import { createAdminClient, createClient } from "@/lib/supabase/server";
import { requireSupabase } from "@/lib/supabase/require";
import type { DbOperator } from "@/lib/supabase/database.types";
import type { ActivityCategory, LicenseStatus, Operator } from "@/lib/types";
import { mapOperator } from "./mappers";

export interface CreateOperatorInput {
  name: string;
  email: string;
  phone?: string;
  companyName: string;
  licenseNo: string;
  activityType: ActivityCategory;
  district: string;
  licenseExpiry: string;
  insuranceExpiry: string;
  experienceYears?: number;
}

function deriveLicenseStatus(expiry: string): LicenseStatus {
  const days = (new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (days < 0) return "EXPIRED";
  if (days < 60) return "EXPIRING_SOON";
  return "VALID";
}

export async function getOperators(): Promise<Operator[]> {
  requireSupabase();
  const supabase = await createClient();
  const { data, error } = await supabase.from("operators").select("*").order("company_name");

  if (error) throw error;
  return ((data ?? []) as DbOperator[]).map(mapOperator);
}

export async function getOperatorById(id: string): Promise<Operator | undefined> {
  requireSupabase();
  const supabase = await createClient();
  const { data, error } = await supabase.from("operators").select("*").eq("id", id).single();

  if (error || !data) return undefined;
  return mapOperator(data as DbOperator);
}

export async function getOperatorByUserId(userId: string): Promise<Operator | undefined> {
  requireSupabase();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("operators")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) return undefined;
  return mapOperator(data as DbOperator);
}

/** Gov-only: creates Supabase Auth user + profile + operator record */
export async function createOperator(
  input: CreateOperatorInput
): Promise<Operator & { temporaryPassword: string }> {
  requireSupabase();
  const licenseStatus = deriveLicenseStatus(input.licenseExpiry);
  const experienceYears = input.experienceYears ?? 0;
  const admin = await createAdminClient();

  const temporaryPassword = `Kct${crypto.randomUUID().slice(0, 8)}!`;

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: input.email,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: { name: input.name, role: "OPERATOR" },
    app_metadata: { provisioned: true },
  });

  if (authError || !authData.user) {
    throw new Error(authError?.message || "Failed to create auth account for operator");
  }

  const userId = authData.user.id;

  const { error: userError } = await admin.from("users").upsert({
    id: userId,
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    role: "OPERATOR",
    password_hash: "supabase_auth",
  });

  if (userError) {
    await admin.auth.admin.deleteUser(userId);
    throw new Error(userError.message);
  }

  const { data: operatorData, error: operatorError } = await admin
    .from("operators")
    .insert({
      user_id: userId,
      company_name: input.companyName,
      license_no: input.licenseNo,
      activity_type: input.activityType,
      district: input.district,
      license_status: licenseStatus,
      license_expiry: input.licenseExpiry,
      insurance_expiry: input.insuranceExpiry,
      safety_rating: 0,
      compliance_status: "COMPLIANT",
      experience_years: experienceYears,
      is_verified: false,
    })
    .select()
    .single();

  if (operatorError || !operatorData) {
    throw new Error(operatorError?.message || "Failed to register operator");
  }

  return { ...mapOperator(operatorData as DbOperator), temporaryPassword };
}
