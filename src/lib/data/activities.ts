import { createClient } from "@/lib/supabase/server";
import { requireSupabase } from "@/lib/supabase/require";
import type { DbActivity, DbOperator } from "@/lib/supabase/database.types";
import type { Activity, ActivityCategory, Operator } from "@/lib/types";
import { generateDefaultSlotsForActivity } from "./slots";
import { mapActivity, mapOperator } from "./mappers";

async function enrichActivities(rows: DbActivity[]): Promise<Activity[]> {
  if (rows.length === 0) return [];

  const supabase = await createClient();
  const ids = rows.map((r) => r.id);

  const [{ data: includes }, { data: reviews }] = await Promise.all([
    supabase.from("activity_includes").select("activity_id, item_name").in("activity_id", ids),
    supabase.from("reviews").select("activity_id, rating").in("activity_id", ids),
  ]);

  const includesMap = new Map<string, string[]>();
  (includes as { activity_id: string; item_name: string }[] | null)?.forEach((i) => {
    const list = includesMap.get(i.activity_id) ?? [];
    list.push(i.item_name);
    includesMap.set(i.activity_id, list);
  });

  const ratingMap = new Map<string, { sum: number; count: number }>();
  (reviews as { activity_id: string; rating: number }[] | null)?.forEach((r) => {
    const cur = ratingMap.get(r.activity_id) ?? { sum: 0, count: 0 };
    cur.sum += Number(r.rating);
    cur.count += 1;
    ratingMap.set(r.activity_id, cur);
  });

  return rows.map((row) => {
    const stats = ratingMap.get(row.id);
    const rating = stats ? Math.round((stats.sum / stats.count) * 10) / 10 : 0;
    const reviewCount = stats?.count ?? 0;
    return mapActivity(row, includesMap.get(row.id) ?? [], rating, reviewCount);
  });
}

async function fetchActivityRows(category?: ActivityCategory): Promise<DbActivity[]> {
  const supabase = await createClient();
  let query = supabase
    .from("activities")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as DbActivity[];
}

export async function getActivities(category?: ActivityCategory): Promise<Activity[]> {
  requireSupabase();
  const rows = await fetchActivityRows(category);
  return enrichActivities(rows);
}

export async function getActivityById(id: string): Promise<Activity | undefined> {
  requireSupabase();
  const supabase = await createClient();
  const { data, error } = await supabase.from("activities").select("*").eq("id", id).single();

  if (error || !data) return undefined;
  const [activity] = await enrichActivities([data as DbActivity]);
  return activity;
}

export async function getOperatorForActivity(activityId: string): Promise<Operator | undefined> {
  requireSupabase();
  const activity = await getActivityById(activityId);
  if (!activity) return undefined;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("operators")
    .select("*")
    .eq("id", activity.operatorId)
    .single();

  if (error || !data) return undefined;
  return mapOperator(data as DbOperator);
}

export async function getActivitiesByOperator(operatorId: string): Promise<Activity[]> {
  requireSupabase();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("activities")
    .select("*")
    .eq("operator_id", operatorId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!data) return [];
  return enrichActivities(data as DbActivity[]);
}

export interface CreateActivityInput {
  operatorId: string;
  title: string;
  description: string;
  district: string;
  locationName: string;
  category: ActivityCategory;
  difficulty: "EASY" | "MODERATE" | "HARD";
  durationMinutes: number;
  basePrice: number;
  coverImageUrl: string;
  includes: string[];
  elevation?: string;
}

export async function createActivity(input: CreateActivityInput): Promise<Activity> {
  requireSupabase();
  const supabase = await createClient();

  const { data: activityData, error: activityError } = await supabase
    .from("activities")
    .insert({
      operator_id: input.operatorId,
      title: input.title,
      description: input.description,
      district: input.district,
      location_name: input.locationName,
      category: input.category,
      difficulty: input.difficulty,
      duration_minutes: input.durationMinutes,
      cover_image_url: input.coverImageUrl,
      base_price: input.basePrice,
      is_active: true,
      elevation: input.elevation || null,
    })
    .select()
    .single();

  if (activityError || !activityData) {
    throw new Error(activityError?.message || "Failed to create activity");
  }

  if (input.includes.length > 0) {
    const includesData = input.includes.map((item) => ({
      activity_id: activityData.id,
      item_name: item,
    }));

    const { error: includesError } = await supabase
      .from("activity_includes")
      .insert(includesData);

    if (includesError) {
      throw new Error(includesError.message);
    }
  }

  const activity = mapActivity(activityData as DbActivity, input.includes, 0, 0);
  await generateDefaultSlotsForActivity(activityData.id);
  return activity;
}
