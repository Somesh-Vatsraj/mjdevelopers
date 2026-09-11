import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function Contact() {
  const [data, setData] = useState({
    ready: false,
    contact: {
      email: '',
      phone: '',
      whatsapp: '',
      address: '',
      iso: '',
    },
  });

  /* ═══════════════════════════════════════════
     LOAD DATA
  ═══════════════════════════════════════════ */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const keys = [
          'contact_email',
          'contact_phone',
          'contact_whatsapp',
          'contact_address',
          'contact_iso',
        ];
        const res = await Promise.all(
          keys.map((k) => api.get(`/settings/${k}`).catch(() => ({ value: '' })))
        );
        if (cancelled) return;

        const map = {};
        keys.forEach((k, i) => { map[k] = res[i].value; });

        setData({
          ready: true,
          contact: {
            email: map.contact_email || '',
            phone: map.contact_phone || '',
            whatsapp: map.contact_whatsapp || '',
            address: map.contact_address || '',
            iso: map.contact_iso || '',
          },
        });
      } catch (err) {
        console.error('Contact load error:', err);
        if (!cancelled) setData(prev => ({ ...prev, ready: true }));
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const { contact } = data;

  /* ═══════════════════════════════════════════
     CONTACT CARDS
     prefix: 'fas' = solid (default)
     prefix: 'fab' = brands (whatsapp, facebook, etc.)
  ═══════════════════════════════════════════ */
  const cards = [
    {
      icon: 'fa-envelope',
      prefix: 'fas',
      label: 'Email Us',
      value: contact.email,
      href: contact.email ? `mailto:${contact.email}` : null,
      color: 'from-blue-500 to-indigo-500',
      action: 'Send Email',
    },
    {
      icon: 'fa-phone',
      prefix: 'fas',
      label: 'Call Us',
      value: contact.phone,
      href: contact.phone ? `tel:${contact.phone}` : null,
      color: 'from-green-500 to-emerald-500',
      action: 'Call Now',
    },
    {
      icon: 'fa-whatsapp',
      prefix: 'fab', // ← WhatsApp is a BRAND icon
      label: 'WhatsApp',
      value: contact.whatsapp,
      href: contact.whatsapp ? `https://wa.me/91${contact.whatsapp}` : null,
      color: 'from-emerald-500 to-teal-500',
      action: 'Chat Now',
    },
    {
      icon: 'fa-map-marker-alt',
      prefix: 'fas',
      label: 'Visit Us',
      value: contact.address,
      href: contact.address
        ? `https://www.google.com/maps/search/${encodeURIComponent(contact.address)}`
        : null,
      color: 'from-primary to-red-500',
      action: 'View Map',
    },
    {
      icon: 'fa-certificate',
      prefix: 'fas',
      label: 'Certification',
      value: contact.iso,
      href: null,
      color: 'from-purple-500 to-pink-500',
      action: null,
    },
  ].filter((c) => c.value);

  /* ═══════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════ */
  if (!data.ready) {
    return <div className="min-h-screen bg-[#f0f2f5]" />;
  }

  return (
    <div className="animate-fade-in py-24">
      <div className="mx-auto max-w-7xl px-4">

        {/* ═══════ Header ═══════ */}
        <div className="mb-16 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            Get in Touch
          </span>
          <h1 className="section-title mt-4">Contact Us</h1>
          <p className="section-subtitle">
            We'd love to hear from you. Reach out for any queries or service requests.
          </p>
        </div>

        {/* ═══════ Contact Cards ═══════ */}
        {cards.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((c, i) => (
              <div
                key={i}
                className="card group animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Icon — uses correct prefix (fas/fab) */}
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${c.color} text-2xl text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
                >
                  <i className={`${c.prefix} ${c.icon}`} />
                </div>

                {/* Label */}
                <h3 className="mt-5 text-lg font-bold text-dark">{c.label}</h3>

                {/* Value */}
                {c.href ? (
                  <a
                    href={c.href}
                    target={c.icon === 'fa-map-marker-alt' ? '_blank' : undefined}
                    rel="noreferrer"
                    className="mt-2 block break-words leading-relaxed text-gray-600 transition hover:text-primary"
                  >
                    {c.value}
                  </a>
                ) : (
                  <p className="mt-2 break-words leading-relaxed text-gray-600">
                    {c.value}
                  </p>
                )}

                {/* Action link */}
                {c.action && c.href && (
                  <div className="mt-5 flex items-center gap-2 text-sm font-bold text-primary">
                    {c.action}
                    <i className="fas fa-arrow-right text-xs transition group-hover:translate-x-1" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ═══════ Business Hours + Quick Info ═══════ */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {/* Business Hours */}
          <div className="card">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-2xl text-white shadow-lg">
              <i className="fas fa-clock" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-dark">Business Hours</h3>
            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Mon - Fri</span>
                <span className="font-semibold text-dark">9:00 AM - 7:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span className="font-semibold text-dark">9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span className="font-semibold text-primary">Emergency Only</span>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <div className="card">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 text-2xl text-white shadow-lg">
              <i className="fas fa-bolt" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-dark">Quick Response</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              We respond to all inquiries within <strong>24 hours</strong>. For
              urgent matters, call us directly.
            </p>
          </div>

          {/* 24/7 Support */}
          <div className="card">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 text-2xl text-white shadow-lg">
              <i className="fas fa-headset" />
            </div>
            <h3 className="mt-5 text-lg font-bold text-dark">24/7 Support</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Our support team is available around the clock for emergency
              services and critical assistance.
            </p>
          </div>
        </div>

        {/* ═══════ Google Maps ═══════ */}
        <div className="mt-16">
          <div className="mb-8 text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              Location
            </span>
            <h2 className="section-title mt-4">Find Us on Map</h2>
            {contact.address && (
              <p className="section-subtitle">{contact.address}</p>
            )}
          </div>

          <div className="overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5">
            <iframe
              title="Google Maps"
              className="h-96 w-full"
              src={
                contact.address
                  ? `https://www.google.com/maps?q=${encodeURIComponent(contact.address)}&output=embed`
                  : 'https://www.google.com/maps?q=Darbhanga,Bihar&output=embed'
              }
              loading="lazy"
            />
          </div>
        </div>

        {/* ═══════ CTA Strip ═══════ */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-red-500 to-primary p-8 shadow-2xl sm:p-12">
          <div className="text-center">
            <h3 className="text-2xl font-black text-white md:text-3xl">
              Ready to Work With Us?
            </h3>
            <p className="mt-3 text-white/90">
              Get in touch today for a free consultation.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-bold text-primary shadow-lg transition hover:scale-105"
                >
                  <i className="fas fa-phone" />
                  Call Now
                </a>
              )}
              {contact.whatsapp && (
                <a
                  href={`https://wa.me/91${contact.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-green-500 px-6 py-3 font-bold text-white shadow-lg transition hover:scale-105"
                >
                  <i className="fab fa-whatsapp" /> {/* ← fab prefix */}
                  WhatsApp
                </a>
              )}
              {contact.email && (
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2 rounded-2xl border-2 border-white bg-transparent px-6 py-3 font-bold text-white transition hover:bg-white hover:text-primary"
                >
                  <i className="fas fa-envelope" />
                  Send Email
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
