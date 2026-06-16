import { Trophy, Clock, Zap, Star, DollarSign, ChevronRight, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const exclusiveChallenges = [
  {
    id: 1,
    icon: "🏆",
    title: "Premium Recipe Creator",
    description: "Create 50 premium recipes and earn from every view",
    reward: "$50-200",
    timeLeft: "12 days",
    difficulty: "Expert",
    difficultyColor: "text-red-500",
    progress: 45,
    total: 100,
    spots: 55,
    closing: false,
  },
  {
    id: 2,
    icon: "🌟",
    title: "Brand Ambassador Challenge",
    description: "Partner with food brands and earn commission on sales",
    reward: "$100-500",
    timeLeft: "8 Days",
    difficulty: "Pro",
    difficultyColor: "text-purple-500",
    progress: 23,
    total: 50,
    spots: 27,
    closing: false,
  },
  {
    id: 3,
    icon: "👨‍🍳",
    title: "Cooking Class Instructor",
    description: "Host live cooking classes and earn from student enrollment",
    reward: "$25-100/class",
    timeLeft: "5 days",
    difficulty: "Intermediate",
    difficultyColor: "text-amber-500",
    progress: 78,
    total: 50,
    spots: 122,
    closing: false,
  },
  {
    id: 4,
    icon: "📸",
    title: "Food Photography Contest",
    description: "Submit food photos to win cash prizes",
    reward: "$25-200",
    timeLeft: "2 days",
    difficulty: "Beginner",
    difficultyColor: "text-green-500",
    progress: 356,
    total: 500,
    spots: 144,
    closing: true,
  },
];

const dailyGoals = [
  { title: "Post a Recipe Today", xp: 50, completed: true, icon: "📝" },
  { title: "Comment on 3 Recipes", xp: 20, completed: true, icon: "💬" },
  { title: "Save 5 Recipes", xp: 15, completed: false, icon: "🔖" },
  { title: "Follow 2 New Creators", xp: 10, completed: false, icon: "👥" },
];

const achievements = [
  { title: "First Recipe", desc: "Published your first recipe", icon: "🎉", earned: true },
  { title: "Popular Creator", desc: "Reached 1,000 followers", icon: "⭐", earned: true },
  { title: "Recipe Streak", desc: "Posted 7 days in a row", icon: "🔥", earned: true },
  { title: "Top Chef", desc: "Earned Top Chef badge", icon: "👨‍🍳", earned: false },
  { title: "Community Builder", desc: "Created your own community", icon: "🏘", earned: false },
  { title: "Master Baker", desc: "50 baking recipes posted", icon: "🧁", earned: false },
];

export default function RewardsPage() {
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
          <p className="text-3xl font-bold mt-0.5">12,450 <span className="text-lg font-normal text-white/70">XP</span></p>
          <div className="flex items-center gap-3 mt-2 text-sm text-white/80">
            <span className="flex items-center gap-1"><Flame size={14} className="text-orange-300" /> 45 day streak</span>
            <span className="flex items-center gap-1"><Star size={14} className="text-amber-300" /> Level 12</span>
          </div>
        </div>
        <div className="text-right">
          <Trophy size={48} className="text-white/20 ml-auto" />
          <p className="text-xs text-white/70 mt-1">Next level: 1,550 XP away</p>
          <div className="w-36 mt-2">
            <Progress value={72} className="h-2 bg-white/20 [&>[data-slot=progress-indicator]]:bg-white" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="exclusive">
        <TabsList className="mb-6 bg-white border border-border rounded-lg h-auto p-1 gap-1 w-auto inline-flex">
          {["Career Paths", "Daily Goals", "Weekly Tasks", "Achievements", "Exclusive"].map((t) => (
            <TabsTrigger
              key={t}
              value={t === "Exclusive" ? "exclusive" : t.toLowerCase().replace(" ", "-")}
              className="text-xs px-3 py-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
            >
              {t}
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

          <div className="space-y-4">
            {exclusiveChallenges.map((c) => (
              <div key={c.id} className={`bg-white rounded-2xl border p-5 hover:shadow-sm transition-shadow ${c.closing ? "border-red-200" : "border-border"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-foreground">{c.title}</h3>
                        {c.closing && (
                          <Badge className="text-[10px] bg-red-500 text-white border-0 px-2 py-0.5">Closing Soon</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>
                    </div>
                  </div>
                  <button className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shrink-0 ml-3">
                    Join Challenge
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="bg-accent rounded-lg p-2.5">
                    <div className="flex items-center gap-1 text-muted-foreground mb-1"><DollarSign size={12} /><span className="text-[10px] font-medium">Reward</span></div>
                    <p className="text-sm font-bold text-foreground">{c.reward}</p>
                  </div>
                  <div className="bg-accent rounded-lg p-2.5">
                    <div className="flex items-center gap-1 text-muted-foreground mb-1"><Clock size={12} /><span className="text-[10px] font-medium">Time Left</span></div>
                    <p className={`text-sm font-bold ${c.closing ? "text-red-500" : "text-foreground"}`}>{c.timeLeft}</p>
                  </div>
                  <div className="bg-accent rounded-lg p-2.5">
                    <div className="flex items-center gap-1 text-muted-foreground mb-1"><Zap size={12} /><span className="text-[10px] font-medium">Difficulty</span></div>
                    <p className={`text-sm font-bold ${c.difficultyColor}`}>{c.difficulty}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Progress</span>
                  <span>{c.progress} / {c.total}</span>
                </div>
                <Progress value={(c.progress / c.total) * 100} className="h-2 bg-muted [&>[data-slot=progress-indicator]]:bg-primary" />
                <p className="text-[10px] text-muted-foreground mt-2">{c.spots} spots remaining</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="daily-goals">
          <div className="space-y-3">
            {dailyGoals.map((g) => (
              <div key={g.title} className={`bg-white rounded-xl border p-4 flex items-center justify-between ${g.completed ? "border-primary/30 bg-accent/30" : "border-border"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${g.completed ? "bg-primary/10" : "bg-muted"}`}>
                    {g.icon}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${g.completed ? "text-primary line-through" : "text-foreground"}`}>{g.title}</p>
                    <p className="text-xs text-muted-foreground">+{g.xp} XP</p>
                  </div>
                </div>
                {g.completed ? (
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">Done!</span>
                ) : (
                  <ChevronRight size={16} className="text-muted-foreground" />
                )}
              </div>
            ))}
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

        <TabsContent value="career-paths">
          <p className="text-sm text-muted-foreground">Career path milestones coming soon.</p>
        </TabsContent>
        <TabsContent value="weekly-tasks">
          <p className="text-sm text-muted-foreground">Weekly challenges appear here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
