import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { apiSaveStravaToken, apiStravaSync } from '../api/client';
import ArrowButton from './ArrowButton';

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
    <div className="shrink-0 bg-[#0a0a0a] px-3 md:px-4 pt-3 md:pt-4 pb-2">
      <nav
        className="relative max-w-7xl mx-auto bg-[#121212]/80 backdrop-blur-xl border border-white/10
                   rounded-2xl px-4 py-3 flex items-center justify-between gap-4 flex-wrap
                   shadow-xl shadow-black/30"
      >
        <span
          className="text-white text-xl uppercase tracking-tight"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontStyle: 'italic' }}
        >
          SportsTracker
        </span>

        <div className="flex items-center bg-black/40 rounded-full p-1 gap-1 border border-white/10">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all ${currentView === 'dashboard'
              ? 'bg-white text-black'
              : 'text-[#7a7a7a] hover:text-white'
              }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onViewChange('map')}
            className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest transition-all ${currentView === 'map'
              ? 'bg-white text-black'
              : 'text-[#7a7a7a] hover:text-white'
              }`}
          >
            Map
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <button
              onClick={() => setShowTokenInput(!showTokenInput)}
              className="text-xs font-mono px-3 py-1.5 rounded-full border border-white/10 text-[#9a9a9a]
                         hover:border-white/30 hover:text-white transition-all uppercase tracking-widest"
            >
              Strava token
            </button>
            {showTokenInput && (
              <div className="absolute right-0 top-full mt-2 bg-[#121212] border border-white/10 rounded-2xl p-3 flex gap-2 z-50 w-80 shadow-xl shadow-black/40">
                <input
                  type="text"
                  value={stravaToken}
                  onChange={(e) => setStravaToken(e.target.value)}
                  placeholder="Strava token"
                  className="flex-1 bg-black/40 border border-white/10 text-white text-xs px-3 py-2
                             rounded-lg focus:outline-none focus:border-white/40 font-mono placeholder-white/25"
                />
                <button
                  onClick={handleSaveStravaToken}
                  className="bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold px-3 py-2
                             rounded-lg transition-colors uppercase tracking-wider whitespace-nowrap"
                >
                  Save
                </button>
              </div>
            )}
          </div>

          <ArrowButton
            label="Refresh"
            loadingLabel="Sync..."
            loading={isSyncing}
            onClick={handleSync}
            direction="refresh"
          />

          <button
            onClick={logout}
            className="text-xs font-mono px-3 py-1.5 rounded-full border border-white/10 text-[#7a7a7a]
                       hover:border-white/30 hover:text-white transition-all uppercase tracking-widest"
          >
            Log out
          </button>
        </div>

        {feedback && (
          <div className="absolute top-full right-4 mt-2 bg-[#121212] border border-white/10 text-white text-xs
                          font-mono px-4 py-2 rounded-lg shadow-xl z-50">
            {feedback}
          </div>
        )}
      </nav>
    </div>
  );
}