import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboardClient } from "./page-client";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_access")?.value === "true";
  
  if (!isAdmin) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const { data: items } = await supabase
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  return <AdminDashboardClient initialItems={items || []} />;
}
