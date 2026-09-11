import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import TypeWriter from '../components/TypeWriter';
import CountUp from '../components/CountUp';
import CertificateModal from '../components/CertificateModal';

const DEFAULT_HERO_BG = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1600';

export default function Home() {
  // Page खुलते ही ये default दिखेगा
  const [data, setData] = useState({
    ready: false,
    brand: { short: 'MJ', line1: '', line2: '', tagline: '' },
    hero: {
      title: 'Welcome',
      subtitle: '',
      cta: 'Explore',
      badge: '',
      image: DEFAULT_HERO_BG,
    },
    stats: { projects: 0, customers: 0, branches: 0, manpower: 0 },
    contact: { email: '', phone: '', whatsapp: '', address: '' },
    founder: { name: '', title: '', image: '', message: '' },
    aboutPreview: { title: '', desc: '', image: '', features: [], badgeNumber: '', badgeLabel: '' },
    founderSection: { title: 'Meet Our Founder', subtitle: '' },
    trustBadges: [],
    industries: [],
    processSteps: [],
    testimonials: [],
    faqs: [],
    whyChooseUs: [],
    services: [],
    certificates: [],
    clients: [],
    cta: { title: '', subtitle: '' },
    finalCta: { title: '', subtitle: '' },
  });

  // For certificate modal
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const keys = [
          'nav_brand',
          'hero_title', 'hero_subtitle', 'hero_cta', 'hero_badge',
          'stats_projects', 'stats_customers', 'stats_branches', 'stats_manpower',
          'contact_email', 'contact_phone', 'contact_whatsapp', 'contact_address',
          'about_founder', 'about_founder_title', 'about_founder_image', 'about_founder_message',
          'about_preview_title', 'about_preview_desc', 'about_preview_image',
          'about_preview_features', 'about_preview_badge_number', 'about_preview_badge_label',
          'founder_section_title', 'founder_section_subtitle',
          'trust_badges_list',
          'industries_list', 'process_steps_list', 'testimonials_list', 'faqs_list',
          'why_choose_us', 'services_list', 'certificates_list', 'clients_list',
          'cta_title', 'cta_subtitle', 'final_cta_title', 'final_cta_subtitle',
          'page_image_home_hero',
        ];
        const results = await Promise.all(
          keys.map(k => api.get(`/settings/${k}`).catch(() => ({ value: '' })))
        );
        if (cancelled) return;

        const map = {};
        keys.forEach((k, i) => { map[k] = results[i].value; });

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

        let brand = { short: 'MJ', line1: '', line2: '', tagline: '', logo: '' };
        try {
          let b = map.nav_brand;
          if (typeof b === 'string' && b.trim()) b = JSON.parse(b);
          if (b && typeof b === 'object') brand = { ...brand, ...b };
        } catch {}

        const brandFull = [brand.line1, brand.line2].filter(Boolean).join(' ').trim();

        setData({
          ready: true,
          brand,
          hero: {
            title: map.hero_title || (brandFull ? `Welcome to ${brandFull}` : 'Welcome'),
            subtitle: map.hero_subtitle || '',
            cta: map.hero_cta || 'Explore Services',
            badge: map.hero_badge || '',
            image: map.page_image_home_hero || DEFAULT_HERO_BG,
          },
          stats: {
            projects: Number(map.stats_projects) || 0,
            customers: Number(map.stats_customers) || 0,
            branches: Number(map.stats_branches) || 0,
            manpower: Number(map.stats_manpower) || 0,
          },
          contact: {
            email: map.contact_email || '',
            phone: map.contact_phone || '',
            whatsapp: map.contact_whatsapp || '',
            address: map.contact_address || '',
          },
          founder: {
            name: map.about_founder || '',
            title: map.about_founder_title || '',
            image: map.about_founder_image || '',
            message: map.about_founder_message || '',
          },
          aboutPreview: {
            title: map.about_preview_title || '',
            desc: map.about_preview_desc || '',
            image: map.about_preview_image || '',
            features: asArray(map.about_preview_features, []),
            badgeNumber: map.about_preview_badge_number || '',
            badgeLabel: map.about_preview_badge_label || '',
          },
          founderSection: {
            title: map.founder_section_title || 'Meet Our Founder',
            subtitle: map.founder_section_subtitle || '',
          },
          trustBadges: asArray(map.trust_badges_list, []),
          industries: asArray(map.industries_list, []),
          processSteps: asArray(map.process_steps_list, []),
          testimonials: asArray(map.testimonials_list, []),
          faqs: asArray(map.faqs_list, []),
          whyChooseUs: asArray(map.why_choose_us, []),
          services: asArray(map.services_list, []),
          certificates: asArray(map.certificates_list, []),
          clients: asArray(map.clients_list, []),
          cta: {
            title: map.cta_title || '',
            subtitle: map.cta_subtitle || '',
          },
          finalCta: {
            title: map.final_cta_title || '',
            subtitle: map.final_cta_subtitle || '',
          },
        });
      } catch (err) {
        console.error('Home load error:', err);
        if (!cancelled) setData(prev => ({ ...prev, ready: true }));
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const stats = [
    { label: 'Projects', value: data.stats.projects, icon: 'fa-building' },
    { label: 'Customers', value: data.stats.customers, icon: 'fa-users' },
    { label: 'Branches', value: data.stats.branches, icon: 'fa-map-marker-alt' },
    { label: 'Manpower', value: data.stats.manpower, icon: 'fa-user-tie' },
  ];
  const hasStats = data.stats.projects > 0 || data.stats.customers > 0 || data.stats.branches > 0 || data.stats.manpower > 0;

  return (
    <div className="overflow-hidden">

      {/* ═══════ SECTION 1: HERO (instant render) ═══════ */}
      <section
        className="hero-full relative bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${data.hero.image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/60 to-primary/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.7)_100%)]" />
        <div className="absolute left-10 top-20 h-32 w-32 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute bottom-32 right-10 h-40 w-40 rounded-full bg-red-500/20 blur-3xl animate-float-slow" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center text-white">
          {data.hero.badge && (
            <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              {data.hero.badge}
            </div>
          )}

          <h1 className="hero-title min-h-[1.2em]">
            <TypeWriter text={data.hero.title} speed={70} delay={200} cursor={true} />
          </h1>

          {data.hero.subtitle && (
            <p className="hero-subtitle mt-8 min-h-[2.5em] text-gray-200">
              <TypeWriter
                text={data.hero.subtitle}
                speed={35}
                delay={data.hero.title.length * 70 + 400}
                cursor={true}
              />
            </p>
          )}

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/services" className="btn-primary text-base px-8 py-4">
              {data.hero.cta} <i className="fas fa-arrow-right" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/30 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <i className="fas fa-phone" /> Get in Touch
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
          <i className="fas fa-chevron-down text-2xl text-white/70" />
        </div>
      </section>

      {/* ═══════ SECTION 2: TRUST BAR ═══════ */}
      {data.trustBadges.length > 0 && (
        <section className="animate-fade-in-up border-y border-primary/20 bg-dark py-6">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-semibold uppercase tracking-widest text-white/70 md:gap-12">
              {data.trustBadges.map((badge, i) => (
                <span key={i} className="flex items-center gap-2">
                  <i className="fas fa-check-circle text-primary" />
                  {typeof badge === 'string' ? badge : badge.text || ''}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ SECTION 3: STATS ═══════ */}
      {hasStats && (
        <section className="relative animate-fade-in-up bg-[#f0f2f5] py-24">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #1a1a2e 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="relative mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="stat-card animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="stat-icon mx-auto mb-5">
                    <i className={`fas ${s.icon}`} />
                  </div>
                  <p className="text-4xl font-black tracking-tight text-dark md:text-5xl">
                    <CountUp end={s.value} duration={2000 + i * 200} suffix="+" />
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ SECTION 4: ABOUT PREVIEW ═══════ */}
      {(data.aboutPreview.title || data.aboutPreview.desc) && (
        <section className="animate-fade-in-up bg-white py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/20 to-transparent blur-2xl" />
                {data.aboutPreview.image ? (
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5">
                    <img
                      src={data.aboutPreview.image}
                      alt="About"
                      className="h-auto w-full"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    {data.aboutPreview.badgeNumber && (
                      <div className="absolute bottom-6 left-6 rounded-2xl bg-white/95 px-5 py-3 shadow-2xl backdrop-blur-md">
                        <p className="text-3xl font-black text-primary">
                          {data.aboutPreview.badgeNumber}
                        </p>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                          {data.aboutPreview.badgeLabel}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-80 w-full items-center justify-center rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
                    <i className="fas fa-image text-5xl" />
                  </div>
                )}
              </div>

              <div>
                <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                  About Us
                </span>
                {data.aboutPreview.title && (
                  <h2 className="mt-4 text-4xl font-black leading-tight text-dark md:text-5xl">
                    {data.aboutPreview.title}
                  </h2>
                )}
                {data.aboutPreview.desc && (
                  <p className="mt-6 text-lg leading-relaxed text-gray-600">
                    {data.aboutPreview.desc}
                  </p>
                )}
                {data.aboutPreview.features.length > 0 && (
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {data.aboutPreview.features.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <i className="fas fa-check" />
                        </div>
                        <span className="font-semibold text-gray-700">
                          {typeof item === 'string' ? item : item.text || ''}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                <Link to="/about" className="btn-primary mt-10">
                  Learn More <i className="fas fa-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ SECTION 5: FOUNDER ═══════ */}
      {data.founder.name && (
        <section className="relative animate-fade-in-up overflow-hidden bg-gradient-to-br from-[#f8f9fc] via-white to-[#f0f2f5] py-24">
          <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-red-500/5 blur-3xl" />
          <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 select-none text-[200px] font-black leading-none text-primary/5">
            "
          </div>

          <div className="relative mx-auto max-w-7xl px-4">
            <div className="mb-16 text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                Leadership
              </span>
              <h2 className="section-title mt-4">{data.founderSection.title}</h2>
              {data.founderSection.subtitle && (
                <p className="section-subtitle">{data.founderSection.subtitle}</p>
              )}
            </div>

            <div className="grid items-center gap-16 lg:grid-cols-5">
              <div className="relative lg:col-span-2">
                <div className="relative mx-auto max-w-sm">
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/30 to-red-500/20 blur-2xl" />
                  <div className="absolute inset-0 rotate-6 rounded-3xl bg-gradient-to-br from-primary to-red-500 shadow-2xl" />
                  <div className="relative -rotate-3 overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5 transition-transform duration-500 hover:rotate-0">
                    {data.founder.image ? (
                      <img
                        src={data.founder.image}
                        alt={data.founder.name}
                        className="aspect-[4/5] w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[4/5] w-full items-center justify-center bg-gray-100 text-gray-400">
                        <i className="fas fa-user text-6xl" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur-md">
                      <p className="text-lg font-black text-dark">{data.founder.name}</p>
                      {data.founder.title && (
                        <p className="text-xs font-bold uppercase tracking-widest text-primary">
                          {data.founder.title}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="absolute -left-4 -top-4 h-20 w-20 rounded-2xl border-4 border-primary/30" />
                  <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-2xl bg-primary/20 blur-md" />
                </div>
              </div>

              <div className="lg:col-span-3">
                <div className="relative">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-red-500 text-2xl text-white shadow-xl">
                    <i className="fas fa-quote-left" />
                  </div>
                  <h3 className="text-3xl font-black leading-tight text-dark md:text-4xl">
                    A Message from Our Founder
                  </h3>
                  {data.founder.message && (
                    <div className="relative mt-6">
                      <div className="absolute bottom-0 left-0 top-0 w-1 rounded-full bg-gradient-to-b from-primary via-red-500 to-primary" />
                      <p className="pl-6 text-lg italic leading-relaxed text-gray-700">
                        "{data.founder.message}"
                      </p>
                    </div>
                  )}
                  <div className="mt-8 flex items-center gap-4">
                    <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
                    <div className="text-right">
                      <p
                        className="text-2xl font-black italic text-dark"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {data.founder.name}
                      </p>
                      {data.founder.title && (
                        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-primary">
                          {data.founder.title}
                        </p>
                      )}
                    </div>
                  </div>
                  <Link to="/about" className="btn-primary mt-10">
                    Read Full Story <i className="fas fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ SECTION 6: CERTIFICATES (CLICKABLE) ═══════ */}
      {data.certificates.length > 0 && (
        <section className="animate-fade-in-up bg-white py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-16 text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                Trust & Compliance
              </span>
              <h2 className="section-title mt-4">Certificates & Registrations</h2>
              <p className="section-subtitle">
                Click on any certificate to view details
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
              {data.certificates.map((cert, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCert(cert)}
                  className="group relative animate-fade-in-up text-left"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="relative overflow-hidden rounded-3xl bg-white p-6 text-center shadow-lg ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:ring-primary/30">
                    {/* Top color bar */}
                    <div
                      className={`absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r ${
                        cert.color || 'from-blue-500 to-indigo-500'
                      }`}
                    />

                    {/* Image / Icon */}
                    {cert.image ? (
                      <div className="mx-auto h-16 w-16 overflow-hidden rounded-2xl bg-gray-50 shadow-lg ring-1 ring-black/5 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                        <img
                          src={cert.image}
                          alt={cert.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${
                          cert.color || 'from-blue-500 to-indigo-500'
                        } text-2xl text-white shadow-lg transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110`}
                      >
                        <i className={`fas ${cert.icon || 'fa-certificate'}`} />
                      </div>
                    )}

                    {/* Name */}
                    <p className="mt-4 text-sm font-black leading-tight text-dark">
                      {cert.name}
                    </p>

                    {/* Desc */}
                    {cert.desc && (
                      <p className="mt-1 text-[10px] font-semibold uppercase leading-tight tracking-wider text-gray-500">
                        {cert.desc}
                      </p>
                    )}

                    {/* View hint on hover */}
                    <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary opacity-0 transition group-hover:opacity-100">
                      <i className="fas fa-eye text-[8px]" />
                      View
                    </div>

                    {/* Verified badge */}
                    <div className="absolute bottom-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-[8px] text-white shadow-lg">
                      <i className="fas fa-check" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ SECTION 7: CLIENTS ═══════ */}
      {data.clients.length > 0 && (
        <section className="animate-fade-in-up bg-gradient-to-br from-[#f8f9fc] via-[#f0f2f5] to-[#f8f9fc] py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-16 text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                Trusted By
              </span>
              <h2 className="section-title mt-4">Our Esteemed Clients</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {data.clients.map((client, i) => (
                <div
                  key={i}
                  className="group relative animate-fade-in-up overflow-hidden rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className="relative flex flex-col items-center text-center">
                    {client.logo ? (
                      <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5 transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110">
                        <img
                          src={client.logo}
                          alt={client.name}
                          className="h-full w-full object-contain p-1"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-dark to-[#2a2a4e] text-lg font-black text-white shadow-lg transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110">
                        {(client.name || 'CL').split(' ').slice(0, 2).map((w) => w[0]).join('')}
                      </div>
                    )}
                    <p className="mt-4 line-clamp-2 flex min-h-[2.5rem] items-center text-sm font-black leading-tight text-dark">
                      {client.name}
                    </p>
                    {client.type && (
                      <span className="mt-2 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                        {client.type}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ SECTION 8: SERVICES ═══════ */}
      {data.services.length > 0 && (
        <section className="animate-fade-in-up bg-gray-50 py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-16 text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                What We Do
              </span>
              <h2 className="section-title mt-4">Our Core Services</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.services.slice(0, 6).map((s, i) => (
                <div
                  key={i}
                  className="service-card animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="service-icon-wrap">{s.icon}</div>
                  <h3 className="text-xl font-bold text-dark">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-gray-600">{s.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-14 text-center">
              <Link to="/services" className="btn-outline text-base">
                View All Services <i className="fas fa-arrow-right" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ SECTION 9: INDUSTRIES ═══════ */}
      {data.industries.length > 0 && (
        <section className="animate-fade-in-up bg-white py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-16 text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                Industries
              </span>
              <h2 className="section-title mt-4">Industries We Serve</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {data.industries.map((ind, i) => (
                <div
                  key={i}
                  className="group card animate-fade-in-up py-8 text-center"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div
                    className={`mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${
                      ind.color || 'from-blue-500 to-indigo-500'
                    } text-2xl text-white shadow-lg transition group-hover:scale-110`}
                  >
                    <i className={`fas ${ind.icon}`} />
                  </div>
                  <p className="mt-4 font-bold text-dark">{ind.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ SECTION 10: WHY CHOOSE US ═══════ */}
      {data.whyChooseUs.length > 0 && (
        <section className="animate-fade-in-up bg-gradient-to-br from-[#f0f2f5] via-white to-[#f0f2f5] py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-16 text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                Our Advantages
              </span>
              <h2 className="section-title mt-4">Why Choose Us</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.whyChooseUs.map((item, i) => (
                <div key={i} className="card animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="service-icon-wrap">{item.icon}</div>
                  <h3 className="text-xl font-bold text-dark">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ SECTION 11: HOW WE WORK ═══════ */}
      {data.processSteps.length > 0 && (
        <section className="animate-fade-in-up bg-white py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-16 text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                Our Process
              </span>
              <h2 className="section-title mt-4">How We Work</h2>
            </div>
            <div className="relative grid gap-8 md:grid-cols-4">
              <div className="absolute left-0 right-0 top-12 hidden h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block" />
              {data.processSteps.map((step, i) => (
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
                  <h3 className="mt-6 text-xl font-bold text-dark">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ SECTION 12: TESTIMONIALS ═══════ */}
      {data.testimonials.length > 0 && (
        <section className="animate-fade-in-up bg-dark py-24">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-16 text-center">
              <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                Testimonials
              </span>
              <h2 className="mt-4 text-4xl font-black text-white md:text-5xl">
                What Our Clients Say
              </h2>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {data.testimonials.map((t, i) => (
                <div
                  key={i}
                  className="animate-fade-in-up rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition hover:border-primary/40 hover:bg-white/10"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex gap-1 text-yellow-400">
                    {[...Array(5)].map((_, j) => (
                      <i key={j} className="fas fa-star" />
                    ))}
                  </div>
                  <p className="mt-6 leading-relaxed text-gray-200">"{t.text}"</p>
                  <div className="mt-6 flex items-center gap-4 border-t border-white/10 pt-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-red-500 text-lg font-black text-white">
                      {(t.name || '?').charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{t.name}</p>
                      {t.role && <p className="text-xs text-gray-400">{t.role}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ SECTION 13: CTA STRIP ═══════ */}
      {data.cta.title && (
        <section className="animate-fade-in-up bg-gradient-to-r from-primary via-red-500 to-primary py-16">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 md:flex-row">
            <div>
              <h3 className="text-2xl font-black text-white md:text-4xl">{data.cta.title}</h3>
              {data.cta.subtitle && <p className="mt-2 text-white/90">{data.cta.subtitle}</p>}
            </div>
            {data.contact.phone && (
              <a
                href={`tel:${data.contact.phone}`}
                className="inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-bold text-primary shadow-2xl transition hover:scale-105"
              >
                <i className="fas fa-phone-volume text-xl" />
                <span>{data.contact.phone}</span>
              </a>
            )}
          </div>
        </section>
      )}

      {/* ═══════ SECTION 14: FAQ ═══════ */}
      {data.faqs.length > 0 && (
        <section className="animate-fade-in-up bg-white py-24">
          <div className="mx-auto max-w-4xl px-4">
            <div className="mb-16 text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                FAQ
              </span>
              <h2 className="section-title mt-4">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {data.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group rounded-2xl border-2 border-gray-100 bg-white p-6 transition hover:border-primary/30 open:border-primary/50 open:shadow-lg"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between font-bold text-dark">
                    <span className="pr-4">{faq.q}</span>
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition group-open:rotate-180 group-open:bg-primary group-open:text-white">
                      <i className="fas fa-chevron-down text-sm" />
                    </span>
                  </summary>
                  <p className="mt-4 leading-relaxed text-gray-600">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ SECTION 15: FINAL CTA ═══════ */}
      {data.finalCta.title && (
        <section className="relative animate-fade-in-up overflow-hidden bg-gradient-to-br from-dark via-[#141428] to-primary py-24">
          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <h2 className="whitespace-pre-line text-4xl font-black leading-tight text-white md:text-6xl">
              {data.finalCta.title}
            </h2>
            {data.finalCta.subtitle && (
              <p className="mt-6 text-lg text-gray-300">{data.finalCta.subtitle}</p>
            )}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/contact" className="btn-primary text-base px-8 py-4">
                <i className="fas fa-paper-plane" /> Contact Us Now
              </Link>
              <Link
                to="/join-us"
                className="btn-outline border-white bg-white/10 text-base text-white px-8 py-4 hover:bg-white hover:text-dark"
              >
                <i className="fas fa-briefcase" /> View Careers
              </Link>
            </div>
            {(data.contact.email || data.contact.phone) && (
              <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
                {data.contact.email && (
                  <span className="flex items-center gap-2">
                    <i className="fas fa-envelope text-primary" /> {data.contact.email}
                  </span>
                )}
                {data.contact.phone && (
                  <span className="flex items-center gap-2">
                    <i className="fas fa-phone text-primary" /> {data.contact.phone}
                  </span>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════ CERTIFICATE MODAL ═══════ */}
      {selectedCert && (
        <CertificateModal
          cert={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}

    </div>
  );
}
