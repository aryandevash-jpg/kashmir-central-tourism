import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // 303 so the browser follows with GET; default 307 would re-POST to "/" and 405
  return NextResponse.redirect(new URL("/", request.url), 303);
}

export async function GET(request: Request) {
  return POST(request);
}
