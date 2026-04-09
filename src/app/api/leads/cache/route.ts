import { getLeadCache, setLeadCache, type CachedLead } from "@/lib/server-lead-cache";

/** GET — returns the currently cached leads */
export async function GET() {
  return Response.json(getLeadCache());
}

/** POST — stores fresh leads after a search run */
export async function POST(req: Request) {
  try {
    const { leads, businessType, market } = await req.json();

    // Validate leads is an array
    if (!Array.isArray(leads)) {
      return Response.json({ error: "leads must be an array" }, { status: 400 });
    }

    // Max 200 items
    if (leads.length > 200) {
      return Response.json({ error: "leads array must contain ≤200 items" }, { status: 400 });
    }

    // Each lead must have a name field (string)
    for (const lead of leads) {
      if (
        typeof lead !== "object" ||
        lead === null ||
        typeof (lead as { name?: unknown }).name !== "string"
      ) {
        return Response.json(
          { error: "Each lead must be an object with at least a 'name' string field" },
          { status: 400 }
        );
      }
    }

    setLeadCache(leads as CachedLead[], businessType ?? "", market ?? "");
    return Response.json({ ok: true, count: leads.length });
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }
}
