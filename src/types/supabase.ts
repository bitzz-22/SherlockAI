export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          university: string | null;
          student_id: string | null;
          avatar_url: string | null;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          university?: string | null;
          student_id?: string | null;
          avatar_url?: string | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          university?: string | null;
          student_id?: string | null;
          avatar_url?: string | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      items: {
        Row: {
          id: string;
          user_id: string;
          type: "lost" | "found";
          title: string;
          description: string;
          category: string;
          location: string | null;
          latitude: number | null;
          longitude: number | null;
          status: "active" | "resolved" | "inactive";
          image_urls: string[];
          embedding: number[] | null;
          matched_item_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          type: "lost" | "found";
          title: string;
          description: string;
          category: string;
          location?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          status?: "active" | "resolved" | "inactive";
          image_urls?: string[];
          embedding?: number[] | null;
          matched_item_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          type?: "lost" | "found";
          title?: string;
          description?: string;
          category?: string;
          location?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          status?: "active" | "resolved" | "inactive";
          image_urls?: string[];
          embedding?: number[] | null;
          matched_item_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          read: boolean;
          created_at: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          item_id: string | null;
          participant_1: string;
          participant_2: string;
          last_message_at: string;
          created_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: "match" | "message" | "system" | "item_update";
          title: string;
          message: string;
          read: boolean;
          related_item_id: string | null;
          related_user_id: string | null;
          created_at: string;
        };
      };
      matches: {
        Row: {
          id: string;
          lost_item_id: string;
          found_item_id: string;
          similarity_score: number;
          ai_reasoning: string | null;
          status: "pending" | "accepted" | "rejected" | "resolved";
          created_at: string;
        };
      };
    };
  };
};
