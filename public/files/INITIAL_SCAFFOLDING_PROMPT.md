# INITIAL SCAFFOLDING PROMPT — MCX AI LAB 04 (`ai-powered-marketing`)

**Operator:** Hamilton Pinto Jr. (`@hpintojr`)  
**Program:** MasterClass Executive — Fall 2026 Founding Cohort (Pod 3 · Pacific Standard)  
**Lab:** AI Lab 04 — *AI-Powered Marketing: Campaigns, Voice, and Video*  
**GitHub Repository:** `hpintojr/ai-lab-powered-marketing` (`https://github.com/hpintojr/ai-lab-powered-marketing`)  
**Target Vercel Deployment:** `https://ai-lab-powered-marketing.vercel.app`  
**Portfolio Hub & Sync Target:** `hpintojr/hpintojr` (`https://hamiltonpinto.com/MCX-AI-Labs` and `https://hamiltonpinto.com/MCX-AI-Labs/ai-powered-marketing`)  
**Thesis Source:** `https://hamiltonpinto.com/masterclass/the-18-percent-problem-running-ai-like-a-company-not-a-chatbot` (`public/masterclass/the-18-percent-problem-running-ai-like-a-company-not-a-chatbot/index.html` in `hpintojr/hpintojr`)  
**Commercial Brand Target:** Mercury CRM (`https://www.getmercurycrm.com/`, evolving from Mercury Call Desk)  
**Layout & Theme Reference:** `https://ai-lab-cx-discovery.vercel.app/` (`hpintojr/-AI-Lab-CX-Discovery`) and `hpintojr/button-bear-ai-lab` (`scripts/mcx-ai-labs/build.mjs` + `scripts/mcx-ai-labs/labs.json`)

---

## 1. GOAL & CONTEXT

Build out the complete project files, site pages, scripts, and generated brand/media assets for **MasterClass Executive AI Lab 04 (`ai-powered-marketing`)** in `hpintojr/ai-lab-powered-marketing`, deploy it to `https://ai-lab-powered-marketing.vercel.app`, and sync Lab 04 into `hpintojr/hpintojr` (`https://hamiltonpinto.com/MCX-AI-Labs`) so progress updates from **3 of 12 labs (25%)** to **4 of 12 labs (33%)**.

Inspect the existing repositories (`hpintojr/-AI-Lab-CX-Discovery`, `hpintojr/button-bear-ai-lab`, and `hpintojr/hpintojr`) so this project follows the exact visual design system, layout structure, teleprompter/script reader (`/script/`), downloads view (`/downloads/`), and portfolio sync pattern already established.

---

## 2. PIPELINE & PRODUCTION ATTRIBUTION (SHOWCASE ON WEBSITE)

Display the full pipeline clearly on the project showcase website (`public/index.html`), `/script/`, and `/downloads/`:

- **Spec'd Out By:** **Gemini**
- **Full Build & Deployment:** Built and deployed with **Codex** (`hpintojr/ai-lab-powered-marketing` and `hpintojr/hpintojr` on Vercel)
- **Video & Media Editing:** Edited with **Claude** on the **Otto3** production server (`otto3` Linux editing environment using FFmpeg 9.0.2 + `ffprobe`, `faster-whisper` 1.2.1, Chromium 155 / Remotion motion graphics, and studio review cutroom sessions running `deepseek-v4.1-flash` and `qwen2.5:3b`)
- **Voice & Campaign Stack:** Connected via **ElevenLabs MCP** + **ElevenLabs Text-to-Speech v4** (and ElevenCreative Flows / campaign tools)

*(In the spoken walkthrough script, keep the pipeline mention concise toward the end so the primary focus stays on showcasing the work and leadership impact.)*

---

## 3. TWO-PART DELIVERABLES

### Part 1 — Thesis-to-Live-Podcast (`The 18% Problem: Running AI Like a Company, Not a Chatbot`)
- Source content from Hamilton Pinto Jr.'s thesis (`the-18-percent-problem-running-ai-like-a-company-not-a-chatbot` in `hpintojr/hpintojr`).
- Include the **intro**, **author** (**Hamilton Pinto Jr.**), **title** (*The 18% Problem: Running AI Like a Company, Not a Chatbot*), and **core thesis** in a natural, conversational, authoritative **ElevenLabs Text-to-Speech v4** script (`public/files/Thesis_Podcast_TTS_v4.md` and `prompts/thesis_podcast_tts_v4_script.md`)—without reading raw URLs or every table row.
- Frame AI operations as a true organizational revolution rather than "just a chatbot": why most organizations are behind on management rather than models, why only **18%** keep a complete AI agent inventory, why running AI like a company requires clear roles, scoped permissions, and human approval gates, and why the next standard is a **verifiable chain of custody** (identity, approval, action, and result chained so no one can quietly rewrite history).
- Include a brief closing sign-off noting that the project was spec'd out with Gemini, built with Codex, and edited through Claude on the Otto3 production server.
- Wire an HTML5 `<audio>` player on the showcase page pointing to `/media/thesis-podcast-v4.mp3` with a clean fallback state until the final `.mp3` is placed in `public/media/`.

### Part 2 — Mercury CRM 30-Second Commercial (`getmercurycrm.com`)
- Use this exact commercial script verbatim:
  > Remember 2002, every dentist, law firm, and hardware store needed computers, email, and a network. Almost none could set it up themselves. So every town had a computer guy. Every tech wave creates a local services layer. AI is that moment again. Small businesses need AI to answer calls, book appointments, and follow up. Right now, fewer than one in five, use it. But this time, you don't have to be the guy with the tool bag. Mercury builds your complete AI agency, and their team runs it. You own 100% of the business from day one. reviewing the pipeline five to ten hours a week, from $20,000, be the owner of the computer guy business of this decade, book a strategy call.
