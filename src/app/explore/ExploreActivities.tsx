import { ExploreFeed } from "@/components/tourist/ExploreFeed";
import { getActivities, getImportantEvents } from "@/lib/services";

export async function ExploreActivities() {
  const [activities, importantEvents] = await Promise.all([getActivities(), getImportantEvents()]);
  return <ExploreFeed activities={activities} importantEvents={importantEvents} />;
}
