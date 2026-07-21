/* Technovate ONE Partner Audit — front end
   Two lanes: business (Fragmentation Audit) and partner (Co Delivery Margin Finder).
   AUDIT-LITE doctrine build: 13 points, deterministic fallbacks throughout. */

"use strict";

const $ = (id) => document.getElementById(id);
const screens = ["screen-hero", "screen-questions", "screen-sizing", "screen-loading", "screen-gate", "screen-report"];
function show(id) { screens.forEach(s => $(s).classList.toggle("hidden", s !== id)); window.scrollTo(0, 0); }

function track(event, detail) {
  try { fetch("/api/event", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event, detail: detail || "" }) }).catch(() => {}); } catch (e) {}
}


/* ------------------------------------------------------------------ hero particle sphere */
(function heroSphere() {
  const cv = $("hero-canvas");
  if (!cv || !cv.getContext) return;
  const ctx = cv.getContext("2d");
  const N = 650, pts = [];
  for (let i = 0; i < N; i++) {
    const t = Math.acos(1 - 2 * (i + 0.5) / N), p = Math.PI * (1 + Math.sqrt(5)) * i;
    pts.push({ t, p });
  }
  let mx = 0, my = 0, rot = 0;
  window.addEventListener("mousemove", e => { mx = (e.clientX / innerWidth - 0.5); my = (e.clientY / innerHeight - 0.5); });
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function frame() {
    const W = cv.width, H = cv.height, R = W * 0.34, cx = W / 2, cy = H / 2;
    ctx.clearRect(0, 0, W, H);
    rot += 0.0028;
    const time = Date.now() / 1400;
    for (const pt of pts) {
      const wob = 1 + 0.12 * Math.sin(pt.t * 4 + time) * Math.cos(pt.p * 3 + time * 0.7);
      const r = R * wob;
      let x = r * Math.sin(pt.t) * Math.cos(pt.p + rot + mx * 1.2);
      let y = r * Math.cos(pt.t) + my * 40;
      let z = r * Math.sin(pt.t) * Math.sin(pt.p + rot + mx * 1.2);
      const s = 300 / (300 + z);
      const px = cx + x * s, py = cy + y * s;
      const hue = 200 + ((pt.p / Math.PI * 60) % 100) + 30 * Math.sin(time + pt.t); // blue -> purple -> pink
      ctx.fillStyle = `hsla(${210 + (hue % 110)},90%,${55 + z / R * 12}%,${0.25 + 0.55 * s * s * 0.5})`;
      ctx.beginPath(); ctx.arc(px, py, 1.6 * s, 0, 7); ctx.fill();
    }
    if (!reduced) requestAnimationFrame(frame);
  }
  frame();
})();

/* ------------------------------------------------------------------ config */

const SERVICES = ["Cloud & DevOps Engineering", "Data Engineering & Analytics", "Artificial Intelligence", "Product Engineering", "ERP Implementation & Modernisation", "Platform Re engineering"];
const SERVICES_DETAIL = {
  "Cloud & DevOps Engineering": "secure, scalable cloud platforms, built and run with controlled delivery",
  "Data Engineering & Analytics": "data systems that give you one trusted source of truth and same day answers",
  "Artificial Intelligence": "practical AI, agents and workflow automation, in production not in pilots",
  "Product Engineering": "scalable products built end to end, from idea to production",
  "ERP Implementation & Modernisation": "ERP modernised and integrated in place, evolving with AI driven insight",
  "Platform Re engineering": "legacy platforms transformed into modern, connected cloud architectures"
};
const PODS = ["ONE MVP Pod", "ONE AI Pod", "ONE Data Pod", "ONE Cloud Pod", "ONE Product Engineering Pod", "ONE ERP Pod", "ONE Automation Pod", "ONE Integration Pod", "ONE DIY Pod"];

