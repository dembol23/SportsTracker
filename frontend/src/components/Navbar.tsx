import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiSaveStravaToken, apiStravaSync } from '../api/client';

interface NavbarProps {
  activitiesCount: number;
  currentView: 'dashboard' | 'map';
  onViewChange: (view: 'dashboard' | 'map') => void;
  onSyncComplete: () => void;
}

export default function Navbar({
  activitiesCount,
  currentView,
  onViewChange,
  onSyncComplete,
}: NavbarProps) {
  const { accessToken, logout } = useAuth();
  const [stravaToken, setStravaToken] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSaveStravaToken = async () => {
    if (!stravaToken || !accessToken) return;
    try {
      await apiSaveStravaToken(accessToken, stravaToken);
      setStravaToken('');
      setShowTokenInput(false);
      setFeedback('Token zapisany ✓');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err: any) {
      setFeedback(err.message);
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  const handleSync = async () => {
    if (!accessToken) return;
    setIsSyncing(true);
    try {
      const data = await apiStravaSync(accessToken);
      setFeedback(data.message || 'Zsynchronizowano ✓');
      setTimeout(() => setFeedback(''), 4000);
      onSyncComplete();
    } catch (err: any) {
      setFeedback(err.message);
      setTimeout(() => setFeedback(''), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <nav className="bg-[#0F1117] border-b border-[#1F2232] px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
      {/* Brand */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[#FC4C02] text-xl">⬡</span>
        <span className="text-white font-bold tracking-widest uppercase text-sm">Trackmaps</span>
      </div>

      {/* View switcher */}
      <div className="flex items-center bg-[#1A1D27] rounded-lg p-1 gap-1">
        <button
          onClick={() => onViewChange('dashboard')}
          className={`px-4 py-1.5 rounded-md text-xs font-mono uppercase tracking-widest transition-all ${
            currentView === 'dashboard'
              ? 'bg-[#FC4C02] text-white'
              : 'text-[#6B7280] hover:text-white'
          }`}
        >
          Panel
        </button>
        <button
          onClick={() => onViewChange('map')}
          className={`px-4 py-1.5 rounded-md text-xs font-mono uppercase tracking-widest transition-all ${
            currentView === 'map'
              ? 'bg-[#FC4C02] text-white'
              : 'text-[#6B7280] hover:text-white'
          }`}
        >
          Mapa
        </button>
      </div>

      {/* Right side controls */}
      <div className="flex items-center gap-2 flex-wrap">

        {/* Activity count badge */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#1A1D27] px-3 py-1.5 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-[#FC4C02] animate-pulse" />
          <span className="text-white font-mono text-xs">{activitiesCount} tras</span>
        </div>

        {/* Strava token */}
        <div className="relative">
          <button
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#2D3142] text-[#9CA3AF]
                       hover:border-[#FC4C02] hover:text-white transition-all uppercase tracking-widest"
          >
            Strava token
          </button>
          {showTokenInput && (
            <div className="absolute right-0 top-full mt-2 bg-[#1A1D27] border border-[#2D3142] rounded-lg p-3 flex gap-2 z-50 w-80">
              <input
                type="text"
                value={stravaToken}
                onChange={(e) => setStravaToken(e.target.value)}
                placeholder="refresh_token ze Stravy"
                className="flex-1 bg-[#0F1117] border border-[#2D3142] text-white text-xs px-3 py-2
                           rounded focus:outline-none focus:border-[#FC4C02] font-mono placeholder-[#374151]"
              />
              <button
                onClick={handleSaveStravaToken}
                className="bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold px-3 py-2
                           rounded transition-colors uppercase tracking-wider whitespace-nowrap"
              >
                Zapisz
              </button>
            </div>
          )}
        </div>

        {/* Sync button */}
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold
                     uppercase tracking-widest transition-all
                     ${isSyncing
                       ? 'bg-[#FC4C02]/40 text-white/50 cursor-not-allowed'
                       : 'bg-[#FC4C02] hover:bg-[#e04400] text-white'
                     }`}
        >
          {isSyncing ? (
            <>
              <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" />
              Sync...
            </>
          ) : (
            <>↻ Strava</>
          )}
        </button>

        <button
          onClick={logout}
          className="text-xs font-mono px-3 py-1.5 rounded-lg border border-[#2D3142] text-[#6B7280]
                     hover:border-[#4B5563] hover:text-[#9CA3AF] transition-all uppercase tracking-widest"
        >
          Wyloguj
        </button>
      </div>

      {/* Feedback toast */}
      {feedback && (
        <div className="absolute top-16 right-4 bg-[#1A1D27] border border-[#2D3142] text-white text-xs
                        font-mono px-4 py-2 rounded-lg shadow-xl z-50">
          {feedback}
        </div>
      )}
    </nav>
  );
}
