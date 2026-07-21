import csv
import io
import json
import os
import time
from datetime import datetime, timezone

import requests
from flask import Flask, jsonify, render_template, request, Response

app = Flask(__name__)

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
LEADS_FILE = os.path.join(DATA_DIR, "leads.json")
EVENTS_FILE = os.path.join(DATA_DIR, "events.json")

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
ANTHROPIC_MODEL = os.environ.get("ANTHROPIC_MODEL", "claude-sonnet-4-6")
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "")
FROM_EMAIL = os.environ.get("FROM_EMAIL", "audit@technovate.one")
CONTACT_EMAIL = os.environ.get("CONTACT_EMAIL", "hello@technovate.one")
CALENDLY_URL = os.environ.get("CALENDLY_URL", "https://technovate.one/get-in-touch/")
ADMIN_KEY = os.environ.get("ADMIN_KEY", "")


def _load(path):
    try:
        with open(path, "r") as f:
            return json.load(f)
    except Exception:
        return []


def _save(path, rows):
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(path, "w") as f:
        json.dump(rows, f, indent=2)


def _now():
    return datetime.now(timezone.utc).isoformat()


@app.route("/")
def index():
    consultant = request.args.get("mode", "") == "consultant"
    return render_template("index.html", consultant=consultant, calendly_url=CALENDLY_URL, contact_email=CONTACT_EMAIL)


# ---------------------------------------------------------------- AI calls

def call_anthropic(system, user, max_tokens=6000):
    """Single call to the Anthropic API with duration and stop reason logging."""
    if not ANTHROPIC_API_KEY:
        raise RuntimeError("ANTHROPIC_API_KEY not set")
    started = time.time()
    resp = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers={
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        json={
            "model": ANTHROPIC_MODEL,
            "max_tokens": max_tokens,
            "system": system,
            "messages": [{"role": "user", "content": user}],
        },
        timeout=120,
    )
    duration = round(time.time() - started, 2)
    data = resp.json()
    stop = data.get("stop_reason", "unknown")
    text = "".join(b.get("text", "") for b in data.get("content", []) if b.get("type") == "text")
    app.logger.warning("AI call: %ss, stop=%s, out_chars=%s", duration, stop, len(text))
    if resp.status_code != 200:
        raise RuntimeError(f"Anthropic error {resp.status_code}: {text[:300]}")
    return text


def parse_json_block(text):
    text = text.strip()
    if text.startswith("```"):
        text = text.strip("`")
        if text.lower().startswith("json"):
            text = text[4:]
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("No JSON object in model output")
    return json.loads(text[start:end + 1])


