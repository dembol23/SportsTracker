interface ArchitectureArtProps {
    className?: string;
}

const VP = { x: 640, y: 90 };

function fanLines(originPoints: [number, number][], opacity: number) {
    return originPoints.map(([x, y], i) => (
        <line
            key={i}
            x1={x}
            y1={y}
            x2={VP.x}
            y2={VP.y}
            stroke="#ffffff"
            strokeWidth="1"
            opacity={opacity}
        />
    ));
}

const EDGE_A: [number, number][] = Array.from({ length: 10 }, (_, i) => [380 + i * 64, 1000]);
const EDGE_B: [number, number][] = Array.from({ length: 8 }, (_, i) => [1000, 120 + i * 110]);
const EDGE_C: [number, number][] = Array.from({ length: 6 }, (_, i) => [620 + i * 30, 0]);

export default function ArchitectureArt({ className = '' }: ArchitectureArtProps) {
    return (
        <svg
            viewBox="0 0 1000 1000"
            preserveAspectRatio="xMidYMid slice"
            className={`w-full h-full ${className}`}
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="aa-sky" x1="0" y1="0" x2="1" y2="0.3">
                    <stop offset="0%" stopColor="#070707" />
                    <stop offset="45%" stopColor="#101010" />
                    <stop offset="100%" stopColor="#262626" />
                </linearGradient>
                <radialGradient id="aa-vp-glow" cx={`${VP.x / 10}%`} cy={`${VP.y / 10}%`} r="40%">
                    <stop offset="0%" stopColor="#cfcfcf" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#cfcfcf" stopOpacity="0" />
                </radialGradient>
            </defs>

            <rect width="1000" height="1000" fill="url(#aa-sky)" />

            <polygon points="380,1000 700,1000 640,90 460,140" fill="#141414" />
            <polygon points="700,1000 1000,1000 1000,400 640,90" fill="#1c1c1c" />
            <polygon points="1000,400 1000,0 640,90" fill="#262626" />
            <polygon points="460,140 640,90 560,40 420,70" fill="#0e0e0e" />

            <rect width="1000" height="1000" fill="url(#aa-vp-glow)" />

            <g>{fanLines(EDGE_A, 0.16)}</g>
            <g>{fanLines(EDGE_B, 0.14)}</g>
            <g>{fanLines(EDGE_C, 0.2)}</g>

            <g stroke="#e5e5e5" strokeWidth="1.2" fill="none" opacity="0.5">
                <ellipse cx={VP.x} cy={VP.y} rx="70" ry="26" />
                <ellipse cx={VP.x} cy={VP.y} rx="46" ry="17" />
                <ellipse cx={VP.x} cy={VP.y} rx="22" ry="8" />
            </g>

            <rect width="1000" height="1000" fill="#050505" opacity="0.25" />
        </svg>
    );
}