import { createAdminClient } from "@/lib/supabase/server";
import { requireSupabase } from "@/lib/supabase/require";

export interface CreateGovOfficerInput {
  name: string;
  email: string;
  phone?: string;
}

export interface CreateGovOfficerResult {
  id: string;
  name: string;
  email: string;
  temporaryPassword: string;
}

/** Gov-only: creates Supabase Auth user + GOVT_OFFICER profile */
export async function createGovOfficer(
  input: CreateGovOfficerInput
): Promise<CreateGovOfficerResult> {
  requireSupabase();
  const admin = await createAdminClient();
  const temporaryPassword = `Kct${crypto.randomUUID().slice(0, 8)}!`;

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email: input.email,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: { name: input.name, role: "GOVT_OFFICER" },
    app_metadata: { provisioned: true },
  });

  if (authError || !authData.user) {
    throw new Error(authError?.message || "Failed to create auth account for officer");
  }

  const userId = authData.user.id;

  const { error: userError } = await admin.from("users").upsert({
    id: userId,
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    role: "GOVT_OFFICER",
    password_hash: "supabase_auth",
  });

  if (userError) {
    await admin.auth.admin.deleteUser(userId);
    throw new Error(userError.message);
  }

  return {
    id: userId,
    name: input.name,
    email: input.email,
    temporaryPassword,
  };
}
