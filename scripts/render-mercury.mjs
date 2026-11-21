import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const work = join(root, '.production');
const media = join(root, 'public', 'media');
const require = createRequire(join(work, 'package.json'));
const { createCanvas, loadImage, Path2D } = require('@napi-rs/canvas');
const formats = [
  { name: 'vertical', w: 900, h: 1600, target: '1080:1920' },
  { name: 'youtube', w: 1440, h: 810, target: '1920:1080' },
  { name: 'linkedin', w: 864, h: 1080, target: '1080:1350' },
];
const fps = 30;
const timing = JSON.parse(await readFile(join(root, 'production', 'mercury-timing.json'), 'utf8'));
const art = await loadImage(join(root, 'production', 'mercury-stills.jpg'));
const logo = await loadImage(join(root, 'public', 'brand', 'mercury-crm-logo.png'));
const cream = '#f6e7c9';
const ink = '#162b2b';
const teal = '#075b56';
const coral = '#aa3d2e';
const sky = '#80d2ff';
const ice = '#edf8ff';
const mint = '#a4f2cc';
const muted = '#9ebbd4';
const navy = '#0b1a30';
const labels = ['DENTIST', 'LAW OFFICE', 'HARDWARE'];

const icons = Object.fromEntries(Object.entries({
  computer: 'M3 4h18v13H3z M8 21h8 M12 17v4',
  envelope: 'M3 5h18v14H3z M3 7l9 7 9-7',
  network: 'M12 6v6 M5 17v-5h14v5 M9 2h6v4H9z M2 17h6v5H2z M16 17h6v5h-6z',
  phone: 'M7 3l4 5-3 3a12 12 0 0 0 5 5l3-3 5 4-2 4C10 22 2 14 3 5z',
  calendar: 'M4 6h16v15H4z M4 10h16 M8 3v6 M16 3v6 M8 16l2 2 5-5',
  check: 'M4 12l6 6L21 6',
  shop: 'M3 9l2-5h14l2 5z M5 10v10h14V10 M9 20v-6h5v6',
  arrow: 'M3 12h17 M14 6l6 6-6 6',
}).map(([name, path]) => [name, new Path2D(path)]));

const clamp = (x, low = 0, high = 1) => Math.max(low, Math.min(high, x));
const progress = (x, length) => clamp(x / length);
const ease = (x) => 1 - (1 - clamp(x)) ** 3;
const mix = (a, b, x) => a + (b - a) * x;
const phase = (t, start, span = .46) => ease(progress(t - start, span));
const C = (x, y, w, h) => ({ x, y, w, h });

