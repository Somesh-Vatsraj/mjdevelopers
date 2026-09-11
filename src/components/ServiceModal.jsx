import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ServiceModal({ service, onClose }) {
  // Escape + body scroll lock
  useEffect(() => {
    if (!service) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [service, onClose]);

  if (!service) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Modal Content */}
      <div
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-red-500 to-primary" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-dark shadow-lg backdrop-blur transition hover:bg-red-500 hover:text-white"
          aria-label="Close"
        >
          <i className="fas fa-times" />
        </button>

        {/* Body */}
        <div className="p-6 sm:p-8">
          {/* Icon + Title */}
          <div className="flex items-start gap-5">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-red-500 text-4xl shadow-lg">
              {service.icon}
            </div>
            <div className="flex-1">
              <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                Our Service
              </span>
              <h2 className="mt-2 text-2xl font-black text-dark sm:text-3xl">
                {service.title}
              </h2>
            </div>
          </div>

          {/* Description */}
          {service.description && (
            <div className="mt-6 rounded-2xl bg-gray-50 p-5 ring-1 ring-gray-100">
              <p className="leading-relaxed text-gray-700">
                {service.description}
              </p>
            </div>
          )}

          {/* Feature list — uses service.features if provided, else defaults */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {(Array.isArray(service.features) && service.features.length > 0
              ? service.features
              : ['Professional Team', 'Quality Assured', 'On-Time Delivery', '24/7 Support']
            ).map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <i className="fas fa-check text-xs" />
                </div>
                <span className="font-medium">{feat}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact"
              onClick={onClose}
              className="btn-primary flex-1 text-sm sm:flex-none"
            >
              <i className="fas fa-paper-plane" />
              Request Quote
            </Link>
            <button
              onClick={onClose}
              className="rounded-2xl border-2 border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 sm:flex-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
