import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const serviceSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code  = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  if (error || !code || !state) {
    return NextResponse.redirect(`${appUrl}/dashboard?social=error&platform=tiktok`);
  }

  let userId: string;
  try {
    const decoded = JSON.parse(Buffer.from(state, "base64url").toString());
    userId = decoded.userId;
  } catch {
    return NextResponse.redirect(`${appUrl}/dashboard?social=error&platform=tiktok`);
  }

  const redirectUri = `${appUrl}/api/auth/tiktok/callback`;

  // Exchange code for token
  const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key:    process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      code,
      grant_type:    "authorization_code",
      redirect_uri:  redirectUri,
    }),
  });

  const tokenData = await tokenRes.json() as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    open_id?: string;
    error?: string;
  };

  if (!tokenData.access_token) {
    return NextResponse.redirect(`${appUrl}/dashboard?social=error&platform=tiktok`);
  }

  // Get user info
  const userRes = await fetch("https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,username", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userRes.json() as { data?: { user?: { open_id: string; display_name: string; username?: string } } };
  const tiktokUser = userData.data?.user;

  const expiresAt = tokenData.expires_in
    ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
    : null;

  await serviceSupabase.from("social_tokens").upsert({
    user_id:           userId,
    platform:          "tiktok",
    access_token:      tokenData.access_token,
    refresh_token:     tokenData.refresh_token ?? null,
    expires_at:        expiresAt,
    platform_user_id:  tiktokUser?.open_id ?? tokenData.open_id ?? "",
    platform_username: tiktokUser?.username
      ? `@${tiktokUser.username}`
      : tiktokUser?.display_name ?? "",
    updated_at:        new Date().toISOString(),
  }, { onConflict: "user_id,platform" });

  return NextResponse.redirect(`${appUrl}/dashboard?social=connected&platform=tiktok`);
}
