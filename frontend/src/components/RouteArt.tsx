// Signature visual element for Trackmaps.
// A dark "night trail" scene: distant ridgelines + a glowing GPS route line,
// the same orange used for "Run" polylines on the actual map. Pure SVG —
// no external photos, so it's free, fast, and always renders the same way.

interface RouteArtProps {
  className?: string;
}

const STAR_POSITIONS: [number, number, number, number][] = [
  [60, 80, 0.6, 1.4], [150, 40, 0.4, 1], [260, 110, 0.5, 1.2], [340, 60, 0.3, 1],
  [420, 130, 0.6, 1.6], [510, 50, 0.4, 1], [600, 90, 0.5, 1.3], [700, 40, 0.3, 1],
  [790, 70, 0.6, 1.5], [860, 120, 0.4, 1], [920, 50, 0.5, 1.2], [980, 90, 0.3, 1],
  [40, 150, 0.3, 1], [130, 190, 0.4, 1.1], [220, 160, 0.3, 1], [310, 200, 0.5, 1.3],
  [400, 170, 0.3, 1], [480, 210, 0.4, 1], [570, 160, 0.3, 1], [650, 200, 0.5, 1.2],
  [740, 170, 0.3, 1], [820, 210, 0.4, 1], [900, 160, 0.3, 1], [960, 200, 0.4, 1.1],
];

export default function RouteArt({ className = '' }: RouteArtProps) {
  return (
    <svg
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
      className={`w-full h-full ${className}`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="ta-glow" cx="72%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#1c2747" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0F1117" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ta-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F1117" />
          <stop offset="100%" stopColor="#12141d" />
        </linearGradient>
        <filter id="ta-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1000" height="1000" fill="url(#ta-sky)" />
      <rect width="1000" height="1000" fill="url(#ta-glow)" />

      {/* stars */}
      <g fill="#ffffff">
        {STAR_POSITIONS.map(([x, y, o, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} opacity={o} />
        ))}
      </g>

      {/* subtle elevation-grid arcs */}
      <g stroke="#222740" strokeWidth="1.5" fill="none" opacity="0.5">
        <path d="M40,180 Q 500,120 960,200" />
        <path d="M60,260 Q 500,200 940,270" />
      </g>

      {/* distant ridge */}
      <path
        d="M0,560 L90,610 200,540 310,600 430,520 540,590 660,510 780,580 880,530 1000,570 L1000,1000 0,1000 Z"
        fill="#171b29"
      />
      {/* near ridge */}
      <path
        d="M0,700 L120,660 240,720 360,650 480,710 600,640 720,705 840,660 1000,700 L1000,1000 0,1000 Z"
        fill="#0c0e15"
      />

      {/* the route */}
      <g>
        <path
          d="M130,840 C220,760 260,700 230,640 C200,570 320,560 360,500 C400,440 480,460 510,400 C540,340 640,360 670,300 C700,250 760,260 800,200"
          fill="none"
          stroke="#FC4C02"
          strokeWidth="5"
          strokeLinecap="round"
          filter="url(#ta-blur)"
          opacity="0.9"
        />
        <path
          d="M130,840 C220,760 260,700 230,640 C200,570 320,560 360,500 C400,440 480,460 510,400 C540,340 640,360 670,300 C700,250 760,260 800,200"
          fill="none"
          stroke="#ffd9c2"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.85"
        />
        <circle cx="130" cy="840" r="7" fill="#0F1117" stroke="#FC4C02" strokeWidth="3" />
        <circle cx="800" cy="200" r="6" fill="#FC4C02" />
        <circle cx="800" cy="200" r="6" fill="#FC4C02" className="ta-pulse" />
      </g>

      <style>{`
        .ta-pulse {
          transform-origin: 800px 200px;
          animation: ta-pulse 2.4s ease-out infinite;
        }
        @keyframes ta-pulse {
          0% { r: 6; opacity: 0.9; }
          70% { r: 24; opacity: 0; }
          100% { r: 24; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ta-pulse { animation: none; }
        }
      `}</style>
    </svg>
  );
}