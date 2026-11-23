/* When a ledger snapshot stops being proof. No prompts, balances, or account data. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.HQFreshness = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  // Publish time, and the sync time that publish is allowed to be showing.
  const PUBLISH = [
    { at: 7 * 60 + 10, need: 6 * 60 + 55, label: '7:10 AM' },
    { at: 21 * 60 + 10, need: 18 * 60 + 55, label: '9:10 PM' }
  ];
  // Weekday tasks. An OK from before today's first fire is not today's result.
  const MARKET = {
    'Apex morning scan': 7 * 60 + 12,
    'Apex v2.9 paper track': 7 * 60 + 52,
    'Apex buy sheet': 8 * 60 + 5,
    'Market update': 8 * 60 + 10,
    'Portfolio dashboard refresh': 8 * 60 + 35,
    'Morning brief': 8 * 60 + 37,
    'Daily relay': 8 * 60 + 45,
    'Apex morning order ticket line': 8 * 60 + 45,
    'Agentic executor': 10 * 60 + 20
  };
  const MONDAY_ONLY = { 'Apex targets copy · Mondays': 8 * 60 + 30 };

  function wall(ms) {
    const p = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23', weekday: 'short'
    }).formatToParts(new Date(ms));
    const get = (t) => p.find((x) => x.type === t).value;
    let H = +get('hour');
    if (H === 24) H = 0;
    const M = +get('minute');
    return { key: get('year') + '-' + get('month') + '-' + get('day'), mins: H * 60 + M, wd: get('weekday') };
  }
  function dayNum(key) {
    const [y, m, d] = key.split('-').map(Number);
    return Math.round(Date.UTC(y, m - 1, d) / 86400000);
  }

  function assess(nowMs, asOfISO) {
    const now = wall(nowMs);
    const led = wall(Date.parse(asOfISO));
    const same = now.key === led.key;
    const gap = dayNum(now.key) - dayNum(led.key);
    let missed = false;
    let missedLabel = '';
    if (now.mins < PUBLISH[0].at) {
      const covered = (gap === 0 && led.mins >= PUBLISH[0].need) || (gap === 1 && led.mins >= PUBLISH[1].need);
      if (!covered) { missed = true; missedLabel = PUBLISH[1].label; }
    } else {
      for (const s of PUBLISH) {
        if (now.mins < s.at) continue;
        if (!(same && led.mins >= s.need)) { missed = true; missedLabel = s.label; }
      }
    }
    const demote = [];
    const weekday = now.wd !== 'Sat' && now.wd !== 'Sun';
    const eveningIn = same && led.mins >= PUBLISH[1].need;
    if (weekday && !eveningIn) {
      const table = now.wd === 'Mon' ? Object.assign({}, MARKET, MONDAY_ONLY) : MARKET;
      for (const name in table) {
        const fire = table[name];
        if (now.mins < fire) continue;
        if (!(same && led.mins >= fire)) demote.push(name);
      }
    }
    return { missed: missed, missedLabel: missedLabel, demote: demote };
  }
  return assess;
});
