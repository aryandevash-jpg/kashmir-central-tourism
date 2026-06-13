import { NextResponse, type NextRequest } from "next/server";
import {
  enforcePortalAccess,
  isPublicPath,
  loginRedirect,
  updateSession,
} from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|mp4|webp)$/)
  ) {
    return NextResponse.next();
  }

  const { response, user, role } = await updateSession(request);

  if (isPublicPath(pathname)) {
    return response;
  }

  if (!user || !role) {
    return loginRedirect(request, pathname);
  }

  const portalRedirect = enforcePortalAccess(request, pathname, role);
  if (portalRedirect) {
    return portalRedirect;
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
