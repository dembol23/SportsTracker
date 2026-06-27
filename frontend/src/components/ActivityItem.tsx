import { Activity } from '../types';

interface ActivityItemProps {
  activity: Activity;
}

function formatDistance(km?: number) {
  if (km == null || km === 0) return '—';
  return km.toFixed(2);
}

function formatTime(seconds?: number) {
  if (!seconds) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

const SPORT_ICONS: Record<string, string> = {
  Run: '🏃',
  Ride: '🚴',
  Swim: '🏊',
  Walk: '🚶',
  Hike: '🥾',
  VirtualRide: '🚴',
  VirtualRun: '🏃',
};

export default function ActivityItem({ activity }: ActivityItemProps) {
  const icon = SPORT_ICONS[activity.sport_type] ?? '🏅';

  return (
    <div className="flex items-center gap-4 py-3 border-b border-white/10 last:border-0 hover:bg-white/5 transition-colors px-2 rounded-xl">
      <span className="w-9 h-9 rounded-full bg-black/30 border border-white/10 flex items-center justify-center text-base shrink-0">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{activity.name || 'Aktywność'}</p>
        <p className="text-[#7a7a7a] text-xs font-mono mt-0.5">{formatDate(activity.start_date)}</p>
      </div>
      <div className="flex gap-4 text-right shrink-0">
        <div>
          <p className="text-white font-mono text-sm font-bold">{formatDistance(activity.distance_km)}</p>
          <p className="text-[#7a7a7a] text-xs font-mono">km</p>
        </div>
        <div className="hidden sm:block">
          <p className="text-white font-mono text-sm font-bold">{formatTime(activity.moving_time)}</p>
          <p className="text-[#7a7a7a] text-xs font-mono">hh:mm:ss</p>
        </div>
        {activity.total_elevation_gain !== undefined && (
          <div className="hidden md:block">
            <p className="text-white font-mono text-sm font-bold">{Math.round(activity.total_elevation_gain)}</p>
            <p className="text-[#7a7a7a] text-xs font-mono">m ↑</p>
          </div>
        )}
      </div>
    </div>
  );
}