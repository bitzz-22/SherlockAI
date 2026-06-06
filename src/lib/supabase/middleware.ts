import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function updateSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
