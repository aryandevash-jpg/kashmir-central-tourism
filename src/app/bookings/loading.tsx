import { TouristNav } from "@/components/tourist/TouristNav";
import { BookingsPageSkeleton } from "@/components/skeletons";

export default function BookingsLoading() {
  return (
    <div className="min-h-screen bg-[#f0f7ff] tourist-page">
      <TouristNav />
      <BookingsPageSkeleton />
    </div>
  );
}
