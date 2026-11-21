# CODEX EXECUTION INSTRUCTIONS — AI LAB 04 (`ai-lab-powered-marketing`)

Build out the full static web project in `public/` matching the layout and visual theme of `https://ai-lab-cx-discovery.vercel.app/` (`hpintojr/-AI-Lab-CX-Discovery`) and `hpintojr/button-bear-ai-lab`.

## Pipeline & Production Attribution (Showcase on Website)
Display clearly on the project showcase page (`public/index.html`) and downloads/script metadata:
- **Spec'd by:** **Gemini**
- **Built with:** **Codex**
- **Video editing:** **Claude** on the **Otto3** production server (Linux editing stack: FFmpeg 9.0.2, `faster-whisper`, Remotion/Chromium motion graphics, and studio review cutroom workflow)
- **Voice & campaign stack:** **ElevenLabs MCP** + **ElevenLabs Text-to-Speech v4**

## Core Requirements
1. **Part 1 — Thesis Podcast (`The 18% Problem: Running AI Like a Company, Not a Chatbot`):**
   - Pull from `hamiltonpinto.com/masterclass/the-18-percent-problem-running-ai-like-a-company-not-a-chatbot` (`hpintojr/hpintojr`).
   - Author: **Hamilton Pinto Jr.**
   - Title: **The 18% Problem: Running AI Like a Company, Not a Chatbot**.
   - Deliver a natural, conversational, authoritative ElevenLabs Text-to-Speech v4 script (`public/files/Thesis_Podcast_TTS_v4.md` & `prompts/thesis_podcast_tts_v4_script.md`) that covers the intro, author, title, and core thesis without reading raw URLs or every table row.
   - Wire an audio player (`public/media/thesis-podcast-v4.mp3`) on the showcase page.

2. **Part 2 — Mercury CRM Commercial (`getmercurycrm.com`):**
   - Keep this exact script:
     > Remember 2002, every dentist, law firm, and hardware store needed computers, email, and a network. Almost none could set it up themselves. So every town had a computer guy. Every tech wave creates a local services layer. AI is that moment again. Small businesses need AI to answer calls, book appointments, and follow up. Right now, fewer than one in five, use it. But this time, you don't have to be the guy with the tool bag. Mercury builds your complete AI agency, and their team runs it. You own 100% of the business from day one. reviewing the pipeline five to ten hours a week, from $20,000, be the owner of the computer guy business of this decade, book a strategy call.
   - Generate all brand/UI/storyboard/end-card visuals inside the repo under `public/brand/` and `public/media/` using `scripts/generate_assets.mjs`, sampling `https://www.getmercurycrm.com/` aesthetic and updating brand marks to say **Mercury CRM** (not Mercury Call Desk).
   - **Exact End-Card Layout:**
     1. Top: **Mercury CRM** logo
     2. Next: `Book a call to learn more`
     3. Button beneath that: `Book a strategy call`
     4. Small text beneath button: `We'll walk you through exactly how it builds. No pressure, just clarity.`

3. **Walkthrough Script (`/script/` and `public/files/Recording_Script.md`):**
   - 3–5 minute presentation walkthrough in Hamilton's own voice covering the thesis podcast, the Mercury CRM commercial, hybrid ElevenLabs MCP + creative workflow, executive impact, and a concise wrap-up noting Gemini for the spec, Codex for the build, and Claude on the Otto3 production server for editing.

4. **Portfolio Sync (`hpintojr/hpintojr`):**
   - Update Lab `04` (`ai-powered-marketing`) to `"completed"` in `scripts/mcx-ai-labs/labs.json`, run `node scripts/mcx-ai-labs/build.mjs`, and push so `/MCX-AI-Labs` reflects **4 of 12 labs complete (33%)**.
