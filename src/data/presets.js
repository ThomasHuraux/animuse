export const CHROMATIC_KEYS = ['Do', 'Do#', 'Ré', 'Ré#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];

// MIDI range: C2 (36) to C5 (72) — 37 keys
export const MIDI_LOW  = 36;
export const MIDI_HIGH = 72;
export const NUM_KEYS  = 37;
// La touche 18 correspond à F#3, milieu du clavier — les samples sont enregistrés à cette hauteur
// pour minimiser la distorsion du pitch-shift vers les extrêmes.
export const CENTER_KEY = 18;

// 2^(n/12) for n = 0..36
export const SEMITONE_RATIOS = Array.from({ length: NUM_KEYS }, (_, i) => Math.pow(2, i / 12));

const CHROMATIC_COLORS = [
  '#FF6B6B', '#FF9F43', '#FECA57', '#48DBFB', '#FF9FF3', '#54A0FF',
  '#5F27CD', '#00D2D3', '#10AC84', '#EE5A24', '#C8D6E5', '#576574',
];

// One colour per key (37), cycling by chromatic position
export const KEY_COLORS = Array.from({ length: NUM_KEYS }, (_, i) => CHROMATIC_COLORS[i % 12]);

// gain : normalisation volume (certains samples sont nettement plus forts que d'autres)
// offset : décalage de lecture en secondes (coupe un silence initial dans le sample)
// reverb : active la réverbération synthétique via Web Audio ConvolverNode
// pig/lion : les noms de fichiers sont intentionnellement croisés — meilleure adéquation timbrale
export const ANIMAL_META = {
  cat:   { emoji: '🐱', label: 'Chat',       file: 'cat.mp3',   gain: 1.0  },
  dog:   { emoji: '🐕', label: 'Chien',      file: 'dog.mp3',   gain: 0.85 },
  cow:   { emoji: '🐮', label: 'Vache',      file: 'cow.mp3',   gain: 0.75 },
  frog:  { emoji: '🐸', label: 'Grenouille', file: 'frog.mp3',  gain: 1.0  },
  horse: { emoji: '🐎', label: 'Cheval',     file: 'horse.mp3', gain: 0.75 },
  pig:   { emoji: '🐷', label: 'Cochon',     file: 'lion.mp3',  gain: 0.9  },
  lion:  { emoji: '🦁', label: 'Lion',       file: 'pig.mp3',   gain: 0.65 },
  owl:   { emoji: '🦉', label: 'Hibou',      file: 'owl.mp3',   gain: 1.0  },
  bird:  { emoji: '🐦', label: 'Oiseau',     file: 'bird.mp3',  gain: 1.0, offset: 0.3 },
  bear:  { emoji: '🐻', label: 'Ours',       file: 'bear.mp3',  gain: 0.7  },
  panda: { emoji: '🐼', label: 'Panda',      file: 'panda.mp3', gain: 1.0  },
  fox:   { emoji: '🦊', label: 'Renard',     file: 'fox.mp3',   gain: 1.0  },
  piano: { emoji: '🎹', label: 'Piano',      file: 'piano.mp3', gain: 0.5, reverb: true },
};

const ZOO_ANIMALS_12 = ['cat', 'dog', 'cow', 'frog', 'horse', 'pig', 'lion', 'owl', 'bird', 'bear', 'panda', 'fox'];
const SOLO_ANIMALS = ['cat', 'dog', 'cow', 'frog', 'fox'];

export const PRESETS = [
  {
    id: 'zoo',
    name: 'Zoo',
    emoji: '🦁',
    animals: Array.from({ length: NUM_KEYS }, (_, i) => ZOO_ANIMALS_12[i % 12]),
    pitchShift: false,
  },
  {
    id: 'piano',
    name: 'Piano',
    emoji: '🎹',
    animals: Array(NUM_KEYS).fill('piano'),
    pitchShift: true,
    baseAnimal: 'piano',
  },
  ...SOLO_ANIMALS.map(animal => ({
    id: animal,
    name: ANIMAL_META[animal].label,
    emoji: ANIMAL_META[animal].emoji,
    animals: Array(NUM_KEYS).fill(animal),
    pitchShift: true,
    baseAnimal: animal,
  })),
];

// QWERTY → absolute key index (octave 3: C3=12 … B3=23)
export const QWERTY_MAP = {
  'a': 12, // C3
  'w': 13, // C#3
  's': 14, // D3
  'e': 15, // D#3
  'd': 16, // E3
  'f': 17, // F3
  't': 18, // F#3
  'g': 19, // G3
  'y': 20, // G#3
  'h': 21, // A3
  'u': 22, // A#3
  'j': 23, // B3
};

export const INDEX_TO_QWERTY = Object.fromEntries(
  Object.entries(QWERTY_MAP).map(([k, v]) => [v, k.toUpperCase()])
);
