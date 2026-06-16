import { createClient } from "@/lib/supabase/server";
import MealPlanClient from "./MealPlanClient";

export default async function MealPlanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <p className="text-muted-foreground">Sign in to use Meal Plan.</p>
      </div>
    );
  }

  // Get or create today's meal plan
  let { data: plan } = await supabase
    .from("meal_plans")
    .select("id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!plan) {
    const { data: newPlan } = await supabase
      .from("meal_plans")
      .insert({ user_id: user.id, title: "My Meal Plan" })
      .select("id")
      .single();
    plan = newPlan;
  }

  const [{ data: meals }, { data: pantry }, { data: shopping }] = await Promise.all([
    plan
      ? supabase.from("meal_plan_items").select("*").eq("meal_plan_id", plan.id).order("sort_order")
      : Promise.resolve({ data: [] }),
    supabase.from("pantry_items").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("shopping_list").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
  ]);

  return (
    <MealPlanClient
      planId={plan?.id ?? null}
      userId={user.id}
      initialMeals={meals ?? []}
      initialPantry={pantry ?? []}
      initialShopping={shopping ?? []}
    />
  );
}
