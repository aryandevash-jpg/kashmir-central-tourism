import {
  activities as mockActivities,
  getActivityById as mockGetActivityById,
  getOperatorForActivity as mockGetOperatorForActivity,
} from "@/lib/mock-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { DbActivity, DbOperator } from "@/lib/supabase/database.types";
import type { Activity, ActivityCategory, Operator } from "@/lib/types";
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
  if (!isSupabaseConfigured()) {
    return category
      ? mockActivities.filter((a) => a.category === category)
      : mockActivities;
  }

  try {
    const rows = await fetchActivityRows(category);
    if (rows.length === 0) {
      return category
        ? mockActivities.filter((a) => a.category === category)
        : mockActivities;
    }
    return enrichActivities(rows);
  } catch {
    return category
      ? mockActivities.filter((a) => a.category === category)
      : mockActivities;
  }
}

export async function getActivityById(id: string): Promise<Activity | undefined> {
  if (!isSupabaseConfigured()) return mockGetActivityById(id);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return mockGetActivityById(id);
    const [activity] = await enrichActivities([data]);
    return activity;
  } catch {
    return mockGetActivityById(id);
  }
}

export async function getOperatorForActivity(activityId: string): Promise<Operator | undefined> {
  if (!isSupabaseConfigured()) return mockGetOperatorForActivity(activityId);

  try {
    const activity = await getActivityById(activityId);
    if (!activity) return undefined;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("operators")
      .select("*")
      .eq("id", activity.operatorId)
      .single();

    if (error || !data) return mockGetOperatorForActivity(activityId);
    return mapOperator(data as DbOperator);
  } catch {
    return mockGetOperatorForActivity(activityId);
  }
}

export async function getActivitiesByOperator(operatorId: string): Promise<Activity[]> {
  if (!isSupabaseConfigured()) {
    return mockActivities.filter((a) => a.operatorId === operatorId);
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .eq("operator_id", operatorId)
      .order("title");

    if (error || !data) {
      return mockActivities.filter((a) => a.operatorId === operatorId);
    }
    return enrichActivities(data);
  } catch {
    return mockActivities.filter((a) => a.operatorId === operatorId);
  }
}
