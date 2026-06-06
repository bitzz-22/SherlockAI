import { createClient } from "@/lib/supabase/server";

export async function semanticMatchItems(
  itemId: string,
  itemType: "lost" | "found",
  threshold = 0.7,
  limit = 10
) {
  const supabase = await createClient();

  const { data: currentItem } = await supabase
    .from("items")
    .select("embedding")
    .eq("id", itemId)
    .single();

  if (!currentItem?.embedding) {
    return [];
  }

  const matchingType = itemType === "lost" ? "found" : "lost";

  const { data: matches } = await supabase.rpc("match_items", {
    query_embedding: currentItem.embedding,
    match_type: matchingType,
    similarity_threshold: threshold,
    match_limit: limit,
  });

  return matches || [];
}

export async function findMatchesForItem(itemId: string) {
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("items")
    .select("*")
    .eq("id", itemId)
    .single();

  if (!item) return [];

  const candidateMatches = await semanticMatchItems(itemId, item.type);

  const enriched = await Promise.all(
    candidateMatches.map(async (m: { items: Record<string, unknown>; similarity: number }) => {
      const matchItem = m.items as Record<string, unknown>;
      return {
        ...matchItem,
        similarity: m.similarity,
      };
    })
  );

  return enriched;
}
