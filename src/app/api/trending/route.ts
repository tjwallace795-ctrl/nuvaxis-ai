interface SerperVideoResult {
  title: string;
  link: string;
  snippet?: string;
  imageUrl?: string;
  duration?: string;
  source?: string;
  channel?: string;
  date?: string;
}

interface SerperVideoResponse {
  videos?: SerperVideoResult[];
}

export async function POST(req: Request) {
  try {
    const { industry } = await req.json();
    const apiKey = process.env.SERPER_API_KEY;

    if (!apiKey) {
      return Response.json({ videos: [] });
    }

    const query = `${industry} tips trending TikTok YouTube 2026`;

    const res = await fetch("https://google.serper.dev/videos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({ q: query, num: 8 }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return Response.json({ videos: [] });
    }

    const data: SerperVideoResponse = await res.json();
    const videos = (data.videos ?? []).slice(0, 8).map((v) => ({
      title: v.title,
      link: v.link,
      snippet: v.snippet ?? "",
      imageUrl: v.imageUrl ?? "",
      duration: v.duration ?? "",
      channel: v.channel ?? v.source ?? "Unknown",
      date: v.date ?? "",
    }));

    return Response.json({ videos });
  } catch (error) {
    console.error("Trending API error:", error);
    return Response.json({ videos: [] });
  }
}
