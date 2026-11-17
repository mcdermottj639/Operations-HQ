/* Operations HQ hand-kept data: open items, ChatGPT tasks, milestones, projects, sources.
   Task status lives in ledger.js, which the twice-daily refresh rewrites.
   PUBLIC PAGE: no account numbers (not even last four), balances, order or PR ids,
   buyer details, task prompts or private task output. Names, cadence, last-fired
   date and a status word only. Every fact must trace to a Claudex doc.
   status: ok = scheduler recorded success · norec = fired, no status stored ·
           new = has not run yet · sched = scheduled, run status not visible here */
window.HQ_DATA = {
  projectsAsOf: 'Nov 16',
  D: 'https://docs.google.com/document/d/',

  // Hand-kept open items. Blockers from the Claude ledger are added automatically (ledger.js).
  // who: jack | claude | chatgpt | third. hideWhenLedgerAfter: item clears itself once a
  // ledger refresh newer than that time has been published.
  needs: [
    {who:'jack', title:'Sports Hub CBB model', desc:'Built on a review branch. Not merged without your OK.', chip:'Waiting on you · approve or park', icon:'basket', doc:'1Ayh9Sfaff1hXQ2aVK4vreLPpdrHqoZSHebPrJLk79lo'},
    {who:'jack', title:'Check this site on your Duo', desc:'Folded, open and propped. Screenshot anything cramped.', chip:'Waiting on you · 2 min', icon:'half', doc:'1oyJS2uyoBF8-TET3fLxU-hvlke9U805GXNhFjMb4k8Q'},
    {who:'claude', title:'First automatic ledger refresh', desc:'Sync runs 6:55 AM Nov 17. This page picks it up at 7:10 AM.', chip:'Waiting on Claude', icon:'activity', doc:'1-0NeNlO_XS-1eriou-Vb_-AhOkSfS-fiy6MThMTb_2s', hideWhenLedgerAfter:'2026-11-17T06:00:00-05:00'}
  ],

  // ChatGPT scheduled tasks (its own Nov 16 inventory). days: Mon..Sun
  chatgpt: [
    {n:'Market & Trading Lab', sub:'Research and strategy learning', days:[1,0,1,0,0,1,0], time:'7:00 PM'},
    {n:'Business check writer', sub:'Portfolio business data', days:[1,0,0,0,0,0,0], time:'8:45 AM'},
    {n:'Card pricing & Buy Radar', sub:'Research only; Claude publishes', days:[0,1,0,0,1,0,0], time:'7:00 PM'},
    {n:'Duo, Caddie & Sports Workshop', sub:'Separate scoped workstreams', days:[0,0,1,0,0,1,0], time:'8:00 AM'},
    {n:'Weekly finances update', sub:'Private summary', days:[0,0,0,0,0,1,0], time:'8:00 AM'}
  ],
  chatgptPaused: ['Caddie HQ Course Expansion','Sports Hub AI Workshop','Card Buy Radar','Claudex coordination check','Covered Call Ideas','Jarvis shutdown watch','Sports Hub evidence refresh','Robinhood refresh check','Hurdstradamus feedback reminder'],

  milestones: [
    {title:'Operations HQ site live', note:'Built by Claude · reviewed by ChatGPT'},
    {title:'Claude task ledger created', note:'Refreshes 6:55 AM + 8:55 PM'},
    {title:'Buy Radar: one writer', note:'Claude publishes · ChatGPT researches Tue/Fri'},
    {title:'Sports Hub Duo check accepted', note:'v389 · on your phone'}
  ],

  projects: [
    {id:'portfolio',name:'Portfolio & Apex',icon:'chart',style:'lime',state:'inprogress',status:'Research active',badge:'blue',summary:'Apex paper validation and production safeguards remain separate.',verified:'Portfolio release validation pilot exists. v2.9 is a paper-only track; results not yet graded in this snapshot.',next:'Verify prospective paper cohorts and live task evidence without altering trade authorizations.',doc:'1tRDoWPVmd8HhEV7-rqPoqG1cYe7Yp9lAXAasEMos5xw'},
    {id:'sports',name:'Sports Hub',icon:'basket',style:'teal',state:'verified',status:'Duo accepted',badge:'teal',summary:'v389 release verified. DraftKings refresh still blocked.',verified:'GitHub CI and Pages jobs passed; device acceptance recorded by Claude Nov 16. CBB model remains on a separate review branch.',next:'Restore DraftKings connector; preserve existing CBB approval gate.',doc:'1Ayh9Sfaff1hXQ2aVK4vreLPpdrHqoZSHebPrJLk79lo'},
    {id:'ebay',name:'Card Vault / eBay',icon:'card',style:'orange',state:'inprogress',status:'Single owner',badge:'blue',summary:'Claude owns canonical Buy Radar publishing; ChatGPT researches.',verified:'ChatGPT Tue/Fri task set to research only and read back. Claude confirmed its Saturday task is the only Buy Radar publisher. Last published Card Vault UX reported as v72 in the handoff.',next:'Preserve separate comparison / owner event feeds.',doc:'1Qpg8aLmv-BR1tKX554_JXNegompKGVeRunsJsXxzNSo'},
    {id:'golf',name:'Caddie HQ',icon:'golf',style:'lime',state:'verified',status:'Web verified',badge:'teal',summary:'v293 public deployment and saved club data documented.',verified:'Handoff reports v293 public asset parity; physical device and real GPS remain separate tests.',next:'Continue source-backed course onboarding; do not guess mapping coverage.',doc:'10TzWts8Im5hGWAcYKpHSUhuiOwJYrUii2g2TLiZtShc'},
    {id:'league',name:'League History',icon:'book',style:'teal',state:'inprogress',status:'Design review',badge:'blue',summary:'Historical statistics and storylines being organized.',verified:'Handoff reports v146 deployed as of Nov 12. Phone acceptance not independently verified.',next:'Organize expanded regular-season statistics and layout without assuming new features are already shipped.',doc:'1hrjOhVlah-K8fPezpPfp4seSCIUJfAXP-XXLD9ljyRk'},
    {id:'survivor',name:'Family Survivor',icon:'checks',style:'teal',state:'verified',status:'Deployed v93',badge:'teal',summary:'Roster shelf migration and original pick history preserved.',verified:'Handoff reports v93 live, 62 suites / 1,778 checks passing at Nov 10.',next:'No unapproved roster/schema changes.',doc:'1wFtICdP9iNZRKY_IN53MoHyxHurdd_3gj-g6QmmlJiQ'},
    {id:'cfp',name:'CFP Study Lab',icon:'book',style:'orange',state:'hold',status:'No new claim',badge:'gray',summary:'Previous guided study release documented.',verified:'Handoff reports v2.113.0 source and Pages verified in October; no new activity inferred.',next:'Only begin new work on explicit request.',doc:'1WblUV8msgtOKysVg7SFZAjLIXJObKurv1EaJEEkzW0U'},
    {id:'warroom',name:'Warroom',icon:'folder',style:'orange',state:'hold',status:'Unverified',badge:'gray',summary:'Repository identified; current role and deployment unverified.',verified:'Handoff confirms repository identity only.',next:'Confirm whether active before adding it to running operations.',doc:'1RNP97jsvO4pC44uSbUHi8YzTkSqZtALDAV176j4wd-Q'}
  ],

  sources: [
    ['Claudex coordination','Cross-assistant rules and OPS-IDs','1oyJS2uyoBF8-TET3fLxU-hvlke9U805GXNhFjMb4k8Q'],
    ['Claude task ledger','Every Claude task, refreshed twice a day','1-0NeNlO_XS-1eriou-Vb_-AhOkSfS-fiy6MThMTb_2s'],
    ['HQ operating home','Roadmap, authority, briefing format','1LdBhgSe5HLvNji-F6aWlMFwW6o8JM0peaXnR3Cp40q8'],
    ['Claude integration audit','Full task inventory, gaps, lifecycle','13ndXp8KyFfrsUJmiPSgQUsq-k6QiYY1951BmxS8iiUQ'],
    ['Portfolio handoff','Apex, Agentic and release gates','1tRDoWPVmd8HhEV7-rqPoqG1cYe7Yp9lAXAasEMos5xw'],
    ['Sports Hub handoff','Duo pilot, CBB branch, deploy evidence','1Ayh9Sfaff1hXQ2aVK4vreLPpdrHqoZSHebPrJLk79lo'],
    ['Card Vault / eBay handoff','Buy Radar ownership, comparison scope','1Qpg8aLmv-BR1tKX554_JXNegompKGVeRunsJsXxzNSo'],
    ['Caddie HQ handoff','Course catalog, swing history, deploys','10TzWts8Im5hGWAcYKpHSUhuiOwJYrUii2g2TLiZtShc'],
    ['League History handoff','Current release, upcoming analysis','1hrjOhVlah-K8fPezpPfp4seSCIUJfAXP-XXLD9ljyRk']
  ]
};
