/**
 * Wallace Roofing — SMS Handler Worker
 *
 * Twilio calls this on every inbound SMS.
 * Routes to Wally (AI) or handles uncle control commands.
 */

import { SYSTEM_PROMPT } from './prompt.js';

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') return new Response('OK');

    const form = await request.formData();
    const from = form.get('From') || '';
    const body = (form.get('Body') || '').trim();

    // ── 1. STOP / opt-out
    if (/^(stop|unsubscribe|cancel|end|quit)$/i.test(body)) {
      await markState(from, 'OPTED_OUT', env);
      return twiml('You have been unsubscribed from Wallace Roofing texts. Reply START to opt back in. For urgent help call (903) 555-0000.');
    }

    // ── 2. Uncle control commands (from his phone number)
    if (from === env.UNCLE_PHONE) {
      const response = await handleUncleCommand(body, env);
      if (response !== null) return twiml(response);
      // Not a command — fall through (uncle texted in as a customer)
    }

    // ── 3. Look up conversation
    const convoRaw = await env.LEADS.get(`convo:${from}`);
    if (!convoRaw) {
      return twiml(`Thanks for reaching out! For the fastest help, fill out the form at wallaceroofingco.com or call (903) 555-0000 directly.`);
    }

    // ── 4. Look up lead state
    const leadId = await env.LEADS.get(`phone:${from}`);
    if (!leadId) return twiml('');

    const leadRaw = await env.LEADS.get(`lead:${leadId}`);
    if (!leadRaw) return twiml('');

    const lead = JSON.parse(leadRaw);

    if (lead.state === 'UNCLE_TAKEN_OVER' || lead.state === 'OPTED_OUT') {
      return twiml(''); // AI stays silent
    }

    // ── 5. Append user message to history
    const convo = JSON.parse(convoRaw);
    convo.push({ role: 'user', content: body, timestamp: Date.now() });

    // ── 6. Build Gemini request
    const systemPrompt = SYSTEM_PROMPT
      .replace('{LEAD_CONTEXT_JSON}', JSON.stringify(lead, null, 2))
      .replace('{CURRENT_TIME_LOCAL}', formatCentral(new Date()))
      .replace('{CURRENT_STATE}', lead.state);

    const geminiMessages = convo.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    let rawReply = await callGemini(geminiMessages, systemPrompt, env);

    // ── 7. Parse state tag
    const { reply, stateTag } = parseStateTag(rawReply);

    // ── 8. Apply state transitions
    if (stateTag) {
      const isFirstHandoff = stateTag.handoff && !lead.handedOff;
      lead.state = stateTag.state || lead.state;
      lead.lastReason = stateTag.reason;
      if (stateTag.scheduled) lead.scheduledAt = stateTag.scheduled;

      if (isFirstHandoff) {
        lead.handedOff = true;
        await sendUncleHandoff(lead, convo, env);
      }

      await env.LEADS.put(`lead:${leadId}`, JSON.stringify(lead));
    }

    // ── 9. Save updated conversation
    convo.push({ role: 'assistant', content: reply, timestamp: Date.now() });
    await env.LEADS.put(`convo:${from}`, JSON.stringify(convo));

    // SMS hard cap — stay under carrier segment limits
    const finalReply = reply.length > 320 ? reply.slice(0, 317) + '...' : reply;
    return twiml(finalReply);
  },
};

// ─── Gemini ─────────────────────────────────────────────────────���──────────────

async function callGemini(messages, systemPrompt, env) {
  const fallback = "Sorry, quick hiccup on my end — if this is urgent, call (903) 555-0000 directly.";
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: messages,
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { temperature: 0.7, maxOutputTokens: 350 },
        }),
      }
    );
    if (!r.ok) {
      console.error('Gemini HTTP error:', r.status);
      return fallback;
    }
    const j = await r.json();
    return j.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || fallback;
  } catch (err) {
    console.error('Gemini error:', err);
    return fallback;
  }
}

// ─── State tag parsing ───────────────────────────���─────────────────────────────

