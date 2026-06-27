import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { apiFetchActivities } from './api/client';
import { Activity } from './types';

import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import Navbar from './components/Navbar';

type AuthScreen = 'login' | 'register';
type AppView = 'dashboard' | 'map';

function AuthedApp() {
  const { accessToken, logout } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [view, setView] = useState<AppView>('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  const loadActivities = async () => {
    if (!accessToken) return;
    try {
      const data = await apiFetchActivities(accessToken);
      setActivities(data);
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED') logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, [accessToken]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0F1117]">
        <div className="flex flex-col items-center gap-4">
          <span className="w-8 h-8 border-2 border-white/20 border-t-[#FC4C02] rounded-full animate-spin" />
          <p className="text-[#9CA3AF] text-sm font-mono tracking-widest uppercase">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] overflow-hidden">
      <Navbar
        activitiesCount={activities.length}
        currentView={view}
        onViewChange={setView}
        onSyncComplete={loadActivities}
      />
      {view === 'dashboard' ? (
        <DashboardPage activities={activities} onOpenMap={() => setView('map')} />
      ) : (
        <MapPage activities={activities} />
      )}
    </div>
  );
}

function AppInner() {
  const { accessToken } = useAuth();

  if (!accessToken) {
    return <AuthPage />;
  }

  return <AuthedApp />;
}

export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Instrument+Serif:ital@1&display=swap');
      `}</style>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </>
  );
}