const LANES = {
  business: {
    name: "The Fragmentation Audit",
    pillars: {
      accountability: { label: "Accountability", def: "Who truly owns outcomes across your vendors and teams",
        low: "every change crosses vendor boundaries and nobody owns the outcome end to end",
        high: "one named partner owns outcomes, handoffs are internal and invisible to you" },
      platform: { label: "Platform", def: "The state of the systems your business runs on",
        low: "legacy systems held together carefully, every change is a risk",
        high: "modern, integrated platforms that absorb change without drama" },
      data: { label: "Data", def: "Whether your numbers are trusted, current and in one place",
        low: "several versions of the truth, key numbers built by hand each time",
        high: "one trusted source of truth, answers the same day" },
      ai: { label: "AI & automation", def: "How far AI has moved from ideas to governed production use",
        low: "ideas and board pressure, nothing shipped, unmanaged tool use everywhere",
        high: "AI in governed production, delivering measured value" }
    },
    verdicts: [
      { min: 7, label: "One Partner Ready", desc: "Accountability, platform, data and AI hold up. Firms here scale initiatives without adding vendors, and their next step is compounding what works." },
      { min: 4, label: "Fragmented in places", desc: "Most firms sit here. Something works, but at least one pillar leaks time and money every week. The gap to band one is usually one focused initiative." },
      { min: 0, label: "Held together by handoffs", desc: "Firms here ship changes through too many hands. Nothing compounds because every improvement crosses a vendor boundary. Foundations come before AI." }
    ],
    sizing: {
      title: "Put your own numbers on it",
      why: "We never invent money. These three figures are the only source for every cost in your report. Skip them and the report says not sized rather than guessing.",
      fields: [
        { id: "n", label: "People affected by vendor coordination and rework", ph: "e.g. 25" },
        { id: "hrs", label: "Hours per person per week lost to coordination, chasing and rework", ph: "e.g. 4" },
        { id: "rate", label: "Average loaded hourly cost per person", ph: "e.g. 45" },
        { id: "cur", label: "Currency", type: "select", options: ["£", "$", "€"] }
      ],
      formula: "Monthly cost = people × hours per week × hourly cost × 48 working weeks ÷ 12 months. 48 weeks, not 52, to stay conservative.",
      monthly: (v) => v.n * v.hrs * v.rate * 48 / 12,
      hoursWeek: (v) => v.n * v.hrs,
      costLabel: "lost to fragmentation"
    },
    goalOptions: [
      "Grow revenue without growing headcount at the same rate",
      "Launch in a new market or region",
      "Replace or modernise a core platform without disruption",
      "Get AI out of pilots and into production",
      "Cut operating cost while keeping service levels"
    ],
    shadowTitle: "Shadow AI",
    shadowSub: "The AI use nobody signed off",
    handoffTitle: "The handoff check",
    handoffSub: "Connected systems, or bolted on parts?",
    readySub: "Can your infrastructure carry your AI ambitions?",
    blockerOptions: [
      "Time, the team is already stretched thin",
      "Budget, and proving the return before spending",
      "Legacy systems that resist every change",
      "Too many vendors and no single owner",
      "Honestly, knowing where to start"
    ],
    questions: [
      { id: "industry", q: "Which industry are you in?", why: "Every question after this one is read through your industry's lens.", options: ["Manufacturing", "Healthcare", "Retail", "SaaS", "Financial services", "Insurance", "Jewellery", "Other"] },
      { id: "role", q: "What is your role?", why: "A COO and a Head of IT feel the same fragmentation in different places. The report speaks to your seat.", options: ["CEO or founder", "COO or operations", "CIO, CTO or Head of IT", "CFO or finance", "Other leadership"] },
      { id: "vendors", pillar: "accountability", q: "How many technology vendors and partners touch your core systems today?", why: "Each vendor boundary is a handoff, and handoffs are where cost and accountability leak.", options: [
        { t: "One partner covers most of it", s: 9 }, { t: "Two or three", s: 6 }, { t: "Four to six", s: 3 }, { t: "Seven or more, honestly I would have to count", s: 1 }] },
      { id: "owner", pillar: "accountability", q: "When a change goes wrong, who owns fixing it end to end?", why: "Fragmented accountability is the pattern behind most stalled programmes: everyone owns a scope, nobody owns the problem.", options: [
        { t: "One named partner owns it end to end", s: 9 }, { t: "We coordinate it internally between vendors", s: 5 }, { t: "It depends, and things fall between the gaps", s: 2 }] },
      { id: "platform", pillar: "platform", q: "How would you describe the platforms your business runs on?", why: "Legacy platforms are not a moral failing, but they set the ceiling on everything else in this report.", options: [
        { t: "Modern, cloud based, well maintained", s: 9 }, { t: "A mix of modern and legacy", s: 5 }, { t: "Mostly legacy, held together carefully", s: 2 }, { t: "Honestly not sure", s: 3 }] },
      { id: "erp", pillar: "platform", q: "What is the state of your ERP or core operational system?", why: "In manufacturing, retail and jewellery especially, the ERP is where fragmentation shows up first.", options: [
        { t: "Modern and integrated with the rest of the stack", s: 9 }, { t: "Implemented, but things are bolted on around it", s: 5 }, { t: "Spreadsheets and workarounds do a lot of the real work", s: 2 }] },
      { id: "truth", pillar: "data", q: "When two reports disagree, how do you find the true number?", why: "AI on top of untrusted data automates the argument, not the answer. Data readiness gates the AI pillar.", options: [
        { t: "We have one source of truth and trust it", s: 9 }, { t: "Several versions of the truth, we reconcile", s: 4 }, { t: "Someone builds the number manually each time", s: 2 }] },
      { id: "speed", pillar: "data", q: "How long does it take to get an answer from your data?", why: "Decision speed is a direct function of data plumbing. Weeks here usually means the platform pillar is involved too.", options: [
        { t: "Same day", s: 9 }, { t: "A few days", s: 5 }, { t: "Weeks, or we stop asking", s: 2 }] },
      { id: "aiuse", pillar: "ai", q: "Where is AI in your organisation today?", why: "Easy to build, hard to productionise. Pilots that never ship are the most common pattern we see.", options: [
        { t: "In production, delivering measurable value", s: 9 }, { t: "Pilots and experiments only", s: 5 }, { t: "Ideas and pressure from the board, nothing built", s: 3 }, { t: "Nothing yet", s: 2 }] },
      { id: "govern", pillar: "ai", q: "Do you know what AI tools your staff already use day to day?", why: "Unmanaged AI use is both a risk and a signal: your people are already automating around the gaps.", options: [
        { t: "Yes, with a policy and approved tools", s: 9 }, { t: "Roughly, it is informal", s: 4 }, { t: "No idea, and that slightly worries me", s: 2 }] }
    ]
  },

  partner: {
    name: "The Co Delivery Margin Finder",
    pillars: {
      capacity: { label: "Capacity", def: "Whether your delivery bandwidth matches the work in front of you",
        low: "work turned away most weeks, or a bench quietly carried between projects",
        high: "elastic capacity that flexes with demand without hiring ahead of it" },
      pipeline: { label: "Pipeline", def: "How steady and qualified your inbound work really is",
        low: "unpredictable referrals, dry spells set the pace of the business",
        high: "steady qualified inbound you can confidently staff against" },
      margin: { label: "Margin", def: "What you keep from each project after delivery cost",
        low: "thin or unmeasured, every deal a price war",
        high: "40 percent plus held, rates defended by value not volume" },
      model: { label: "Delivery model", def: "How ready your processes are to plug in an extended team",
        low: "everything in house, delivery lives in a few people's heads",
        high: "documented process an extended team can plug straight into" }
    },
    verdicts: [
      { min: 7, label: "Co delivery ready", desc: "Capacity, pipeline, margin and model all hold. Firms here use an extended team to take bigger projects, not to survive. Their next step is choosing the right partner terms." },
      { min: 4, label: "Margin leaking", desc: "Most firms sit here. Work exists, but bench time, declined projects or thin margin quietly drain it. One structural change usually recovers most of the leak." },
      { min: 0, label: "Running at the ceiling", desc: "Firms here turn work away or burn the team to keep it. Growth is capped by headcount. Co delivery is the difference between a good year and a stuck one." }
    ],
    sizing: {
      title: "Put your own numbers on it",
      why: "We never invent money. These figures are the only source for every cost in your report. Skip them and the report says not sized rather than guessing.",
      fields: [
        { id: "n", label: "Billable people on the team", ph: "e.g. 12" },
        { id: "idle", label: "Idle or unbilled days per person per month", ph: "e.g. 3" },
        { id: "rate", label: "Blended day rate you charge", ph: "e.g. 600" },
        { id: "declined", label: "Projects declined or lost to bandwidth per quarter", ph: "e.g. 2" },
        { id: "pv", label: "Average project value", ph: "e.g. 40000" },
        { id: "cur", label: "Currency", type: "select", options: ["£", "$", "€"] }
      ],
      formula: "Bench cost per month = people × idle days × day rate. Declined revenue per month = projects declined per quarter × average project value ÷ 3. Reported separately, never blended.",
      monthly: (v) => v.n * v.idle * v.rate + (v.declined * v.pv / 3),
      hoursWeek: (v) => Math.round(v.n * v.idle * 8 / 4.33),
      costLabel: "leaking through bench time and declined work"
    },
    goalOptions: [
      "Grow revenue without hiring ahead of demand",
      "Stop turning qualified work away",
      "Move from one off projects to recurring revenue",
      "Win larger projects than the current team can deliver",
      "Protect margin against rate pressure"
    ],
    shadowTitle: "Single thread risk",
    shadowSub: "The knowledge only one person holds",
    handoffTitle: "The scope creep check",
    handoffSub: "Scope priced by process, or by whoever is most tired?",
    readySub: "Can your model carry the growth you want?",
    blockerOptions: [
      "Delivery bandwidth, we cannot staff the work",
      "Lead flow is too unpredictable to plan around",
      "Margin pressure on every single deal",
      "Finding a delivery partner we would actually trust",
      "Time to work on the business instead of in it"
    ],
    questions: [
      { id: "firmtype", q: "What kind of firm are you?", why: "A system integrator and an independent consultant leak margin in different places. The report is read through your model.", options: ["System integrator", "MSP", "Consultancy or agency", "Independent sales consultant or advisor"] },
      { id: "teamsize", q: "How big is your delivery team?", why: "Team size sets what fix sizes are realistic in the 90 day plan.", options: ["Just me or under 5", "5 to 15", "16 to 50", "50 plus"] },
      { id: "turnaway", pillar: "capacity", q: "How often do you turn work away for lack of bandwidth?", why: "Declined work is invisible cost: it never hits the P and L, so nobody prices it.", options: [
        { t: "Rarely, we can usually flex", s: 8 }, { t: "A few times a year", s: 5 }, { t: "Most months", s: 3 }, { t: "Most weeks, it is constant", s: 2 }] },
      { id: "bench", pillar: "capacity", q: "How much bench or idle time does the team carry?", why: "Bench and turned away work together define the capacity pillar: the goal is elastic capacity, not a bigger fixed team.", options: [
        { t: "Near zero, we run tight", s: 9 }, { t: "Some idle weeks between projects", s: 5 }, { t: "A sizeable bench we quietly carry", s: 3 }] },
      { id: "leadflow", pillar: "pipeline", q: "How would you describe your inbound lead flow?", why: "Pipeline steadiness decides whether extra capacity becomes revenue or just cost.", options: [
        { t: "Steady and mostly qualified", s: 9 }, { t: "Lumpy, feast and famine", s: 5 }, { t: "Mostly referrals we cannot predict", s: 4 }, { t: "Dry right now", s: 2 }] },
      { id: "biggest", pillar: "pipeline", q: "When a bigger project than usual appears, what happens?", why: "The projects you cannot say yes to define your ceiling more than the ones you win.", options: [
        { t: "We take it and staff it", s: 9 }, { t: "We take it and it hurts", s: 5 }, { t: "We pass or partner it away", s: 3 }] },
      { id: "marginlvl", pillar: "margin", q: "What margin do you keep on a typical project after delivery cost?", why: "Margin is the pillar co delivery moves fastest: same revenue, lower delivery cost.", options: [
        { t: "40 percent or better", s: 9 }, { t: "25 to 40 percent", s: 6 }, { t: "10 to 25 percent", s: 3 }, { t: "Thin, or honestly not measured", s: 2 }] },
      { id: "rates", pillar: "margin", q: "How much rate pressure are you under?", why: "If you cannot hold rates, the fix is lowering delivery cost, not chasing volume.", options: [
        { t: "We hold our rates", s: 8 }, { t: "We discount sometimes to win", s: 5 }, { t: "Every deal is a price war", s: 2 }] },
      { id: "extteam", pillar: "model", q: "Have you delivered with an external or extended team before?", why: "Co delivery readiness is process, not trust: documentation, handover discipline and shared standards.", options: [
        { t: "Yes, with documented process and standards", s: 9 }, { t: "Yes, but ad hoc each time", s: 5 }, { t: "Never, everything stays in house", s: 2 }] },
      { id: "recurring", pillar: "model", q: "How do you feel about revenue share and recurring models?", why: "A recurring share on delivered projects turns your network into an asset that pays monthly, not per meeting.", options: [
        { t: "Actively want recurring revenue", s: 9 }, { t: "Open to it with the right partner", s: 6 }, { t: "Prefer one off engagements", s: 3 }] }
    ]
  }
};


const WIDER = {
  business: [
    { big: "70%", txt: "of large scale transformation programmes fall short of their goals", src: "McKinsey" },
    { big: "$5,600/min", txt: "average cost of IT downtime across industries", src: "Gartner" },
    { big: "$4.88M", txt: "average total cost of a data breach in 2024", src: "IBM, Cost of a Data Breach Report 2024" }
  ],
  partner: [
    { big: "~70%", txt: "average billable utilisation across professional services firms, meaning nearly a third of capacity goes unbilled", src: "SPI Research, PS Maturity Benchmark" },
    { big: "7x", txt: "firms responding to a lead within an hour are about seven times more likely to qualify it", src: "Harvard Business Review, lead response research" }
  ]
};

