import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import ServiceModal from '../components/ServiceModal';

export default function Services() {
  const [data, setData] = useState({
    ready: false,
    services: [],
  });
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  /* ═══════════════════════════════════════════
     LOAD SERVICES
  ═══════════════════════════════════════════ */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await api.get('/settings/services_list').catch(() => ({ value: [] }));
        if (cancelled) return;

        let services = [];
        if (Array.isArray(res.value)) {
          services = res.value;
        } else if (typeof res.value === 'string' && res.value.trim()) {
          try {
            const parsed = JSON.parse(res.value);
            if (Array.isArray(parsed)) services = parsed;
          } catch {}
        }

        setData({ ready: true, services });
      } catch (err) {
        console.error('Services load error:', err);
        if (!cancelled) setData({ ready: true, services: [] });
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

  const { services } = data;

  // Filter by search
  const filteredServices = searchQuery.trim()
    ? services.filter((s) => {
        const q = searchQuery.toLowerCase();
        return (
          (s.title || '').toLowerCase().includes(q) ||
          (s.description || '').toLowerCase().includes(q)
        );
      })
    : services;

  return (
    <div className="animate-fade-in py-24">
      <div className="mx-auto max-w-7xl px-4">

        {/* ═══════ Header ═══════ */}
        <div className="mb-16 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            What We Offer
          </span>
          <h1 className="section-title mt-4">Our Services</h1>
          <p className="section-subtitle">
            Comprehensive solutions tailored to your business needs.
          </p>
        </div>

        {/* ═══════ Stats Bar ═══════ */}
        {services.length > 0 && (
          <div className="mb-12 grid gap-4 sm:grid-cols-3">
            <div className="card flex items-center gap-4 !p-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-red-500 text-white shadow-lg">
                <i className="fas fa-th-large text-xl" />
              </div>
              <div>
                <p className="text-2xl font-black text-dark">{services.length}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Total Services
                </p>
              </div>
            </div>

            <div className="card flex items-center gap-4 !p-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
                <i className="fas fa-check-circle text-xl" />
              </div>
              <div>
                <p className="text-2xl font-black text-dark">100%</p>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Quality Assured
                </p>
              </div>
            </div>

            <div className="card flex items-center gap-4 !p-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg">
                <i className="fas fa-clock text-xl" />
              </div>
              <div>
                <p className="text-2xl font-black text-dark">24/7</p>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Support Available
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ═══════ Search Bar ═══════ */}
        {services.length > 3 && (
          <div className="mx-auto mb-10 max-w-lg">
            <div className="relative">
              <i className="fas fa-search pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services..."
                className="input !pl-12 !pr-12"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-600 transition hover:bg-gray-300"
                  aria-label="Clear search"
                >
                  <i className="fas fa-times" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="mt-3 text-center text-xs font-semibold text-gray-500">
                {filteredServices.length} service
                {filteredServices.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>
        )}

        {/* ═══════ Services Grid ═══════ */}
        {filteredServices.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((s, i) => (
              <button
                key={i}
                onClick={() => setSelectedService(s)}
                className="service-card group animate-fade-in-up text-left"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Icon */}
                <div className="service-icon-wrap">{s.icon}</div>

                {/* Title */}
                <h3 className="text-xl font-bold text-dark transition group-hover:text-primary">
                  {s.title}
                </h3>

                {/* Description */}
                <p className="mt-3 leading-relaxed text-gray-600">
                  {s.description}
                </p>

                {/* Learn more */}
                <div className="mt-6 flex items-center gap-2 border-t border-gray-100 pt-4 text-sm font-bold text-primary">
                  Learn more
                  <i className="fas fa-arrow-right text-xs transition group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* ═══════ Empty State ═══════ */
          <div className="mx-auto max-w-md rounded-3xl border-2 border-dashed border-gray-300 bg-white/50 p-12 text-center animate-fade-in">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <i className="fas fa-search text-4xl" />
            </div>
            <h3 className="mt-6 text-xl font-black text-dark">
              {services.length === 0 ? 'No Services Listed' : 'No Matching Services'}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {services.length === 0
                ? 'Services will appear here once added.'
                : `No services match "${searchQuery}". Try a different search.`}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="btn-primary mt-6 text-sm"
              >
                <i className="fas fa-times" /> Clear Search
              </button>
            )}
          </div>
        )}

        {/* ═══════ Why Choose Us ═══════ */}
        <div className="mt-24">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              Our Promise
            </span>
            <h2 className="section-title mt-4">What Makes Us Different</h2>
            <p className="section-subtitle">
              We deliver excellence through experience, quality, and integrity.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: 'fa-award', title: 'ISO Certified', desc: 'Certified quality processes.', color: 'from-blue-500 to-indigo-500' },
              { icon: 'fa-users', title: 'Expert Team', desc: 'Skilled professionals.', color: 'from-green-500 to-emerald-500' },
              { icon: 'fa-clock', title: 'On-Time Delivery', desc: 'We respect deadlines.', color: 'from-amber-500 to-orange-500' },
              { icon: 'fa-headset', title: '24/7 Support', desc: 'Always available.', color: 'from-purple-500 to-pink-500' },
            ].map((item, i) => (
              <div
                key={i}
                className="card animate-fade-in-up text-center"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                  <i className={`fas ${item.icon} text-xl`} />
                </div>
                <h3 className="mt-5 text-base font-bold text-dark">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════ Process Steps ═══════ */}
        <div className="mt-24">
          <div className="mb-12 text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              How It Works
            </span>
            <h2 className="section-title mt-4">Simple 4-Step Process</h2>
            <p className="section-subtitle">
              Getting started with us is easy.
            </p>
          </div>

          <div className="relative grid gap-8 md:grid-cols-4">
            <div className="absolute left-0 right-0 top-12 hidden h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block" />
            {[
              { num: '01', title: 'Consultation', desc: 'Discuss your needs with our team.', icon: 'fa-comments' },
              { num: '02', title: 'Planning', desc: 'We design a tailored solution.', icon: 'fa-clipboard-list' },
              { num: '03', title: 'Execution', desc: 'Our team delivers on time.', icon: 'fa-cogs' },
              { num: '04', title: 'Support', desc: 'Ongoing support and quality checks.', icon: 'fa-headset' },
            ].map((step, i) => (
              <div
                key={i}
                className="relative animate-fade-in-up text-center"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-red-500 text-white shadow-2xl">
                  <i className={`fas ${step.icon} text-3xl`} />
                  <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full bg-dark text-xs font-black text-white ring-4 ring-white">
                    {step.num}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-dark">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ═══════ CTA Strip ═══════ */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-red-500 to-primary p-8 shadow-2xl sm:p-12">
          <div className="text-center">
            <h3 className="text-2xl font-black text-white md:text-3xl">
              Need a Custom Service?
            </h3>
            <p className="mt-3 text-white/90">
              We offer tailored solutions for unique requirements.
              Get in touch to discuss your project.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-primary shadow-lg transition hover:scale-105"
              >
                <i className="fas fa-paper-plane" />
                Get Free Quote
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-white bg-transparent px-6 py-3 font-bold text-white transition hover:bg-white hover:text-primary"
              >
                <i className="fas fa-info-circle" />
                Learn More
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* ═══════ Service Modal ═══════ */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
}
