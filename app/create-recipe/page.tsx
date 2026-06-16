"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, Sparkles, ChevronRight, ChevronLeft, Check, Clock, Users, Tag, Leaf, RefreshCw } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const steps = ["Upload Media and Describe", "AI Details", "Advanced Settings", "Review"];
const popularTags = ["Quick & Easy", "Healthy", "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Low-Carb", "High Protein", "Meal prep", "One-Pot", "30-Minute", "Budget Friendly", "Comfort Food", "Date Night", "Kid-Friendly", "Spicy", "Sweet", "Savory"];
const dietaryTags = ["Vegetarian", "Vegan", "Gluten-Free", "Nut-Free", "Egg-Free", "Soy-Free", "Low-Carb", "Keto", "Paleo", "Mediterranean", "Whole30"];

const aiRecipe = {
  title: "Grandmother's Famous Chocolate Chip Cookies",
  description: "These irresistible chocolate chip cookies are crispy on the outside, perfectly chewy on the inside, and loaded with chocolate chips. A timeless family recipe that brings comfort and joy to every bite.",
  tags: ["Desserts", "American"],
  prepTime: "15 mins total",
  prepMinutes: 15,
  serves: 36,
  difficulty: "Easy" as const,
  ingredients: [
    { amount: "2.25 cups", item: "All-purpose flour" },
    { amount: "1 tsp", item: "Salt" },
    { amount: "0.75 cup", item: "Granulated sugar" },
    { amount: "1 tbsp", item: "Vanilla extract" },
    { amount: "2 cups", item: "Chocolate chips" },
    { amount: "1 tsp", item: "Baking Soda" },
    { amount: "1 cup", item: "Butter (softened)" },
    { amount: "0.75 cup", item: "Brown sugar (packed)" },
    { amount: "2 pieces", item: "Large eggs" },
  ],
  instructions: [
    "Preheat oven to 375°F (190°C). Line baking sheets with parchment paper.",
    "In a medium bowl, whisk together flour, baking soda, and salt. Set aside.",
    "In a large bowl, cream together softened butter and both sugars until light and fluffy, about 2-3 minutes.",
    "Beat in eggs one at a time, then add vanilla extract.",
    "Gradually mix in the flour mixture until just combined. Don't overmix.",
    "Fold in chocolate chips until evenly distributed.",
    "Drop rounded tablespoons of dough onto prepared baking sheets, spacing them 2 inches apart.",
    "Bake for 9-11 minutes or until edges are golden brown. Centers may look slightly underbaked.",
    "Cool on baking sheet for 5 minutes before transferring to a wire rack.",
  ],
};

export default function CreateRecipePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [useAI, setUseAI] = useState(true);
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Quick & Easy", "Healthy"]);
  const [selectedDietary, setSelectedDietary] = useState<string[]>(["Gluten-Free"]);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Advanced">("Easy");
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const toggleTag = (tag: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(tag) ? list.filter((t) => t !== tag) : [...list, tag]);
  };

  async function handlePublish() {
    setPublishing(true);
    setPublishError(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data: recipe, error } = await supabase
      .from("recipes")
      .insert({
        author_id: user.id,
        title: aiRecipe.title,
        description: description || aiRecipe.description,
        category: aiRecipe.tags[0] || null,
        prep_time_minutes: aiRecipe.prepMinutes,
        serves: aiRecipe.serves,
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

    await Promise.all([
      supabase.from("ingredients").insert(
        aiRecipe.ingredients.map((ing, i) => ({
          recipe_id: recipe.id,
          name: ing.item,
          amount: ing.amount,
          sort_order: i,
        }))
      ),
      supabase.from("instructions").insert(
        aiRecipe.instructions.map((inst, i) => ({
          recipe_id: recipe.id,
          step_number: i + 1,
          text: inst,
        }))
      ),
    ]);

    router.push("/profile");
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
              <h2 className="text-base font-bold text-foreground mb-1">Describe Recipe</h2>
              <p className="text-xs text-muted-foreground mb-3">Describe your recipe, ingredients, cooking process, or any details that would help create the perfect post.</p>
              <textarea
                className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Type your recipe description here... Eg: 'This is my grandmother's famous chocolate chip cookie recipe. They're crispy on the outside, chewy on the inside!'"
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
                <button onClick={() => setStep(1)} className="w-full mt-3 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  <Sparkles size={16} /> Generate with AI
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 1: AI Details */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-border p-5">
              <div className="flex flex-col items-center py-4 mb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Check size={20} className="text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">AI Generated Recipe Details</p>
                <p className="text-xs text-muted-foreground mt-1">Review the generated content below.</p>
              </div>
              <div className="border border-border rounded-xl p-4 mb-4">
                <h3 className="text-sm font-bold text-foreground mb-1">Recipe Overview</h3>
                <h2 className="text-base font-bold text-foreground">{aiRecipe.title}</h2>
                <p className="text-xs text-muted-foreground mt-1.5">{description || aiRecipe.description}</p>
                <div className="flex gap-2 mt-2">
                  {aiRecipe.tags.map((t) => <span key={t} className="text-[11px] bg-accent text-accent-foreground px-2.5 py-0.5 rounded-full">{t}</span>)}
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock size={12} />Prep: {aiRecipe.prepTime}</span>
                  <span className="flex items-center gap-1"><Users size={12} />Serves: {aiRecipe.serves}</span>
                  <span className="flex items-center gap-1"><Leaf size={12} />{aiRecipe.difficulty}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-xs font-bold text-foreground mb-2">Ingredients ({aiRecipe.ingredients.length})</h4>
                  <div className="space-y-1">
                    {aiRecipe.ingredients.map((ing) => (
                      <div key={ing.item} className="flex items-baseline gap-2">
                        <span className="text-xs font-semibold text-foreground shrink-0">{ing.amount}</span>
                        <span className="text-xs text-muted-foreground">{ing.item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground mb-2">Instructions ({aiRecipe.instructions.length})</h4>
                  <div className="space-y-2">
                    {aiRecipe.instructions.slice(0, 5).map((inst, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        <p className="text-xs text-muted-foreground">{inst}</p>
                      </div>
                    ))}
                    {aiRecipe.instructions.length > 5 && (
                      <p className="text-xs text-primary font-semibold">+{aiRecipe.instructions.length - 5} more steps...</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground border border-border py-2.5 rounded-xl hover:bg-accent transition-colors">
                  <RefreshCw size={14} /> Regenerate All
                </button>
                <button onClick={() => setStep(2)} className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
                  Accept all &amp; Continue <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Advanced Settings */}
        {step === 2 && (
          <div className="space-y-5">
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
                    { label: "Ingredients", value: aiRecipe.ingredients.length },
                    { label: "Steps", value: aiRecipe.instructions.length },
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
              Your recipe <strong>{aiRecipe.title}</strong> is ready to share with the MyPlattr community.
            </p>
            <div className="flex gap-3 mb-3 justify-center text-xs text-muted-foreground">
              <span>✓ {aiRecipe.ingredients.length} ingredients</span>
              <span>✓ {aiRecipe.instructions.length} steps</span>
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
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground border border-border px-4 py-2.5 rounded-lg hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="text-xs text-muted-foreground">{step + 1} of {steps.length}</span>
          {step < steps.length - 1 && (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Next <ChevronRight size={16} />
            </button>
          )}
          {step === steps.length - 1 && <div />}
        </div>
      </div>
    </div>
  );
}
