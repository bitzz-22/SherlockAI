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

  let embedding: number[] | null = null;

  try {
    embedding = await generateTextEmbedding(
      `${title} ${category} ${location} ${description}`
    );
  } catch (error) {
    console.error("Embedding generation failed:", error);
  }

  const { data, error } = await supabase
    .from("items")
    .insert({
      user_id: user.id,
      type,
      title,
      description,
      category,
      location: location || null,
      latitude: latitude || null,
      longitude: longitude || null,
      image_urls: imageUrls,
      embedding,
      status: "active",
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/browse");
  revalidatePath("/dashboard");

  if (type === "found") {
    await triggerMatching(data.id);
  }

  return { success: true, item: data };
}

export async function triggerMatching(itemId: string) {
  try {
    const { matchItems } = await import("@/lib/matching-engine");
    await matchItems(itemId);
  } catch (error) {
    console.error("Matching trigger failed:", error);
  }
}