const GOAL_Q = { id: "goal", q: "What is the one business goal that matters most in the next 12 months?", why: "Every phase of your 90 day plan is filtered through this, in your words." };

/* ------------------------------------------------------------------ state */

let S = { lane: null, qi: 0, answers: {}, gaps: [], scores: {}, sizing: null, goal: "", followup: "", report: null, verdict: null, gate: null };

function persist() { try { localStorage.setItem("tvn_audit", JSON.stringify({ S, t: Date.now() })); } catch (e) {} }
function restore() {
  try {
    const raw = JSON.parse(localStorage.getItem("tvn_audit"));
    if (raw && raw.S && raw.S.lane && Date.now() - raw.t < 24 * 3600 * 1000 && !raw.S.report) return raw.S;
  } catch (e) {}
  return null;
}

/* ------------------------------------------------------------------ hero */

document.querySelectorAll(".lane-card").forEach(b => b.addEventListener("click", () => {
  S = { lane: b.dataset.lane, qi: 0, answers: {}, gaps: [], scores: {}, sizing: null, goal: "", followup: "", report: null, verdict: null, gate: null };
  track("lane_selected", S.lane);
  persist();
  renderQuestion();
}));

const saved = restore();
if (saved) {
  $("resume-banner").classList.remove("hidden");
  $("resume-yes").addEventListener("click", () => { S = saved; renderQuestion(); });
  $("resume-no").addEventListener("click", () => { localStorage.removeItem("tvn_audit"); $("resume-banner").classList.add("hidden"); });
}
if (window.CONSULTANT) $("consultant-flag").classList.remove("hidden");
track("visit", window.CONSULTANT ? "consultant" : "public");

/* ------------------------------------------------------------------ questions */

let currentSelection = null;
let notSureCount = 0;
let rerouted = null;

function lane() { return LANES[S.lane]; }
function allQuestions() { return [...lane().questions, GOAL_Q]; }

function renderQuestion() {
  const qs = allQuestions();
  if (S.qi >= qs.length) return renderSizing();
  const q = qs[S.qi];
  currentSelection = null; notSureCount = 0; rerouted = null;
  show("screen-questions");
  $("progress-bar").style.width = Math.round(S.qi / (qs.length + 1) * 100) + "%";
  $("q-count").textContent = `${lane().name} · Question ${S.qi + 1} of ${qs.length}`;
  $("q-text").textContent = q.q;
  $("q-why").textContent = "Why we ask: " + q.why;
  $("q-skip").classList.add("hidden");
  $("q-notsure").classList.remove("hidden");
  $("q-input").value = "";

  const box = $("q-options"); box.innerHTML = "";
  const isGoal = q.id === "goal";
  const opts = isGoal ? lane().goalOptions : (q.options || []);
  if (opts.length) {
    opts.forEach(o => {
      const t = typeof o === "string" ? o : o.t;
      const btn = document.createElement("button");
      btn.textContent = t;
      btn.addEventListener("click", () => {
        box.querySelectorAll("button").forEach(x => x.classList.remove("selected"));
        btn.classList.add("selected");
        currentSelection = o;
      });
      box.appendChild(btn);
    });
  }
  $("q-freetext").classList.remove("hidden");
  $("q-input").placeholder = "Or say it in your own words";
}

function cannedReroute(q) {
  // Deterministic fallback: restate as a simple scale grounded in the same options.
  const opts = (q.options || []).map(o => typeof o === "string" ? o : o.t);
  return { question: "Put another way: which of these sounds most like you?", options: opts.length ? opts : ["This is going well", "It is a mixed picture", "This is a known problem", "I genuinely do not know"] };
}

$("q-notsure").addEventListener("click", async () => {
  const q = allQuestions()[S.qi];
  notSureCount++;
  track("not_sure", q.id + ":" + notSureCount);
  if (notSureCount >= 2) {
    // Second not sure: record the gap honestly and move on.
    S.gaps.push(q.id);
    S.answers[q.id] = { text: "Not sure (recorded as a gap)", score: null, q: q.q };
    advance();
    return;
  }
  $("q-notsure").textContent = "Still not sure";
  let rr = null;
  try {
    const res = await fetch("/api/reroute", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lane: S.lane, question: q.q, prior: summariseAnswers() }) });
    const j = await res.json();
    if (j.ok) rr = j.reroute;
  } catch (e) {}
  if (!rr) rr = cannedReroute(q);
  rerouted = true;
  $("q-text").textContent = rr.question;
  const box = $("q-options"); box.innerHTML = "";
  rr.options.forEach((t, i) => {
    const btn = document.createElement("button");
    btn.textContent = t;
    btn.addEventListener("click", () => {
      box.querySelectorAll("button").forEach(x => x.classList.remove("selected"));
      btn.classList.add("selected");
      // Map reroute choice back onto the original option scores by position where possible.
      const orig = (q.options || [])[i];
      currentSelection = orig !== undefined ? orig : t;
    });
    box.appendChild(btn);
  });
  $("q-freetext").classList.remove("hidden");
});

function summariseAnswers() {
  return Object.entries(S.answers).map(([k, v]) => `${k}: ${v.text}`).join("; ");
}

function advance() {
  S.qi++;
  persist();
  renderQuestion();
}

