"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Clock, Users, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

interface RecipeCardProps {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  difficulty: string | null;
  prep_time_minutes: number | null;
  serves: number | null;
  rating: number;
  likes_count: number;
  comments_count: number;
  saves_count: number;
  created_at: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string | null;
  tags: string[];
  isLiked: boolean;
  isSaved: boolean;
  userId: string | null;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "Yesterday" : `${d}d ago`;
}

export default function RecipeCard({
  id, title, description, thumbnail_url, difficulty,
  prep_time_minutes, serves, rating, likes_count, comments_count, saves_count,
  created_at, authorName, authorHandle, authorAvatar, tags, isLiked, isSaved, userId,
}: RecipeCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);
  const [likes, setLikes] = useState(likes_count);
  const [saves, setSaves] = useState(saves_count);
  const [likeLoading, setLikeLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const isMock = id.startsWith("mock-");

  async function handleLike() {
    if (!userId || isMock || likeLoading) return;
    setLikeLoading(true);
    const supabase = createClient();
    if (liked) {
      await supabase.from("recipe_likes").delete().match({ recipe_id: id, user_id: userId });
      await supabase.from("recipes").update({ likes_count: Math.max(0, likes - 1) }).eq("id", id);
      setLiked(false);
      setLikes((n) => Math.max(0, n - 1));
    } else {
      await supabase.from("recipe_likes").insert({ recipe_id: id, user_id: userId });
      await supabase.from("recipes").update({ likes_count: likes + 1 }).eq("id", id);
      setLiked(true);
      setLikes((n) => n + 1);
    }
    setLikeLoading(false);
  }

  async function handleSave() {
    if (!userId || isMock || saveLoading) return;
    setSaveLoading(true);
    const supabase = createClient();
    if (saved) {
      await supabase.from("recipe_saves").delete().match({ recipe_id: id, user_id: userId });
      await supabase.from("recipes").update({ saves_count: Math.max(0, saves - 1) }).eq("id", id);
      setSaved(false);
      setSaves((n) => Math.max(0, n - 1));
    } else {
      await supabase.from("recipe_saves").insert({ recipe_id: id, user_id: userId });
      await supabase.from("recipes").update({ saves_count: saves + 1 }).eq("id", id);
      setSaved(true);
      setSaves((n) => n + 1);
    }
    setSaveLoading(false);
  }

  return (
    <article className="bg-white dark:bg-[oklch(0.17_0.010_145)] rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={authorAvatar ?? undefined} />
            <AvatarFallback>{authorName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-foreground">{authorName}</p>
            <p className="text-xs text-muted-foreground">{authorHandle} · {timeAgo(created_at)}</p>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {thumbnail_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={thumbnail_url} alt={title} className="w-full h-52 object-cover" />
      ) : (
        <div className="w-full h-52 bg-gradient-to-br from-[oklch(0.88_0.06_145)] to-[oklch(0.75_0.09_145)] flex items-center justify-center">
          <span className="text-5xl">🍽️</span>
        </div>
      )}

      <div className="px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-semibold text-foreground text-base leading-snug">{title}</h2>
          {difficulty && (
            <Badge variant="secondary" className="shrink-0 text-[10px] bg-accent text-accent-foreground border-0">{difficulty}</Badge>
          )}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{description}</p>
        )}
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          {prep_time_minutes && <span className="flex items-center gap-1"><Clock size={12} />{prep_time_minutes} min</span>}
          {serves && <span className="flex items-center gap-1"><Users size={12} />Serves {serves}</span>}
          {rating > 0 && <span className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" />{Number(rating).toFixed(1)}</span>}
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
          <button
            onClick={handleLike}
            disabled={!userId || isMock}
            className={`flex items-center gap-1.5 text-sm transition-colors disabled:opacity-50 ${
              liked ? "text-rose-500" : "text-muted-foreground hover:text-rose-500"
            }`}
          >
            <Heart size={18} className={liked ? "fill-rose-500" : ""} />
            <span>{likes}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <MessageCircle size={18} /><span>{comments_count}</span>
          </button>
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <Share2 size={18} />
          </button>
        </div>
        <button
          onClick={handleSave}
          disabled={!userId || isMock}
          className={`flex items-center gap-1.5 text-sm transition-colors disabled:opacity-50 ${
            saved ? "text-primary" : "text-muted-foreground hover:text-primary"
          }`}
        >
          <Bookmark size={18} className={saved ? "fill-primary" : ""} />
          <span>{saves}</span>
        </button>
      </div>
    </article>
  );
}
