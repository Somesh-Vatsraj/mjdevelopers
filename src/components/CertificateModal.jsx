import { useEffect } from 'react';

export default function CertificateModal({ cert, onClose }) {
  // Close on Escape key
  useEffect(() => {
    if (!cert) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    // Lock scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [cert, onClose]);

  if (!cert) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

      {/* Modal Content */}
      <div
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top color bar */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${cert.color || 'from-blue-500 to-indigo-500'}`} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-dark shadow-lg backdrop-blur transition hover:bg-red-500 hover:text-white"
          aria-label="Close"
        >
          <i className="fas fa-times" />
        </button>

        {/* Certificate Image / Icon */}
        <div className="relative flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8 sm:p-12">
          {cert.image ? (
            <img
              src={cert.image}
              alt={cert.name}
              className="max-h-[60vh] w-auto rounded-2xl shadow-2xl ring-1 ring-black/5"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div
              className={`flex h-40 w-40 items-center justify-center rounded-3xl bg-gradient-to-br ${
                cert.color || 'from-blue-500 to-indigo-500'
              } text-7xl text-white shadow-2xl`}
            >
              <i className={`fas ${cert.icon || 'fa-certificate'}`} />
            </div>
          )}

          {/* Verified Badge */}
          <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
            <i className="fas fa-check-circle" />
            Verified
          </div>
        </div>

        {/* Details */}
        <div className="border-t border-gray-100 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-dark sm:text-3xl">
                {cert.name}
              </h2>
              {cert.desc && (
                <p className="mt-2 text-gray-600">{cert.desc}</p>
              )}
            </div>
            <div
              className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${
                cert.color || 'from-blue-500 to-indigo-500'
              } text-2xl text-white shadow-lg`}
            >
              <i className={`fas ${cert.icon || 'fa-certificate'}`} />
            </div>
          </div>

          {/* Info row */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white p-4 ring-1 ring-gray-100">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Status
              </p>
              <p className="mt-1 flex items-center gap-2 font-bold text-green-600">
                <i className="fas fa-check-circle" />
                Valid & Registered
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-white p-4 ring-1 ring-gray-100">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Type
              </p>
              <p className="mt-1 font-bold text-dark">
                Official Certification
              </p>
            </div>
          </div>

          {/* Footer note */}
          <p className="mt-6 flex items-center gap-2 text-sm text-gray-500">
            <i className="fas fa-info-circle text-primary" />
            Documents available on request. Contact us for verification.
          </p>
        </div>
      </div>
    </div>
  );
}
