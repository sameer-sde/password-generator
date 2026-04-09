const WORDS = ["apple","brave","cloud","dance","eagle","flame","grace","heart","ivory","jewel","knife","lemon","magic","night","ocean","pearl","quest","river","storm","tiger","ultra","vapor","whale","xenon","youth","zebra","amber","blaze","crisp","delta","ember","frost","globe","haven","joust","karma","lunar","maple","nexus","orbit","prism","razor","solar","tower","vinyl","witch","yield","zephyr","agile","drift","epoch","fable","grail","helix","jumbo","kitty","lance","novel","pivot","ridge","shelf","trick","unify","verge","weave","azure","brisk","crave","flint","grove","harsh","irony","kinship","lusty","mirth","noble","opaque","quill","scout","tutor","umbra","vivid","waltz","exile","forge","glyph","hover","pixel","query","realm"];
const LEET = { a:'4', e:'3', i:'1', o:'0', s:'5', t:'7' };
 
// ── State ──
let S = { up:true, lo:true, nu:true, sy:false, ex:false, na:false, pr:false, bl:false, ppc:false, ppn:false, pps:false, ppl:false };
let hist = [], vis = false, curPwd = '', curPin = '', curPhrase = '';
let pinLen = 4, pinType = 'num', sep = '-';
 
// ── Secure random int ──
function ri(n) {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] % n;
}
 
// ── Tab switching ──
function sw(t) {
  const keys = ['gen','pin','ph','an'];
  document.querySelectorAll('.tab').forEach((el, i) => el.classList.toggle('active', keys[i] === t));
  keys.forEach(k => document.getElementById('p-' + k).classList.toggle('active', k === t));
}
 
// ── Chip toggle ──
function ct(el, k) {
  el.classList.toggle('on');
  S[k] = el.classList.contains('on');
}
 
// ── Slider handlers ──
function onL(el) {
  const pct = ((+el.value - +el.min) / (+el.max - +el.min) * 100) + '%';
  el.style.setProperty('--pct', pct);
  document.getElementById('lv').textContent = el.value;
}
 
function onW(el) {
  const pct = ((+el.value - +el.min) / (+el.max - +el.min) * 100) + '%';
  el.style.setProperty('--pct', pct);
  document.getElementById('wv').textContent = el.value;
}
 
// ── Build character pool ──
function getChars() {
  const U = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const L = 'abcdefghijklmnopqrstuvwxyz';
  const N = '0123456789';
  const SY = '!@#$%^&*()-_=+[]{}|;:,.<>?';
  const EX = '¥€£©®™°±×÷αβγδΩπ∞';
  let c = '';
  if (S.up) c += U;
  if (S.lo) c += L;
  if (S.nu) c += N;
  if (S.sy) c += SY;
  if (S.ex) c += EX;
  if (S.na) c = c.replace(/[0Ol1I]/g, '');
  return c;
}
 
// ── Generate password ──
function genPwd() {
  const len = +document.getElementById('ls').value;
  if (S.pr) { genPron(len); return; }
  const chars = getChars();
  if (!chars) { showToast('Select at least one set!', true); return; }
  let pwd = '';
  if (S.bl) {
    const lt = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    pwd += lt[ri(lt.length)];
    for (let i = 1; i < len; i++) pwd += chars[ri(chars.length)];
  } else {
    for (let i = 0; i < len; i++) pwd += chars[ri(chars.length)];
  }
  setPwd(pwd);
}
 
// ── Generate pronounceable password ──
function genPron(len) {
  const v = 'aeiou', co = 'bcdfghjklmnpqrstvwxyz';
  let pwd = '', uv = ri(2) === 0;
  for (let i = 0; i < len; i++) {
    let pool = uv ? v : co;
    if (S.up && ri(3) === 0) pool = pool.toUpperCase();
    pwd += pool[ri(pool.length)];
    uv = !uv;
  }
  if (S.nu && pwd.length > 2) {
    const p = ri(pwd.length - 1) + 1;
    pwd = pwd.slice(0, p) + '0123456789'[ri(10)] + pwd.slice(p + 1);
  }
  setPwd(pwd);
}
 
// ── Set and display password ──
function setPwd(pwd) {
  curPwd = pwd;
  const el = document.getElementById('pout');
  el.textContent = vis ? pwd : '•'.repeat(pwd.length);
  el.classList.toggle('masked', !vis);
  el.classList.add('popin');
  setTimeout(() => el.classList.remove('popin'), 400);
  updMeter(pwd);
  addHist(pwd);
}
 
