// Cloudflare Worker – MAA JIVACH ENTERPRISES API + Frontend

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateToken(username, ADMIN_TOKEN) {
  const timestamp = Date.now();
  const raw = `${username}|${timestamp}|${ADMIN_TOKEN}`;
  const hash = await sha256(raw);
  return btoa(`${username}:${timestamp}:${hash}`);
}

async function verifyToken(token, ADMIN_TOKEN) {
  try {
    const decoded = atob(token);
    const [username, timestamp, hash] = decoded.split(':');
    if (!username || !timestamp || !hash) return false;
    const expected = await sha256(`${username}|${timestamp}|${ADMIN_TOKEN}`);
    return hash === expected;
  } catch {
    return false;
  }
}

async function handleRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;

  if (method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  // ---------- API ROUTES (only if path starts with /api) ----------
  if (path.startsWith('/api/')) {
    // Public routes
    if (path.startsWith('/api/settings/') && method === 'GET') {
      const key = path.split('/api/settings/')[1];
      const row = await env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first();
      if (!row) return json({ error: 'Setting not found' }, 404);
      let value = row.value;
      try { value = JSON.parse(value); } catch {}
      return json({ key, value });
    }

    if (path === '/api/photos' && method === 'GET') {
      const { results } = await env.DB.prepare('SELECT * FROM photos ORDER BY created_at DESC').all();
      return json(results);
    }

    if (path === '/api/jobs' && method === 'GET') {
      const { results } = await env.DB.prepare('SELECT id, title, department, location, created_at FROM jobs ORDER BY created_at DESC').all();
      return json(results);
    }

    if (path.match(/^\/api\/jobs\/\d+$/) && method === 'GET') {
      const id = path.split('/').pop();
      const job = await env.DB.prepare('SELECT * FROM jobs WHERE id = ?').bind(id).first();
      if (!job) return json({ error: 'Job not found' }, 404);
      return json(job);
    }

    if (path === '/api/applications' && method === 'POST') {
      const body = await request.json();
      const { name, email, phone, job_id, position, message } = body;
      if (!name || !email || !phone) return json({ error: 'Missing required fields' }, 400);
      await env.DB.prepare(
        'INSERT INTO applications (name, email, phone, job_id, position, message) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(name, email, phone, job_id || null, position || '', message || '').run();
      return json({ success: true });
    }

    // Admin auth
    if (path === '/api/admin/login' && method === 'POST') {
      const { username, password } = await request.json();
      const hash = await sha256(password);
      const admin = await env.DB.prepare('SELECT * FROM admins WHERE username = ? AND password_hash = ?').bind(username, hash).first();
      if (!admin) return json({ error: 'Invalid credentials' }, 401);
      const token = await generateToken(username, env.ADMIN_TOKEN);
      return json({ token });
    }

    if (path === '/api/admin/forgot-password' && method === 'POST') {
      const { email } = await request.json();
      const admin = await env.DB.prepare('SELECT * FROM admins WHERE email = ?').bind(email).first();
      if (!admin) return json({ error: 'Email not found' }, 404);
      const resetToken = crypto.randomUUID();
      const expiry = new Date(Date.now() + 3600000).toISOString();
      await env.DB.prepare('UPDATE admins SET reset_token = ?, reset_expiry = ? WHERE id = ?').bind(resetToken, expiry, admin.id).run();
      return json({ message: 'Reset link sent', resetToken });
    }

    if (path === '/api/admin/reset-password' && method === 'POST') {
      const { token, newPassword } = await request.json();
      const admin = await env.DB.prepare('SELECT * FROM admins WHERE reset_token = ? AND reset_expiry > datetime("now")').bind(token).first();
      if (!admin) return json({ error: 'Invalid or expired token' }, 400);
      const hash = await sha256(newPassword);
      await env.DB.prepare('UPDATE admins SET password_hash = ?, reset_token = NULL, reset_expiry = NULL WHERE id = ?').bind(hash, admin.id).run();
      return json({ success: true });
    }

    // Protected routes
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401);
    }
    const token = authHeader.split(' ')[1];
    if (!(await verifyToken(token, env.ADMIN_TOKEN))) {
      return json({ error: 'Invalid token' }, 401);
    }

    if (path.startsWith('/api/settings/') && method === 'PUT') {
      const key = path.split('/api/settings/')[1];
      const body = await request.json();
      const value = typeof body.value === 'string' ? body.value : JSON.stringify(body.value);
      await env.DB.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').bind(key, value).run();
      return json({ success: true });
    }

    if (path === '/api/photos' && method === 'POST') {
      const { title, image_url, category } = await request.json();
      if (!title || !image_url) return json({ error: 'Missing fields' }, 400);
      await env.DB.prepare('INSERT INTO photos (title, image_url, category) VALUES (?, ?, ?)').bind(title, image_url, category || 'general').run();
      return json({ success: true });
    }

    if (path.match(/^\/api\/photos\/\d+$/) && method === 'DELETE') {
      const id = path.split('/').pop();
      await env.DB.prepare('DELETE FROM photos WHERE id = ?').bind(id).run();
      return json({ success: true });
    }

    if (path === '/api/jobs' && method === 'POST') {
      const { title, department, location, description } = await request.json();
      if (!title) return json({ error: 'Title required' }, 400);
      await env.DB.prepare('INSERT INTO jobs (title, department, location, description) VALUES (?, ?, ?, ?)').bind(title, department, location, description).run();
      return json({ success: true });
    }

    if (path.match(/^\/api\/jobs\/\d+$/) && method === 'PUT') {
      const id = path.split('/').pop();
      const { title, department, location, description } = await request.json();
      await env.DB.prepare('UPDATE jobs SET title = ?, department = ?, location = ?, description = ? WHERE id = ?').bind(title, department, location, description, id).run();
      return json({ success: true });
    }

    if (path.match(/^\/api\/jobs\/\d+$/) && method === 'DELETE') {
      const id = path.split('/').pop();
      await env.DB.prepare('DELETE FROM jobs WHERE id = ?').bind(id).run();
      return json({ success: true });
    }

    if (path === '/api/applications' && method === 'GET') {
      const { results } = await env.DB.prepare('SELECT * FROM applications ORDER BY submitted_at DESC').all();
      return json(results);
    }

    return json({ error: 'API route not found' }, 404);
  }

  // ---------- SERVE REACT FRONTEND (static assets) ----------
  if (env.ASSETS) {
    return env.ASSETS.fetch(request);
  }

  return new Response('Not Found', { status: 404 });
}

export default {
  async fetch(request, env) {
    try {
      return await handleRequest(request, env);
    } catch (err) {
      console.error('Worker error:', err);
      return json({ error: err.message }, 500);
    }
  },
};
