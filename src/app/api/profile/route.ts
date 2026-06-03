import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map plan → subscription_status so the dashboard can gate features correctly
  const planToStatus: Record<string, string> = {
    premium:  "agency",
    business: "pro",
    "solo-pro": "starter",
    starter:  "starter",
  };

  return NextResponse.json({
    profile: {
      ...data,
      subscription_status: planToStatus[data?.plan ?? ""] ?? "free",
    },
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Map subscription_status back to plan string if provided
  const statusToPlan: Record<string, string> = {
    agency:  "premium",
    pro:     "business",
    starter: "starter",
    free:    "",
  };

  const profileData: Record<string, unknown> = {
    id: user.id,
    updated_at: new Date().toISOString(),
  };

  if (body.name         !== undefined) profileData.name             = body.name;
  if (body.businessName !== undefined) profileData.business_name    = body.businessName;
  if (body.industry     !== undefined) profileData.industry         = body.industry;
  if (body.niche        !== undefined) profileData.niche            = body.niche;
  if (body.location     !== undefined) profileData.location         = body.location;
  if (body.email        !== undefined) profileData.email            = body.email ?? user.email;
  if (body.phone        !== undefined) profileData.phone            = body.phone;
  if (body.website      !== undefined) profileData.website          = body.website;
  if (body.bio          !== undefined) profileData.bio              = body.bio;
  if (body.botName      !== undefined) profileData.bot_name         = body.botName;
  if (body.goal         !== undefined) profileData.goal             = body.goal;
  if (body.setupComplete!== undefined) profileData.setup_complete   = body.setupComplete;
  if (body.socialAccounts) {
    profileData.social_instagram = body.socialAccounts.instagram ?? "";
    profileData.social_tiktok    = body.socialAccounts.tiktok    ?? "";
    profileData.social_youtube   = body.socialAccounts.youtube   ?? "";
  }
  // Allow direct plan update from subscription_status (set after Stripe checkout)
  if (body.subscription_status) {
    const plan = statusToPlan[body.subscription_status];
    if (plan !== undefined) profileData.plan = plan;
  }

  const { error } = await supabase
    .from("profiles")
    .upsert(profileData, { onConflict: "id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
