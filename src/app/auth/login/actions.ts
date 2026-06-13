"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveUserRole } from "@/lib/auth/resolve-role";
import { portalPathForRole } from "@/lib/auth/roles";

export type LoginState = { error?: string } | null;

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "").trim();

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { error: error?.message ?? "Sign in failed" };
  }

  const role = await resolveUserRole(supabase, data.user);
  if (!role) {
    return {
      error:
        "Account profile not found. Run seed.sql, npm run db:seed-auth, then npm run db:apply-auth (or apply auth-migration.sql + rls-policies.sql in Supabase SQL Editor).",
    };
  }

  const destination = next && !next.startsWith("/auth") ? next : portalPathForRole(role);
  redirect(destination);
}
