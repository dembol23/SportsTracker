import { useMemo, useState } from 'react';
import { Activity } from '../types';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import ActivityItem from '../components/ActivityItem';
import ArchitectureArt from '../components/ArchitectureArt';
import ArrowButton from '../components/ArrowButton';
import DashboardFilters, { DateMode, MONTH_FORMATTER } from '../components/DashboardFilters';

interface DashboardPageProps {
  activities: Activity[];
  onOpenMap: () => void;
}

function totalDistance(activities: Activity[]) {
  const sum = activities.reduce((acc, a) => acc + (a.distance_km ?? 0), 0);
  return sum.toFixed(0);
}

function totalTime(activities: Activity[]) {
  const sec = activities.reduce((acc, a) => acc + (a.moving_time ?? 0), 0);
  const h = Math.floor(sec / 3600);
  return h;
}

function totalElevation(activities: Activity[]) {
  return activities.reduce((acc, a) => acc + (a.total_elevation_gain ?? 0), 0);
}

function countType(activities: Activity[], type: string) {
  return activities.filter((a) => a.sport_type === type).length;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function isInMonth(dateStr: string | undefined, month: Date) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth();
}

export default function DashboardPage({ activities, onOpenMap }: DashboardPageProps) {
  const [dateMode, setDateMode] = useState<DateMode>('all');
  const [selectedMonth, setSelectedMonth] = useState<Date>(() => startOfMonth(new Date()));
  const [visibleSports, setVisibleSports] = useState<Record<string, boolean>>({});
  const { firstName } = useAuth();

  const sportTypes = useMemo(() => {
    const set = new Set<string>();
    activities.forEach((a) => set.add(a.sport_type || 'Other'));
    return Array.from(set).sort();
  }, [activities]);

  const toggleSport = (type: string) => {
    setVisibleSports((prev) => ({ ...prev, [type]: prev[type] === false ? true : false }));
  };
  const resetSports = () => setVisibleSports({});

  const shiftMonth = (delta: number) => {
    setSelectedMonth((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
      return next > startOfMonth(new Date()) ? prev : next;
    });
  };

  const canGoForward = useMemo(() => {
    const now = startOfMonth(new Date());
    return (
      selectedMonth.getFullYear() < now.getFullYear() ||
      (selectedMonth.getFullYear() === now.getFullYear() && selectedMonth.getMonth() < now.getMonth())
    );
  }, [selectedMonth]);

  const filteredActivities = useMemo(() => {
    return activities.filter((a) => {
      if (dateMode === 'month' && !isInMonth(a.start_date, selectedMonth)) return false;
      const type = a.sport_type || 'Other';
      if (visibleSports[type] === false) return false;
      return true;
    });
  }, [activities, dateMode, selectedMonth, visibleSports]);

  const isFiltered = dateMode === 'month' || sportTypes.some((t) => visibleSports[t] === false);

  const recent = [...filteredActivities].sort((a, b) => {
    if (!a.start_date || !b.start_date) return 0;
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        <div className="relative rounded-3xl overflow-hidden border border-white/10">
          <div className="absolute inset-0">
            <ArchitectureArt />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/75 to-[#0a0a0a]/15" />
          <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              {activities.length != 0 && (
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FC4C02] animate-pulse" />
                  <span className="text-[#d4d4d4] text-xs font-mono">
                    {activities.length} activities recorded
                  </span>
                </div>
              )}
              <h1
                className="text-white text-3xl md:text-4xl lg:text-5xl italic leading-[1.1]"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                <span className="block">Hello,</span>
                <span className="block">{firstName}</span>
              </h1>
            </div>
            <ArrowButton label="Open map" onClick={onOpenMap} />
          </div>
        </div>

        <DashboardFilters
          dateMode={dateMode}
          onDateModeChange={setDateMode}
          selectedMonth={selectedMonth}
          onShiftMonth={shiftMonth}
          canGoForward={canGoForward}
          sportTypes={sportTypes}
          visibleSports={visibleSports}
          onToggleSport={toggleSport}
          onResetSports={resetSports}
        />

        <div className="flex items-baseline justify-between gap-4 flex-wrap -mb-2">
          <h2
            className="text-white text-xl italic"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {dateMode === 'month'
              ? `Summary: ${MONTH_FORMATTER.format(selectedMonth)}`
              : 'All activities'}
          </h2>
          <p className="text-[#7a7a7a] text-xs font-mono">
            {filteredActivities.length} {dateMode === 'month' ? 'this month' : 'total'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Routes"
            value={String(filteredActivities.length)}
            icon="📍"
            accent
          />
          <StatCard
            label="Distance"
            value={totalDistance(filteredActivities)}
            unit="km"
            icon="📏"
          />
          <StatCard
            label="Total time"
            value={String(totalTime(filteredActivities))}
            unit="godz."
            icon="⏱"
          />
          <StatCard
            label="Elevation"
            value={Math.round(totalElevation(filteredActivities)).toLocaleString('pl')}
            unit="m"
            icon="⛰"
          />
        </div>

        {filteredActivities.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { type: 'Run', label: 'Runs', icon: '🏃' },
              { type: 'Ride', label: 'Bike rides', icon: '🚴' },
              { type: 'Swim', label: 'Swimming', icon: '🏊' },
              { type: 'Walk', label: 'Walks', icon: '🚶' },
            ].map(({ type, label, icon }) => {
              const count = countType(filteredActivities, type);
              if (count === 0) return null;
              return (
                <div
                  key={type}
                  className="bg-[#121212] border border-white/10 rounded-2xl p-4 flex items-center gap-3"
                >
                  <span className="w-10 h-10 rounded-full bg-black/30 border border-white/10 flex items-center justify-center text-xl shrink-0">
                    {icon}
                  </span>
                  <div>
                    <p className="text-white font-mono font-bold text-lg">{count}</p>
                    <p className="text-[#7a7a7a] text-xs font-mono uppercase tracking-wider">{label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div>
          <h2 className="text-[#7a7a7a] text-xs font-mono uppercase tracking-widest mb-4">
            {dateMode === 'month' ? 'Activities this month' : 'Last activities'}
          </h2>

          {activities.length === 0 ? (
            <div className="bg-[#121212] border border-white/15 border-dashed rounded-2xl p-12 text-center">
              <p className="text-4xl mb-4">🏁</p>
              <p className="text-white font-semibold mb-2">No activites yet</p>
              <p className="text-[#7a7a7a] text-sm font-mono">
                Paste your Strava token to see your activities
              </p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="bg-[#121212] border border-white/15 border-dashed rounded-2xl p-12 text-center">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-white font-semibold mb-2">No matching activities</p>
              <p className="text-[#7a7a7a] text-sm font-mono mb-4">
                Try changing filters
              </p>
              {isFiltered && (
                <button
                  onClick={() => {
                    setDateMode('all');
                    resetSports();
                  }}
                  className="text-xs font-mono uppercase tracking-widest text-white underline underline-offset-2 hover:text-[#d4d4d4]"
                >
                  clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="bg-[#121212] border border-white/10 rounded-2xl px-4 py-2">
              {recent.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}