import { useState, useEffect, useCallback, useRef } from 'react';
import { PRESETS, QWERTY_MAP, CHROMATIC_KEYS, KEY_COLORS } from './data/presets';
import { useAudio } from './hooks/useAudio';
import { useMIDI } from './hooks/useMIDI';
import PresetSelector from './components/PresetSelector';
import HeroAnimal from './components/HeroAnimal';
import PianoKeyboard from './components/PianoKeyboard';
import Mountains from './components/Mountains';
import Flowers from './components/Flowers';
import Sun from './components/Sun';

function Cloud({ style, driftDuration = '28s', driftDelay = '0s' }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        ...style,
        animation: `cloudDrift ${driftDuration} ease-in-out infinite alternate`,
        animationDelay: driftDelay,
      }}
    >
      <div className="relative">
        <div style={{ width: 90, height: 36, background: 'rgba(255,255,255,0.52)', borderRadius: 99 }} />
        <div style={{ position: 'absolute', top: -18, left: 12, width: 46, height: 46, background: 'rgba(255,255,255,0.52)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: -12, left: 42, width: 34, height: 34, background: 'rgba(255,255,255,0.52)', borderRadius: '50%' }} />
      </div>
    </div>
  );
}

function FullscreenButton() {
  const [isFs, setIsFs] = useState(false);

  useEffect(() => {
    const handler = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <button
      onClick={toggle}
      className="absolute top-3 right-3 z-50 text-white/70 hover:text-white text-xl leading-none"
      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      title={isFs ? 'Quitter plein écran' : 'Plein écran'}
    >
      {isFs ? '✕' : '⛶'}
    </button>
  );
}

export default function App() {
  const [selectedPresetId, setSelectedPresetId] = useState('zoo');
  const [activeIndexes, setActiveIndexes] = useState(new Set());
  const [lastPlayed, setLastPlayed] = useState(null);
  const [bounceKey, setBounceKey] = useState(0);
  const keyTimersRef = useRef(new Map()); // Map<keyIndex, timerId>
  const idleTimerRef = useRef(null);

  const { playNote } = useAudio();
  const currentPreset = PRESETS.find(p => p.id === selectedPresetId);

  // Reset hero when switching preset
  useEffect(() => {
    setLastPlayed(null);
    setActiveIndexes(new Set());
    keyTimersRef.current.forEach(clearTimeout);
    keyTimersRef.current.clear();
    clearTimeout(idleTimerRef.current);
  }, [selectedPresetId]);

  const handlePlay = useCallback((keyIndex) => {
    const animal = currentPreset.animals[keyIndex];
    const pitchShift = currentPreset.pitchShift ?? false;
    playNote(animal, keyIndex, pitchShift);

    const noteLabel = pitchShift
      ? CHROMATIC_KEYS[keyIndex % 12]
      : null;
    const color = KEY_COLORS[keyIndex];

    setLastPlayed({ animal, noteLabel, color });
    setBounceKey(k => k + 1);

    // Reset idle timer on each play
    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => setLastPlayed(null), 5000);

    // Feedback visuel polyphonique : ajouter la touche, retirer après 700 ms
    const prev = keyTimersRef.current.get(keyIndex);
    if (prev) clearTimeout(prev);
    setActiveIndexes(s => new Set([...s, keyIndex]));
    const t = setTimeout(() => {
      setActiveIndexes(s => { const n = new Set(s); n.delete(keyIndex); return n; });
      keyTimersRef.current.delete(keyIndex);
    }, 700);
    keyTimersRef.current.set(keyIndex, t);
  }, [currentPreset, playNote]);

  // QWERTY keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      const key = e.key.toLowerCase();
      if (key in QWERTY_MAP) {
        e.preventDefault();
        handlePlay(QWERTY_MAP[key]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlay]);

  useMIDI(handlePlay);

  return (
    <div
      className="flex flex-col font-fredoka select-none overflow-hidden relative"
      style={{ height: '100dvh', background: 'linear-gradient(170deg, #4BBDE8 0%, #87CEEB 45%, #C9E8FF 100%)' }}
    >
      <FullscreenButton />

      {/* Soleil */}
      <Sun />

      {/* Cloud decorations */}
      <Cloud style={{ top: 18, left: '5%' }} driftDuration="32s" driftDelay="0s" />
      <Cloud style={{ top: 55, right: '8%', transform: 'scale(0.75)' }} driftDuration="24s" driftDelay="-8s" />
      <Cloud style={{ top: 130, left: '55%', transform: 'scale(0.6)', opacity: 0.7 }} driftDuration="20s" driftDelay="-14s" />

      {/* Header */}
      <header className="text-center px-4 pt-3 pb-1 relative z-10">
        <h1 className="text-4xl font-bold text-white drop-shadow-md leading-tight">
          🎹 Animuse
        </h1>
      </header>

      {/* Preset selector */}
      <div className="relative z-10 py-1">
        <PresetSelector
          selectedId={selectedPresetId}
          onSelect={setSelectedPresetId}
        />
      </div>

      {/* Hero animal — main display */}
      <HeroAnimal
        lastPlayed={lastPlayed}
        isActive={activeIndexes.size > 0}
        bounceKey={bounceKey}
      />

      {/* Mountains + keyboard — toujours devant l'animation hero */}
      <div className="relative" style={{ zIndex: 20, flexShrink: 0 }}>
        <div style={{ height: 55, position: 'relative' }}>
          <Mountains />
        </div>

        {/* Grass + flowers */}
        <div className="relative" style={{ zIndex: 3 }}>
          <div className="grass" />
          <div className="relative" style={{ background: 'linear-gradient(180deg, #3CB93C 0%, #2ea02e 100%)', paddingBottom: 4 }}>
            {/* Flowers on grass edge */}
            <div className="absolute inset-x-0" style={{ top: -18, height: 36 }}>
              <Flowers />
            </div>
            <PianoKeyboard
              animals={currentPreset.animals}
              activeIndexes={activeIndexes}
              onPlay={handlePlay}
            />
            <p className="text-center text-white/60 text-xs mt-1 pb-2">
              MIDI Do2–Do5 · QWERTY octave 3 (A W S E D…) · Clic
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
