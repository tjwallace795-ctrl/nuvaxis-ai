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

  return NextResponse.json({ profile: data });
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

  const profileData = {
    id: user.id,
    name: body.name ?? "",
    business_name: body.businessName ?? "",
    industry: body.industry ?? "Business",
    niche: body.niche ?? "",
    location: body.location ?? "",
    email: body.email ?? user.email ?? "",
    phone: body.phone ?? "",
    website: body.website ?? "",
    bio: body.bio ?? "",
    social_instagram: body.socialAccounts?.instagram ?? "",
    social_tiktok: body.socialAccounts?.tiktok ?? "",
    social_youtube: body.socialAccounts?.youtube ?? "",
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("profiles")
    .upsert(profileData, { onConflict: "id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
