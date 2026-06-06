import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateMatchReasoning } from "@/lib/ai/gemini";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { lostItemId, candidateId, similarity } = (await request.json()) as {
      lostItemId?: string;
      candidateId?: string;
      similarity?: number;
    };

    if (!lostItemId || !candidateId || typeof similarity !== "number") {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data: lostItem } = await supabase
      .from("items")
      .select("title,description")
      .eq("id", lostItemId)
      .single();

    const { data: candidateItem } = await supabase
      .from("items")
      .select("title,description")
      .eq("id", candidateId)
      .single();

    if (!lostItem || !candidateItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    const reasoning = await generateMatchReasoning(
      `${lostItem.title} ${lostItem.description}`,
      `${candidateItem.title} ${candidateItem.description}`,
      similarity
    );

    const { data: match } = await supabase
      .from("matches")
      .insert({
        lost_item_id: lostItemId,
        found_item_id: candidateId,
        similarity_score: similarity,
        ai_reasoning: reasoning,
        status: "pending",
      } as never)
      .select()
      .single();

    await supabase.from("notifications").insert({
      user_id: user.id,
      type: "match",
      title: "Potential match found",
      message: `AI found a ${Math.round(similarity * 100)}% match for ${lostItem.title}.`,
      related_item_id: lostItemId,
      related_user_id: user.id,
    } as never);

    return NextResponse.json({ success: true, match });
  } catch (error) {
    console.error("generate-match error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
