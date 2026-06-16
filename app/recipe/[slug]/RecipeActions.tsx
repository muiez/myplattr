"use client";

import { useState } from "react";
import { Heart, MessageCircle, Eye, Bookmark, Repeat2, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Props {
  recipeId: string;
  userId: string | null;
  initialLiked: boolean;
  initialSaved: boolean;
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  rating: number;
}

export default function RecipeActions({ recipeId, userId, initialLiked, initialSaved, likesCount, commentsCount, savesCount, rating }: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);
  const [likes, setLikes] = useState(likesCount);
  const [saves, setSaves] = useState(savesCount);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  async function handleLike() {
    if (!userId) return;
    const supabase = createClient();
    if (liked) {
      await supabase.from("recipe_likes").delete().match({ recipe_id: recipeId, user_id: userId });
      await supabase.from("recipes").update({ likes_count: Math.max(0, likes - 1) }).eq("id", recipeId);
      setLiked(false);
      setLikes((n) => Math.max(0, n - 1));
    } else {
      await supabase.from("recipe_likes").insert({ recipe_id: recipeId, user_id: userId });
      await supabase.from("recipes").update({ likes_count: likes + 1 }).eq("id", recipeId);
      setLiked(true);
      setLikes((n) => n + 1);
    }
  }

  async function handleSave() {
    if (!userId) return;
    const supabase = createClient();
    if (saved) {
      await supabase.from("recipe_saves").delete().match({ recipe_id: recipeId, user_id: userId });
      await supabase.from("recipes").update({ saves_count: Math.max(0, saves - 1) }).eq("id", recipeId);
      setSaved(false);
      setSaves((n) => Math.max(0, n - 1));
    } else {
      await supabase.from("recipe_saves").insert({ recipe_id: recipeId, user_id: userId });
      await supabase.from("recipes").update({ saves_count: saves + 1 }).eq("id", recipeId);
      setSaved(true);
      setSaves((n) => n + 1);
    }
  }

  const displayRating = rating > 0 ? Number(rating).toFixed(1) : "—";

  return (
    <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
      {/* Rating display */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={16}
              className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}
            />
          ))}
        </div>
        <span className="font-bold text-sm text-foreground">{displayRating}</span>
        <span className="text-xs text-muted-foreground">(2847 reviews)</span>
      </div>

      {/* User rating */}
      <div>
        <p className="text-xs text-muted-foreground mb-1.5">Rate this recipe:</p>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={18}
              className={`cursor-pointer transition-colors ${s <= (hoverRating || userRating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30 hover:text-amber-300"}`}
              onMouseEnter={() => setHoverRating(s)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setUserRating(s)}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Action row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? "text-rose-500" : "text-muted-foreground hover:text-rose-500"}`}
          >
            <Heart size={16} className={liked ? "fill-rose-500" : ""} />
            <span>{likes.toLocaleString()}</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
            <MessageCircle size={16} />
            <span>{commentsCount.toLocaleString()}</span>
          </button>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Eye size={16} />
            <span>3,421</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 text-xs transition-colors ${saved ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
          >
            <Bookmark size={16} className={saved ? "fill-primary" : ""} />
            <span>Save</span>
          </button>
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
            <Repeat2 size={16} />
            <span>Repost</span>
          </button>
        </div>
      </div>
    </div>
  );
}
