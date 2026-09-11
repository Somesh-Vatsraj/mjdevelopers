import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function JoinUs() {
  const [data, setData] = useState({
    ready: false,
    jobs: [],
  });
  const [activeFilter, setActiveFilter] = useState('All');

  /* ═══════════════════════════════════════════
     LOAD JOBS
  ═══════════════════════════════════════════ */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const jobs = await api.get('/jobs').catch(() => []);
        if (cancelled) return;
        setData({
          ready: true,
          jobs: Array.isArray(jobs) ? jobs : [],
        });
      } catch (err) {
        console.error('JoinUs load error:', err);
        if (!cancelled) setData({ ready: true, jobs: [] });
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  /* ═══════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════ */
  // Blank until ready
  if (!data.ready) {
    return <div className="min-h-screen bg-[#f0f2f5]" />;
  }

  const { jobs } = data;

  // Get unique departments for filter
  const departments = ['All', ...new Set(jobs.map((j) => j.department).filter(Boolean))];
  const filteredJobs = activeFilter === 'All'
    ? jobs
    : jobs.filter((j) => j.department === activeFilter);

  return (
    <div className="animate-fade-in py-24">
      <div className="mx-auto max-w-7xl px-4">

        {/* ═══════ Header ═══════ */}
        <div className="mb-16 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            Careers
          </span>
          <h1 className="section-title mt-4">We Are Hiring</h1>
          <p className="section-subtitle">
            Join our team and grow with us. We value talent and dedication.
          </p>
        </div>

        {/* ═══════ Stats Bar ═══════ */}
        {jobs.length > 0 && (
          <div className="mb-12 grid gap-4 sm:grid-cols-3">
            <div className="card flex items-center gap-4 !p-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
                <i className="fas fa-briefcase text-xl" />
              </div>
              <div>
                <p className="text-2xl font-black text-dark">{jobs.length}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Open Positions
                </p>
              </div>
            </div>

            <div className="card flex items-center gap-4 !p-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg">
                <i className="fas fa-building text-xl" />
              </div>
              <div>
                <p className="text-2xl font-black text-dark">
                  {departments.length - 1}
                </p>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Departments
                </p>
              </div>
            </div>

            <div className="card flex items-center gap-4 !p-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg">
                <i className="fas fa-clock text-xl" />
              </div>
              <div>
                <p className="text-2xl font-black text-dark">Full Time</p>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Job Type
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ Filters ═══════ */}
        {departments.length > 1 && (
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveFilter(dept)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-300 ${
                  activeFilter === dept
                    ? 'bg-gradient-to-r from-primary to-red-500 text-white shadow-lg shadow-primary/30'
                    : 'border-2 border-gray-200 bg-white text-gray-700 hover:border-primary/40 hover:text-primary'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        )}

        {/* ═══════ Jobs Grid ═══════ */}
        {filteredJobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job, i) => (
              <Link
                key={job.id}
                to={`/job/${job.id}`}
                className="service-card group block animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="service-icon-wrap !mb-0 !h-14 !w-14 !text-2xl">
                    <i className="fas fa-briefcase" />
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-green-700 ring-1 ring-green-200">
                    <i className="fas fa-circle mr-1 text-[6px]" />
                    Open
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-6 text-xl font-bold text-dark transition group-hover:text-primary">
                  {job.title}
                </h3>

                {/* Meta */}
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  {job.department && (
                    <p className="flex items-center gap-2">
                      <i className="fas fa-building text-primary" />
                      {job.department}
                    </p>
                  )}
                  {job.location && (
                    <p className="flex items-center gap-2">
                      <i className="fas fa-map-marker-alt text-primary" />
                      {job.location}
                    </p>
                  )}
                  {job.created_at && (
                    <p className="flex items-center gap-2">
                      <i className="fas fa-calendar text-primary" />
                      Posted {new Date(job.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </p>
                  )}
                </div>

                {/* View Details */}
                <div className="mt-6 flex items-center gap-2 border-t border-gray-100 pt-4 text-sm font-bold text-primary">
                  View Details
                  <i className="fas fa-arrow-right text-xs transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-md rounded-3xl border-2 border-dashed border-gray-300 bg-white/50 p-12 text-center animate-fade-in">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <i className="fas fa-inbox text-4xl" />
            </div>
            <h3 className="mt-6 text-xl font-black text-dark">
              {jobs.length === 0 ? 'No Openings Right Now' : 'No Jobs in This Department'}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {jobs.length === 0
                ? 'Check back soon! We frequently post new positions.'
                : 'Try selecting a different department above.'}
            </p>
            {jobs.length === 0 && (
              <Link to="/contact" className="btn-primary mt-6 text-sm">
                <i className="fas fa-envelope" /> Send Your Resume
              </Link>
            )}
          </div>
        )}

        {/* ═══════ Why Join Us ═══════ */}
        <div className="mt-24">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              Why Join Us
            </span>
            <h2 className="section-title mt-4">Benefits of Working With Us</h2>
            <p className="section-subtitle">
              We invest in our people because they are our greatest asset.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: 'fa-chart-line', title: 'Growth Opportunities', desc: 'Learn and grow with continuous training.', color: 'from-blue-500 to-indigo-500' },
              { icon: 'fa-hand-holding-usd', title: 'Competitive Salary', desc: 'Industry-leading compensation packages.', color: 'from-green-500 to-emerald-500' },
              { icon: 'fa-shield-alt', title: 'Job Security', desc: 'Stable employment with long-term contracts.', color: 'from-purple-500 to-pink-500' },
              { icon: 'fa-users', title: 'Friendly Team', desc: 'Work with supportive colleagues.', color: 'from-amber-500 to-orange-500' },
            ].map((benefit, i) => (
              <div
                key={i}
                className="card animate-fade-in-up text-center"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${benefit.color} text-white shadow-lg`}>
                  <i className={`fas ${benefit.icon} text-xl`} />
                </div>
                <h3 className="mt-5 text-base font-bold text-dark">{benefit.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════ CTA Strip ═══════ */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-red-500 to-primary p-8 shadow-2xl sm:p-12">
          <div className="text-center">
            <h3 className="text-2xl font-black text-white md:text-3xl">
              Didn't Find Your Position?
            </h3>
            <p className="mt-3 text-white/90">
              Send us your resume and we'll reach out when something matches.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-primary shadow-lg transition hover:scale-105"
              >
                <i className="fas fa-paper-plane" />
                Send Resume
              </Link>
              <a
                href="mailto:info@company.com"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-white bg-transparent px-6 py-3 font-bold text-white transition hover:bg-white hover:text-primary"
              >
                <i className="fas fa-envelope" />
                Email Us
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
