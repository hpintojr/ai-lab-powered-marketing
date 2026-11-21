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
    ['THE WORK', 'Small businesses', 'need AI to…'],
    ['U.S. CENSUS BUREAU', 'AI adoption', 'on Main Street.'],
    ['MERCURY CRM', 'An AI receptionist', 'for Main Street.'],
    ['LEADS TO FOLLOW-UP', 'One connected', 'pipeline.'],
    ['CUSTOMER RELATIONSHIPS', 'Your customers.', 'Your relationships.'],
    ['TRY IT YOURSELF', 'Hear Mercury', 'answer.'],
  ][scene];
  const old = scene < 4;
  label(ctx, first[0], x, y, w, old ? teal : mint);
  const serif = { family: 'Georgia', weight: 700 };
  const textStyle = old ? serif : { weight: 900, family: '"Arial Black", "Segoe UI"' };
  const offset = 16 * (1 - phase(t, .07, .42));
  fit(ctx, first[1], x, y + 48 + offset, size, old ? ink : ice, w, textStyle);
  const year = ['2005?', '2004?', '2003?', '2002?'][Math.min(3,Math.floor(t/.09))];
  fit(ctx, scene===0 ? year : first[2], x, y + 48 + size * 1.04 + offset, size, old ? teal : sky, w, old ? { ...serif, italic: true } : textStyle);
  if (!tall) rule(ctx, x, y + 66 + size * 2.12, x + 59, y + 66 + size * 2.12, old ? coral : mint, 3);
}
function backdrop(ctx, H, old) {
  const base = ctx.createLinearGradient(0, 0, 960, H);
  base.addColorStop(0, old ? '#faf1de' : '#172751');
  base.addColorStop(1, old ? '#e6cba5' : '#142449');
  shape(ctx, C(0,0,960,H), base);
  if (!old) {
    const light = ctx.createRadialGradient(830, H * .3, 15, 830, H * .3, H * .7);
    light.addColorStop(0, '#528ef3a2'); light.addColorStop(.48,'#3c64b53e'); light.addColorStop(1, '#294b8d00');
    shape(ctx, C(0,0,960,H), light);
  }
  ctx.fillStyle = old ? '#574b3713' : '#b5c9f61a';
  const step = old ? 12 : 22;
  for (let y = 5; y < H; y += step) {
    for (let x = 5 + ((y % (step * 2)) < step ? step / 2 : 0); x < 960; x += step) ctx.fillRect(x,y,old ? 1 : 1.4,old ? 1 : 1.4);
  }

}
function simplePhones(ctx, box, screen, t) {
  const {x,y,w,h}=box;
  const bloom = ctx.createRadialGradient(x+w*.5,y+h*.47,12,x+w*.5,y+h*.47,w*.5);
  bloom.addColorStop(0,'#8acdff7f'); bloom.addColorStop(1,'#5484d400');
  shape(ctx,C(x,y,w,h),bloom);
  const span=Math.min(w,h);
  for(let j=0;j<3;j++){
    const pulse=progress((t+j*.45)%1.8,1.8);
    const radius=span*(.09+pulse*.42);
    shape(ctx,C(x+w*.5-radius,y+h*.5-radius,radius*2,radius*2),null,radius,'rgba(193,230,255,'+(.33*(1-pulse))+')',1.3);
  }
  const phoneW = Math.min(w*.46,h*.59);
  const phoneH = Math.min(h*.88,phoneW*1.83);
  const px=x+w*.5-phoneW*.5, py=y+h*.5-phoneH*.5;
  ctx.save(); ctx.shadowBlur = 35; ctx.shadowColor = '#23bfff5e';
  shape(ctx,C(px,py,phoneW,phoneH),'#091222',19,'#729db9',2); ctx.restore();
  shape(ctx,C(px+10,py+10,phoneW-20,phoneH-20),'#173453',14);
  shape(ctx,C(px+phoneW*.34,py+17,phoneW*.32,6),'#071222',3);
  const brandW=phoneW*.8, brandH=brandW*logo.height/logo.width;
  ctx.drawImage(logo,px+(phoneW-brandW)/2,py+phoneH*.24-brandH/2,brandW,brandH);
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
const serviceMarks = [
  { icon:'phone', text:'Answer calls', badge:18.43, check:19.60, hz:660 },
  { icon:'calendar', text:'Book appointments', badge:18.79, check:20.72, hz:825 },
  { icon:'check', text:'Follow up', badge:19.15, check:21.84, hz:990 },
];
const snap = (t) => t <= 0 ? 0 : 1 - Math.exp(-t*12)*Math.cos(t*19);
const buildingEdges = [6,194,399,637];
const storefrontShapes = [
  'M.04 .99V.13L.14 .13L.14 .04L.96 .04V.99Z',
  'M.04 .99V.025H.95V.99Z',
  'M.04 .99V.16L.96 .05V.99Z',
].map(d=>new Path2D(d));

function storefront(ctx, j, box, active, old) {
  const {x,y,w,h}=box;
  const stencil=storefrontShapes[j];
  ctx.save();
  ctx.translate(x,y); ctx.scale(w,h);
  ctx.save(); ctx.clip(stencil);
  const l=buildingEdges[j], sw=buildingEdges[j+1]-l;
  ctx.drawImage(art,l,5,sw,264,0,0,1,1);
  ctx.fillStyle=old ? 'rgba(45,70,49,'+(.18*(1-active))+')' : 'rgba(27,68,155,'+(.52-.31*active)+')';
  ctx.fillRect(0,0,1,1); ctx.restore();
  ctx.strokeStyle=old?'rgba(253,247,222,'+(.63+.35*active)+')':'rgba(204,235,255,'+(.35+.63*active)+')';
  ctx.lineWidth=(1+3*active)/w;
  ctx.stroke(stencil); ctx.restore();
  const font=Math.min(30,w*.16);
  const signH=font+14;
  const sign=C(x+w*.04,y+(old?.47:.56)*h,w*.92,signH);
  shape(ctx,sign,old?(active>.5?'#f8d563':'#faf0d9'):'#102b5b',3,old?'#f7eee0':'#a9dfff',active>.5?2:1);
  fit(ctx,labels[j],x+w*.5,sign.y+5,font,old?ink:ice,sign.w-11,{align:'center',weight:850});
}

function drawSignal(ctx, box, t) {
  const {x,y,w,h}=box, span=w/3;
  const start=timing.scenes[5].at;
  const lineY=y+h*.65;
  rule(ctx,x,lineY,x+w,lineY,'#a9cefa70',1.5);
  for (const [j,event] of serviceMarks.entries()) {
    const cx=x+span*(j+.5);
    const after=t-(event.badge-start);
    const lift=snap(after);
    const light=after<0?0:.58+.42*Math.exp(-after*2.2);
    ctx.save();
    ctx.translate(0,12*(1-phase(t,j*.095,.36)));
    storefront(ctx,j,C(x+j*span+4,y+h*.19,span-8,h*.46),light,false);
    ctx.restore();
    if(after>0){
      const d=Math.min(102,span*.59,h*.21);
      const cy=y+h*.105 + 3*Math.sin(after*3+j);
      rule(ctx,cx,cy,cx,y+h*.26,'#aee5ff95',1.4);
      ctx.save();
      ctx.translate(cx,cy);
      ctx.scale(lift,lift);
      const ring=progress(after,.43);
      if(ring<1)shape(ctx,C(-d*(.5+ring*.39),-d*(.5+ring*.39),d*(1+ring*.78),d*(1+ring*.78)),null,d,'rgba(186,231,255,'+(.84*(1-ring))+')',2.6);
      ctx.shadowColor='#65bcff';ctx.shadowBlur=14*Math.exp(-after*2);
      shape(ctx,C(-d/2,-d/2,d,d),'#f0f8ff',d/2,'#b2ddff',2);
      ctx.shadowBlur=0;
      mark(ctx,event.icon,-d*.24,-d*.24,d*.48,'#1a4e91',2.1);
      shape(ctx,C(d*.22,-d*.60,d*.52,d*.34),'#3b83eb',d*.13,'#d3edff',1);
      fit(ctx,'AI',d*.48,-d*.59,d*.26,ice,d*.41,{align:'center',weight:900});
      ctx.restore();
    }
    const arrive=t-(event.check-start);
    if(arrive>0){
      const enter=phase(arrive,0,.24), tick=phase(arrive,.06,.21);
      const rowH=h*.092, rowY=y+h*.696+j*h*.102;
      const glyph=Math.min(rowH*.68,32);
      ctx.save();
      ctx.globalAlpha*=enter;
      ctx.translate(22*(1-enter),7*(1-enter));
      const labelW=Math.min(w-19,w*(j===1?.86:.76));
      shape(ctx,C(x,rowY,labelW,rowH),'#142e64e8',rowH*.31,'#6ca7e86e',1);
      mark(ctx,event.icon,x+5,rowY+rowH*.16,glyph,sky,1.9);
      fit(ctx,event.text,x+glyph+13,rowY+rowH*.14,rowH*.63,ice,labelW-glyph-39,{weight:800});
      const kx=x+labelW-glyph-6, ky=rowY+rowH*.19;
      shape(ctx,C(kx,ky,glyph,glyph),'#0c3948',glyph/2);
      ctx.save();ctx.beginPath();ctx.rect(kx,ky,glyph*tick,glyph);ctx.clip();
      mark(ctx,'check',kx+glyph*.12,ky+glyph*.11,glyph*.75,mint,2.7);
      ctx.restore();ctx.restore();
    }
  }
}

function frontImac(ctx, box, t, error) {
  const {x,y,w,h}=box;
  const s=Math.min(w/545,h/470);
  ctx.save();
  ctx.translate(x+w/2,y+h*.49+4*s*Math.sin(t*2.3));
  ctx.scale(s,s);
  ctx.rotate(-.033+.023*Math.sin(t*1.7));
  ctx.shadowBlur=28;ctx.shadowColor='#2d443a75';ctx.shadowOffsetY=16;
  const shell=ctx.createLinearGradient(-180,-200,178,180);
  shell.addColorStop(0,'#aaf0ee');shell.addColorStop(.28,'#479fa6');
  shell.addColorStop(.81,'#116579');shell.addColorStop(1,'#0e425c');
  shape(ctx,C(-206,-203,412,379),shell,73,'#fafaf2',4);
  ctx.shadowBlur=0;ctx.shadowOffsetY=0;
  const fascia=ctx.createLinearGradient(0,-177,0,164);
  fascia.addColorStop(0,'#fbf9eb');fascia.addColorStop(.52,'#e0e7de');fascia.addColorStop(1,'#a7ceca');
  shape(ctx,C(-184,-177,368,341),fascia,54,'#f8fff4',3);
  shape(ctx,C(-148,-151,296,235),'#5d8484',30,'#f0f5eb',5);
  const crt=ctx.createLinearGradient(-130,-128,132,71);
  crt.addColorStop(0,'#091e26');crt.addColorStop(.63,'#1b4c56');crt.addColorStop(1,'#102932');
  shape(ctx,C(-136,-139,272,210),crt,22,'#264d57',2);
  ctx.save();shape(ctx,C(-134,-137,268,206),null,19);ctx.clip();
  for(let y=-132;y<69;y+=5)rule(ctx,-130,y,130,y,'#98ddd224');
  const sheen=ctx.createLinearGradient(-136,-130,135,76);
  sheen.addColorStop(0,'#d9fff057');sheen.addColorStop(.5,'#d9fff000');
  shape(ctx,C(-136,-139,272,210),sheen);
  if(error){
    for(let j=0;j<3;j++){
      const p=phase(t,.14*j,.24);
      ctx.save();ctx.globalAlpha*=p;
      const xx=-102+j*17, yy=-101+j*27+15*(1-p);
      shape(ctx,C(xx,yy,179,76),'#e3eadf',6,'#f6f9ed',2);
      shape(ctx,C(xx+2,yy+2,175,20),'#387a9c',4);
      type(ctx,'Network error',xx+8,yy+4,14,ice,{weight:700});
      shape(ctx,C(xx+9,yy+33,15,15),'#bd5145',8);
      type(ctx,'!',xx+14,yy+34,11,ice);
      type(ctx,'Try again?',xx+32,yy+33,16,ink);
      shape(ctx,C(xx+114,yy+50,54,19),'#c4ddde',5,'#5b8898');
      type(ctx,'OK',xx+131,yy+53,11,ink);
      ctx.restore();
    }
  }else{
    const p=phase(t,.15,.56);
    mark(ctx,'computer',-26,-61,52,'#b0e5db',1.25);
    type(ctx,'CONNECTING…'.slice(0,Math.ceil(11*p)),0,2,17,'#d5f3db',{align:'center',family:'Consolas'});
  }
  ctx.restore();
  shape(ctx,C(-73,105,146,10),'#416a72',5,'#ddf7e9',2);
  for(const side of [-1,1]){
    for(let i=0;i<10;i++){
      const angle=i*Math.PI*.2;
      const px=side*126+Math.cos(angle)*20, py=119+Math.sin(angle)*19;
      shape(ctx,C(px,py,4,4),'#669496',2);
    }
  }
  shape(ctx,C(74,124,8,8),'#92efd4',4,'#567b77',1);
  if(error){
    ctx.save();ctx.translate(114,30);ctx.rotate(.13);
    shape(ctx,C(0,0,99,73),'#f4d360',1);
    type(ctx,'HELP??',8,17,24,ink,{family:'Georgia',italic:true});ctx.restore();
  }
  shape(ctx,C(-176,188,291,45),'#c4dace',9,'#faf5ec',3);
  for(let y=0;y<3;y++)for(let i=0;i<13;i++)shape(ctx,C(-163+i*20,195+y*10,16,7),'#758e89',2);
  shape(ctx,C(132,184,48,49),'#3f9ea3',23,'#c6e9da',3);
  rule(ctx,155,189,155,208,'#e5f2dc',2);
  ctx.restore();
}


function graphic(ctx, scene, box, t, tall) {
  const { x,y,w,h }=box;
  if (scene === 0) {
    frontImac(ctx,box,t,false);
    capsule(ctx,'12 MAR 2002',x+14,y+h-34,150,cream,teal,32);
  } else if (scene === 1) {
    [0,1,2].forEach(n=>{
      const focus=[.27,1.29,2.35][n], live=clamp(1-Math.abs(t-focus-.36)*1.35);
      const bw=w/3-6, bh=h*.75;
      ctx.save();
      ctx.translate(0,-14*live);
      storefront(ctx,n,C(x+(n+.5)*w/3-bw/2,y+h*.12,bw,bh),live,true);
      ctx.restore();
    });
  } else if (scene === 2) {
    frontImac(ctx, C(x+w*.08,y,w*.84,h*.93),Math.max(0,t-.25),t>.4);
    for (const [j, labelText] of ['COMPUTERS','EMAIL','NETWORK'].entries()){
      const p=phase(t,j*.39,.26), width=w/3-5;
      ctx.save();ctx.globalAlpha*=p;
      capsule(ctx,labelText,x+j*(w/3),y+h*.91+13*(1-p),width,ink,'#f6dc81',32);
      ctx.restore();
    }
  } else if (scene === 3) {
    shape(ctx,box,'#fff1d7',5,'#554532',1.7);
    shape(ctx,C(x+5,y+5,w-10,h-10),null,3,'#806b49',1);
    photo(ctx,2,C(x+w*.59,y+9,w*.41-9,h-18),progress(t,4),null,3);
    const tx=x+w*.047, tw=w*.50;
    const head=Math.min(h*.174,tw*.23);
    label(ctx,'CLASSIFIEDS',tx,y+h*.078,tw,coral);
    mark(ctx,'computer',tx+tw*.82,y+h*.093,Math.min(30,tw*.16),ink,1.8);
    for(const [i,name] of ['COMPUTER','HELP'].entries()){
      const ty=y+h*(.196+i*.168), sweep=phase(t,.24+i*.26,.55);
      if(sweep>0)shape(ctx,C(tx-2,ty+head*.43,tw*(i?.47:.92)*sweep,head*.53),'#f6d45e',2);
      fit(ctx,name,tx,ty,head,ink,tw,{family:'Impact, "Arial Black"',weight:900});
    }
    const serif={family:'Georgia',weight:700};
    fit(ctx,'Networks · Email · Repairs',tx,y+h*.555,Math.min(h*.091,tw*.09),ink,tw,serif);
    fit(ctx,'Home & small business. Fast.',tx,y+h*.678,Math.min(h*.084,tw*.085),ink,tw,serif);
    const contactY=y+h*.804;
    fit(ctx,'Call Dave · 555-0142',tx,contactY,Math.min(h*.10,tw*.098),ink,tw,{family:'Consolas',weight:800});
    const draw=phase(t,1.45,.69), midX=tx+tw*.48, midY=contactY+h*.051;
    if(draw>0){
      ctx.beginPath();
      for(let i=0;i<=Math.ceil(draw*62);i++){
        const angle=i/62*Math.PI*2+.34;
        const wav=1+.027*Math.sin(angle*9)+.035*Math.cos(angle*13);
        const xx=midX+Math.cos(angle)*tw*.535*wav;
        const yy=midY+Math.sin(angle)*h*.087*wav;
        if(i===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);
      }
      ctx.lineWidth=Math.max(2,h*.008);ctx.strokeStyle='#bb4b38';ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();
    }
  } else if (scene === 4) {
    simplePhones(ctx,box,'AI RECEPTIONIST',t);
  } else if (scene === 5) {
    drawSignal(ctx,box,t);
  } else if (scene === 6) {
    const s=phase(t,.03,.47);
    const cardH=h*.72;
    ctx.save();ctx.translate(0,14*(1-s));
    ctx.shadowColor='#09142b8c';ctx.shadowBlur=18;ctx.shadowOffsetY=7;
    ctx.beginPath();ctx.moveTo(x+1,y+5);ctx.lineTo(x+w*.29,y+2);ctx.lineTo(x+w*.72,y+6);ctx.lineTo(x+w-2,y);
    ctx.lineTo(x+w-5,y+cardH-5);ctx.lineTo(x+w*.78,y+cardH);ctx.lineTo(x+w*.4,y+cardH-3);ctx.lineTo(x,y+cardH+2);ctx.closePath();
    const stock=ctx.createLinearGradient(x,y,x+w,y+cardH);
    stock.addColorStop(0,'#fff6e0');stock.addColorStop(1,'#ece0c5');
    ctx.fillStyle=stock;ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;
    const tx=x+w*.042, tw=w*.916;
    fit(ctx,'U.S. CENSUS BUREAU · BUSINESS SURVEY',tx,y+cardH*.087,Math.min(23,cardH*.095),ink,tw,{weight:850});
    rule(ctx,tx,y+cardH*.216,tx+tw,y+cardH*.216,'#726b5980',1);
    const font=Math.min(w*.093,cardH*.213);
    const headY=y+cardH*.272;
    const serif={family:'Georgia',weight:900};
    ctx.font='900 '+font+'px Georgia';
    const inkWidth=Math.min(tw,ctx.measureText('Fewer than 1 in 5').width);
    const stripe=phase(t,2.18,.53);
    if(stripe>0)shape(ctx,C(tx-1,headY+font*.32,(inkWidth+3)*stripe,font*.68),'#a1c6ee',2);
    fit(ctx,'Fewer than 1 in 5',tx,headY,font,'#192421',tw,serif);
    fit(ctx,'small businesses use AI.',tx,y+cardH*.495,font,'#192421',tw,serif);
    fit(ctx,'U.S. firms with 4 or fewer employees',tx,y+cardH*.777,Math.min(24,cardH*.122),ink,tw,{weight:800});
    ctx.restore();
    const d=Math.min(w*.143,h*.166);
    for(let j=0;j<5;j++){
      const after=t-(2.28+j*.19);
      if(after<=0)continue;
      const pop=snap(after), cx=x+w*(j+.5)/5, cy=y+h*.855;
      ctx.save();ctx.translate(cx,cy+8*(1-pop));ctx.scale(pop,pop);
      shape(ctx,C(-d/2,-d/2,d,d),'#1b376c',d*.25,'#90c5fa',1.2);
      mark(ctx,'shop',-d*.27,-d*.28,d*.54,ice,1.7);
      ctx.restore();
    }
    fit(ctx,'Source: U.S. Census Bureau BTOS, Dec 2025–May 2026',x+w*.5,y+h*.956,Math.min(h*.068,22),ice,w*.98,{align:'center',weight:680});
  } else if (scene === 7) {
    const rowH=h*.29, glyph=Math.min(53,rowH*.65);
    for(const [i,event] of serviceMarks.entries()){
      const after=t-(.15+i*.76);
      if(after<=0)continue;
      const enter=snap(after), rowY=y+h*.062+i*rowH;
      const tx=x+w*.19, textSize=Math.min(53,rowH*.56);
      const tick=phase(after,.36,.26);
      ctx.save();ctx.globalAlpha*=phase(after,0,.19);
      ctx.translate(0,-38*(1-enter));
      shape(ctx,C(x+5,rowY-4,glyph+9,glyph+9),'#dff2ff',glyph/2+5);
      mark(ctx,event.icon,x+9+glyph*.16,rowY+glyph*.14,glyph*.56,'#275587',2);
      fit(ctx,event.text,tx,rowY-2,textSize,ice,w*.65,{weight:850});
      rule(ctx,tx,rowY+textSize*1.2,tx+w*.64,rowY+textSize*1.2,'#91c8fb50',1);
      if(tick>0){
        const kx=x+w*.865, ky=rowY+2;
        const startX=kx+glyph*.10, startY=ky+glyph*.52, jointX=kx+glyph*.34, jointY=ky+glyph*.76;
        ctx.beginPath();ctx.moveTo(startX,startY);
        if(tick<.4)ctx.lineTo(mix(startX,jointX,tick/.4),mix(startY,jointY,tick/.4));
        else {
          ctx.lineTo(jointX,jointY);
          ctx.lineTo(mix(jointX,kx+glyph*.91,(tick-.4)/.6),mix(jointY,ky+glyph*.18,(tick-.4)/.6));
        }
        ctx.strokeStyle=mint;ctx.lineWidth=Math.max(2,glyph*.094);ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();
      }
      ctx.restore();
    }
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
    const paperH=h*(w>500?.84:1), tx=x+w*.049, tw=w*.902;
    const paper=C(x,y,w,paperH);
    shape(ctx,paper,'#f7ead1',5,'#526e91',2);
    shape(ctx,C(x+6,y+6,w-12,paperH-12),null,2,'#7b8ea2',1);
    const m=phase(t,1.16,.66);
    const titleY=y+paperH*mix(.235,.208,m);
    const titleSize=Math.min(w*.107,paperH*.18);
    const typeface={family:'Impact, "Arial Black"',weight:900};
    const oldSize=mix(titleSize, titleSize*.36,m);
    const oldColor=m>.4?'#63706e':ink;
    fit(ctx,'COMPUTER HELP',tx,titleY,oldSize,oldColor,tw,typeface);
    const oldStrike=phase(t,.69,.43);
    if(oldStrike>0){
      ctx.font='900 '+oldSize+'px Impact';
      const strikeW=Math.min(tw,ctx.measureText('COMPUTER HELP').width);
      rule(ctx,tx-1,titleY+oldSize*.53,tx+strikeW*oldStrike,titleY+oldSize*.48,coral,Math.max(2,oldSize*.061));
    }
    const year=t<1.23?'2002':'2026', chipW=Math.min(119,w*.25), chipH=Math.min(38,paperH*.108);
    label(ctx,'CLASSIFIEDS',tx,y+paperH*.089,tw*.63,teal);
    capsule(ctx,year,x+w*.951-chipW,y+paperH*.062,chipW,t<1.23?ink:ice,t<1.23?'#e4ceb0':'#2868b9',chipH);
    rule(ctx,tx,y+paperH*.172,tx+tw,y+paperH*.172,'#877e686e',1);

    const clear=phase(t,1.34,.27), replace=phase(t,1.61,.36);
    const bodyFont=Math.min(w*.052,paperH*.086);
    if(clear<1){
      ctx.save();ctx.globalAlpha*=1-clear;
      const rows=['Networks · Email · Repairs','Call Dave · 555-0142'];
      for(const [i,line] of rows.entries()){
        const ry=y+paperH*(.556+i*.19), appear=phase(t,.91+i*.20,.41);
        const opts={family:i===0?'Georgia':'Consolas',weight:760};
        fit(ctx,line,tx,ry,bodyFont,ink,tw,opts);
        if(appear>0){
          ctx.font='760 '+bodyFont+'px '+opts.family;
          const lineW=Math.min(tw,ctx.measureText(line).width);
          rule(ctx,tx,ry+bodyFont*.49,tx+lineW*appear,ry+bodyFont*.45,coral,Math.max(2,bodyFont*.14));
        }
      }
      ctx.restore();
    }
    if(replace>0){
      ctx.save();ctx.globalAlpha*=replace;ctx.translate(0,9*(1-replace));
      const aiSize=Math.min(w*.17,paperH*.255);
      fit(ctx,'AI HELP',tx,y+paperH*.314,aiSize,'#205aa5',tw,typeface);
      fit(ctx,'AI receptionist · Booking · Follow-up',tx,y+paperH*.606,bodyFont,ink,tw,{weight:830});
      const rowY=y+paperH*.766;
      rule(ctx,tx,rowY,tx+tw,rowY,'#877e687e',1);
      const iconD=Math.min(29,paperH*.098);
      mark(ctx,'phone',tx,rowY+paperH*.065,iconD,'#205aa5',2.1);
      fit(ctx,'Mercury AI demo · (949) 775-0451',tx+iconD+10,rowY+paperH*.058,bodyFont,ink,tw-iconD-10,{weight:820});
      ctx.restore();
    }
  }
}
function closingLayout(H,wide) {
  const top=H*(wide?.15:.262);
  const logoW=wide?330:510;
  const logoH=logoW*logo.height/logo.width;
  const buttonY=top+logoH+(wide?100:168), buttonH=wide?59:73;
  const noteY=buttonY+buttonH+(wide?30:35);
  return {top,logoW,logoH,buttonY,buttonH,noteY,captionY:noteY+(wide?64:92)};
}
function closing(ctx, H, wide, t) {
  const center = 480;
  const {top,logoW,logoH,buttonY:y,buttonH:bh,noteY}=closingLayout(H,wide);
  ctx.drawImage(logo,center-logoW/2,top,logoW,logoH);
  fit(ctx,'Book a call to learn more',center,top+logoH+(wide?31:61),wide?46:60,ice,790,{align:'center',weight:820});
  const x=center-(wide?195:242), w=wide?390:484;
  const beat=Math.max(0,Math.sin(Math.PI*progress(t-.28,1.25)));
  const echo=progress(t-.25,1.1);
  if(echo>0&&echo<1) {
    const spread=ease(echo)*20;
    shape(ctx,C(x-spread,y-spread,w+2*spread,bh+2*spread),null,bh/2+spread,'rgba(155,220,255,'+(.75*(1-echo))+')',2);
  }
  ctx.save();
  ctx.translate(center,y+bh/2);ctx.scale(1+beat*.058,1+beat*.058);
  ctx.shadowBlur=9+beat*25;ctx.shadowColor='#98d4ff';
  shape(ctx,C(-w/2,-bh/2,w,bh),'#9ad9ff',bh/2,'#d3edff',1.5);
  ctx.shadowBlur=0;
  fit(ctx,'Book a strategy call',0,-15,29,navy,w-28,{align:'center',weight:850});ctx.restore();
  const note = "We'll walk you through exactly how it builds.";
  fit(ctx,note,center,noteY,wide?22:27,muted,746,{align:'center',weight:600});
  fit(ctx,'No pressure, just clarity.',center,noteY+(wide?29:36),wide?20:24,muted,746,{align:'center',weight:540});
}
function caption(ctx, H, wide, cue, t, index, past, scene) {
  if (!cue) return;
  const elapsed=t-cue.start, remaining=cue.end-t;
  const entry=progress(elapsed,.21), leave=progress(remaining,.17);
  const settle=ease(entry), exit=ease(leave);
  const lane=[0,2,1,3,0,1,2,3][index%8];
  const inUpper = scene!==11 && (lane===0 || lane===2);
  const align = scene===11 ? 'center' : lane===0 || lane===1 ? 'left' : lane===2 ? 'right' : 'center';
  const xPlain = align==='left' ? 79 : align==='right' ? 881 : 480;
  const yPlain = scene===11 ? closingLayout(H,wide).captionY :
    wide ? H*[.102,.679,.751,.852][lane] :
    H*(inUpper ? [.302,.302,.304,.302][lane] : [.81,.81,.818,.848][lane]);
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
  const size=wide?55:tall?88:76;
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
  if(index===4 && local<.34){
    const slide=ease(progress(local,.34)), xx=960*slide;
    const wake=ctx.createLinearGradient(xx-150,0,xx+72,0);
    wake.addColorStop(0,'#6caeff00');wake.addColorStop(.73,'rgba(156,209,255,'+(.31*(1-slide))+')');wake.addColorStop(1,'#bce6ff00');
    shape(ctx,C(xx-150,0,222,H),wake);
  }
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
async function makeCues() {
  const rate=48000,samples=Math.round(rate*timing.duration);
  const wave=Buffer.alloc(44+samples*2);
  wave.write('RIFF',0);wave.writeUInt32LE(wave.length-8,4);wave.write('WAVEfmt ',8);
  wave.writeUInt32LE(16,16);wave.writeUInt16LE(1,20);wave.writeUInt16LE(1,22);
  wave.writeUInt32LE(rate,24);wave.writeUInt32LE(rate*2,28);wave.writeUInt16LE(2,32);wave.writeUInt16LE(16,34);
  wave.write('data',36);wave.writeUInt32LE(samples*2,40);
  const notes=serviceMarks.flatMap(m=>[[m.badge,m.hz,.16,.165],[m.check,m.hz*1.34,.12,.15]]);
  notes.push([15.36,164,.16,.28],[46.44,554,.11,.3]);
  for(const [at,freq,level,duration] of notes){
    for(let i=0;i<Math.floor(rate*duration);i++){
      const sec=i/rate, k=44+2*(Math.round(at*rate)+i);
      const amp=Math.min(1,i/(rate*.009))*Math.exp(-sec*19)*(1-sec/duration);
      const tone=Math.sin(sec*freq*2*Math.PI)+.24*Math.sin(sec*freq*4*Math.PI);
      wave.writeInt16LE(Math.round(clamp(wave.readInt16LE(k)/32767+tone*amp*level,-.99,.99)*32767),k);
    }
  }
  const temp=join(work,'motion-cues-'+process.pid+'.wav');
  await writeFile(temp,wave);
  return temp;
}

async function encode(format) {
  const canvas=createCanvas(format.w,format.h);
  const file=join(media,'mercury-crm-'+format.name+'.mp4');
  const voice=join(work,'narration-v2.mp3'), score=join(work,'score.mp3');
  const mixAudio='[1:a]highpass=f=65,apad[voice];[2:a]volume=0.10,afade=t=in:d=0.24,afade=t=out:st=46:d=3[bed];[voice][bed][3:a]amix=inputs=3:duration=first:normalize=0,alimiter=limit=0.9[out]';
  const child=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','rawvideo','-pixel_format','rgba','-video_size',format.w+'x'+format.h,'-framerate',String(fps),'-i','pipe:0','-i',voice,'-i',score,'-i',soundtrack,'-filter_complex',mixAudio,'-map','0:v','-map','[out]','-vf','scale='+format.target+':flags=lanczos,format=yuv420p','-threads','5','-c:v','libx264','-preset','veryfast','-crf','20','-c:a','aac','-b:a','160k','-movflags','+faststart','-t',String(timing.duration),file],{stdio:['pipe','ignore','inherit']});
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
const selected = formats.filter(format => requested.length === 0 || requested.includes(format.name));
const soundtrack = selected.length ? await makeCues() : null;
for (const format of selected) await encode(format);
