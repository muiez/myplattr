import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Plus, Sparkles, Star, Clock, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const recipes = [
  {
    id: 1,
    author: "Sarah Chen",
    handle: "@sarahcooks",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
    time: "2 hours ago",
    title: "Mediterranean Chicken with Sun-Dried Tomatoes",
    description: "A nutritious and colorful bowl packed with Mediterranean flavors, perfect for meal prep or a quick dinner.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=480&fit=crop",
    tags: ["Mediterranean", "Chicken", "Healthy"],
    prepTime: "25 min",
    serves: 4,
    rating: 4.8,
    likes: 342,
    comments: 44,
    saves: 128,
    difficulty: "Easy",
  },
  {
    id: 2,
    author: "Marcus Rivera",
    handle: "@marcuseats",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
    time: "5 hours ago",
    title: "Authentic Homemade Gnocchi",
    description: "Light, pillowy gnocchi made from scratch — just potatoes, flour, and love. Serve with your favorite sauce.",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=480&fit=crop",
    tags: ["Italian", "Pasta", "Vegetarian"],
    prepTime: "40 min",
    serves: 6,
    rating: 4.9,
    likes: 891,
    comments: 112,
    saves: 445,
    difficulty: "Intermediate",
  },
  {
    id: 3,
    author: "Aisha Patel",
    handle: "@aishaplate",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=face",
    time: "Yesterday",
    title: "Vegan Buddha Bowl with Tahini Dressing",
    description: "A rainbow of roasted veggies, crispy chickpeas, and creamy tahini — nourishing and absolutely stunning.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=480&fit=crop",
    tags: ["Vegan", "Bowl", "Gluten-Free"],
    prepTime: "30 min",
    serves: 2,
    rating: 4.7,
    likes: 567,
    comments: 78,
    saves: 312,
    difficulty: "Easy",
  },
];

const suggestedCreators = [
  { name: "James Wok", handle: "@jameswok", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face", recipes: 127 },
  { name: "Lily Bakes", handle: "@lilybakes", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face", recipes: 84 },
  { name: "Chef Marco", handle: "@chefmarco", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face", recipes: 203 },
];

export default function HomePage() {
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
            <Plus size={16} />
            Create Recipe
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
          {recipes.map((r) => (
            <article key={r.id} className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between px-4 pt-4 pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={r.avatar} />
                    <AvatarFallback>{r.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{r.author}</p>
                    <p className="text-xs text-muted-foreground">{r.handle} · {r.time}</p>
                  </div>
                </div>
                <button className="text-muted-foreground hover:text-foreground transition-colors p-1">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.image} alt={r.title} className="w-full h-52 object-cover" />

              <div className="px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-semibold text-foreground text-base leading-snug">{r.title}</h2>
                  <Badge variant="secondary" className="shrink-0 text-[10px] bg-accent text-accent-foreground border-0">{r.difficulty}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{r.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock size={12} />{r.prepTime}</span>
                  <span className="flex items-center gap-1"><Users size={12} />Serves {r.serves}</span>
                  <span className="flex items-center gap-1"><Star size={12} className="fill-amber-400 text-amber-400" />{r.rating}</span>
                </div>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {r.tags.map((tag) => (
                    <span key={tag} className="text-[11px] bg-accent text-accent-foreground px-2.5 py-0.5 rounded-full font-medium">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="px-4 pb-4 border-t border-border mt-1 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-rose-500 transition-colors">
                    <Heart size={18} /><span>{r.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle size={18} /><span>{r.comments}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Bookmark size={18} /><span>{r.saves}</span>
                </button>
              </div>
            </article>
          ))}
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
