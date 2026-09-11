import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function Photos() {
  const [photos, setPhotos] = useState([]);
  const [form, setForm] = useState({ title: '', image_url: '', category: 'general' });
  const [loading, setLoading] = useState(false);

  const load = () => api.get('/photos').then(setPhotos).catch(console.error);

  useEffect(() => { load(); }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 500 * 1024) return alert('File too large (max 500KB)');
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, image_url: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/photos', form);
      setForm({ title: '', image_url: '', category: 'general' });
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this photo?')) return;
    await api.del(`/photos/${id}`);
    load();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Manage Photos</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-xl bg-white p-8 shadow-lg">
          <div>
            <label className="label">Title</label>
            <input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="label">Category</label>
            <input className="input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          </div>
          <div>
            <label className="label">Image URL</label>
            <input className="input" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
          </div>
          <div>
            <label className="label">Or Upload File (max 500KB) – stored as Base64 in DB</label>
            <input type="file" accept="image/*" onChange={handleFile} className="input" />
          </div>
          {form.image_url && <img src={form.image_url} alt="Preview" className="h-40 rounded-lg object-cover shadow" />}
          <button type="submit" disabled={loading} className="btn-primary text-lg px-8 py-3">
            {loading ? 'Saving…' : 'Add Photo'}
          </button>
        </form>

        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {photos.map(p => (
            <div key={p.id} className="relative overflow-hidden rounded-xl shadow-md">
              <img src={p.image_url} alt={p.title} className="h-48 w-full object-cover" />
              <button
                onClick={() => handleDelete(p.id)}
                className="absolute top-3 right-3 rounded-full bg-red-600 p-2.5 text-white shadow-lg hover:bg-red-700"
              >
                <i className="fas fa-trash text-sm" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
