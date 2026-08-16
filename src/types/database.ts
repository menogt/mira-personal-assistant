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
        Row: { id: string; email: string | null; display_name: string | null; avatar_url: string | null; timezone: string; created_at: string; updated_at: string };
        Insert: { id: string; email?: string | null; display_name?: string | null; avatar_url?: string | null; timezone?: string; created_at?: string; updated_at?: string };
        Update: { id?: string; email?: string | null; display_name?: string | null; avatar_url?: string | null; timezone?: string; created_at?: string; updated_at?: string };
        Relationships: [];
      };
      tasks: {
        Row: { id: string; user_id: string; title: string; description: string | null; category: string; priority: string; status: string; due_at: string | null; estimated_minutes: number | null; recurrence: string | null; project_id: string | null; goal_id: string | null; completed_at: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; user_id: string; title: string; description?: string | null; category: string; priority: string; status?: string; due_at?: string | null; estimated_minutes?: number | null; recurrence?: string | null; project_id?: string | null; goal_id?: string | null; completed_at?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; user_id?: string; title?: string; description?: string | null; category?: string; priority?: string; status?: string; due_at?: string | null; estimated_minutes?: number | null; recurrence?: string | null; project_id?: string | null; goal_id?: string | null; completed_at?: string | null; created_at?: string; updated_at?: string };
        Relationships: [
          { foreignKeyName: "tasks_user_id_fkey"; columns: ["user_id"]; referencedRelation: "users"; referencedColumns: ["id"] },
          { foreignKeyName: "tasks_project_id_fkey"; columns: ["project_id"]; referencedRelation: "projects"; referencedColumns: ["id"] },
          { foreignKeyName: "tasks_goal_id_fkey"; columns: ["goal_id"]; referencedRelation: "goals"; referencedColumns: ["id"] },
        ];
      };
      projects: {
        Row: { id: string; user_id: string; name: string; description: string | null; status: string; priority: string; progress: number; next_action: string | null; blocker: string | null; github_url: string | null; live_url: string | null; notes: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; user_id: string; name: string; description?: string | null; status?: string; priority?: string; progress?: number; next_action?: string | null; blocker?: string | null; github_url?: string | null; live_url?: string | null; notes?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; user_id?: string; name?: string; description?: string | null; status?: string; priority?: string; progress?: number; next_action?: string | null; blocker?: string | null; github_url?: string | null; live_url?: string | null; notes?: string | null; created_at?: string; updated_at?: string };
        Relationships: [{ foreignKeyName: "projects_user_id_fkey"; columns: ["user_id"]; referencedRelation: "users"; referencedColumns: ["id"] }];
      };
      goals: {
        Row: { id: string; user_id: string; name: string; category: string; reason: string | null; deadline: string | null; progress: number; milestones: Json; status: string; created_at: string; updated_at: string };
        Insert: { id?: string; user_id: string; name: string; category?: string; reason?: string | null; deadline?: string | null; progress?: number; milestones?: Json; status?: string; created_at?: string; updated_at?: string };
        Update: { id?: string; user_id?: string; name?: string; category?: string; reason?: string | null; deadline?: string | null; progress?: number; milestones?: Json; status?: string; created_at?: string; updated_at?: string };
        Relationships: [{ foreignKeyName: "goals_user_id_fkey"; columns: ["user_id"]; referencedRelation: "users"; referencedColumns: ["id"] }];
      };
      notes: {
        Row: { id: string; user_id: string; title: string; content: string; note_type: string; source_url: string | null; is_pinned: boolean; created_at: string; updated_at: string };
        Insert: { id?: string; user_id: string; title: string; content: string; note_type?: string; source_url?: string | null; is_pinned?: boolean; created_at?: string; updated_at?: string };
        Update: { id?: string; user_id?: string; title?: string; content?: string; note_type?: string; source_url?: string | null; is_pinned?: boolean; created_at?: string; updated_at?: string };
        Relationships: [{ foreignKeyName: "notes_user_id_fkey"; columns: ["user_id"]; referencedRelation: "users"; referencedColumns: ["id"] }];
      };
      daily_focus: {
        Row: { id: string; user_id: string; focus_date: string; task_id: string | null; custom_text: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; user_id: string; focus_date: string; task_id?: string | null; custom_text?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; user_id?: string; focus_date?: string; task_id?: string | null; custom_text?: string | null; created_at?: string; updated_at?: string };
        Relationships: [
          { foreignKeyName: "daily_focus_task_id_fkey"; columns: ["task_id"]; referencedRelation: "tasks"; referencedColumns: ["id"] },
          { foreignKeyName: "daily_focus_user_id_fkey"; columns: ["user_id"]; referencedRelation: "users"; referencedColumns: ["id"] },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type Goal = Database["public"]["Tables"]["goals"]["Row"];
export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type DailyFocus = Database["public"]["Tables"]["daily_focus"]["Row"];
