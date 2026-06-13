import { redirect } from "next/navigation";
import { getAuthProfile, type AuthProfile } from "./session";
import type { UserRole } from "@/lib/types";
import { portalPathForRole } from "./roles";

export async function authOrRedirect(returnPath?: string): Promise<AuthProfile> {
  const profile = await getAuthProfile();
  if (!profile) {
    const params = new URLSearchParams();
    if (returnPath) params.set("next", returnPath);
    redirect(`/auth/login${params.size ? `?${params}` : ""}`);
  }
  return profile;
}

export async function roleOrRedirect(
  roles: UserRole[],
  returnPath?: string
): Promise<AuthProfile> {
  const profile = await authOrRedirect(returnPath);
  if (!roles.includes(profile.role)) {
    redirect(portalPathForRole(profile.role));
  }
  return profile;
}
