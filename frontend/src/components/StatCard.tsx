interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: string;
  accent?: boolean;
}

export default function StatCard({ label, value, unit, icon, accent = false }: StatCardProps) {
  return (
    <div className={`bg-[#1A1D27] border rounded-xl p-5 flex flex-col gap-3
                     ${accent ? 'border-[#FC4C02]/40' : 'border-[#2D3142]'}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-[#6B7280]">{label}</span>
        <span className="text-lg">{icon}</span>
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
