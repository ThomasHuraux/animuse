// Petites fleurs SVG sur le gazon
const FLOWERS = [
  { left: '12%', bottom: 2,  color: '#FFD93D', r: 5 },
  { left: '47%', bottom: 5,  color: '#FF6B9D', r: 4 },
  { left: '78%', bottom: 1,  color: '#FFFFFF',  r: 4.5 },
];

function Flower({ color, r }) {
  const angles = [0, 60, 120, 180, 240, 300];
  const d = r * 1.8; // distance pétale depuis centre
  return (
    <svg width={r * 8} height={r * 8} viewBox={`${-r*4} ${-r*4} ${r*8} ${r*8}`} overflow="visible">
      {/* Pétales */}
      {angles.map(a => {
        const rad = (a * Math.PI) / 180;
        return (
          <circle
            key={a}
            cx={Math.cos(rad) * d}
            cy={Math.sin(rad) * d}
            r={r * 0.9}
            fill={color}
            opacity={0.92}
          />
        );
      })}
      {/* Centre jaune */}
      <circle cx={0} cy={0} r={r * 0.75} fill="#FFD93D" />
    </svg>
  );
}

export default function Flowers() {
  return (
    <>
      {FLOWERS.map(({ left, bottom, color, r }, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{ left, bottom, transform: 'translateX(-50%)' }}
        >
          <Flower color={color} r={r} />
          {/* Tige */}
          <div style={{ width: 2, height: 10, background: '#1e8c1e', margin: '0 auto' }} />
        </div>
      ))}
    </>
  );
}
