# Technovate ONE Partner Audit

One link, two lanes:

- **Lane one, I lead a business**: the Fragmentation Audit. For Technovate's end prospects (manufacturing, healthcare, retail, SaaS, financial services, insurance, jewellery) juggling vendors, legacy platforms, data gaps and stalled AI.
- **Lane two, I run a delivery firm**: the Co Delivery Margin Finder. For the SIs, MSPs, consultancies and sales consultants Meet wants as partners: bench cost, declined revenue and co delivery readiness.

Built on the AUDIT-LITE architecture (same as the Protected Harbor and Navvai Opportunity Finder builds), full 13 point doctrine.

## What is inside

- 10 core questions per lane plus the 12 month goal (tappable options plus free text) and one AI follow up
- Every question carries a visible rationale, a two stage "Not sure? Ask me a different way" reroute (AI rewrite with canned fallback), second not sure records the gap honestly
- Sizing block with the formula printed on screen; skipping means the report says not sized, money is never invented
- Verdict computed server side from the weakest pillar under the printed rule (7 plus / 4 to 6.9 / under 4), deterministic client side fallback report so nothing ever renders blank
- Email gate: first name, last name, company and email all required; teaser shows headline, verdict and a blurred preview
- Six numbered report parts with bridge lines: 1 Verdict (badge strip with legend, scale with YOU marker, pillar bars with definitions, before anything else move), 2 Cost (their figures only, formula stated, est. everywhere), 3 Exposure (blind spot, handoff or scope creep check, shadow AI or single thread risk with risk level and reason), 4 Pain to service map (Flagged in tags, Technovate's six service lines and ONE Pods named, ranking with subscores, bands and why number one wins), 5 Plan (goal quoted verbatim, TODAY and DAY 90 cards, three phases naming the Pod doing the work, two SVG decline charts with captions, within reach and where the return comes from), 6 Receipts (where each answer went trace, how to read this report glossary that travels when forwarded)
- Report auto emails via Resend (branded HTML plus booking button) with an internal lead copy; mailto fallback until Resend is configured
- Consultant mode at `?mode=consultant`: no gate, straight to the report, for Meet's own intro calls
- Leads at `data/leads.json`, `/api/leads?key=ADMIN_KEY`, spreadsheet at `/api/leads.csv?key=ADMIN_KEY`, funnel events at `/api/events?key=ADMIN_KEY` (also in Render logs)
- Resume on refresh (24 hour localStorage banner), rotating loading messages, WhatsApp share, browser voice input, one pager print window

## Deploy on Render

1. Push this folder to a GitHub repo (suggest `NAVVAI-BOYS/TECHNOVATE-AUDIT`)
2. New Web Service on Render, build command `pip install -r requirements.txt`, start command `gunicorn app:app`
3. Environment variables:
   - `ANTHROPIC_API_KEY` (required for AI analysis; app still works without it via the deterministic fallback)
   - `ADMIN_KEY` (required for the leads and events endpoints)
   - `RESEND_API_KEY` (optional until DNS is verified; mailto fallback covers the gap)
   - `FROM_EMAIL` (default audit@technovate.one; must be on a Resend verified domain)
   - `CONTACT_EMAIL` (default hello@technovate.one; receives the internal lead copy)
   - `CALENDLY_URL` (default the Technovate get in touch page; swap for Meet's Calendly)
   - `ANTHROPIC_MODEL` (default claude-sonnet-4-6)

## Local run

```
pip install -r requirements.txt
python app.py
```

Then open http://localhost:5000 (or http://localhost:5000/?mode=consultant).

## Notes for the Thursday demo

- Branding pulls the live Technovate white logo from technovate.one with a text fallback; palette is a dark engineering navy with their blue. Tune `static/style.css` variables if Meet wants exact brand hexes.
- Copy borrows their own framework lines (one partner, no handoffs, own the problem not just the scope, production grade delivery not experiments) so the report reads native to Technovate.
- Persistent storage and rate limiting are the standing production build items, as with the other AUDIT-LITE apps.
