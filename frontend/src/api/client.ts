// const BASE_URL = 'http://127.0.0.1:8000/api';
const BASE_URL = 'https://sportstracker.duckdns.org/api';

function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// Throws an error with a .detail property matching Django REST Framework's format
async function handleResponse(res: Response) {
  if (res.ok) return res.json();
  let detail: any;
  try {
    const body = await res.json();
    // DRF puts errors in `detail` (string) or field keys (object)
    detail = body.detail ?? body;
  } catch {
    detail = res.statusText;
  }
  const err = new Error('API error') as any;
  err.detail = detail;
  throw err;
}

export async function apiLogin(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(res) as Promise<{ access: string; refresh: string; first_name: string }>;
}

export async function apiRegister(username: string, password: string, firstName: string) {
  const res = await fetch(`${BASE_URL}/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, first_name: firstName }),
  });
  return handleResponse(res);
}

export async function apiFetchActivities(token: string) {
  const res = await fetch(`${BASE_URL}/activities/`, {
    headers: authHeaders(token),
  });
  if (res.status === 401) {
    const err = new Error('UNAUTHORIZED') as any;
    err.detail = 'UNAUTHORIZED';
    throw err;
  }
  return handleResponse(res);
}

export async function apiSaveStravaToken(token: string, refreshToken: string) {
  const res = await fetch(`${BASE_URL}/strava/token/`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  return handleResponse(res);
}

export async function apiStravaSync(token: string) {
  const res = await fetch(`${BASE_URL}/strava/sync/`, {
    method: 'POST',
    headers: authHeaders(token),
  });
  return handleResponse(res) as Promise<{ message: string }>;
}