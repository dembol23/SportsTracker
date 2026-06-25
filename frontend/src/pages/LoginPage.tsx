import { useState, FormEvent, ReactNode } from 'react';
import { apiLogin } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import AuthHero from '../components/AuthHero';
import ArrowButton from '../components/ArrowButton';

interface LoginPageProps {
  onSwitchToRegister: () => void;
}

const inputClass =
  'w-full bg-[#0F1117] border border-[#2D3142] text-white px-4 py-3 rounded-xl ' +
  'focus:outline-none focus:border-[#FC4C02] focus:ring-1 focus:ring-[#FC4C02]/30 ' +
  'transition-colors placeholder-[#374151] font-mono text-sm';

export default function LoginPage({ onSwitchToRegister }: LoginPageProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      const tokens = await apiLogin(username, password);
      login(tokens.access, tokens.refresh);
    } catch (err: any) {
      // Backend returns either a string message or a dict of field errors
      setErrors(normalizeErrors(err.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthHero
      title="Your training"
      accent="history"
      subtitle="Log in to see how much progress you've made."
      footer={
        <p className="text-[#6B7280] text-sm">
          Not registered yet?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-[#FC4C02] hover:text-[#ff6a30] font-semibold transition-colors"
          >
            Sign up
          </button>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Username">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            className={inputClass}
          />
        </Field>

        <Field label="Password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className={inputClass}
            placeholder="••••••••"
          />
        </Field>

        <ErrorList errors={errors} />

        <div className="flex justify-end pt-2">
          <ArrowButton type="submit" label="Log in" loading={loading} loadingLabel="Logging in..." />
        </div>
      </form>
    </AuthHero>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono text-[#6B7280] uppercase tracking-widest mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function ErrorList({ errors }: { errors: string[] }) {
  if (!errors.length) return null;
  return (
    <ul className="text-[#EF4444] text-sm font-mono bg-[#EF4444]/10 border border-[#EF4444]/20 px-3 py-2 rounded-lg space-y-1">
      {errors.map((e, i) => <li key={i}>{e}</li>)}
    </ul>
  );
}

// Django REST Framework can return errors as:
//   string, string[], or { field: string | string[] }
function normalizeErrors(detail: any): string[] {
  if (!detail) return ['Błąd logowania'];
  if (typeof detail === 'string') return [detail];
  if (Array.isArray(detail)) return detail.map(String);
  if (typeof detail === 'object') {
    return Object.entries(detail).flatMap(([field, msgs]) => {
      const list = Array.isArray(msgs) ? msgs : [msgs];
      return field === 'non_field_errors'
        ? list.map(String)
        : list.map((m) => `${field}: ${m}`);
    });
  }
  return ['Błąd logowania'];
}