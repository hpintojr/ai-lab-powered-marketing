# Production and verification record

## Credits

| Stage | Tool or person | Role |
| --- | --- | --- |
| Specification | Gemini and Hamilton Pinto Jr. | Developed the initial project brief and two-part architecture. Hamilton supplied the exact Mercury CRM narration, end-card copy, and original Mercury Call Desk SVG. |
| Site and media assembly | Codex | Adapted the thesis, authored the showcase and teleprompter, updated the SVG wordmark, made the campaign graphics, mixed the tracks, produced the social files, and wired playback into the thesis and portfolio. |
| Podcast host | ElevenLabs Voice Design through MCP | A custom conversational female host. She asks practical questions, gives the guest room to answer, and closes with an informal thank-you. |
| Podcast guest | ElevenLabs Voice Design through MCP | Custom American male co-host. Calm, measured counterpoint who explains Hamilton’s examples. |
| Commercial narration | ElevenLabs Voice Design through MCP | A separate direct, story-led voice for small-business owners. This speaker moves from the 2002 analogy to the strategy-call invitation. |
| Speech, score and caption timing | ElevenLabs MCP and ElevenCreative Flows | Text-to-Speech v4 (`eleven_v4`), Music v2.5 (`eleven_music_v2_5`), and Scribe (`eleven_scribe_v1`). |
| Image and video assembly | PowerShell/.NET drawing, resvg, Node.js, FFmpeg and ffprobe | Vector rasterization, infographic layout, caption burn-in, encode and media inspection. The commercial uses infographic graphics throughout. |
| Source control and hosting | GitHub and Vercel | Standalone showcase and Hamilton’s thesis and portfolio. |
| Walkthrough | Hamilton Pinto Jr. and Claude on Otto3 | Hamilton will record the walkthrough in his own voice. Claude on the Otto3 multi-agent production server is the planned editing stage. Record the tools and versions actually used after editing. |

## Media checks

- The podcast master runs about 2 minutes 35 seconds. It contains nine alternating speech turns and the host’s closing thank-you.
- The campaign uses Hamilton’s original narration verbatim. Scribe’s transcript matched the supplied text, and its word timings drive the on-screen captions.
- The exact script reads in 48.16 seconds. Each export runs 51 seconds including the end-card hold. The assignment calls for a 30-second commercial. A separate shorter narration remains open.
- Exports use H.264/AAC at 30 frames per second. Instagram Reels and YouTube Shorts use 1080 × 1920, YouTube uses 1920 × 1080, and LinkedIn uses 1080 × 1350.
- The campaign represents the offer and figures from Hamilton’s supplied narration. Its end card uses the updated Mercury CRM logo, headline, booking CTA, and supporting line in that order.
- MasterClass requires a 3–5 minute screen recording in Hamilton’s own voice with the finished campaign visible. The portfolio keeps this lab in progress pending the walkthrough and submission.
