#!/usr/bin/env node
// Turns the text of the Claudex doc "Operations HQ — Claude task ledger" into ledger.js,
// the public-safe status file the site reads. Deterministic: no judgment calls here.
// Usage: node tools/build-ledger.mjs <ledger-text-file> [out=ledger.js]
// PUBLIC OUTPUT. Only task name, cadence, last-fired date/time, a status word and
// blocker text survive, and each is scrubbed of account digits, ids and dollar amounts.
import fs from 'node:fs';
const [, , src, out = 'ledger.js'] = process.argv;
if (!src) { console.error('usage: build-ledger.mjs <ledger-text-file> [out]'); process.exit(2); }
const text = fs.readFileSync(src, 'utf8');

const clean = s => String(s || '').replace(/\\+/g, '').replace(/\*+/g, '').replace(/\s+/g, ' ').trim();
const scrub = s => clean(s)
  .replace(/\(?[•·*]{2,}\s?\d{2,}\)?/g, '')        // (••3900)
  .replace(/\s[·•]\s\d{3,}\b/g, '')                 // · 0741
  .replace(/\$\s?[\d,.]+[kKmM]?/g, '')              // dollar amounts
  .replace(/\bPR\s*#?\d+\b/gi, '').replace(/#\d+/g, '') // PR / issue ids
  .replace(/\b(?!20\d\d\b)\d{4,}\b/g, '')           // any other long number
  .replace(/https?:\/\/\S+/g, '')
  .replace(/\s+([,.;:])/g, '$1').replace(/\s{2,}/g, ' ').trim();
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;

// ---- tables
// Drive exports the doc's tables either as markdown ("| A | B |") or as plain "A | B" lines; accept both.
const rows = text.split(/\r?\n/).filter(l => /^\s*\|/.test(l) || /\S \| \S/.test(l) || /\S \|\s*$/.test(l)).map(l => l.trim().replace(/^\||\|$/g, '').split('|').map(clean));
const isRule = r => r.every(c => /^:?-*:?$/.test(c));
let tasksHdr = null, blkHdr = null; const taskRows = [], blkRows = [];
let mode = null;
for (const r of rows) {
  if (isRule(r) || r.every(c => !c)) continue;
  const low = r.map(c => c.toLowerCase());
  if (low.includes('task') && low.some(c => c.startsWith('cadence'))) { tasksHdr = low; mode = 'tasks'; continue; }
  if (low[0] === 'blocker' && low.some(c => c.startsWith('waiting'))) { blkHdr = low; mode = 'blk'; continue; }
  if (low[0] === 'assignment') { mode = null; continue; }
  if (mode === 'tasks' && r.length === tasksHdr.length) taskRows.push(r);
  else if (mode === 'blk' && r.length === blkHdr.length) blkRows.push(r);
}
if (!tasksHdr || taskRows.length < 8) { console.error(`REFUSED: found ${taskRows.length} task rows (need 8+). Ledger text incomplete or format changed.`); process.exit(1); }
const col = (hdr, name) => hdr.findIndex(c => c.startsWith(name));
const iN = col(tasksHdr, 'task'), iC = col(tasksHdr, 'cadence'), iE = col(tasksHdr, 'enabled'), iL = col(tasksHdr, 'last fired'), iS = col(tasksHdr, 'recorded status'), iB = col(tasksHdr, 'blocker'), iV = col(tasksHdr, 'verified');

const AREAS = [
  ['cards', 'Card Vault', 'card', /card vault|ebay|buy radar/i],
  ['sports', 'Sports Hub', 'basket', /sports[ -]hub/i],
  ['golf', 'Caddie HQ', 'golf', /links improver|caddie|golf/i],
  ['investing', 'Investing', 'chart', /apex|agentic|portfolio|market update/i],
  ['delivery', 'Your updates', 'activity', /relay|brief|heartbeat/i],
  ['apps', 'App health', 'shield', /.*/]
];
const ORDER = ['investing', 'sports', 'cards', 'golf', 'apps', 'delivery'];
const areas = Object.fromEntries(AREAS.map(([id, name, icon]) => [id, { id, name, icon, tasks: [] }]));
const paused = [];
const niceName = raw => {
  let n = scrub(raw).replace(/^Claude OS\s*[·•-]\s*/i, '').replace(/\s*\([^)]*\)/g, '').replace(/\s+[·•]\s*$/, '').trim();
  return n;
};
for (const r of taskRows) {
  const raw = r[iN]; if (!raw) continue;
  let n = niceName(raw); if (!n) continue;
  const [id, aname] = AREAS.find(a => a[3].test(raw));
  if (n.toLowerCase().startsWith(aname.toLowerCase() + ' ')) n = cap(n.slice(aname.length + 1));
  const en = (r[iE] || 'yes').toLowerCase();
  if (/^(no|paused|off)/.test(en)) { paused.push(n); continue; }
  const lastRaw = scrub(r[iL]), stRaw = (r[iS] || '').toUpperCase(), blk = iB >= 0 ? scrub(r[iB]) : '';
  if (/^one-(shot|off)/i.test(clean(r[iC])) || /^one-(shot|off)/i.test(raw)) continue; // not a recurring task
  // Three separate facts, never merged: l = last fired, s = recorded execution result, v = output verified.
  // s: ok only when the ledger records SUCCEEDED for a run it read. A row the refresh did not re-read
  // ("carried") is Unknown (norec), except that a carried FAILED stays fail until a success is recorded.
  const carried = /CARRIED|NOT RE-?READ/.test(stRaw);
  const failed = /FAIL|ERROR|TIMED|CANCEL/.test(stRaw);
  const notFired = !lastRaw || /^(—|-|not yet|never)$/i.test(lastRaw);
  let l, s;
  if (failed) s = 'fail';
  else if (/first run/i.test(blk) && (notFired || carried)) s = 'new';
  else if (carried) s = 'norec';
  else if (notFired) s = 'new';
  else s = /SUCCE/.test(stRaw) ? 'ok' : 'norec';
  if (s === 'new') { const m = blk.match(/first run ([A-Z][a-z]{2} \d{1,2})/i); l = m ? 'First run ' + m[1] : 'Not yet'; }
  else l = (notFired || /^carried/i.test(lastRaw)) ? 'Unknown' : lastRaw.replace(/\s*\([^)]*\)?/g, '').trim().slice(0, 24);
  const vRaw = iV >= 0 ? clean(r[iV]) : '';
  const v = vRaw && !/^(—|-|none)$/i.test(vRaw) ? 'yes' : 'no';
  const rm = failed && clean(r[iS]).match(/(?:FAILED|ERROR)[,:]?\s*([a-z][a-z ]{3,38})/);
  const row = { n: n.slice(0, 48), c: cap(scrub(r[iC])).slice(0, 48), l, s, v };
  if (rm) row.r = scrub(rm[1]).slice(0, 40);
  areas[id].tasks.push(row);
}
const pm = text.match(/Paused:?\**\s*(.+)/i);
if (pm) for (const p of clean(pm[1]).replace(/\.$/, '').split(/,\s*/)) { const n = niceName(p); if (n && !paused.includes(n)) paused.push(n.slice(0, 48)); }

