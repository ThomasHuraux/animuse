# 🎹 Animuse

Piano interactif pour enfants avec sons d'animaux animés, inspiré de l'univers Bluey.

![Animuse screenshot](public/favicon.svg)

## Fonctionnalités

- **37 touches** — clavier de C2 à C5 (3 octaves)
- **8 presets** — Zoo (12 animaux en boucle), Piano, et 5 animaux solo avec pitch-shift
- **3 modes de jeu** — clic souris, clavier QWERTY, contrôleur MIDI
- **Animations Lottie** — emojis animés Google Noto pour chaque animal
- **Audio haute qualité** — Howler.js (Zoo) + Web Audio API avec enveloppe ADSR (presets solo)
- **Réverbération synthétique** — uniquement sur le preset Piano
- **Design Bluey** — ciel dégradé, montagnes, fleurs, soleil, nuages dérivants

---

## Installation

### Prérequis

- [Node.js](https://nodejs.org/) v18 ou supérieur
- npm v9 ou supérieur

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/ThomasHuraux/animuse.git
cd animuse

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173) dans le navigateur.

---

## Utilisation

### Jouer avec la souris / le doigt

Cliquer (ou toucher) directement les touches du clavier affiché en bas de l'écran.

### Jouer avec le clavier QWERTY

Les touches du clavier sont mappées sur l'octave 3 (C3–B3) :

| Touche clavier | Note  |
|----------------|-------|
| `A`            | Do 3  |
| `W`            | Do#3  |
| `S`            | Ré 3  |
| `E`            | Ré#3  |
| `D`            | Mi 3  |
| `F`            | Fa 3  |
| `T`            | Fa#3  |
| `G`            | Sol 3 |
| `Y`            | Sol#3 |
| `H`            | La 3  |
| `U`            | La#3  |
| `J`            | Si 3  |

### Jouer avec un contrôleur MIDI

Brancher un clavier MIDI via USB avant de lancer l'app. Le navigateur demandera l'autorisation d'accès au MIDI (accepter). Les notes MIDI 36–72 (C2–C5) sont reconnues automatiquement.

> **Note :** le MIDI nécessite un navigateur compatible Web MIDI API (Chrome / Edge recommandés).

### Choisir un preset

Les boutons en haut permettent de choisir le preset :

- **🦁 Zoo** — chaque touche déclenche un animal différent (12 animaux en boucle), sans pitch-shift
- **🎹 Piano** — sample de piano avec pitch-shift et réverbération
- **🐱 / 🐕 / 🐮 / 🐸 / 🦊** — un seul animal sur tout le clavier, avec pitch-shift (toutes les notes de la gamme chromatique)

### Plein écran

Cliquer sur l'icône ⛶ en haut à droite pour passer en mode plein écran (idéal sur tablette branchée au piano MIDI).

---

## Structure du projet

```
animuse/
├── public/
│   ├── animations/animals/   # JSON Lottie (Google Noto Animated Emoji)
│   └── sounds/animals/       # MP3 — sons d'animaux
├── src/
│   ├── components/
│   │   ├── AnimalLottie.jsx  # Lecteur Lottie par animal
│   │   ├── HeroAnimal.jsx    # Zone centrale (animal actif ou idle)
│   │   ├── PianoKeyboard.jsx # Clavier 37 touches (blanches + noires)
│   │   ├── PresetSelector.jsx# Boutons de sélection du preset
│   │   ├── Mountains.jsx     # Décor montagne style Bluey
│   │   ├── Flowers.jsx       # Petites fleurs SVG sur le gazon
│   │   └── Sun.jsx           # Soleil décoratif
│   ├── data/
│   │   └── presets.js        # Données : animaux, presets, mapping QWERTY
│   ├── hooks/
│   │   ├── useAudio.js       # Moteur audio (Howler + Web Audio API)
│   │   └── useMIDI.js        # Accès Web MIDI API
│   ├── App.jsx               # Composant racine
│   └── main.jsx              # Point d'entrée React
├── index.html
├── tailwind.config.js
└── vite.config.js
```

---

## Architecture audio

Deux chemins audio selon le preset :

| Preset | Moteur | Pitch-shift | Polyphonie |
|--------|--------|-------------|------------|
| Zoo    | Howler.js | Non (pitch original) | Par animal (12 voix) |
| Solo / Piano | Web Audio API | Oui (`playbackRate`) | Par touche (37 voix) |

**Enveloppe ADSR** (presets avec pitch-shift) :
- Attack : 8 ms (évite le clic de démarrage)
- Sustain : 1,2 s
- Release : 350 ms (fondu de sortie)

**Réverbération** (Piano uniquement) : Impulse Response synthétique générée via un ConvolverNode Web Audio (bruit blanc à décroissance exponentielle).

---

## Build de production

```bash
npm run build
```

Les fichiers compilés sont dans `dist/`. Déploiement possible sur n'importe quel hébergement statique (Netlify, Vercel, GitHub Pages…).

---

## Crédits

- Animations : [Google Noto Animated Emoji](https://googlefonts.github.io/noto-emoji-animation/) (CC BY 4.0)
- Sons : [Mixkit](https://mixkit.co/) et [Freesound](https://freesound.org/) (CC0)
- Police : [Fredoka One](https://fonts.google.com/specimen/Fredoka+One) (Google Fonts)
- UI inspirée de la série animée [Bluey](https://www.bluey.tv/)
