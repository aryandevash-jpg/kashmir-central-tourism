import { Suspense } from "react";
import { TouristNav } from "@/components/tourist/TouristNav";
import { ExplorePageSkeleton } from "@/components/skeletons";
import { roleOrRedirect } from "@/lib/auth/guards";
import { ExploreActivities } from "./ExploreActivities";

export default async function ExplorePage() {
  await roleOrRedirect(["TOURIST", "SUPER_ADMIN"], "/explore");

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[#f0f7ff]">
      <TouristNav />
      <div className="min-h-0 flex-1">
        <Suspense fallback={<ExplorePageSkeleton />}>
          <ExploreActivities />
        </Suspense>
      </div>
    </div>
  );
}
