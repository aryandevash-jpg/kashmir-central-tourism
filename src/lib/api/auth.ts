import { AuthError } from "@/lib/auth/errors";
import { fail, handleRouteError } from "./http";

export function handleAuthError(err: unknown) {
  if (err instanceof AuthError) {
    return fail(err.message, err.status);
  }
  return handleRouteError(err);
}
