import { ANIMAL_META } from '../data/presets';
import AnimalLottie from './AnimalLottie';

const IDLE_ANIMALS = ['cat', 'dog', 'cow', 'frog', 'lion', 'fox'];
const NOTES = ['♪', '♫', '♩', '♬'];

const LOTTIE_SIZE = 'clamp(180px, 30vh, 280px)';

function ActiveAnimal({ lastPlayed, isActive, bounceKey }) {
  const { animal, noteLabel, color } = lastPlayed;
  const meta = ANIMAL_META[animal];
  const note = NOTES[bounceKey % NOTES.length];

  return (
    <>
      {/* Note musicale flottante — nouvelle instance par bounceKey pour rejouer l'animation */}
      {isActive && (
        <span
          key={`note-${bounceKey}`}
          className="absolute text-4xl text-white/80 font-bold pointer-events-none"
          style={{ top: '10%', right: '18%', animation: 'floatUp 1.2s ease-out forwards' }}
        >
          {note}
        </span>
      )}

      {/* Animal Lottie animé — emoji statique pour le piano (pas de Lottie dispo) */}
      <div
        className="flex items-center justify-center rounded-[2rem] mb-3"
        style={{
          width: LOTTIE_SIZE,
          height: LOTTIE_SIZE,
          backgroundColor: color + (isActive ? '55' : '22'),
          boxShadow: isActive
            ? `0 0 60px ${color}88, 0 6px 24px rgba(0,0,0,0.12)`
            : '0 4px 14px rgba(0,0,0,0.07)',
          transition: 'background-color 0.3s, box-shadow 0.4s',
        }}
      >
        {animal === 'piano' ? (
          <span
            style={{
              fontSize: 'clamp(72px, 14vh, 110px)',
              lineHeight: 1,
              filter: isActive ? 'drop-shadow(0 0 18px rgba(255,255,255,0.7))' : 'none',
              transition: 'filter 0.2s',
            }}
          >
            🎹
          </span>
        ) : (
          <AnimalLottie animal={animal} isActive={isActive} bounceKey={bounceKey} fill />
        )}
      </div>

      {/* Nom de l'animal + note solfège si preset pitch-shifté */}
      {noteLabel ? (
        <div className="text-center leading-tight">
          <p className="font-fredoka font-bold text-white drop-shadow-lg" style={{ fontSize: 'clamp(36px, 7vh, 54px)' }}>{noteLabel}</p>
          <p className="font-fredoka text-white/85" style={{ fontSize: 'clamp(18px, 3vh, 24px)' }}>{meta.label}</p>
        </div>
      ) : (
        <p className="font-fredoka font-bold text-white drop-shadow-lg" style={{ fontSize: 'clamp(32px, 6vh, 48px)' }}>{meta.label}</p>
      )}
    </>
  );
}

export default function HeroAnimal({ lastPlayed, isActive, bounceKey }) {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center relative"
      style={{ minHeight: 0, isolation: 'isolate' }}
    >
      {!lastPlayed ? (
        /* ── État initial : 6 petits animaux Lottie ── */
        <>
          <div className="flex gap-4 flex-wrap justify-center px-6 mb-6">
            {IDLE_ANIMALS.map((animal, i) => (
              <div
                key={animal}
                style={{
                  animation: 'bounce 1.4s ease-in-out infinite',
                  animationDelay: `${i * 0.2}s`,
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))',
                }}
              >
                <AnimalLottie animal={animal} isActive={false} bounceKey={0} size={100} />
              </div>
            ))}
          </div>
          <p
            className="text-white font-fredoka font-bold drop-shadow"
            style={{ fontSize: 'clamp(28px, 5vh, 42px)', textShadow: '0 2px 10px rgba(0,81,168,0.35)' }}
          >
            Joue une note ! 🎵
          </p>
        </>
      ) : (
        /* ── Animal actif / dernier joué ── */
        <ActiveAnimal lastPlayed={lastPlayed} isActive={isActive} bounceKey={bounceKey} />
      )}
    </div>
  );
}
