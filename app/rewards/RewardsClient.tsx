"use client";

import { useState } from "react";
import { Trophy, Clock, Zap, Star, DollarSign, Flame, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

type Challenge = {
  id: string;
  title: string;
  description: string | null;
  reward: string | null;
  difficulty: string | null;
  total_spots: number | null;
  ends_at: string | null;
  is_exclusive: boolean;
};

interface Props {
  challenges: Challenge[];
  joinedIds: string[];
  userId: string | null;
  xpPoints: number;
  streak: number;
}

const difficultyColor: Record<string, string> = {
  Expert: "text-red-500",
  Pro: "text-purple-500",
  Intermediate: "text-amber-500",
  Beginner: "text-green-500",
};

const difficultyIcon: Record<string, string> = {
  Expert: "🏆", Pro: "🌟", Intermediate: "👨‍🍳", Beginner: "📸",
};

const achievements = [
  { title: "First Recipe", desc: "Published your first recipe", icon: "🎉", earned: true },
  { title: "Popular Creator", desc: "Reached 1,000 followers", icon: "⭐", earned: true },
  { title: "Recipe Streak", desc: "Posted 7 days in a row", icon: "🔥", earned: true },
  { title: "Top Chef", desc: "Earned Top Chef badge", icon: "👨‍🍳", earned: false },
  { title: "Community Builder", desc: "Created your own community", icon: "🏘", earned: false },
  { title: "Master Baker", desc: "50 baking recipes posted", icon: "🧁", earned: false },
];

const dailyGoals = [
  { title: "Post a Recipe Today", xp: 50, icon: "📝" },
  { title: "Comment on 3 Recipes", xp: 20, icon: "💬" },
  { title: "Save 5 Recipes", xp: 15, icon: "🔖" },
  { title: "Follow 2 New Creators", xp: 10, icon: "👥" },
];

function timeLeft(endsAt: string | null) {
  if (!endsAt) return "—";
  const diff = new Date(endsAt).getTime() - Date.now();
  if (diff < 0) return "Ended";
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  return `${days} day${days === 1 ? "" : "s"}`;
}

export default function RewardsClient({ challenges, joinedIds: initial, userId, xpPoints, streak }: Props) {
  const [joinedIds, setJoinedIds] = useState(new Set(initial));
  const [completedGoals, setCompletedGoals] = useState<Set<string>>(new Set());

  const xpLevel = Math.floor(xpPoints / 1000) + 1;
  const xpToNext = 1000 - (xpPoints % 1000);
  const xpProgress = ((xpPoints % 1000) / 1000) * 100;

  async function handleJoin(c: Challenge) {
    if (!userId) return;
    const supabase = createClient();
    const isJoined = joinedIds.has(c.id);
    if (isJoined) {
      await supabase.from("challenge_participants").delete().match({ challenge_id: c.id, user_id: userId });
      setJoinedIds((prev) => { const next = new Set(prev); next.delete(c.id); return next; });
    } else {
      await supabase.from("challenge_participants").insert({ challenge_id: c.id, user_id: userId, progress: 0 });
      setJoinedIds((prev) => new Set([...prev, c.id]));
    }
  }

  const closing = (endsAt: string | null) => endsAt && new Date(endsAt).getTime() - Date.now() < 86400000 * 3;

  return (
    <div className="px-6 py-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Rewards &amp; Challenges</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Complete goals, earn achievements, and unlock exclusive monetization opportunities!</p>
      </div>

      {/* XP Banner */}
      <div className="bg-gradient-to-r from-[oklch(0.38_0.11_145)] to-[oklch(0.52_0.14_145)] rounded-2xl p-5 mb-6 text-white flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">Your Progress</p>
          <p className="text-3xl font-bold mt-0.5">{xpPoints.toLocaleString()} <span className="text-lg font-normal text-white/70">XP</span></p>
          <div className="flex items-center gap-3 mt-2 text-sm text-white/80">
            <span className="flex items-center gap-1"><Flame size={14} className="text-orange-300" /> {streak} day streak</span>
            <span className="flex items-center gap-1"><Star size={14} className="text-amber-300" /> Level {xpLevel}</span>
          </div>
        </div>
        <div className="text-right">
          <Trophy size={48} className="text-white/20 ml-auto" />
          <p className="text-xs text-white/70 mt-1">Next level: {xpToNext} XP away</p>
          <div className="w-36 mt-2">
            <Progress value={xpProgress} className="h-2 bg-white/20 [&>[data-slot=progress-indicator]]:bg-white" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="exclusive">
        <TabsList className="mb-6 bg-white border border-border rounded-lg h-auto p-1 gap-1 w-auto inline-flex">
          {[
            { value: "exclusive", label: "Exclusive" },
            { value: "daily-goals", label: "Daily Goals" },
            { value: "achievements", label: "Achievements" },
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

        <TabsContent value="exclusive">
          <div className="flex items-center gap-2 mb-5">
            <Trophy size={18} className="text-amber-500" />
            <div>
              <h2 className="text-base font-bold text-foreground">Exclusive Monetization Challenges</h2>
              <p className="text-xs text-muted-foreground">Join premium challenges and earn real income from your culinary talents</p>
            </div>
          </div>

          {challenges.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No challenges available right now.</p>
          ) : (
            <div className="space-y-4">
              {challenges.map((c) => {
                const isJoined = joinedIds.has(c.id);
                const isClosing = closing(c.ends_at);
                return (
                  <div key={c.id} className={`bg-white rounded-2xl border p-5 hover:shadow-sm transition-shadow ${isClosing ? "border-red-200" : "border-border"}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{difficultyIcon[c.difficulty ?? "Beginner"] ?? "🎯"}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-foreground">{c.title}</h3>
                            {isClosing && <Badge className="text-[10px] bg-red-500 text-white border-0 px-2 py-0.5">Closing Soon</Badge>}
                            {isJoined && <Badge className="text-[10px] bg-primary/10 text-primary border-0 px-2 py-0.5">Joined ✓</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleJoin(c)}
                        disabled={!userId}
                        className={`text-xs font-semibold px-4 py-2 rounded-lg transition-colors shrink-0 ml-3 disabled:opacity-50 ${
                          isJoined
                            ? "bg-accent text-primary border border-primary/30 hover:bg-destructive/10 hover:text-destructive"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                      >
                        {isJoined ? "Leave" : "Join Challenge"}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-accent rounded-lg p-2.5">
                        <div className="flex items-center gap-1 text-muted-foreground mb-1"><DollarSign size={12} /><span className="text-[10px] font-medium">Reward</span></div>
                        <p className="text-sm font-bold text-foreground">{c.reward ?? "—"}</p>
                      </div>
                      <div className="bg-accent rounded-lg p-2.5">
                        <div className="flex items-center gap-1 text-muted-foreground mb-1"><Clock size={12} /><span className="text-[10px] font-medium">Time Left</span></div>
                        <p className={`text-sm font-bold ${isClosing ? "text-red-500" : "text-foreground"}`}>{timeLeft(c.ends_at)}</p>
                      </div>
                      <div className="bg-accent rounded-lg p-2.5">
                        <div className="flex items-center gap-1 text-muted-foreground mb-1"><Zap size={12} /><span className="text-[10px] font-medium">Difficulty</span></div>
                        <p className={`text-sm font-bold ${difficultyColor[c.difficulty ?? ""] ?? "text-foreground"}`}>{c.difficulty ?? "—"}</p>
                      </div>
                    </div>
                    {c.total_spots && (
                      <p className="text-[10px] text-muted-foreground mt-3">{c.total_spots} spots total</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="daily-goals">
          <div className="space-y-3">
            {dailyGoals.map((g) => {
              const done = completedGoals.has(g.title);
              return (
                <button
                  key={g.title}
                  onClick={() => setCompletedGoals((prev) => {
                    const next = new Set(prev);
                    done ? next.delete(g.title) : next.add(g.title);
                    return next;
                  })}
                  className={`w-full text-left bg-white rounded-xl border p-4 flex items-center justify-between transition-colors ${done ? "border-primary/30 bg-accent/30" : "border-border hover:border-primary/30"}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${done ? "bg-primary/10" : "bg-muted"}`}>{g.icon}</div>
                    <div>
                      <p className={`text-sm font-semibold ${done ? "text-primary line-through" : "text-foreground"}`}>{g.title}</p>
                      <p className="text-xs text-muted-foreground">+{g.xp} XP</p>
                    </div>
                  </div>
                  {done ? (
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">Done!</span>
                  ) : (
                    <ChevronRight size={16} className="text-muted-foreground" />
                  )}
                </button>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="grid grid-cols-3 gap-4">
            {achievements.map((a) => (
              <div key={a.title} className={`bg-white rounded-2xl border p-4 text-center ${a.earned ? "border-primary/30" : "border-border opacity-60"}`}>
                <div className={`text-3xl mb-2 ${!a.earned ? "grayscale" : ""}`}>{a.icon}</div>
                <p className="text-sm font-bold text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{a.desc}</p>
                {a.earned && <span className="mt-2 inline-block text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Earned</span>}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
