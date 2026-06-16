import { createClient } from "@/lib/supabase/server";
import RewardsClient from "./RewardsClient";

export default async function RewardsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: challenges }, { data: profile }, { data: joined }] = await Promise.all([
    supabase.from("challenges").select("*").order("ends_at", { ascending: true }),
    user ? supabase.from("profiles").select("xp_points, streak").eq("id", user.id).single() : Promise.resolve({ data: null }),
    user ? supabase.from("challenge_participants").select("challenge_id").eq("user_id", user.id) : Promise.resolve({ data: [] }),
  ]);

  const joinedIds = new Set((joined ?? []).map((r: { challenge_id: string }) => r.challenge_id));

  return (
    <RewardsClient
      challenges={challenges ?? []}
      joinedIds={Array.from(joinedIds)}
      userId={user?.id ?? null}
      xpPoints={profile?.xp_points ?? 0}
      streak={profile?.streak ?? 0}
    />
  );
}
