import { redirect } from "next/navigation";
import { GovLayout } from "@/components/gov/GovLayout";
import { roleOrRedirect } from "@/lib/auth/guards";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const profile = await roleOrRedirect(["GOVT_OFFICER", "SUPER_ADMIN"]);
  return <GovLayout profile={profile}>{children}</GovLayout>;
}
