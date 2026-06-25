import { useState, FormEvent, ReactNode } from 'react';
import { apiRegister, apiLogin } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import AuthHero from '../components/AuthHero';
import ArrowButton from '../components/ArrowButton';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

const inputClass =
  'w-full bg-[#0F1117] border border-[#2D3142] text-white px-4 py-3 rounded-xl ' +
  'focus:outline-none focus:border-[#FC4C02] focus:ring-1 focus:ring-[#FC4C02]/30 ' +
  'transition-colors placeholder-[#374151] font-mono text-sm';

export default function RegisterPage({ onSwitchToLogin }: RegisterPageProps) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Only client-side check: passwords must match before hitting the network
    if (password !== confirmPassword) {
      setErrors(['Hasła nie są identyczne']);
      return;
    }

    setLoading(true);
    try {
      await apiRegister(username, password);
      const tokens = await apiLogin(username, password);
      login(tokens.access, tokens.refresh);
    } catch (err: any) {
      setErrors(normalizeErrors(err.detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthHero
      eyebrow="Nowe konto, zero opłat"
      title="Zacznij"
      accent="śledzić trasy."
      subtitle="Załóż konto, połącz je ze Stravą i zobacz każdy przebyty kilometr na mapie."
      footer={
        <p className="text-[#6B7280] text-sm">
          Masz już konto?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-[#FC4C02] hover:text-[#ff6a30] font-semibold transition-colors"
          >
            Zaloguj się
          </button>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nazwa użytkownika">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            className={inputClass}
            placeholder="jan_kowalski"
          />
        </Field>

        <Field label="Hasło">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className={inputClass}
            placeholder="min. 8 znaków"
          />
        </Field>

        <Field label="Potwierdź hasło">
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            className={inputClass}
            placeholder="••••••••"
          />
        </Field>

        <ErrorList errors={errors} />

        <div className="flex justify-end pt-2">
          <ArrowButton type="submit" label="Utwórz konto" loading={loading} loadingLabel="Tworzenie konta..." />
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

function normalizeErrors(detail: any): string[] {
  if (!detail) return ['Błąd rejestracji'];
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
  return ['Błąd rejestracji'];
}