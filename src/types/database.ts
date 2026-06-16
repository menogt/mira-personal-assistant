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
          email: string | null;
          display_name: string | null;
          avatar_url: string | null;
          timezone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          category: string;
          priority: string;
          status: string;
          due_at: string | null;
          estimated_minutes: number | null;
          completed_at: string | null;
          goal_id: string | null;
          project_id: string | null;
          module_id: string | null;
          assignment_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          category: string;
          priority: string;
          status?: string;
          due_at?: string | null;
          estimated_minutes?: number | null;
          completed_at?: string | null;
          goal_id?: string | null;
          project_id?: string | null;
          module_id?: string | null;
          assignment_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          category?: string;
          priority?: string;
          status?: string;
          due_at?: string | null;
          estimated_minutes?: number | null;
          completed_at?: string | null;
          goal_id?: string | null;
          project_id?: string | null;
          module_id?: string | null;
          assignment_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          note_type: string;
          source_url: string | null;
          is_pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          note_type?: string;
          source_url?: string | null;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          note_type?: string;
          source_url?: string | null;
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notes_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      daily_focus: {
        Row: {
          id: string;
          user_id: string;
          focus_date: string;
          task_id: string | null;
          custom_text: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          focus_date: string;
          task_id?: string | null;
          custom_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          focus_date?: string;
          task_id?: string | null;
          custom_text?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "daily_focus_task_id_fkey";
            columns: ["task_id"];
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "daily_focus_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      goals: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          reason: string | null;
          category: string;
          status: string;
          progress: number;
          deadline: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          reason?: string | null;
          category: string;
          status?: string;
          progress?: number;
          deadline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          reason?: string | null;
          category?: string;
          status?: string;
          progress?: number;
          deadline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      goal_milestones: {
        Row: {
          id: string;
          user_id: string;
          goal_id: string;
          title: string;
          description: string | null;
          due_date: string | null;
          is_completed: boolean;
          completed_at: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          goal_id: string;
          title: string;
          description?: string | null;
          due_date?: string | null;
          is_completed?: boolean;
          completed_at?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          goal_id?: string;
          title?: string;
          description?: string | null;
          due_date?: string | null;
          is_completed?: boolean;
          completed_at?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "goal_milestones_goal_id_fkey";
            columns: ["goal_id"];
            referencedRelation: "goals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "goal_milestones_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          status: string;
          priority: string;
          progress: number;
          next_action: string | null;
          blocker: string | null;
          github_url: string | null;
          live_url: string | null;
          start_date: string | null;
          target_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          status?: string;
          priority?: string;
          progress?: number;
          next_action?: string | null;
          blocker?: string | null;
          github_url?: string | null;
          live_url?: string | null;
          start_date?: string | null;
          target_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          status?: string;
          priority?: string;
          progress?: number;
          next_action?: string | null;
          blocker?: string | null;
          github_url?: string | null;
          live_url?: string | null;
          start_date?: string | null;
          target_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      project_milestones: {
        Row: {
          id: string;
          user_id: string;
          project_id: string;
          title: string;
          description: string | null;
          due_date: string | null;
          is_completed: boolean;
          completed_at: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          project_id: string;
          title: string;
          description?: string | null;
          due_date?: string | null;
          is_completed?: boolean;
          completed_at?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          project_id?: string;
          title?: string;
          description?: string | null;
          due_date?: string | null;
          is_completed?: boolean;
          completed_at?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_milestones_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_milestones_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      university_modules: {
        Row: {
          id: string;
          user_id: string;
          module_name: string;
          module_code: string | null;
          lecturer: string | null;
          current_topic: string | null;
          confidence_level: number | null;
          status: string;
          color: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_name: string;
          module_code?: string | null;
          lecturer?: string | null;
          current_topic?: string | null;
          confidence_level?: number | null;
          status?: string;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          module_name?: string;
          module_code?: string | null;
          lecturer?: string | null;
          current_topic?: string | null;
          confidence_level?: number | null;
          status?: string;
          color?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "university_modules_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      lectures: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          title: string;
          topic: string | null;
          lecture_date: string;
          start_time: string | null;
          end_time: string | null;
          location: string | null;
          notes: string | null;
          attendance_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id: string;
          title: string;
          topic?: string | null;
          lecture_date: string;
          start_time?: string | null;
          end_time?: string | null;
          location?: string | null;
          notes?: string | null;
          attendance_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          module_id?: string;
          title?: string;
          topic?: string | null;
          lecture_date?: string;
          start_time?: string | null;
          end_time?: string | null;
          location?: string | null;
          notes?: string | null;
          attendance_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lectures_module_id_fkey";
            columns: ["module_id"];
            referencedRelation: "university_modules";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lectures_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      assignments: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          title: string;
          description: string | null;
          status: string;
          priority: string;
          due_at: string | null;
          progress: number;
          submission_url: string | null;
          submitted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id: string;
          title: string;
          description?: string | null;
          status?: string;
          priority?: string;
          due_at?: string | null;
          progress?: number;
          submission_url?: string | null;
          submitted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          module_id?: string;
          title?: string;
          description?: string | null;
          status?: string;
          priority?: string;
          due_at?: string | null;
          progress?: number;
          submission_url?: string | null;
          submitted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assignments_module_id_fkey";
            columns: ["module_id"];
            referencedRelation: "university_modules";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assignments_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      study_sessions: {
        Row: {
          id: string;
          user_id: string;
          module_id: string;
          topic: string;
          duration_minutes: number;
          studied_at: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          module_id: string;
          topic: string;
          duration_minutes: number;
          studied_at?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          module_id?: string;
          topic?: string;
          duration_minutes?: number;
          studied_at?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "study_sessions_module_id_fkey";
            columns: ["module_id"];
            referencedRelation: "university_modules";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "study_sessions_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
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
export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type DailyFocus = Database["public"]["Tables"]["daily_focus"]["Row"];
export type Goal = Database["public"]["Tables"]["goals"]["Row"];
export type GoalMilestone = Database["public"]["Tables"]["goal_milestones"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectMilestone = Database["public"]["Tables"]["project_milestones"]["Row"];
export type UniversityModule = Database["public"]["Tables"]["university_modules"]["Row"];
export type Lecture = Database["public"]["Tables"]["lectures"]["Row"];
export type Assignment = Database["public"]["Tables"]["assignments"]["Row"];
export type StudySession = Database["public"]["Tables"]["study_sessions"]["Row"];
