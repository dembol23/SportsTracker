export type DateMode = 'all' | 'month';

interface DashboardFiltersProps {
    dateMode: DateMode;
    onDateModeChange: (mode: DateMode) => void;
    selectedMonth: Date;
    onShiftMonth: (delta: number) => void;
    canGoForward: boolean;
    sportTypes: string[];
    visibleSports: Record<string, boolean>;
    onToggleSport: (type: string) => void;
    onResetSports: () => void;
}

const SPORT_META: Record<string, { icon: string; label: string }> = {
    Run: { icon: '🏃', label: 'Bieganie' },
    Ride: { icon: '🚴', label: 'Rower' },
    VirtualRide: { icon: '🚴', label: 'Rower (wirt.)' },
    VirtualRun: { icon: '🏃', label: 'Bieg (wirt.)' },
    Swim: { icon: '🏊', label: 'Pływanie' },
    Walk: { icon: '🚶', label: 'Spacer' },
    Hike: { icon: '🥾', label: 'Wędrówka' },
    AlpineSki: { icon: '⛷', label: 'Narty' },
    NordicSki: { icon: '🎿', label: 'Biegówki' },
    Kayaking: { icon: '🛶', label: 'Kajak' },
    Other: { icon: '🏅', label: 'Inne' },
};

function sportMeta(type: string) {
    return SPORT_META[type] ?? { icon: '🏅', label: type };
}

export const MONTH_FORMATTER = new Intl.DateTimeFormat('en-EN', { month: 'long', year: 'numeric' });

const periodPill = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all border ${active ? 'bg-white text-black border-white' : 'border-white/15 text-[#9a9a9a] hover:text-white'
    }`;

export default function DashboardFilters({
    dateMode,
    onDateModeChange,
    selectedMonth,
    onShiftMonth,
    canGoForward,
    sportTypes,
    visibleSports,
    onToggleSport,
    onResetSports,
}: DashboardFiltersProps) {
    const anyHidden = sportTypes.some((t) => visibleSports[t] === false);

    return (
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[#7a7a7a] text-[11px] font-mono uppercase tracking-widest mr-1">Period</span>

                <button onClick={() => onDateModeChange('all')} className={periodPill(dateMode === 'all')}>
                    All-time
                </button>
                <button onClick={() => onDateModeChange('month')} className={periodPill(dateMode === 'month')}>
                    Month
                </button>

                {dateMode === 'month' && (
                    <div className="flex items-center gap-1 ml-1">
                        <button
                            onClick={() => onShiftMonth(-1)}
                            className="w-7 h-7 rounded-full border border-white/15 text-[#9a9a9a] hover:text-white
                         hover:border-white/40 flex items-center justify-center transition-colors"
                            aria-label="Previous month"
                        >
                            ‹
                        </button>
                        <span className="text-white text-xs font-mono uppercase tracking-widest px-2 min-w-[150px] text-center">
                            {MONTH_FORMATTER.format(selectedMonth)}
                        </span>
                        <button
                            onClick={() => onShiftMonth(1)}
                            disabled={!canGoForward}
                            className="w-7 h-7 rounded-full border border-white/15 text-[#9a9a9a] hover:text-white
                         hover:border-white/40 flex items-center justify-center transition-colors
                         disabled:opacity-30 disabled:hover:text-[#9a9a9a] disabled:hover:border-white/15"
                            aria-label="Next month"
                        >
                            ›
                        </button>
                    </div>
                )}
            </div>

            {sportTypes.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[#7a7a7a] text-[11px] font-mono uppercase tracking-widest mr-1">Activity</span>
                    {sportTypes.map((type) => {
                        const meta = sportMeta(type);
                        const active = visibleSports[type] !== false;
                        return (
                            <button
                                key={type}
                                onClick={() => onToggleSport(type)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all border ${active
                                    ? 'bg-white text-black border-white'
                                    : 'border-white/15 text-[#7a7a7a] hover:text-white'
                                    }`}
                            >
                                <span>{meta.icon}</span>
                                {meta.label}
                            </button>
                        );
                    })}
                    {anyHidden && (
                        <button
                            onClick={onResetSports}
                            className="text-[#7a7a7a] hover:text-white text-xs font-mono underline underline-offset-2 transition-colors"
                        >
                            Select all
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}