import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/types";
import { roleFromAuthUser } from "./resolve-role";
import { AuthError } from "./errors";

export interface AuthProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export const getSessionUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
});

export const getAuthProfile = cache(async (): Promise<AuthProfile | null> => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data } = await supabase
    .from("users")
    .select("id, name, email, phone, role")
    .eq("id", user.id)
    .maybeSingle();

  if (data) {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone ?? undefined,
      role: data.role as UserRole,
    };
  }

  const role = roleFromAuthUser(user);
  if (!role) return null;

  return {
    id: user.id,
    name: (user.user_metadata?.name as string) ?? user.email ?? "",
    email: user.email ?? "",
    phone: undefined,
    role,
  };
});

export async function requireAuth(): Promise<AuthProfile> {
  const profile = await getAuthProfile();
  if (!profile) throw new AuthError("Authentication required", 401);
  return profile;
}

export async function requireRole(roles: UserRole[]): Promise<AuthProfile> {
  const profile = await requireAuth();
  if (!roles.includes(profile.role)) {
    throw new AuthError("You do not have permission to access this resource", 403);
  }
  return profile;
}

export const getOperatorIdForUser = cache(async (userId: string): Promise<string | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("operators")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data.id;
});

export async function requireOperatorId(): Promise<{ profile: AuthProfile; operatorId: string }> {
  const profile = await requireRole(["OPERATOR", "SUPER_ADMIN"]);
  const operatorId = await getOperatorIdForUser(profile.id);
  if (!operatorId) {
    throw new AuthError("No operator account linked to this user", 403);
  }
  return { profile, operatorId };
}
