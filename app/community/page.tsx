import { Search, Plus, Users, TrendingUp, BadgeCheck } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const communities = [
  {
    id: 1,
    name: "Healthy Living Warriors",
    category: "Health & Wellness",
    description: "Join 55k+ members on a journey to transform their eating habits and embrace a healthier lifestyle.",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=200&fit=crop",
    members: "55,400",
    growth: "+5.2%",
    verified: true,
  },
  {
    id: 2,
    name: "Gym Bros Kitchen",
    category: "Fitness & Nutrition",
    description: "High-protein recipes, meal-prep strategies, and nutrition tips for serious fitness enthusiasts.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=200&fit=crop",
    members: "38,100",
    growth: "+4.1%",
    verified: true,
  },
  {
    id: 3,
    name: "Plant Based Paradise",
    category: "Vegan & Vegetarian",
    description: "Discover delicious vegan recipes, sustainable cooking tips, and connect with fellow plant lovers.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=200&fit=crop",
    members: "29,000",
    growth: "+6.8%",
    verified: true,
  },
  {
    id: 4,
    name: "Keto Fuel Station",
    category: "Specialty Diet",
    description: "Low-carb, high-fat recipes and meal plans to fuel your ketogenic lifestyle.",
    image: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=400&h=200&fit=crop",
    members: "20,563",
    growth: "+4.7%",
    verified: false,
  },
  {
    id: 5,
    name: "Baking Enthusiasts",
    category: "Baking & Desserts",
    description: "From sourdough to croissants — everything you need to become a master baker.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=200&fit=crop",
    members: "44,200",
    growth: "+3.9%",
    verified: true,
  },
  {
    id: 6,
    name: "Asian Fusion Corner",
    category: "World Cuisine",
    description: "Explore the rich flavors of Asia with fusion recipes that blend traditional and modern techniques.",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=200&fit=crop",
    members: "31,700",
    growth: "+7.2%",
    verified: true,
  },
];

function CommunityCard({ c }: { c: typeof communities[0] }) {
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <div className="relative">
        <img src={c.image} alt={c.name} className="w-full h-36 object-cover" />
        <div className="absolute top-2 right-2 flex items-center gap-1">
          {c.verified && (
            <span className="bg-white/90 backdrop-blur text-[10px] font-semibold text-primary flex items-center gap-1 px-2 py-0.5 rounded-full">
              <BadgeCheck size={11} /> Verified
            </span>
          )}
          <span className="bg-white/90 backdrop-blur text-[10px] font-semibold text-green-600 px-2 py-0.5 rounded-full">{c.growth}</span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-[10px] font-semibold text-primary uppercase tracking-wide mb-1">{c.category}</p>
        <h3 className="font-bold text-sm text-foreground leading-snug mb-1">{c.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{c.description}</p>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users size={12} />
            {c.members} Members
          </span>
          <button className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors">
            Join Community
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <div className="px-6 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Community</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search communities..." className="pl-9 pr-4 py-2 bg-white border border-border rounded-lg text-sm w-52 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <button className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3.5 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
            <Plus size={15} />
            Create Community
          </button>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-[oklch(0.38_0.11_145)] to-[oklch(0.50_0.13_145)] rounded-2xl p-6 mb-6 text-white">
        <h2 className="text-xl font-bold mb-1">Join Food Communities</h2>
        <p className="text-sm text-white/80 mb-4">Connect with like-minded food enthusiasts and discover new recipes</p>
        <div className="flex items-center gap-6 text-sm">
          <span className="flex items-center gap-2 text-white/90">
            <Users size={15} />
            180K+ Active Members
          </span>
          <span className="flex items-center gap-2 text-white/90">
            <BadgeCheck size={15} />
            25+ Communities
          </span>
          <span className="flex items-center gap-2 text-white/90">
            <TrendingUp size={15} />
            Growing Daily
          </span>
        </div>
      </div>

      <Tabs defaultValue="featured">
        <TabsList className="mb-6 bg-white border border-border rounded-lg h-auto p-1 gap-1 w-full justify-start">
          <TabsTrigger value="mine" className="text-sm px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
            My Communities
          </TabsTrigger>
          <TabsTrigger value="featured" className="text-sm px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
            Featured
          </TabsTrigger>
          <TabsTrigger value="trending" className="text-sm px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
            Trending
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mine">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
              <Users size={28} className="text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Join your First Community</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">Discover amazing food communities and connect with people who share your culinary interests.</p>
            <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
              <Plus size={15} /> Explore Communities
            </button>
          </div>
        </TabsContent>

        <TabsContent value="featured">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Featured Communities</h2>
            <div className="grid grid-cols-2 gap-5">
              {communities.map((c) => <CommunityCard key={c.id} c={c} />)}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trending">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Trending Communities</h2>
            <div className="grid grid-cols-2 gap-5">
              {[...communities].reverse().map((c) => <CommunityCard key={c.id} c={c} />)}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