const blockers = [];
if (blkHdr) {
  const iW = col(blkHdr, 'waiting');
  for (const r of blkRows) {
    const t = scrub(r[0]); if (!t || /^(none|—|-)$/i.test(t)) continue;
    const w = clean(r[iW] || ''); const wl = w.toLowerCase();
    const who = wl.startsWith('jack') ? 'jack' : wl.startsWith('claude') ? 'claude' : wl.startsWith('chatgpt') ? 'chatgpt' : 'third';
    const hint = (w.match(/\(([^)]{1,40})\)/) || [])[1];
    blockers.push({ who, text: t.slice(0, 170), hint: hint ? scrub(hint).slice(0, 40) : '' });
  }
}
const am = text.match(/Ledger as of:?\**\s*(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})\s*([AP]M)?/i);
if (!am) { console.error('REFUSED: no "Ledger as of: YYYY-MM-DD HH:MM" line found.'); process.exit(1); }
const [, Y, M, Dd, h0, mi, ap] = am;
const h = String(ap ? (+h0 % 12) + (/p/i.test(ap) ? 12 : 0) : +h0);
// US Eastern offset for that date (EST -05:00 / EDT -04:00), computed, not assumed
const probe = new Date(Date.UTC(+Y, +M - 1, +Dd, 17));
const offH = 17 - Number(new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', hour12: false }).format(probe));
const asOfISO = `${Y}-${M}-${Dd}T${h.padStart(2, '0')}:${mi}:00-0${offH}:00`;

const ledger = { asOfISO, areas: ORDER.map(id => areas[id]).filter(a => a.tasks.length), paused, blockers };
const total = ledger.areas.reduce((n, a) => n + a.tasks.length, 0);
const js = `/* AUTO-GENERATED by tools/build-ledger.mjs from the Claudex doc "Operations HQ — Claude task ledger".
   Do not edit by hand. PUBLIC FILE: names, cadence, last-fired, result word, verified yes/no, scrubbed blocker text only. */
window.HQ_LEDGER = ${JSON.stringify(ledger, null, 1)};
`;
fs.writeFileSync(out, js);
const cnt = {}; ledger.areas.forEach(a => a.tasks.forEach(t => cnt[t.s] = (cnt[t.s] || 0) + 1));
console.log(`ledger.js written: as of ${asOfISO}, ${total} tasks ${JSON.stringify(cnt)}, ${paused.length} paused, ${blockers.length} blockers`);
