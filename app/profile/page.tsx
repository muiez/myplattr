import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MapPin, Globe, Calendar, Settings, Share2, BadgeCheck, Plus } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: profile },
    { count: recipesCount },
    { count: followersCount },
    { count: followingCount },
    { data: recipes },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("recipes").select("*", { count: "exact", head: true }).eq("author_id", user.id),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", user.id),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", user.id),
    supabase
      .from("recipes")
      .select("id, title, thumbnail_url, likes_count, difficulty")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  const displayName =
    profile?.full_name ||
    profile?.username ||
    user.email?.split("@")[0] ||
    "User";
  const username = profile?.username || user.email?.split("@")[0] || "user";
  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  const initials = displayName.slice(0, 2).toUpperCase();

  const stats = [
    { label: "Recipes", value: (recipesCount ?? 0).toLocaleString() },
    { label: "Followers", value: (followersCount ?? 0).toLocaleString() },
    { label: "Following", value: (followingCount ?? 0).toLocaleString() },
    { label: "Likes", value: (profile?.xp_points ?? 0).toLocaleString() },
    { label: "Streak", value: String(profile?.streak ?? 0), icon: "🔥" },
    { label: "XP Points", value: (profile?.xp_points ?? 0).toLocaleString(), icon: "⚡" },
  ];

  return (
    <div className="min-h-full">
      {/* Cover */}
      <div
        className="h-40 relative"
        style={{
          background: profile?.cover_url
            ? `url(${profile.cover_url}) center/cover`
            : "linear-gradient(135deg, oklch(0.75 0.09 145), oklch(0.88 0.06 145))",
        }}
      >
        <button className="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-medium bg-white/90 backdrop-blur text-foreground px-3 py-1.5 rounded-lg hover:bg-white transition-colors">
          <Settings size={13} /> Edit Cover
        </button>
      </div>

      <div className="px-6 max-w-5xl mx-auto">
        {/* Profile header */}
        <div className="flex items-end justify-between -mt-12 mb-4">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} />
            <AvatarFallback className="text-2xl font-bold bg-[#4a7c3f] text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 pb-2">
            <button className="flex items-center gap-1.5 border border-border text-sm font-medium text-foreground px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">
              <Share2 size={14} />
            </button>
            <button className="flex items-center gap-1.5 border border-border text-sm font-medium text-foreground px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">
              <Settings size={14} /> Edit Profile
            </button>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-xl font-bold text-foreground">{displayName}</h1>
            {profile?.is_verified && (
              <span className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                <BadgeCheck size={12} /> Verified
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">@{username}</p>

          {profile?.bio ? (
            <p className="text-sm text-foreground mt-2">{profile.bio}</p>
          ) : (
            <p className="text-sm text-muted-foreground mt-2 italic">No bio yet — add one in Edit Profile</p>
          )}

          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
            {profile?.location && (
              <span className="flex items-center gap-1"><MapPin size={12} />{profile.location}</span>
            )}
            {profile?.website && (
              <span className="flex items-center gap-1"><Globe size={12} />{profile.website}</span>
            )}
            <span className="flex items-center gap-1"><Calendar size={12} />Joined {joinedDate}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4 flex-wrap">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-base font-bold text-foreground">
                  {s.icon && <span className="mr-0.5">{s.icon}</span>}
                  {s.value}
                </p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <Tabs defaultValue="recipes">
          <TabsList className="mb-6 bg-white border border-border rounded-lg h-auto p-1 gap-1 w-full">
            {["Recipes", "Menu Collections", "Meal Plans", "Reviews"].map((t) => (
              <TabsTrigger
                key={t}
                value={t.toLowerCase().replace(/ /g, "-")}
                className="flex-1 text-sm py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="recipes">
            {recipes && recipes.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {recipes.map((r) => (
                  <div
                    key={r.id}
                    className="aspect-square rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow cursor-pointer relative group bg-muted"
                  >
                    {r.thumbnail_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.thumbnail_url}
                        alt={r.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[oklch(0.88_0.06_145)] to-[oklch(0.75_0.09_145)]">
                        <span className="text-3xl">🍽️</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end">
                      <div className="px-3 pb-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-xs font-semibold line-clamp-2">{r.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
                <div className="text-4xl mb-3">🍽️</div>
                <h3 className="font-semibold text-foreground mb-1">No recipes yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Share your first recipe with the MyPlattr community</p>
                <Link
                  href="/create-recipe"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Plus size={16} /> Create Recipe
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="menu-collections">
            <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-semibold text-foreground mb-1">No collections yet</h3>
              <p className="text-sm text-muted-foreground">Organize your recipes into collections</p>
            </div>
          </TabsContent>

          <TabsContent value="meal-plans">
            <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="font-semibold text-foreground mb-1">No meal plans yet</h3>
              <p className="text-sm text-muted-foreground">Plan your weekly meals here</p>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <p className="text-sm text-muted-foreground py-8 text-center">Your reviews appear here.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
