@echo off
cd /d "%~dp0lead-handler"

:: ─────────────────────────────────────────────────────
:: STEP 1 — SignalWire (from reeltycheck.signalwire.com → API tab)
:: ─────────────────────────────────────────────────────

:: Your Project ID (the long UUID on the API page)
echo PASTE YOUR SIGNALWIRE PROJECT ID THEN PRESS ENTER:
wrangler secret put SW_PROJECT_ID

:: Your API Token (click the eye icon to reveal it on the API page)
echo PASTE YOUR SIGNALWIRE API TOKEN THEN PRESS ENTER:
wrangler secret put SW_TOKEN

:: Your SignalWire phone number — format: +19031234567
:: (Buy one at Phone Numbers → Buy a Number → area code 903)
echo TYPE YOUR SIGNALWIRE PHONE NUMBER (+1903XXXXXXX) THEN PRESS ENTER:
wrangler secret put SW_FROM

:: ─────────────────────────────────────────────────────
:: STEP 2 — Uncle's phone (the real mobile Wally texts)
:: ─────────────────────────────────────────────────────
echo TYPE YOUR UNCLE'S MOBILE NUMBER (+1903XXXXXXX) THEN PRESS ENTER:
wrangler secret put UNCLE_PHONE

:: ─────────────────────────────────────────────────────
:: STEP 3 — Gemini API key
:: Get one free at: https://aistudio.google.com/app/apikey
:: ─────────────────────────────────────────────────────
echo PASTE YOUR GEMINI API KEY THEN PRESS ENTER:
wrangler secret put GEMINI_API_KEY

:: ─────────────────────────────────────────────────────
:: STEP 4 — Twilio (from console.twilio.com → Account Info)
:: Only fill these in AFTER you buy the Twilio number
:: ─────────────────────────────────────────────────────
echo PASTE YOUR TWILIO ACCOUNT SID (starts with AC) THEN PRESS ENTER:
wrangler secret put TWILIO_SID

echo PASTE YOUR TWILIO AUTH TOKEN THEN PRESS ENTER:
wrangler secret put TWILIO_TOKEN

echo TYPE YOUR TWILIO PHONE NUMBER (+1903XXXXXXX) THEN PRESS ENTER:
wrangler secret put TWILIO_FROM

:: ─────────────────────────────────────────────────────
:: STEP 5 — Resend (email notifications)
:: Get a free key at: https://resend.com → API Keys
:: ─────────────────────────────────────────────────────
echo PASTE YOUR RESEND API KEY THEN PRESS ENTER:
wrangler secret put RESEND_API_KEY

:: ─────────────────────────────────────────────────────
:: Deploy the worker with all secrets loaded
:: ─────────────────────────────────────────────────────
echo.
echo All secrets set. Deploying worker...
wrangler deploy

echo.
echo DONE. Worker is live at https://wallace-lead.tjwallace795.workers.dev
pause
