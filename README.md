# Italia Scroll · Italiano 3

**Laptop-first** trip through Italy (two-pane on Chromebooks; vertical snap on phones) for Sue Scotto’s Italian 3 (AppuccinoHub).

Each card = **English statement** → pick the Italian that says it (the photo shows the place named on the card).
Sneak: now-vs-past feel + high-frequency chunks (`Ti va di…`, `il golfo`, food, places). No tense-name labels.
**Single tap:** one answer per card. After a correct pick: “Brava/Bravo!” + tiny “you locked in” gloss for ~1.4 s, then it auto-advances (Next / arrow keys still work).
Nine cards use a short, muted, place-verified clip (the card photo is its poster). A few Level 2–3 cards show verified teen/young-adult "action" photos. Level 1 ends with a bonus card (16 cards total): «Sarà perché ti amo» (Ricchi e Poveri). Since v14.3 there is no YouTube: tapping Play streams Apple Music’s official 30-second iTunes preview (the only network request, made only on tap; the audio is not stored in this repo) and plays the chorus (10.1–24.2 s of the preview). If the preview can’t load, the trackId is looked up again; if that fails, a short note shows and the card still works. Preview courtesy of Apple Music.

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

Vanilla HTML/CSS/JS. Cache-bust: `?v=14.3`. Themes: Sky lemon → Fall → Dark.
No modal sheets / Chiudi overlays.
