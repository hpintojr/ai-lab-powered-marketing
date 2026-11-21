# AI Lab 04 production and release

The lab pairs a two-person audio adaptation of Hamilton Pinto Jr.’s thesis with a Mercury CRM commercial.

## Production sources

- `public/files/Thesis_Podcast_TTS_v4.md` collects the podcast turns.
- `public/files/Mercury_CRM_Creative_Brief.md` gives the design direction and campaign positioning.
- `public/files/Mercury_CRM_Commercial_Script.md` records the release narration and deliverable formats.
- `public/files/Recording_Script.md` is the 3–5 minute walkthrough Hamilton will read in his own voice.
- `public/files/Production_Usage_Ledger.md` separates measured usage from Hamilton’s reported model choices.
- `portfolio_sync/lab04_entry.json` mirrors the released portfolio entry.

## Build and release

Use `node scripts/build.mjs` to build the showcase, script reader, project files, and downloads. The same podcast master is deployed from the standalone repo and the thesis site.

Use `node scripts/render-mercury.mjs` to regenerate campaign files with Canvas and FFmpeg. Input voice and score files are placed locally as described in the README. The motion renderer draws each aspect separately and uses the timed narration in `production/mercury-timing.json`.