function shape(ctx, box, fill, radius = 0, stroke = null, weight = 1) {
  const { x, y, w, h } = box;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, Math.min(radius, w / 2, h / 2));
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = weight; ctx.stroke(); }
}
function rule(ctx, x, y, x2, y2, color, width = 1) {
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2);
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke();
}
function type(ctx, str, x, y, size, color, opts = {}) {
  const { weight = 700, family = '"Segoe UI"', italic = false, align = 'left', width = null } = opts;
  ctx.font = (italic ? 'italic ' : '') + weight + ' ' + size + 'px ' + family;
  ctx.textAlign = align; ctx.textBaseline = 'top'; ctx.fillStyle = color;
  if (width) ctx.fillText(str, x, y, width);
  else ctx.fillText(str, x, y);
}
function fit(ctx, str, x, y, size, color, width, opts = {}) {
  type(ctx, str, x, y, size, color, { ...opts, width });
}
function mark(ctx, name, x, y, size, color, lineWidth = 1.65) {
  ctx.save(); ctx.translate(x, y); ctx.scale(size / 24, size / 24);
  ctx.lineWidth = lineWidth; ctx.strokeStyle = color; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.stroke(icons[name]); ctx.restore();
}
function label(ctx, value, x, y, max, color) {
  const spaced = [...value].join('\u2009');
  fit(ctx, spaced, x, y, 19, color, max, { weight: 750 });
}
function capsule(ctx, value, x, y, w, color, bg, height = 44) {
  shape(ctx, C(x,y,w,height), bg, height / 2);
  fit(ctx, value, x + w / 2, y + (height - 20) / 2, 19, color, w - 22, { align: 'center', weight: 750 });
}
function photo(ctx, idx, box, zoom = 0, tone = null, pad = 0) {
  const cellW = art.width / 2, cellH = art.height / 2;
  const ratio = Math.max(box.w / (cellW - 8), box.h / (cellH - 8)) * (1 + zoom * .1);
  const cropW = box.w / ratio, cropH = box.h / ratio;
  const x = idx % 2 * cellW + (cellW - cropW) * (.46 + zoom * .16);
  const y = Math.floor(idx / 2) * cellH + (cellH - cropH) * .5;
  ctx.save();
  shape(ctx, box, null, pad);
  ctx.clip();
  ctx.drawImage(art, x, y, cropW, cropH, box.x, box.y, box.w, box.h);
  if (tone) shape(ctx,box,tone);
  ctx.restore();
}
function sceneTitle(ctx, scene, layout, t) {
  const { x, y, w, size, tall } = layout;
  const first = [
    ['MAIN STREET LEDGER', 'Remember', '2002?'],
    ['THE EARLY WEB', 'Main Street', 'went online.'],
    ['THE TECH WAVE', 'Every shop needed', 'a connection.'],
    ['THE LOCAL SERVICE', 'Every town had', 'a computer guy.'],
    ['A NEW TECH WAVE', 'AI is that moment', 'again.'],
    ['THE WORK', 'Every call is', 'an opportunity.'],
    ['U.S. CENSUS BUREAU', 'Less than', 'one in five.'],
    ['MERCURY CRM', 'An AI receptionist', 'for Main Street.'],
    ['LEADS TO FOLLOW-UP', 'One connected', 'pipeline.'],
    ['CUSTOMER RELATIONSHIPS', 'Your customers.', 'Your relationships.'],
    ['TRY IT YOURSELF', 'Hear Mercury', 'answer.'],
  ][scene];
  const old = scene < 4;
  label(ctx, first[0], x, y, w, old ? teal : mint);
  const serif = { family: 'Georgia', weight: 700 };
  const textStyle = old ? serif : { weight: 800 };
  const offset = 16 * (1 - phase(t, .07, .42));
  fit(ctx, first[1], x, y + 48 + offset, size, old ? ink : ice, w, textStyle);
  const year = ['2005?', '2004?', '2003?', '2002?'][Math.min(3,Math.floor(t/.09))];
  fit(ctx, scene===0 ? year : first[2], x, y + 48 + size * 1.04 + offset, size, old ? teal : sky, w, old ? { ...serif, italic: true } : textStyle);
  if (!tall) rule(ctx, x, y + 66 + size * 2.12, x + 59, y + 66 + size * 2.12, old ? coral : mint, 3);
}
function backdrop(ctx, H, old) {
  const base = ctx.createLinearGradient(0, 0, 960, H);
  base.addColorStop(0, old ? '#faefd9' : '#091426');
  base.addColorStop(1, old ? '#dfc396' : '#10304c');
  shape(ctx, C(0,0,960,H), base);
  if (!old) {
    const light = ctx.createRadialGradient(830, H * .3, 15, 830, H * .3, H * .7);
    light.addColorStop(0, '#1d76a75c'); light.addColorStop(1, '#134d7b00');
    shape(ctx, C(0,0,960,H), light);
  }
  ctx.fillStyle = old ? '#3e2c1918' : '#90caff28';
  const step = old ? 12 : 22;
  for (let y = 5; y < H; y += step) {
    for (let x = 5 + ((y % (step * 2)) < step ? step / 2 : 0); x < 960; x += step) ctx.fillRect(x,y,old ? 1 : 1.4,old ? 1 : 1.4);
  }

}
function iconTile(ctx, box, key, title, sub, old) {
  const {x,y,w,h}=box;
  shape(ctx,box,old ? '#fff2d7' : '#102d48',15,old ? '#70553650' : '#75beee50',1.4);
  mark(ctx,key,x + 16,y+h*.22,Math.min(43,h*.52),old ? teal : sky);
  fit(ctx,title,x+73,y+h*.19,26,old ? ink : ice,w-83,{weight:770});
  if(sub) fit(ctx,sub,x+74,y+h*.56,16,old ? teal : muted,w-84,{weight:600});
}
function simplePhones(ctx, box, screen, t) {
  const {x,y,w,h}=box;
  const panel = ctx.createLinearGradient(x,y,x+w,y+h);
  panel.addColorStop(0,'#163a56'); panel.addColorStop(1,'#0b1b30');
  shape(ctx,box,panel,23,'#79beed55',1.5);
  const phoneW = Math.min(w*.46,h*.59);
  const phoneH = Math.min(h*.88,phoneW*1.83);
  const px=x+w*.5-phoneW*.5, py=y+h*.5-phoneH*.5;
  ctx.save(); ctx.shadowBlur = 35; ctx.shadowColor = '#23bfff5e';
  shape(ctx,C(px,py,phoneW,phoneH),'#091222',19,'#729db9',2); ctx.restore();
  shape(ctx,C(px+10,py+10,phoneW-20,phoneH-20),'#173453',14);
  shape(ctx,C(px+phoneW*.34,py+17,phoneW*.32,6),'#071222',3);
  fit(ctx,'Mercury CRM',px+phoneW*.5,py+phoneH*.21,23,ice,phoneW-24,{align:'center'});
  fit(ctx,screen,px+phoneW*.5,py+phoneH*.38,15,muted,phoneW-24,{align:'center'});
  const lines = 15;
  for (let i=0;i<lines;i++) {
    const hh = (8+18*Math.abs(Math.sin((i+1)*.45 + t*4)))*Math.min(1,phoneH/230);
    shape(ctx,C(px+phoneW*.2+i*phoneW*.6/lines,py+phoneH*.57-hh/2,3,hh),sky,1.5);
  }
  const button = Math.min(44,phoneH*.23);
  shape(ctx,C(px+phoneW*.5-button/2,py+phoneH*.71,button,button),mint,button/2);
  mark(ctx,'phone',px+phoneW*.5-button*.23,py+phoneH*.71+button*.27,button*.46,navy,2);
}
function drawSignal(ctx, box, t) {
  const { x,y,w,h }=box;
  for (let j=0;j<3;j++) {
    const px=x+j*w/3;
    photo(ctx,0,C(px+3,y,w/3-6,h*.63),j*.19+t*.03,'#1c528681',12);
    capsule(ctx,labels[j],px+10,y+h*.48,w/3-20,ice,'#122947ee',32);
    const p = phase(t,j*.17);
    const cy=y+h*.82-8*(1-p);
    mark(ctx,['phone','calendar','check'][j],px+w/6-17,cy-17,34,mint,2);
    if(j<2) rule(ctx,px+w/6+34,cy,px+w/2-34,cy,'#7fbedf75',1.6);
  }
}
function graphic(ctx, scene, box, t, tall) {
  const { x,y,w,h }=box;
  if (scene === 0) {
    shape(ctx,box,'#f7e8cc',15,teal,1.5);
    photo(ctx,1,C(x+7,y+7,w-14,h-14),progress(t,3),null,11);
    capsule(ctx,'12 MAR 2002',x+16,y+h-50,154,cream,teal,34);
  } else if (scene === 1) {
    photo(ctx,0,box,progress(t,3.4)*1.02,null,14);
    const bandH = Math.min(54,h*.22);
    shape(ctx,C(x+8,y+h-bandH-9,w-16,bandH),'#efe1c7ec',9);
    labels.forEach((tag,j)=>fit(ctx,tag,x+w*(j+.5)/3,y+h-bandH-8+(bandH-16)/2,16,ink,w/3-18,{align:'center'}));
  } else if (scene === 2) {
    const row = (h-22)/3;
    [['computer','Computers','Personal desktops'],['envelope','Email','A new inbox'],['network','Networks','Systems connected']].forEach(([icon,title,sub],i)=>{
      const p = phase(t,i*.22); ctx.save(); ctx.globalAlpha*=p;
      iconTile(ctx,C(x+25*(1-p),y+i*(row+11),w,row),icon,title,sub,true); ctx.restore();
    });
    const reveal=phase(t,1.55,.32);
    if(reveal>0){
      ctx.save(); ctx.globalAlpha*=reveal;
      photo(ctx,1,box,.14,null,14);
      const sw=w*.35, sh=h*.22, sx=x+w*.34, sy=y+h*.24;
      shape(ctx,C(sx-13,sy-12,sw,sh),'#c8d8d5',7,teal,1);
      shape(ctx,C(sx,sy,sw,sh),'#f7f3df',7,teal,1.3);
      shape(ctx,C(sx+4,sy+4,sw-8,sh*.28),'#d2e1d9',4);
      fit(ctx,'Network error',sx+9,sy+7,17,teal,sw-18);
      fit(ctx,'Try again?',sx+9,sy+sh*.48,19,ink,sw-18);
      ctx.save(); ctx.translate(x+w*.71,y+h*.51); ctx.rotate(-.07);
      shape(ctx,C(0,0,w*.23,h*.19),'#f9d969',4);
      fit(ctx,'HELP??',8,h*.048,23,ink,w*.23-16,{weight:800});
      ctx.restore(); ctx.restore();
    }
  } else if (scene === 3) {
    shape(ctx,box,'#fff2d7',15,'#5f432c7d',1.6);
    photo(ctx,2,C(x+w*.52,y+9,w*.48-9,h-18),progress(t,4),null,9);
    label(ctx,'CLASSIFIEDS',x+19,y+h*.12,w*.43,coral);
    fit(ctx,'COMPUTER',x+19,y+h*.31,44,ink,w*.43,{weight:900});
    fit(ctx,'HELP',x+19,y+h*.48,52,teal,w*.43,{weight:900});
    fit(ctx,'Networks / Email / Repairs',x+19,y+h*.82,18,ink,w*.43);
  } else if (scene === 4) {
    simplePhones(ctx,box,'AI RECEPTIONIST',t);
  } else if (scene === 5) {
    drawSignal(ctx,box,t);
  } else if (scene === 6) {
    shape(ctx,box,'#f4e7ce',17,'#8ac9ef82',1.5);
    label(ctx,'BUSINESS TRENDS AND OUTLOOK SURVEY',x+22,y+h*.09,w-44,teal);
    fit(ctx,'Firms with 4 or fewer employees',x+22,y+h*.26,25,ink,w-44);
    const gap = 9, tile = (w-44-gap*4)/5, edge = Math.min(tile,h*.34);
    for (let j=0;j<5;j++){
      const px=x+22+j*(tile+gap), py=y+h*.45;
      shape(ctx,C(px,py,tile,edge),j===0 ? '#cadecf' : '#e5d8bd',8);
      mark(ctx,'shop',px+tile/2-edge*.23,py+edge*.26,edge*.46,j===0 ? teal : '#7f7767');
    }
    fit(ctx,'Source: U.S. Census Bureau BTOS, Dec 2025–May 2026',x+22,y+h*.84,16,ink,w-44,{weight:620});
  } else if (scene === 7) {
    const row = (h-22)/3;
    [['phone','Answer calls','AI receptionist'],['calendar','Book appointments','Scheduling'],['check','Follow up','Keep the conversation going']].forEach(([icon,title,sub],i)=>{
      const p = phase(t,i*.26); ctx.save(); ctx.globalAlpha*=p;
      iconTile(ctx,C(x+25*(1-p),y+i*(row+11),w,row),icon,title,sub,false); ctx.restore();
    });
  } else if (scene === 8) {
    shape(ctx,box,'#122a44',16,'#71b4dd80',1.6);
    label(ctx,'PIPELINE · EXAMPLE',x+19,y+h*.08,w-38,mint);
    const columns = [['NEW CALL','Smile Dental','Pine Auto'],['BOOKED','Bay Vet'],['FOLLOW-UP','Oak Law','Elm Hardware']];
    const gap=8, col=(w-38-2*gap)/3, rowY=y+h*.4, ph=Math.min(45,h*.18);
    columns.forEach(([heading,...clients],j)=>{
      const left=x+19+j*(col+gap);
      shape(ctx,C(left,y+h*.26,col,h*.63),'#0d2137',8);
      fit(ctx,heading,left+8,y+h*.29,15,sky,col-16);
      clients.forEach((c,i)=>{
        if(j===0 && i===0) return;
        shape(ctx,C(left+5,rowY+i*(ph+6),col-10,ph),'#254865',6);
        fit(ctx,c,left+11,rowY+8+i*(ph+6),19,ice,col-22);
      });
    });
    const start=x+24, end=start+col+gap, p=phase(t,.48,1.55);
    const cx=mix(start,end,p), cy=rowY-Math.sin(Math.PI*p)*h*.1;
    shape(ctx,C(cx,cy,col-10,ph),'#b4ead7',6);
    fit(ctx,'Smile Dental',cx+6,cy+8,19,navy,col-22);
  } else if (scene === 9) {
    const radius=Math.min(h*.34,w*.2);
    const yMid=y+h*.46;
    const x1=x+w*.25, x2=x+w*.75;
    shape(ctx,box,'#102944',20,'#6abbee67',1.5);
    rule(ctx,x1,yMid,x2,yMid,'#75c9ec94',2);
    const travel=mix(x1,x2,phase(t,.13,.9)); shape(ctx,C(travel-6,yMid-6,12,12),mint,6);
    for (const [cx,key] of [[x1,'shop'],[x2,'phone']]) {
      shape(ctx,C(cx-radius,yMid-radius,radius*2,radius*2),'#1a3b59',radius,'#78c9f099',2);
      mark(ctx,key,cx-radius*.43,yMid-radius*.43,radius*.86,ice,1.7);
    }
    fit(ctx,'YOUR BUSINESS',x1,y+h*.87,17,mint,w*.43,{align:'center'});
    fit(ctx,'YOUR CUSTOMER',x2,y+h*.87,17,mint,w*.43,{align:'center'});
  } else if (scene === 10) {
    shape(ctx,box,'#f2e3ca',12,'#90c5dd99',1.6);
    photo(ctx,3,C(x+w*.61,y+8,w*.39-8,h-16),progress(t,3)*.65,null,8);
    const tagX=x+20, tagY=y+h*.16;
    label(ctx,'CLASSIFIEDS  /  2026',tagX,tagY,w*.55,teal);
    const fill=phase(t,.2,.56), wordY=y+h*.33;
    ctx.save(); ctx.globalAlpha*=1-fill;
    fit(ctx,'COMPUTER HELP',tagX,wordY,53,ink,w*.55,{weight:900});
    rule(ctx,tagX,wordY+29,tagX+w*.53*phase(t,.08,.29),wordY+29,coral,3);
    ctx.restore();
    ctx.save(); ctx.globalAlpha*=fill;
    fit(ctx,'AI HELP',tagX-9*(1-fill),wordY,63,teal,w*.55,{weight:900});
    fit(ctx,'(949) 775-0451',tagX,y+h*.65,37,ink,w*.55,{weight:820});
    fit(ctx,'Mercury AI demo',tagX,y+h*.84,18,teal,w*.55,{weight:650});
    ctx.restore();
  }
}
function closing(ctx, H, wide, t) {
  const center = 480;
  const top = H * (wide ? .105 : .19);
  const logoW = wide ? 330 : 510;
  const logoH = logoW * logo.height / logo.width;
  ctx.drawImage(logo,center-logoW/2,top,logoW,logoH);
  fit(ctx,'Book a call to learn more',center,top+logoH+(wide?31:61),wide?46:60,ice,790,{align:'center',weight:820});
  const x=center-(wide?195:242), w=wide?390:484, y=top+logoH+(wide?100:168), bh=wide?59:73;
  const glow = Math.max(0,1-Math.abs(t-1.2))*14;
  ctx.save(); ctx.shadowBlur=glow; ctx.shadowColor='#7fdfff'; shape(ctx,C(x,y,w,bh),sky,bh/2); ctx.restore();
  fit(ctx,'Book a strategy call',center,y+(bh-30)/2,29,navy,w-28,{align:'center',weight:820});
  const note = "We'll walk you through exactly how it builds.";
  fit(ctx,note,center,y+bh+21,wide?22:27,muted,746,{align:'center',weight:600});
  fit(ctx,'No pressure, just clarity.',center,y+bh+(wide?51:58),wide?20:24,muted,746,{align:'center',weight:540});
}
function caption(ctx, H, wide, cue, t, index, past, scene) {
  if (!cue) return;
  const elapsed=t-cue.start, remaining=cue.end-t;
  const entry=progress(elapsed,.21), leave=progress(remaining,.17);
  const settle=ease(entry), exit=ease(leave);
  const lane=[0,2,1,3,0,1,2,3][index%8];
  const inUpper = scene!==11 && (lane===0 || lane===2);
  const align = lane===0 || lane===1 ? 'left' : lane===2 ? 'right' : 'center';
  const xPlain = align==='left' ? 79 : align==='right' ? 881 : 480;
  const yPlain = scene===11 ? H*(wide?.845:.775) :
    wide ? H*[.102,.679,.751,.852][lane] :
    H*(inUpper ? [.293,.292,.296,.287][lane] : [.81,.81,.818,.848][lane]);
  const driftX = [48,-38,-55,10][lane] * (1-settle) + (lane===1?-18:19)*(1-exit);
  const driftY = [21,18,-23,-29][lane] * (1-settle) - 11*(1-exit);
  const tilt = [-.065,.06,.08,-.04][lane]*(1-settle) + .012*Math.sin(elapsed*2.8+index);
  const punch = 1+.11*Math.sin(entry*Math.PI)*(1-entry);
  const size = wide ? 36 : 48;
  const emphasis = new Set(['2002','dentist','network','computer','technology','AI','calls','appointments','five','Mercury','pipeline','relationship','busy','demo','strategy']);
  const clean = (word) => word.replace(/[^A-Za-z0-9-]/g,'');
  ctx.font='780 '+size+'px "Segoe UI"';
  const gap = wide ? 10 : 13;
  const widths=cue.words.map(word=>ctx.measureText(word.text).width);
  const rawWidth=widths.reduce((a,b)=>a+b,0)+(widths.length-1)*gap;
  const available = wide ? (align === 'center' ? 770 : 395) : 770;
  const squeeze=Math.min(1,available/rawWidth);
  const width=rawWidth*squeeze;
  const leading=align==='left'?0:align==='right'?-width:-width*.5;
  const hover=Math.sin(elapsed*4+index*.73)*5;
  ctx.save(); ctx.globalAlpha=Math.min(settle,exit);
  ctx.translate(xPlain + driftX + hover,yPlain + driftY + Math.cos(elapsed*3.8+index)*4);
  ctx.rotate(tilt); ctx.scale(punch,punch);
  const isBanner = !past || lane===1 || lane===3;
  if(isBanner){
    shape(ctx,C(leading-13,-9,width+26,size+17),past?'#fff1d7f4':'#071327f2',past?4:10,past?'#aa744a90':'#80caff73',1.4);
    if(!past) shape(ctx,C(leading-13,-9,4,size+17),sky,2.5);
  }else{
    shape(ctx,C(leading-7,size*.59,width+14,size*.405),'#f5d470b5',2);
  }
  let offset=0;
  cue.words.forEach((word,i)=>{
    const since=t-word.start;
    const impact=since>=0?Math.exp(-since*10)*Math.sin(since*21):0;
    const important=emphasis.has(clean(word.text));
    const active=since>=0 && (i===cue.words.length-1 || t<cue.words[i+1].start);
    const dx=offset*squeeze;
    const weight=active||important?880:750;
    const color=past?(active?coral:ink):(active?mint:ice);
    ctx.save();
    ctx.globalAlpha*=since<0?.68:.99;
    ctx.translate(leading+dx,active ? -10*impact : 0);
    if(active && important){
      const markW=widths[i]*squeeze;
      rule(ctx,0,size*.97,markW*phase(since,.02,.18),size*.97,past?coral:mint,2);
    }
    type(ctx,word.text,0,0,size,color,{weight,width:widths[i]*squeeze, family:past&&important?'Georgia':'"Segoe UI"'});
    ctx.restore();
    offset+=widths[i]+gap;
  });
  ctx.restore();
}
const entrances=[
  [0,36,.95],[-77,12,1.04],[54,-16,.98],[-25,48,.95],
  [66,22,.95],[-48,12,1.06],[0,-65,.93],[71,15,.96],
  [-33,54,.95],[46,5,1.07],[-42,-38,.96],
];
function frameArt(ctx,H,wide,tall,index,local,opacity) {
  const intro=phase(local,0,.47);
  ctx.save(); ctx.globalAlpha*=opacity;
  if(index===11){
    closing(ctx,H,wide,local);
    ctx.restore();
    return;
  }
  const [dx,dy,scale]=entrances[index];
  const left=wide?63:79;
  const titleY=H*(wide?.23:tall?.133:.11);
  const size=wide?49:tall?79:69;
  sceneTitle(ctx,index,{x:left,y:titleY,w:wide?400:800,size,tall:!wide},local);
  const box=C(wide?522:79,H*(wide?.21:tall?.335:.37),wide?367:802,H*(wide?.49:tall?.43:.36));
  const centerX=box.x+box.w/2, centerY=box.y+box.h/2;
  const camera=mix(scale,1,intro);
  ctx.save();
  ctx.translate(centerX+dx*(1-intro),centerY+dy*(1-intro));
  ctx.scale(camera,camera);
  ctx.translate(-centerX,-centerY);
  graphic(ctx,index,box,local,tall);
  ctx.restore();
  if(index>=4){
    const w=wide?132:158;
    const h=w*logo.height/logo.width;
    ctx.drawImage(logo,960-70-w,H*.052,w,h);
  }else{
    const y=H*.063;
    label(ctx,'MAIN STREET / 2002',left,y,320,teal);
    rule(ctx,left,y+29,960-left,y+29,'#254d4566',1.4);
  }
  ctx.restore();
}
function render(canvas, t) {
  const ctx=canvas.getContext('2d'), H=960*canvas.height/canvas.width, wide=H<650, tall=H>1300;
  const index=Math.max(0,timing.scenes.findLastIndex(scene=>scene.at<=t));
  const scene=timing.scenes[index], local=t-scene.at, past=index<4;
  const cap=timing.cues.findIndex(c=>t>=c.start&&t<c.end);
  ctx.save(); ctx.scale(canvas.width/960,canvas.width/960);
  backdrop(ctx,H,past);
  // The switch into the AI act is a hard cut. Nearby shots overlap briefly.
  const dissolve = index>0 && index!==4 && local<.24;
  const alpha=dissolve?phase(local,0,.24):1;
  if(dissolve) frameArt(ctx,H,wide,tall,index-1,t-timing.scenes[index-1].at,1-alpha);
  frameArt(ctx,H,wide,tall,index,local,alpha);
  caption(ctx,H,wide,timing.cues[cap],t,cap,past,index);
  const lineY=H*(wide?.955:.923);
  rule(ctx,79,lineY,881,lineY,past?'#254d4566':'#8dc6e166',1);
  rule(ctx,79,lineY,mix(79,881,progress(t,timing.duration)),lineY,past?teal:sky,2.4);
  ctx.restore();
}
function wait(child) {
  return new Promise((resolve,reject)=>{
    child.once('error',reject);
    child.once('close',code=>{if(code===0)resolve();else reject(Error('FFmpeg exited with '+code));});
  });
}
async function encode(format) {
  const canvas=createCanvas(format.w,format.h);
  const file=join(media,'mercury-crm-'+format.name+'.mp4');
  const voice=join(work,'narration-v2.mp3'), score=join(work,'score.mp3');
  const mixAudio='[1:a]highpass=f=65,apad[voice];[2:a]volume=0.10,afade=t=in:d=0.24,afade=t=out:st=46:d=3[bed];[voice][bed]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.9[out]';
  const child=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','rgba','-video_size',format.w+'x'+format.h,'-framerate',String(fps),'-i','pipe:0','-i',voice,'-i',score,'-filter_complex',mixAudio,'-map','0:v','-map','[out]','-vf','scale='+format.target+':flags=lanczos,format=yuv420p','-threads','5','-c:v','libx264','-preset','veryfast','-crf','20','-c:a','aac','-b:a','160k','-movflags','+faststart','-t',String(timing.duration),file],{stdio:['pipe','ignore','inherit']});
  const done=wait(child);
  child.stdin.on('error',()=>{});
  for (let i=0;i<Math.round(timing.duration*fps);i++){
    render(canvas,i/fps);
    if (!child.stdin.write(canvas.data())) await Promise.race([once(child.stdin,'drain'),done]);
  }
  child.stdin.end();
  await done;
  console.log('Encoded '+format.name+' '+format.target);
}
async function plates() {
  const thumbnails = createCanvas(1216, 1040);
  const thumb = createCanvas(278, 495);
  const ctx = thumbnails.getContext('2d');
  shape(ctx,C(0,0,1216,1040),'#0c172b');
  const tiles = createCanvas(1248,1390);
  const tilesCtx = tiles.getContext('2d');
  shape(tilesCtx,C(0,0,1248,1390),'#0c172b');
  for (let i=0;i<timing.scenes.length;i++){
    const scene = timing.scenes[i], end = timing.scenes[i+1]?.at ?? timing.duration;
    render(thumb,scene.at+(end-scene.at)*.57);
    const x=14+(i%4)*310, y=12+Math.floor(i/4)*454;
    // The board is a compact three-row view of the original production stills.
    tilesCtx.drawImage(thumb,x,y+20,222,394);
    type(tilesCtx,String(i+1).padStart(2,'0')+' · '+scene.name,x,y+421,17,ice,{width:280});
    if(i<8) ctx.drawImage(thumb,12+(i%4)*301,12+Math.floor(i/4)*510);
  }
  await writeFile(join(work,'mercury-preview.jpg'),thumbnails.toBuffer('image/jpeg',91));
  await writeFile(join(media,'mercury-crm-storyboard.jpg'),tiles.toBuffer('image/jpeg',93));
  const poster = createCanvas(1280,720);
  render(poster,.9);
  await writeFile(join(media,'mercury-ad-poster.jpg'),poster.toBuffer('image/jpeg',94));
  render(poster,timing.duration-.3);
  await writeFile(join(media,'mercury-commercial-endcard.png'),poster.toBuffer('image/png'));
}

await mkdir(work,{recursive:true});
const requested=process.argv.slice(2);
if(requested.length===0 || requested.includes('preview')) await plates();
for (const format of formats) if(requested.length===0 || requested.includes(format.name)) await encode(format);
