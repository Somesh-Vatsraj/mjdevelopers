import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ id: null, title: '', department: '', location: '', description: '' });
  const [loading, setLoading] = useState(false);

  const load = () => api.get('/jobs').then(setJobs).catch(console.error);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (form.id) await api.put(`/jobs/${form.id}`, form);
      else await api.post('/jobs', form);
      setForm({ id: null, title: '', department: '', location: '', description: '' });
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => setForm(job);

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return;
    await api.del(`/jobs/${id}`);
    load();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Manage Jobs</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-xl bg-white p-8 shadow-lg">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="label">Title</label>
              <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="label">Department</label>
              <input className="input" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label">Description (HTML allowed)</label>
            <textarea className="input" rows="5" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="btn-primary text-lg px-8 py-3">
              {loading ? 'Saving…' : form.id ? 'Update Job' : 'Add Job'}
            </button>
            {form.id && (
              <button type="button" onClick={() => setForm({ id: null, title: '', department: '', location: '', description: '' })} className="btn-outline text-lg px-8 py-3">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="mt-12 space-y-4">
          {jobs.map(job => (
            <div key={job.id} className="flex items-center justify-between rounded-xl bg-white p-6 shadow-md">
              <div>
                <p className="text-xl font-semibold">{job.title}</p>
                <p className="text-gray-500">{job.department} • {job.location}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => handleEdit(job)} className="rounded-lg bg-blue-100 px-4 py-2 text-blue-700 font-medium hover:bg-blue-200">Edit</button>
                <button onClick={() => handleDelete(job.id)} className="rounded-lg bg-red-100 px-4 py-2 text-red-700 font-medium hover:bg-red-200">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
