"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  profile: {
    full_name: string | null;
    username: string;
    bio: string | null;
    location: string | null;
    website: string | null;
  };
  userId: string;
}

export default function EditProfileModal({ profile, userId }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    full_name: profile.full_name ?? "",
    username: profile.username ?? "",
    bio: profile.bio ?? "",
    location: profile.location ?? "",
    website: profile.website ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSave() {
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name.trim() || null,
        username: form.username.trim(),
        bio: form.bio.trim() || null,
        location: form.location.trim() || null,
        website: form.website.trim() || null,
      })
      .eq("id", userId);

    if (err) {
      setError(err.message);
    } else {
      setOpen(false);
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 border border-border text-sm font-medium text-foreground px-3 py-1.5 rounded-lg hover:bg-accent transition-colors"
      >
        Edit Profile
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-foreground">Edit Profile</h2>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Full Name</label>
                <input
                  value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                  placeholder="Your name"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Username</label>
                <input
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  placeholder="username"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  placeholder="Tell the community about yourself..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Location</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="New York, NY"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Website</label>
                <input
                  value={form.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  placeholder="https://yoursite.com"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              {error && <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}
              <div className="flex gap-3 pt-1">
                <button onClick={() => setOpen(false)} className="flex-1 border border-border text-sm font-medium py-2.5 rounded-xl hover:bg-accent transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.username.trim()}
                  className="flex-1 bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
