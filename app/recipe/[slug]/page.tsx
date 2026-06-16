import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Play, Clock, Users, Zap, Star, Heart, MessageCircle, Eye, Bookmark, Repeat2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/server";
import RecipeActions from "./RecipeActions";
import CommentSection from "./CommentSection";

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: recipe } = await supabase
    .from("recipes")
    .select("*, profiles!recipes_author_id_fkey(id, full_name, username, avatar_url, is_verified)")
    .eq("slug", slug)
    .single();

  if (!recipe) notFound();

  const [{ data: likedRow }, { data: savedRow }] = await Promise.all([
    user
      ? supabase.from("recipe_likes").select("recipe_id").eq("recipe_id", recipe.id).eq("user_id", user.id).maybeSingle()
      : Promise.resolve({ data: null }),
    user
      ? supabase.from("recipe_saves").select("recipe_id").eq("recipe_id", recipe.id).eq("user_id", user.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const [{ data: ingredients }, { data: instructions }, { data: tags }, { data: comments }] = await Promise.all([
    supabase.from("ingredients").select("*").eq("recipe_id", recipe.id).order("sort_order"),
    supabase.from("instructions").select("*").eq("recipe_id", recipe.id).order("step_number"),
    supabase.from("recipe_tags").select("tag").eq("recipe_id", recipe.id),
    supabase
      .from("recipe_comments")
      .select("*, profiles(full_name, username, avatar_url)")
      .eq("recipe_id", recipe.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const profile = Array.isArray(recipe.profiles) ? recipe.profiles[0] : recipe.profiles;
  const authorName = profile?.full_name || profile?.username || "Chef";
  const tagList = (tags ?? []).map((t: { tag: string }) => t.tag);

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return "Just now";
    if (h < 24) return `${h} hours ago`;
    const d = Math.floor(h / 24);
    return d === 1 ? "1 day ago" : `${d} days ago`;
  }

  return (
    <div className="max-w-2xl mx-auto px-0 pb-12">
      {/* Header */}
      <div className="flex items-center px-6 pt-6 pb-4 relative">
        <Link href="/" className="absolute left-6 w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors">
          <ChevronLeft size={16} />
        </Link>
        <h1 className="text-xl font-bold text-foreground mx-auto">Recipe</h1>
      </div>

      {/* Hero */}
      <div className="relative w-full h-64 mx-auto overflow-hidden">
        {recipe.thumbnail_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={recipe.thumbnail_url} alt={recipe.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[oklch(0.88_0.06_145)] to-[oklch(0.75_0.09_145)]" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center">
            <Play size={20} className="text-white fill-white ml-0.5" />
          </div>
        </div>
        {/* Title + meta */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
          <h2 className="text-white font-bold text-lg leading-tight mb-2">{recipe.title}</h2>
          <div className="flex items-center gap-4 text-white/80 text-xs">
            {recipe.prep_time_minutes && (
              <span className="flex items-center gap-1"><Clock size={11} />{recipe.prep_time_minutes} mins</span>
            )}
            {recipe.serves && (
              <span className="flex items-center gap-1"><Users size={11} />Serves {recipe.serves} people</span>
            )}
            <span className="flex items-center gap-1"><Zap size={11} />Earn 12 skill points</span>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4 mt-4">
        {/* Author */}
        <div className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
          <Avatar className="h-12 w-12 shrink-0">
            <AvatarImage src={profile?.avatar_url ?? undefined} />
            <AvatarFallback>{authorName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-primary">{authorName}</p>
            <p className="text-xs text-muted-foreground">@{profile?.username}</p>
            <p className="text-xs text-muted-foreground mt-0.5">12.3K followers · {recipe.likes_count} recipes</p>
            {recipe.cuisine_type && (
              <span className="inline-block mt-1 text-[10px] font-semibold bg-accent text-accent-foreground px-2 py-0.5 rounded-full">{recipe.cuisine_type}</span>
            )}
          </div>
          <button className="shrink-0 border border-primary text-primary text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-accent transition-colors">
            Follow
          </button>
        </div>

        {/* Rating + Actions */}
        <RecipeActions
          recipeId={recipe.id}
          userId={user?.id ?? null}
          initialLiked={!!likedRow}
          initialSaved={!!savedRow}
          likesCount={recipe.likes_count}
          commentsCount={recipe.comments_count}
          savesCount={recipe.saves_count}
          rating={recipe.rating}
        />

        {/* Description + tags */}
        <div className="bg-white rounded-2xl border border-border p-4">
          {recipe.description && (
            <p className="text-sm text-muted-foreground mb-3">{recipe.description}</p>
          )}
          {tagList.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tagList.map((tag: string) => (
                <span key={tag} className="text-xs bg-accent text-accent-foreground px-3 py-1 rounded-full font-medium">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Ingredients + Instructions */}
        <div className="grid grid-cols-2 gap-4">
          {/* Ingredients */}
          <div className="bg-white rounded-2xl border border-border p-4">
            <h3 className="font-bold text-sm text-primary mb-3">Ingredients</h3>
            {ingredients && ingredients.length > 0 ? (
              <ul className="space-y-2">
                {ingredients.map((ing) => (
                  <li key={ing.id} className="flex items-start gap-2 text-xs text-foreground">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-foreground shrink-0" />
                    <span>
                      {ing.amount && `${ing.amount} `}{ing.unit && `${ing.unit} `}{ing.name}
                      {ing.notes && <span className="text-muted-foreground">, {ing.notes}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No ingredients listed yet.</p>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-2xl border border-border p-4">
            <h3 className="font-bold text-sm text-primary mb-3">Instructions</h3>
            {instructions && instructions.length > 0 ? (
              <ol className="space-y-3">
                {instructions.map((step) => (
                  <li key={step.id} className="flex items-start gap-2.5">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center mt-0.5">
                      {step.step_number}
                    </span>
                    <p className="text-xs text-foreground leading-relaxed">{step.text}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs text-muted-foreground">No instructions listed yet.</p>
            )}
          </div>
        </div>

        {/* Comments */}
        <CommentSection
          recipeId={recipe.id}
          userId={user?.id ?? null}
          userAvatar={user ? null : null}
          initialComments={((comments ?? []) as unknown as Array<{ id: string; content: string; created_at: string; profiles: { full_name: string | null; username: string | null; avatar_url: string | null } | null }>).map((c) => {
            const p = c.profiles;
            return {
              id: c.id,
              content: c.content,
              created_at: c.created_at,
              authorName: p?.full_name || p?.username || "User",
              authorHandle: p?.username || "user",
              authorAvatar: p?.avatar_url ?? null,
            };
          })}
          totalCount={recipe.comments_count}
        />
      </div>
    </div>
  );
}
