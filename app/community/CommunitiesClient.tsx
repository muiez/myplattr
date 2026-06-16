"use client";

import { useState } from "react";
import { Search, Plus, Users, TrendingUp, BadgeCheck, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";

type Community = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  cover_url: string | null;
  is_verified: boolean;
  members_count: number;
};

interface Props {
  initialCommunities: Community[];
  initialJoinedIds: string[];
  userId: string | null;
}

function fmt(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return String(n);
}

export default function CommunitiesClient({ initialCommunities, initialJoinedIds, userId }: Props) {
  const [communities, setCommunities] = useState(initialCommunities);
  const [joinedIds, setJoinedIds] = useState(new Set(initialJoinedIds));
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", description: "" });
  const [saving, setSaving] = useState(false);

  const filtered = communities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.category ?? "").toLowerCase().includes(search.toLowerCase())
  );
  const mine = filtered.filter((c) => joinedIds.has(c.id));

  async function handleJoin(c: Community) {
    if (!userId) return;
    const supabase = createClient();
    const isJoined = joinedIds.has(c.id);
    if (isJoined) {
      await supabase.from("community_members").delete().match({ community_id: c.id, user_id: userId });
      await supabase.from("communities").update({ members_count: Math.max(0, c.members_count - 1) }).eq("id", c.id);
      setJoinedIds((prev) => { const next = new Set(prev); next.delete(c.id); return next; });
      setCommunities((prev) => prev.map((x) => x.id === c.id ? { ...x, members_count: Math.max(0, x.members_count - 1) } : x));
    } else {
      await supabase.from("community_members").insert({ community_id: c.id, user_id: userId });
      await supabase.from("communities").update({ members_count: c.members_count + 1 }).eq("id", c.id);
      setJoinedIds((prev) => new Set([...prev, c.id]));
      setCommunities((prev) => prev.map((x) => x.id === c.id ? { ...x, members_count: x.members_count + 1 } : x));
    }
  }

  async function handleCreate() {
    if (!userId || !form.name.trim()) return;
    setSaving(true);
    const supabase = createClient();
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { data: newCommunity } = await supabase
      .from("communities")
      .insert({ name: form.name.trim(), slug, description: form.description || null, category: form.category || null, created_by: userId, is_verified: false })
      .select()
      .single();
    if (newCommunity) {
      await supabase.from("community_members").insert({ community_id: newCommunity.id, user_id: userId });
      setCommunities((prev) => [newCommunity, ...prev]);
      setJoinedIds((prev) => new Set([...prev, newCommunity.id]));
    }
    setCreating(false);
    setForm({ name: "", category: "", description: "" });
    setSaving(false);
  }

  function CommunityCard({ c }: { c: Community }) {
    const isJoined = joinedIds.has(c.id);
    return (
      <div className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative">
          {c.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.cover_url} alt={c.name} className="w-full h-36 object-cover" />
          ) : (
            <div className="w-full h-36 bg-gradient-to-br from-[oklch(0.88_0.06_145)] to-[oklch(0.75_0.09_145)]" />
          )}
          <div className="absolute top-2 right-2 flex items-center gap-1">
            {c.is_verified && (
              <span className="bg-white/90 backdrop-blur text-[10px] font-semibold text-primary flex items-center gap-1 px-2 py-0.5 rounded-full">
                <BadgeCheck size={11} /> Verified
              </span>
            )}
          </div>
        </div>
        <div className="p-4">
          {c.category && <p className="text-[10px] font-semibold text-primary uppercase tracking-wide mb-1">{c.category}</p>}
          <h3 className="font-bold text-sm text-foreground leading-snug mb-1">{c.name}</h3>
          {c.description && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{c.description}</p>}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users size={12} /> {fmt(c.members_count)} Members
            </span>
            <button
              onClick={() => handleJoin(c)}
              disabled={!userId}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                isJoined
                  ? "bg-accent text-primary border border-primary/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}
            >
              {isJoined ? "Leave" : "Join Community"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Community</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search communities..."
              className="pl-9 pr-4 py-2 bg-white border border-border rounded-lg text-sm w-52 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3.5 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Plus size={15} /> Create Community
          </button>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-gradient-to-r from-[oklch(0.38_0.11_145)] to-[oklch(0.50_0.13_145)] rounded-2xl p-6 mb-6 text-white">
        <h2 className="text-xl font-bold mb-1">Join Food Communities</h2>
        <p className="text-sm text-white/80 mb-4">Connect with like-minded food enthusiasts and discover new recipes</p>
        <div className="flex items-center gap-6 text-sm">
          <span className="flex items-center gap-2 text-white/90"><Users size={15} />180K+ Active Members</span>
          <span className="flex items-center gap-2 text-white/90"><BadgeCheck size={15} />25+ Communities</span>
          <span className="flex items-center gap-2 text-white/90"><TrendingUp size={15} />Growing Daily</span>
        </div>
      </div>

      <Tabs defaultValue="featured">
        <TabsList className="mb-6 bg-white border border-border rounded-lg h-auto p-1 gap-1 w-full justify-start">
          <TabsTrigger value="mine" className="text-sm px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
            My Communities {mine.length > 0 && <span className="ml-1.5 bg-white/20 text-xs px-1.5 py-0.5 rounded-full">{mine.length}</span>}
          </TabsTrigger>
          <TabsTrigger value="featured" className="text-sm px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
            Featured
          </TabsTrigger>
          <TabsTrigger value="trending" className="text-sm px-5 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md">
            Trending
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mine">
          {mine.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
                <Users size={28} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Join your First Community</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-xs">Discover amazing food communities and connect with people who share your culinary interests.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5">
              {mine.map((c) => <CommunityCard key={c.id} c={c} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="featured">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Featured Communities</h2>
            <div className="grid grid-cols-2 gap-5">
              {filtered.map((c) => <CommunityCard key={c.id} c={c} />)}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trending">
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Trending Communities</h2>
            <div className="grid grid-cols-2 gap-5">
              {[...filtered].sort((a, b) => b.members_count - a.members_count).map((c) => <CommunityCard key={c.id} c={c} />)}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Community Modal */}
      {creating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-foreground">Create Community</h2>
              <button onClick={() => setCreating(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Community Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Italian Kitchen Lovers"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Category</label>
                <input
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  placeholder="e.g. World Cuisine"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="What's this community about?"
                  rows={3}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              {!userId && <p className="text-xs text-destructive">Sign in to create a community.</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setCreating(false)} className="flex-1 border border-border text-sm font-medium py-2.5 rounded-xl hover:bg-accent transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!form.name.trim() || !userId || saving}
                  className="flex-1 bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "Creating…" : "Create Community"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
