import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

const serviceSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: tokens } = await serviceSupabase
    .from("social_tokens")
    .select("platform, platform_username, page_name, updated_at")
    .eq("user_id", user.id);

  // Report which platform apps are configured (env vars present)
  const configured = {
    facebook: !!process.env.FACEBOOK_APP_ID,
    twitter:  !!process.env.TWITTER_CLIENT_ID,
    tiktok:   !!process.env.TIKTOK_CLIENT_KEY,
  };

  const connected: Record<string, { username: string; connectedAt: string }> = {};
  for (const t of tokens ?? []) {
    connected[t.platform] = {
      username:    t.platform_username ?? t.page_name ?? "",
      connectedAt: t.updated_at,
    };
  }

  return Response.json({ connected, configured });
}

export async function DELETE(req: Request) {
  const supabase = await createServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { platform } = await req.json() as { platform: string };
  if (!platform) {
    return Response.json({ error: "platform required" }, { status: 400 });
  }

  await serviceSupabase
    .from("social_tokens")
    .delete()
    .eq("user_id", user.id)
    .eq("platform", platform);

  // If disconnecting instagram, also remove the linked instagram token
  if (platform === "facebook") {
    await serviceSupabase
      .from("social_tokens")
      .delete()
      .eq("user_id", user.id)
      .eq("platform", "instagram");
  }

  return Response.json({ ok: true });
}
