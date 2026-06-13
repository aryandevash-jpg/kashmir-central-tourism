import { ExploreFeed } from "@/components/tourist/ExploreFeed";
import { getActivities } from "@/lib/services";

export async function ExploreActivities() {
  const activities = await getActivities();
  return <ExploreFeed activities={activities} />;
}
