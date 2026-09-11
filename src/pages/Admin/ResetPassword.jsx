import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setMsg('Passwords do not match');
    if (password.length < 6) return setMsg('Password must be at least 6 characters');
    setLoading(true);
    try {
      await api.post('/admin/reset-password', { token, newPassword: password });
      setMsg('Password reset successful! Redirecting…');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl">
        <h1 className="text-center text-3xl font-bold">Reset Password</h1>
        {msg && <div className="mt-6 rounded-lg bg-blue-100 p-4 text-sm text-blue-800">{msg}</div>}
        <div className="mt-8 space-y-6">
          <div>
            <label className="label">New Password</label>
            <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <input type="password" className="input" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-lg py-4">
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
