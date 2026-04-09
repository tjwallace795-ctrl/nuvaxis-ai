/**
 * Email send API — uses Resend (https://resend.com) to deliver emails.
 * Set RESEND_API_KEY in .env.local.
 * The "from" address must be a verified domain in your Resend account.
 */

/** Simple email format validator. */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Strip HTML tags from a string. */
function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, "");
}

export async function POST(req: Request) {
  try {
    const { to, subject, body, fromName, fromEmail } = await req.json();

    if (!to || !subject || !body) {
      return Response.json({ error: "Missing required fields: to, subject, body" }, { status: 400 });
    }

    // Validate email format
    const toAddr = Array.isArray(to) ? to[0] : to;
    if (typeof toAddr !== "string" || !isValidEmail(toAddr)) {
      return Response.json({ error: "Invalid 'to' email address" }, { status: 400 });
    }

    // Validate field lengths
    if (typeof subject !== "string" || subject.length > 200) {
      return Response.json({ error: "Subject must be a string of ≤200 characters" }, { status: 400 });
    }
    if (typeof body !== "string" || body.length > 5_000) {
      return Response.json({ error: "Body must be a string of ≤5,000 characters" }, { status: 400 });
    }

    // Strip HTML from body to prevent injection
    const safeBody = stripHtml(body);

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return Response.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
    }

    // Default from address — user can override via settings
    const from = fromEmail
      ? `${fromName || "Nuvaxis AI"} <${fromEmail}>`
      : `Nuvaxis AI <onboarding@resend.dev>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        text: safeBody,
        // Convert line breaks to simple HTML for nicer rendering (uses sanitized body)
        html: `<div style="font-family:sans-serif;line-height:1.6;max-width:600px">${safeBody
          .split("\n")
          .map((l: string) => `<p style="margin:0 0 12px">${l}</p>`)
          .join("")}</div>`,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return Response.json(
        { error: (err as { message?: string }).message || `Resend error ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return Response.json({ ok: true, id: data.id });
  } catch (error) {
    console.error("Email send error:", error);
    return Response.json({ error: "Failed to send email" }, { status: 500 });
  }
}
