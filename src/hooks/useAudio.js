import { useEffect, useRef, useCallback } from 'react';
import { Howl } from 'howler';
import { CENTER_KEY, ANIMAL_META } from '../data/presets';

// Tous les animaux disponibles — nécessaire pour précharger les Howl avant la 1ère interaction
const ALL_ANIMALS = ['cat', 'dog', 'cow', 'frog', 'horse', 'pig', 'lion', 'owl', 'bird', 'bear', 'panda', 'fox', 'piano'];

// Enveloppe ADSR (en secondes)
const ATTACK  = 0.008;  // 8 ms — évite le clic de démarrage (DC offset)
const SUSTAIN = 1.2;
const RELEASE = 0.35;
const TOTAL   = SUSTAIN + RELEASE;

// Génère un Impulse Response de réverbération synthétique (bruit blanc décroissant).
// Coûteux à créer, donc mis en cache dans reverbIRRef et réutilisé par note.
function buildReverbIR(ctx, duration = 1.2, decay = 2.5) {
  const length = Math.floor(ctx.sampleRate * duration);
  const ir = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = ir.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return ir;
}

export function useAudio() {
  const howlsRef        = useRef({});
  const audioCtxRef     = useRef(null);
  const buffersRef      = useRef({});
  const reverbIRRef     = useRef(null); // { ctx, ir } — IR buffer, construit une seule fois
  // Web Audio: { source, gainNode } par animal
  const activeWARef     = useRef({});
  // Howler: { id, releaseTimer } par animal
  const activeHowlRef   = useRef({});

  useEffect(() => {
    ALL_ANIMALS.forEach(animal => {
      const file = ANIMAL_META[animal].file;
      howlsRef.current[animal] = new Howl({
        src: [`/sounds/animals/${file}`],
        preload: true,
      });
    });
    return () => {
      Object.values(howlsRef.current).forEach(h => h.unload());
    };
  }, []);

  const ensureAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const loadBuffer = useCallback(async (animal) => {
    if (buffersRef.current[animal]) return buffersRef.current[animal];
    const ctx = ensureAudioContext();
    const file = ANIMAL_META[animal].file;
    const response = await fetch(`/sounds/animals/${file}`);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    buffersRef.current[animal] = audioBuffer;
    return audioBuffer;
  }, [ensureAudioContext]);

  // Stop a currently playing Web Audio note by key (chromaticIndex for pitchShift, animal for Howler)
  const stopWA = useCallback((key) => {
    const active = activeWARef.current[key];
    if (!active) return;
    const { source, gainNode, ctx, stopTimer } = active;
    clearTimeout(stopTimer);
    try {
      const now = ctx.currentTime;
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      gainNode.gain.linearRampToValueAtTime(0, now + RELEASE);
      source.stop(now + RELEASE + 0.05);
    } catch (_) {}
    activeWARef.current[key] = null;
  }, []);

  // Stop a currently playing Howler note for this animal
  const stopHowl = useCallback((animal) => {
    const active = activeHowlRef.current[animal];
    if (!active) return;
    const { howl, id, releaseTimer } = active;
    clearTimeout(releaseTimer);
    try {
      howl.fade(howl.volume(id), 0, RELEASE * 1000, id);
      setTimeout(() => howl.stop(id), RELEASE * 1000 + 50);
    } catch (_) {}
    activeHowlRef.current[animal] = null;
  }, []);

  const playNote = useCallback(async (animal, chromaticIndex, pitchShift) => {
    const meta = ANIMAL_META[animal];
    const gain   = meta.gain   ?? 1;
    const offset = meta.offset ?? 0;

    if (pitchShift) {
      // Web Audio API : nécessaire pour modifier le playbackRate (pitch).
      // Howler ne supporte pas le pitch-shift natif.
      const ctx = ensureAudioContext();
      const buffer = await loadBuffer(animal);

      // Chaque touche est une voix indépendante — on coupe uniquement la même touche
      stopWA(chromaticIndex);

      const gainNode = ctx.createGain();
      const now = ctx.currentTime;

      // Attack: 0 → gain
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(gain, now + ATTACK);
      // Hold for SUSTAIN seconds, then release
      gainNode.gain.setValueAtTime(gain, now + ATTACK + SUSTAIN);
      gainNode.gain.linearRampToValueAtTime(0, now + ATTACK + TOTAL);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = Math.pow(2, (chromaticIndex - CENTER_KEY) / 12);
      source.connect(gainNode);

      gainNode.connect(ctx.destination); // dry (toujours)

      if (meta.reverb) {
        // IR caché, conv+wetGain frais par note (pas de partage d'état)
        if (!reverbIRRef.current || reverbIRRef.current.ctx !== ctx) {
          reverbIRRef.current = { ctx, ir: buildReverbIR(ctx) };
        }
        const conv = ctx.createConvolver();
        conv.buffer = reverbIRRef.current.ir;
        const wetGain = ctx.createGain();
        wetGain.gain.value = 0.22;
        gainNode.connect(conv);
        conv.connect(wetGain);
        wetGain.connect(ctx.destination);
      }

      source.start(now, offset);
      source.stop(now + ATTACK + TOTAL + 0.05);

      // Auto-cleanup après la fin de la note
      const stopTimer = setTimeout(() => {
        if (activeWARef.current[chromaticIndex]?.source === source) {
          activeWARef.current[chromaticIndex] = null;
        }
      }, (ATTACK + TOTAL + 0.1) * 1000);

      activeWARef.current[chromaticIndex] = { source, gainNode, ctx, stopTimer };

    } else {
      // ── Howler path — natural pitch ──
      const howl = howlsRef.current[animal];
      if (!howl) return;

      stopHowl(animal);

      // Reset volume then play
      howl.volume(gain);
      const id = howl.play();
      if (offset > 0) howl.seek(offset, id);

      // Schedule release fade
      const releaseTimer = setTimeout(() => {
        try {
          howl.fade(gain, 0, RELEASE * 1000, id);
          setTimeout(() => { try { howl.stop(id); } catch (_) {} }, RELEASE * 1000 + 50);
        } catch (_) {}
        activeHowlRef.current[animal] = null;
      }, SUSTAIN * 1000);

      activeHowlRef.current[animal] = { howl, id, releaseTimer };
    }
  }, [ensureAudioContext, loadBuffer, stopWA, stopHowl]);

  return { playNote };
}
