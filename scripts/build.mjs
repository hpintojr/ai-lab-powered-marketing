import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

(function () {
const root = fileURLToPath(new URL('../public/', import.meta.url));
const read = (name) => readFileSync(join(root, name), 'utf8');
const exists = (name) => existsSync(join(root, name));
const write = (name, html) => { mkdirSync(dirname(join(root, name)), { recursive: true }); writeFileSync(join(root, name), html); };
const e = (s) => s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const thesis = 'https://hamiltonpinto.com/masterclass/the-18-percent-problem-running-ai-like-a-company-not-a-chatbot';
const hub = 'https://hamiltonpinto.com/MCX-AI-Labs';
const booking = 'https://www.getmercurycrm.com/';
const audio = 'media/thesis-podcast-v4.mp3';
const walkthrough = 'media/lab04-walkthrough.mp4';
const campaign = 'media/mercury-crm-youtube.mp4';
const commercialPoster = 'media/mercury-ad-poster.jpg';
const transcript = read('files/Thesis_Podcast_TTS_v4.md').trim().split(/\r?\n\r?\n/).slice(2);
const transcriptHtml = transcript.filter((_,i) => i % 2 === 0).map((role,i) => `<p><strong>${e(role.replaceAll('*',''))}</strong> ${e(transcript[i * 2 + 1])}</p>`).join('\n');
const credit = `<footer><div class="credit-inner"><p><strong>Production</strong> · Gemini for specification · Muse for the revised brief · Codex (ChatGPT 6.2 Sol, high) for build and assembly · ElevenLabs MCP for voice and creative assets</p><p>Hamilton Pinto Jr. will film the walkthrough in his own voice and edit it with Claude on Otto3, his multi-agent production server.</p><p><a href="${hub}">MasterClass Executive AI Labs</a> · <a href="https://github.com/hpintojr/ai-lab-powered-marketing">GitHub</a></p></div></footer>`;
const shell = (title, heading, intro, body, options = {}) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#071426">
  <meta name="description" content="${e(intro)}">
  <title>${e(title)} | MasterClass Executive AI Lab 04</title>
  <link rel="stylesheet" href="/project.css">
${options.reader ? '<script defer src="/reader.js"></script>' : ''}
</head>
<body>
  <header class="top"><div class="nav"><strong>Hamilton Pinto Jr. · AI Lab 04</strong><nav aria-label="Project navigation"><a href="/">Showcase</a><a href="/script/">Recording script</a><a href="/project-files/">Project files</a><a href="/downloads/">Downloads</a></nav></div></header>
  <section class="hero"><div class="hero-inner">
    <div class="logos"><img src="/brand/masterclass-executive.png" alt="MasterClass Executive"><span aria-hidden="true">×</span><img src="/brand/chicago-booth.png" alt="The University of Chicago Booth School of Business"></div>
    <span class="kicker">AI-Powered Marketing · Campaigns, Voice, and Video</span>
    <h1>${heading}</h1><p>${e(intro)}</p>${options.actions ?? ''}
  </div></section>
  <main${options.reader ? ' class="reader"' : ''}>${body}</main>
  ${credit}
</body>
</html>
`;
const endCard = `<div class="endcard" aria-label="Mercury CRM closing screen preview">
  <img src="/brand/mercury-crm-logo-dark.svg" alt="Mercury CRM">
  <h3>Book a call to learn more</h3>
  <a class="button primary" href="${booking}">Book a strategy call</a>
  <p>We'll walk you through exactly how it builds. No pressure, just clarity.</p>
</div>`;
const video = (path, title, poster) => `<video controls playsinline preload="metadata" aria-label="${e(title)}"${poster && exists(poster) ? ` poster="/${poster}"` : ''}><source src="/${path}${path === campaign ? '?v=main-street-v4' : ''}" type="video/mp4"><a href="/${path}">Download the video</a></video>`;
write('index.html', shell('AI-Powered Marketing', 'One thesis.<br><span>One campaign.</span>', 'An audio conversation about running AI agents as an organization, and a motion campaign for Mercury CRM. A learner project by Hamilton Pinto Jr.', `
  <section class="panel podcast" id="podcast" aria-labelledby="podcast-title">
    <div><span class="kicker">Thesis podcast</span><h2 id="podcast-title">The 18% Problem</h2>
    <p>Two voices explore Hamilton Pinto Jr.’s thesis, <em>Running AI Like a Company, Not a Chatbot</em>, and what it takes to give agents roles, scoped permissions and a record of their actions.</p>
    ${exists(audio) ? `<audio controls preload="metadata" aria-label="Listen to The 18% Problem podcast"><source src="/${audio}?v=edc8fe378929" type="audio/mpeg"><a href="/${audio}">Download the podcast</a></audio><p class="small">Synthetic host and guest · ElevenLabs Text-to-Speech v4</p>` : '<p role="status">The audio edition is in production. You can read the conversation below.</p>'}
    <div class="actions"><a href="${thesis}#podcast">Open the original thesis</a>${exists(audio) ? ` <a href="/${audio}" download>Download MP3</a>` : ''}</div>
    <details><summary>Read the transcript</summary>${transcriptHtml}</details></div>
    <img class="cover" src="/media/thesis-podcast-cover.jpg" alt="An AI operator at a desk with a chain of linked records" loading="lazy">
  </section>
  <section class="panel" id="commercial" aria-labelledby="commercial-title">
    <span class="kicker">Mercury CRM campaign</span><h2 id="commercial-title">Every tech wave needs a local expert</h2>
    <div class="campaign">
      <div><p>The film starts on Main Street in 2002, then cuts to a Mercury CRM receptionist in action. A front-facing computer cutout gives way to illuminated storefronts, floating AI badges, and a three-step checklist punctuated by chimes.</p>
      ${exists(campaign) ? video(campaign, 'Mercury CRM motion campaign', commercialPoster) : '<p class="small">The commercial is in production. Preview the closing screen and read the original narration.</p>'}
      <div class="actions"><a href="/downloads/">Download campaign files</a><a href="/media/mercury-crm-storyboard.jpg">View the storyboard</a></div></div>
      ${endCard}
    </div>
  </section>
  <section class="panel" id="production" aria-labelledby="production-title">
    <span class="kicker">Production</span><h2 id="production-title">Models, time and tokens</h2>
    <p>Hamilton credits Gemini 4.0 Neon for the initial specification, Muse for revisiting the brief, and Codex with ChatGPT 6.2 Sol on high for the build. His Otto3 editing workflow uses Claude Opus 5.5 and Ollama DeepSeek.</p>
    <div class="actions"><a href="/project-files/">Browse the project Markdown</a><a href="/files/Production_Usage_Ledger.md">Read the usage ledger</a></div>
  </section>
  <section class="panel" id="walkthrough" aria-labelledby="walkthrough-title">
    <span class="kicker">MasterClass Executive submission</span><h2 id="walkthrough-title">Project walkthrough</h2>
    ${exists(walkthrough) ? video(walkthrough, 'Hamilton Pinto Jr. presents AI Lab 04') : '<p>Hamilton’s 3–5 minute screen-recorded walkthrough is in production.</p>'}
    <div class="actions"><a href="/script/">Open the recording reader</a><a href="/files/Verification_Record.md">View production and verification record</a></div>
  </section>`, {actions:'<div class="actions"><a class="button primary" href="#podcast">Listen to the podcast</a><a class="button" href="#commercial">Explore the campaign</a></div>'}));
const script = read('files/Recording_Script.md').trim().split(/\r?\n## /).slice(1);
const readerHtml = script.map((section) => {
  const [heading, ...paragraphs] = section.trim().split(/\r?\n\r?\n/);
  return `<section class="panel"><h2>${e(heading)}</h2>${paragraphs.map((p) => p.startsWith('> ') ? `<p class="cue">${e(p.slice(2))}</p>` : `<p class="spoken">${e(p)}</p>`).join('\n')}</section>`;
}).join('\n');
write('script/index.html', shell('Recording script', 'Project walkthrough', 'A timed reader with screen cues for Hamilton’s original 3–5 minute narration.', `
  <div class="toolbar" aria-label="Reader controls"><button class="button" type="button" data-cues aria-pressed="false">Hide screen cues</button><button class="button" type="button" data-size="-0.125" aria-label="Decrease text size">A−</button><button class="button" type="button" data-size="0.125" aria-label="Increase text size">A+</button><a class="button" href="/files/Recording_Script.md">Download Markdown</a></div>
  ${readerHtml}`, {reader:true}));
const downloads = [
  ['Recording script','Timed walkthrough with screen cues','files/Recording_Script.md'],
  ['Podcast transcript','Two-person conversation adapted from the thesis','files/Thesis_Podcast_TTS_v4.md'],
  ['Podcast audio','ElevenLabs v4 narration · MP3',audio],
  ['Mercury CRM creative brief','Visual direction, positioning and the Census source','files/Mercury_CRM_Creative_Brief.md'],
  ['Mercury CRM commercial script','Release narration and closing-screen layout','files/Mercury_CRM_Commercial_Script.md'],
  ['Instagram Reels and YouTube Shorts','9:16 · full on-screen captions','media/mercury-crm-vertical.mp4'],
  ['YouTube','16:9 · full on-screen captions',campaign],
  ['LinkedIn','4:5 · full on-screen captions','media/mercury-crm-linkedin.mp4'],
  ['Campaign storyboard','Twelve production frames','media/mercury-crm-storyboard.jpg'],
  ['Mercury CRM end card','Landscape PNG','media/mercury-commercial-endcard.png'],
  ['Mercury CRM logo','Dark-background SVG','brand/mercury-crm-logo-dark.svg'],
  ['ElevenLabs workflow','Voice, music, and infographic production','files/ElevenLabs_MCP_Flows_Workflow.md'],
  ['Verification record','Stack, checks and submission status','files/Verification_Record.md'],
  ['Models, time and tokens','Project usage ledger','files/Production_Usage_Ledger.md'],
  ['Project walkthrough','Hamilton’s own voice · MP4',walkthrough],
];
write('downloads/index.html', shell('Downloads', 'Project files', 'Download the scripts, production notes and available media exports.', `<div class="files">${downloads.filter((item) => exists(item[2])).map(([label, desc, path]) => `<article class="panel"><h2>${e(label)}</h2><p>${e(desc)}</p><a href="/${path}" download aria-label="${e('Download ' + label)}">Download</a></article>`).join('\n')}</div>`));
const documents = [
  [
    "Mercury CRM creative brief",
    "The story and visual direction",
    "public/files/Mercury_CRM_Creative_Brief.md"
  ],
  [
    "Mercury CRM commercial script",
    "The release narration and closing screen",
    "public/files/Mercury_CRM_Commercial_Script.md"
  ],
  [
    "Thesis podcast transcript",
    "The two-voice conversation",
    "public/files/Thesis_Podcast_TTS_v4.md"
  ],
  [
    "Walkthrough recording script",
    "Timing and screen cues",
    "public/files/Recording_Script.md"
  ],
  [
    "ElevenLabs workflow",
    "Voice, artwork, score and caption timing",
    "public/files/ElevenLabs_MCP_Flows_Workflow.md"
  ],
  [
    "Models, time and tokens",
    "Attribution and measured usage",
    "public/files/Production_Usage_Ledger.md"
  ],
  [
    "Verification record",
    "Media and release checks",
    "public/files/Verification_Record.md"
  ],
  [
    "Project README",
    "Project overview and build instructions",
    "README.md"
  ],
  [
    "Release instructions",
    "Source and publication notes",
    "CODEX_INSTRUCTIONS.md"
  ],
  [
    "Campaign prompts and workflow",
    "Production reference in the prompts directory",
    "prompts/elevenlabs_mcp_and_flows_prompts.md"
  ],
  [
    "Thesis voice script",
    "Speech input in the prompts directory",
    "prompts/thesis_podcast_tts_v4_script.md"
  ]
];
const filesPage = documents.map(([label,description,path])=>{
  const source = readFileSync(new URL('../'+path,import.meta.url),'utf8');
  const github = 'https://github.com/hpintojr/ai-lab-powered-marketing/blob/main/'+path;
  const target = path.startsWith('public/') ? path.slice(7) : 'files/source/'+path.replaceAll('/','-');
  if (!path.startsWith('public/')) write(target,source);
  return `<section class="panel project-document"><h2>${e(label)}</h2><p>${e(description)}</p><div class="actions"><a href="/${target}" download>Download Markdown</a><a href="${github}">Read on GitHub</a></div><details><summary>Show Markdown source</summary><pre>${e(source.trimEnd())}</pre></details></section>`;
}).join('\n');
write('project-files/index.html',shell('Project files','Project files','Browse the Markdown behind the commercial, podcast, and MasterClass submission.',filesPage));
})();
