import assert from 'node:assert';
import test from 'node:test';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const assess = require('../freshness.js');

const AM = '2026-11-23T06:59:00-05:00'; // Monday
const PM = '2026-11-23T18:58:00-05:00';

test('weekday afternoon keeps the morning publish and drops pre-market OK', () => {
  const r = assess(Date.parse('2026-11-23T14:26:00-05:00'), AM);
  assert.equal(r.missed, false);
  assert.ok(r.demote.includes('Portfolio dashboard refresh'));
  assert.ok(r.demote.includes('Agentic executor'));
  assert.ok(r.demote.includes('Apex targets copy · Mondays'));
  assert.ok(r.demote.includes('Morning brief'));
});

test('a 6:55 PM ledger is enough for the 9:10 PM publish', () => {
  const r = assess(Date.parse('2026-11-23T21:30:00-05:00'), PM);
  assert.equal(r.missed, false);
  assert.deepEqual(r.demote, []);
});

test('9:10 PM with only the morning ledger is a missed publish', () => {
  const r = assess(Date.parse('2026-11-23T21:30:00-05:00'), AM);
  assert.equal(r.missed, true);
  assert.equal(r.missedLabel, '9:10 PM');
});

test('7:00 AM does not demote tasks that have not fired', () => {
  const r = assess(Date.parse('2026-11-23T07:00:00-05:00'), AM);
  assert.equal(r.missed, false);
  assert.deepEqual(r.demote, []);
});

test('7:20 AM demotes the scan only', () => {
  const r = assess(Date.parse('2026-11-23T07:20:00-05:00'), AM);
  assert.equal(r.missed, false);
  assert.deepEqual(r.demote, ['Apex morning scan']);
});

test('Saturday does not apply the market rule', () => {
  const r = assess(Date.parse('2026-11-21T15:00:00-05:00'), '2026-11-21T06:59:00-05:00');
  assert.equal(r.missed, false);
  assert.deepEqual(r.demote, []);
});

test('Tuesday before 7:10 accepts Monday 6:55 PM and not Monday morning', () => {
  assert.equal(assess(Date.parse('2026-11-24T06:00:00-05:00'), '2026-11-23T18:55:00-05:00').missed, false);
  assert.equal(assess(Date.parse('2026-11-24T06:00:00-05:00'), AM).missed, true);
});

test('Tuesday does not demote the Monday-only copy', () => {
  const r = assess(Date.parse('2026-11-24T09:00:00-05:00'), '2026-11-24T06:59:00-05:00');
  assert.equal(r.demote.includes('Apex targets copy · Mondays'), false);
  assert.equal(r.demote.includes('Portfolio dashboard refresh'), true);
});

test('a snapshot after the first fire is still proof of that fire', () => {
  const r = assess(Date.parse('2026-11-23T14:26:00-05:00'), '2026-11-23T11:05:00-05:00');
  assert.equal(r.demote.includes('Portfolio dashboard refresh'), false);
  assert.equal(r.demote.includes('Agentic executor'), false);
});
