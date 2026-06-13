import { TouristNav } from "@/components/tourist/TouristNav";
import { ActivityDetailSkeleton } from "@/components/skeletons";

export default function ActivityLoading() {
  return (
    <div className="min-h-screen bg-[#f0f7ff] tourist-page">
      <TouristNav />
      <ActivityDetailSkeleton />
    </div>
  );
}
