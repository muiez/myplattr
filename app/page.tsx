import { Plus, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import RecipeCard from "@/components/RecipeCard";

// Fallback mock feed shown when the DB has no published recipes yet (demo mode)
const mockRecipes = [
  {
    id: "mock-1",
    title: "Mediterranean Chicken with Sun-Dried Tomatoes",
    description: "A nutritious and colorful bowl packed with Mediterranean flavors, perfect for meal prep or a quick dinner.",
    thumbnail_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=480&fit=crop",
    difficulty: "Easy",
    prep_time_minutes: 25,
    serves: 4,
    rating: 4.8,
    likes_count: 342,
    comments_count: 44,
    saves_count: 128,
    profiles: { full_name: "Sarah Chen", username: "sarahcooks", avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face" },
    recipe_tags: [{ tag: "Mediterranean" }, { tag: "Chicken" }, { tag: "Healthy" }],
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "mock-2",
    title: "Authentic Homemade Gnocchi",
    description: "Light, pillowy gnocchi made from scratch — just potatoes, flour, and love. Serve with your favorite sauce.",
    thumbnail_url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=480&fit=crop",
    difficulty: "Medium",
    prep_time_minutes: 40,
    serves: 6,
    rating: 4.9,
    likes_count: 891,
    comments_count: 112,
    saves_count: 445,
    profiles: { full_name: "Marcus Rivera", username: "marcuseats", avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face" },
    recipe_tags: [{ tag: "Italian" }, { tag: "Pasta" }, { tag: "Vegetarian" }],
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: "mock-3",
    title: "Vegan Buddha Bowl with Tahini Dressing",
    description: "A rainbow of roasted veggies, crispy chickpeas, and creamy tahini — nourishing and absolutely stunning.",
    thumbnail_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=480&fit=crop",
    difficulty: "Easy",
    prep_time_minutes: 30,
    serves: 2,
    rating: 4.7,
    likes_count: 567,
    comments_count: 78,
    saves_count: 312,
    profiles: { full_name: "Aisha Patel", username: "aishaplate", avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face" },
    recipe_tags: [{ tag: "Vegan" }, { tag: "Bowl" }, { tag: "Gluten-Free" }],
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
];

const suggestedCreators = [
  { name: "James Wok", handle: "@jameswok", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face", recipes: 127 },
  { name: "Lily Bakes", handle: "@lilybakes", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face", recipes: 84 },
  { name: "Chef Marco", handle: "@chefmarco", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face", recipes: 203 },
];


export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: dbRecipes }, { data: likedIds }, { data: savedIds }] = await Promise.all([
    supabase
      .from("recipes")
      .select(`
        id, title, description, thumbnail_url, difficulty,
        prep_time_minutes, serves, rating, likes_count, comments_count, saves_count,
        created_at,
        profiles(full_name, username, avatar_url),
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

  const likedSet = new Set((likedIds ?? []).map((r: { recipe_id: string }) => r.recipe_id));
  const savedSet = new Set((savedIds ?? []).map((r: { recipe_id: string }) => r.recipe_id));

  const feed = (dbRecipes && dbRecipes.length > 0 ? dbRecipes : mockRecipes) as typeof mockRecipes;

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
            <p className="text-sm font-semibold text-[oklch(0.28_0.09_145)]">AI Picks for You</p>
            <p className="text-xs text-[oklch(0.42_0.07_145)] mt-0.5">Based on your love of Italian cuisine — 3 new recipes today</p>
          </div>
          <Link href="/discover" className="ml-auto text-xs font-semibold text-[oklch(0.38_0.11_145)] hover:underline shrink-0">
            View all
          </Link>
        </div>

        <div className="space-y-6">
          {feed.map((r) => {
            const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
            const tags = r.recipe_tags?.map((t: { tag: string }) => t.tag) ?? [];
            const authorName = profile?.full_name || profile?.username || "Chef";
            return (
              <RecipeCard
                key={r.id}
                id={r.id}
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
              />
            );
          })}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-72 shrink-0 px-4 py-6 hidden xl:block">
        <div className="bg-white dark:bg-[oklch(0.17_0.010_145)] rounded-2xl border border-border p-4 mb-4">
          <h3 className="font-semibold text-sm text-foreground mb-3">Suggested Creators</h3>
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
