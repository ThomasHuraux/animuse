import { useState, useCallback } from 'react';
import { ANIMAL_META, KEY_COLORS, INDEX_TO_QWERTY, NUM_KEYS } from '../data/presets';

const WHITE_W = 38;   // px per white key (was 34)
const GAP     = 2;
const BLACK_W = 24;   // px black key width (was 22)
const HEIGHT  = 120;  // px total keyboard height

const WHITE_CHROMATIC = new Set([0, 2, 4, 5, 7, 9, 11]);

let wCount = 0;
const KEY_LAYOUT = Array.from({ length: NUM_KEYS }, (_, i) => {
  const chr = i % 12;
  const isBlack = !WHITE_CHROMATIC.has(chr);
  if (!isBlack) {
    return { absIndex: i, chr, isBlack: false, whitePos: wCount++ };
  } else {
    return { absIndex: i, chr, isBlack: true, afterWhite: wCount - 1 };
  }
});

const WHITE_KEYS  = KEY_LAYOUT.filter(k => !k.isBlack);
const BLACK_KEYS  = KEY_LAYOUT.filter(k => k.isBlack);
const TOTAL_WIDTH = wCount * (WHITE_W + GAP) - GAP;

function blackKeyLeft(afterWhite) {
  return afterWhite * (WHITE_W + GAP) + WHITE_W + 1 - BLACK_W / 2;
}

// Halo animation pour feedback tap
function KeyHalo({ color, id }) {
  return (
    <span
      key={id}
      className="absolute inset-0 rounded-xl pointer-events-none"
      style={{
        background: `radial-gradient(circle, ${color}99 0%, transparent 70%)`,
        animation: 'keyHalo 0.5s ease-out forwards',
      }}
    />
  );
}

export default function PianoKeyboard({ animals, activeIndexes = new Set(), onPlay }) {
  const [haloKey, setHaloKey] = useState({ index: null, id: 0 });

  const handleInteract = useCallback((e, index) => {
    e.preventDefault();
    onPlay(index);
    setHaloKey(prev => ({ index, id: prev.id + 1 }));
  }, [onPlay]);

  return (
    <div className="px-2 py-2 overflow-x-auto">
      <div
        className="relative rounded-2xl mx-auto"
        style={{ width: TOTAL_WIDTH, height: HEIGHT }}
      >
        {/* White keys */}
        {WHITE_KEYS.map(({ absIndex, whitePos }) => {
          const animal = animals[absIndex];
          const meta = ANIMAL_META[animal];
          const isActive = activeIndexes.has(absIndex);
          const color = KEY_COLORS[absIndex];
          const showHalo = haloKey.index === absIndex;

          return (
            <button
              key={absIndex}
              onMouseDown={(e) => handleInteract(e, absIndex)}
              onTouchStart={(e) => handleInteract(e, absIndex)}
              className="absolute flex flex-col items-center justify-end pb-1 rounded-xl select-none cursor-pointer transition-all duration-75 overflow-hidden"
              style={{
                left: whitePos * (WHITE_W + GAP),
                width: WHITE_W,
                top: 0,
                bottom: 0,
                backgroundColor: isActive ? color : '#fffdf0',
                boxShadow: isActive
                  ? `0 0 18px ${color}cc, inset 0 -3px 0 rgba(0,0,0,0.15)`
                  : 'inset 0 -4px 0 rgba(0,0,0,0.1)',
                transform: isActive ? 'translateY(2px) scale(0.97)' : 'none',
              }}
            >
              {showHalo && <KeyHalo color={color} id={haloKey.id} />}
              {/* Do label uniquement sur les Do */}
              {absIndex % 12 === 0 && (
                <span
                  className="absolute top-1 left-0 right-0 text-center font-fredoka font-bold leading-none"
                  style={{ fontSize: 7, color: isActive ? 'white' : '#0051A8bb' }}
                >
                  Do{Math.floor(absIndex / 12) + 2}
                </span>
              )}
              <span style={{ fontSize: 18, lineHeight: 1 }}>{meta.emoji}</span>
            </button>
          );
        })}

        {/* Black keys */}
        {BLACK_KEYS.map(({ absIndex, afterWhite }) => {
          const animal = animals[absIndex];
          const meta = ANIMAL_META[animal];
          const isActive = activeIndexes.has(absIndex);
          const color = KEY_COLORS[absIndex];
          const showHalo = haloKey.index === absIndex;

          return (
            <button
              key={absIndex}
              onMouseDown={(e) => handleInteract(e, absIndex)}
              onTouchStart={(e) => handleInteract(e, absIndex)}
              className="absolute flex flex-col items-center justify-center rounded-b-xl select-none cursor-pointer transition-all duration-75 z-10 overflow-hidden"
              style={{
                left: blackKeyLeft(afterWhite),
                width: BLACK_W,
                top: 0,
                height: '62%',
                backgroundColor: isActive ? color : '#1a1a2e',
                boxShadow: isActive
                  ? `0 0 18px ${color}, 0 3px 0 rgba(0,0,0,0.4)`
                  : '0 3px 0 rgba(0,0,0,0.4)',
                transform: isActive ? 'translateY(2px)' : 'none',
              }}
            >
              {showHalo && <KeyHalo color={color} id={haloKey.id} />}
              <span style={{ fontSize: 13, lineHeight: 1 }}>{meta.emoji}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
