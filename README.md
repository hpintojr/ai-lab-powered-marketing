# MasterClass Executive AI Lab 04

Hamilton Pinto Jr.’s project pairs a conversational podcast of *The 18% Problem* with a Mercury CRM campaign. The target [showcase](https://ai-lab-powered-marketing.vercel.app/) has the audio player, campaign and end-card preview, recording reader, and downloads.

```powershell
node scripts/generate_assets.mjs
node scripts/build.mjs
```

The static output is `public/`. The project checks which media exports exist when generating markup. The walkthrough must be filmed with Hamilton’s original narration, then edited in Claude on Otto3. The [verification record](public/files/Verification_Record.md) records the production stack.