ANALYZE_SYSTEM = """You are the analysis engine inside the Technovate ONE Partner Audit, a lead magnet web app for Technovate.One, a near native engineering company (cloud engineering, data engineering and analytics, artificial intelligence, product engineering, ERP implementation and modernisation, platform re engineering; delivery through dedicated ONE Pods). Their positioning: one partner, own the problem not just the scope, no handoffs, no fragmented accountability, production grade delivery not experiments.

You receive a JSON payload of a prospect's answers from one of two lanes:
- business: a business or technology leader assessing fragmentation across vendors, platforms, data and AI.
- partner: a delivery firm (system integrator, MSP or consultancy) or independent sales consultant assessing capacity, pipeline, margin and co delivery readiness.

Return STRICT JSON only, no markdown, matching exactly this schema:
{
 "plain_summary": str,                  # 2 to 3 sentences opening "In plain terms:" — their monthly figure if sized, their weakest pillar and score, their verdict, and why the weakest pillar sets the timeline; entirely from their own figures and words
 "headline": str,                       # one sentence, direct, plain English, in their situation
 "verdict_reason": str,                 # 2 sentences: why the weakest pillar sets the verdict
 "use_case": {"title": str, "body": str, "painkiller": bool, "painkiller_reason": str},
 "blind_spot": str,                     # one thing they are not seeing, grounded in their answers
 "exposure": {"handoff_check": str, "shadow_check": str, "risk_level": "Low"|"Medium"|"High", "risk_reason": str},
 "pain_map": [ {"pain": str, "question": str, "flagged_in": str, "service": str, "pod": str, "practice": str} ],   # 3 to 5 rows; service must be one of Technovate's six service lines; pod one of: ONE MVP Pod, ONE AI Pod, ONE Data Pod, ONE Cloud Pod, ONE Product Engineering Pod, ONE ERP Pod, ONE Automation Pod, ONE Integration Pod, ONE DIY Pod; question is the audit question that produced the pain, quoted so the reader has context; practice MUST start with "Technovate" and describe concretely what Technovate does to fix this exact pain (who does what, to what, with what result), never a generic principle
 "ranking": [ {"initiative": str, "score": float, "band": str, "subscores": {"impact": float, "readiness": float, "speed": float, "fit": float}, "why": str} ],  # 3 initiatives, scores 0 to 10, one decimal; band per printed rule: 8 plus Exceptional fit, 6.5 to 8 Strong candidate, 5 to 6.5 Viable with preparation, under 5 Not yet; first row must include why number one wins
 "first_move": {"action": str, "why": str},  # the single first move: action is a short imperative anyone understands at a glance (no jargon, no abstractions like "name an owner for platform"); why is 2 to 3 plain sentences saying what to actually do, why it comes first, and what it costs (often nothing but a decision)
 "roadmap": [ {"phase": str, "weeks": str, "focus": str, "service": str, "effort": "Light"|"Moderate"|"Heavy", "actions": [str, str, str], "recovery_pct": float} ],  # 3 phases over 90 days, quick win first, recovery_pct cumulative conservative share of the stated cost that phase recovers (0 to 1), phases must name the Technovate service or Pod doing the work
 "pillar_notes": { "<pillar_key>": str },   # one short paragraph per pillar quoting the answers that set its score and why, in plain English
 "goal_alignment": str,                 # 2 to 3 sentences: how the roadmap sequencing serves their stated goal, and why the order is what it is
 "pilot": {"title": str, "body": str},  # a start small two week (business lane) or single project (partner lane) pilot: the smallest version of phase one that proves the approach, no changes made, small enough to say yes to this week
 "readiness_note": str,                 # business lane: why AI readiness reuses the Part 1 pillars (AI amplifies its foundation); partner lane: why the pillars are also co delivery readiness scores
 "within_reach": str,                   # why this is within reach, 2 sentences
 "return_from": str,                    # where the return comes from, 2 sentences
 "current_state": str,                  # TODAY card, 2 sentences in their words
 "future_state": str,                   # DAY 90 card, 2 sentences
 "trace": [ {"answer": str, "question": str, "changed": str} ]   # one row per meaningful answer: quote it briefly, include the question it answered, say what it changed in this report
}

Ranking rule: each initiative's displayed score is the weighted sum of its subscores (impact x0.35 + readiness x0.25 + speed x0.20 + fit x0.20), so make the subscores produce the score.

Brevity rule: readers are short on time. Short sentences. Cut every word that does not add meaning. No filler, no throat clearing, no repeating a point across sections. Any quoted answer, anywhere in the report, must appear with the question that produced it.

Glance rule: every sentence must be understandable on first read by a busy executive skimming. If a line needs a second read, rewrite it. Concrete beats abstract: name the thing, the action and the result.

Hard rules: verdicts follow the printed rule (weakest pillar 7 or above is band one, 4 to 6 band two, under 4 band three) and are computed, not vibed. Never invent money: only reason from the prospect's own sizing figures, and if sizing was skipped say so rather than estimating. Every claim carries its reason in plain English. No unexplained jargon. No em dashes. UK spelling. Reference pillar names across sections so the report reads as one linked narrative, not islands."""


@app.route("/api/analyze", methods=["POST"])
def analyze():
    payload = request.get_json(force=True)
    try:
        text = call_anthropic(ANALYZE_SYSTEM, json.dumps(payload), max_tokens=6000)
        report = parse_json_block(text)
        return jsonify({"ok": True, "report": report})
    except Exception as e:
        app.logger.error("analyze failed: %s", e)
        return jsonify({"ok": False, "error": str(e)}), 502


REROUTE_SYSTEM = """You rewrite one audit question as a tappable multiple choice question for someone who answered not sure. Return STRICT JSON: {"question": str, "options": [str, ...]} with 3 to 5 options phrased as answers in the person's own voice, scale format where natural, grounded in their lane, role and prior answers. Plain English, UK spelling, no em dashes."""


