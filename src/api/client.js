const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const url = `${API_BASE}${path}`;
  console.log(`[API] ${options.method || 'GET'} ${url}`);

  try {
    const res = await fetch(url, { ...options, headers });
    const text = await res.text();

    if (!text) throw new Error('Empty response from server');

    if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
      throw new Error('API URL points to Pages, not Worker. Check VITE_API_BASE.');
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Invalid JSON: ${text.slice(0, 100)}`);
    }

    if (!res.ok) {
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error('[API Error]', err.message);
    if (err.message.includes('Failed to fetch')) {
      throw new Error('Cannot reach API. Is the Worker running?');
    }
    throw err;
  }
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  del: (path) => request(path, { method: 'DELETE' }),
};
