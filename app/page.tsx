import { Plus, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import RecipeCard from "@/components/RecipeCard";
import type { Recipe } from "@/lib/supabase/types";

type FeedRecipe = Recipe & {
  author_id: string;
  profiles: { full_name: string | null; username: string | null; avatar_url: string | null } | null;
  recipe_tags: { tag: string }[];
};


const suggestedCreators = [
  { name: "James Wok", handle: "@jameswok", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face", recipes: 127 },
  { name: "Lily Bakes", handle: "@lilybakes", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face", recipes: 84 },
  { name: "Chef Marco", handle: "@chefmarco", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face", recipes: 203 },
];


export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: dbRecipes, error: recipesError }, { data: likedIds }, { data: savedIds }] = await Promise.all([
    supabase
      .from("recipes")
      .select(`
        id, slug, author_id, title, description, thumbnail_url, difficulty,
        prep_time_minutes, serves, rating, likes_count, comments_count, saves_count,
        created_at,
        profiles!recipes_author_id_fkey(full_name, username, avatar_url),
        recipe_tags(tag)
      `)
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .limit(10),
    user
      ? supabase.from("recipe_likes").select("recipe_id").eq("user_id", user.id)
      : Promise.resolve({ data: [] }),
    user
      ? supabase.from("recipe_saves").select("recipe_id").eq("user_id", user.id)
      : Promise.resolve({ data: [] }),
  ]);

  if (recipesError) console.error("[HomePage] recipes query error:", recipesError);
  const likedSet = new Set((likedIds ?? []).map((r: { recipe_id: string }) => r.recipe_id));
  const savedSet = new Set((savedIds ?? []).map((r: { recipe_id: string }) => r.recipe_id));

  const feed = (dbRecipes ?? []) as unknown as FeedRecipe[];

  return (
    <div className="flex min-h-full">
      {/* Feed */}
      <div className="flex-1 max-w-2xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Home</h1>
            <p className="text-sm text-muted-foreground">Your personalized recipe feed</p>
          </div>
          <Link
            href="/create-recipe"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus size={16} /> Create Recipe
          </Link>
        </div>

        {/* AI Banner */}
        <div className="bg-[oklch(0.93_0.06_145)] border border-[oklch(0.85_0.07_145)] rounded-xl p-4 mb-6 flex items-center gap-3">
          <div className="bg-[oklch(0.38_0.11_145)] text-white p-2 rounded-lg shrink-0">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-[oklch(0.28_0.09_145)]">Picks for You</p>
            <p className="text-xs text-[oklch(0.42_0.07_145)] mt-0.5">Based on your love of Italian cuisine — 3 new recipes today</p>
          </div>
          <Link href="/discover" className="ml-auto text-xs font-semibold text-[oklch(0.38_0.11_145)] hover:underline shrink-0">
            View all
          </Link>
        </div>

        <div className="space-y-6">
          {feed.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-5xl mb-4">🍽️</div>
              <h3 className="font-semibold text-foreground mb-1">No recipes yet</h3>
              <p className="text-sm text-muted-foreground mb-5 max-w-xs">Be the first to share a recipe with the MyPlattr community.</p>
              <Link href="/create-recipe" className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                <Plus size={15} /> Create Recipe
              </Link>
            </div>
          )}
          {feed.map((r) => {
            const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
            const tags = r.recipe_tags?.map((t: { tag: string }) => t.tag) ?? [];
            const authorName = profile?.full_name || profile?.username || "Chef";
            return (
              <RecipeCard
                key={r.id}
                id={r.id}
                slug={r.slug ?? r.id}
                title={r.title}
                description={r.description}
                thumbnail_url={r.thumbnail_url}
                difficulty={r.difficulty}
                prep_time_minutes={r.prep_time_minutes}
                serves={r.serves}
                rating={r.rating}
                likes_count={r.likes_count}
                comments_count={r.comments_count}
                saves_count={r.saves_count}
                created_at={r.created_at}
                authorName={authorName}
                authorHandle={`@${profile?.username || "chef"}`}
                authorAvatar={profile?.avatar_url ?? null}
                tags={tags}
                isLiked={likedSet.has(r.id)}
                isSaved={savedSet.has(r.id)}
                userId={user?.id ?? null}
                authorId={r.author_id}
              />
            );
          })}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-72 shrink-0 px-4 py-6 hidden xl:block">
        <div className="bg-white dark:bg-[oklch(0.17_0.010_145)] rounded-2xl border border-border p-4 mb-4">
          <h3 className="font-semibold text-sm text-foreground mb-3">Suggested</h3>
          <div className="space-y-3">
            {suggestedCreators.map((c) => (
              <div key={c.handle} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={c.avatar} />
                    <AvatarFallback>{c.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">{c.recipes} recipes</p>
                  </div>
                </div>
                <button className="text-xs font-semibold text-primary border border-primary/30 px-2.5 py-1 rounded-lg hover:bg-accent transition-colors">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-[oklch(0.17_0.010_145)] rounded-2xl border border-border p-4">
          <h3 className="font-semibold text-sm text-foreground mb-3">Trending Tags</h3>
          <div className="flex flex-wrap gap-2">
            {["#ViralTikTokPasta", "#MealPrep", "#30MinuteMeals", "#DairyFree", "#SummerRecipes", "#BudgetCooking"].map((tag) => (
              <span key={tag} className="text-[11px] bg-accent text-primary px-2.5 py-1 rounded-full font-medium cursor-pointer hover:bg-accent/70 transition-colors">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
