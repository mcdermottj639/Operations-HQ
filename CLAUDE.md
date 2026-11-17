# Operations HQ — working notes

Read-only dashboard for Jack. ChatGPT (Operations Lead) owns content and design direction; Claude builds and publishes. Coordination lives in the Claudex Drive folder ("00 — Claudex coordination" and the HQ operating home doc).

## Rules
- Public GitHub Pages site. Never add account values, balances, tokens, buyer details or private task output. `noindex` is set, but that is not privacy.
- Snapshot facts only, each traceable to a Claudex handoff. Never show a task as run or succeeded without a verified source. Unknown = "Unverified" / "Not connected".
- No execution controls: nothing on the page trades, lists, starts or edits a task.
- Every open item says who it is waiting on (Jack, Claude, ChatGPT or a third party).
- Short lines, tiles, tap rows and folds. No paragraphs over two phone lines outside a fold. Minimum text 12px (tab labels 11px), tap targets 40px+.
- No sideways scroll and no blank background showing at any width. Test 320, 390, 466x677 (Duo folded), 677x466, 960x676 (Duo open), 768, 1280.
- Mid-fold: glance shelf on top, the active page scrolls below, nav at the bottom. Manual switch plus automatic when the browser reports a horizontal crease. The document itself must not scroll in this mode.
- Update this file with every change to the page, data or rules.

## Log
- 2026-11-16 — v1 (Claude). Rebuilt ChatGPT's prototype for GitHub Pages. Fixed the broken Decisions layout and grey default buttons; raised text from 9–11px to 12px+; turned paragraphs into tiles, tap rows, a weekly schedule strip and progress steppers with details folded; added "waiting on" chips, safe-area padding (Duo status-icon strip), page lock against overscroll, remembered theme and mid-fold, automatic crease detection, home-screen icon and manifest. Browser-tested at the sizes above with a simulated fold: no overflow, no page errors. Physical iPhone Duo not verified.
