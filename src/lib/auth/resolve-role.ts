import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { UserRole } from "@/lib/types";

const VALID_ROLES: UserRole[] = ["TOURIST", "OPERATOR", "GOVT_OFFICER", "SUPER_ADMIN"];

export function roleFromAuthUser(user: User): UserRole | null {
  const role = user.user_metadata?.role as string | undefined;
  if (role && VALID_ROLES.includes(role as UserRole)) {
    return role as UserRole;
  }
  return null;
}

export async function resolveUserRole(
  supabase: SupabaseClient,
  user: User
): Promise<UserRole | null> {
  const metaRole = roleFromAuthUser(user);
  if (metaRole) return metaRole;

  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (data?.role && VALID_ROLES.includes(data.role as UserRole)) {
    return data.role as UserRole;
  }

  return null;
}
