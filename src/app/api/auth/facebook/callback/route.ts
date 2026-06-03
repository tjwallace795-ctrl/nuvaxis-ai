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
    return NextResponse.redirect(`${appUrl}/dashboard?social=error&platform=facebook`);
  }

  let userId: string;
  try {
    const decoded = JSON.parse(Buffer.from(state, "base64url").toString());
    userId = decoded.userId;
  } catch {
    return NextResponse.redirect(`${appUrl}/dashboard?social=error&platform=facebook`);
  }

  const redirectUri = `${appUrl}/api/auth/facebook/callback`;

  // Exchange code for user access token
  const tokenRes = await fetch(
    `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`
  );
  const tokenData = await tokenRes.json() as { access_token?: string; error?: { message: string } };

  if (!tokenData.access_token) {
    return NextResponse.redirect(`${appUrl}/dashboard?social=error&platform=facebook`);
  }

  // Get user info
  const meRes = await fetch(
    `https://graph.facebook.com/v19.0/me?fields=id,name&access_token=${tokenData.access_token}`
  );
  const me = await meRes.json() as { id?: string; name?: string };

  // Get pages (for Messenger + Instagram Business)
  const pagesRes = await fetch(
    `https://graph.facebook.com/v19.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=${tokenData.access_token}`
  );
  const pagesData = await pagesRes.json() as {
    data?: { id: string; name: string; access_token: string; instagram_business_account?: { id: string } }[]
  };

  const page = pagesData.data?.[0];

  // Store Facebook token
  await serviceSupabase.from("social_tokens").upsert({
    user_id:           userId,
    platform:          "facebook",
    access_token:      tokenData.access_token,
    platform_user_id:  me.id ?? "",
    platform_username: me.name ?? "",
    page_id:           page?.id ?? null,
    page_name:         page?.name ?? null,
    page_access_token: page?.access_token ?? null,
    updated_at:        new Date().toISOString(),
  }, { onConflict: "user_id,platform" });

  // If page has Instagram Business account, store Instagram token too
  if (page?.instagram_business_account?.id) {
    await serviceSupabase.from("social_tokens").upsert({
      user_id:           userId,
      platform:          "instagram",
      access_token:      page.access_token,
      platform_user_id:  page.instagram_business_account.id,
      platform_username: page.name ?? "",
      page_id:           page.id,
      page_access_token: page.access_token,
      updated_at:        new Date().toISOString(),
    }, { onConflict: "user_id,platform" });
  }

  return NextResponse.redirect(`${appUrl}/dashboard?social=connected&platform=facebook`);
}
