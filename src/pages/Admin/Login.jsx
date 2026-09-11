import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(username, password);
    if (res.success) navigate('/admin/dashboard');
    else setError(res.error);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-dark px-4">
      {/* 3D background orbs */}
      <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-red-500/10 blur-3xl animate-float-slow" />
      
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/95 p-10 shadow-2xl backdrop-blur-2xl"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset',
        }}
      >
        <div className="logo-3d mx-auto h-16 w-16 text-2xl mb-6">MJ</div>
        <h1 className="text-center text-3xl font-black text-dark">Admin Login</h1>
        <p className="mt-2 text-center text-sm font-medium tracking-wider text-gray-500">
          MAA JIVACH ENTERPRISES
        </p>

        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 ring-1 ring-red-200">
            <i className="fas fa-exclamation-circle" />
            {error}
          </div>
        )}

        <div className="mt-8 space-y-5">
          <div>
            <label className="label">Username</label>
            <input
              className="input"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="admin"
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-base py-4"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin" /> Logging in…
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt" /> Login
              </>
            )}
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          <Link to="/admin/forgot-password" className="font-semibold text-primary hover:underline">
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
}