// ── Calculate entropy bits ──
function calcBits(pwd) {
  let p = 0;
  if (/[a-z]/.test(pwd)) p += 26;
  if (/[A-Z]/.test(pwd)) p += 26;
  if (/[0-9]/.test(pwd)) p += 10;
  if (/[^a-zA-Z0-9]/.test(pwd)) p += 40;
  return Math.round(pwd.length * Math.log2(p || 1));
}
 
// ── Update strength meter ──
function updMeter(pwd) {
  const mf = document.getElementById('mf');
  const ml = document.getElementById('ml');
  const mb = document.getElementById('mb');
  const mc = document.getElementById('mc');
  if (!pwd) { mf.style.width = '0'; ml.textContent = '—'; ml.style.color = 'var(--mut)'; mb.textContent = ''; mc.innerHTML = ''; return; }
  const b = calcBits(pwd);
  mb.textContent = b + ' bits';
  let sc, col, txt;
  if      (b < 28)  { sc = 12;  col = '#f87171'; txt = 'very weak'; }
  else if (b < 40)  { sc = 28;  col = '#fb923c'; txt = 'weak'; }
  else if (b < 60)  { sc = 50;  col = '#fbbf24'; txt = 'fair'; }
  else if (b < 80)  { sc = 72;  col = '#4ade80'; txt = 'strong'; }
  else if (b < 100) { sc = 88;  col = '#22d3ee'; txt = 'very strong'; }
  else              { sc = 100; col = '#a78bfa'; txt = 'fortress 🏰'; }
  mf.style.width = sc + '%';
  mf.style.background = col;
  ml.textContent = txt;
  ml.style.color = col;
  const cs = [
    { l:'12+ chars',  ok: pwd.length >= 12 },
    { l:'uppercase',  ok: /[A-Z]/.test(pwd) },
    { l:'lowercase',  ok: /[a-z]/.test(pwd) },
    { l:'number',     ok: /[0-9]/.test(pwd) },
    { l:'symbol',     ok: /[^a-zA-Z0-9]/.test(pwd) },
    { l:'no triple',  ok: !/(.).*\1\1/.test(pwd) },
  ];
  mc.innerHTML = cs.map(x => `<span class="chk${x.ok ? ' ok' : ''}">${x.ok ? '✓' : '✗'} ${x.l}</span>`).join('');
}
 
// ── History ──
function addHist(pwd) {
  const b = calcBits(pwd);
  let str, col;
  if (b < 40) { str = 'weak'; col = '#fb923c'; }
  else if (b < 70) { str = 'fair'; col = '#fbbf24'; }
  else { str = 'strong'; col = '#4ade80'; }
  hist.unshift({ pwd, str, col, t: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) });
  if (hist.length > 8) hist.pop();
  renderHist();
}
 
function renderHist() {
  const el = document.getElementById('hl');
  if (!hist.length) { el.innerHTML = '<div class="empty">no passwords yet</div>'; return; }
  el.innerHTML = hist.map((h, i) =>
    `<div class="hi" onclick="cpHist(${i})">
      <span class="hipw">${'•'.repeat(Math.min(h.pwd.length, 10))}${h.pwd.slice(0, 4)}</span>
      <span class="histr" style="background:${h.col}18;color:${h.col};border:1px solid ${h.col}40">${h.str}</span>
      <span class="hitm">${h.t}</span>
    </div>`
  ).join('');
}
 
// ── Visibility toggle ──
function togVis() {
  vis = !vis;
  const el = document.getElementById('pout');
  if (curPwd) {
    el.textContent = vis ? curPwd : '•'.repeat(curPwd.length);
    el.classList.toggle('masked', !vis);
  }
  document.getElementById('eyeB').textContent = vis ? '🙈' : '👁';
}
 
// ── Copy password ──
function copyPwd() {
  if (!curPwd) { showToast('Generate first!', true); return; }
  navigator.clipboard.writeText(curPwd)
    .then(() => showToast('Copied!'))
    .catch(() => { lcp(curPwd); showToast('Copied!'); });
  const el = document.getElementById('pout');
  el.classList.add('copied');
  setTimeout(() => el.classList.remove('copied'), 1000);
}
 
function cpHist(i) {
  navigator.clipboard.writeText(hist[i].pwd).catch(() => lcp(hist[i].pwd));
  showToast('Copied from history!');
}
 
function clrAll() {
  hist = []; curPwd = '';
  document.getElementById('pout').textContent = 'click generate...';
  document.getElementById('pout').classList.add('masked');
  updMeter('');
  renderHist();
  showToast('Cleared!');
}
 
