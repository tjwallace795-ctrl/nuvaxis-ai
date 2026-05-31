# BIMI Setup for Wallace Roofing Co LLC

To make your logo appear as the profile picture next to emails in Gmail, Yahoo, and Apple Mail.

---

## What You Need to Add to Your Domain DNS

### Step 1: DMARC Record (REQUIRED)

Add this TXT record to your domain DNS (through your domain registrar or DNS provider):

| Type | Name | Value |
|------|------|-------|
| TXT | `_dmarc.wallaceroofingco.com` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@wallaceroofingco.com; pct=100;` |

**Note:** The `p=quarantine` policy is required for BIMI. This tells email providers to quarantine (spam-folder) emails that fail authentication. Since your emails are properly authenticated through Resend, this won't affect your legitimate emails.

### Step 2: BIMI Record

Add this TXT record to your domain DNS:

| Type | Name | Value |
|------|------|-------|
| TXT | `default._bimi.wallaceroofingco.com` | `v=BIMI1; l=https://wallaceroofingco.com/images/logo-bimi.svg;` |

---

## File to Upload

Upload `logo-bimi.svg` (created in your `images/` folder) to your website at:

```
https://wallaceroofingco.com/images/logo-bimi.svg
```

This file is a simple "W" logo on your brand red (#CC2A00) background. It meets all BIMI requirements.

---

## How Long Does It Take?

- DNS changes: 15 minutes to 24 hours
- Gmail/Yahoo showing your logo: 1-7 days after DNS is live
- Apple Mail: Can take up to 30 days

---

## Alternative: Get a Full-Color Logo (Optional Upgrade)

The simple "W" logo works for BIMI, but if you want your full Wallace Roofing logo to show instead, you'll need:
1. A designer to convert your `logo.png` to a proper Tiny SVG 1.2 format
2. Optionally a Verified Mark Certificate (VMC) from Digicert or Entrust (~$1,500/year) — required by Gmail for full-color logos

Without a VMC, Gmail will still show your logo if you use a simplified one-color design (which is what the `logo-bimi.svg` is).
