import {
  getOperatorById as mockGetOperatorById,
  operators as mockOperators,
} from "@/lib/mock-data";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { DbOperator } from "@/lib/supabase/database.types";
import type { Operator } from "@/lib/types";
import { mapOperator } from "./mappers";

export async function getOperators(): Promise<Operator[]> {
  if (!isSupabaseConfigured()) return mockOperators;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("operators")
      .select("*")
      .order("company_name");

    if (error || !data) return mockOperators;
    return (data as DbOperator[]).map(mapOperator);
  } catch {
    return mockOperators;
  }
}

export async function getOperatorById(id: string): Promise<Operator | undefined> {
  if (!isSupabaseConfigured()) return mockGetOperatorById(id);

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("operators")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return mockGetOperatorById(id);
    return mapOperator(data as DbOperator);
  } catch {
    return mockGetOperatorById(id);
  }
}
