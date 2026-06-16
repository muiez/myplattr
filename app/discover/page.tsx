import { Search, Sparkles, TrendingUp, Heart, Clock, RefreshCw, Filter } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const aiPicks = [
  { title: "Authentic Risotto", time: "16 min", ingredients: 4 },
  { title: "Homemade Gnocchi", time: "20 min", ingredients: 3 },
  { title: "Tiramisu", time: "15 min", ingredients: 4 },
];

const mealPrepPicks = [
  { title: "Overnight Oats", time: "25 min", ingredients: 2 },
  { title: "Sheet Pan Dinners", time: "26 min", ingredients: 5 },
  { title: "Freezer Smoothie Packs", time: "21 min", ingredients: 4 },
];

const dietaryPicks = [
  { title: "Vegan Buddha Bowl", time: "22 min", ingredients: 3 },
  { title: "Keto Fat Bombs", time: "26 min", ingredients: 3 },
  { title: "Gluten-Free Bread", time: "18 min", ingredients: 4 },
];

const basedOnTaste = [
  { title: "Spicy Korean Ramen", rating: 3.7, saves: "34K" },
  { title: "Mediterranean Quinoa Bowl", rating: 4.4, saves: "19K" },
  { title: "Thai Basil Chicken", rating: 4.6, saves: "28K" },
];

const quickEasy = [
  { title: "15-Minute Pasta", rating: 4.0, saves: "38K" },
  { title: "One-Pan Chicken", rating: 4.5, saves: "11K" },
  { title: "Microwave Mug Cake", rating: 4.3, saves: "55K" },
];

const trending = [
  { title: "Viral TikTok Pasta", rating: 4.7, saves: "170K" },
  { title: "Cloud Bread", rating: 4.4, saves: "198K" },
  { title: "Dalgona Coffee", rating: 4.1, saves: "94K" },
];

const categories = ["All", "Pizza", "Vegetarian", "Vegan", "Quick & Easy", "Meal Prep", "Budget-Friendly", "Keto", "Breakfast", "Desserts", "One-Pot", "Comfort Food"];

function SmallRecipeCard({ title, time, ingredients }: { title: string; time: string; ingredients: number }) {
  return (
    <div className="bg-white border border-border rounded-xl p-3 hover:shadow-sm transition-shadow cursor-pointer">
      <p className="text-sm font-semibold text-foreground leading-snug">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{time} · {ingredients} ingredients</p>
    </div>
  );
}

function RankedCard({ title, rating, saves }: { title: string; rating: number; saves: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-xs text-amber-500 font-semibold">{rating}</span>
          <span className="text-xs text-muted-foreground">· {saves} saves</span>
        </div>
      </div>
      <button className="text-muted-foreground hover:text-rose-500 transition-colors">
        <Heart size={16} />
      </button>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <div className="px-6 py-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Discover</h1>
          <p className="text-sm text-muted-foreground">Find new recipes, creators, and culinary inspiration</p>
        </div>
        <button className="flex items-center gap-2 text-sm text-muted-foreground border border-border px-3 py-2 rounded-lg hover:bg-accent transition-colors">
          <Filter size={15} />
          Filters
        </button>
      </div>

      {/* Search */}
      <div className="relative mt-5 mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search recipes, ingredients, creators..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
        />
        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors">
          Search
        </button>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {categories.map((cat, i) => (
          <button
            key={cat}
            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              i === 0
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white text-muted-foreground border-border hover:border-primary hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <Tabs defaultValue="ai-picks">
        <TabsList className="mb-6 bg-white border border-border rounded-lg p-1 h-auto gap-1 w-auto inline-flex">
          {[
            { value: "recipes", label: "🍽 Recipes" },
            { value: "accounts", label: "👤 Accounts" },
            { value: "ingredients", label: "🥕 Ingredients" },
            { value: "ai-picks", label: "✨ AI Picks" },
            { value: "trending", label: "📈 Trending" },
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

        <TabsContent value="ai-picks">
          {/* AI Recommendations */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-primary" />
                <h2 className="text-lg font-bold text-foreground">AI Recommendations</h2>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <RefreshCw size={13} /> Refresh
              </button>
            </div>

            <p className="text-sm font-semibold text-foreground mb-1">Just for You</p>
            <p className="text-xs text-muted-foreground mb-3">Based on your cooking/watching history and preferences</p>

            <div className="bg-white border border-border rounded-xl p-4 mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs bg-accent text-primary px-2.5 py-1 rounded-full font-medium">You loved Italian recipes</span>
                <button className="text-xs text-primary font-semibold hover:underline">See all</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {aiPicks.map((r) => <SmallRecipeCard key={r.title} {...r} />)}
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-4 mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs bg-accent text-primary px-2.5 py-1 rounded-full font-medium">Perfect for meal prep</span>
                <button className="text-xs text-primary font-semibold hover:underline">See all</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {mealPrepPicks.map((r) => <SmallRecipeCard key={r.title} {...r} />)}
              </div>
            </div>

            <div className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs bg-accent text-primary px-2.5 py-1 rounded-full font-medium">Matches your dietary preferences</span>
                <button className="text-xs text-primary font-semibold hover:underline">See all</button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {dietaryPicks.map((r) => <SmallRecipeCard key={r.title} {...r} />)}
              </div>
            </div>
          </div>

          {/* Bottom 3 columns */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Heart size={15} className="text-rose-400" />
                <h3 className="text-sm font-semibold text-foreground">Based on your Taste</h3>
              </div>
              {basedOnTaste.map((r) => <RankedCard key={r.title} {...r} />)}
            </div>

            <div className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={15} className="text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Quick &amp; Easy</h3>
              </div>
              {quickEasy.map((r) => <RankedCard key={r.title} {...r} />)}
            </div>

            <div className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={15} className="text-amber-500" />
                <h3 className="text-sm font-semibold text-foreground">Trending Now</h3>
              </div>
              {trending.map((r) => <RankedCard key={r.title} {...r} />)}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recipes">
          <p className="text-muted-foreground text-sm">Recipe search results appear here.</p>
        </TabsContent>
        <TabsContent value="accounts">
          <p className="text-muted-foreground text-sm">Creator accounts appear here.</p>
        </TabsContent>
        <TabsContent value="ingredients">
          <p className="text-muted-foreground text-sm">Ingredient-based search appears here.</p>
        </TabsContent>
        <TabsContent value="trending">
          <p className="text-muted-foreground text-sm">Trending recipes appear here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
