// Soleil rayonnant décoratif — coin haut-gauche
export default function Sun() {
  return (
    <div
      className="absolute pointer-events-none"
      style={{ top: -40, left: -40, width: 220, height: 220, zIndex: 1 }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 220 220" style={{ width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF4B8" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#FFE066" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FFD93D" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sunCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9DB" />
            <stop offset="70%" stopColor="#FFE066" />
            <stop offset="100%" stopColor="#FFC93D" />
          </radialGradient>
        </defs>

        {/* Halo doux */}
        <circle cx="110" cy="110" r="105" fill="url(#sunGlow)">
          <animate attributeName="r" values="100;108;100" dur="6s" repeatCount="indefinite" />
        </circle>

        {/* Rayons tournants */}
        <g style={{ transformOrigin: '110px 110px', animation: 'sunSpin 40s linear infinite' }}>
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i * 360) / 10;
            return (
              <rect
                key={i}
                x="107"
                y="18"
                width="6"
                height="34"
                rx="3"
                fill="#FFE066"
                opacity="0.55"
                transform={`rotate(${angle} 110 110)`}
              />
            );
          })}
        </g>

        {/* Cœur du soleil */}
        <circle cx="110" cy="110" r="52" fill="url(#sunCore)" />

        {/* Petit sourire */}
        <circle cx="93" cy="103" r="4" fill="#FF8A3D" />
        <circle cx="127" cy="103" r="4" fill="#FF8A3D" />
        <path
          d="M 92 122 Q 110 138 128 122"
          stroke="#FF8A3D"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