- **Exact Closing Screen / End-Card Layout (4 Tiers in Order):**
  1. **Top:** **Mercury CRM** logo (generated by Codex with **Mercury CRM** text/branding—not Mercury Call Desk—sampled from `https://www.getmercurycrm.com/` visual style)
  2. **Next:** `Book a call to learn more`
  3. **Beneath that (button):** `Book a strategy call`
  4. **Beneath that (small text):** `We'll walk you through exactly how it builds. No pressure, just clarity.`
- Render both a live HTML/CSS End-Card preview on the showcase site and a generated visual file (`public/media/mercury-commercial-endcard.png`).

---

## 4. CODEX-OWNED ASSET GENERATION (`scripts/generate_assets.mjs`)

Codex generates all visual brand, UI, storyboard, and end-card assets directly inside the repository (sampling `https://www.getmercurycrm.com/` aesthetic and replacing any legacy "Mercury Call Desk" wording with **Mercury CRM**):

- `public/brand/mercury-crm-logo-light.svg`
- `public/brand/mercury-crm-logo-dark.svg`
- `public/brand/mercury-crm-logo.png`
- `public/brand/masterclass-executive.png`
- `public/brand/chicago-booth.png`
- `public/brand/masterclass-motif.svg`
- `public/media/thesis-podcast-cover.jpg`
- `public/media/mercury-ad-poster.jpg`
- `public/media/mercury-commercial-endcard.png`
- `public/media/thesis-podcast-v4.mp3.README.txt`
- `public/media/lab04-walkthrough.mp4.README.txt`

---

## 5. REPOSITORY STRUCTURE (`hpintojr/ai-lab-powered-marketing`)

```text
ai-lab-powered-marketing/
├── CODEX_INSTRUCTIONS.md
├── README.md
├── vercel.json
├── portfolio_sync/
│   └── lab04_entry.json
├── prompts/
│   ├── elevenlabs_mcp_and_flows_prompts.md
│   └── thesis_podcast_tts_v4_script.md
├── scripts/
│   ├── generate_assets.mjs
│   └── sync_portfolio.mjs
└── public/
    ├── index.html
    ├── project.css
    ├── script/
    │   └── index.html
    ├── downloads/
    │   └── index.html
    ├── files/
    │   ├── Recording_Script.md
    │   ├── Thesis_Podcast_TTS_v4.md
    │   ├── Mercury_CRM_Commercial_Script.md
    │   ├── ElevenLabs_MCP_Flows_Workflow.md
    │   └── Verification_Record.md
    ├── brand/
    └── media/

```

---

## 6. WALKTHROUGH SCRIPT SPEC (`public/files/Recording_Script.md` & `/script/`)

Create a ~4-minute (within MasterClass's 3–5 minute window) presentation walkthrough script in **Hamilton Pinto Jr.'s own voice**, walking through the problem, AI usage across ElevenLabs MCP and voice/campaign tools, and intended impact with both deliverables visible on screen:

1. **0:00–0:45 — Hook & The Bigger Shift:** Frame AI as a true operational revolution and introduce the hybrid ElevenLabs MCP + creative/voice workflow across two complementary deliverables.
2. **0:45–2:10 — Part 1: *The 18% Problem* Thesis Turned Into a Live Podcast:** Show the thesis page and ElevenLabs TTS v4 podcast—introducing the author (Hamilton Pinto Jr.), title (*The 18% Problem: Running AI Like a Company, Not a Chatbot*), and core thesis on the 18% agent inventory gap, company-grade governance, operational risks, and verifiable chains of custody.
3. **2:10–3:30 — Part 2: The Mercury CRM Commercial & Exact End Card:** Show the Mercury CRM commercial script, the updated Mercury CRM brand visuals, and the closing end card (`Mercury CRM` logo at top, `Book a call to learn more`, `Book a strategy call` button, and `We'll walk you through exactly how it builds. No pressure, just clarity.` in small text).
4. **3:30–4:05 — Impact, Pipeline Credit & Portfolio Sync:** Highlight executive impact, briefly note the Gemini spec $\rightarrow$ Codex build $\rightarrow$ Claude (`otto3`) editing pipeline toward the close, and point to the live Vercel deployment and `/MCX-AI-Labs` hub.

---

## 7. ROLLOUT & VERIFICATION CHECKLIST

1. Scaffold and populate all files under `hpintojr/ai-lab-powered-marketing`.
2. Run `node scripts/generate_assets.mjs` and verify all image, SVG, script, and download paths resolve cleanly with zero `[TODO]` placeholders.
3. Deploy `hpintojr/ai-lab-powered-marketing` to `https://ai-lab-powered-marketing.vercel.app` and verify `/`, `/script/`, and `/downloads/` load cleanly.
4. Sync `portfolio_sync/lab04_entry.json` into `hpintojr/hpintojr`'s `scripts/mcx-ai-labs/labs.json` (setting Lab `04` status to `"completed"`), run `node scripts/mcx-ai-labs/build.mjs`, and push so `https://hamiltonpinto.com/MCX-AI-Labs` reflects **4 of 12 labs complete (33%)**.
5. Provide the final GitHub URL, live Vercel URL, updated portfolio status, and drop-in reminder for `public/media/thesis-podcast-v4.mp3` and `public/media/lab04-walkthrough.mp4`.