async function askFollowup() {
  // One follow up to the goal: tappable sample blockers to lower friction, free text always available, plain skip.
  show("screen-questions");
  $("q-count").textContent = `${lane().name} · One follow up`;
  $("q-why").textContent = "Why we ask: the plan has to serve what the goal depends on, not just the goal. Tap the closest match or say it in your own words.";
  $("q-input").value = "";
  $("q-notsure").classList.add("hidden");
  $("q-skip").classList.remove("hidden");
  currentSelection = null;
  let fq = "What is the single biggest thing standing between you and that goal today?";
  let fopts = lane().blockerOptions.slice();
  try {
    const res = await fetch("/api/followup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lane: S.lane, goal: S.goal, prior: summariseAnswers() }) });
    const j = await res.json();
    if (j.ok && j.followup) {
      if (j.followup.question) fq = j.followup.question;
      if (Array.isArray(j.followup.options) && j.followup.options.length >= 3) fopts = j.followup.options;
    }
  } catch (e) {}
  $("q-text").textContent = fq;
  const box = $("q-options"); box.innerHTML = "";
  fopts.forEach(t => {
    const btn = document.createElement("button");
    btn.textContent = t;
    btn.addEventListener("click", () => {
      box.querySelectorAll("button").forEach(x => x.classList.remove("selected"));
      btn.classList.add("selected");
      currentSelection = t;
      $("q-input").value = "";
    });
    box.appendChild(btn);
  });
  const clone = $("q-next").cloneNode(true); $("q-next").replaceWith(clone);
  clone.addEventListener("click", () => {
    const typed = $("q-input").value.trim();
    S.followup = typed || (typeof currentSelection === "string" ? currentSelection : "");
    if (!S.followup) return;
    S.qi++; persist(); renderSizing();
  });
  $("q-skip").addEventListener("click", () => { S.qi++; persist(); renderSizing(); }, { once: true });
}

/* Rebuild q-next cleanly each question to avoid stacked listeners after followup */
const origRenderQuestion = renderQuestion;
renderQuestion = function () {
  const btn = $("q-next"); const clone = btn.cloneNode(true); btn.replaceWith(clone);
  clone.addEventListener("click", mainNextHandler);
  origRenderQuestion();
};
async function mainNextHandler() {
  const q = allQuestions()[S.qi];
  const typed = $("q-input").value.trim();
  let text = "", score = null;
  if (currentSelection !== null) {
    text = typeof currentSelection === "string" ? currentSelection : currentSelection.t;
    score = typeof currentSelection === "object" ? currentSelection.s : null;
  } else if (typed) { text = typed; score = q.pillar ? 5 : null; }
  else return;
  S.answers[q.id] = { text, score, q: q.q, pillar: q.pillar || null, typed: !currentSelection };
  if (q.id === "goal") { S.goal = text; await askFollowup(); return; }
  advance();
}

$("q-input").addEventListener("input", () => {
  if ($("q-input").value.trim()) {
    document.querySelectorAll("#q-options button").forEach(x => x.classList.remove("selected"));
    currentSelection = null;
  }
});

/* voice input */
const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
if (Rec) {
  $("q-mic").addEventListener("click", () => {
    const r = new Rec(); r.lang = "en-GB";
    $("q-mic").classList.add("listening");
    r.onresult = (e) => { $("q-input").value += (($("q-input").value ? " " : "") + e.results[0][0].transcript); };
    r.onend = () => $("q-mic").classList.remove("listening");
    r.start();
  });
} else { $("q-mic").style.display = "none"; }

/* ------------------------------------------------------------------ sizing */

function renderSizing() {
  const cfg = lane().sizing;
  show("screen-sizing");
  $("sizing-title").textContent = cfg.title;
  $("sizing-why").textContent = cfg.why;
  $("sizing-formula").textContent = cfg.formula;
  const grid = $("sizing-fields"); grid.innerHTML = "";
  cfg.fields.forEach(f => {
    const wrap = document.createElement("div");
    const lbl = document.createElement("label"); lbl.textContent = f.label; lbl.htmlFor = "sz-" + f.id;
    wrap.appendChild(lbl);
    if (f.type === "select") {
      const sel = document.createElement("select"); sel.id = "sz-" + f.id;
      sel.style.cssText = "width:100%;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:13px 16px;color:var(--text)";
      f.options.forEach(o => { const op = document.createElement("option"); op.textContent = o; sel.appendChild(op); });
      wrap.appendChild(sel);
    } else {
      const inp = document.createElement("input"); inp.id = "sz-" + f.id; inp.type = "number"; inp.min = "0"; inp.placeholder = f.ph;
      wrap.appendChild(inp);
    }
    grid.appendChild(wrap);
  });
  $("sizing-next").onclick = () => {
    const v = {};
    let ok = true;
    cfg.fields.forEach(f => {
      const el = $("sz-" + f.id);
      if (f.type === "select") v[f.id] = el.value;
      else { const n = parseFloat(el.value); if (isNaN(n) || n < 0) ok = false; v[f.id] = n; }
    });
    if (!ok) { alert("Fill every figure, or use Skip the numbers. We would rather say not sized than guess."); return; }
    S.sizing = v; track("sizing_completed"); persist(); runAnalysis();
  };
  $("sizing-skip").onclick = () => { S.sizing = null; track("sizing_skipped"); persist(); runAnalysis(); };
}

/* ------------------------------------------------------------------ scoring + verdict (computed, never vibed) */

function computeScores() {
  const pillars = Object.keys(lane().pillars);
  const sums = {}, counts = {};
  pillars.forEach(p => { sums[p] = 0; counts[p] = 0; });
  Object.values(S.answers).forEach(a => {
    if (a.pillar && a.score !== null) { sums[a.pillar] += a.score; counts[a.pillar]++; }
    if (a.pillar && a.score === null) { sums[a.pillar] += 3; counts[a.pillar]++; } // recorded gap scores conservatively and is named in the report
  });
  const scores = {};
  pillars.forEach(p => scores[p] = counts[p] ? Math.round(sums[p] / counts[p] * 10) / 10 : 5);
  S.scores = scores;
  const weakest = pillars.reduce((a, b) => scores[a] <= scores[b] ? a : b);
  const wscore = scores[weakest];
  const v = lane().verdicts.find(v => wscore >= v.min);
  S.verdict = { label: v.label, desc: v.desc, weakest, wscore, all: lane().verdicts };
}

/* ------------------------------------------------------------------ analysis */

const LOADING = [
  "Reading your answers", "Scoring the four pillars", "Pricing the gap in your figures",
  "Mapping pains to ONE Pods", "Building your 90 day plan", "Checking the workings"
];

async function runAnalysis() {
  computeScores();
  show("screen-loading");
  let li = 0;
  const iv = setInterval(() => { $("loading-msg").textContent = LOADING[li++ % LOADING.length]; }, 2200);
  let report = null;
  try {
    const res = await fetch("/api/analyze", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lane: S.lane, laneName: lane().name,
        answers: Object.fromEntries(Object.entries(S.answers).map(([k, a]) => [k, a.text])),
        gaps: S.gaps, goal: S.goal, followup: S.followup,
        pillarScores: S.scores, weakestPillar: S.verdict.weakest, verdict: S.verdict.label,
        sizing: S.sizing, monthlyCost: monthlyCost(), currency: currency()
      })
    });
    const j = await res.json();
    if (j.ok) report = j.report;
  } catch (e) {}
  clearInterval(iv);
  S.report = report || fallbackReport();
  S.report._fallback = !report;
  persist();
  track("report_ready", report ? "ai" : "fallback");
  if (window.CONSULTANT) { renderReport(); show("screen-report"); }
  else renderGate();
}

function currency() { return S.sizing ? S.sizing.cur : "£"; }
function monthlyCost() { return S.sizing ? Math.round(lane().sizing.monthly(S.sizing)) : null; }
function fmt(n) { return currency() + n.toLocaleString("en-GB"); }

