import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

(function () {
const base = fileURLToPath(new URL('../', import.meta.url));
const tmp = join(base,'.production');
const brand = join(base,'public','brand');
const media = join(base,'public','media');
const asset = join(tmp,'logo.png');
const need = (name) => { if (!existsSync(name)) throw new Error(`Missing production input: ${name}`); };
for (const name of ['commercial.mp3','score.mp3']) need(join(tmp,name));

const call = (program,args,opts={}) => {
  const result = spawnSync(program,args,{cwd:base,stdio:'inherit',...opts});
  if (result.error || result.status !== 0) throw result.error ?? new Error(`${program} failed (${result.status})`);
};
if (!existsSync(asset)) copyFileSync(join(brand,'mercury-crm-logo.png'), asset);
call('pwsh',['-NoProfile','-File',join(base,'scripts','render_graphics.ps1'),'-Output',tmp,'-LogoPath',asset]);
copyFileSync(asset, join(brand,'mercury-crm-logo.png'));
copyFileSync(join(tmp,'youtube','scene-5.png'),join(media,'mercury-commercial-endcard.png'));
call('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',join(tmp,'youtube','scene-0.png'),'-vf','scale=1280:720','-q:v','3',join(media,'mercury-ad-poster.jpg')]);
const cues = JSON.parse(readFileSync(join(base,'scripts','mercury-captions.json'),'utf8'));
const duration = 51;
const cuts = [0,17.04,24.32,30.64,38.72,46.88,duration];
function stamp(time) {
  const cs = Math.round(time*100);
  const hours = Math.floor(cs/360000);
  const mins = Math.floor(cs/6000)%60;
  const secs = Math.floor(cs/100)%60;
  const pad = (n) => String(n).padStart(2,'0');
  return `${hours}:${pad(mins)}:${pad(secs)}.${pad(cs%100)}`;
}
for (const [name,w,h,font,margin] of [['youtube',1920,1080,51,80],['vertical',1080,1920,47,300],['linkedin',1080,1350,45,120]]) {
  const folder = join(tmp,name);
  const ass = `[Script Info]
ScriptType: v4.00+
PlayResX: ${w}
PlayResY: ${h}
WrapStyle: 0
ScaledBorderAndShadow: yes
[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Captions,Segoe UI Semibold,${font},&H00FFFFFF,&H000000FF,&H20201607,&H20201607,-1,0,0,0,100,100,0,0,3,10,0,2,${name==='youtube'?120:122},${name==='youtube'?120:122},${margin},1
[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${cues.map(c=>`Dialogue: 0,${stamp(c.start)},${stamp(c.end)},Captions,,0,0,0,,${c.text}`).join('\n')}
`;
  writeFileSync(join(folder,'captions.ass'),ass);
  const list = cuts.slice(0,-1).map((t,i)=>`file 'scene-${i}.png'\nduration ${cuts[i+1]-t}`).join('\n')+"\nfile 'scene-5.png'\n";
  writeFileSync(join(folder,'timeline.txt'),list);
  const output=join(media,`mercury-crm-${name}.mp4`);
  const audioFx = "[1:a]highpass=f=65,acompressor=threshold=0.125:ratio=3:attack=10:release=120,volume=1.1,apad[voice];[2:a]volume=0.13,afade=t=in:d=0.25,afade=t=out:st=48.5:d=2.5[music];[voice][music]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.89[mix]";
  call('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i','timeline.txt','-i',join(tmp,'commercial.mp3'),'-i',join(tmp,'score.mp3'),'-vf','fps=30,subtitles=captions.ass,format=yuv420p','-filter_complex',audioFx,'-map','0:v','-map','[mix]','-c:v','libx264','-threads','6','-preset','veryfast','-crf','22','-c:a','aac','-b:a','160k','-movflags','+faststart','-t',String(duration),output],{cwd:folder});
}
})();
