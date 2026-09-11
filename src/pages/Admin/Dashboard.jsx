import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const cards = [
    { to: '/admin/photos', icon: 'fa-images', title: 'Manage Photos', desc: 'Add or delete gallery images', color: 'from-blue-500 to-indigo-500' },
    { to: '/admin/jobs', icon: 'fa-briefcase', title: 'Manage Jobs', desc: 'Create and edit job posts', color: 'from-purple-500 to-pink-500' },
    { to: '/admin/applications', icon: 'fa-file-alt', title: 'Applications', desc: 'View all job applications', color: 'from-green-500 to-emerald-500' },
    { to: '/admin/settings', icon: 'fa-cog', title: 'Settings', desc: 'Edit website content', color: 'from-primary to-red-500' },
  ];

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-dark">Dashboard</h1>
            <p className="mt-1 text-gray-500">Welcome back, Admin 👋</p>
          </div>
          <button onClick={handleLogout} className="btn-outline text-sm">
            <i className="fas fa-sign-out-alt" /> Logout
          </button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Link
              key={c.to}
              to={c.to}
              className="card animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${c.color} text-2xl text-white shadow-lg`}>
                <i className={`fas ${c.icon}`} />
              </div>
              <h3 className="mt-6 text-lg font-bold text-dark">{c.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{c.desc}</p>
              <div className="mt-4 flex items-center gap-2 text-sm font-bold text-primary">
                Open <i className="fas fa-arrow-right text-xs" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