/* Deterministic client side fallback: the report can never render blank. */
function fallbackReport() {
  const v = S.verdict;
  const pl = lane().pillars;
  const weakLabel = pl[v.weakest].label;
  const biz = S.lane === "business";
  const mc = monthlyCost();
  const rec = [0.15, 0.35, 0.55];
  const pains = [];
  Object.values(S.answers).forEach(a => { if (a.pillar && (a.score === null || a.score <= 5)) pains.push(a); });
  const mapRows = pains.slice(0, 5).map(a => ({
    pain: a.text,
    question: a.q,
    flagged_in: pl[a.pillar].label + " pillar (Part 1)",
    service: biz ? ({ accountability: "Platform Re engineering", platform: "ERP Implementation & Modernisation", data: "Data Engineering & Analytics", ai: "Artificial Intelligence" })[a.pillar]
                 : ({ capacity: "Product Engineering", pipeline: "Artificial Intelligence", margin: "Cloud & DevOps Engineering", model: "Product Engineering" })[a.pillar],
    pod: biz ? ({ accountability: "ONE Integration Pod", platform: "ONE ERP Pod", data: "ONE Data Pod", ai: "ONE AI Pod" })[a.pillar]
             : ({ capacity: "ONE DIY Pod", pipeline: "ONE AI Pod", margin: "ONE Cloud Pod", model: "ONE Product Engineering Pod" })[a.pillar],
    practice: (biz ? {
      accountability: "Technovate takes single end to end ownership of the flow you described: one Pod, one backlog, one accountable owner, so a change stops crossing vendor boundaries to ship.",
      platform: "Technovate's ONE ERP Pod modernises the core system in place: maps what runs today, retires the workarounds, and integrates it with the rest of your stack without a big bang.",
      data: "Technovate's ONE Data Pod builds your single source of truth: pipelines from your systems into one reported number, so two reports can never disagree again.",
      ai: "Technovate's ONE AI Pod takes one workflow from idea to governed production: agents on your own data, with the one page policy that makes staff AI use safe instead of shadow."
    } : {
      capacity: "Technovate becomes your extended delivery team: a dedicated Pod from their 100 person bench that scales up and down with your pipeline, so you stop turning work away.",
      pipeline: "Technovate co delivers the projects you cannot predictably staff: you keep the client and the sale, they build, and you take a recurring share while the project runs.",
      margin: "Technovate's delivery team lowers your cost per delivered hour without touching your rates, so the same project keeps more margin.",
      model: "Technovate sets up co delivery with you on the first project: documented handovers, shared standards, one integration point, so plugging in an extended team becomes routine."
    })[a.pillar] || "Technovate assigns a dedicated ONE Pod: one team, one backlog, one accountable owner for this exact problem."
  }));
  if (!mapRows.length) mapRows.push({ pain: "No acute pain surfaced; the risk is drift", question: "Read across all your answers", flagged_in: "All pillars (Part 1)", service: "Artificial Intelligence", pod: "ONE AI Pod", practice: "Compound what already works before it plateaus" });
  const plainCost = mc !== null ? `you are losing about ${fmt(mc)} a month ${lane().sizing.costLabel}, from your own figures; ` : "";
  return {
    plain_summary: `In plain terms: ${plainCost}your weakest pillar is ${weakLabel.toLowerCase()} at ${v.wscore}/10, which lands you in ${v.label}. The verdict follows the weakest pillar, never the average, because everything you attempt passes through it first. The next stall on that pillar sets your timeline, not you.`,
    headline: biz
      ? `Your weakest pillar is ${weakLabel}, and it is setting the pace for everything else.`
      : `Your weakest pillar is ${weakLabel}, and it is where the margin is going.`,
    verdict_reason: `The verdict follows the printed rule: your weakest pillar, ${weakLabel}, scored ${v.wscore} out of 10, which lands you in ${v.label}. Strengths elsewhere do not offset it because every initiative has to pass through the weakest pillar first.`,
    use_case: {
      title: biz ? "One accountable partner across the stack" : "Elastic delivery capacity on tap",
      body: biz
        ? `Based on your answers, the fastest value is consolidating accountability so one partner owns outcomes across ${weakLabel.toLowerCase()} and its neighbours, instead of coordination living in your team's inbox.`
        : `Based on your answers, the fastest value is co delivery: keep the client relationship and the revenue, plug in an extended team for the delivery hours, and stop pricing your ceiling into every deal.`,
      painkiller: v.wscore < 7,
      painkiller_reason: v.wscore < 7 ? "This removes an active weekly cost you named yourself, so it is a painkiller, not a vitamin." : "Things broadly work today, so this compounds an advantage rather than stopping a bleed. That makes it a vitamin, and worth saying so honestly."
    },
    blind_spot: S.gaps.length
      ? `You answered not sure on ${S.gaps.length} question${S.gaps.length > 1 ? "s" : ""} (${S.gaps.join(", ")}). The blind spot is literal: nobody in the business currently holds those answers, and unowned questions become unowned problems.`
      : `Your strongest pillar is quietly carrying the others. When it wobbles, everything above your weakest pillar wobbles with it, and no one is watching for that because it has never failed yet.`,
    exposure: {
      handoff_check: biz
        ? "Systems and vendors should connect into one accountable flow, not bolt on like extra limbs. Every answer that mentioned coordination, reconciliation or workarounds is a limb. The question is not just can you connect them, but should you."
        : "Every project that grew beyond its scope pulled hours from the bench you did not have. Without a documented delivery process, scope creep is priced by whoever is most tired that week.",
      shadow_check: biz
        ? "If you do not know which AI tools staff already use, you carry unmanaged risk and unmanaged signal at the same time. The fix is governance plus enablement for the wider team, not a ban."
        : "If key accounts and key delivery knowledge sit with one or two people, your margin has a single point of failure. Co delivery only works when process, not memory, carries the project.",
      risk_level: v.wscore < 4 ? "High" : v.wscore < 7 ? "Medium" : "Low",
      risk_reason: `Set by the weakest pillar score of ${v.wscore}: below 4 is High, 4 to 6.9 is Medium, 7 or above is Low.`
    },
    pain_map: mapRows,
    ranking: [
      { initiative: biz ? `Fix ${weakLabel.toLowerCase()} with one accountable owner` : "Stand up a co delivery lane for the next oversized project", score: 7.4, band: "Strong candidate", subscores: { impact: 8, readiness: 6.5, speed: 7.5, fit: 7.5 }, why: "Number one wins because it attacks the weakest pillar directly, needs no new platform spend, and shows a measurable result inside 90 days. Impact and speed outweigh the readiness gap." },
      { initiative: biz ? "Automate the highest volume repetitive workflow" : "Turn declined work into revenue share referrals", score: 6.2, band: "Viable with preparation", subscores: { impact: 6.5, readiness: 5.5, speed: 7, fit: 6 }, why: "Real value, but it depends on the first initiative landing to be safe." },
      { initiative: biz ? "Full AI programme across the business" : "Hire ahead of demand", score: 4.1, band: "Not yet", subscores: { impact: 8, readiness: 2.5, speed: 3, fit: 4 }, why: "The readiness gap is the whole story here. The roadmap exists to close it." }
    ],
    first_move: v.wscore < 4
      ? { action: `Give ${weakLabel.toLowerCase()} one named owner this week`,
          why: biz
            ? `Right now nobody owns your ${weakLabel.toLowerCase()} end to end, so every problem bounces between vendors and stalls. Pick one person internally or one partner and make them accountable for it. It costs nothing, takes a week, and until it happens any money spent on tools lands on a foundation nobody is responsible for.`
            : `Your ${weakLabel.toLowerCase()} is nobody's job, so it only gets attention when it breaks. Pick one person and make it theirs. Costs nothing, takes a week.` }
      : v.wscore < 7
        ? { action: `Run one small, measured fix on ${weakLabel.toLowerCase()}`,
            why: `Your weakest pillar is ${weakLabel.toLowerCase()} at ${v.wscore}/10, so start there, small: one two week fix with a before and after measured against the Part 2 figures. It proves the approach works on your numbers before you commit to anything bigger.` }
        : { action: "Give the top ranked initiative a 90 day deadline",
            why: "Your foundations hold, so the risk now is spreading effort across four fronts at once. One initiative with a deadline compounds; four ambitions running in parallel dilute. The ranking in Part 4 already picked the one." },
        roadmap: [
      { phase: "Prove it", weeks: "Weeks 1 to 3", effort: "Moderate", focus: biz ? `Quick win on the ${weakLabel.toLowerCase()} pillar` : "First co delivered engagement, tightly scoped", service: biz ? "ONE Automation Pod" : "ONE Product Engineering Pod", actions: ["Baseline the cost using the Part 2 figures", "Ship one visible improvement", "Weekly output reviewed with the sponsor"], recovery_pct: rec[0] },
      { phase: "Stabilise", weeks: "Weeks 4 to 8", effort: "Heavy", focus: biz ? "Extend the win into the neighbouring pillar" : "Document the co delivery process so it repeats", service: biz ? "ONE Data Pod" : "ONE Integration Pod", actions: ["Turn the pilot into a standard process", "Close the not sure gaps recorded in Part 6", "Agree the measure that proves the return"], recovery_pct: rec[1] },
      { phase: "Compound", weeks: "Weeks 9 to 13", effort: "Moderate", focus: "Scale what worked, retire what it replaced", service: biz ? "ONE AI Pod" : "ONE AI Pod", actions: ["Roll out to the wider team with enablement", "Set the governance so it survives without heroes", "Plan the next initiative from the Part 4 ranking"], recovery_pct: rec[2] }
    ],
    within_reach: `Nothing in this plan needs a platform you do not have or a team you have not met. It needs one owner, one initiative and 90 days, which is exactly what the ranking in Part 4 was built to isolate.`,
    return_from: mc !== null
      ? `The return comes from the ${fmt(mc)} a month you priced yourself in Part 2: freed hours redeployed into revenue work, not headcount cuts. Estimates, from your own figures, never invented.`
      : `You skipped the sizing figures, so this report will not invent a return. Rerun the audit with your numbers, or bring them to the working session, and the same plan gets a price on it.`,
    current_state: `Today: ${S.goal ? `you want to ${S.goal.toLowerCase()}, but` : ""} the ${weakLabel.toLowerCase()} pillar at ${v.wscore} out of 10 slows every attempt, and the cost recurs monthly whether or not anyone measures it.`,
    future_state: `Day 90: the weakest pillar has one accountable owner, the first initiative has shipped a measured result, and the next move is chosen from evidence in this report rather than pressure.`,
    pillar_notes: Object.fromEntries(Object.keys(pl).map(k => {
      const rel = Object.values(S.answers).filter(a => a.pillar === k);
      const worst = rel.slice().sort((a, b) => (a.score ?? 3) - (b.score ?? 3))[0];
      return [k, rel.length
        ? `You told us: ${rel.map(a => '"' + a.text + '"').join(" and ")}. ${worst && (worst.score ?? 3) <= 5 ? "That answer is what holds this pillar down: it describes a recurring cost, not a one off." : "Those answers hold this pillar up; the job is keeping it that way while the weakest pillar catches up."}`
        : "No direct answers fed this pillar, so it takes a neutral score and a flag in Part 6."];
    })),
    goal_alignment: `Your stated goal is ${S.goal ? '"' + S.goal + '"' : "not stated"}. The plan is sequenced so the ${weakLabel.toLowerCase()} pillar is fixed before anything that depends on it, because skipping to the outcome without the foundation is how programmes stall. By phase three every change is measured against the figures in Part 2, so the goal gets evidence, not optimism.`,
    pilot: {
      title: biz ? "Two week fragmentation map and risk read out" : "One co delivered project, tightly scoped",
      body: biz
        ? "The smallest version of phase one that proves the approach: two weeks documenting every vendor, system and handoff in the flow you flagged, ending in a one page risk register with the three things most likely to cause the next stall or cost spike. No changes made. Small enough to say yes to this week, real enough to arm you internally."
        : "The smallest version of phase one that proves the approach: one project, one extended team, one documented handover, with your client relationship untouched and the margin measured against your Part 2 figures at the end. Small enough to say yes to this week, real enough to settle the co delivery question with evidence."
    },
    readiness_note: biz
      ? `Why AI readiness sits in a fragmentation report: you cannot have AI without foundations. AI amplifies whatever it sits on, so the pillar scores in Part 1 are also your AI readiness scores. Your weakest pillar, ${weakLabel}, at ${v.wscore}/10 is the exact layer any AI ambition depends on first.`
      : `Why capacity readiness decides everything else: co delivery amplifies whatever model it plugs into. The pillar scores in Part 1 are also your co delivery readiness scores, and your weakest pillar, ${weakLabel}, at ${v.wscore}/10 is the first thing a partner engagement would expose.`,
    trace: Object.values(S.answers).map(a => ({
      answer: a.text.length > 70 ? a.text.slice(0, 67) + "..." : a.text,
      question: a.q,
      changed: a.pillar
        ? `Scored the ${pl[a.pillar].label} pillar${a.score === null ? " conservatively as a recorded gap, and fed the blind spot in Part 3" : ""}.`
        : (a.q === GOAL_Q.q ? "Quoted at the top of Part 5; every phase is filtered through it." : "Set the lens every other answer was read through.")
    })).concat(S.followup ? [{ answer: S.followup, changed: "Named as the biggest blocker to the goal; the first phase of the plan is aimed at it." }] : []).concat(S.sizing ? [{ answer: "Your sizing figures", changed: "The only source for every money figure in Part 2 and the charts in Part 5." }] : [{ answer: "Sizing skipped", changed: "Part 2 says not sized instead of guessing. Nothing was invented." }])
  };
}

