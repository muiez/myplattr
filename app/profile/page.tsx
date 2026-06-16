import { MapPin, Globe, Calendar, Settings, Share2, BadgeCheck, Lock, RotateCcw, Bookmark, Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const collections = [
  {
    id: 1,
    title: "Starters",
    author: "@sasucollections",
    rating: "★★★★★",
    recipes: 34,
    saved: 1149,
    starred: 2,
    unlocked: true,
    images: [
      "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=200&h=150&fit=crop",
    ],
  },
  {
    id: 2,
    title: "Ramadan Iftar",
    author: "By You",
    rating: "★★★★★",
    recipes: 51,
    saved: 441,
    starred: 1,
    unlocked: false,
    images: [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=150&fit=crop",
    ],
  },
  {
    id: 3,
    title: "Breakfast delights",
    author: "@sasucollections",
    rating: "★★★★★",
    recipes: 22,
    saved: 384,
    starred: 2,
    unlocked: true,
    images: [
      "https://images.unsplash.com/photo-1533089860892-a9b4fcb4b2e4?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=200&h=150&fit=crop",
      "https://images.unsplash.com/photo-1571748982800-fa51082c2224?w=200&h=150&fit=crop",
    ],
  },
];

const stats = [
  { label: "Recipes", value: "127" },
  { label: "Followers", value: "15,200" },
  { label: "Following", value: "284" },
  { label: "Likes", value: "45,800" },
  { label: "Streak", value: "45", icon: "🔥" },
  { label: "XP Points", value: "12,450", icon: "⚡" },
];

const badges = [
  { label: "Top Chef", icon: "🏆", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { label: "Verified Cook", icon: "✅", color: "bg-green-100 text-green-700 border-green-200" },
  { label: "Trending Creator", icon: "📈", color: "bg-blue-100 text-blue-700 border-blue-200" },
];

function CollectionCard({ c }: { c: typeof collections[0] }) {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow">
      <div className="grid grid-cols-2 gap-0.5">
        {c.images.slice(0, 4).map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={img} alt="" className="w-full h-20 object-cover" />
        ))}
      </div>
      <div className="absolute top-2 right-2 flex gap-1">
        {!c.unlocked && (
          <span className="bg-black/50 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Lock size={9} /> Private
          </span>
        )}
        {c.unlocked && (
          <span className="bg-black/50 backdrop-blur text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            🔓 Unlocked
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-bold text-foreground">{c.title}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{c.author}</p>
        <p className="text-[11px] text-amber-500 mt-0.5">{c.rating}</p>
        <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><RotateCcw size={10} />{c.recipes} recipes</span>
          <span className="flex items-center gap-1"><Bookmark size={10} />{c.saved}</span>
          <span className="flex items-center gap-1"><Star size={10} />{c.starred}</span>
        </div>
      </div>
      <div className="px-3 pb-3">
        <button className="w-full text-xs font-semibold text-muted-foreground border border-border rounded-lg py-1.5 hover:bg-accent transition-colors flex items-center justify-center gap-1">
          <Settings size={12} /> Manage
        </button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-full">
      {/* Cover */}
      <div className="h-40 bg-gradient-to-r from-[oklch(0.75_0.09_145)] to-[oklch(0.88_0.06_145)] relative">
        <button className="absolute top-3 right-3 flex items-center gap-1.5 text-xs font-medium bg-white/90 backdrop-blur text-foreground px-3 py-1.5 rounded-lg hover:bg-white transition-colors">
          <Settings size={13} /> Edit Cover
        </button>
      </div>

      <div className="px-6 max-w-5xl mx-auto">
        {/* Profile header */}
        <div className="flex items-end justify-between -mt-12 mb-4">
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
            <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=128&h=128&fit=crop&crop=face" />
            <AvatarFallback className="text-xl bg-primary/10">EC</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-2 pb-2">
            <button className="flex items-center gap-1.5 border border-border text-sm font-medium text-foreground px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">
              <Share2 size={14} />
            </button>
            <button className="flex items-center gap-1.5 border border-border text-sm font-medium text-foreground px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">
              <Settings size={14} />
            </button>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-xl font-bold text-foreground">Elena Carter</h1>
            <span className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              <BadgeCheck size={12} /> Verified
            </span>
          </div>
          <p className="text-sm text-muted-foreground">@elenacooks</p>
          <p className="text-sm text-foreground mt-2">Home chef passionate about Asian fusion cuisine 🍜 | Food photographer | Recipe developer</p>

          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin size={12} />San Francisco, CA</span>
            <span className="flex items-center gap-1"><Globe size={12} />sarahcooking.com</span>
            <span className="flex items-center gap-1"><Calendar size={12} />Joined March 2022</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mt-4">
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

          {/* Badges */}
          <div className="flex gap-2 mt-3">
            {badges.map((b) => (
              <span key={b.label} className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${b.color}`}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>
        </div>

        <Tabs defaultValue="collections">
          <TabsList className="mb-6 bg-white border border-border rounded-lg h-auto p-1 gap-1 w-full">
            {["Recipes", "Menu Collections", "Meal Plans", "Reviews"].map((t) => (
              <TabsTrigger
                key={t}
                value={t.toLowerCase().replace(" ", "-")}
                className="flex-1 text-sm py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
              >
                {t}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="recipes">
            <div className="grid grid-cols-3 gap-4">
              {[
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop",
                "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=300&fit=crop",
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop",
                "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=300&h=300&fit=crop",
                "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=300&fit=crop",
                "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=300&fit=crop",
              ].map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border hover:shadow-md transition-shadow cursor-pointer relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="menu-collections">
            <div className="grid grid-cols-3 gap-4 relative">
              {collections.map((c) => (
                <div key={c.id} className="relative">
                  <CollectionCard c={c} />
                </div>
              ))}
              <div className="bg-white rounded-2xl border-2 border-dashed border-border flex items-center justify-center min-h-[200px] hover:border-primary/50 hover:bg-accent/30 transition-colors cursor-pointer">
                <div className="text-center">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl">+</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground">Create Collection</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Organize your recipes or create a custom menu collection.</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="meal-plans">
            <p className="text-sm text-muted-foreground">Your saved meal plans appear here.</p>
          </TabsContent>

          <TabsContent value="reviews">
            <p className="text-sm text-muted-foreground">Your reviews appear here.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
