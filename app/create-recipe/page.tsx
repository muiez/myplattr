"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, Sparkles, ChevronRight, ChevronLeft, Check, Clock, Users, Tag, Leaf, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const steps = ["Upload Media and Describe", "AI Details", "Advanced Settings", "Review"];
const popularTags = ["Quick & Easy", "Healthy", "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Low-Carb", "High Protein", "Meal prep", "One-Pot", "30-Minute", "Budget Friendly", "Comfort Food", "Date Night", "Kid-Friendly", "Spicy", "Sweet", "Savory"];
const dietaryTags = ["Vegetarian", "Vegan", "Gluten-Free", "Nut-Free", "Egg-Free", "Soy-Free", "Low-Carb", "Keto", "Paleo", "Mediterranean", "Whole30"];

const AI_INGREDIENTS = [
  { amount: "2.25 cups", item: "All-purpose flour" },
  { amount: "1 tsp", item: "Salt" },
  { amount: "0.75 cup", item: "Granulated sugar" },
  { amount: "1 tbsp", item: "Vanilla extract" },
  { amount: "2 cups", item: "Chocolate chips" },
  { amount: "1 tsp", item: "Baking Soda" },
  { amount: "1 cup", item: "Butter (softened)" },
  { amount: "0.75 cup", item: "Brown sugar (packed)" },
  { amount: "2 pieces", item: "Large eggs" },
];

const AI_INSTRUCTIONS = [
  "Preheat oven to 375°F (190°C). Line baking sheets with parchment paper.",
  "In a medium bowl, whisk together flour, baking soda, and salt. Set aside.",
  "In a large bowl, cream together softened butter and both sugars until light and fluffy, about 2-3 minutes.",
  "Beat in eggs one at a time, then add vanilla extract.",
  "Gradually mix in the flour mixture until just combined. Don't overmix.",
  "Fold in chocolate chips until evenly distributed.",
  "Drop rounded tablespoons of dough onto prepared baking sheets, spacing them 2 inches apart.",
  "Bake for 9-11 minutes or until edges are golden brown. Centers may look slightly underbaked.",
  "Cool on baking sheet for 5 minutes before transferring to a wire rack.",
];

type Ingredient = { amount: string; item: string };