/* ------------------------------------------------------------------ gate */

function renderGate() {
  show("screen-gate");
  track("gate_shown");
  const r = S.report;
  $("gate-teaser").innerHTML = `
    <p><strong>${esc(r.headline)}</strong></p>
    <p>Verdict: <strong>${esc(S.verdict.label)}</strong> · Weakest pillar: ${esc(lane().pillars[S.verdict.weakest].label)} at ${S.verdict.wscore}/10</p>
    <p class="blur">${esc(r.blind_spot)} ${esc(r.first_move)} The rest of the report continues below once it is on its way to your inbox.</p>`;
  $("gate-submit").onclick = async () => {
    const first = $("g-first").value.trim(), last = $("g-last").value.trim(), company = $("g-company").value.trim(), email = $("g-email").value.trim();
    if (!first || !last || !company || !/.+@.+\..+/.test(email)) {
      $("gate-error").textContent = "First name, last name, company and a valid work email are all needed to send the report.";
      $("gate-error").classList.remove("hidden");
      return;
    }
    S.gate = { first, last, company, email };
    track("gate_completed");
    renderReport();
    show("screen-report");
    sendLead();
  };
}

async function sendLead() {
  const role = S.answers.role ? S.answers.role.text : (S.answers.firmtype ? S.answers.firmtype.text : "");
  const industry = S.answers.industry ? S.answers.industry.text : "";
  try {
    const res = await fetch("/api/lead", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: S.gate.email, first_name: S.gate.first, last_name: S.gate.last, company: S.gate.company,
        role, lane: S.lane, industry, headline: S.report.headline, verdict: S.verdict.label,
        report_html: emailHTML()
      })
    });
    const j = await res.json();
    if (j.email_sent) { $("r-sent").textContent = `A copy of this report is on its way to ${S.gate.email} ✓`; $("r-sent").classList.remove("hidden"); }
    else wireMailtoFallback();
  } catch (e) { wireMailtoFallback(); }
}

function wireMailtoFallback() {
  $("btn-email").onclick = () => {
    const body = encodeURIComponent(`My ONE Partner Audit result\n\nVerdict: ${S.verdict.label}\n${S.report.headline}\n\nSent from the Technovate ONE Partner Audit.`);
    location.href = `mailto:${window.CONTACT_EMAIL}?subject=${encodeURIComponent("ONE Partner Audit report request: " + S.gate.company)}&body=${body}`;
  };
}

/* ------------------------------------------------------------------ report render */

function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

