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
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
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
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["recipes"]["Row"], "id" | "created_at" | "updated_at" | "likes_count" | "saves_count" | "comments_count" | "rating">;
        Update: Partial<Database["public"]["Tables"]["recipes"]["Insert"]>;
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
        Insert: Omit<Database["public"]["Tables"]["ingredients"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["ingredients"]["Insert"]>;
      };
      instructions: {
        Row: {
          id: string;
          recipe_id: string;
          step_number: number;
          text: string;
        };
        Insert: Omit<Database["public"]["Tables"]["instructions"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["instructions"]["Insert"]>;
      };
      recipe_likes: {
        Row: { recipe_id: string; user_id: string; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["recipe_likes"]["Row"], "created_at">;
        Update: never;
      };
      recipe_saves: {
        Row: { recipe_id: string; user_id: string; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["recipe_saves"]["Row"], "created_at">;
        Update: never;
      };
      recipe_comments: {
        Row: { id: string; recipe_id: string; user_id: string; content: string; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["recipe_comments"]["Row"], "id" | "created_at">;
        Update: never;
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
        Insert: Omit<Database["public"]["Tables"]["communities"]["Row"], "id" | "created_at" | "members_count">;
        Update: Partial<Database["public"]["Tables"]["communities"]["Insert"]>;
      };
      meal_plans: {
        Row: { id: string; user_id: string; title: string; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["meal_plans"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["meal_plans"]["Insert"]>;
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
        Insert: Omit<Database["public"]["Tables"]["meal_plan_items"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["meal_plan_items"]["Insert"]>;
      };
      pantry_items: {
        Row: { id: string; user_id: string; name: string; amount: string | null; unit: string | null; tag: string | null; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["pantry_items"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["pantry_items"]["Insert"]>;
      };
      shopping_list: {
        Row: { id: string; user_id: string; name: string; qty: string | null; tags: string[] | null; is_done: boolean; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["shopping_list"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["shopping_list"]["Insert"]>;
      };
      challenges: {
        Row: { id: string; title: string; description: string | null; reward: string | null; difficulty: string | null; total_spots: number | null; ends_at: string | null; is_exclusive: boolean; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["challenges"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["challenges"]["Insert"]>;
      };
      challenge_participants: {
        Row: { challenge_id: string; user_id: string; progress: number; joined_at: string };
        Insert: Omit<Database["public"]["Tables"]["challenge_participants"]["Row"], "joined_at">;
        Update: Partial<Database["public"]["Tables"]["challenge_participants"]["Insert"]>;
      };
      follows: {
        Row: { follower_id: string; following_id: string; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["follows"]["Row"], "created_at">;
        Update: never;
      };
      collections: {
        Row: { id: string; user_id: string; title: string; description: string | null; cover_url: string | null; is_public: boolean; created_at: string };
        Insert: Omit<Database["public"]["Tables"]["collections"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["collections"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
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
