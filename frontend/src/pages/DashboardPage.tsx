import { Activity } from '../types';
import StatCard from '../components/StatCard';
import ActivityItem from '../components/ActivityItem';

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

        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-white text-2xl font-bold">Twój panel</h1>
            <p className="text-[#4B5563] text-sm font-mono mt-1">
              {activities.length} aktywności łącznie
            </p>
          </div>
          <button
            onClick={onOpenMap}
            className="flex items-center gap-2 bg-[#1A1D27] hover:bg-[#2D3142] border border-[#2D3142]
                       hover:border-[#FC4C02] text-white text-xs font-mono uppercase tracking-widest
                       px-4 py-2.5 rounded-lg transition-all"
          >
            🗺 Otwórz mapę
          </button>
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
                <div key={type} className="bg-[#1A1D27] border border-[#2D3142] rounded-xl p-4 flex items-center gap-3">
                  <span className="text-2xl">{icon}</span>
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
            <div className="bg-[#1A1D27] border border-[#2D3142] border-dashed rounded-xl p-12 text-center">
              <p className="text-4xl mb-4">🏁</p>
              <p className="text-white font-semibold mb-2">Brak tras</p>
              <p className="text-[#4B5563] text-sm font-mono">
                Wklej token Stravy i kliknij "↻ Strava" aby pobrać swoje trasy
              </p>
            </div>
          ) : (
            <div className="bg-[#1A1D27] border border-[#2D3142] rounded-xl px-4 py-2">
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