function renderReport() {
  const r = S.report, v = S.verdict, pl = lane().pillars, biz = S.lane === "business";
  const mc = monthlyCost();
  const readiness = Math.round(Object.values(S.scores).reduce((a, b) => a + b, 0) / Object.keys(S.scores).length * 10);

  $("r-headline").textContent = r.headline;
  $("cta-book").href = window.CALENDLY_URL;
  $("r-cta-line").textContent = mc !== null
    ? `Every month this waits costs about ${fmt(mc)}. Est., from your own figures.`
    : "The plan is ready. The price of waiting is the one number you have not given it yet.";

  // Part 1: plain terms summary + self explaining verdict cards
  const fix = v.wscore >= 7 ? "Small" : v.wscore >= 4 ? "Medium" : "Large";
  $("r-plain").textContent = r.plain_summary || r.headline;
  $("r-vcards").innerHTML = [
    { l: "Type of problem", v: r.use_case.painkiller ? "Painkiller" : "Vitamin", w: r.use_case.painkiller ? "It is costing you now. Not insurance: an active, monthly cost." : "Nothing is bleeding. This compounds an advantage, and we say so honestly." },
    { l: "Cost of doing nothing", v: mc !== null ? fmt(mc) + "/mo" : "Not sized", w: mc !== null ? "From your own figures, arithmetic shown in Part 2. Not our number, yours." : "You skipped the figures, so nothing is invented. Part 2 explains." },
    { l: "Readiness", v: readiness + "%", w: "Average of your four pillar scores below. 100% does not exist; 70% plus is strong." },
    { l: "Verdict", v: esc(v.label), w: `Follows your weakest pillar (${esc(pl[v.weakest].label)}, ${v.wscore}/10), never your average. Ladder below.` },
    { l: "Fix size", v: fix, w: "Small means weeks of focused work · Medium about a quarter · Large a phased programme." }
  ].map(c => `<div class="vcard"><span class="v-lbl">${c.l}</span><span class="v-val">${c.v}</span><div class="v-why">${c.w}</div></div>`).join("");

  // integrated verdict ladder: best band at the top, YOU pinned to your rung
  const nextBand = v.all.slice().reverse().find(b => b.min > v.wscore);
  const cls = ["b-top", "b-mid", "b-low"];
  $("r-ladder").innerHTML = v.all.map((b, i) => {
    const current = b.label === v.label;
    const range = b.min === 7 ? "weakest pillar 7 or above" : b.min === 4 ? "weakest pillar 4 to 6.9" : "weakest pillar under 4";
    const rungNote = (nextBand && b.label === nextBand.label)
      ? `<p class="next-rung">The next rung up. You are <b>${(nextBand.min - v.wscore).toFixed(1)} points</b> on your weakest pillar from here.</p>` : "";
    return `<div class="band-row ${cls[i]}${current ? " current" : ""}">
      <div class="b-head"><span class="b-name">${esc(b.label)}</span><span class="b-range">${range}</span>${current ? `<span class="you-chip">YOU ARE HERE · ${esc(pl[v.weakest].label)} ${v.wscore}/10</span>` : ""}</div>
      <p class="b-desc">${esc(b.desc)}</p>${rungNote}
    </div>`;
  }).join("");
  $("r-verdict-reason").textContent = r.verdict_reason;
  $("r-pillars").innerHTML = Object.entries(S.scores).map(([k, s]) => `
    <div class="pillar">
      <div class="p-head"><span>${esc(pl[k].label)}${k === v.weakest ? " · weakest" : ""}</span><span>${s}/10</span></div>
      <div class="p-track"><div class="p-band"></div><div class="p-fill${k === v.weakest ? " weak" : ""}" style="width:${s * 10}%"></div></div>
      <div class="p-ticks"><span>0</span><span>4</span><span>7</span><span>10</span></div>
      <div class="anchors"><b>1 looks like:</b> ${esc(pl[k].low)}.<br><b>10 looks like:</b> ${esc(pl[k].high)}.</div>
      <div class="p-def">${esc(pl[k].def)}.</div>
      ${r.pillar_notes && r.pillar_notes[k] ? `<div class="p-why"><b>Why your score:</b> ${esc(r.pillar_notes[k])}</div>` : ""}
    </div>`).join("");
  $("r-readiness-note").textContent =
    `Each pillar runs 0 to 10 and states what a 1 and a 10 look like, so you have something to compare against. The shaded band on every bar marks 4 to 7, where most organisations land on a first pass: below it is a live gap, inside it is normal with known holes, above it is genuinely strong. Percent ready above is simply the pillar average. ` +
    (nextBand ? `You are ${(nextBand.min - v.wscore).toFixed(1)} points from ${nextBand.label}. ` : `You are in the top band; the job now is staying there. `) +
    v.desc;
  const fm = typeof r.first_move === "object" && r.first_move ? r.first_move : { action: String(r.first_move || ""), why: "" };
  $("r-fm-action").textContent = fm.action;
  $("r-fm-why").textContent = fm.why;

  // Part 2
  if (mc !== null) {
    const z = S.sizing;
    const worked = S.lane === "business"
      ? `${z.n} people × ${z.hrs}h/week × ${currency()}${z.rate}/h × 48 weeks ÷ 12 months = ${fmt(mc)}/month`
      : `bench: ${z.n} people × ${z.idle} idle days × ${currency()}${z.rate}/day = ${fmt(z.n * z.idle * z.rate)}/month · declined: ${z.declined} projects/quarter × ${currency()}${z.pv.toLocaleString("en-GB")} ÷ 3 = ${fmt(Math.round(z.declined * z.pv / 3))}/month`;
    $("r-cost-explain").textContent = `Built only from the figures you gave. How we computed it: ${worked}. Nothing here was invented; change the inputs and the outputs change.`;
  } else {
    $("r-cost-explain").textContent = "You skipped the sizing figures, so this part says not sized rather than guessing. Nothing in this report invents money.";
  }
  if (mc !== null) {
    const hw = lane().sizing.hoursWeek(S.sizing);
    $("r-cost-cards").innerHTML = `
      <div class="cost-card"><div class="num">${fmt(mc)}</div><div class="lbl">per month ${esc(lane().sizing.costLabel)} (est.)</div></div>
      <div class="cost-card"><div class="num">${fmt(mc * 12)}</div><div class="lbl">per year at the same rate (est.)</div></div>
      <div class="cost-card"><div class="num">${hw.toLocaleString("en-GB")}</div><div class="lbl">hours per week tied up (est.)</div></div>`;
    $("r-cost-formula").textContent = "Est. means estimate: your figures, our arithmetic, no guarantees.";
  } else {
    $("r-cost-cards").innerHTML = `<div class="cost-card"><div class="num">Not sized</div><div class="lbl">rerun with your figures or bring them to the session</div></div>`;
    $("r-cost-formula").textContent = "";
  }
  $("r-usecase").innerHTML = `<h4>${esc(r.use_case.title)}<span class="pill ${r.use_case.painkiller ? "pain" : "vit"}">${r.use_case.painkiller ? "Painkiller" : "Vitamin"}</span></h4><p>${esc(r.use_case.body)}</p><p class="part-explain">${esc(r.use_case.painkiller_reason)}</p>`;

  // Part 3
  $("r-blindspot").textContent = r.blind_spot;
  $("r-handoff-title").textContent = lane().handoffTitle;
  $("r-handoff-sub").textContent = lane().handoffSub;
  $("r-shadow-sub").textContent = lane().shadowSub;
  $("r-ready-sub").textContent = lane().readySub;
  $("r-handoff").textContent = r.exposure.handoff_check;
  $("r-risk").textContent = r.exposure.risk_level + " risk";
  $("r-risk").className = "risk " + r.exposure.risk_level;
  $("r-risk-reason").textContent = r.exposure.risk_reason;
  $("r-shadow-title").textContent = lane().shadowTitle;
  $("r-shadow").textContent = r.exposure.shadow_check;
  $("r-ready-title").textContent = biz ? "AI readiness" : "Capacity readiness";
  $("r-ready").textContent = r.readiness_note || (biz
    ? `The pillar scores in Part 1 are also your AI readiness scores, because AI amplifies whatever foundation it sits on. Your weakest pillar, ${pl[v.weakest].label}, is the layer any AI ambition depends on first.`
    : `The pillar scores in Part 1 are also your co delivery readiness scores. Your weakest pillar, ${pl[v.weakest].label}, is the first thing a partner engagement would expose.`);

  // Part 4
  $("r-service-legend").innerHTML = SERVICES.map(s => `<div class="svc-card"><b>${esc(s)}</b><span>${esc(SERVICES_DETAIL[s])}</span></div>`).join("");
  $("r-map").innerHTML = r.pain_map.map(row => `
    <div class="pain-card">
      <div class="pain-said"><span class="mini-kick">You told us</span><p>\u201C${esc(row.pain)}\u201D</p>${row.question ? `<span class="pain-q">In answer to: ${esc(row.question)}</span>` : ""}<span class="flag">Flagged in: ${esc(row.flagged_in)}</span></div>
      <div class="pain-arrow">→</div>
      <div class="pain-fix"><span class="mini-kick">The fix, and who owns it</span><p class="fix-line"><b>${esc(row.service)}</b><span class="pod-chip">${esc(row.pod)}</span></p><p class="practice">${esc(row.practice)}</p></div>
    </div>`).join("");
  $("r-ranking").innerHTML = r.ranking.map((rk, i) => `
    <div class="rank${i === 0 ? " win" : ""}">
      <div class="r-top"><strong>${i + 1}. ${esc(rk.initiative)}</strong><span><span class="score">${(rk.subscores.impact * 0.35 + rk.subscores.readiness * 0.25 + rk.subscores.speed * 0.20 + rk.subscores.fit * 0.20).toFixed(1)}</span><span class="band"> / 10 · ${esc(rk.band)}</span></span></div>
      <div class="subs"><span>Impact ${rk.subscores.impact}</span><span>Readiness ${rk.subscores.readiness}</span><span>Speed ${rk.subscores.speed}</span><span>Fit ${rk.subscores.fit}</span></div>
      <div class="maths">Weighted: (${rk.subscores.impact}×0.35) + (${rk.subscores.readiness}×0.25) + (${rk.subscores.speed}×0.20) + (${rk.subscores.fit}×0.20) = ${(rk.subscores.impact * 0.35 + rk.subscores.readiness * 0.25 + rk.subscores.speed * 0.20 + rk.subscores.fit * 0.20).toFixed(1)}</div>
      <p class="why">${esc(rk.why)}</p>
    </div>`).join("");

  // Part 5
  $("r-goal").textContent = "\u201C" + (S.goal || "No goal stated") + "\u201D";
  $("r-goal-align").textContent = r.goal_alignment || "";
  $("r-current").textContent = r.current_state;
  $("r-future").textContent = r.future_state;
  $("r-phases").innerHTML = r.roadmap.map(p => `
    <div class="phase">
      <div class="ph-head"><strong>${esc(p.phase)}</strong><span>${p.effort ? `<span class="effort">${esc(p.effort)} effort</span> ` : ""}<span class="weeks">${esc(p.weeks)}</span></span></div>
      <div class="svc">Delivered by: ${esc(p.service)}</div>
      <p>${esc(p.focus)}</p>
      <ul>${p.actions.map(a => `<li>${esc(a)}</li>`).join("")}</ul>
      ${mc !== null ? `<div class="recov">Cumulative recovery by end of phase: ~${Math.round(p.recovery_pct * 100)}% of the monthly cost, about ${fmt(Math.round(mc * p.recovery_pct))}/mo (est., from your own figures)</div>` : ""}
    </div>`).join("");
  renderCharts(r);
  const pilot = r.pilot || {};
  $("r-pilot").innerHTML = pilot.title
    ? `<span class="pilot-tag">Start small, stack wins</span><h4>${esc(pilot.title)}</h4><p>${esc(pilot.body)}</p><p class="part-explain">The first win proves the value, builds the trust and gives you the internal story.</p>`
    : "";
  $("r-withinreach").textContent = r.within_reach;
  $("r-returnfrom").textContent = r.return_from;

  // Part 6
  const wstats = WIDER[S.lane] || [];
  $("r-wider").innerHTML = wstats.map(w => `<div class="stat"><div class="big">${esc(w.big)}</div><div>${esc(w.txt)}</div><div class="src">Source · ${esc(w.src)}</div></div>`).join("");
  $("r-wider-note").textContent = "Published industry research, not generated numbers. Replaced with Technovate client results as they accumulate.";
  $("r-trace").innerHTML = r.trace.map(t => `<tr><td>\u201C${esc(t.answer)}\u201D${t.question ? `<span class="trace-q">${esc(t.question)}</span>` : ""}</td><td><span class="trace-arrow">→</span>${esc(t.changed)}</td></tr>`).join("");
  const gloss = [
    ["The six parts", "Part 1 scores you, Part 2 prices the gaps, Part 3 names the risks, Part 4 maps every pain to its fix, Part 5 sequences the fixes, and Part 6 shows the working."],
    ["The verdict", v.all.map(b => `${b.label} (${b.min === 7 ? "weakest pillar 7 plus" : b.min === 4 ? "4 to 6.9" : "under 4"})`).join(" · ") + ". Computed from your weakest pillar, never averaged up."],
    ["The four pillars", Object.values(pl).map(p => p.label).join("; ") + ". Each scored 0 to 10 from your answers, with anchors stating what a 1 and a 10 look like. Readiness % is simply their average."],
    ["Painkiller vs vitamin", "Whether this is a wound bleeding now or insurance for later. It sets the honest urgency, in either direction."],
    ["The blind spot", "The one risk your answers point at that you did not name yourself."],
    [biz ? "The handoff check" : "The scope creep check", biz ? "Whether systems and vendors connect into one accountable flow or bolt on like extra parts. The question is should you, not just can you." : "Whether scope is priced by documented process or by whoever is most tired that week."],
    ["Cost figures", "Computed only from the figures you provided, arithmetic shown where they appear. Est. means an estimate from your own figures; this report never invents money."],
    ["Ranking scores", "Weighted 35 Impact / 25 Readiness / 20 Speed / 20 Fit, out of 10, arithmetic shown per item. A 10 does not exist; the gap to 10 is the readiness gap the plan closes."],
    ["Recovery percentages", "Conservative, cumulative estimates of how much of the monthly figure each phase recovers, applied to your own number."],
    ["The six services and ONE Pods", SERVICES.join("; ") + ". Delivered through dedicated ONE Pods: " + PODS.join(", ") + "."],
    ["If this was forwarded to you", "It was generated from a ten minute audit answered by a colleague. Everything above traces back to their answers, shown in full in the trace table."]
  ];
  $("r-glossary").innerHTML = gloss.map(g => `<div class="g-row"><div class="g-term">${esc(g[0])}</div><div class="g-def">${esc(g[1])}</div></div>`).join("");

  // buttons
  countUp();
  $("btn-print").onclick = () => { track("one_pager"); printOnePager(); };
  $("btn-share").onclick = () => {
    track("whatsapp_share");
    const msg = encodeURIComponent(`Just ran the Technovate ONE Partner Audit. Verdict: ${S.verdict.label}. ${S.report.headline}`);
    window.open("https://wa.me/?text=" + msg, "_blank");
  };
  $("btn-restart").onclick = () => { localStorage.removeItem("tvn_audit"); location.href = location.pathname + (window.CONSULTANT ? "?mode=consultant" : ""); };
  $("btn-email").onclick = () => { sendLead(); $("btn-email").textContent = "Sent ✓"; setTimeout(() => $("btn-email").textContent = "Email me this report", 4000); };
}


