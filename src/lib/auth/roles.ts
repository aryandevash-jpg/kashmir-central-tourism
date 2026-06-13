import type { UserRole } from "@/lib/types";

export type Portal = "tourist" | "operator" | "gov";

export function portalPathForRole(role: UserRole): string {
  switch (role) {
    case "OPERATOR":
      return "/operator";
    case "GOVT_OFFICER":
    case "SUPER_ADMIN":
      return "/gov";
    default:
      return "/explore";
  }
}

export function portalHomePath(portal: Portal): string {
  switch (portal) {
    case "operator":
      return "/operator";
    case "gov":
      return "/gov";
    default:
      return "/explore";
  }
}

export function portalLoginPath(portal: Portal): string {
  return `/auth/login?portal=${portal}`;
}

export function entryHrefForPortal(portal: Portal, role: UserRole | null | undefined): string {
  if (role && roleMatchesPortal(role, portal)) {
    return portalHomePath(portal);
  }
  return portalLoginPath(portal);
}

export function roleMatchesPortal(role: UserRole, portal: Portal): boolean {
  switch (portal) {
    case "tourist":
      return role === "TOURIST" || role === "SUPER_ADMIN";
    case "operator":
      return role === "OPERATOR" || role === "SUPER_ADMIN";
    case "gov":
      return role === "GOVT_OFFICER" || role === "SUPER_ADMIN";
    default:
      return false;
  }
}

export function isGovRole(role: UserRole): boolean {
  return role === "GOVT_OFFICER" || role === "SUPER_ADMIN";
}

export function isOperatorRole(role: UserRole): boolean {
  return role === "OPERATOR" || role === "SUPER_ADMIN";
}

export function isTouristRole(role: UserRole): boolean {
  return role === "TOURIST" || role === "SUPER_ADMIN";
}
