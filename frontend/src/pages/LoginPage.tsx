import { useState, FormEvent } from 'react';
import { apiLogin } from '../api/client';
import { useAuth } from '../hooks/useAuth';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

export default function LoginPage({ onSwitchToRegister }: LoginPageProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const tokens = await apiLogin(username, password);
      login(tokens.access, tokens.refresh);
    } catch (err: any) {
      setError(err.message || 'Błąd logowania');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1117] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo / Brand */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-[#FC4C02] text-3xl">⬡</span>
            <span className="text-white font-bold text-xl tracking-widest uppercase">Trackmaps</span>
          </div>
          <p className="text-[#4B5563] text-sm tracking-wider uppercase font-mono">Twoja historia w trasach</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#6B7280] uppercase tracking-widest mb-2">
              Nazwa użytkownika
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full bg-[#1A1D27] border border-[#2D3142] text-white px-4 py-3 rounded-lg
                         focus:outline-none focus:border-[#FC4C02] transition-colors placeholder-[#374151]
                         font-mono text-sm"
              placeholder="jan_kowalski"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-[#6B7280] uppercase tracking-widest mb-2">
              Hasło
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-[#1A1D27] border border-[#2D3142] text-white px-4 py-3 rounded-lg
                         focus:outline-none focus:border-[#FC4C02] transition-colors placeholder-[#374151]
                         font-mono text-sm"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-[#EF4444] text-sm font-mono bg-[#EF4444]/10 border border-[#EF4444]/20 px-3 py-2 rounded">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FC4C02] hover:bg-[#e04400] disabled:opacity-50 disabled:cursor-not-allowed
                       text-white font-bold py-3 px-6 rounded-lg transition-colors
                       uppercase tracking-widest text-sm mt-2"
          >
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#1F2232] text-center">
          <p className="text-[#4B5563] text-sm">
            Nie masz konta?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-[#FC4C02] hover:text-[#ff6a30] font-semibold transition-colors"
            >
              Zarejestruj się
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
