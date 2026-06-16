"use client";

import { useState } from "react";
import { Plus, Calendar, ShoppingCart, Package, Trash2, CheckSquare, Square, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

type MealItem = {
  id: string;
  meal_plan_id: string;
  recipe_title: string | null;
  meal_type: "Breakfast" | "Snack" | "Lunch" | "Dinner" | null;
  calories: number | null;
  is_checked: boolean;
  sort_order: number;
};

type PantryItem = {
  id: string;
  name: string;
  amount: string | null;
  unit: string | null;
  tag: string | null;
};

type ShoppingItem = {
  id: string;
  name: string;
  qty: string | null;
  tags: string[] | null;
  is_done: boolean;
};

interface Props {
  planId: string | null;
  userId: string;
  initialMeals: MealItem[];
  initialPantry: PantryItem[];
  initialShopping: ShoppingItem[];
}

const mealTypeColors: Record<string, string> = {
  Breakfast: "bg-amber-100 text-amber-700",
  Snack: "bg-blue-100 text-blue-700",
  Lunch: "bg-green-100 text-green-700",
  Dinner: "bg-purple-100 text-purple-700",
};

const mealTypes = ["Breakfast", "Snack", "Lunch", "Dinner"] as const;

export default function MealPlanClient({ planId, userId, initialMeals, initialPantry, initialShopping }: Props) {
  const [meals, setMeals] = useState(initialMeals);
  const [pantry, setPantry] = useState(initialPantry);
  const [shopping, setShopping] = useState(initialShopping);
  const [addingMeal, setAddingMeal] = useState(false);
  const [addingShop, setAddingShop] = useState(false);
  const [mealForm, setMealForm] = useState({ title: "", type: "Lunch" as typeof mealTypes[number], calories: "" });
  const [shopForm, setShopForm] = useState({ name: "", qty: "" });

  const supabase = createClient();

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const totalCal = meals.reduce((s, m) => s + (m.calories ?? 0), 0);
  const checkedCal = meals.filter((m) => m.is_checked).reduce((s, m) => s + (m.calories ?? 0), 0);

  async function toggleMeal(item: MealItem) {
    const updated = !item.is_checked;
    setMeals((prev) => prev.map((m) => m.id === item.id ? { ...m, is_checked: updated } : m));
    await supabase.from("meal_plan_items").update({ is_checked: updated }).eq("id", item.id);
  }

  async function deleteMeal(id: string) {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    await supabase.from("meal_plan_items").delete().eq("id", id);
  }

  async function addMeal() {
    if (!planId || !mealForm.title.trim()) return;
    const { data } = await supabase
      .from("meal_plan_items")
      .insert({
        meal_plan_id: planId,
        recipe_title: mealForm.title.trim(),
        meal_type: mealForm.type,
        calories: mealForm.calories ? parseInt(mealForm.calories) : null,
        is_checked: false,
        sort_order: meals.length,
      })
      .select()
      .single();
    if (data) setMeals((prev) => [...prev, data as MealItem]);
    setMealForm({ title: "", type: "Lunch", calories: "" });
    setAddingMeal(false);
  }

  async function toggleShop(item: ShoppingItem) {
    const updated = !item.is_done;
    setShopping((prev) => prev.map((s) => s.id === item.id ? { ...s, is_done: updated } : s));
    await supabase.from("shopping_list").update({ is_done: updated }).eq("id", item.id);
  }

  async function deleteShop(id: string) {
    setShopping((prev) => prev.filter((s) => s.id !== id));
    await supabase.from("shopping_list").delete().eq("id", id);
  }

  async function addShopItem() {
    if (!shopForm.name.trim()) return;
    const { data } = await supabase
      .from("shopping_list")
      .insert({ user_id: userId, name: shopForm.name.trim(), qty: shopForm.qty || null, is_done: false })
      .select()
      .single();
    if (data) setShopping((prev) => [data as ShoppingItem, ...prev]);
    setShopForm({ name: "", qty: "" });
    setAddingShop(false);
  }

  return (
    <div className="px-6 py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar size={24} className="text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Meal Plan</h1>
        </div>
        <button
          onClick={() => setAddingMeal(true)}
          className="flex items-center gap-2 text-sm font-semibold bg-primary text-primary-foreground px-3.5 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={15} /> Add Meal
        </button>
      </div>

      <div className="flex gap-6">
        {/* Main */}
        <div className="flex-1 min-w-0">
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
                  <p className="text-xs text-muted-foreground">{today}</p>
                </div>

                {meals.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-3xl mb-2">🍽️</p>
                    <p className="text-sm text-muted-foreground mb-3">No meals planned yet.</p>
                    <button onClick={() => setAddingMeal(true)} className="flex items-center gap-1.5 mx-auto bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                      <Plus size={15} /> Add Your First Meal
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {meals.map((m) => (
                      <div
                        key={m.id}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors ${m.is_checked ? "bg-accent/30 border-primary/20" : "border-border hover:border-primary/30"}`}
                      >
                        <button onClick={() => toggleMeal(m)} className={`shrink-0 ${m.is_checked ? "text-primary" : "text-muted-foreground"}`}>
                          {m.is_checked ? <CheckSquare size={20} /> : <Square size={20} />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold ${m.is_checked ? "line-through text-muted-foreground" : "text-foreground"}`}>
                            {m.recipe_title}
                          </p>
                          {m.calories && <p className="text-xs text-muted-foreground mt-0.5">{m.calories} cal</p>}
                        </div>
                        {m.meal_type && (
                          <Badge className={`text-[10px] border-0 shrink-0 ${mealTypeColors[m.meal_type] ?? "bg-muted text-muted-foreground"}`}>
                            {m.meal_type}
                          </Badge>
                        )}
                        <button onClick={() => deleteMeal(m.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {meals.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Calories consumed / planned</span>
                    <span className="font-bold text-foreground">{checkedCal} / {totalCal} kcal</span>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="weekly">
              <div className="bg-white rounded-2xl border border-border p-8 text-center">
                <p className="text-3xl mb-2">📅</p>
                <p className="text-sm font-semibold text-foreground mb-1">Weekly View</p>
                <p className="text-xs text-muted-foreground">Coming soon — plan your full week at once.</p>
              </div>
            </TabsContent>

            <TabsContent value="monthly">
              <div className="bg-white rounded-2xl border border-border p-8 text-center">
                <p className="text-3xl mb-2">🗓️</p>
                <p className="text-sm font-semibold text-foreground mb-1">Monthly View</p>
                <p className="text-xs text-muted-foreground">Coming soon.</p>
              </div>
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
            {pantry.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No pantry items yet.</p>
            ) : (
              <div className="space-y-2.5">
                {pantry.slice(0, 6).map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-foreground">{item.name}</p>
                      {item.tag && <Badge className="text-[9px] border-0 mt-0.5 bg-accent text-accent-foreground">{item.tag}</Badge>}
                    </div>
                    <span className="text-xs text-muted-foreground">{item.amount}{item.unit ? ` ${item.unit}` : ""}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shopping List */}
          <div className="bg-white rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-primary" />
                <h3 className="text-sm font-bold text-foreground">Shopping List</h3>
              </div>
              <button onClick={() => setAddingShop(true)} className="text-primary hover:text-primary/80 transition-colors">
                <Plus size={16} />
              </button>
            </div>

            {addingShop && (
              <div className="mb-3 space-y-2">
                <input
                  autoFocus
                  value={shopForm.name}
                  onChange={(e) => setShopForm((f) => ({ ...f, name: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && addShopItem()}
                  placeholder="Item name..."
                  className="w-full px-2.5 py-1.5 border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <input
                  value={shopForm.qty}
                  onChange={(e) => setShopForm((f) => ({ ...f, qty: e.target.value }))}
                  placeholder="Quantity (optional)"
                  className="w-full px-2.5 py-1.5 border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <div className="flex gap-2">
                  <button onClick={addShopItem} className="flex-1 bg-primary text-primary-foreground text-xs font-semibold py-1.5 rounded-lg hover:bg-primary/90 transition-colors">Add</button>
                  <button onClick={() => setAddingShop(false)} className="flex-1 border border-border text-xs py-1.5 rounded-lg hover:bg-accent transition-colors">Cancel</button>
                </div>
              </div>
            )}

            {shopping.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">Your shopping list is empty.</p>
            ) : (
              <div className="space-y-2.5">
                {shopping.filter((i) => !i.is_done).map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-2">
                    <button onClick={() => toggleShop(item)} className="flex-1 text-left">
                      <p className="text-xs font-semibold text-foreground">{item.name}</p>
                      {item.qty && <p className="text-[10px] text-muted-foreground">{item.qty}</p>}
                    </button>
                    <button onClick={() => deleteShop(item.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                {shopping.filter((i) => i.is_done).length > 0 && (
                  <div className="border-t border-border pt-2.5 mt-2">
                    <p className="text-[10px] font-semibold text-muted-foreground mb-2">✓ Got it ({shopping.filter((i) => i.is_done).length})</p>
                    {shopping.filter((i) => i.is_done).map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-2 mb-2">
                        <button onClick={() => toggleShop(item)} className="flex-1 text-left">
                          <p className="text-xs text-muted-foreground line-through">{item.name}</p>
                        </button>
                        <button onClick={() => deleteShop(item.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Meal Modal */}
      {addingMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-foreground">Add Meal</h2>
              <button onClick={() => setAddingMeal(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Meal Name *</label>
                <input
                  autoFocus
                  value={mealForm.title}
                  onChange={(e) => setMealForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Grilled Chicken Salad"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Meal Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {mealTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setMealForm((f) => ({ ...f, type }))}
                      className={`text-xs py-1.5 rounded-lg border transition-colors ${mealForm.type === type ? "border-primary bg-primary/5 text-primary font-semibold" : "border-border text-muted-foreground hover:border-primary/30"}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Calories (optional)</label>
                <input
                  type="number"
                  value={mealForm.calories}
                  onChange={(e) => setMealForm((f) => ({ ...f, calories: e.target.value }))}
                  placeholder="e.g. 450"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setAddingMeal(false)} className="flex-1 border border-border text-sm font-medium py-2.5 rounded-xl hover:bg-accent transition-colors">Cancel</button>
                <button
                  onClick={addMeal}
                  disabled={!mealForm.title.trim()}
                  className="flex-1 bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  Add Meal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
