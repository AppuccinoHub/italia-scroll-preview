# Italia Scroll · Italiano 3

**Laptop-first** trip through Italy (two-pane on Chromebooks; vertical snap on phones) for Sue Scotto’s Italian 3 (AppuccinoHub).

Each card = **English statement** → pick the Italian that says it (the photo shows the place named on the card).
Sneak: now-vs-past feel + high-frequency chunks (`Ti va di…`, `il golfo`, food, places). No tense-name labels.
**Single tap:** one answer per card. After a correct pick: “Brava/Bravo!” + tiny “you locked in” gloss for ~1.4 s, then it auto-advances (Next / arrow keys still work).
Nine cards use a short, muted, place-verified clip (the card photo is its poster). A few Level 2–3 cards show verified teen/young-adult "action" photos. Level 1 ends with a bonus card (16 cards total): a tap-to-play YouTube sing-along of «Sarà perché ti amo» (youtube-nocookie embed, sound only after a tap, never autoplays). If YouTube is blocked, the card shows a still and a “Watch on YouTube” link.

**Live:** https://appuccinohub.github.io/italia-scroll/

**Teacher roster (same device):** https://appuccinohub.github.io/italia-scroll/teacher.html

## Classroom flow

1. Student types first name (saved locally).
2. Trip stretches unlock quietly after enough solid clears — no counter shown.
3. Every card has **Help** (before/while choosing) and **Explanation** (soft before answer; full why after).
4. Wrong pick → feedback, pick again until correct (only first-try counts). Correct pick → “Brava/Bravo!” + new-word note → auto-advance to the next card.
5. End screen shows first-try score under their name; roster stored in `localStorage` for `teacher.html`.

## Trip stretches

1. **Costa Campania** — Bacoli → Monte → Ischia → Capri…
2. **Sud e isole** — Tropea → Polignano → Matera…
3. **Centro e Nord** — Bologna → Genova → Braies…

Quick Play ≈ 8 cards. Person scope: io / tu / lui-lei / noi.

## Tech

Vanilla HTML/CSS/JS. Cache-bust: `?v=14.2`. Themes: Sky lemon → Fall → Dark.
No modal sheets / Chiudi overlays.
