import AnimalCard from './AnimalCard';
import { KEY_COLORS, CHROMATIC_KEYS } from '../data/presets';

export default function AnimalStage({ animals, activeIndex, pitchShift }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 px-4 py-2">
      {animals.map((animal, i) => (
        <AnimalCard
          key={`${animal}-${i}`}
          animal={animal}
          isActive={activeIndex === i}
          color={KEY_COLORS[i]}
          noteLabel={pitchShift ? CHROMATIC_KEYS[i] : null}
        />
      ))}
    </div>
  );
}