// ── Fallback copy ──
function lcp(t) {
  const ta = document.createElement('textarea');
  ta.value = t;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  ta.remove();
}
 
// ── Toast ──
function showToast(msg, err) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = err ? 'var(--r)' : 'var(--g)';
  t.style.color = err ? '#fff' : '#052e16';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1800);
}
 
// ── PIN Generator ──
function setPL(n, el) {
  pinLen = n;
  document.querySelectorAll('#p-pin .bsm').forEach((b, i) => { if (i < 4) b.classList.remove('on'); });
  el.classList.add('on');
  genPin();
}
 
function setPT(t, el) {
  pinType = t;
  ['pt0','pt1','pt2'].forEach(id => document.getElementById(id).classList.remove('on'));
  el.classList.add('on');
  genPin();
}
 
function genPin() {
  let ch = '0123456789';
  if (pinType === 'alp') ch = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
  if (pinType === 'mix') ch = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
  let pin = '';
  for (let i = 0; i < pinLen; i++) pin += ch[ri(ch.length)];
  curPin = pin;
  const el = document.getElementById('pg');
  el.innerHTML = pin.split('').map(d => `<div class="pdig">${d}</div>`).join('');
  el.querySelectorAll('.pdig').forEach((d, i) => {
    setTimeout(() => {
      d.classList.add('fl');
      setTimeout(() => d.classList.remove('fl'), 300);
    }, i * 70);
  });
}
 
function cpPin() {
  if (!curPin) return;
  navigator.clipboard.writeText(curPin).catch(() => lcp(curPin));
  showToast('PIN copied!');
}
 
// ── Passphrase Generator ──
function setSep(s, el) {
  sep = s;
  document.querySelectorAll('#p-ph .bsm').forEach((b, i) => { if (i < 5) b.classList.remove('on'); });
  el.classList.add('on');
}
 
function genPhrase() {
  const cnt = +document.getElementById('ws').value;
  let words = [];
  for (let i = 0; i < cnt; i++) words.push(WORDS[ri(WORDS.length)]);
  if (S.ppc) words = words.map(w => w[0].toUpperCase() + w.slice(1));
  if (S.ppl) words = words.map(w => [...w].map(c => LEET[c] || c).join(''));
  let phrase = words.join(sep);
  if (S.ppn) phrase += sep + '0123456789'[ri(10)] + ri(10);
  if (S.pps) phrase += '!@#$%'[ri(5)];
  curPhrase = phrase;
  const el = document.getElementById('phd');
  const sepDisplay = sep || '·';
  el.innerHTML = words.map(w => `<span class="pw">${w}</span>`).join(
    `<span style="color:var(--mut);font-family:var(--mono);font-size:0.75rem;margin:0 1px"> ${sepDisplay} </span>`
  );
  if (S.ppn || S.pps) {
    el.innerHTML += `<span style="color:var(--am);font-family:var(--mono);font-size:0.75rem"> +${S.ppn ? 'num' : ''}${S.pps ? 'sym' : ''}</span>`;
  }
}
 
function cpPhrase() {
  if (!curPhrase) { showToast('Generate first!', true); return; }
  navigator.clipboard.writeText(curPhrase).catch(() => lcp(curPhrase));
  showToast('Passphrase copied!');
}
 
function clrPhrase() {
  curPhrase = '';
  document.getElementById('phd').innerHTML = '<span style="color:var(--mut);font-family:var(--mono);font-size:0.8rem">click generate...</span>';
}
 
