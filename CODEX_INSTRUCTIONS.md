# AI Lab 04 production and release

The lab pairs a two-person audio adaptation of Hamilton Pinto Jr.’s thesis, *The 18% Problem: Running AI Like a Company, Not a Chatbot*, with a captioned Mercury CRM infographic commercial.

## Current sources

- `public/files/Thesis_Podcast_TTS_v4.md` contains the host and guest turns, including the closing thank-you.
- `public/files/Mercury_CRM_Commercial_Script.md` contains Hamilton’s original copy, the required four-tier end card, and the export formats.
- `public/files/Recording_Script.md` is the 3–5 minute walkthrough for Hamilton to record in his voice.
- `public/files/Verification_Record.md` records the tools, media checks, and remaining submission work.
- `portfolio_sync/lab04_entry.json` is the current entry for `hpintojr/hpintojr`.

## Build and publish

Use `node scripts/build.mjs` to refresh the static pages. The showcase, reader and downloads are deployed as `public/` on Vercel. Retain the same podcast master in the standalone repository and on the thesis page. Media regeneration uses `node scripts/generate_assets.mjs`, Windows PowerShell and FFmpeg. Place the original ElevenLabs campaign narration and score in `.production/commercial.mp3` and `.production/score.mp3` before regenerating the video.

Keep the release credits factual. Gemini helped with the spec, Codex built the site and assembled the production, and ElevenLabs MCP created voices, score and caption timings. Claude on Otto3 is the planned walkthrough editor. The walkthrough and 30-second assessment cut remain open.
