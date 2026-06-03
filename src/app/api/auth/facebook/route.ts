import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL!));
  }

  const appId = process.env.FACEBOOK_APP_ID;
  if (!appId) {
    return NextResponse.json({ error: "Facebook app not configured" }, { status: 503 });
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/facebook/callback`;
  const scope = [
    "instagram_basic",
    "instagram_manage_messages",
    "pages_messaging",
    "pages_read_engagement",
    "pages_show_list",
    "public_profile",
  ].join(",");

  // Encode user id in state so callback knows who connected
  const state = Buffer.from(JSON.stringify({ userId: user.id })).toString("base64url");

  const url = new URL("https://www.facebook.com/v19.0/dialog/oauth");
  url.searchParams.set("client_id", appId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", scope);
  url.searchParams.set("state", state);
  url.searchParams.set("response_type", "code");

  return NextResponse.redirect(url.toString());
}
