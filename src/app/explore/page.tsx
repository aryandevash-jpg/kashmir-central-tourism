import { TouristNav } from "@/components/tourist/TouristNav";
import { ExploreFeed } from "@/components/tourist/ExploreFeed";
import { getActivities } from "@/lib/services";
import { roleOrRedirect } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  await roleOrRedirect(["TOURIST", "SUPER_ADMIN"], "/explore");
  const activities = await getActivities();

  return (
    <div className="min-h-screen bg-[#f0f7ff] tourist-page">
      <TouristNav />
      <ExploreFeed activities={activities} />
    </div>
  );
}
