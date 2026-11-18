/* Operations HQ hand-kept data: open items, ChatGPT tasks, milestones, projects, sources.
   Task status lives in ledger.js, which the twice-daily refresh rewrites.
   PUBLIC PAGE: no account numbers (not even last four), balances, order or PR ids,
   buyer details, task prompts or private task output. Names, cadence, last-fired
   date and a status word only. Every fact must trace to a Claudex doc.
   status: ok = scheduler recorded success · norec = fired, no status stored ·
           new = has not run yet · sched = scheduled, run status not visible here */
window.HQ_DATA = {
  projectsAsOf: 'Nov 17 (CBB source correction; task ledger pending morning refresh)',
  D: 'https://docs.google.com/document/d/',

  // Hand-kept open items. Blockers from the Claude ledger are added automatically (ledger.js).
  // key: stable id, required for anything waiting on Jack (it is what a check-off is stored under).
  // verify: 'ack' = Jack's check-off is final (only he can judge it). {test, github, branch, doc} =
  //   the twice-daily refresh checks it and records the result in checks.js. Ledger blockers verify
  //   themselves: a later ledger either still lists them or it does not.
  // who: jack | claude | chatgpt | third. hideWhenLedgerAfter: item clears itself once a
  // ledger refresh newer than that time has been published.
  needs: [
    {key:'cbb', verify:{test:'Resolved when the CBB model's merge commit is reachable from main, or the Sports Hub handoff says Jack shipped or parked it. Branch existence alone does not mean unmerged; verify main ancestry.', github:'mcdermottj639/Sports-Hub', branch:'feature/cbb-model', doc:'1Ayh9Sfaff1hXQ2aVK4vreLPpdrHqoZSHebPrJLk79lo'}, who:'jack', title:'Sports Hub CBB model', desc:'Merged into main in v390 on Nov 17; no publishing approval needed.', chip:'Waiting on you · approve or park', icon:'basket', steps:['Tell Claude "ship the CBB model" to merge and publish it.','Or tell Claude "park CBB" and this item is removed.'], why:'Built and tested on a review branch on Nov 14. It was held back because publishing needs your explicit OK.', doc:'1Ayh9Sfaff1hXQ2aVK4vreLPpdrHqoZSHebPrJLk79lo'},
    {key:'hq-duo', verify:'ack', who:'jack', title:'Check this site on your Duo', desc:'Folded, open and propped. Screenshot anything cramped.', chip:'Waiting on you · 2 min', icon:'half', steps:['Open this site with the Duo folded, then open.','Prop it half-folded and turn Mid-fold on.','Screenshot anything cramped or cut off and send it to Claude.','If it all looks right, tell Claude "HQ looks good on the Duo".'], why:'It has only been tested in a desktop browser at Duo sizes.', doc:'1oyJS2uyoBF8-TET3fLxU-hvlke9U805GXNhFjMb4k8Q'},
    {who:'claude', title:'First automatic ledger refresh', desc:'Sync runs 6:55 AM Nov 17. This page picks it up at 7:10 AM.', chip:'Waiting on Claude', icon:'activity', steps:[], why:'Nothing for you to do. This item clears itself once the first automatic refresh lands.', doc:'1-0NeNlO_XS-1eriou-Vb_-AhOkSfS-fiy6MThMTb_2s', hideWhenLedgerAfter:'2026-11-17T06:00:00-05:00'}
  ],

  // What-to-do notes for blockers that arrive from the ledger, matched by a word in the blocker text
  howto: [
    {match:'draftkings', steps:['The blocked refresh is a ChatGPT task, so the reconnect happens in ChatGPT.','In your Operations HQ chat, say "reconnect DraftKings" and sign in when it asks.','It clears here after the next ledger refresh shows it fixed.'], doc:'1Ayh9Sfaff1hXQ2aVK4vreLPpdrHqoZSHebPrJLk79lo'},
    {match:'jarvis', steps:[], why:'Nothing for you to do. Claude checks the first channel post after the 8:45 AM relay.'}
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
    {title:'Claude task ledger created', note:'Rewritten 6:55 AM + 6:55 PM daily; checked 5×/day'},
    {title:'Portfolio v246 live', note:'Apex paper decision view · post-merge CI passed Nov 17'},
    {title:'Buy Radar: one writer', note:'Claude publishes · ChatGPT researches Tue/Fri'},
    {title:'Sports Hub Duo check accepted', note:'v389 · on your phone'}
  ],

  projects: [
    {id:'portfolio',name:'Portfolio & Apex',icon:'chart',style:'lime',state:'inprogress',status:'v246 live',badge:'blue',summary:'Apex paper validation and production safeguards remain separate.',verified:'v246 (paper decision view) passed post-merge CI incl. the published-site check. v2.9 is paper only; no graded cohorts yet. Physical Duo not checked.',next:'Verify prospective paper cohorts and live task evidence without altering trade authorizations.',doc:'1tRDoWPVmd8HhEV7-rqPoqG1cYe7Yp9lAXAasEMos5xw'},
    {id:'sports',name:'Sports Hub',icon:'basket',style:'teal',state:'verified',status:'CBB merged v390',badge:'teal',summary:'v389 device acceptance; v390 CBB merged. DraftKings refresh still blocked.',verified:'GitHub CI and Pages jobs passed; device acceptance recorded by Claude Nov 16. CBB model was merged into main in v390 on Nov 17 (commit 913cf4c). Live Pages verification remains separate.',next:'Restore DraftKings connector; independently verify v390 live deployment.',doc:'1Ayh9Sfaff1hXQ2aVK4vreLPpdrHqoZSHebPrJLk79lo'},
    {id:'ebay',name:'Card Vault / eBay',icon:'card',style:'orange',state:'inprogress',status:'Single owner',badge:'blue',summary:'Claude owns canonical Buy Radar publishing; ChatGPT researches.',verified:'ChatGPT Tue/Fri task set to research only and read back. Claude confirmed its Saturday task is the only Buy Radar publisher. Last published Card Vault UX reported as v72 in the handoff.',next:'Preserve separate comparison / owner event feeds.',doc:'1Qpg8aLmv-BR1tKX554_JXNegompKGVeRunsJsXxzNSo'},
    {id:'golf',name:'Caddie HQ',icon:'golf',style:'lime',state:'verified',status:'Web verified',badge:'teal',summary:'v293 public deployment and saved club data documented.',verified:'Handoff reports v293 public asset parity; physical device and real GPS remain separate tests.',next:'Continue source-backed course onboarding; do not guess mapping coverage.',doc:'10TzWts8Im5hGWAcYKpHSUhuiOwJYrUii2g2TLiZtShc'},
    {id:'league',name:'League History',icon:'book',style:'teal',state:'inprogress',status:'Design review',badge:'blue',summary:'Historical statistics and storylines being organized.',verified:'Handoff reports v146 deployed as of Nov 12. Phone acceptance not independently verified.',next:'Organize expanded regular-season statistics and layout without assuming new features are already shipped.',doc:'1hrjOhVlah-K8fPezpPfp4seSCIUJfAXP-XXLD9ljyRk'},
    {id:'survivor',name:'Family Survivor',icon:'checks',style:'teal',state:'verified',status:'Deployed v93',badge:'teal',summary:'Roster shelf migration and original pick history preserved.',verified:'Handoff reports v93 live, 62 suites / 1,778 checks passing at Nov 10.',next:'No unapproved roster/schema changes.',doc:'1wFtICdP9iNZRKY_IN53MoHyxHurdd_3gj-g6QmmlJiQ'},
    {id:'cfp',name:'CFP Study Lab',icon:'book',style:'orange',state:'hold',status:'No new claim',badge:'gray',summary:'Previous guided study release documented.',verified:'Handoff reports v2.113.0 source and Pages verified in October; no new activity inferred.',next:'Only begin new work on explicit request.',doc:'1WblUV8msgtOKysVg7SFZAjLIXJObKurv1EaJEEkzW0U'},
    {id:'warroom',name:'Warroom',icon:'folder',style:'orange',state:'hold',status:'Unverified',badge:'gray',summary:'Repository identified; current role and deployment unverified.',verified:'Handoff confirms repository identity only.',next:'Confirm whether active before adding it to running operations.',doc:'1RNP97jsvO4pC44uSbUHi8YzTkSqZtALDAV176j4wd-Q'}
  ],

  sources: [
    ['Claudex coordination','Cross-assistant rules and OPS-IDs','1oyJS2uyoBF8-TET3fLxU-hvlke9U805GXNhFjMb4k8Q'],
    ['Claude task ledger','Every Claude task, rewritten twice a day','1-0NeNlO_XS-1eriou-Vb_-AhOkSfS-fiy6MThMTb_2s'],
    ['HQ operating home','Roadmap, authority, briefing format','1LdBhgSe5HLvNji-F6aWlMFwW6o8JM0peaXnR3Cp40q8'],
    ['Claude integration audit','Full task inventory, gaps, lifecycle','13ndXp8KyFfrsUJmiPSgQUsq-k6QiYY1951BmxS8iiUQ'],
    ['Portfolio handoff','Apex, Agentic and release gates','1tRDoWPVmd8HhEV7-rqPoqG1cYe7Yp9lAXAasEMos5xw'],
    ['Sports Hub handoff','Duo pilot, CBB branch, deploy evidence','1Ayh9Sfaff1hXQ2aVK4vreLPpdrHqoZSHebPrJLk79lo'],
    ['Card Vault / eBay handoff','Buy Radar ownership, comparison scope','1Qpg8aLmv-BR1tKX554_JXNegompKGVeRunsJsXxzNSo'],
    ['Caddie HQ handoff','Course catalog, swing history, deploys','10TzWts8Im5hGWAcYKpHSUhuiOwJYrUii2g2TLiZtShc'],
    ['League History handoff','Current release, upcoming analysis','1hrjOhVlah-K8fPezpPfp4seSCIUJfAXP-XXLD9ljyRk']
  ]
};
