// Bluey-style rounded mountains — 3 layers for depth
export default function Mountains() {
  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 1 }}>
      <svg
        viewBox="0 0 800 160"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: 160 }}
        aria-hidden="true"
      >
        {/* Back mountains — pale blue-lavender, very rounded */}
        <path
          d="M0,160 L0,100 Q100,35 200,70 Q290,100 370,40 Q450,-5 530,45 Q600,85 680,30 Q740,0 800,45 L800,160 Z"
          fill="#C5D8F0"
        />
        {/* Far mountains — soft lavender */}
        <path
          d="M0,160 L0,110 Q60,50 140,80 Q200,105 260,60 Q330,20 410,65 Q470,100 540,50 Q610,15 680,55 Q740,82 800,65 L800,160 Z"
          fill="#C9A8E0"
        />
        {/* Mid mountains — medium purple */}
        <path
          d="M0,160 L0,125 Q80,72 170,100 Q250,125 340,82 Q410,48 490,88 Q560,118 640,76 Q710,42 800,88 L800,160 Z"
          fill="#9B6EC0"
        />
        {/* Ground cover — blend with grass */}
        <path
          d="M0,160 L0,150 Q200,138 400,144 Q600,150 800,140 L800,160 Z"
          fill="#3CB93C"
        />
      </svg>
    </div>
  );
}
