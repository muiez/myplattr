import { Share2, Plus, Calendar, ShoppingCart, Package, Trash2, CheckSquare, Square } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const sharedWith = [
  { name: "Sarah Johnson", level: "Beginner", role: "Editor", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face" },
  { name: "Mike Chen", level: "Intermediate", role: "Viewer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face" },
];

const meals = [
  { title: "Avocado Toast with Eggs", type: "Breakfast", cal: 320, checked: true },
  { title: "Greek Yogurt with Berries", type: "Snack", cal: 220, checked: true },
  { title: "Grilled Chicken Salad", type: "Lunch", cal: 450, checked: false },
  { title: "Salmon with Quinoa", type: "Dinner", cal: 520, checked: false },
];

const mealTypeColors: Record<string, string> = {
  Breakfast: "bg-amber-100 text-amber-700",
  Snack: "bg-blue-100 text-blue-700",
  Lunch: "bg-green-100 text-green-700",
  Dinner: "bg-purple-100 text-purple-700",
};

const pantryItems = [
  { name: "Chicken Breast", amount: "2 kg", tag: "Protein" },
  { name: "Olive Oil", amount: "500 ml", tag: "Fat" },
  { name: "Tomatoes", amount: "6 pieces", tag: "Vegetable" },
  { name: "Greek Yogurt", amount: "3 cups", tag: "Dairy" },
];

const shoppingList = [
  { name: "Fresh Salmon", qty: "2 fillets", tags: ["Seafood", "High"], done: false },
  { name: "Greek Yogurt", qty: "2 containers", tags: ["Dairy", "High"], done: false },
  { name: "Avocados", qty: "4 pieces", tags: ["Produce", "High"], done: false },
  { name: "Quinoa", qty: "1 Pack", tags: ["Grains", "Medium"], done: true },
  { name: "Eggs", qty: "1 dozen", tags: ["Protein", "Low"], done: true },
];

const tagColors: Record<string, string> = {
  Seafood: "bg-blue-100 text-blue-700",
  Dairy: "bg-yellow-100 text-yellow-700",
  Produce: "bg-green-100 text-green-700",
  Grains: "bg-amber-100 text-amber-700",
  Protein: "bg-red-100 text-red-700",
  High: "bg-red-100 text-red-600",
  Medium: "bg-amber-100 text-amber-600",
  Low: "bg-green-100 text-green-600",
  Fat: "bg-orange-100 text-orange-700",
  Vegetable: "bg-green-100 text-green-700",
};

export default function MealPlanPage() {
  return (
    <div className="px-6 py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar size={24} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Meal Plan</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground border border-border px-3 py-2 rounded-lg hover:bg-accent transition-colors">
            <Share2 size={15} /> Share
          </button>
          <button className="flex items-center gap-2 text-sm font-semibold bg-primary text-primary-foreground px-3.5 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            <Plus size={15} /> Add Meal
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Shared With */}
          <div className="bg-white rounded-2xl border border-border p-4 mb-5">
            <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-muted-foreground">👥</span> Shared with
            </p>
            <div className="grid grid-cols-2 gap-3">
              {sharedWith.map((u) => (
                <div key={u.name} className="flex items-center gap-3 bg-accent/50 rounded-xl p-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={u.avatar} />
                    <AvatarFallback>{u.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{u.name}</p>
                    <p className="text-[10px] text-muted-foreground">Level: {u.level}</p>
                  </div>
                  <span className={`ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full ${u.role === "Editor" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {u.role === "Editor" ? "✏ Editor" : "👁 Viewer"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Tabs defaultValue="daily">
            <TabsList className="mb-5 bg-white border border-border rounded-lg h-auto p-1 gap-1 w-full">
              {["Daily Plan", "Weekly Plan", "Monthly Plan"].map((t) => (
                <TabsTrigger
                  key={t}
                  value={t.split(" ")[0].toLowerCase()}
                  className="flex-1 text-sm py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md"
                >
                  {t}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="daily">
              <div className="bg-white rounded-2xl border border-border p-5">
                <div className="mb-4">
                  <h2 className="text-base font-bold text-foreground">Today&apos;s Meals</h2>
                  <p className="text-xs text-muted-foreground">Tuesday, July 1, 2025</p>
                </div>

                <div className="space-y-3">
                  {meals.map((m) => (
                    <div key={m.title} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors ${m.checked ? "bg-accent/30 border-primary/20" : "border-border hover:border-primary/30"}`}>
                      <div className={`w-5 h-5 shrink-0 ${m.checked ? "text-primary" : "text-muted-foreground"}`}>
                        {m.checked ? <CheckSquare size={20} /> : <Square size={20} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${m.checked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {m.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{m.cal} cal</p>
                      </div>
                      <Badge className={`text-[10px] border-0 ${mealTypeColors[m.type]}`}>{m.type}</Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total calories today</span>
                  <span className="font-bold text-foreground">{meals.reduce((s, m) => s + m.cal, 0)} / 2,000 kcal</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="weekly">
              <p className="text-sm text-muted-foreground bg-white rounded-2xl border border-border p-8 text-center">Weekly view coming soon.</p>
            </TabsContent>
            <TabsContent value="monthly">
              <p className="text-sm text-muted-foreground bg-white rounded-2xl border border-border p-8 text-center">Monthly view coming soon.</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="w-72 shrink-0 space-y-4">
          {/* Pantry */}
          <div className="bg-white rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package size={16} className="text-primary" />
              <h3 className="text-sm font-bold text-foreground">Pantry Items</h3>
            </div>
            <div className="space-y-2.5">
              {pantryItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-foreground">{item.name}</p>
                    <Badge className={`text-[9px] border-0 mt-0.5 ${tagColors[item.tag] || "bg-muted text-muted-foreground"}`}>{item.tag}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{item.amount}</span>
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <Share2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shopping List */}
          <div className="bg-white rounded-2xl border border-border p-4">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingCart size={16} className="text-primary" />
              <h3 className="text-sm font-bold text-foreground">Shopping list</h3>
            </div>

            <div className="space-y-2.5 mb-3">
              {shoppingList.filter((i) => !i.done).map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-foreground">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground">{item.qty}</p>
                    <div className="flex gap-1 mt-0.5">
                      {item.tags.map((t) => (
                        <Badge key={t} className={`text-[9px] border-0 ${tagColors[t] || "bg-muted text-muted-foreground"}`}>{t}</Badge>
                      ))}
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {shoppingList.filter((i) => i.done).length > 0 && (
              <div className="border-t border-border pt-3">
                <p className="text-[10px] font-semibold text-muted-foreground mb-2">✓ Completed ({shoppingList.filter((i) => i.done).length})</p>
                <div className="space-y-2">
                  {shoppingList.filter((i) => i.done).map((item) => (
                    <div key={item.name} className="bg-primary/5 border border-primary/20 rounded-lg p-2 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-foreground line-through text-muted-foreground">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">{item.qty}</p>
                      </div>
                      <button className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
