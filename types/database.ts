export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: "admin";
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          role?: "admin";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      content_items: {
        Row: {
          id: string;
          title: string;
          target_audience: string;
          format_type:
            | "carousel"
            | "single_image"
            | "short_video"
            | "article"
            | "infographic";
          core_message: string;
          body_draft: string;
          production_guide: string;
          expected_reaction_points: string;
          status:
            | "draft"
            | "approved"
            | "hold"
            | "needs_revision"
            | "posted"
            | "archived";
          created_at: string;
          updated_at: string;
          published_at: string | null;
          created_by: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["content_items"]["Row"],
          "created_at" | "updated_at"
        > & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["content_items"]["Insert"]>;
      };
      content_hooks: {
        Row: {
          id: string;
          content_item_id: string;
          hook_text: string;
          position: number;
        };
        Insert: Database["public"]["Tables"]["content_hooks"]["Row"];
        Update: Partial<Database["public"]["Tables"]["content_hooks"]["Insert"]>;
      };
      content_ctas: {
        Row: {
          id: string;
          content_item_id: string;
          cta_text: string;
          position: number;
        };
        Insert: Database["public"]["Tables"]["content_ctas"]["Row"];
        Update: Partial<Database["public"]["Tables"]["content_ctas"]["Insert"]>;
      };
      content_tags: {
        Row: {
          id: string;
          content_item_id: string;
          tag: string;
        };
        Insert: Database["public"]["Tables"]["content_tags"]["Row"];
        Update: Partial<Database["public"]["Tables"]["content_tags"]["Insert"]>;
      };
      channel_copies: {
        Row: {
          id: string;
          content_item_id: string;
          channel: "instagram" | "threads" | "linkedin" | "blog";
          copy_text: string;
          hashtags: string[];
          call_to_action: string;
          status: "generated" | "posted";
          generated_at: string;
          posted_at: string | null;
        };
        Insert: Database["public"]["Tables"]["channel_copies"]["Row"];
        Update: Partial<Database["public"]["Tables"]["channel_copies"]["Insert"]>;
      };
      content_assets: {
        Row: {
          id: string;
          content_item_id: string;
          label: string;
          asset_type: "image" | "video" | "document";
          url: string;
          created_at: string;
        };
        Insert: Database["public"]["Tables"]["content_assets"]["Row"];
        Update: Partial<Database["public"]["Tables"]["content_assets"]["Insert"]>;
      };
      approval_logs: {
        Row: {
          id: string;
          content_item_id: string;
          from_status:
            | "draft"
            | "approved"
            | "hold"
            | "needs_revision"
            | "posted"
            | "archived"
            | null;
          to_status:
            | "draft"
            | "approved"
            | "hold"
            | "needs_revision"
            | "posted"
            | "archived";
          note: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: Database["public"]["Tables"]["approval_logs"]["Row"];
        Update: Partial<Database["public"]["Tables"]["approval_logs"]["Insert"]>;
      };
      performance_metrics: {
        Row: {
          id: string;
          content_item_id: string;
          channel: "instagram" | "threads" | "linkedin" | "blog";
          impressions: number;
          clicks: number;
          saves: number;
          shares: number;
          comments: number;
          conversions: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Database["public"]["Tables"]["performance_metrics"]["Row"];
        Update: Partial<Database["public"]["Tables"]["performance_metrics"]["Insert"]>;
      };
      generation_settings: {
        Row: {
          id: string;
          tone_of_voice: string;
          content_cadence_per_week: number;
          target_channels: string[];
          hashtags_per_post: number;
          default_audience: string;
          approval_required: boolean;
          prompt_guardrails: string[];
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["generation_settings"]["Row"],
          "updated_at"
        > & {
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["generation_settings"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
