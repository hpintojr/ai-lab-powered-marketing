# Models, time and token usage

## Credits

| Stage | Tool or model | Evidence |
| --- | --- | --- |
| Original specification | Gemini 4.0 Neon | Hamilton’s model credit |
| Revised Mercury brief | Muse | Hamilton’s workflow credit |
| Site, script adaptation, motion design and asset assembly | Codex with ChatGPT 6.2 Sol, high reasoning | Local turn context records `gpt-6.2-sol` at `high` for the main build and `medium` in the later motion pass |
| Narration | ElevenLabs Voice Design and TTS v4 via MCP | Two custom podcast voices and one separate campaign narrator |
| Campaign stills, soundtrack and word timings | GPT Image 2.5 Sunburst, ElevenLabs Music v2.5, and ElevenLabs Scribe via MCP | ElevenCreative campaign Flow |
| Walkthrough editing | Claude Opus 5.5 and Ollama DeepSeek on Otto3 | Hamilton’s editor workflow credit. The walkthrough recording remains pending. |
| Composition, encodes and publishing | Canvas, Node.js, FFmpeg, GitHub and Vercel | Renderer, checked MP4 streams, and production sites |

## Measured Codex session

Snapshot from Nov 20, 2026, 11:26 PM to Nov 21, 2026, 12:39 AM Pacific. Covers the original build and the latest motion revision up to the snapshot. The session counters are cumulative model activity, including prompt cache reuse.

| Metric | Recorded |
| --- | ---: |
| Total tokens | 42,046,902 |
| Input tokens | 41,923,647 |
| Cached input tokens | 41,556,480 |
| Uncached input tokens | 367,167 |
| Output tokens | 123,255 |
| Reasoning output, included in output | 28,620 |
| Session elapsed time, including pauses | 72 min 12 sec |
| Durations inside the completed and current Codex turns | 51 min 31 sec |

The previous campaign cut’s recorded local export commands ran for about 42.4 seconds for vertical, 29.5 seconds for YouTube, and 32.7 seconds for LinkedIn. They ran concurrently, so the longest command was about 42 seconds.

## Coverage

Gemini, Muse, Claude and Ollama token totals and elapsed times are unavailable in this project’s Codex record. ElevenLabs generation records describe media and durations, with a different usage unit from LLM tokens. The project-wide end-to-end total across all tools is therefore unknown.

To refresh the Codex snapshot, run `node scripts/summarize-codex-usage.mjs <session-log.jsonl>` against the relevant session export. It prints aggregate counts and timings only. For later editing, add measured Claude and Ollama totals from Otto3 exports and Gemini or Muse records if available. Keep wall-clock time, overlapping tool durations, and model counters distinct.

[OpenAI’s Codex telemetry reference](https://learn.chatgpt.com/docs/config-file/config-advanced)