function countUp() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".cost-card .num").forEach(el => {
    const final = el.textContent;
    const m = final.match(/([^0-9]*)([0-9,]+)(.*)/);
    if (!m) return;
    const target = parseInt(m[2].replace(/,/g, ""), 10);
    if (!target || target > 100000000) return;
    const t0 = performance.now(), dur = 900;
    function step(t) {
      const k = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - k, 3);
      el.textContent = m[1] + Math.round(target * eased).toLocaleString("en-GB") + m[3];
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });
}

/* ------------------------------------------------------------------ charts */

function renderCharts(r) {
  const box = $("r-charts");
  const mc = monthlyCost();
  if (mc === null) { box.innerHTML = `<p class="sec-intro" style="grid-column:1/-1">Not sized: you skipped the figures, so there is no curve to draw. Rerun with your numbers, or bring them to the working session, and this section fills in.</p>`; return; }
  const hw = lane().sizing.hoursWeek(S.sizing);
  const recs = [0, ...r.roadmap.map(p => p.recovery_pct)];
  const days = [0, 30, 60, 90];
  const pcts = r.roadmap.map(p => Math.round(p.recovery_pct * 100));
  const day90 = Math.round(mc * (1 - (recs[3] || 0)));
  box.innerHTML =
    chartSVG(days.map((d, i) => [d, Math.round(mc * (1 - (recs[i] || 0)))]), currency() + " still lost per month", "Money: starts at your Part 2 figure and falls as each phase recovers cost. Each dot is a milestone; lower is better.") +
    chartSVG(days.map((d, i) => [d, Math.round(hw * (1 - (recs[i] || 0)))]), "Hours still lost per week", "Hours: the same story in time instead of money. Each dot is a milestone; lower is better.") +
    `<p class="sec-intro" style="grid-column:1/-1;margin:4px 0 0">How to read these: both curves start at your own Part 2 figures (${fmt(mc)}/month and ${hw.toLocaleString("en-GB")} hours/week). Each phase recovers a conservative share of that figure: ${pcts[0]}% by day 30, ${pcts[1]}% by day 60, ${pcts[2]}% by day 90. Worked example: day 90 = ${fmt(mc)} × (1 − ${pcts[2]}%) = ${fmt(day90)}/month still lost. The gap between the first and last dot is what the plan recovers. Estimates from your own figures, not guarantees.</p>`;
}

function chartSVG(points, label, caption) {
  const W = 320, H = 168, P = 34;
  const gid = "g" + Math.random().toString(36).slice(2, 8);
  const maxY = Math.max(...points.map(p => p[1])) || 1;
  const names = ["Today", "Day 30", "Day 60", "Day 90"];
  const x = d => P + (d / 90) * (W - P * 2);
  const y = v => H - P - (v / maxY) * (H - P * 2 - 16);
  const path = points.map((p, i) => (i ? "L" : "M") + x(p[0]).toFixed(1) + " " + y(p[1]).toFixed(1)).join(" ");
  const dots = points.map((p, i) => `
    <circle cx="${x(p[0]).toFixed(1)}" cy="${y(p[1]).toFixed(1)}" r="3.5" fill="url(#${gid})"/>
    <text x="${x(p[0]).toFixed(1)}" y="${(y(p[1]) - 8).toFixed(1)}" fill="#101322" font-size="9.5" font-weight="700" text-anchor="middle">${p[1].toLocaleString("en-GB")}</text>
    <text x="${x(p[0]).toFixed(1)}" y="${H - 8}" fill="#5c6478" font-size="8.5" text-anchor="middle">${names[i] || ""}</text>`).join("");
  return `<figure class="chart"><svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(caption)}">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4fb3ff"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs>
    <line x1="${P}" y1="${H - P}" x2="${W - P}" y2="${H - P}" stroke="#e3e6f0"/>
    <path d="${path}" fill="none" stroke="url(#${gid})" stroke-width="2.5" stroke-linecap="round"/>${dots}
    <text x="${P}" y="14" fill="#5c6478" font-size="10">${esc(label)}</text>
  </svg><figcaption>${esc(caption)}</figcaption></figure>`;
}

/* ------------------------------------------------------------------ one pager + email html */

function printOnePager() {
  const r = S.report, v = S.verdict, mc = monthlyCost();
  const w = window.open("", "_blank");
  w.document.write(`<html><head><title>ONE Partner Audit — ${esc(S.gate ? S.gate.company : "")}</title>
    <style>body{font-family:Arial,sans-serif;color:#111;padding:32px;max-width:720px;margin:auto}h1{font-size:22px}h2{font-size:15px;margin-top:18px}
    .bar{height:8px;background:#eee;border-radius:6px;overflow:hidden}.fill{height:100%;background:#2e86ff}.weak .fill{background:#e05555}
    p,li{font-size:13px;line-height:1.5}.muted{color:#666;font-size:11px}</style></head><body>
    <h1>Technovate ONE Partner Audit — one pager</h1>
    <p><strong>${esc(r.headline)}</strong></p>
    <p>Verdict: <strong>${esc(v.label)}</strong> · ${mc !== null ? "Cost of doing nothing: " + fmt(mc) + "/mo (est., from the reader's own figures)" : "Cost: not sized"}</p>
    <h2>Pillars</h2>
    ${Object.entries(S.scores).map(([k, s]) => `<p>${esc(lane().pillars[k].label)} — ${s}/10</p><div class="bar ${k === v.weakest ? "weak" : ""}"><div class="fill" style="width:${s * 10}%"></div></div>`).join("")}
    <h2>Your first move</h2><p><strong>${esc(typeof r.first_move === "object" ? r.first_move.action : r.first_move)}</strong> ${esc(typeof r.first_move === "object" ? r.first_move.why : "")}</p>
    <h2>90 day plan</h2><ul>${r.roadmap.map(p => `<li><strong>${esc(p.phase)}</strong> (${esc(p.weeks)}): ${esc(p.focus)} — ${esc(p.service)}</li>`).join("")}</ul>
    <h2>How to read this one pager</h2>
    <p class="muted">Verdict follows the weakest pillar: 7 plus band one, 4 to 6.9 band two, under 4 band three. Est. means an estimate from the reader's own figures; nothing is invented. Full report and workings were emailed with this. Generated by the Technovate ONE Partner Audit.</p>
    <script>window.print()<\/script></body></html>`);
  w.document.close();
}

function emailHTML() {
  const r = S.report, v = S.verdict, mc = monthlyCost();
  return `
  <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#111">
    <h2 style="color:#0c1730">Your ONE Partner Audit report</h2>
    <p><strong>${esc(r.headline)}</strong></p>
    <p>Verdict: <strong>${esc(v.label)}</strong> (weakest pillar: ${esc(lane().pillars[v.weakest].label)} at ${v.wscore}/10)</p>
    ${mc !== null ? `<p>Cost of doing nothing: <strong>${fmt(mc)}/month</strong> (est., from your own figures: ${esc(lane().sizing.formula)})</p>` : "<p>Cost: not sized. You skipped the figures and we do not invent money.</p>"}
    <p><strong>Your first move:</strong> ${esc(typeof r.first_move === "object" ? r.first_move.action : r.first_move)}. ${esc(typeof r.first_move === "object" ? r.first_move.why : "")}</p>
    <h3>Your 90 day plan</h3>
    <ol>${r.roadmap.map(p => `<li><strong>${esc(p.phase)}</strong> (${esc(p.weeks)}): ${esc(p.focus)} — delivered by ${esc(p.service)}</li>`).join("")}</ol>
    <p><a href="${esc(window.CALENDLY_URL)}" style="background:#2e86ff;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;display:inline-block">Book the free working session</a></p>
    <h3>How to read this report</h3>
    <p style="color:#555;font-size:13px">The verdict follows the weakest of four pillars under a printed rule: 7 plus band one, 4 to 6.9 band two, under 4 band three. Painkiller means the fix stops an active cost; vitamin means it compounds an advantage. Est. means an estimate from the reader's own figures; this report never invents money. If this was forwarded to you, it was generated from a ten minute audit answered by a colleague, and everything traces back to their answers.</p>
    <p style="color:#999;font-size:12px">Technovate.One · Delivery owned. Complexity navigated. Outcomes engineered.</p>
  </div>`;
}
