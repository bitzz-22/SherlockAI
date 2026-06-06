import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { conversationId, content, recipientId } = (await request.json()) as {
      conversationId?: string;
      content?: string;
      recipientId?: string;
    };

    let targetConversationId = conversationId;

    if (!targetConversationId && recipientId) {
      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .or(`and(participant_1.eq.${user.id},participant_2.eq.${recipientId}),and(participant_1.eq.${recipientId},participant_2.eq.${user.id})`)
        .maybeSingle();

      if (existing?.id) {
        targetConversationId = existing.id;
      } else {
        const { data: created } = await supabase
          .from("conversations")
          .insert({ participant_1: user.id, participant_2: recipientId } as never)
          .select("id")
          .single();
        targetConversationId = created?.id;
      }
    }

    if (!targetConversationId) {
      return NextResponse.json({ error: "Missing conversation" }, { status: 400 });
    }

    const { data: message } = await supabase
      .from("messages")
      .insert({
        conversation_id: targetConversationId as string,
        sender_id: user.id,
        content: content as string,
        read: false,
      } as never)
      .select()
      .single();

    await supabase
      .from("conversations")
      .update({ last_message_at: new Date().toISOString() } as never)
      .eq("id", targetConversationId as string);

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