export default function CreateRecipePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [useAI, setUseAI] = useState(true);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Advanced">("Easy");
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const toggleTag = (tag: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(tag) ? list.filter((t) => t !== tag) : [...list, tag]);
  };

  function loadAI() {
    setIngredients(AI_INGREDIENTS.map((i) => ({ ...i })));
    setInstructions([...AI_INSTRUCTIONS]);
    setStep(1);
  }

  function addIngredient() {
    setIngredients((prev) => [...prev, { amount: "", item: "" }]);
  }

  function updateIngredient(index: number, field: keyof Ingredient, value: string) {
    setIngredients((prev) => prev.map((ing, i) => i === index ? { ...ing, [field]: value } : ing));
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  }

  function addInstruction() {
    setInstructions((prev) => [...prev, ""]);
  }

  function updateInstruction(index: number, value: string) {
    setInstructions((prev) => prev.map((inst, i) => i === index ? value : inst));
  }

  function removeInstruction(index: number) {
    setInstructions((prev) => prev.filter((_, i) => i !== index));
  }

  async function handlePublish() {
    setPublishing(true);
    setPublishError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const finalTitle = title.trim() || (useAI ? "Grandmother's Famous Chocolate Chip Cookies" : "My Recipe");

    const { data: recipe, error } = await supabase
      .from("recipes")
      .insert({
        author_id: user.id,
        title: finalTitle,
        description: description.trim() || null,
        prep_time_minutes: null,
        serves: null,
        difficulty,
        is_published: true,
        is_ai_generated: useAI,
      })
      .select()
      .single();

    if (error || !recipe) {
      setPublishError(error?.message || "Failed to publish. Try again.");
      setPublishing(false);
      return;
    }

    const validIngredients = ingredients.filter((ing) => ing.item.trim());
    const validInstructions = instructions.filter((inst) => inst.trim());

    await Promise.all([
      validIngredients.length > 0
        ? supabase.from("ingredients").insert(
            validIngredients.map((ing, i) => ({
              recipe_id: recipe.id,
              name: ing.item.trim(),
              amount: ing.amount.trim() || null,
              sort_order: i,
            }))
          )
        : Promise.resolve(),
      validInstructions.length > 0
        ? supabase.from("instructions").insert(
            validInstructions.map((inst, i) => ({
              recipe_id: recipe.id,
              step_number: i + 1,
              text: inst.trim(),
            }))
          )
        : Promise.resolve(),
      selectedTags.length > 0
        ? supabase.from("recipe_tags").insert(
            selectedTags.map((tag) => ({ recipe_id: recipe.id, tag }))
          )
        : Promise.resolve(),
    ]);

    router.push(`/recipe/${recipe.slug ?? recipe.id}`);
    router.refresh();
  }

  return (
    <div className="min-h-full bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-border px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-foreground">Create Recipe</h1>
          <p className="text-xs text-muted-foreground">Step {step + 1} of {steps.length}: {steps[step]}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium text-muted-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-accent transition-colors">
            Save Draft
          </button>
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <X size={20} />
          </Link>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-border px-6 py-3">
        <div className="flex items-center gap-0">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i < step ? "bg-primary text-white" : i === step ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}>
                  {i < step ? <Check size={14} /> : i + 1}
                </div>
                <span className={`text-[10px] mt-1 whitespace-nowrap ${i === step ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                  {s}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mt-[-18px] transition-colors ${i < step ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Step 0: Upload & Describe */}
        {step === 0 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-base font-bold text-foreground mb-1">Upload Media</h2>
              <p className="text-sm text-muted-foreground mb-4">Add photos and videos of your recipe</p>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center mb-4 hover:border-primary/50 hover:bg-accent/20 transition-colors cursor-pointer">
                <Upload size={28} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">Upload Recipe Video</p>
                <p className="text-xs text-muted-foreground mt-1">Drag and drop or click to browse</p>
                <button className="mt-3 text-xs font-semibold text-primary border border-primary/30 px-4 py-1.5 rounded-lg hover:bg-primary/5 transition-colors">
                  Upload Video
                </button>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Or Paste YouTube/Vimeo URL</label>
                <input placeholder="https://youtube.com/watch?v=..." className="mt-1 w-full px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
              </div>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center mt-4 cursor-pointer hover:border-primary/50 hover:bg-accent/20 transition-colors">
                <div className="w-10 h-10 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center">
                  <Upload size={16} className="text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">Upload Recipe Photos</p>
                <p className="text-xs text-muted-foreground mt-1">Drag and drop your photos here or click to browse</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-6">
              <h2 className="text-base font-bold text-foreground mb-4">Recipe Details</h2>
              <div className="mb-4">
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Recipe Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g. Grandma's Chocolate Chip Cookies"
                  className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your recipe, ingredients, and cooking process..."
              />
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="text-sm font-bold text-foreground mb-3">How would you like to create your post?</h3>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setUseAI(false)} className={`p-4 rounded-xl border-2 text-left transition-colors ${!useAI ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                  <span className="text-2xl mb-2 block">✏️</span>
                  <p className="text-sm font-semibold text-foreground">Create manually</p>
                  <p className="text-xs text-muted-foreground mt-1">Fill in all the recipe details yourself.</p>
                </button>
                <button onClick={() => setUseAI(true)} className={`p-4 rounded-xl border-2 text-left transition-colors ${useAI ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                  <Sparkles size={22} className="text-primary mb-2" />
                  <p className="text-sm font-semibold text-foreground">Create using AI ✨</p>
                  <p className="text-xs text-muted-foreground mt-1">Let AI generate ingredients, instructions, and details from your description.</p>
                </button>
              </div>
              {useAI && (
                <button onClick={loadAI} className="w-full mt-3 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  <Sparkles size={16} /> Generate with AI
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 1: AI Details (editable) */}
        {step === 1 && (
          <div className="space-y-5">
            {/* Overview */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Check size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">AI Generated — Edit as needed</p>
                  <p className="text-xs text-muted-foreground">Review and adjust ingredients and instructions below.</p>
                </div>
              </div>
              <div className="bg-accent/50 rounded-xl p-3 text-sm font-medium text-foreground">
                {title.trim() || "Grandmother's Famous Chocolate Chip Cookies"}
              </div>
              {description && <p className="text-xs text-muted-foreground mt-2">{description}</p>}
            </div>

            {/* Editable Ingredients */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <h4 className="text-sm font-bold text-foreground mb-3">Ingredients ({ingredients.length})</h4>
              <div className="space-y-2">
                {ingredients.map((ing, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={ing.amount}
                      onChange={(e) => updateIngredient(i, "amount", e.target.value)}
                      placeholder="Amount"
                      className="w-24 shrink-0 px-2.5 py-2 bg-muted/50 border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <input
                      value={ing.item}
                      onChange={(e) => updateIngredient(i, "item", e.target.value)}
                      placeholder="Ingredient"
                      className="flex-1 px-2.5 py-2 bg-muted/50 border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button onClick={() => removeIngredient(i)} className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={addIngredient} className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                <Plus size={14} /> Add ingredient
              </button>
            </div>

            {/* Editable Instructions */}
            <div className="bg-white rounded-2xl border border-border p-5">
              <h4 className="text-sm font-bold text-foreground mb-3">Instructions ({instructions.length})</h4>
              <div className="space-y-3">
                {instructions.map((inst, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center mt-1.5">
                      {i + 1}
                    </span>
                    <textarea
                      value={inst}
                      onChange={(e) => updateInstruction(i, e.target.value)}
                      placeholder={`Step ${i + 1}…`}
                      rows={2}
                      className="flex-1 px-2.5 py-2 bg-muted/50 border border-border rounded-lg text-xs resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <button onClick={() => removeInstruction(i)} className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1 mt-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={addInstruction} className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                <Plus size={14} /> Add step
              </button>
            </div>

            <button onClick={() => setStep(2)} className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors">
              Continue to Settings <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Advanced Settings (manual also shows ingredient/instruction editor) */}
        {step === 2 && (
          <div className="space-y-5">
            {/* Ingredients & Instructions for manual mode */}
            {!useAI && (
              <>
                <div className="bg-white rounded-2xl border border-border p-5">
                  <h4 className="text-sm font-bold text-foreground mb-3">Ingredients</h4>
                  <div className="space-y-2">
                    {ingredients.map((ing, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          value={ing.amount}
                          onChange={(e) => updateIngredient(i, "amount", e.target.value)}
                          placeholder="Amount"
                          className="w-24 shrink-0 px-2.5 py-2 bg-muted/50 border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <input
                          value={ing.item}
                          onChange={(e) => updateIngredient(i, "item", e.target.value)}
                          placeholder="Ingredient"
                          className="flex-1 px-2.5 py-2 bg-muted/50 border border-border rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <button onClick={() => removeIngredient(i)} className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {ingredients.length === 0 && (
                      <p className="text-xs text-muted-foreground py-2">No ingredients yet.</p>
                    )}
                  </div>
                  <button onClick={addIngredient} className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                    <Plus size={14} /> Add ingredient
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-border p-5">
                  <h4 className="text-sm font-bold text-foreground mb-3">Instructions</h4>
                  <div className="space-y-3">
                    {instructions.map((inst, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center mt-1.5">
                          {i + 1}
                        </span>
                        <textarea
                          value={inst}
                          onChange={(e) => updateInstruction(i, e.target.value)}
                          placeholder={`Step ${i + 1}…`}
                          rows={2}
                          className="flex-1 px-2.5 py-2 bg-muted/50 border border-border rounded-lg text-xs resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <button onClick={() => removeInstruction(i)} className="shrink-0 text-muted-foreground hover:text-destructive transition-colors p-1 mt-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    {instructions.length === 0 && (
                      <p className="text-xs text-muted-foreground py-2">No steps yet.</p>
                    )}
                  </div>
                  <button onClick={addInstruction} className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                    <Plus size={14} /> Add step
                  </button>
                </div>
              </>
            )}

            <div className="bg-white rounded-2xl border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">⚙️</span>
                <div>
                  <h2 className="text-sm font-bold text-foreground">Advanced Settings</h2>
                  <p className="text-xs text-muted-foreground">Difficulty, tags, and dietary information</p>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-3">🎯 Difficulty Level</h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {([
                  { label: "Easy", desc: "Basic cooking skills needed" },
                  { label: "Medium", desc: "Some cooking experience helpful" },
                  { label: "Advanced", desc: "Experienced cook recommended" },
                ] as const).map((d) => (
                  <button key={d.label} onClick={() => setDifficulty(d.label)} className={`p-3 rounded-xl border-2 text-left transition-colors ${difficulty === d.label ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                    <p className={`text-sm font-semibold ${difficulty === d.label ? "text-primary" : "text-foreground"}`}>{d.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{d.desc}</p>
                  </button>
                ))}
              </div>
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3"><Tag size={15} /><h3 className="text-sm font-semibold text-foreground">Tags</h3></div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {popularTags.map((tag) => (
                    <button key={tag} onClick={() => toggleTag(tag, selectedTags, setSelectedTags)} className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${selectedTags.includes(tag) ? "bg-primary text-white border-primary" : "bg-white text-muted-foreground border-border hover:border-primary/40"}`}>
                      {tag}
                    </button>
                  ))}
                </div>
                <input placeholder="Add custom tag..." className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3"><Leaf size={15} /><h3 className="text-sm font-semibold text-foreground">Dietary Information</h3></div>
                <div className="flex flex-wrap gap-2">
                  {dietaryTags.map((tag) => (
                    <button key={tag} onClick={() => toggleTag(tag, selectedDietary, setSelectedDietary)} className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${selectedDietary.includes(tag) ? "bg-primary text-white border-primary" : "bg-white text-muted-foreground border-border hover:border-primary/40"}`}>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-accent rounded-xl p-4 mt-4">
                <h4 className="text-xs font-bold text-foreground mb-3">Recipe Summary</h4>
                <div className="grid grid-cols-4 gap-3 text-center">
                  {[
                    { label: "Ingredients", value: ingredients.filter((i) => i.item.trim()).length },
                    { label: "Steps", value: instructions.filter((i) => i.trim()).length },
                    { label: "Tags", value: selectedTags.length },
                    { label: "Dietary", value: selectedDietary.length },
                  ].map((s) => (
                    <div key={s.label}>
                      <p className="text-2xl font-bold text-foreground">{s.value}</p>
                      <p className="text-[11px] text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review & Publish */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-border p-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Ready to Publish!</h2>
            <p className="text-sm text-muted-foreground mb-2">
              Your recipe <strong>{title.trim() || (useAI ? "Grandmother's Famous Chocolate Chip Cookies" : "My Recipe")}</strong> is ready to share with the MyPlattr community.
            </p>
            <div className="flex gap-3 mb-3 justify-center text-xs text-muted-foreground flex-wrap">
              <span>✓ {ingredients.filter((i) => i.item.trim()).length} ingredients</span>
              <span>✓ {instructions.filter((i) => i.trim()).length} steps</span>
              <span>✓ {selectedTags.length} tags</span>
              <span>✓ {difficulty}</span>
            </div>
            {publishError && (
              <p className="text-sm text-red-600 mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{publishError}</p>
            )}
            <div className="flex gap-3">
              <button className="flex-1 text-sm font-medium text-muted-foreground border border-border py-3 rounded-xl hover:bg-accent transition-colors">
                Save as Draft
              </button>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="flex-1 bg-primary text-primary-foreground text-sm font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                {publishing ? "Publishing…" : "Publish Recipe 🎉"}
              </button>
            </div>
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep(step === 2 && !useAI ? 0 : Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground border border-border px-4 py-2.5 rounded-lg hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="text-xs text-muted-foreground">{step + 1} of {steps.length}</span>
          {step < steps.length - 1 && step !== 1 && (
            <button
              onClick={() => setStep(step === 0 && !useAI ? 2 : step + 1)}
              className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Next <ChevronRight size={16} />
            </button>
          )}
          {(step === steps.length - 1 || step === 1) && <div />}
        </div>
      </div>
    </div>
  );
}
