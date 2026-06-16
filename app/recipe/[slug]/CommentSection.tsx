"use client";

import { useState } from "react";
import { Sparkles, Heart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string | null;
}

interface Props {
  recipeId: string;
  userId: string | null;
  userAvatar: string | null;
  initialComments: Comment[];
  totalCount: number;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "Just now";
  if (h < 24) return `${h} hours ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "1 day ago" : `${d} days ago`;
}

export default function CommentSection({ recipeId, userId, userAvatar, initialComments, totalCount }: Props) {
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [count, setCount] = useState(totalCount);

  async function handlePost() {
    if (!text.trim() || !userId || posting) return;
    setPosting(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("recipe_comments")
      .insert({ recipe_id: recipeId, user_id: userId, content: text.trim() })
      .select("id, content, created_at")
      .single();
    if (data) {
      setComments((prev) => [{
        id: data.id,
        content: data.content,
        created_at: data.created_at,
        authorName: "You",
        authorHandle: "you",
        authorAvatar: userAvatar,
      }, ...prev]);
      setCount((n) => n + 1);
      setText("");
    }
    setPosting(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-4">
      <h3 className="font-bold text-sm text-foreground mb-4">Comments ({count.toLocaleString()})</h3>

      {/* Input */}
      <div className="flex gap-3 mb-5">
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarImage src={userAvatar ?? undefined} />
          <AvatarFallback>Y</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full text-sm border border-border rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground"
          />
          <button
            onClick={handlePost}
            disabled={!text.trim() || !userId || posting}
            className="mt-2 flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3.5 py-1.5 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Sparkles size={12} />
            Post
          </button>
        </div>
      </div>

      {/* Comment list */}
      <div className="space-y-5">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={c.authorAvatar ?? undefined} />
              <AvatarFallback>{c.authorName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-semibold text-primary">{c.authorName}</span>
                <span className="text-[10px] text-muted-foreground">{timeAgo(c.created_at)}</span>
              </div>
              <p className="text-xs text-foreground leading-relaxed">{c.content}</p>
              <button className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground hover:text-rose-500 transition-colors">
                <Heart size={11} />
                <span>12</span>
              </button>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}
