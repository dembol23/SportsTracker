const BASE_URL = 'https://sportstracker.duckdns.org/api';

function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function apiLogin(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error('Błędny login lub hasło');
  return data as { access: string; refresh: string };
}

export async function apiRegister(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Błąd rejestracji');
  return data;
}

export async function apiFetchActivities(token: string) {
  const res = await fetch(`${BASE_URL}/activities/`, {
    headers: authHeaders(token),
  });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  if (!res.ok) throw new Error('Nie udało się pobrać aktywności');
  return res.json();
}

export async function apiSaveStravaToken(token: string, refreshToken: string) {
  const res = await fetch(`${BASE_URL}/strava/token/`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Błąd zapisu tokenu');
  return data;
}

export async function apiStravaSync(token: string) {
  const res = await fetch(`${BASE_URL}/strava/sync/`, {
    method: 'POST',
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Błąd synchronizacji');
  return data as { message: string };
}
