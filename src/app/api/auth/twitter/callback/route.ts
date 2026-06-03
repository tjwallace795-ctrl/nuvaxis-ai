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
    return NextResponse.redirect(`${appUrl}/dashboard?social=error&platform=twitter`);
  }

  let userId: string, codeVerifier: string;
  try {
    const decoded = JSON.parse(Buffer.from(state, "base64url").toString());
    userId = decoded.userId;
    codeVerifier = decoded.codeVerifier;
  } catch {
    return NextResponse.redirect(`${appUrl}/dashboard?social=error&platform=twitter`);
  }

  const redirectUri = `${appUrl}/api/auth/twitter/callback`;
  const credentials = Buffer.from(
    `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
  ).toString("base64");

  // Exchange code for token
  const tokenRes = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      code,
      grant_type:    "authorization_code",
      redirect_uri:  redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  const tokenData = await tokenRes.json() as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    error?: string;
  };

  if (!tokenData.access_token) {
    return NextResponse.redirect(`${appUrl}/dashboard?social=error&platform=twitter`);
  }

  // Get user info
  const meRes = await fetch("https://api.twitter.com/2/users/me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const me = await meRes.json() as { data?: { id: string; username: string; name: string } };

  const expiresAt = tokenData.expires_in
    ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
    : null;

  await serviceSupabase.from("social_tokens").upsert({
    user_id:           userId,
    platform:          "twitter",
    access_token:      tokenData.access_token,
    refresh_token:     tokenData.refresh_token ?? null,
    expires_at:        expiresAt,
    platform_user_id:  me.data?.id ?? "",
    platform_username: me.data?.username ? `@${me.data.username}` : "",
    updated_at:        new Date().toISOString(),
  }, { onConflict: "user_id,platform" });

  return NextResponse.redirect(`${appUrl}/dashboard?social=connected&platform=twitter`);
}
