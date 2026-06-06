"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateTextEmbedding } from "@/lib/ai/gemini";

export async function createItemAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const type = String(formData.get("type")) as "lost" | "found";
  const title = String(formData.get("title") || "");
  const description = String(formData.get("description") || "");
  const category = String(formData.get("category") || "");
  const location = String(formData.get("location") || "");
  const latitude = Number(formData.get("latitude") || 0);
  const longitude = Number(formData.get("longitude") || 0);
  const imageUrlsRaw = String(formData.get("imageUrls") || "[]");
  const imageUrls = JSON.parse(imageUrlsRaw) as string[];

  // Send request to FastAPI backend instead of inserting directly
  try {
    const res = await fetch("http://127.0.0.1:8000/api/items/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: user.id,
        type,
        title,
        description,
        category,
        location: location || null,
        latitude: latitude || null,
        longitude: longitude || null,
        image_urls: imageUrls,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { error: `Backend error: ${errorText}` };
    }

    const data = await res.json();

    revalidatePath("/browse");
    revalidatePath("/dashboard");

    return { success: true, item: data };
  } catch (error: any) {
    console.error("Failed to submit item to backend:", error);
    return { error: error.message || "Failed to connect to backend server" };
  }
}

export async function triggerMatching(itemId: string) {
  try {
    const { matchItems } = await import("@/lib/matching-engine");
    await matchItems(itemId);
  } catch (error) {
    console.error("Matching trigger failed:", error);
  }
}
