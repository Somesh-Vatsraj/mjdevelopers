import { useEffect, useState } from 'react';
import { api } from '../api/client';
import CertificateModal from '../components/CertificateModal';

/* ═══════════════════════════════════════════════
   GENERIC FALLBACKS
═══════════════════════════════════════════════ */
const DEFAULT_MISSION_POINTS = [
  'Quality Assurance',
  'Timely Delivery',
  'Customer Satisfaction',
  'Skilled Workforce',
  'Safety First',
];

// Map gradient color to bg + ring classes for certificate cards
const COLOR_STYLES = {
  'from-green-500 to-emerald-500': { bg: 'from-green-50 to-emerald-50', ring: 'ring-green-200', icon: 'bg-green-500' },
  'from-blue-500 to-indigo-500': { bg: 'from-blue-50 to-indigo-50', ring: 'ring-blue-200', icon: 'bg-blue-500' },
  'from-purple-500 to-pink-500': { bg: 'from-purple-50 to-pink-50', ring: 'ring-purple-200', icon: 'bg-purple-500' },
  'from-orange-500 to-amber-500': { bg: 'from-orange-50 to-amber-50', ring: 'ring-orange-200', icon: 'bg-orange-500' },
  'from-red-500 to-rose-500': { bg: 'from-red-50 to-rose-50', ring: 'ring-red-200', icon: 'bg-red-500' },
  'from-teal-500 to-cyan-500': { bg: 'from-teal-50 to-cyan-50', ring: 'ring-teal-200', icon: 'bg-teal-500' },
  'from-cyan-500 to-blue-500': { bg: 'from-cyan-50 to-blue-50', ring: 'ring-cyan-200', icon: 'bg-cyan-500' },
  'from-pink-500 to-rose-500': { bg: 'from-pink-50 to-rose-50', ring: 'ring-pink-200', icon: 'bg-pink-500' },
  'from-amber-500 to-yellow-500': { bg: 'from-amber-50 to-yellow-50', ring: 'ring-amber-200', icon: 'bg-amber-500' },
  'from-primary to-red-500': { bg: 'from-red-50 to-pink-50', ring: 'ring-red-200', icon: 'bg-primary' },
};

