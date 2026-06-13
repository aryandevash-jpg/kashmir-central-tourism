"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { IconChevronLeft } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { Activity, Incident, Operator } from "@/lib/types";
import { ReportIncidentClient } from "./ReportIncidentClient";
import { IncidentTracker } from "./IncidentTracker";

type Tab = "report" | "track";

interface ReportHubClientProps {
  operators: Operator[];
  activities: Activity[];
  myIncidents: Incident[];
  userId: string;
}

export function ReportHubClient({ operators, activities, myIncidents, userId }: ReportHubClientProps) {
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") === "track" ? "track" : "report") as Tab;

  return (
    <>
      <Link
        href="/profile"
        className="mb-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
      >
        <IconChevronLeft className="h-4 w-4" />
        Back to Profile
      </Link>

      <div className="mb-6 flex rounded-xl bg-white p-1 shadow-sm">
        <Link
          href="/report"
          className={cn(
            "flex-1 rounded-lg py-2.5 text-center text-sm font-semibold transition-colors",
            tab === "report" ? "bg-red-600 text-white" : "text-slate-600 hover:bg-slate-50",
          )}
        >
          Report Incident
        </Link>
        <Link
          href="/report?tab=track"
          className={cn(
            "flex-1 rounded-lg py-2.5 text-center text-sm font-semibold transition-colors",
            tab === "track" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50",
          )}
        >
          Track Status
          {myIncidents.length > 0 && (
            <span
              className={cn(
                "ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                tab === "track" ? "bg-blue-500" : "bg-blue-100 text-blue-600",
              )}
            >
              {myIncidents.length}
            </span>
          )}
        </Link>
      </div>

      {tab === "report" ? (
        <ReportIncidentClient operators={operators} activities={activities} />
      ) : (
        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <IncidentTracker incidents={myIncidents} operators={operators} userId={userId} />
        </div>
      )}
    </>
  );
}
