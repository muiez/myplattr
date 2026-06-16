"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Sparkles, TrendingUp, Heart, Clock, Filter, Star, Bookmark } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

const categories = ["All", "Italian", "Mediterranean", "Vegan", "Vegetarian", "Quick & Easy", "Meal Prep", "Keto", "Breakfast", "Desserts", "Comfort Food"];

type Recipe = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  difficulty: string | null;
  prep_time_minutes: number | null;
  rating: number;
  likes_count: number;
  saves_count: number;
  profiles: { full_name: string | null; username: string | null } | null;
  recipe_tags: { tag: string }[];
};

function RecipeGrid({ recipes }: { recipes: Recipe[] }) {
  if (recipes.length === 0) {
    return (
      <div className="col-span-3 text-center py-12 text-muted-foreground text-sm">No recipes found.</div>
    );
  }
  return (
    <>
      {recipes.map((r) => (
        <Link key={r.id} href={`/recipe/${r.slug ?? r.id}`} className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
          {r.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={r.thumbnail_url} alt={r.title} className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-36 bg-gradient-to-br from-[oklch(0.88_0.06_145)] to-[oklch(0.75_0.09_145)] flex items-center justify-center">
              <span className="text-3xl">🍽️</span>
            </div>
          )}
          <div className="p-3">
            <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2">{r.title}</p>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Clock size={11} />{r.prep_time_minutes ?? "—"} min</span>
              <span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" />{Number(r.rating).toFixed(1)}</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Heart size={11} />{r.likes_count.toLocaleString()}</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Bookmark size={11} />{r.saves_count.toLocaleString()}</span>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [trending, setTrending] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecipes = useCallback(async (q: string, cat: string) => {
    setLoading(true);
    const supabase = createClient();
    let qb = supabase
      .from("recipes")
      .select("id, slug, title, description, thumbnail_url, difficulty, prep_time_minutes, rating, likes_count, saves_count, profiles!author_id(full_name, username), recipe_tags(tag)")
      .eq("is_published", true);

    if (q) qb = qb.ilike("title", `%${q}%`);
    if (cat !== "All") {
      // filter by tag via a subquery workaround: use textSearch or a join
      qb = qb.eq("cuisine_type", cat);
    }

    const { data } = await qb.order("created_at", { ascending: false }).limit(12);
    setRecipes((data as Recipe[]) ?? []);
    setLoading(false);
  }, []);

  const fetchTrending = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("recipes")
      .select("id, slug, title, description, thumbnail_url, difficulty, prep_time_minutes, rating, likes_count, saves_count, profiles!author_id(full_name, username), recipe_tags(tag)")
      .eq("is_published", true)
      .order("likes_count", { ascending: false })
      .limit(9);
    setTrending((data as Recipe[]) ?? []);
  }, []);

  useEffect(() => {
    fetchRecipes(query, activeCategory);
  }, [query, activeCategory, fetchRecipes]);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  function handleSearch() {
    setQuery(inputValue);
  }

  return (
    <div className="px-6 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Discover</h1>
          <p className="text-sm text-muted-foreground">Find new recipes, creators, and culinary inspiration</p>
        </div>
        <button className="flex items-center gap-2 text-sm text-muted-foreground border border-border px-3 py-2 rounded-lg hover:bg-accent transition-colors">
          <Filter size={15} /> Filters
        </button>
      </div>

      {/* Search */}
      <div className="relative mt-5 mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search recipes, ingredients, creators..."
          className="w-full pl-10 pr-28 py-2.5 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <Tabs defaultValue="recipes">
        <TabsList className="mb-6 bg-white border border-border rounded-lg p-1 h-auto gap-1 w-auto inline-flex">
          {[
            { value: "recipes", label: "🍽 Recipes" },
            { value: "trending", label: "📈 Trending" },
            { value: "ai-picks", label: "✨ AI Picks" },
          ].map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="text-xs px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="recipes">
          {loading ? (
            <div className="grid grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-border rounded-xl overflow-hidden animate-pulse">
                  <div className="w-full h-36 bg-muted" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <RecipeGrid recipes={recipes} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="trending">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-amber-500" />
            <h2 className="text-base font-bold text-foreground">Trending Recipes</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <RecipeGrid recipes={trending} />
          </div>
        </TabsContent>

        <TabsContent value="ai-picks">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            <h2 className="text-base font-bold text-foreground">AI Picks for You</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <RecipeGrid recipes={recipes.slice(0, 6)} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
