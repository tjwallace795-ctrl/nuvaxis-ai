import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export function normalizeCity(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = (searchParams.get("city") ?? "").trim();

  if (!city) {
    return Response.json({ error: "city param required" }, { status: 400 });
  }

  const slug = normalizeCity(city);

  const { data, error } = await supabase
    .from("city_slots")
    .select("active_count, max_slots, city_display")
    .eq("city_slug", slug)
    .maybeSingle();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    // City not yet in table → all 30 slots open
    return Response.json({ available: true, spotsLeft: 30, maxSlots: 30, slug });
  }

  const spotsLeft = data.max_slots - data.active_count;
  return Response.json({
    available: spotsLeft > 0,
    spotsLeft: Math.max(0, spotsLeft),
    maxSlots: data.max_slots,
    slug,
  });
}
