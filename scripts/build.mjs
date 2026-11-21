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
const booking = 'https://crm.sulus.ai/b/demo-call-calendar';
const audio = 'media/thesis-podcast-v4.mp3';
const walkthrough = 'media/lab04-walkthrough.mp4';
const campaign = 'media/mercury-crm-youtube.mp4';
const commercialPoster = 'media/mercury-ad-poster.jpg';
const transcript = read('files/Thesis_Podcast_TTS_v4.md').trim().split(/\r?\n\r?\n/).slice(2);
const transcriptHtml = transcript.filter((_,i) => i % 2 === 0).map((role,i) => `<p><strong>${e(role.replaceAll('*',''))}</strong> ${e(transcript[i * 2 + 1])}</p>`).join('\n');
const credit = `<footer><div class="credit-inner"><p><strong>Production</strong> · Gemini for specification · Codex for build and assembly · ElevenLabs MCP for voice and campaign audio · GitHub and Vercel for publishing</p><p>Hamilton Pinto Jr. will film the walkthrough in his own voice and edit it with Claude on Otto3, his multi-agent production server.</p><p><a href="${hub}">MasterClass Executive AI Labs</a> · <a href="https://github.com/hpintojr/ai-lab-powered-marketing">GitHub</a></p></div></footer>`;
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
  <header class="top"><div class="nav"><strong>Hamilton Pinto Jr. · AI Lab 04</strong><nav aria-label="Project navigation"><a href="/">Showcase</a><a href="/script/">Recording script</a><a href="/downloads/">Downloads</a></nav></div></header>
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
const video = (path, title, poster) => `<video controls playsinline preload="metadata" aria-label="${e(title)}"${poster && exists(poster) ? ` poster="/${poster}"` : ''}><source src="/${path}" type="video/mp4"><a href="/${path}">Download the video</a></video>`;
write('index.html', shell('AI-Powered Marketing', 'One thesis.<br><span>One campaign.</span>', 'An audio conversation about running AI agents as an organization, and an infographic campaign for Mercury CRM. A learner project by Hamilton Pinto Jr.', `
  <section class="panel podcast" id="podcast" aria-labelledby="podcast-title">
    <div><span class="kicker">Thesis podcast</span><h2 id="podcast-title">The 18% Problem</h2>
    <p>Two voices explore Hamilton Pinto Jr.’s thesis, <em>Running AI Like a Company, Not a Chatbot</em>, and what it takes to give agents roles, scoped permissions and a record of their actions.</p>
    ${exists(audio) ? `<audio controls preload="metadata" aria-label="Listen to The 18% Problem podcast"><source src="/${audio}" type="audio/mpeg"><a href="/${audio}">Download the podcast</a></audio><p class="small">Synthetic host and guest · ElevenLabs Text-to-Speech v4</p>` : '<p role="status">The audio edition is in production. You can read the conversation below.</p>'}
    <div class="actions"><a href="${thesis}#podcast">Open the original thesis</a>${exists(audio) ? ` <a href="/${audio}" download>Download MP3</a>` : ''}</div>
    <details><summary>Read the transcript</summary>${transcriptHtml}</details></div>
    <img class="cover" src="/media/thesis-podcast-cover.jpg" alt="An AI operator at a desk with a chain of linked records" loading="lazy">
  </section>
  <section class="panel" id="commercial" aria-labelledby="commercial-title">
    <span class="kicker">Mercury CRM campaign</span><h2 id="commercial-title">Every tech wave needs a local expert</h2>
    <div class="campaign">
      <div><p>The campaign introduces Mercury CRM’s AI agency offer to entrepreneurs who want to serve local businesses. Its graphics and full captions carry the story across social formats.</p>
      ${exists(campaign) ? video(campaign, 'Mercury CRM infographic commercial', commercialPoster) : '<p class="small">The commercial is in production. Preview the closing screen and read the original narration.</p>'}
      <div class="actions"><a href="/downloads/">Download campaign files</a><a href="/files/Mercury_CRM_Commercial_Script.md">Read the commercial script</a></div></div>
      ${endCard}
    </div>
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
  ['Mercury CRM commercial script','Hamilton’s original narration and the closing-screen layout','files/Mercury_CRM_Commercial_Script.md'],
  ['Instagram Reels and YouTube Shorts','9:16 · full on-screen captions','media/mercury-crm-vertical.mp4'],
  ['YouTube','16:9 · full on-screen captions',campaign],
  ['LinkedIn','4:5 · full on-screen captions','media/mercury-crm-linkedin.mp4'],
  ['Mercury CRM end card','Landscape PNG','media/mercury-commercial-endcard.png'],
  ['Mercury CRM logo','Dark-background SVG','brand/mercury-crm-logo-dark.svg'],
  ['ElevenLabs workflow','Voice, music, and infographic production','files/ElevenLabs_MCP_Flows_Workflow.md'],
  ['Verification record','Stack, checks and submission status','files/Verification_Record.md'],
  ['Project walkthrough','Hamilton’s own voice · MP4',walkthrough],
];
write('downloads/index.html', shell('Downloads', 'Project files', 'Download the scripts, production notes and available media exports.', `<div class="files">${downloads.filter((item) => exists(item[2])).map(([label, desc, path]) => `<article class="panel"><h2>${e(label)}</h2><p>${e(desc)}</p><a href="/${path}" download aria-label="${e('Download ' + label)}">Download</a></article>`).join('\n')}</div>`));
})();