export default function About() {
  const [data, setData] = useState({
    ready: false,
    brand: { short: '', line1: '', line2: '', tagline: '' },
    about: {
      introTitle: '',
      introDesc: '',
      introImage: '',
      company: '',
      corporateOffice: '',
      mission: '',
      missionPoints: [],
    },
    founder: {
      name: '',
      title: '',
      image: '',
    },
    certificates: [],
  });

  const [selectedCert, setSelectedCert] = useState(null);

  /* ═══════════════════════════════════════════
     LOAD DATA
  ═══════════════════════════════════════════ */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const keys = [
          'nav_brand',
          'about_company', 'about_corporate_office', 'about_founder',
          'about_founder_title', 'about_founder_image',
          'about_mission', 'about_mission_points',
          'about_intro_title', 'about_intro_desc', 'about_intro_image',
          'certificates_list',
        ];
        const res = await Promise.all(
          keys.map(k => api.get(`/settings/${k}`).catch(() => ({ value: '' })))
        );
        if (cancelled) return;

        const map = {};
        keys.forEach((k, i) => { map[k] = res[i].value; });

        /* ---- Helper: Parse Array ---- */
        const asArray = (val, fallback = []) => {
          if (Array.isArray(val)) return val.length > 0 ? val : fallback;
          if (typeof val === 'string' && val.trim()) {
            try {
              const p = JSON.parse(val);
              if (Array.isArray(p) && p.length > 0) return p;
            } catch {}
          }
          return fallback;
        };

        /* ---- Brand ---- */
        let brand = { short: '', line1: '', line2: '', tagline: '' };
        try {
          let b = map.nav_brand;
          if (typeof b === 'string' && b.trim()) b = JSON.parse(b);
          if (b && typeof b === 'object') {
            brand = {
              short: b.short || '',
              line1: b.line1 || '',
              line2: b.line2 || '',
              tagline: b.tagline || '',
            };
          }
        } catch {}

        /* ---- Set State ---- */
        setData({
          ready: true,
          brand,
          about: {
            introTitle: map.about_intro_title || '',
            introDesc: map.about_intro_desc || '',
            introImage: map.about_intro_image || '',
            company: map.about_company || brand.line1 || '',
            corporateOffice: map.about_corporate_office || '',
            mission: map.about_mission || '',
            missionPoints: asArray(map.about_mission_points, DEFAULT_MISSION_POINTS),
          },
          founder: {
            name: map.about_founder || '',
            title: map.about_founder_title || '',
            image: map.about_founder_image || '',
          },
          certificates: asArray(map.certificates_list, []),
        });
      } catch (err) {
        console.error('About load error:', err);
        if (!cancelled) setData(prev => ({ ...prev, ready: true }));
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  /* ═══════════════════════════════════════════
     DERIVED
  ═══════════════════════════════════════════ */
  const { brand, about, founder, certificates } = data;
  const brandFull = [brand.line1, brand.line2].filter(Boolean).join(' ').trim() || 'Our Company';
  const hasCertificates = certificates && certificates.length > 0;

  /* ═══════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════ */
  // Show nothing until ready (blank page → smooth fade-in)
  if (!data.ready) {
    return <div className="min-h-screen bg-[#f0f2f5]" />;
  }

  return (
    <div className="animate-fade-in py-24">
      <div className="mx-auto max-w-7xl px-4">

        {/* ═══════ Header ═══════ */}
        <div className="mb-16 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            Who We Are
          </span>
          <h1 className="section-title mt-4">
            About {brand.line1 || 'Us'}
          </h1>
          {brand.tagline && (
            <p className="section-subtitle">{brand.tagline}</p>
          )}
        </div>

        {/* ═══════ Intro Section ═══════ */}
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Image */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent blur-2xl" />
            {about.introImage ? (
              <img
                src={about.introImage}
                alt={about.introTitle || brandFull}
                className="relative w-full rounded-3xl shadow-2xl ring-1 ring-black/5"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="relative flex h-80 w-full items-center justify-center rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                <i className="fas fa-image text-5xl" />
              </div>
            )}
          </div>

          {/* Text */}
          <div>
            {about.introTitle && (
              <h2 className="text-3xl font-black text-dark md:text-4xl">
                {about.introTitle}
              </h2>
            )}
            {about.introDesc && (
              <p className="mt-6 text-lg leading-relaxed text-gray-600">
                {about.introDesc}
              </p>
            )}

            {/* Info cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {about.company && (
                <div className="glass-card">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    Company
                  </p>
                  <p className="mt-1 font-semibold text-dark">{about.company}</p>
                </div>
              )}
              {(founder.name || founder.title) && (
                <div className="glass-card">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    Founder
                  </p>
                  {founder.name && (
                    <p className="mt-1 font-semibold text-dark">{founder.name}</p>
                  )}
                  {founder.title && (
                    <p className="text-xs text-gray-500">{founder.title}</p>
                  )}
                </div>
              )}
            </div>

            {about.corporateOffice && (
              <div className="glass-card mt-4">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Corporate Office
                </p>
                <p className="mt-1 text-sm font-semibold text-dark">
                  {about.corporateOffice}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ═══════ Mission & Certifications ═══════ */}
        <div className="mt-24 grid gap-8 md:grid-cols-2">

          {/* Mission Card */}
          <div className="card">
            <div className="service-icon-wrap mb-6">
              <i className="fas fa-bullseye" />
            </div>
            <h3 className="text-2xl font-black text-dark">Our Mission</h3>
            {about.mission && (
              <p className="mt-4 leading-relaxed text-gray-600">{about.mission}</p>
            )}
            {about.missionPoints && about.missionPoints.length > 0 && (
              <ul className="mt-6 space-y-3">
                {about.missionPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <i className="fas fa-check-circle mt-1 text-primary" />
                    <span className="font-medium">
                      {typeof p === 'string' ? p : p.text || ''}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Certifications Card */}
          <div className="card">
            <div className="service-icon-wrap mb-6">
              <i className="fas fa-certificate" />
            </div>
            <h3 className="text-2xl font-black text-dark">Certifications</h3>
            <p className="mt-4 text-gray-600">
              We are certified and recognized for our quality standards.
              {hasCertificates && ' Click any to view details.'}
            </p>

            {hasCertificates && (
              <div className="mt-8 space-y-4">
                {certificates.map((cert, i) => {
                  const style = COLOR_STYLES[cert.color] || COLOR_STYLES['from-blue-500 to-indigo-500'];
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className={`group flex w-full items-center gap-4 rounded-2xl bg-gradient-to-r ${style.bg} p-4 text-left ring-1 ${style.ring} transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg`}
                    >
                      {cert.image ? (
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105">
                          <img
                            src={cert.image}
                            alt={cert.name}
                            className="h-full w-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      ) : (
                        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${style.icon} text-white shadow-lg transition-transform duration-300 group-hover:scale-105`}>
                          <i className={`fas ${cert.icon || 'fa-certificate'} text-xl`} />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-bold text-dark">{cert.name}</p>
                        {cert.desc && (
                          <p className="text-xs text-gray-500">{cert.desc}</p>
                        )}
                      </div>
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white/80 text-primary opacity-0 shadow-sm transition group-hover:opacity-100">
                        <i className="fas fa-eye text-xs" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {!hasCertificates && (
              <p className="mt-6 text-sm text-gray-500">
                Certifications will appear here once added.
              </p>
            )}
          </div>
        </div>

        {/* ═══════ Founder Full Section ═══════ */}
        {founder.name && founder.image && (
          <div className="mt-24 grid items-center gap-12 md:grid-cols-2">
            <div className="relative order-2 md:order-1">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent blur-2xl" />
              <img
                src={founder.image}
                alt={founder.name}
                className="relative w-full rounded-3xl shadow-2xl ring-1 ring-black/5"
              />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur-md">
                <p className="text-lg font-black text-dark">{founder.name}</p>
                {founder.title && (
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    {founder.title}
                  </p>
                )}
              </div>
            </div>

            <div className="order-1 md:order-2">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                Leadership
              </span>
              <h2 className="mt-4 text-3xl font-black text-dark md:text-4xl">
                Meet Our Founder
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-gray-600">
                {founder.name} leads {brandFull} with a vision to deliver reliable, quality-driven services
                across Bihar and beyond. With years of experience and a commitment to excellence,
                our founder continues to inspire our team every day.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* ═══════ Certificate Modal ═══════ */}
      {selectedCert && (
        <CertificateModal
          cert={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
}
