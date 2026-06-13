import { Suspense } from "react";
import { TouristNav } from "@/components/tourist/TouristNav";
import { ExplorePageSkeleton } from "@/components/skeletons";
import { roleOrRedirect } from "@/lib/auth/guards";
import { ExploreActivities } from "./ExploreActivities";

export default async function ExplorePage() {
  await roleOrRedirect(["TOURIST", "SUPER_ADMIN"], "/explore");

  return (
    <div className="min-h-screen bg-[#f0f7ff] tourist-page">
      <TouristNav />
      <Suspense fallback={<ExplorePageSkeleton />}>
        <ExploreActivities />
      </Suspense>
    </div>
  );
}
