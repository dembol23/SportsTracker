interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: string;
  accent?: boolean;
}

export default function StatCard({ label, value, unit, icon, accent = false }: StatCardProps) {
  return (
    <div
      className={`bg-[#121212] border rounded-2xl p-5 flex flex-col gap-4 transition-colors
                 ${accent ? 'border-white/25 shadow-[0_0_30px_-14px_rgba(255,255,255,0.35)]' : 'border-white/10'}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-[#7a7a7a]">{label}</span>
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-base
                     ${accent ? 'bg-white/10' : 'bg-black/30 border border-white/10'}`}
        >
          {icon}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold font-mono text-white">{value}</span>
        {unit && <span className="text-xs text-[#7a7a7a] font-mono">{unit}</span>}
      </div>
    </div>
  );
}