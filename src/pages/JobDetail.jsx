import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';

export default function JobDetail() {
  const { id } = useParams();
  const [data, setData] = useState({
    ready: false,
    job: null,
  });
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [submitting, setSubmitting] = useState(false);

  /* ═══════════════════════════════════════════
     LOAD JOB
  ═══════════════════════════════════════════ */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const job = await api.get(`/jobs/${id}`).catch(() => null);
        if (cancelled) return;
        setData({ ready: true, job: job || null });
      } catch (err) {
        console.error('JobDetail load error:', err);
        if (!cancelled) setData({ ready: true, job: null });
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  /* ═══════════════════════════════════════════
     SUBMIT APPLICATION
  ═══════════════════════════════════════════ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: '', msg: '' });

    try {
      await api.post('/applications', {
        ...form,
        job_id: Number(id),
        position: data.job?.title || '',
      });
      setStatus({
        type: 'success',
        msg: '✅ Application submitted successfully! We will contact you soon.',
      });
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Submission failed' });
    } finally {
      setSubmitting(false);
    }
  };

  /* ═══════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════ */
  // Blank until ready
  if (!data.ready) {
    return <div className="min-h-screen bg-[#f0f2f5]" />;
  }

  // Job not found
  if (!data.job) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="mx-auto max-w-md text-center animate-fade-in">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <i className="fas fa-briefcase text-5xl" />
          </div>
          <h1 className="mt-6 text-3xl font-black text-dark">Job Not Found</h1>
          <p className="mt-3 text-gray-600">
            The job you're looking for might have been filled or removed.
          </p>
          <Link to="/join-us" className="btn-primary mt-8">
            <i className="fas fa-arrow-left" /> View All Jobs
          </Link>
        </div>
      </div>
    );
  }

  const { job } = data;

  return (
    <div className="animate-fade-in py-20">
      <div className="mx-auto max-w-4xl px-4">

        {/* ═══════ Breadcrumb ═══════ */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="transition hover:text-primary">Home</Link>
          <i className="fas fa-chevron-right text-xs" />
          <Link to="/join-us" className="transition hover:text-primary">Careers</Link>
          <i className="fas fa-chevron-right text-xs" />
          <span className="font-semibold text-dark">{job.title}</span>
        </nav>

        {/* ═══════ Job Header ═══════ */}
        <div className="card">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1">
              <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-green-700 ring-1 ring-green-200">
                <i className="fas fa-circle mr-1 text-[6px]" /> Open Position
              </span>
              <h1 className="mt-4 text-3xl font-black text-dark md:text-4xl">
                {job.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-3">
                {job.department && (
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                    <i className="fas fa-building text-xs" />
                    {job.department}
                  </div>
                )}
                {job.location && (
                  <div className="flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-sm font-semibold text-gray-700">
                    <i className="fas fa-map-marker-alt text-xs" />
                    {job.location}
                  </div>
                )}
              </div>
            </div>

            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-red-500 text-2xl text-white shadow-lg">
              <i className="fas fa-briefcase" />
            </div>
          </div>

          {/* Quick info */}
          <div className="mt-6 grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <i className="fas fa-clock" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Job Type</p>
                <p className="text-sm font-bold text-dark">Full Time</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                <i className="fas fa-calendar-check" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Posted</p>
                <p className="text-sm font-bold text-dark">
                  {job.created_at
                    ? new Date(job.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Recently'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <i className="fas fa-user-check" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Experience</p>
                <p className="text-sm font-bold text-dark">Any Level</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ Job Description ═══════ */}
        {job.description && (
          <div className="card mt-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg">
                <i className="fas fa-file-alt" />
              </div>
              <h2 className="text-xl font-black text-dark">Job Description</h2>
            </div>
            <div
              className="prose prose-sm max-w-none prose-headings:text-dark prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-dark"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>
        )}

        {/* ═══════ Apply Section ═══════ */}
        <div id="apply" className="card mt-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-red-500 text-white shadow-lg">
              <i className="fas fa-paper-plane" />
            </div>
            <div>
              <h2 className="text-xl font-black text-dark">Apply Now</h2>
              <p className="text-xs text-gray-500">
                Fill the form below to submit your application
              </p>
            </div>
          </div>

          {/* Status message */}
          {status.msg && (
            <div
              className={`mb-6 flex items-start gap-3 rounded-2xl p-4 text-sm font-medium ring-1 ${
                status.type === 'success'
                  ? 'bg-green-50 text-green-800 ring-green-200'
                  : 'bg-red-50 text-red-800 ring-red-200'
              }`}
            >
              <i
                className={`fas ${
                  status.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'
                } mt-0.5`}
              />
              <span>{status.msg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="label">
                Full Name <span className="text-primary">*</span>
              </label>
              <input
                required
                type="text"
                className="input"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Email + Phone */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label">
                  Email Address <span className="text-primary">*</span>
                </label>
                <input
                  required
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="label">
                  Phone Number <span className="text-primary">*</span>
                </label>
                <input
                  required
                  type="tel"
                  className="input"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="label">Message (Optional)</label>
              <textarea
                className="input"
                rows="4"
                placeholder="Tell us why you'd be a great fit for this role..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            {/* Submit */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-base px-8 py-3.5"
              >
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane" /> Submit Application
                  </>
                )}
              </button>

              <Link
                to="/join-us"
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 transition hover:text-primary"
              >
                <i className="fas fa-arrow-left" /> Back to Jobs
              </Link>
            </div>
          </form>
        </div>

        {/* ═══════ Bottom CTA ═══════ */}
        <div className="mt-6 rounded-3xl bg-gradient-to-br from-dark via-[#141428] to-primary p-6 text-center shadow-2xl sm:p-8">
          <h3 className="text-xl font-black text-white md:text-2xl">
            Not the right fit for you?
          </h3>
          <p className="mt-2 text-sm text-gray-300">
            Explore other open positions and find your perfect match.
          </p>
          <Link to="/join-us" className="btn-primary mt-6 text-sm">
            <i className="fas fa-briefcase" /> View All Jobs
          </Link>
        </div>

      </div>
    </div>
  );
}
