import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  accessToken: string | null;
  firstName: string | null;
  login: (access: string, refresh: string, user: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(
    () => localStorage.getItem('access_token')
  );

  const [firstName, setFirstName] = useState<string | null>(
    () => localStorage.getItem('first_name')
  );

  const login = (access: string, refresh: string, firstName: string) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('first_name', firstName)
    setAccessToken(access);
    setFirstName(firstName);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('first_name')
    setAccessToken(null);
    setFirstName(null);
  };

  return (
    <AuthContext.Provider value={{ accessToken, firstName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
