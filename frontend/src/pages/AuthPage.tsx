import { useState, FormEvent, ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { apiLogin, apiRegister } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import AuthHero from '../components/AuthHero';
import ArrowButton from '../components/ArrowButton';

// Zmieniliśmy stałą na funkcję, by dodać większy margines wewnętrzny (pr-10) tam, gdzie jest ikonka
const getInputClass = (hasIcon = false) =>
    `w-full bg-transparent border-b border-white/20 text-white py-3 pl-1 ${hasIcon ? 'pr-10' : 'pr-1'
    } focus:outline-none focus:border-white transition-colors placeholder-white/30 text-sm`;

export default function AuthPage() {
    const { login } = useAuth();

    const [mode, setMode] = useState<'login' | 'register'>('login');

    const [firstName, setFirstName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    // Nowy stan do podglądu hasła
    const [showPassword, setShowPassword] = useState(false);

    const switchMode = () => {
        setMode((prev) => (prev === 'login' ? 'register' : 'login'));
        setErrors([]);
        setFirstName('');
        setPassword('');
        setConfirmPassword('');
        setShowPassword(false); // Ukrywamy hasło przy przełączaniu ekranu
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrors([]);

        if (mode === 'register' && password !== confirmPassword) {
            setErrors(['Passwords do not match']);
            return;
        }

        setLoading(true);
        try {
            if (mode === 'login') {
                const tokens = await apiLogin(username, password);
                login(tokens.access, tokens.refresh, tokens.first_name || username);
            } else {
                await apiRegister(username, password, firstName);
                const tokens = await apiLogin(username, password);
                login(tokens.access, tokens.refresh, tokens.first_name || firstName);
            }
        } catch (err: any) {
            setErrors(normalizeErrors(err.detail));
        } finally {
            setLoading(false);
        }
    };

    const isLogin = mode === 'login';

    return (
        <AuthHero
            align={isLogin ? 'left' : 'right'}
            currentLabel={isLogin ? 'Sign In' : 'Create Account'}
            otherLabel={isLogin ? 'Create Account' : 'Sign In'}
            onSwitch={switchMode}
            headline={
                isLogin
                    ? ['The Place', 'Your Trainings', 'Belong.']
                    : ['Start The', 'Record', "You'll Keep."]
            }
            eyebrow={isLogin ? '' : 'New Member'}
            subtitle={
                isLogin
                    ? 'Sign in to see your runs, rides, and weight trainings gathered on one connected map, right where you left off.'
                    : "Create an account, connect it to Strava, and start building one lasting record of every route you've covered."
            }
        >
            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <Field label="Username">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoComplete="username"
                            className={getInputClass(false)}
                            placeholder="jane_doe"
                        />
                    </Field>
                </div>

                {!isLogin && (
                    <Field label="Imię (First Name)">
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className={getInputClass()}
                            placeholder="Jan"
                            required
                        />
                    </Field>
                )}

                <div className="mb-5">
                    <Field label="Password">
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete={isLogin ? 'current-password' : 'new-password'}
                                className={getInputClass(true)}
                                placeholder={isLogin ? '••••••••' : 'At least 8 characters'}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1} // Zapobiega focusowaniu przycisku klawiszem TAB
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7a7a7a] hover:text-white transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </Field>
                </div>

                <div
                    className={`transition-all duration-500 overflow-hidden ${isLogin ? 'max-h-0 opacity-0 mb-0' : 'max-h-28 opacity-100 mb-5'
                        }`}
                >
                    <Field label="Confirm Password">
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required={!isLogin}
                                autoComplete="new-password"
                                className={getInputClass(true)}
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7a7a7a] hover:text-white transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </Field>
                </div>

                <ErrorList errors={errors} />

                <div className="flex justify-end pt-2">
                    <ArrowButton
                        type="submit"
                        label={isLogin ? 'Sign In' : 'Create Account'}
                        loading={loading}
                        loadingLabel={isLogin ? 'Signing in...' : 'Creating account...'}
                    />
                </div>
            </form>
        </AuthHero>
    );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div>
            <label className="block text-[11px] text-[#7a7a7a] uppercase tracking-[0.18em] mb-2">
                {label}
            </label>
            {children}
        </div>
    );
}

function ErrorList({ errors }: { errors: string[] }) {
    if (!errors.length) return null;
    return (
        <ul className="text-[#f08a6c] text-sm bg-white/5 border border-white/10 px-3 py-2 rounded-lg space-y-1 mb-5">
            {errors.map((e, i) => (
                <li key={i}>{e}</li>
            ))}
        </ul>
    );
}

function normalizeErrors(detail: any): string[] {
    if (!detail) return ['Authentication failed'];
    if (typeof detail === 'string') return [detail];
    if (Array.isArray(detail)) return detail.map(String);
    if (typeof detail === 'object') {
        return Object.entries(detail).flatMap(([field, msgs]) => {
            const list = Array.isArray(msgs) ? msgs : [msgs];
            return field === 'non_field_errors' ? list.map(String) : list.map((m) => `${field}: ${m}`);
        });
    }
    return ['Authentication failed'];
}