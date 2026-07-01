import { GovEventsClient } from "./GovEventsClient";
import { getGovEvents } from "@/lib/services";

export default async function GovEventsPage() {
  const events = await getGovEvents();
  return <GovEventsClient initialEvents={events} />;
}
