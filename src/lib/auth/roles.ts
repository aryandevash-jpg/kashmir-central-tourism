import type { UserRole } from "@/lib/types";

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

export function isGovRole(role: UserRole): boolean {
  return role === "GOVT_OFFICER" || role === "SUPER_ADMIN";
}

export function isOperatorRole(role: UserRole): boolean {
  return role === "OPERATOR" || role === "SUPER_ADMIN";
}

export function isTouristRole(role: UserRole): boolean {
  return role === "TOURIST" || role === "SUPER_ADMIN";
}
