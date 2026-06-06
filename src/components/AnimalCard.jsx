import { useRef, useEffect, useState } from 'react';
import { ANIMAL_META } from '../data/presets';

export default function AnimalCard({ animal, isActive, color, noteLabel = null, small = false }) {
  const meta = ANIMAL_META[animal];
  const [bounceKey, setBounceKey] = useState(0);
  const prevActiveRef = useRef(false);

  // Re-trigger animation even if same animal plays twice in a row
  useEffect(() => {
    if (isActive && !prevActiveRef.current) {
      setBounceKey(k => k + 1);
    }
    prevActiveRef.current = isActive;
  }, [isActive]);

  const size = small ? 'w-14 h-14 text-4xl' : 'w-20 h-20 text-5xl';
  const labelSize = small ? 'text-xs' : 'text-sm';

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        key={bounceKey}
        className={`${size} flex items-center justify-center rounded-2xl transition-all duration-150 select-none
          ${isActive ? 'animal-bounce scale-110' : 'scale-100'}`}
        style={{
          backgroundColor: color + (isActive ? '55' : '22'),
          boxShadow: isActive ? `0 0 20px ${color}88` : 'none',
        }}
      >
        <span role="img" aria-label={meta.label}>{meta.emoji}</span>
      </div>
      {noteLabel ? (
        <div className="flex flex-col items-center leading-tight">
          <span className={`${labelSize} font-fredoka text-[#0051A8] font-bold`}>{noteLabel}</span>
          <span className="text-[10px] font-fredoka text-[#0051A8]/60">{meta.label}</span>
        </div>
      ) : (
        <span className={`${labelSize} font-fredoka text-[#0051A8] font-bold leading-tight`}>
          {meta.label}
        </span>
      )}
    </div>
  );
}
