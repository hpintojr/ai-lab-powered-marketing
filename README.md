# MasterClass Executive AI Lab 04

Hamilton Pinto Jr.’s project pairs a conversational podcast of *The 18% Problem* with a Mercury CRM motion campaign. The [live project](https://ai-lab-powered-marketing.vercel.app/) contains the podcast, finished commercial, recording reader, campaign exports, and project Markdown.

## Build

Run `node scripts/build.mjs` to generate the static pages in `public/`.

Run `npm install --prefix .production @napi-rs/canvas` once to prepare the Windows production workspace. Place the revised voice track at `.production/narration-v2.mp3` and the music bed at `.production/score.mp3`. The editable visual assets and narration-aligned timeline are in `production/`. With FFmpeg available, run `node scripts/render-mercury.mjs` to regenerate all three exports and the storyboard.

## Project notes

- [Mercury creative brief](public/files/Mercury_CRM_Creative_Brief.md)
- [Models, time and token usage](public/files/Production_Usage_Ledger.md)
- [Verification record](public/files/Verification_Record.md)
