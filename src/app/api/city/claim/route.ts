import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { normalizeCity } from "../check/route";

const serviceSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();

  if (authErr || !user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { city } = await req.json() as { city?: string };
  if (!city?.trim()) {
    return Response.json({ error: "city is required" }, { status: 400 });
  }

  const slug = normalizeCity(city);

  const { data, error } = await serviceSupabase.rpc("claim_city_slot", {
    p_city_slug:    slug,
    p_city_display: city.trim(),
    p_user_id:      user.id,
    p_max_slots:    30,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const result = data as { success: boolean; message: string; spotsLeft?: number };

  if (!result.success) {
    return Response.json({ error: result.message, full: true }, { status: 409 });
  }

  return Response.json({ ok: true, spotsLeft: result.spotsLeft ?? 0 });
}
