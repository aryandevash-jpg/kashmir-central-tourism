import { TouristNav } from "@/components/tourist/TouristNav";
import { ExploreFeed } from "@/components/tourist/ExploreFeed";
import { getActivities } from "@/lib/services";

export default async function ExplorePage() {
  const activities = await getActivities();

  return (
    <div className="min-h-screen bg-[#f0f7ff]">
      <TouristNav />
      <ExploreFeed activities={activities} />
    </div>
  );
}
