import { TouristNav } from "@/components/tourist/TouristNav";
import { ReportPageSkeleton } from "@/components/skeletons";

export default function ReportLoading() {
  return (
    <div className="min-h-screen bg-[#f0f7ff] tourist-page">
      <TouristNav />
      <ReportPageSkeleton />
    </div>
  );
}
