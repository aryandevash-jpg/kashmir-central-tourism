import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@/lib/types";
import { resolveUserRole } from "@/lib/auth/resolve-role";
import { isGovRole, isOperatorRole, portalPathForRole } from "@/lib/auth/roles";

function isPublicPath(pathname: string): boolean {
  return pathname === "/" || pathname.startsWith("/auth");
}

function loginRedirect(request: NextRequest, pathname: string) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/auth/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = user ? await resolveUserRole(supabase, user) : null;

  return { response, user, role };
}

export function enforcePortalAccess(
  request: NextRequest,
  pathname: string,
  role: UserRole | null
): NextResponse | null {
  if (!role) return null;

  if (pathname.startsWith("/gov") && !isGovRole(role)) {
    return NextResponse.redirect(new URL(portalPathForRole(role), request.url));
  }

  if (pathname.startsWith("/operator") && !isOperatorRole(role)) {
    return NextResponse.redirect(new URL(portalPathForRole(role), request.url));
  }

  const touristOnlyPrefixes = ["/explore", "/bookings", "/profile", "/report", "/saved", "/activities"];
  const isTouristRoute = touristOnlyPrefixes.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (isTouristRoute && role === "OPERATOR") {
    return NextResponse.redirect(new URL("/operator", request.url));
  }

  if (isTouristRoute && role === "GOVT_OFFICER") {
    return NextResponse.redirect(new URL("/gov", request.url));
  }

  return null;
}

export { isPublicPath, loginRedirect };
