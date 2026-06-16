export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          bio: string | null;
          avatar_url: string | null;
          cover_url: string | null;
          location: string | null;
          website: string | null;
          xp_points: number;
          streak: number;
          is_verified: boolean;
          plan: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username?: string;
          full_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          cover_url?: string | null;
          location?: string | null;
          website?: string | null;
          xp_points?: number;
          streak?: number;
          is_verified?: boolean;
          plan?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          cover_url?: string | null;
          location?: string | null;
          website?: string | null;
          xp_points?: number;
          streak?: number;
          is_verified?: boolean;
          plan?: string;
        };
        Relationships: [];
      };
      recipes: {
        Row: {
          id: string;
          author_id: string;
          title: string;
          description: string | null;
          category: string | null;
          cuisine_type: string | null;
          prep_time_minutes: number | null;
          serves: number | null;
          difficulty: "Easy" | "Medium" | "Advanced" | null;
          is_published: boolean;
          is_ai_generated: boolean;
          thumbnail_url: string | null;
          video_url: string | null;
          likes_count: number;
          saves_count: number;
          comments_count: number;
          rating: number;
          slug: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          title: string;
          description?: string | null;
          category?: string | null;
          cuisine_type?: string | null;
          prep_time_minutes?: number | null;
          serves?: number | null;
          difficulty?: "Easy" | "Medium" | "Advanced" | null;
          is_published?: boolean;
          is_ai_generated?: boolean;
          thumbnail_url?: string | null;
          video_url?: string | null;
        };
        Update: {
          author_id?: string;
          title?: string;
          description?: string | null;
          category?: string | null;
          cuisine_type?: string | null;
          prep_time_minutes?: number | null;
          serves?: number | null;
          difficulty?: "Easy" | "Medium" | "Advanced" | null;
          is_published?: boolean;
          is_ai_generated?: boolean;
          thumbnail_url?: string | null;
          video_url?: string | null;
          likes_count?: number;
          saves_count?: number;
          comments_count?: number;
          rating?: number;
        };
        Relationships: [
          {
            foreignKeyName: "recipes_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      ingredients: {
        Row: {
          id: string;
          recipe_id: string;
          name: string;
          amount: string | null;
          unit: string | null;
          notes: string | null;
          sort_order: number;
        };
        Insert: {
          recipe_id: string;
          name: string;
          amount?: string | null;
          unit?: string | null;
          notes?: string | null;
          sort_order?: number;
        };
        Update: {
          recipe_id?: string;
          name?: string;
          amount?: string | null;
          unit?: string | null;
          notes?: string | null;
          sort_order?: number;
        };
        Relationships: [];
      };
      instructions: {
        Row: {
          id: string;
          recipe_id: string;
          step_number: number;
          text: string;
        };
        Insert: {
          recipe_id: string;
          step_number: number;
          text: string;
        };
        Update: {
          recipe_id?: string;
          step_number?: number;
          text?: string;
        };
        Relationships: [];
      };
      recipe_likes: {
        Row: { recipe_id: string; user_id: string; created_at: string };
        Insert: { recipe_id: string; user_id: string };
        Update: Record<string, never>;
        Relationships: [];
      };
      recipe_saves: {
        Row: { recipe_id: string; user_id: string; created_at: string };
        Insert: { recipe_id: string; user_id: string };
        Update: Record<string, never>;
        Relationships: [];
      };
      recipe_tags: {
        Row: { recipe_id: string; tag: string };
        Insert: { recipe_id: string; tag: string };
        Update: Record<string, never>;
        Relationships: [];
      };
      recipe_comments: {
        Row: { id: string; recipe_id: string; user_id: string; content: string; created_at: string };
        Insert: { recipe_id: string; user_id: string; content: string };
        Update: Record<string, never>;
        Relationships: [];
      };
      community_members: {
        Row: { community_id: string; user_id: string; joined_at: string };
        Insert: { community_id: string; user_id: string };
        Update: Record<string, never>;
        Relationships: [];
      };
      communities: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          category: string | null;
          cover_url: string | null;
          created_by: string | null;
          is_verified: boolean;
          members_count: number;
          created_at: string;
        };
        Insert: {
          name: string;
          slug: string;
          description?: string | null;
          category?: string | null;
          cover_url?: string | null;
          created_by?: string | null;
          is_verified?: boolean;
        };
        Update: {
          name?: string;
          slug?: string;
          description?: string | null;
          category?: string | null;
          cover_url?: string | null;
          created_by?: string | null;
          is_verified?: boolean;
          members_count?: number;
        };
        Relationships: [];
      };
      meal_plans: {
        Row: { id: string; user_id: string; title: string; created_at: string };
        Insert: { user_id: string; title?: string };
        Update: { user_id?: string; title?: string };
        Relationships: [];
      };
      meal_plan_items: {
        Row: {
          id: string;
          meal_plan_id: string;
          recipe_id: string | null;
          recipe_title: string | null;
          meal_type: "Breakfast" | "Snack" | "Lunch" | "Dinner" | null;
          planned_date: string | null;
          calories: number | null;
          is_checked: boolean;
          sort_order: number;
        };
        Insert: {
          meal_plan_id: string;
          recipe_id?: string | null;
          recipe_title?: string | null;
          meal_type?: "Breakfast" | "Snack" | "Lunch" | "Dinner" | null;
          planned_date?: string | null;
          calories?: number | null;
          is_checked?: boolean;
          sort_order?: number;
        };
        Update: {
          meal_plan_id?: string;
          recipe_id?: string | null;
          recipe_title?: string | null;
          meal_type?: "Breakfast" | "Snack" | "Lunch" | "Dinner" | null;
          planned_date?: string | null;
          calories?: number | null;
          is_checked?: boolean;
          sort_order?: number;
        };
        Relationships: [];
      };
      pantry_items: {
        Row: { id: string; user_id: string; name: string; amount: string | null; unit: string | null; tag: string | null; created_at: string };
        Insert: { user_id: string; name: string; amount?: string | null; unit?: string | null; tag?: string | null };
        Update: { user_id?: string; name?: string; amount?: string | null; unit?: string | null; tag?: string | null };
        Relationships: [];
      };
      shopping_list: {
        Row: { id: string; user_id: string; name: string; qty: string | null; tags: string[] | null; is_done: boolean; created_at: string };
        Insert: { user_id: string; name: string; qty?: string | null; tags?: string[] | null; is_done?: boolean };
        Update: { user_id?: string; name?: string; qty?: string | null; tags?: string[] | null; is_done?: boolean };
        Relationships: [];
      };
      challenges: {
        Row: { id: string; title: string; description: string | null; reward: string | null; difficulty: string | null; total_spots: number | null; ends_at: string | null; is_exclusive: boolean; created_at: string };
        Insert: { title: string; description?: string | null; reward?: string | null; difficulty?: string | null; total_spots?: number | null; ends_at?: string | null; is_exclusive?: boolean };
        Update: { title?: string; description?: string | null; reward?: string | null; difficulty?: string | null; total_spots?: number | null; ends_at?: string | null; is_exclusive?: boolean };
        Relationships: [];
      };
      challenge_participants: {
        Row: { challenge_id: string; user_id: string; progress: number; joined_at: string };
        Insert: { challenge_id: string; user_id: string; progress?: number };
        Update: { challenge_id?: string; user_id?: string; progress?: number };
        Relationships: [];
      };
      follows: {
        Row: { follower_id: string; following_id: string; created_at: string };
        Insert: { follower_id: string; following_id: string };
        Update: Record<string, never>;
        Relationships: [];
      };
      collections: {
        Row: { id: string; user_id: string; title: string; description: string | null; cover_url: string | null; is_public: boolean; created_at: string };
        Insert: { user_id: string; title: string; description?: string | null; cover_url?: string | null; is_public?: boolean };
        Update: { user_id?: string; title?: string; description?: string | null; cover_url?: string | null; is_public?: boolean };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Recipe = Database["public"]["Tables"]["recipes"]["Row"];
export type Ingredient = Database["public"]["Tables"]["ingredients"]["Row"];
export type Instruction = Database["public"]["Tables"]["instructions"]["Row"];
export type Community = Database["public"]["Tables"]["communities"]["Row"];
export type MealPlan = Database["public"]["Tables"]["meal_plans"]["Row"];
export type MealPlanItem = Database["public"]["Tables"]["meal_plan_items"]["Row"];
export type Challenge = Database["public"]["Tables"]["challenges"]["Row"];