@app.route("/api/reroute", methods=["POST"])
def reroute():
    payload = request.get_json(force=True)
    try:
        text = call_anthropic(REROUTE_SYSTEM, json.dumps(payload), max_tokens=600)
        return jsonify({"ok": True, "reroute": parse_json_block(text)})
    except Exception as e:
        app.logger.error("reroute failed: %s", e)
        return jsonify({"ok": False, "error": str(e)}), 502


FOLLOWUP_SYSTEM = """You write one short follow up question to a prospect's stated 12 month goal inside an audit, plus tappable sample answers to lower friction. The question must dig into what achieving the goal depends on. Options are 4 to 5 short answers phrased in the person's own voice, grounded in their lane and prior answers, each a plausible biggest blocker. Plain English, UK spelling, no em dashes. Return STRICT JSON: {"question": str, "options": [str, str, str, str]}"""


@app.route("/api/followup", methods=["POST"])
def followup():
    payload = request.get_json(force=True)
    try:
        text = call_anthropic(FOLLOWUP_SYSTEM, json.dumps(payload), max_tokens=200)
        return jsonify({"ok": True, "followup": parse_json_block(text)})
    except Exception as e:
        app.logger.error("followup failed: %s", e)
        return jsonify({"ok": False, "error": str(e)}), 502


# ---------------------------------------------------------------- leads and email

@app.route("/api/lead", methods=["POST"])
def lead():
    body = request.get_json(force=True)
    row = {
        "date": _now(),
        "email": body.get("email", ""),
        "first_name": body.get("first_name", ""),
        "last_name": body.get("last_name", ""),
        "company": body.get("company", ""),
        "role": body.get("role", ""),
        "lane": body.get("lane", ""),
        "industry": body.get("industry", ""),
        "headline": body.get("headline", ""),
        "verdict": body.get("verdict", ""),
    }
    rows = _load(LEADS_FILE)
    rows.append(row)
    _save(LEADS_FILE, rows)
    app.logger.warning("LEAD: %s", json.dumps(row))

    email_sent = False
    if RESEND_API_KEY and row["email"]:
        html = body.get("report_html", "")
        try:
            r = requests.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json"},
                json={
                    "from": f"Technovate ONE Partner Audit <{FROM_EMAIL}>",
                    "to": [row["email"]],
                    "subject": "Your ONE Partner Audit report",
                    "html": html,
                },
                timeout=30,
            )
            email_sent = r.status_code in (200, 201)
            requests.post(
                "https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json"},
                json={
                    "from": f"Technovate ONE Partner Audit <{FROM_EMAIL}>",
                    "to": [CONTACT_EMAIL],
                    "subject": f"New audit lead: {row['first_name']} {row['last_name']} at {row['company']} ({row['lane']})",
                    "html": f"<p>{json.dumps({k: v for k, v in row.items() if k != 'headline'})}</p>" + html,
                },
                timeout=30,
            )
        except Exception as e:
            app.logger.error("resend failed: %s", e)
    return jsonify({"ok": True, "email_sent": email_sent})


@app.route("/api/event", methods=["POST"])
def event():
    body = request.get_json(force=True)
    row = {"date": _now(), "event": body.get("event", ""), "detail": body.get("detail", "")}
    rows = _load(EVENTS_FILE)
    rows.append(row)
    _save(EVENTS_FILE, rows)
    app.logger.warning("EVENT: %s", json.dumps(row))
    return jsonify({"ok": True})


def _authed():
    return ADMIN_KEY and request.args.get("key", "") == ADMIN_KEY


@app.route("/api/leads")
def leads():
    if not _authed():
        return jsonify({"error": "unauthorised"}), 401
    return jsonify(_load(LEADS_FILE))


@app.route("/api/leads.csv")
def leads_csv():
    if not _authed():
        return jsonify({"error": "unauthorised"}), 401
    rows = _load(LEADS_FILE)
    out = io.StringIO()
    cols = ["date", "email", "first_name", "last_name", "company", "role", "lane", "industry", "headline", "verdict"]
    w = csv.DictWriter(out, fieldnames=cols, extrasaction="ignore")
    w.writeheader()
    for r in rows:
        w.writerow(r)
    return Response(out.getvalue(), mimetype="text/csv",
                    headers={"Content-Disposition": "attachment; filename=leads.csv"})


@app.route("/api/events")
def events():
    if not _authed():
        return jsonify({"error": "unauthorised"}), 401
    return jsonify(_load(EVENTS_FILE))


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
