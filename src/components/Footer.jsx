import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

const DEFAULT_BRAND = { short: 'MJ', line1: '', line2: '', logo: '', tagline: '' };

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/join-us', label: 'Careers' },
  { to: '/contact', label: 'Contact' },
];

export default function Footer() {
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [contact, setContact] = useState({ email: '', phone: '', whatsapp: '', address: '' });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const brandRes = await api.get('/settings/nav_brand').catch(() => null);
        if (!cancelled && brandRes && brandRes.value) {
          let parsed = brandRes.value;
          if (typeof parsed === 'string') {
            try { parsed = JSON.parse(parsed); } catch {}
          }
          if (parsed && typeof parsed === 'object') {
            setBrand({
              short: parsed.short || 'MJ',
              line1: parsed.line1 || '',
              line2: parsed.line2 || '',
              logo: parsed.logo || '',
              tagline: parsed.tagline || '',
            });
          }
        }

        const keys = ['contact_email', 'contact_phone', 'contact_whatsapp', 'contact_address'];
        const results = await Promise.all(
          keys.map((k) => api.get(`/settings/${k}`).catch(() => ({ value: '' })))
        );
        if (cancelled) return;
        const map = {};
        keys.forEach((k, i) => { map[k] = results[i].value; });
        setContact({
          email: map.contact_email || '',
          phone: map.contact_phone || '',
          whatsapp: map.contact_whatsapp || '',
          address: map.contact_address || '',
        });
      } catch (err) {
        console.error('Footer load error:', err);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const brandFull = [brand.line1, brand.line2].filter(Boolean).join(' ').trim() || 'Company';
  const hasContact = contact.email || contact.phone || contact.address;

  return (
    <footer className="footer-3d py-16 text-gray-300">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3">
              {brand.logo ? (
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-white/10">
                  <img
                    src={brand.logo}
                    alt={brandFull}
                    className="h-full w-full object-contain p-1"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              ) : (
                <div className="logo-3d h-12 w-12 text-xl">{brand.short || 'MJ'}</div>
              )}
              {brand.line1 && (
                <div>
                  <p className="text-lg font-black text-white">{brand.line1}</p>
                  {brand.line2 && (
                    <p className="text-xs font-bold tracking-widest text-primary">{brand.line2}</p>
                  )}
                </div>
              )}
            </div>
            {brand.tagline && (
              <p className="mt-4 text-sm leading-relaxed text-gray-400">{brand.tagline}</p>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="transition hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Get in Touch</h4>
            {hasContact ? (
              <ul className="mt-4 space-y-3 text-sm">
                {contact.address && (
                  <li className="flex items-start gap-3">
                    <i className="fas fa-map-marker-alt mt-1 text-primary" />
                    <span>{contact.address}</span>
                  </li>
                )}
                {contact.phone && (
                  <li className="flex items-center gap-3">
                    <i className="fas fa-phone text-primary" />
                    <a href={`tel:${contact.phone}`} className="hover:text-primary">+91 {contact.phone}</a>
                  </li>
                )}
                {contact.email && (
                  <li className="flex items-center gap-3">
                    <i className="fas fa-envelope text-primary" />
                    <a href={`mailto:${contact.email}`} className="break-all hover:text-primary">
                      {contact.email}
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-gray-500">Contact info coming soon.</p>
            )}

            {contact.whatsapp && (
              <div className="mt-5 flex gap-3">
                <a
                  href={`https://wa.me/91${contact.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-green-500"
                  aria-label="WhatsApp"
                >
                  <i className="fab fa-whatsapp" />
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-blue-600" aria-label="Facebook">
                  <i className="fab fa-facebook-f" />
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-pink-500" aria-label="Instagram">
                  <i className="fab fa-instagram" />
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {brandFull}. All rights reserved.
          </p>
          <p className="mt-1 text-xs text-gray-600">
            Designed &amp; Developed with <i className="fas fa-heart text-primary" /> in Darbhanga
          </p>
        </div>
      </div>
    </footer>
  );
}
