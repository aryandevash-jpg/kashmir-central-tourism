import { createClient } from "@/lib/supabase/server";
import { requireSupabase } from "@/lib/supabase/require";
import type { DbEvent } from "@/lib/supabase/database.types";
import type { EventBanner, EventCategory, EventPriority } from "@/lib/types";
import { mapEvent } from "./mappers";

export interface CreateEventInput {
  title: string;
  message: string;
  district?: string;
  category: EventCategory;
  priority: EventPriority;
  startsAt?: string;
  endsAt?: string;
  isPublished?: boolean;
  isImportant?: boolean;
  sourceLabel?: string;
  createdBy: string;
}

export interface UpdateEventInput {
  title?: string;
  message?: string;
  district?: string;
  category?: EventCategory;
  priority?: EventPriority;
  startsAt?: string;
  endsAt?: string;
  isPublished?: boolean;
  isImportant?: boolean;
  sourceLabel?: string;
}

export async function getPublishedEvents(): Promise<EventBanner[]> {
  requireSupabase();
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .lte("starts_at", nowIso)
    .or(`ends_at.is.null,ends_at.gte.${nowIso}`)
    .order("priority", { ascending: false })
    .order("starts_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as DbEvent[]).map(mapEvent);
}

export async function getImportantEvents(): Promise<EventBanner[]> {
  requireSupabase();
  const supabase = await createClient();
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .eq("is_important", true)
    .lte("starts_at", nowIso)
    .or(`ends_at.is.null,ends_at.gte.${nowIso}`)
    .order("priority", { ascending: false })
    .order("starts_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as DbEvent[]).map(mapEvent);
}

export async function getGovEvents(): Promise<EventBanner[]> {
  requireSupabase();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as DbEvent[]).map(mapEvent);
}

export async function createEvent(input: CreateEventInput): Promise<EventBanner> {
  requireSupabase();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("events")
    .insert({
      title: input.title,
      message: input.message,
      district: input.district ?? null,
      category: input.category,
      priority: input.priority,
      starts_at: input.startsAt ?? new Date().toISOString(),
      ends_at: input.endsAt ?? null,
      is_published: input.isPublished ?? true,
      is_important: input.isImportant ?? true,
      source_label: input.sourceLabel ?? "Official advisory",
      created_by: input.createdBy,
    })
    .select()
    .single();

  if (error || !data) throw new Error(error?.message || "Failed to create event");
  return mapEvent(data as DbEvent);
}

export async function updateEvent(eventId: string, input: UpdateEventInput): Promise<EventBanner> {
  requireSupabase();
  const supabase = await createClient();

  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (typeof input.title === "string") payload.title = input.title;
  if (typeof input.message === "string") payload.message = input.message;
  if (typeof input.district === "string") payload.district = input.district;
  if (typeof input.category === "string") payload.category = input.category;
  if (typeof input.priority === "string") payload.priority = input.priority;
  if (typeof input.startsAt === "string") payload.starts_at = input.startsAt;
  if (typeof input.endsAt === "string") payload.ends_at = input.endsAt;
  if (typeof input.isPublished === "boolean") payload.is_published = input.isPublished;
  if (typeof input.isImportant === "boolean") payload.is_important = input.isImportant;
  if (typeof input.sourceLabel === "string") payload.source_label = input.sourceLabel;

  const { data, error } = await supabase
    .from("events")
    .update(payload)
    .eq("id", eventId)
    .select()
    .single();

  if (error || !data) throw new Error(error?.message || "Failed to update event");
  return mapEvent(data as DbEvent);
}
