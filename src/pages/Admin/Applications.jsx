import { useEffect, useState } from 'react';
import { api } from '../../api/client';

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications')
      .then(setApps)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center">Loading…</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Position</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {apps.map(a => (
                <tr key={a.id} className="border-t">
                  <td className="p-4">{a.name}</td>
                  <td className="p-4">{a.email}</td>
                  <td className="p-4">{a.phone}</td>
                  <td className="p-4">{a.position || '—'}</td>
                  <td className="p-4">{new Date(a.submitted_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
