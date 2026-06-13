import { TouristNav } from "@/components/tourist/TouristNav";
import { ExplorePageSkeleton } from "@/components/skeletons";

export default function ExploreLoading() {
  return (
    <div className="min-h-screen bg-[#f0f7ff] tourist-page">
      <TouristNav />
      <ExplorePageSkeleton />
    </div>
  );
}
