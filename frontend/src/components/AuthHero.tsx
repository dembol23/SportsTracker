import { ReactNode } from 'react';
import ArchitectureArt from './ArchitectureArt';

interface AuthHeroProps {
  currentLabel: string;
  otherLabel: string;
  onSwitch: () => void;
  headline: string[];
  eyebrow: string;
  subtitle: string;
  children: ReactNode;
  align?: 'left' | 'right';
}

export default function AuthHero({
  currentLabel,
  otherLabel,
  onSwitch,
  headline,
  eyebrow,
  subtitle,
  children,
  align = 'left',
}: AuthHeroProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden flex flex-col">
      <div className="absolute inset-0">
        <ArchitectureArt />
      </div>

      <div
        className={`absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent 
                    transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] 
                    ${align === 'left' ? 'opacity-100' : 'opacity-0'}`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent 
                    transition-opacity duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] 
                    ${align === 'right' ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/30" />

      <div className="relative z-10 w-full px-6 md:px-12 py-7 flex items-center justify-between gap-6 flex-wrap">
        <span
          className="text-white text-xl uppercase tracking-tight"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontStyle: 'italic' }}
        >
          SportsTracker
        </span>

        <nav className="flex items-center gap-8 text-xs tracking-[0.18em]">
          <span className="text-white">{currentLabel}</span>
          <button
            onClick={onSwitch}
            className="text-[#7a7a7a] hover:text-white transition-colors"
          >
            {otherLabel}
          </button>
        </nav>
      </div>

      <div className="relative z-10 flex-1 w-full flex flex-col md:block pb-10">

        <div
          className={`relative md:absolute md:top-1/2 md:-translate-y-1/2 w-full md:w-1/2 px-6 mt-6 md:mt-0
            transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${align === 'left' ? 'md:translate-x-full' : 'md:translate-x-0'}
          `}
        >
          <div className="max-w-lg mx-auto">
            <h1
              className="text-white text-5xl md:text-6xl lg:text-7xl italic leading-[1.08]"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {headline.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h1>
          </div>
        </div>

        <div
          className={`relative md:absolute md:top-1/2 md:-translate-y-1/2 w-full md:w-1/2 px-6 mt-12 md:mt-0
            transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${align === 'left' ? 'md:translate-x-0' : 'md:translate-x-full'}
          `}
        >
          <div className="max-w-sm mx-auto">
            <p className="text-[#9a9a9a] text-xs uppercase tracking-[0.18em] mb-3">
              {eyebrow || '\u00A0'}
            </p>
            <p className="text-[#d4d4d4] text-sm leading-relaxed mb-6">{subtitle}</p>
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}