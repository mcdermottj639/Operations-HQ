#!/usr/bin/env node
// Public-safety and shape gate. The publish workflow runs this; a failure blocks publishing.
// Usage: node tools/validate.mjs   (from the repo root)
import fs from 'node:fs';
import vm from 'node:vm';
const fail = []; const ctx = { window: {} }; vm.createContext(ctx);
for (const f of ['data.js', 'ledger.js', 'checks.js']) {
  const src = fs.readFileSync(f, 'utf8');
  try { vm.runInContext(src, ctx, { filename: f }); } catch (e) { fail.push(`${f}: does not parse: ${e.message}`); continue; }
  // strip Google Doc ids (long id-like tokens) before scanning for numbers
  const body = src.replace(/[A-Za-z0-9_-]{25,}/g, ' ');
  const bad = [
    [/\$\s?\d/, 'dollar amount'], [/[•]{2,}/, 'masked account marker'], [/\b(?!20\d\d\b)\d{4,}\b/, 'long number (account, order or id)'],
    [/#\d+/, 'PR or issue id'], [/\b(password|passphrase|api[_ ]?key|secret|token=|bearer)\b/i, 'credential word'],
    [/\b(balance|net worth|buying power|equity of|margin debt)\b/i, 'financial detail'], [/@[a-z0-9-]+\.[a-z]{2,}/i, 'email address']
  ];
  src.split('\n').forEach((line, i) => { const b = line.replace(/[A-Za-z0-9_-]{25,}/g, ' '); for (const [re, why] of bad) if (re.test(b)) fail.push(`${f}:${i + 1}: ${why}: ${b.trim().slice(0, 90)}`); });
}
const D = ctx.window.HQ_DATA, L = ctx.window.HQ_LEDGER;
if (!D || !Array.isArray(D.projects) || !D.projects.length) fail.push('data.js: HQ_DATA.projects missing');
if (!L) fail.push('ledger.js: HQ_LEDGER missing');
else {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:00-0[45]:00$/.test(L.asOfISO || '') || isNaN(Date.parse(L.asOfISO))) fail.push('ledger.js: bad asOfISO');
  let n = 0; for (const a of L.areas || []) for (const t of a.tasks || []) { n++; if (!t.n || !t.c || !t.l || !['ok', 'norec', 'new', 'fail'].includes(t.s)) fail.push(`ledger.js: bad task row ${JSON.stringify(t)}`); if (t.v !== undefined && !['yes', 'no'].includes(t.v)) fail.push(`ledger.js: bad verified flag ${JSON.stringify(t)}`); }
  if (n < 8) fail.push(`ledger.js: only ${n} tasks (need 8+)`);
  for (const b of L.blockers || []) if (!['jack', 'claude', 'chatgpt', 'third'].includes(b.who) || !b.text) fail.push(`ledger.js: bad blocker ${JSON.stringify(b)}`);
}
const K = ctx.window.HQ_CHECKS;
if (!K || typeof K.items !== 'object') fail.push('checks.js: HQ_CHECKS missing');
else for (const [k, v] of Object.entries(K.items)) if (!['resolved', 'open'].includes(v.state)) fail.push(`checks.js: bad state for ${k}`);
for (const n of (D && D.needs) || []) if (n.who === 'jack' && !n.key) fail.push(`data.js: item "${n.title}" waiting on Jack has no key`);
if (fail.length) { console.error('VALIDATION FAILED\n' + fail.join('\n')); process.exit(1); }
console.log('validate: OK');
