import { createClient } from "@/lib/supabase/server";
import { requireSupabase } from "@/lib/supabase/require";
import type { DbIncident } from "@/lib/supabase/database.types";
import type { Incident, IncidentSeverity, IncidentStatus } from "@/lib/types";
import { mapIncident } from "./mappers";

export interface CreateIncidentInput {
  operatorId: string;
  activityId?: string;
  reportedBy: string;
  title: string;
  description: string;
  severity: IncidentSeverity;
  district: string;
  occurredAt?: string;
}

export async function getIncidents(): Promise<Incident[]> {
  requireSupabase();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("incidents")
    .select("*")
    .order("occurred_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as DbIncident[]).map(mapIncident);
}

export async function getIncidentsByReporter(userId: string): Promise<Incident[]> {
  requireSupabase();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("incidents")
    .select("*")
    .eq("reported_by", userId)
    .order("occurred_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as DbIncident[]).map(mapIncident);
}

export async function updateIncidentStatus(
  incidentId: string,
  action: "escalate" | "resolve",
  actorId: string,
  note?: string
): Promise<{ success: boolean; status: IncidentStatus }> {
  const newStatus: IncidentStatus = action === "resolve" ? "RESOLVED" : "UNDER_REVIEW";
  requireSupabase();
  const supabase = await createClient();

  const updateData: { status: IncidentStatus; resolved_at?: string } = {
    status: newStatus,
  };

  if (action === "resolve") {
    updateData.resolved_at = new Date().toISOString();
  }

  const { error } = await supabase.from("incidents").update(updateData).eq("id", incidentId);

  if (error) throw error;

  if (note) {
    await supabase.from("incident_actions").insert({
      incident_id: incidentId,
      actor_id: actorId,
      action_type: action === "resolve" ? "RESOLVED" : "ESCALATED",
      note,
      acted_at: new Date().toISOString(),
    });
  }

  return { success: true, status: newStatus };
}

export async function createIncident(input: CreateIncidentInput): Promise<Incident> {
  const occurredAt = input.occurredAt ?? new Date().toISOString();
  requireSupabase();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("incidents")
    .insert({
      operator_id: input.operatorId,
      activity_id: input.activityId ?? null,
      reported_by: input.reportedBy,
      title: input.title,
      description: input.description,
      severity: input.severity,
      status: "OPEN",
      district: input.district,
      occurred_at: occurredAt,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Failed to create incident");
  }

  await supabase.from("incident_actions").insert({
    incident_id: data.id,
    actor_id: input.reportedBy,
    action_type: "REPORTED",
    note: "Incident reported via visitor portal",
    acted_at: occurredAt,
  });

  return mapIncident(data as DbIncident);
}
