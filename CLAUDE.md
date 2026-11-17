# Operations HQ — working notes

Read-only dashboard for Jack. ChatGPT (Operations Lead) owns content and design direction; Claude builds and publishes. Coordination lives in the Claudex Drive folder ("00 — Claudex coordination" and the HQ operating home doc).

## Files
- `index.html` — the page (layout, styles, rendering). No data in it.
- `ledger.js` — AUTO-GENERATED task status (`window.HQ_LEDGER`). Never edit by hand.
- `data.js` — hand-kept: open items not in the ledger, ChatGPT's task list, milestones, projects, sources.
- `tools/build-ledger.mjs` — turns the text of the Claudex doc "Operations HQ — Claude task ledger" into `ledger.js`. All scrubbing happens in this code, not by judgment.
- `checks.js` — AUTO-GENERATED results of verifying hand-kept open items (`window.HQ_CHECKS`). Never edit by hand.
- `tools/resolve.mjs` — records one verification result (`set <key> <resolved|open> "<note>"`) and stamps the run (`stamp`).
- `tools/validate.mjs` — public-safety and shape gate. The publish workflow runs it; a failure blocks publishing.

## How status gets here (no one has to ask)
1. Claude's Claudex sync rewrites the ledger doc at 6:55 AM and 8:55 PM ET.
2. The scheduled task "Operations HQ site refresh" (7:10 AM and 9:10 PM ET) reads that doc, runs `build-ledger.mjs` then `validate.mjs`, and pushes `ledger.js` to `main` only if it changed.
3. The `Publish to gh-pages` workflow re-runs `validate.mjs` and copies `main` to `gh-pages`. GitHub Pages serves it.
4. The page loads `ledger.js` fresh on every open (and again when reopened after 15 minutes), shows "Updated <time>", and shows a Stale notice after 26 hours without a refresh.
5. The same task verifies every hand-kept open item that has a `verify.test` (from the sources named on the item) and records the result with `resolve.mjs`.
- Projects, decisions and milestones are NOT automatic. Whoever ships or verifies a change updates `data.js` (and the Decisions cards in `index.html`) in the same piece of work.

## Rules
- Public GitHub Pages site. Never add account numbers (not even last four), balances, dollar amounts, order/PR ids, tokens, buyer details, task prompts or private task output. `noindex` is set, but that is not privacy. `validate.mjs` enforces this; never weaken it to get a publish through.
- Task rows carry only: name, cadence, last-fired date/time, and a status word (ok / norec / new / fail).
- Lead with Jack's operation, not one assistant's: Needs you first, then task health, then what is running by area (Investing, Sports Hub, Card Vault, Caddie HQ, App health, Your updates), with ChatGPT's tasks as one more group.
- Facts only, each traceable to a Claudex doc. Never show a task as run or succeeded without the ledger saying so.
- No execution controls: nothing on the page trades, lists, starts or edits a task.
- Tapping an open item or a project opens a sheet inside the page (what to do, why, who it waits on). Never send a tap straight to a Google Doc; the source doc is a secondary button in the sheet. Only the Sources page links out directly. Every item waiting on Jack carries `steps` (hand items in `data.js`, ledger blockers through `howto`).
- Check-offs (Jack, Nov 17: "Allow me to check off when I did something but whatever next update can verify and remove it or repost"). Anything waiting on Jack has a check circle and an "I did this" button. A check is a claim, stored on that device only (the site is public, so it accepts no writes). The item moves to "Checked off" and stops counting. At the next update it is verified: a ledger blocker by whether the new ledger still lists it; an item with `verify.test` by `checks.js`. Fixed means removed for everyone; not fixed means it comes back marked "Still open" with the time and the evidence line. `verify:'ack'` is only for things nobody but Jack can judge (a device check): his check-off is final there. Every item waiting on Jack needs a `key` and a `verify`.
- Every open item says who it is waiting on (Jack, Claude, ChatGPT or a third party). Items waiting on Jack go in "Needs you"; everything else in "In motion". Done is quiet: remove an item when it is done; time-bound items use `hideWhenLedgerAfter`.
- Short lines, tiles, tap rows and folds. No paragraphs over two phone lines outside a fold. Minimum text 12px (tab labels 11px), tap targets 40px+.
- No sideways scroll and no blank background showing at any width. Test 320, 390, 466x677 (Duo folded), 677x466, 960x676 (Duo open), 768, 1280.
- Mid-fold: glance shelf on top, the active page scrolls below, nav at the bottom. Saved mode is auto / on / off; an explicit OFF survives reloads and beats crease detection. The document itself must not scroll in this mode.
- Update this file with every change to the page, data shape or rules.

## Publishing
- Live: https://mcdermottj639.github.io/Operations-HQ/ — GitHub Pages serves the `gh-pages` branch.
- Work on `main`. The `Publish to gh-pages` workflow validates, then copies `main` to `gh-pages` on every push. If the copy step fails, push by hand: `git push origin main:gh-pages` (only after `node tools/validate.mjs` passes).
- Confirm the `pages build and deployment` run succeeded, then load the live URL.

## Log
- 2026-11-17 — v2.2 (Claude). Check-offs with verify-then-remove-or-repost (see the rule above). Added `checks.js`, `tools/resolve.mjs`, the verify step in the refresh task, and validator coverage for both.
- 2026-11-17 — v2.1 (Claude). Jack: "why does clicking a needs you take me to google doc". Open items now open an in-page sheet with what to do, why and who it waits on; the source doc is a secondary button.
- 2026-11-17 — v2 (Claude). Jack: "make sure what's most important to what we are doing is being shown not just gpt stuff", then "get the approved Claude task ledger feeding fresh, public-safe status into the dashboard". Overview now leads with Needs you, last-run health and What's running by area (23 Claude tasks + 5 ChatGPT), replacing the ChatGPT-only counts. Tasks page shows every Claude task by area with status dots; ChatGPT's schedule is one group. Data split out of the page into `ledger.js` (auto) and `data.js` (hand). Added the converter, the validator, the validate step in the publish workflow, the "Updated" time and Stale notice, and the twice-daily refresh task. Fixed ChatGPT's review finding OPS-SITE-QA-01 (mid-fold OFF now survives a reload). Browser-tested at all sizes plus simulated fold, failed-task, stale and missing-ledger cases. Physical iPhone Duo not verified.
- 2026-11-16 — v1 (Claude). Rebuilt ChatGPT's prototype for GitHub Pages. Fixed the broken Decisions layout and grey default buttons; raised text from 9–11px to 12px+; turned paragraphs into tiles, tap rows, a weekly schedule strip and progress steppers with details folded; added "waiting on" chips, safe-area padding (Duo status-icon strip), page lock against overscroll, remembered theme and mid-fold, automatic crease detection, home-screen icon and manifest. Browser-tested at the sizes above with a simulated fold: no overflow, no page errors. Physical iPhone Duo not verified.
