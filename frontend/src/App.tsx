import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { apiFetchActivities } from './api/client';
import { Activity } from './types';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import Navbar from './components/Navbar';

type AuthScreen = 'login' | 'register';
type AppView = 'dashboard' | 'map';

function AuthedApp() {
  const { accessToken, logout } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [view, setView] = useState<AppView>('dashboard');

  const loadActivities = async () => {
    if (!accessToken) return;
    try {
      const data = await apiFetchActivities(accessToken);
      setActivities(data);
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED') logout();
    }
  };

  useEffect(() => {
    loadActivities();
  }, [accessToken]);

  return (
    <div className="h-screen flex flex-col bg-[#0F1117] overflow-hidden">
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
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');

  if (!accessToken) {
    return authScreen === 'login' ? (
      <LoginPage onSwitchToRegister={() => setAuthScreen('register')} />
    ) : (
      <RegisterPage onSwitchToLogin={() => setAuthScreen('login')} />
    );
  }

  return <AuthedApp />;
}

export default function App() {
  return (
    <>
      {/* Display face (headlines) + italic serif accent face, used by AuthHero / DashboardPage */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Instrument+Serif:ital@1&display=swap');
      `}</style>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </>
  );
}