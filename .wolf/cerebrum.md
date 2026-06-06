# Cerebrum

> OpenWolf's learning memory. Updated automatically as the AI learns from interactions.
> Do not edit manually unless correcting an error.
> Last updated: 2026-04-24

## User Preferences
- French is the primary language for UI text and communication
- No TypeScript — plain JS/JSX only
- Concise responses preferred
- **Desktop-first** : le mobile n'est PAS prioritaire. Le clavier MIDI ne se branche que sur Macbook, donc l'app est utilisée en desktop. Ne pas passer de temps sur les problèmes mobile-only sauf demande explicite.

## Key Learnings
- **Project:** Animuse — animal piano/sampler web app for a 2-year-old, Bluey-inspired UI
- **Audio strategy:** Howler.js for Zoo preset (natural pitch), Web Audio API BufferSource + playbackRate for per-animal pitch-shifted presets
- **Sound files (2026-04-24):** 12x MP3 — 6 from Mixkit CDN (cat/dog/cow/horse/owl/bird, preview URLs: `assets.mixkit.co/active_storage/sfx/{id}/{id}-preview.mp3`), 6 from Freesound CDN (frog/pig/lion/bear/fox/panda, preview URLs: `cdn.freesound.org/previews/{folder}/{id}_...-lq.mp3`). All CC0/free. ANIMAL_META.file stores extension per animal.
- **Zoo animals (2026-04-24):** cat, dog, cow, frog, horse, pig, lion, owl, bird, bear, panda, fox. Removed: duck (no Noto), sheep (no Noto), elephant (no Noto). Added: bear (1f43b), panda (1f43c), fox (1f98a).
- **Solo presets (2026-04-24):** cat, dog, cow, frog, fox (replaced duck)
- **MIDI mapping:** 37 keys, C2–C5 (MIDI 36–72). keyIndex = midiNote - 36. Notes outside range ignored.
- **Key index:** absolute 0–36 throughout (not chromaticIndex). chromaticIndex = keyIndex % 12 where needed.
- **Animation re-trigger:** null → rAF → value pattern in App.jsx to re-fire same-key animation
- **Tailwind v3** must be used (v4 breaks tailwind.config.js and directive syntax)
- **npm create vite** in a non-empty dir: scaffold in /tmp first, then copy files over

## Key Learnings
- **Noto Animated Emoji**: Google hosts Lottie JSON for animated emojis at `https://fonts.gstatic.com/s/e/notoemoji/latest/{hex_code}/lottie.json`. Pure vector, no external assets. Shortlist — only use animals with confirmed 200 OK (see next entry). Do NOT use substitutes for animals missing from Noto; instead pick a different animal.
- **Noto Emoji availability (full tested list, 2026-04-24)**: 200 OK: 1f431 cat, 1f42e cow, 1f438 frog, 1f981 lion, 1f989 owl, 1f426 bird, 1f416 pig, 1f40e horse, 1f43b bear, 1f415 dog, 1f43c panda, 1f98a fox, 1f43a wolf, 1f984 unicorn, 1f422 turtle, 1f425 chick. 404: 1f418 elephant, 1f986 duck, 1f411 sheep, 1f436 dog-face, 1f430 rabbit, 1f439 hamster, 1f428 koala, 1f42f tiger, 1f42d mouse.
- **Vite stale Lottie cache**: After replacing public/animations JSON files, browser must hard-reload (`location.reload(true)`) to pick up new files; Vite doesn't invalidate static file cache automatically.

## Do-Not-Repeat
- [2026-04-23] `npm create vite@latest . --template react` fails silently in a non-empty directory even with piped "y". Workaround: scaffold in /tmp/animuse-scaffold, then `cp -r /tmp/animuse-scaffold/. .`
- [2026-04-23] `afconvert` cannot output MP3 directly (returns 'typ?' error). Use `-f m4af -d aac` to output .m4a instead, which Howler.js and browsers support.
- [2026-04-23] Do not hardcode `.mp3` extension in useAudio.js — use `ANIMAL_META[animal].file` to support mixed formats (mp3 and m4a)
- [2026-04-24] Ne pas investir de temps sur les problèmes spécifiques au mobile (scroll tronqué, layout cramped) — l'usage se fait exclusivement sur Macbook car le clavier MIDI est branché dessus.

## Decision Log
- [2026-04-23] Howler.js for natural-pitch playback (Zoo preset), Web Audio API for pitch-shift presets. Reason: Howler provides better cross-browser compatibility and simpler stop/restart; Web Audio API needed for playbackRate pitch-shifting which Howler doesn't support natively.
- [2026-04-23] AudioContext created lazily on first playNote call. Reason: browsers block AudioContext creation before user gesture (autoplay policy).
- [2026-04-23] AnimalCard uses `bounceKey` state to re-trigger CSS animation. Reason: React won't re-render if isActive stays true — bouncing the key forces a new DOM node.
- [2026-04-23] PianoKeyboard uses CSS absolute positioning for black keys over a flex white-key row. Standard piano layout approach, no library needed.
