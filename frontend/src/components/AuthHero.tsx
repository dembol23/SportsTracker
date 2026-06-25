import { ReactNode } from 'react';
import RouteArt from './RouteArt';

interface AuthHeroProps {
  eyebrow: string;
  title: string;
  accent: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthHero({ title, accent, subtitle, children, footer }: AuthHeroProps) {
  return (
    <div className="min-h-screen bg-[#0F1117] relative overflow-hidden flex items-center">
      <div className="hidden sm:block absolute inset-y-0 right-[-15%] w-[75%] md:w-[60%]">
        <RouteArt />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F1117] via-[#0F1117]/75 to-transparent" />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 py-12">
        <div className="flex items-center gap-2 mb-12">
          <span className="text-[#FC4C02] text-2xl">⬡</span>
          <span
            className="text-white font-bold tracking-widest uppercase text-sm"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            SportsTracker
          </span>
        </div>

        <div className="max-w-xl">
          <h1
            className="text-white text-4xl md:text-5xl leading-[1.1] font-bold mb-5"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {title}{' '}
            <span
              className="italic font-normal text-[#FC4C02]"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {accent}
            </span>
          </h1>

          <p className="text-[#9CA3AF] text-base mb-8 leading-relaxed">{subtitle}</p>

          <div className="bg-[#1A1D27]/80 backdrop-blur-xl border border-[#2D3142] rounded-3xl p-6 md:p-7 shadow-2xl shadow-black/40">
            {children}
            <div className="mt-6 pt-5 border-t border-white/5 text-center">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}