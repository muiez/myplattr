import { createClient } from "@/lib/supabase/server";
import CommunitiesClient from "./CommunitiesClient";

export default async function CommunityPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: communities }, { data: joined }] = await Promise.all([
    supabase.from("communities").select("*").order("members_count", { ascending: false }),
    user
      ? supabase.from("community_members").select("community_id").eq("user_id", user.id)
      : Promise.resolve({ data: [] }),
  ]);

  const joinedIds = new Set((joined ?? []).map((r: { community_id: string }) => r.community_id));

  return (
    <CommunitiesClient
      initialCommunities={communities ?? []}
      initialJoinedIds={Array.from(joinedIds)}
      userId={user?.id ?? null}
    />
  );
}
