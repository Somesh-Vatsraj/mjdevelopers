import { useState } from 'react';
import { api } from '../../api/client';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await api.post('/admin/forgot-password', { email });
      setMsg(res.message);
      setToken(res.resetToken);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl">
        <h1 className="text-center text-3xl font-bold">Forgot Password</h1>
        {msg && <div className="mt-6 rounded-lg bg-blue-100 p-4 text-sm text-blue-800">{msg}</div>}
        {token && (
          <div className="mt-4 rounded-lg bg-yellow-100 p-4 text-xs break-all">
            Reset Token (demo): <strong>{token}</strong>
          </div>
        )}
        <div className="mt-8 space-y-6">
          <div>
            <label className="label">Email</label>
            <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-lg py-4">
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </div>
      </form>
    </div>
  );
}