function parseStateTag(rawReply) {
  const match = rawReply.match(/###STATE###\s*(\{[\s\S]*?\})\s*$/);
  if (!match) return { reply: rawReply, stateTag: null };

  let stateTag = null;
  try {
    stateTag = JSON.parse(match[1]);
  } catch (e) {
    console.error('State tag parse error:', match[1]);
  }

  const reply = rawReply.replace(/###STATE###[\s\S]*$/, '').trim();
  return { reply, stateTag };
}

// ─── Uncle handoff SMS ─────────────────────────────────────────────────────────

async function sendUncleHandoff(lead, convo, env) {
  const isEmergency = lead.state === 'EMERGENCY';
  const prefix = isEmergency ? '🚨 URGENT — ' : '✅ Lead ready: ';
  const sched = lead.scheduledAt
    ? `\n🗓 Tentative: ${formatCentral(new Date(lead.scheduledAt))}`
    : '';

  const summary = `${prefix}${lead.name}
📞 ${lead.phone_e164}
📍 ${lead.address || 'No address'}
🔧 ${lead.service} (${lead.urgency || 'flexible'})${lead.description ? `\n💬 "${lead.description}"` : ''}
📋 ${lead.lastReason || 'Ready for follow-up'}${sched}

To take over: reply "TAKE OVER ${lead.phone_e164}"`;

  await sendSms(env.UNCLE_PHONE, summary, env);
}

// ─── Uncle command handler ─────────────────────────────────────────────────────

async function handleUncleCommand(body, env) {
  const upper = body.trim().toUpperCase();

  // TAKE OVER +19035552841  →  silence AI for that number
  const takeOver = body.match(/^TAKE\s+OVER\s+(\+?[\d\s\-()]+)$/i);
  if (takeOver) {
    const e164 = normalizePhone(takeOver[1]);
    const err = await setLeadState(e164, 'UNCLE_TAKEN_OVER', env);
    if (err) return `No lead found for ${e164}.`;
    return `✓ Wally is silenced for ${e164}. Text or call them directly.`;
  }

  // RESUME +19035552841  →  re-enable AI
  const resume = body.match(/^RESUME\s+(\+?[\d\s\-()]+)$/i);
  if (resume) {
    const e164 = normalizePhone(resume[1]);
    const err = await setLeadState(e164, 'QUALIFYING', env);
    if (err) return `No lead found for ${e164}.`;
    return `✓ Wally is back on for ${e164}.`;
  }

  // STATUS +19035552841  →  quick lead summary
  const status = body.match(/^STATUS\s+(\+?[\d\s\-()]+)$/i);
  if (status) {
    const e164 = normalizePhone(status[1]);
    const leadId = await env.LEADS.get(`phone:${e164}`);
    if (!leadId) return `No lead found for ${e164}.`;
    const lead = JSON.parse(await env.LEADS.get(`lead:${leadId}`));
    return `${lead.name} — ${lead.state}\n${lead.address || 'No address'}\nService: ${lead.service}\nLast: ${lead.lastReason || 'n/a'}`;
  }

  // HELP  →  command list
  if (upper === 'HELP') {
    return `Wally commands:\nTAKE OVER {phone} — silence AI\nRESUME {phone} — re-enable AI\nSTATUS {phone} — lead summary\nHELP — this list`;
  }

  return null; // not a command
}

// ─── Helpers ───────────────────────────���─────────────────────────���─────────────

async function setLeadState(e164, state, env) {
  const leadId = await env.LEADS.get(`phone:${e164}`);
  if (!leadId) return 'not found';
  const lead = JSON.parse(await env.LEADS.get(`lead:${leadId}`));
  lead.state = state;
  await env.LEADS.put(`lead:${leadId}`, JSON.stringify(lead));
  return null;
}

async function markState(phone, state, env) {
  return setLeadState(phone, state, env);
}

function normalizePhone(raw) {
  const digits = raw.replace(/\D/g, '');
  return digits.length === 10 ? `+1${digits}` : `+${digits}`;
}

function formatCentral(date) {
  return date.toLocaleString('en-US', {
    timeZone: 'America/Chicago',
    weekday: 'short', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

async function sendSms(to, body, env) {
  const auth = btoa(`${env.TWILIO_SID}:${env.TWILIO_TOKEN}`);
  const r = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_SID}/Messages.json`,
    {
      method: 'POST',
      headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ To: to, From: env.TWILIO_FROM, Body: body }),
    }
  );
  if (!r.ok) console.error('Twilio error:', r.status, await r.text());
}

function twiml(message) {
  const escaped = message
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/'/g, '&apos;').replace(/"/g, '&quot;');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><Response>${message ? `<Message>${escaped}</Message>` : ''}</Response>`,
    { headers: { 'Content-Type': 'text/xml' } }
  );
}
