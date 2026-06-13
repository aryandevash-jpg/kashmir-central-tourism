import { Suspense } from "react";
import { TouristNav } from "@/components/tourist/TouristNav";
import {
  getActivities,
  getIncidentsByReporter,
  getOperators,
} from "@/lib/services";
import { roleOrRedirect } from "@/lib/auth/guards";
import { ReportHubClient } from "./ReportHubClient";

export const dynamic = "force-dynamic";

export default async function ReportIncidentPage() {
  const profile = await roleOrRedirect(["TOURIST", "SUPER_ADMIN"], "/report");

  const [operators, activities, myIncidents] = await Promise.all([
    getOperators(),
    getActivities(),
    getIncidentsByReporter(profile.id),
  ]);

  return (
    <div className="min-h-screen bg-[#f0f7ff] tourist-page">
      <TouristNav />
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-8">
        <Suspense fallback={<div className="text-center text-slate-500">Loading...</div>}>
          <ReportHubClient
            operators={operators}
            activities={activities}
            myIncidents={myIncidents}
            userId={profile.id}
          />
        </Suspense>
      </div>
    </div>
  );
}
