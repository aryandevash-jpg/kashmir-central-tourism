import { OperatorLayout } from "@/components/operator/OperatorLayout";
import { getOperatorBookings, getOperatorByUserId } from "@/lib/services";
import { roleOrRedirect } from "@/lib/auth/guards";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const profile = await roleOrRedirect(["OPERATOR", "SUPER_ADMIN"]);
  const operator = await getOperatorByUserId(profile.id);
  const bookings = operator ? await getOperatorBookings(operator.id) : [];

  return (
    <OperatorLayout profile={profile} operator={operator ?? undefined} bookingCount={bookings.length}>
      {children}
    </OperatorLayout>
  );
}
