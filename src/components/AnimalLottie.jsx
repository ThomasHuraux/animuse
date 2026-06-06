import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import { ANIMAL_META } from '../data/presets';

export default function AnimalLottie({ animal, isActive, bounceKey, size = 150, fill = false }) {
  const containerRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    let destroyed = false;
    fetch(`/animations/animals/${animal}.json`)
      .then(r => r.json())
      .then(data => {
        if (destroyed || !containerRef.current) return;
        animRef.current?.destroy();
        animRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: data,
          rendererSettings: { preserveAspectRatio: 'xMidYMid meet' },
        });
        // Force SVG to fill container
        const svg = containerRef.current.querySelector('svg');
        if (svg) { svg.style.width = '100%'; svg.style.height = '100%'; }
      });
    return () => {
      destroyed = true;
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, [animal]);

  // Re-trigger on each note play
  useEffect(() => {
    if (isActive && animRef.current) {
      animRef.current.goToAndPlay(0, true);
    }
  }, [bounceKey, isActive]);

  return (
    <div
      ref={containerRef}
      className="lottie-wrap"
      style={fill
        ? { width: '100%', height: '100%', overflow: 'hidden' }
        : { width: size, height: size, overflow: 'hidden' }}
      aria-label={ANIMAL_META[animal]?.label}
    />
  );
}
