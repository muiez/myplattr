import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Plus, Sparkles, Star, Clock, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h} hour${h > 1 ? "s" : ""} ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Yesterday";
  return `${d} days ago`;
}

export default async function HomePage() {
  const supabase = await createClient();

  const { data: dbRecipes } = await supabase
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
    .limit(10);

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
            const authorHandle = `@${profile?.username || "chef"}`;

            return (
              <article key={r.id} className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between px-4 pt-4 pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback>{authorName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{authorName}</p>
                      <p className="text-xs text-muted-foreground">{authorHandle} · {timeAgo(r.created_at)}</p>
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                {r.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.thumbnail_url} alt={r.title} className="w-full h-52 object-cover" />
                ) : (
                  <div className="w-full h-52 bg-gradient-to-br from-[oklch(0.88_0.06_145)] to-[oklch(0.75_0.09_145)] flex items-center justify-center">
                    <span className="text-5xl">🍽️</span>
                  </div>
                )}

                <div className="px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold text-foreground text-base leading-snug">{r.title}</h2>
                    {r.difficulty && (
                      <Badge variant="secondary" className="shrink-0 text-[10px] bg-accent text-accent-foreground border-0">{r.difficulty}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{r.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    {r.prep_time_minutes && <span className="flex items-center gap-1"><Clock size={12} />{r.prep_time_minutes} min</span>}
                    {r.serves && <span className="flex items-center gap-1"><Users size={12} />Serves {r.serves}</span>}
                    {r.rating > 0 && <span className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" />{Number(r.rating).toFixed(1)}</span>}
                  </div>
                  {tags.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-[11px] bg-accent text-accent-foreground px-2.5 py-0.5 rounded-full font-medium">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="px-4 pb-4 border-t border-border mt-1 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-rose-500 transition-colors">
                      <Heart size={18} /><span>{r.likes_count}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <MessageCircle size={18} /><span>{r.comments_count}</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Share2 size={18} />
                    </button>
                  </div>
                  <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Bookmark size={18} /><span>{r.saves_count}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-72 shrink-0 px-4 py-6 hidden xl:block">
        <div className="bg-white rounded-2xl border border-border p-4 mb-4">
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
        <div className="bg-white rounded-2xl border border-border p-4">
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
