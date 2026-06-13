import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { resolveUserRole } from "@/lib/auth/resolve-role";
import { portalHomePath, roleMatchesPortal, type Portal } from "@/lib/auth/roles";
import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ portal?: string; next?: string }>;
}) {
  const params = await searchParams;
  const portal = (params.portal ?? "tourist") as Portal;
  const next = params.next;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const role = await resolveUserRole(supabase, user);
    if (role && roleMatchesPortal(role, portal)) {
      const destination =
        next && !next.startsWith("/auth") ? next : portalHomePath(portal);
      redirect(destination);
    }
  }

  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginForm portal={portal} next={next} />
    </Suspense>
  );
}