// ── Password Analyzer ──
function analyze(pwd) {
  if (!pwd) {
    ['s0','s1','s2','s3'].forEach(id => document.getElementById(id).textContent = '—');
    document.getElementById('ac').innerHTML = '';
    document.getElementById('af').style.width = '0';
    document.getElementById('atip').textContent = 'Enter a password above to get a full security breakdown.';
    return;
  }
  let pool = 0;
  if (/[a-z]/.test(pwd)) pool += 26;
  if (/[A-Z]/.test(pwd)) pool += 26;
  if (/[0-9]/.test(pwd)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pwd)) pool += 40;
  const bits = Math.round(pwd.length * Math.log2(pool || 1));
  document.getElementById('s0').textContent = pwd.length;
  document.getElementById('s1').textContent = bits;
  document.getElementById('s2').textContent = pool;
  const guesses = Math.pow(2, bits), speed = 1e10, secs = guesses / speed;
  let ct;
  if      (secs < 60)        ct = Math.round(secs) + 's';
  else if (secs < 3600)      ct = Math.round(secs / 60) + 'm';
  else if (secs < 86400)     ct = Math.round(secs / 3600) + 'h';
  else if (secs < 31536000)  ct = Math.round(secs / 86400) + 'd';
  else if (secs < 3.15e9)    ct = Math.round(secs / 31536000) + 'yr';
  else                        ct = 'centuries';
  document.getElementById('s3').textContent = ct;
  const cks = [
    { l:'12+ chars',    ok: pwd.length >= 12 },
    { l:'uppercase',    ok: /[A-Z]/.test(pwd) },
    { l:'lowercase',    ok: /[a-z]/.test(pwd) },
    { l:'digit',        ok: /[0-9]/.test(pwd) },
    { l:'symbol',       ok: /[^a-zA-Z0-9]/.test(pwd) },
    { l:'no triple',    ok: !/(.).*\1\1/.test(pwd) },
    { l:'80+ bits',     ok: bits >= 80 },
    { l:'no sequence',  ok: !/012|123|234|345|456|567|678|789|abc|bcd/i.test(pwd) },
  ];
  document.getElementById('ac').innerHTML = cks.map(x =>
    `<span class="chk${x.ok ? ' ok' : ''}">${x.ok ? '✓' : '✗'} ${x.l}</span>`
  ).join('');
  const score = cks.filter(c => c.ok).length;
  let sc2, col2;
  if      (score < 3) { sc2 = 20;  col2 = '#f87171'; }
  else if (score < 5) { sc2 = 45;  col2 = '#fbbf24'; }
  else if (score < 7) { sc2 = 72;  col2 = '#4ade80'; }
  else                { sc2 = 100; col2 = '#a78bfa'; }
  const af = document.getElementById('af');
  af.style.width = sc2 + '%';
  af.style.background = col2;
  let tip = '';
  if      (score < 4) tip = '<strong>Weak password.</strong> Add uppercase, numbers, and symbols, and increase length to 16+.';
  else if (score < 6) tip = '<strong>Getting there.</strong> More character variety and 16+ characters will make it much stronger.';
  else if (score < 8) tip = '<strong>Good password!</strong> Avoid common patterns and sequential digits to reach a perfect score.';
  else                tip = '<strong>Excellent!</strong> This password would take an attacker at 10 billion guesses/sec centuries to crack.';
  document.getElementById('atip').innerHTML = tip;
}
 
// ═══════════════════════════════════════
// ANIMATED PARTICLE BACKGROUND
// ═══════════════════════════════════════
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H, pts = [];
 
function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
 
function initPts() {
  pts = [];
  const n = Math.floor((W * H) / 12000);
  for (let i = 0; i < n; i++) {
    pts.push({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  Math.random() * 1.5 + 0.5,
      a:  Math.random() * Math.PI * 2,
      hue: Math.random() < 0.6 ? 270 : 190,
    });
  }
}
 
function drawBg() {
  ctx.clearRect(0, 0, W, H);
 
  // Deep space background
  ctx.fillStyle = '#05050f';
  ctx.fillRect(0, 0, W, H);
 
  // Purple glow top-left
  const g1 = ctx.createRadialGradient(W * 0.15, H * 0.1, 0, W * 0.15, H * 0.1, W * 0.55);
  g1.addColorStop(0, 'rgba(124,58,237,0.09)');
  g1.addColorStop(1, 'transparent');
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H);
 
  // Cyan glow bottom-right
  const g2 = ctx.createRadialGradient(W * 0.85, H * 0.85, 0, W * 0.85, H * 0.85, W * 0.5);
  g2.addColorStop(0, 'rgba(34,211,238,0.06)');
  g2.addColorStop(1, 'transparent');
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, W, H);
 
  // Pink glow center
  const g3 = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.3);
  g3.addColorStop(0, 'rgba(244,114,182,0.03)');
  g3.addColorStop(1, 'transparent');
  ctx.fillStyle = g3;
  ctx.fillRect(0, 0, W, H);
 
  // Move and draw particles
  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
    p.a += 0.006;
    const alpha = 0.25 + 0.35 * Math.sin(p.a);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${alpha})`;
    ctx.fill();
  });
 
  // Draw connection lines
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[j].x - pts[i].x;
      const dy = pts[j].y - pts[i].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `rgba(168,85,247,${0.09 * (1 - d / 110)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
 
  requestAnimationFrame(drawBg);
}
 
// ── Init ──
window.addEventListener('resize', () => { resize(); initPts(); });
resize();
initPts();
drawBg();
 
onL(document.getElementById('ls'));
onW(document.getElementById('ws'));
genPwd();
genPin();
 
