"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function loginAction(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function registerAction(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("fullName") || "");
  const university = String(formData.get("university") || "");
  const studentId = String(formData.get("studentId") || "");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        university,
        student_id: studentId,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/verify-email`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, userId: data.user?.id };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
