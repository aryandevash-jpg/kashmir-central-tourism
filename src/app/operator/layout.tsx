import { OperatorLayout } from "@/components/operator/OperatorLayout";
import { getOperatorByUserId } from "@/lib/services";
import { roleOrRedirect } from "@/lib/auth/guards";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const profile = await roleOrRedirect(["OPERATOR", "SUPER_ADMIN"]);
  const operator = await getOperatorByUserId(profile.id);

  return (
    <OperatorLayout profile={profile} operator={operator ?? undefined}>
      {children}
    </OperatorLayout>
  );
}
