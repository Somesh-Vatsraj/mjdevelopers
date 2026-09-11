import { NavLink, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../api/client';

/* ═══════════════════════════════════════════════
   FALLBACK LINKS – अगर DB में nav_links नहीं है
═══════════════════════════════════════════════ */
const DEFAULT_LINKS = [
  { to: '/', label: 'Home', icon: 'fa-home', visible: true },
  { to: '/about', label: 'About', icon: 'fa-info-circle', visible: true },
  { to: '/services', label: 'Services', icon: 'fa-briefcase', visible: true },
  { to: '/gallery', label: 'Gallery', icon: 'fa-images', visible: true },
  { to: '/join-us', label: 'Join Us', icon: 'fa-user-plus', visible: true },
  { to: '/contact', label: 'Contact', icon: 'fa-envelope', visible: true },
];

/* ═══════════════════════════════════════════════
   NAVBAR COMPONENT
═══════════════════════════════════════════════ */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState(null); // null = not loaded yet
  const [links, setLinks] = useState(null); // null = not loaded yet
  const [ready, setReady] = useState(false); // true = content loaded

  /* ---------- Load from DB ---------- */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // ---- Nav Links ----
        const res = await api.get('/settings/nav_links').catch(() => null);
        if (cancelled) return;

        let finalLinks = DEFAULT_LINKS;
        if (res && Array.isArray(res.value)) {
          const visible = res.value.filter((l) => l.visible !== false);
          if (visible.length > 0) finalLinks = visible;
        }

        // ---- Brand ----
        const brandRes = await api.get('/settings/nav_brand').catch(() => null);
        if (cancelled) return;

        let finalBrand = {
          short: 'MJ',
          line1: '',
          line2: '',
          logo: '',
          tagline: '',
        };
        if (brandRes && brandRes.value) {
          let parsed = brandRes.value;
          if (typeof parsed === 'string') {
            try {
              parsed = JSON.parse(parsed);
            } catch {}
          }
          if (parsed && typeof parsed === 'object') {
            finalBrand = {
              short: parsed.short || 'MJ',
              line1: parsed.line1 || '',
              line2: parsed.line2 || '',
              logo: parsed.logo || '',
              tagline: parsed.tagline || '',
            };
          }
        }

        // Set everything at once
        setLinks(finalLinks);
        setBrand(finalBrand);
        setReady(true);
      } catch (err) {
        console.error('Navbar load error:', err);
        if (!cancelled) {
          setLinks(DEFAULT_LINKS);
          setBrand({ short: 'MJ', line1: '', line2: '', logo: '', tagline: '' });
          setReady(true);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasBrandText = brand && (brand.line1 || brand.line2);
  const hasLogo = brand && brand.logo && brand.logo.trim();

  return (
    <header className="nav-3d sticky top-0 z-50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">

        {/* ═══════════════════════════════════════
            BRAND / LOGO
        ═══════════════════════════════════════ */}
        {ready ? (
          <Link
            to="/"
            className="group flex items-center gap-3 animate-fade-in"
          >
            {/* Logo Container — same size for logo & fallback */}
            <div className="relative h-12 w-12 flex-shrink-0">
              {hasLogo ? (
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/5 transition duration-300 group-hover:scale-105">
                  <img
                    src={brand.logo}
                    alt={brand.line1 || 'Logo'}
                    className="h-full w-full object-contain p-1"
                    onError={(e) => {
                      // If image fails → swap to "MJ" text
                      e.target.style.display = 'none';
                      const sib = e.target.nextElementSibling;
                      if (sib) sib.style.display = 'flex';
                    }}
                  />
                  {/* Fallback text if image errors */}
                  <div
                    className="hidden h-full w-full items-center justify-center bg-gradient-to-br from-primary to-red-500 text-lg font-black text-white"
                    style={{ display: 'none' }}
                  >
                    {brand.short || 'MJ'}
                  </div>
                </div>
              ) : (
                /* Text fallback */
                <div className="logo-3d flex h-12 w-12 items-center justify-center text-xl">
                  {brand.short || 'MJ'}
                </div>
              )}
            </div>

            {/* Brand text */}
            {hasBrandText && (
              <div className="hidden sm:block">
                {brand.line1 && (
                  <p className="text-base font-black leading-tight text-dark">
                    {brand.line1}
                  </p>
                )}
                {brand.line2 && (
                  <p className="text-xs font-bold tracking-widest text-primary">
                    {brand.line2}
                  </p>
                )}
              </div>
            )}
          </Link>
        ) : (
          /* Blank placeholder — same size, no layout shift */
          <div className="h-12 w-12 sm:w-56" />
        )}

        {/* ═══════════════════════════════════════
            DESKTOP MENU
        ═══════════════════════════════════════ */}
        {ready ? (
          <ul className="hidden items-center gap-1 md:flex animate-fade-in">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `nav-link-3d ${isActive ? 'active' : 'text-gray-700'}`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        ) : (
          /* Blank placeholder */
          <div className="hidden h-10 w-[500px] md:block" />
        )}

        {/* ═══════════════════════════════════════
            MOBILE TOGGLE
        ═══════════════════════════════════════ */}
        {ready ? (
          <button
            className="rounded-xl p-3 text-2xl text-dark transition hover:bg-gray-100 animate-fade-in md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <i className={`fas ${open ? 'fa-times' : 'fa-bars'}`} />
          </button>
        ) : (
          /* Blank placeholder */
          <div className="h-12 w-12 md:hidden" />
        )}
      </nav>

      {/* ═══════════════════════════════════════
          MOBILE MENU
      ═══════════════════════════════════════ */}
      {open && ready && (
        <ul className="animate-fade-in-up border-t border-gray-100 bg-white/95 px-4 py-4 backdrop-blur-xl md:hidden">
          {links.map((l) => (
            <li key={l.to} className="mb-1">
              <NavLink
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-red-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                <i className={`fas ${l.icon || 'fa-link'} w-5 text-center`} />
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
