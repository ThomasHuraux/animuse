import { PRESETS } from '../data/presets';

export default function PresetSelector({ selectedId, onSelect }) {
  return (
    <div className="flex justify-center gap-3 overflow-x-auto pb-2 px-4 snap-x snap-mandatory scrollbar-hide">
      {PRESETS.map(preset => (
        <button
          key={preset.id}
          onClick={() => onSelect(preset.id)}
          className={`snap-start shrink-0 flex flex-col items-center gap-1 px-5 py-2.5 rounded-2xl font-fredoka transition-all duration-200 select-none
            ${selectedId === preset.id
              ? 'bg-white text-[#0051A8] scale-110 border-[3px] border-yellow-300'
              : 'bg-white/30 text-white border-2 border-white/40 hover:bg-white/50 active:scale-95'
            }`}
          style={selectedId === preset.id
            ? { boxShadow: '0 6px 24px rgba(0,81,168,0.35), 0 0 0 4px rgba(255,220,50,0.35)' }
            : {}}
        >
          <span className="text-3xl leading-none">{preset.emoji}</span>
          <span className="text-sm leading-tight">{preset.name}</span>
        </button>
      ))}
    </div>
  );
}
