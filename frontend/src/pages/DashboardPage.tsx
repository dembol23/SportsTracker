import { Activity } from '../types';
import StatCard from '../components/StatCard';
import ActivityItem from '../components/ActivityItem';
import RouteArt from '../components/RouteArt';
import ArrowButton from '../components/ArrowButton';

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

export default function DashboardPage({ activities, onOpenMap }: DashboardPageProps) {
  const recent = [...activities].sort((a, b) => {
    if (!a.start_date || !b.start_date) return 0;
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[#0F1117] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Hero banner */}
        <div className="relative rounded-3xl overflow-hidden border border-[#2D3142]">
          <div className="absolute inset-0">
            <RouteArt />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1117] via-[#0F1117]/70 to-[#0F1117]/10" />
          <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FC4C02] animate-pulse" />
                <span className="text-[#C7CAD4] text-xs font-mono">
                  {activities.length} aktywności łącznie
                </span>
              </div>
              <h1
                className="text-white text-3xl md:text-4xl font-bold leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Cześć! Oto Twój{' '}
                <span
                  className="italic font-normal text-[#FC4C02]"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  panel
                </span>
                .
              </h1>
            </div>
            <ArrowButton label="Otwórz mapę" onClick={onOpenMap} />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Trasy"
            value={String(activities.length)}
            icon="📍"
            accent
          />
          <StatCard
            label="Dystans"
            value={totalDistance(activities)}
            unit="km"
            icon="📏"
          />
          <StatCard
            label="Czas ruchu"
            value={String(totalTime(activities))}
            unit="godz."
            icon="⏱"
          />
          <StatCard
            label="Przewyższenie"
            value={Math.round(totalElevation(activities)).toLocaleString('pl')}
            unit="m"
            icon="⛰"
          />
        </div>

        {/* Sport breakdown */}
        {activities.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { type: 'Run', label: 'Biegi', icon: '🏃' },
              { type: 'Ride', label: 'Rowery', icon: '🚴' },
              { type: 'Swim', label: 'Pływanie', icon: '🏊' },
              { type: 'Walk', label: 'Spacery', icon: '🚶' },
            ].map(({ type, label, icon }) => {
              const count = countType(activities, type);
              if (count === 0) return null;
              return (
                <div
                  key={type}
                  className="bg-[#1A1D27] border border-[#2D3142] rounded-2xl p-4 flex items-center gap-3"
                >
                  <span className="w-10 h-10 rounded-full bg-[#0F1117] border border-[#2D3142] flex items-center justify-center text-xl shrink-0">
                    {icon}
                  </span>
                  <div>
                    <p className="text-white font-mono font-bold text-lg">{count}</p>
                    <p className="text-[#4B5563] text-xs font-mono uppercase tracking-wider">{label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Activity list */}
        <div>
          <h2 className="text-[#6B7280] text-xs font-mono uppercase tracking-widest mb-4">
            Ostatnie aktywności
          </h2>

          {activities.length === 0 ? (
            <div className="bg-[#1A1D27] border border-[#2D3142] border-dashed rounded-2xl p-12 text-center">
              <p className="text-4xl mb-4">🏁</p>
              <p className="text-white font-semibold mb-2">Brak tras</p>
              <p className="text-[#4B5563] text-sm font-mono">
                Wklej token Stravy i kliknij "↻ Strava" aby pobrać swoje trasy
              </p>
            </div>
          ) : (
            <div className="bg-[#1A1D27] border border-[#2D3142] rounded-2xl px-4 py-2">
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