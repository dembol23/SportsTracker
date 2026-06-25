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
      className={`bg-[#1A1D27] border rounded-2xl p-5 flex flex-col gap-4 transition-colors
                 ${accent ? 'border-[#FC4C02]/40 shadow-[0_0_30px_-12px_#FC4C02]' : 'border-[#2D3142]'}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6B7280]">{label}</span>
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-base
                     ${accent ? 'bg-[#FC4C02]/15' : 'bg-[#0F1117] border border-[#2D3142]'}`}
        >
          {icon}
        </span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-3xl font-bold font-mono ${accent ? 'text-[#FC4C02]' : 'text-white'}`}>
          {value}
        </span>
        {unit && <span className="text-xs text-[#4B5563] font-mono">{unit}</span>}
      </div>
    </div>
  );
}