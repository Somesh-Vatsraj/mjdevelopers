import { useEffect, useState } from 'react';
import { api } from '../../api/client';

/* ═══════════════════════════════════════════════
   SECTIONS CONFIGURATION
   type: 'json' वाली सभी entries अब अपने खुद के
   visual editor use करेंगी
═══════════════════════════════════════════════ */
const SECTIONS = [
  // Branding & Navigation
  { key: 'nav_links', label: 'Navigation Menu', group: 'Branding & Nav', type: 'navlinks' },
  { key: 'nav_brand', label: 'Brand & Logo', group: 'Branding & Nav', type: 'brand' },

  // Hero
  { key: 'hero_title', label: 'Hero Title', group: 'Hero Section' },
  { key: 'hero_subtitle', label: 'Hero Subtitle', group: 'Hero Section' },
  { key: 'hero_cta', label: 'Hero CTA Button Text', group: 'Hero Section' },
  { key: 'hero_badge', label: 'Hero Badge (Top Pill)', group: 'Hero Section' },
  { key: 'trust_badges_list', label: 'Trust Badges', group: 'Hero Section', type: 'stringlist', placeholder: 'e.g. ISO 9001:2015' },

  // Statistics
  { key: 'stats_projects', label: 'Projects Count', group: 'Statistics', type: 'number' },
  { key: 'stats_customers', label: 'Customers Count', group: 'Statistics', type: 'number' },
  { key: 'stats_branches', label: 'Branches Count', group: 'Statistics', type: 'number' },
  { key: 'stats_manpower', label: 'Manpower Count', group: 'Statistics', type: 'number' },

  // Contact Info
  { key: 'contact_email', label: 'Email Address', group: 'Contact Info' },
  { key: 'contact_phone', label: 'Phone Number', group: 'Contact Info' },
  { key: 'contact_whatsapp', label: 'WhatsApp Number', group: 'Contact Info' },
  { key: 'contact_address', label: 'Full Address', group: 'Contact Info', type: 'textarea' },
  { key: 'contact_iso', label: 'ISO Certificate', group: 'Contact Info' },

  // About Preview (Home Page)
  { key: 'about_preview_title', label: 'Home About Title', group: 'About Preview', type: 'textarea' },
  { key: 'about_preview_desc', label: 'Home About Description', group: 'About Preview', type: 'textarea' },
  { key: 'about_preview_image', label: 'Home About Image', group: 'About Preview', type: 'image' },
  { key: 'about_preview_features', label: 'Features List', group: 'About Preview', type: 'stringlist', placeholder: 'e.g. Quality Assured' },
  { key: 'about_preview_badge_number', label: 'Badge Number (e.g. 10+)', group: 'About Preview' },
  { key: 'about_preview_badge_label', label: 'Badge Label (e.g. Years of Trust)', group: 'About Preview' },

  // About Page
  { key: 'about_intro_title', label: 'About Intro Title', group: 'About Page' },
  { key: 'about_intro_desc', label: 'About Intro Description', group: 'About Page', type: 'textarea' },
  { key: 'about_intro_image', label: 'About Intro Image', group: 'About Page', type: 'image' },
  { key: 'about_company', label: 'Company Name', group: 'About Page' },
  { key: 'about_corporate_office', label: 'Corporate Office Address', group: 'About Page', type: 'textarea' },
  { key: 'about_mission', label: 'Mission Statement', group: 'About Page', type: 'textarea' },
  { key: 'about_mission_points', label: 'Mission Points', group: 'About Page', type: 'stringlist', placeholder: 'e.g. Quality Assurance' },

  // Founder
  { key: 'founder_section_title', label: 'Founder Section Title', group: 'Founder / Owner' },
  { key: 'founder_section_subtitle', label: 'Founder Section Subtitle', group: 'Founder / Owner', type: 'textarea' },
  { key: 'about_founder', label: 'Founder Name', group: 'Founder / Owner' },
  { key: 'about_founder_title', label: 'Founder Designation', group: 'Founder / Owner' },
  { key: 'about_founder_image', label: 'Founder Photo', group: 'Founder / Owner', type: 'image' },
  { key: 'about_founder_message', label: 'Founder Message', group: 'Founder / Owner', type: 'textarea' },

  // Certificates & Clients
  { key: 'certificates_list', label: 'Certificates Manager', group: 'Certificates & Clients', type: 'certificates' },
  { key: 'clients_list', label: 'Clients Manager', group: 'Certificates & Clients', type: 'clients' },

  // Home Sections
  { key: 'industries_list', label: 'Industries We Serve', group: 'Home Sections', type: 'industries' },
  { key: 'process_steps_list', label: 'Process Steps', group: 'Home Sections', type: 'processsteps' },
  { key: 'testimonials_list', label: 'Testimonials', group: 'Home Sections', type: 'testimonials' },
  { key: 'faqs_list', label: 'FAQs', group: 'Home Sections', type: 'faqs' },
  { key: 'why_choose_us', label: 'Why Choose Us', group: 'Home Sections', type: 'whychooseus' },
  { key: 'services_list', label: 'Services List', group: 'Home Sections', type: 'services' },

  // CTA Sections
  { key: 'cta_title', label: 'CTA Title', group: 'CTA Sections' },
  { key: 'cta_subtitle', label: 'CTA Subtitle', group: 'CTA Sections' },
  { key: 'final_cta_title', label: 'Final CTA Title', group: 'CTA Sections', type: 'textarea' },
  { key: 'final_cta_subtitle', label: 'Final CTA Subtitle', group: 'CTA Sections', type: 'textarea' },

  // Page Images
  { key: 'page_image_home_hero', label: 'Home Hero Image', group: 'Page Images', type: 'image' },
  { key: 'page_image_about', label: 'About Page Banner', group: 'Page Images', type: 'image' },
  { key: 'page_image_services_banner', label: 'Services Banner', group: 'Page Images', type: 'image' },
  { key: 'page_image_gallery_banner', label: 'Gallery Banner', group: 'Page Images', type: 'image' },
  { key: 'page_image_join_banner', label: 'Join Us Banner', group: 'Page Images', type: 'image' },
  { key: 'page_image_contact', label: 'Contact Page Image', group: 'Page Images', type: 'image' },
];

const GROUP_ICONS = {
  'Branding & Nav': 'fa-palette',
  'Hero Section': 'fa-star',
  'Statistics': 'fa-chart-bar',
  'Contact Info': 'fa-address-book',
  'About Preview': 'fa-info',
  'About Page': 'fa-info-circle',
  'Founder / Owner': 'fa-user-tie',
  'Certificates & Clients': 'fa-award',
  'Home Sections': 'fa-th-large',
  'CTA Sections': 'fa-bullhorn',
  'Page Images': 'fa-image',
};

/* ═══════════════════════════════════════════════
   SHARED HELPERS
═══════════════════════════════════════════════ */
const COLOR_OPTIONS = [
  'from-blue-500 to-indigo-500',
  'from-green-500 to-emerald-500',
  'from-purple-500 to-pink-500',
  'from-orange-500 to-amber-500',
  'from-red-500 to-rose-500',
  'from-teal-500 to-cyan-500',
  'from-cyan-500 to-blue-500',
  'from-pink-500 to-rose-500',
  'from-amber-500 to-yellow-500',
  'from-primary to-red-500',
];

const CERT_ICONS = [
  'fa-certificate', 'fa-award', 'fa-medal', 'fa-shield-alt',
  'fa-file-invoice', 'fa-industry', 'fa-pills', 'fa-hard-hat',
  'fa-check-circle', 'fa-star', 'fa-trophy', 'fa-ribbon',
  'fa-stamp', 'fa-file-contract', 'fa-verified', 'fa-leaf',
  'fa-graduation-cap', 'fa-globe', 'fa-clipboard-check', 'fa-badge-check',
];

const INDUSTRY_ICONS = [
  'fa-hospital', 'fa-school', 'fa-industry', 'fa-city',
  'fa-building', 'fa-hotel', 'fa-shopping-cart', 'fa-home',
  'fa-bank', 'fa-store', 'fa-warehouse', 'fa-utensils',
];

const STEP_ICONS = [
  'fa-comments', 'fa-clipboard-list', 'fa-cogs', 'fa-headset',
  'fa-lightbulb', 'fa-tasks', 'fa-rocket', 'fa-check-double',
];

const NAV_ICONS = [
  'fa-home', 'fa-info-circle', 'fa-briefcase', 'fa-images',
  'fa-user-plus', 'fa-envelope', 'fa-phone', 'fa-star',
  'fa-newspaper', 'fa-users', 'fa-box', 'fa-tag',
];

// Generic editor action buttons (move up/down/delete)
function ItemActions({ index, total, onMoveUp, onMoveDown, onDelete }) {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={index === 0}
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-gray-200 disabled:opacity-30"
        title="Move up"
      >
        <i className="fas fa-arrow-up text-xs" />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={index === total - 1}
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition hover:bg-gray-200 disabled:opacity-30"
        title="Move down"
      >
        <i className="fas fa-arrow-down text-xs" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-red-600 transition hover:bg-red-200"
        title="Delete"
      >
        <i className="fas fa-trash text-xs" />
      </button>
    </div>
  );
}

/* Generic "Add X" button */
function AddButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-lg transition hover:bg-red-700"
    >
      <i className="fas fa-plus mr-1" /> {label}
    </button>
  );
}

/* Empty state */
function EmptyState({ icon, title, actionLabel, onAction }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      <i className={`fas ${icon} text-3xl text-gray-300`} />
      <p className="mt-2 text-sm text-gray-500">{title}</p>
      {onAction && (
        <button type="button" onClick={onAction} className="btn-primary mt-4 text-sm">
          <i className="fas fa-plus" /> {actionLabel}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════ */
function Toast({ toasts, removeToast }) {
  const styles = {
    success: { bg: 'from-green-500 to-emerald-600', icon: 'fa-check-circle', ring: 'ring-green-200' },
    error: { bg: 'from-red-500 to-rose-600', icon: 'fa-exclamation-circle', ring: 'ring-red-200' },
    info: { bg: 'from-blue-500 to-indigo-600', icon: 'fa-info-circle', ring: 'ring-blue-200' },
    warning: { bg: 'from-amber-500 to-orange-600', icon: 'fa-exclamation-triangle', ring: 'ring-amber-200' },
  };

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
      {toasts.map((t) => {
        const s = styles[t.type] || styles.info;
        return (
          <div
            key={t.id}
            className={`pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-2xl bg-gradient-to-br ${s.bg} p-4 text-white shadow-2xl ring-1 ${s.ring} animate-toast-in`}
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <i className={`fas ${s.icon} text-lg`} />
            </div>
            <div className="flex-1 pt-0.5">
              {t.title && <p className="text-sm font-black leading-tight">{t.title}</p>}
              <p className="mt-0.5 text-xs leading-snug opacity-95">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/20 hover:text-white"
            >
              <i className="fas fa-times text-xs" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
              <div
                className="h-full bg-white/70"
                style={{ animation: `toast-progress ${t.duration || 3500}ms linear forwards` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CONFIRM DIALOG
═══════════════════════════════════════════════ */
function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmText = 'Delete', danger = true }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onCancel} />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-scale-in">
        <div className={`h-1.5 w-full bg-gradient-to-r ${danger ? 'from-red-500 to-rose-600' : 'from-blue-500 to-indigo-600'}`} />
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${danger ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
              <i className={`fas ${danger ? 'fa-exclamation-triangle' : 'fa-question-circle'} text-xl`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-dark">{title}</h3>
              <p className="mt-1 text-sm text-gray-600">{message}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="rounded-xl border-2 border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition ${
                danger
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-red-500/40'
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-blue-500/40'
              }`}
            >
              <i className="fas fa-check mr-1" /> {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   BRAND EDITOR
═══════════════════════════════════════════════ */
function BrandEditor({ value, onChange }) {
  const defaultBrand = { short: '', line1: '', line2: '', logo: '', tagline: '' };

  let parsed = { ...defaultBrand };
  try {
    if (typeof value === 'string' && value.trim()) parsed = { ...defaultBrand, ...JSON.parse(value) };
    else if (typeof value === 'object' && value !== null) parsed = { ...defaultBrand, ...value };
  } catch {}

  const [brand, setBrand] = useState(parsed);

  useEffect(() => {
    try {
      let p = { ...defaultBrand };
      if (typeof value === 'string' && value.trim()) p = { ...defaultBrand, ...JSON.parse(value) };
      else if (typeof value === 'object' && value !== null) p = { ...defaultBrand, ...value };
      setBrand(p);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const update = (field, val) => {
    const updated = { ...brand, [field]: val };
    setBrand(updated);
    onChange(JSON.stringify(updated));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      alert('Logo too large. Max 500KB.\nCurrent: ' + Math.round(file.size / 1024) + 'KB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update('logo', reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-5 rounded-2xl border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-5">
      <div className="flex items-center gap-2 text-sm font-bold text-primary">
        <i className="fas fa-palette" /> Brand Identity
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
          <i className="fas fa-image mr-1 text-primary" /> Logo
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="flex-shrink-0">
            {brand.logo ? (
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-black/10">
                  <img src={brand.logo} alt="Logo" className="h-full w-full object-contain p-2" />
                </div>
                <button
                  type="button"
                  onClick={() => update('logo', '')}
                  className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-lg hover:bg-red-600"
                >
                  <i className="fas fa-times" />
                </button>
              </div>
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400">
                <div className="text-center">
                  <i className="fas fa-image text-2xl" />
                  <p className="mt-1 text-[9px] font-semibold uppercase">No Logo</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">Logo URL</label>
              <input
                className="input text-sm"
                value={brand.logo && !brand.logo.startsWith('data:') ? brand.logo : ''}
                onChange={(e) => update('logo', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">
                Or Upload (max 500KB)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="block w-full text-xs text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-600">Short Code</label>
          <input
            className="input text-sm"
            value={brand.short || ''}
            onChange={(e) => update('short', e.target.value)}
            placeholder="MJ"
            maxLength={4}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-600">Name Line 1</label>
          <input
            className="input text-sm"
            value={brand.line1 || ''}
            onChange={(e) => update('line1', e.target.value)}
            placeholder="Company Name"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-600">Name Line 2</label>
          <input
            className="input text-sm"
            value={brand.line2 || ''}
            onChange={(e) => update('line2', e.target.value)}
            placeholder="Enterprises"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold text-gray-600">Tagline</label>
        <input
          className="input text-sm"
          value={brand.tagline || ''}
          onChange={(e) => update('tagline', e.target.value)}
          placeholder="Your tagline"
        />
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-dark via-[#141428] to-dark p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
          <i className="fas fa-eye mr-1" /> Live Preview
        </p>
        <div className="rounded-xl bg-white/95 p-3 backdrop-blur">
          <div className="flex items-center gap-3">
            {brand.logo ? (
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-lg">
                <img src={brand.logo} alt="Logo" className="h-full w-full object-contain p-1" />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-red-500 text-lg font-bold text-white shadow-lg">
                {brand.short || 'A'}
              </div>
            )}
            <div>
              <p className="text-base font-black text-dark">{brand.line1 || 'Company'}</p>
              {brand.line2 && <p className="text-xs font-bold tracking-widest text-primary">{brand.line2}</p>}
            </div>
          </div>
        </div>
        {brand.tagline && (
          <div className="mt-3 rounded-xl bg-dark/60 p-3">
            <p className="text-[10px] text-gray-400">
              <i className="fas fa-quote-left text-primary/50 mr-1" />
              {brand.tagline}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   NAV LINKS EDITOR
═══════════════════════════════════════════════ */
function NavLinksEditor({ value, onChange, showConfirm }) {
  const defaultItem = { to: '/', label: '', icon: 'fa-home', visible: true };

  let parsed = [];
  try {
    if (typeof value === 'string' && value.trim()) parsed = JSON.parse(value);
    else if (Array.isArray(value)) parsed = value;
    if (!Array.isArray(parsed)) parsed = [];
  } catch { parsed = []; }

  const [items, setItems] = useState(parsed.length > 0 ? parsed : [defaultItem]);

  useEffect(() => {
    try {
      let p = [];
      if (typeof value === 'string' && value.trim()) p = JSON.parse(value);
      else if (Array.isArray(value)) p = value;
      if (Array.isArray(p) && p.length > 0) setItems(p);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const save = (updated) => { setItems(updated); onChange(JSON.stringify(updated)); };
  const updateItem = (i, f, v) => {
    const u = [...items];
    u[i] = { ...u[i], [f]: v };
    save(u);
  };
  const addItem = () => save([...items, { ...defaultItem }]);
  const removeItem = (i) => showConfirm({
    title: 'Delete Link?',
    message: `"${items[i].label || 'Untitled'}" will be removed from navigation.`,
    onConfirm: () => save(items.filter((_, idx) => idx !== i)),
  });
  const moveItem = (i, d) => {
    const u = [...items];
    const t = i + d;
    if (t < 0 || t >= u.length) return;
    [u[i], u[t]] = [u[t], u[i]];
    save(u);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <i className="fas fa-bars" /> Menu Links ({items.length})
        </div>
        <AddButton label="Add Link" onClick={addItem} />
      </div>

      {items.map((item, i) => (
        <div key={i} className="rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-sm hover:border-primary/30">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Link #{i + 1}</span>
            <ItemActions
              index={i}
              total={items.length}
              onMoveUp={() => moveItem(i, -1)}
              onMoveDown={() => moveItem(i, 1)}
              onDelete={() => removeItem(i)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-600">Label *</label>
              <input
                className="input text-sm"
                value={item.label || ''}
                onChange={(e) => updateItem(i, 'label', e.target.value)}
                placeholder="Home"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-600">Route (URL) *</label>
              <input
                className="input text-sm"
                value={item.to || ''}
                onChange={(e) => updateItem(i, 'to', e.target.value)}
                placeholder="/about"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-600">Icon (mobile menu)</label>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <i className={`fas ${item.icon || 'fa-link'}`} />
                </div>
                <select
                  className="input text-xs"
                  value={item.icon || 'fa-home'}
                  onChange={(e) => updateItem(i, 'icon', e.target.value)}
                >
                  {NAV_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-600">Visibility</label>
              <button
                type="button"
                onClick={() => updateItem(i, 'visible', item.visible === false ? true : false)}
                className={`inline-flex w-full items-center justify-between rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition ${
                  item.visible !== false
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-300 bg-gray-50 text-gray-500'
                }`}
              >
                <span>{item.visible !== false ? 'Visible' : 'Hidden'}</span>
                <i className={`fas ${item.visible !== false ? 'fa-eye' : 'fa-eye-slash'}`} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <EmptyState icon="fa-bars" title="No links yet" actionLabel="Add First Link" onAction={addItem} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   STRING LIST EDITOR (simple text items)
═══════════════════════════════════════════════ */
function StringListEditor({ value, onChange, showConfirm, placeholder = 'Enter text', labelPrefix = 'Item' }) {
  let parsed = [];
  try {
    if (typeof value === 'string' && value.trim()) parsed = JSON.parse(value);
    else if (Array.isArray(value)) parsed = value;
    if (!Array.isArray(parsed)) parsed = [];
  } catch { parsed = []; }

  const [items, setItems] = useState(parsed);

  useEffect(() => {
    try {
      let p = [];
      if (typeof value === 'string' && value.trim()) p = JSON.parse(value);
      else if (Array.isArray(value)) p = value;
      setItems(Array.isArray(p) ? p : []);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const save = (updated) => { setItems(updated); onChange(JSON.stringify(updated)); };
  const updateItem = (i, v) => { const u = [...items]; u[i] = v; save(u); };
  const addItem = () => save([...items, '']);
  const removeItem = (i) => showConfirm({
    title: 'Delete Item?',
    message: `"${items[i] || 'Untitled'}" will be removed.`,
    onConfirm: () => save(items.filter((_, idx) => idx !== i)),
  });
  const moveItem = (i, d) => {
    const u = [...items];
    const t = i + d;
    if (t < 0 || t >= u.length) return;
    [u[i], u[t]] = [u[t], u[i]];
    save(u);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <i className="fas fa-list" /> {items.length} {items.length === 1 ? 'item' : 'items'}
        </div>
        <AddButton label="Add" onClick={addItem} />
      </div>

      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-black text-primary">
              {i + 1}
            </span>
            <input
              className="input text-sm"
              value={item || ''}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder={placeholder}
            />
            <div className="flex-shrink-0">
              <ItemActions
                index={i}
                total={items.length}
                onMoveUp={() => moveItem(i, -1)}
                onMoveDown={() => moveItem(i, 1)}
                onDelete={() => removeItem(i)}
              />
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <EmptyState icon="fa-list" title="No items yet" actionLabel="Add First Item" onAction={addItem} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CERTIFICATES EDITOR
═══════════════════════════════════════════════ */
function CertificatesEditor({ value, onChange, showConfirm }) {
  const defaultItem = { name: '', desc: '', icon: 'fa-certificate', color: 'from-blue-500 to-indigo-500', image: '' };

  let parsed = [];
  try {
    if (typeof value === 'string' && value.trim()) parsed = JSON.parse(value);
    else if (Array.isArray(value)) parsed = value;
    if (!Array.isArray(parsed)) parsed = [];
  } catch { parsed = []; }

  const [items, setItems] = useState(parsed.length > 0 ? parsed : [defaultItem]);

  useEffect(() => {
    try {
      let p = [];
      if (typeof value === 'string' && value.trim()) p = JSON.parse(value);
      else if (Array.isArray(value)) p = value;
      if (Array.isArray(p) && p.length > 0) setItems(p);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const save = (updated) => { setItems(updated); onChange(JSON.stringify(updated)); };
  const updateItem = (i, f, v) => {
    const u = [...items];
    u[i] = { ...u[i], [f]: v };
    save(u);
  };
  const addItem = () => save([...items, { ...defaultItem }]);
  const removeItem = (i) => showConfirm({
    title: 'Delete Certificate?',
    message: `"${items[i].name || 'Untitled'}" will be permanently removed.`,
    onConfirm: () => save(items.filter((_, idx) => idx !== i)),
  });
  const moveItem = (i, d) => {
    const u = [...items];
    const t = i + d;
    if (t < 0 || t >= u.length) return;
    [u[i], u[t]] = [u[t], u[i]];
    save(u);
  };
  const handleImageUpload = (i, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 500 * 1024) { alert('Image too large. Max 500KB.'); return; }
    const reader = new FileReader();
    reader.onload = () => updateItem(i, 'image', reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <i className="fas fa-certificate" /> Certificates ({items.length})
        </div>
        <AddButton label="Add Certificate" onClick={addItem} />
      </div>

      {items.map((item, i) => (
        <div key={i} className="rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-sm hover:border-primary/30">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Certificate #{i + 1}</span>
            <ItemActions
              index={i} total={items.length}
              onMoveUp={() => moveItem(i, -1)}
              onMoveDown={() => moveItem(i, 1)}
              onDelete={() => removeItem(i)}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-bold text-gray-600">Certificate Image (Optional)</label>
              <div className="flex items-center gap-3">
                {item.image ? (
                  <div className="relative">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-gray-100 ring-1 ring-black/5">
                      <img src={item.image} alt="Cert" className="h-full w-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => updateItem(i, 'image', '')}
                      className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] text-white shadow"
                    >
                      <i className="fas fa-times" />
                    </button>
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-400">
                    <i className="fas fa-image" />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <input
                    className="input text-xs"
                    value={item.image && !item.image.startsWith('data:') ? item.image : ''}
                    onChange={(e) => updateItem(i, 'image', e.target.value)}
                    placeholder="Image URL (optional)"
                  />
                  <input
                    type="file" accept="image/*"
                    onChange={(e) => handleImageUpload(i, e)}
                    className="block w-full text-[10px] text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-primary/10 file:px-2 file:py-1 file:text-[10px] file:font-semibold file:text-primary hover:file:bg-primary/20"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-gray-600">Name *</label>
              <input className="input text-sm" value={item.name || ''} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="ISO 9001:2015" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-gray-600">Description</label>
              <input className="input text-sm" value={item.desc || ''} onChange={(e) => updateItem(i, 'desc', e.target.value)} placeholder="Quality Management" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-gray-600">Icon</label>
              <div className="flex items-center gap-2">
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color || 'from-blue-500 to-indigo-500'} text-white`}>
                  <i className={`fas ${item.icon || 'fa-certificate'}`} />
                </div>
                <select className="input text-xs" value={item.icon || 'fa-certificate'} onChange={(e) => updateItem(i, 'icon', e.target.value)}>
                  {CERT_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-gray-600">Color</label>
              <select className="input text-xs" value={item.color || 'from-blue-500 to-indigo-500'} onChange={(e) => updateItem(i, 'color', e.target.value)}>
                {COLOR_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className={`mt-1 h-2 rounded-full bg-gradient-to-r ${item.color || 'from-blue-500 to-indigo-500'}`} />
            </div>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <EmptyState icon="fa-certificate" title="No certificates yet" actionLabel="Add First Certificate" onAction={addItem} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   CLIENTS EDITOR
═══════════════════════════════════════════════ */
function ClientsEditor({ value, onChange, showConfirm }) {
  const defaultItem = { name: '', type: '', logo: '' };

  let parsed = [];
  try {
    if (typeof value === 'string' && value.trim()) parsed = JSON.parse(value);
    else if (Array.isArray(value)) parsed = value;
    if (!Array.isArray(parsed)) parsed = [];
  } catch { parsed = []; }

  const [items, setItems] = useState(parsed.length > 0 ? parsed : [defaultItem]);

  useEffect(() => {
    try {
      let p = [];
      if (typeof value === 'string' && value.trim()) p = JSON.parse(value);
      else if (Array.isArray(value)) p = value;
      if (Array.isArray(p) && p.length > 0) setItems(p);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const save = (updated) => { setItems(updated); onChange(JSON.stringify(updated)); };
  const updateItem = (i, f, v) => {
    const u = [...items];
    u[i] = { ...u[i], [f]: v };
    save(u);
  };
  const addItem = () => save([...items, { ...defaultItem }]);
  const removeItem = (i) => showConfirm({
    title: 'Delete Client?',
    message: `"${items[i].name || 'Untitled'}" will be permanently removed.`,
    onConfirm: () => save(items.filter((_, idx) => idx !== i)),
  });
  const moveItem = (i, d) => {
    const u = [...items];
    const t = i + d;
    if (t < 0 || t >= u.length) return;
    [u[i], u[t]] = [u[t], u[i]];
    save(u);
  };
  const handleLogoUpload = (i, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 500 * 1024) { alert('Logo too large. Max 500KB.'); return; }
    const reader = new FileReader();
    reader.onload = () => updateItem(i, 'logo', reader.result);
    reader.readAsDataURL(file);
  };

  const TYPE_PRESETS = ['Healthcare', 'Education', 'Government', 'Hospital', 'Telecom', 'Banking', 'Corporate', 'Retail', 'Manufacturing', 'Hospitality', 'Infrastructure', 'NGO'];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <i className="fas fa-handshake" /> Clients ({items.length})
        </div>
        <AddButton label="Add Client" onClick={addItem} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item, i) => (
          <div key={i} className="rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-sm hover:border-primary/30">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Client #{i + 1}</span>
              <div className="flex gap-1">
                <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0} className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30">
                  <i className="fas fa-arrow-up text-[10px]" />
                </button>
                <button type="button" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30">
                  <i className="fas fa-arrow-down text-[10px]" />
                </button>
                <button type="button" onClick={() => removeItem(i)} className="flex h-6 w-6 items-center justify-center rounded bg-red-100 text-red-600 hover:bg-red-200">
                  <i className="fas fa-trash text-[10px]" />
                </button>
              </div>
            </div>

            <div className="mb-3 flex items-center gap-3">
              {item.logo ? (
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-black/5">
                    <img src={item.logo} alt="Logo" className="h-full w-full object-contain p-1" />
                  </div>
                  <button type="button" onClick={() => updateItem(i, 'logo', '')} className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[9px] text-white shadow">
                    <i className="fas fa-times" />
                  </button>
                </div>
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-dark to-[#2a2a4e] text-base font-black text-white shadow-lg">
                  {(item.name || 'CL').split(' ').slice(0, 2).map((w) => w[0]).join('')}
                </div>
              )}
              <div className="flex-1 space-y-1">
                <input className="input text-xs" value={item.logo && !item.logo.startsWith('data:') ? item.logo : ''} onChange={(e) => updateItem(i, 'logo', e.target.value)} placeholder="Logo URL" />
                <input type="file" accept="image/*" onChange={(e) => handleLogoUpload(i, e)} className="block w-full text-[10px] text-gray-500 file:mr-2 file:rounded-lg file:border-0 file:bg-primary/10 file:px-2 file:py-1 file:text-[10px] file:font-semibold file:text-primary hover:file:bg-primary/20" />
              </div>
            </div>

            <div className="mb-2">
              <label className="mb-1 block text-xs font-bold text-gray-600">Client Name *</label>
              <input className="input text-sm" value={item.name || ''} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="Client name" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-gray-600">Industry / Type</label>
              <input className="input text-xs" list={`client-types-${i}`} value={item.type || ''} onChange={(e) => updateItem(i, 'type', e.target.value)} placeholder="Healthcare" />
              <datalist id={`client-types-${i}`}>
                {TYPE_PRESETS.map((t) => <option key={t} value={t} />)}
              </datalist>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <EmptyState icon="fa-handshake" title="No clients yet" actionLabel="Add First Client" onAction={addItem} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   INDUSTRIES EDITOR
═══════════════════════════════════════════════ */
function IndustriesEditor({ value, onChange, showConfirm }) {
  const defaultItem = { icon: 'fa-building', name: '', color: 'from-blue-500 to-indigo-500' };

  let parsed = [];
  try {
    if (typeof value === 'string' && value.trim()) parsed = JSON.parse(value);
    else if (Array.isArray(value)) parsed = value;
    if (!Array.isArray(parsed)) parsed = [];
  } catch { parsed = []; }

  const [items, setItems] = useState(parsed.length > 0 ? parsed : [defaultItem]);

  useEffect(() => {
    try {
      let p = [];
      if (typeof value === 'string' && value.trim()) p = JSON.parse(value);
      else if (Array.isArray(value)) p = value;
      if (Array.isArray(p) && p.length > 0) setItems(p);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const save = (updated) => { setItems(updated); onChange(JSON.stringify(updated)); };
  const updateItem = (i, f, v) => {
    const u = [...items];
    u[i] = { ...u[i], [f]: v };
    save(u);
  };
  const addItem = () => save([...items, { ...defaultItem }]);
  const removeItem = (i) => showConfirm({
    title: 'Delete Industry?',
    message: `"${items[i].name || 'Untitled'}" will be removed.`,
    onConfirm: () => save(items.filter((_, idx) => idx !== i)),
  });
  const moveItem = (i, d) => {
    const u = [...items];
    const t = i + d;
    if (t < 0 || t >= u.length) return;
    [u[i], u[t]] = [u[t], u[i]];
    save(u);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <i className="fas fa-th-large" /> Industries ({items.length})
        </div>
        <AddButton label="Add Industry" onClick={addItem} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item, i) => (
          <div key={i} className="rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-sm hover:border-primary/30">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Industry #{i + 1}</span>
              <div className="flex gap-1">
                <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0} className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30">
                  <i className="fas fa-arrow-up text-[10px]" />
                </button>
                <button type="button" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30">
                  <i className="fas fa-arrow-down text-[10px]" />
                </button>
                <button type="button" onClick={() => removeItem(i)} className="flex h-6 w-6 items-center justify-center rounded bg-red-100 text-red-600 hover:bg-red-200">
                  <i className="fas fa-trash text-[10px]" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-3">
              <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color || 'from-blue-500 to-indigo-500'} text-white text-xl shadow-lg`}>
                <i className={`fas ${item.icon || 'fa-building'}`} />
              </div>
              <div className="flex-1">
                <select className="input text-xs" value={item.icon || 'fa-building'} onChange={(e) => updateItem(i, 'icon', e.target.value)}>
                  {INDUSTRY_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-2">
              <label className="mb-1 block text-xs font-bold text-gray-600">Name *</label>
              <input className="input text-sm" value={item.name || ''} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="Healthcare" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-gray-600">Color</label>
              <select className="input text-xs" value={item.color || 'from-blue-500 to-indigo-500'} onChange={(e) => updateItem(i, 'color', e.target.value)}>
                {COLOR_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <EmptyState icon="fa-th-large" title="No industries yet" actionLabel="Add First Industry" onAction={addItem} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   PROCESS STEPS EDITOR
═══════════════════════════════════════════════ */
function ProcessStepsEditor({ value, onChange, showConfirm }) {
  const defaultItem = { num: '01', title: '', desc: '', icon: 'fa-comments' };

  let parsed = [];
  try {
    if (typeof value === 'string' && value.trim()) parsed = JSON.parse(value);
    else if (Array.isArray(value)) parsed = value;
    if (!Array.isArray(parsed)) parsed = [];
  } catch { parsed = []; }

  const [items, setItems] = useState(parsed.length > 0 ? parsed : [defaultItem]);

  useEffect(() => {
    try {
      let p = [];
      if (typeof value === 'string' && value.trim()) p = JSON.parse(value);
      else if (Array.isArray(value)) p = value;
      if (Array.isArray(p) && p.length > 0) setItems(p);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const save = (updated) => { setItems(updated); onChange(JSON.stringify(updated)); };
  const updateItem = (i, f, v) => {
    const u = [...items];
    u[i] = { ...u[i], [f]: v };
    save(u);
  };
  const addItem = () => {
    const nextNum = String(items.length + 1).padStart(2, '0');
    save([...items, { ...defaultItem, num: nextNum }]);
  };
  const removeItem = (i) => showConfirm({
    title: 'Delete Step?',
    message: `Step "${items[i].title || 'Untitled'}" will be removed.`,
    onConfirm: () => save(items.filter((_, idx) => idx !== i)),
  });
  const moveItem = (i, d) => {
    const u = [...items];
    const t = i + d;
    if (t < 0 || t >= u.length) return;
    [u[i], u[t]] = [u[t], u[i]];
    // Renumber
    u.forEach((item, idx) => { u[idx] = { ...item, num: String(idx + 1).padStart(2, '0') }; });
    save(u);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <i className="fas fa-cogs" /> Steps ({items.length})
        </div>
        <AddButton label="Add Step" onClick={addItem} />
      </div>

      {items.map((item, i) => (
        <div key={i} className="rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-sm hover:border-primary/30">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">{item.num || String(i + 1).padStart(2, '0')}</span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Step #{i + 1}</span>
            </div>
            <ItemActions index={i} total={items.length} onMoveUp={() => moveItem(i, -1)} onMoveDown={() => moveItem(i, 1)} onDelete={() => removeItem(i)} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-600">Title *</label>
              <input className="input text-sm" value={item.title || ''} onChange={(e) => updateItem(i, 'title', e.target.value)} placeholder="Consultation" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-600">Icon</label>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-red-500 text-white">
                  <i className={`fas ${item.icon || 'fa-comments'}`} />
                </div>
                <select className="input text-xs" value={item.icon || 'fa-comments'} onChange={(e) => updateItem(i, 'icon', e.target.value)}>
                  {STEP_ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-bold text-gray-600">Description</label>
              <textarea className="input text-sm" rows="2" value={item.desc || ''} onChange={(e) => updateItem(i, 'desc', e.target.value)} placeholder="Short description" />
            </div>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <EmptyState icon="fa-cogs" title="No steps yet" actionLabel="Add First Step" onAction={addItem} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   TESTIMONIALS EDITOR
═══════════════════════════════════════════════ */
function TestimonialsEditor({ value, onChange, showConfirm }) {
  const defaultItem = { name: '', role: '', text: '' };

  let parsed = [];
  try {
    if (typeof value === 'string' && value.trim()) parsed = JSON.parse(value);
    else if (Array.isArray(value)) parsed = value;
    if (!Array.isArray(parsed)) parsed = [];
  } catch { parsed = []; }

  const [items, setItems] = useState(parsed.length > 0 ? parsed : [defaultItem]);

  useEffect(() => {
    try {
      let p = [];
      if (typeof value === 'string' && value.trim()) p = JSON.parse(value);
      else if (Array.isArray(value)) p = value;
      if (Array.isArray(p) && p.length > 0) setItems(p);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const save = (updated) => { setItems(updated); onChange(JSON.stringify(updated)); };
  const updateItem = (i, f, v) => {
    const u = [...items];
    u[i] = { ...u[i], [f]: v };
    save(u);
  };
  const addItem = () => save([...items, { ...defaultItem }]);
  const removeItem = (i) => showConfirm({
    title: 'Delete Testimonial?',
    message: `"${items[i].name || 'Untitled'}" will be removed.`,
    onConfirm: () => save(items.filter((_, idx) => idx !== i)),
  });
  const moveItem = (i, d) => {
    const u = [...items];
    const t = i + d;
    if (t < 0 || t >= u.length) return;
    [u[i], u[t]] = [u[t], u[i]];
    save(u);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <i className="fas fa-star" /> Testimonials ({items.length})
        </div>
        <AddButton label="Add Testimonial" onClick={addItem} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item, i) => (
          <div key={i} className="rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-sm hover:border-primary/30">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Testimonial #{i + 1}</span>
              <div className="flex gap-1">
                <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0} className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30">
                  <i className="fas fa-arrow-up text-[10px]" />
                </button>
                <button type="button" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30">
                  <i className="fas fa-arrow-down text-[10px]" />
                </button>
                <button type="button" onClick={() => removeItem(i)} className="flex h-6 w-6 items-center justify-center rounded bg-red-100 text-red-600 hover:bg-red-200">
                  <i className="fas fa-trash text-[10px]" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-600">Name *</label>
                  <input className="input text-xs" value={item.name || ''} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="Client Name" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-gray-600">Role / Position</label>
                  <input className="input text-xs" value={item.role || ''} onChange={(e) => updateItem(i, 'role', e.target.value)} placeholder="CEO, ABC Corp" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-600">Testimonial Text *</label>
                <textarea className="input text-xs" rows="3" value={item.text || ''} onChange={(e) => updateItem(i, 'text', e.target.value)} placeholder="What they said about us..." />
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <EmptyState icon="fa-star" title="No testimonials yet" actionLabel="Add First Testimonial" onAction={addItem} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FAQS EDITOR
═══════════════════════════════════════════════ */
function FAQsEditor({ value, onChange, showConfirm }) {
  const defaultItem = { q: '', a: '' };

  let parsed = [];
  try {
    if (typeof value === 'string' && value.trim()) parsed = JSON.parse(value);
    else if (Array.isArray(value)) parsed = value;
    if (!Array.isArray(parsed)) parsed = [];
  } catch { parsed = []; }

  const [items, setItems] = useState(parsed.length > 0 ? parsed : [defaultItem]);

  useEffect(() => {
    try {
      let p = [];
      if (typeof value === 'string' && value.trim()) p = JSON.parse(value);
      else if (Array.isArray(value)) p = value;
      if (Array.isArray(p) && p.length > 0) setItems(p);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const save = (updated) => { setItems(updated); onChange(JSON.stringify(updated)); };
  const updateItem = (i, f, v) => {
    const u = [...items];
    u[i] = { ...u[i], [f]: v };
    save(u);
  };
  const addItem = () => save([...items, { ...defaultItem }]);
  const removeItem = (i) => showConfirm({
    title: 'Delete FAQ?',
    message: `"${items[i].q || 'Untitled'}" will be removed.`,
    onConfirm: () => save(items.filter((_, idx) => idx !== i)),
  });
  const moveItem = (i, d) => {
    const u = [...items];
    const t = i + d;
    if (t < 0 || t >= u.length) return;
    [u[i], u[t]] = [u[t], u[i]];
    save(u);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <i className="fas fa-question-circle" /> FAQs ({items.length})
        </div>
        <AddButton label="Add FAQ" onClick={addItem} />
      </div>

      {items.map((item, i) => (
        <div key={i} className="rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-sm hover:border-primary/30">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">FAQ #{i + 1}</span>
            <ItemActions index={i} total={items.length} onMoveUp={() => moveItem(i, -1)} onMoveDown={() => moveItem(i, 1)} onDelete={() => removeItem(i)} />
          </div>

          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-600">Question *</label>
              <input className="input text-sm" value={item.q || ''} onChange={(e) => updateItem(i, 'q', e.target.value)} placeholder="What services do you provide?" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-gray-600">Answer *</label>
              <textarea className="input text-sm" rows="2" value={item.a || ''} onChange={(e) => updateItem(i, 'a', e.target.value)} placeholder="We provide..." />
            </div>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <EmptyState icon="fa-question-circle" title="No FAQs yet" actionLabel="Add First FAQ" onAction={addItem} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   WHY CHOOSE US EDITOR
═══════════════════════════════════════════════ */
function WhyChooseUsEditor({ value, onChange, showConfirm }) {
  const defaultItem = { icon: '🏆', title: '', description: '' };

  let parsed = [];
  try {
    if (typeof value === 'string' && value.trim()) parsed = JSON.parse(value);
    else if (Array.isArray(value)) parsed = value;
    if (!Array.isArray(parsed)) parsed = [];
  } catch { parsed = []; }

  const [items, setItems] = useState(parsed.length > 0 ? parsed : [defaultItem]);

  useEffect(() => {
    try {
      let p = [];
      if (typeof value === 'string' && value.trim()) p = JSON.parse(value);
      else if (Array.isArray(value)) p = value;
      if (Array.isArray(p) && p.length > 0) setItems(p);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const save = (updated) => { setItems(updated); onChange(JSON.stringify(updated)); };
  const updateItem = (i, f, v) => {
    const u = [...items];
    u[i] = { ...u[i], [f]: v };
    save(u);
  };
  const addItem = () => save([...items, { ...defaultItem }]);
  const removeItem = (i) => showConfirm({
    title: 'Delete Item?',
    message: `"${items[i].title || 'Untitled'}" will be removed.`,
    onConfirm: () => save(items.filter((_, idx) => idx !== i)),
  });
  const moveItem = (i, d) => {
    const u = [...items];
    const t = i + d;
    if (t < 0 || t >= u.length) return;
    [u[i], u[t]] = [u[t], u[i]];
    save(u);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <i className="fas fa-check-circle" /> Items ({items.length})
        </div>
        <AddButton label="Add Item" onClick={addItem} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item, i) => (
          <div key={i} className="rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-sm hover:border-primary/30">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Item #{i + 1}</span>
              <div className="flex gap-1">
                <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0} className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30">
                  <i className="fas fa-arrow-up text-[10px]" />
                </button>
                <button type="button" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30">
                  <i className="fas fa-arrow-down text-[10px]" />
                </button>
                <button type="button" onClick={() => removeItem(i)} className="flex h-6 w-6 items-center justify-center rounded bg-red-100 text-red-600 hover:bg-red-200">
                  <i className="fas fa-trash text-[10px]" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  className="input !w-20 !px-2 text-center text-2xl"
                  value={item.icon || '🏆'}
                  onChange={(e) => updateItem(i, 'icon', e.target.value)}
                  placeholder="🏆"
                  maxLength={2}
                />
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-bold text-gray-600">Title *</label>
                  <input className="input text-sm" value={item.title || ''} onChange={(e) => updateItem(i, 'title', e.target.value)} placeholder="Experienced Team" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-600">Description</label>
                <textarea className="input text-sm" rows="2" value={item.description || ''} onChange={(e) => updateItem(i, 'description', e.target.value)} placeholder="Short description" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <EmptyState icon="fa-check-circle" title="No items yet" actionLabel="Add First Item" onAction={addItem} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SERVICES EDITOR
═══════════════════════════════════════════════ */
function ServicesEditor({ value, onChange, showConfirm }) {
  const defaultItem = { icon: '🛠️', title: '', description: '' };

  let parsed = [];
  try {
    if (typeof value === 'string' && value.trim()) parsed = JSON.parse(value);
    else if (Array.isArray(value)) parsed = value;
    if (!Array.isArray(parsed)) parsed = [];
  } catch { parsed = []; }

  const [items, setItems] = useState(parsed.length > 0 ? parsed : [defaultItem]);

  useEffect(() => {
    try {
      let p = [];
      if (typeof value === 'string' && value.trim()) p = JSON.parse(value);
      else if (Array.isArray(value)) p = value;
      if (Array.isArray(p) && p.length > 0) setItems(p);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const save = (updated) => { setItems(updated); onChange(JSON.stringify(updated)); };
  const updateItem = (i, f, v) => {
    const u = [...items];
    u[i] = { ...u[i], [f]: v };
    save(u);
  };
  const addItem = () => save([...items, { ...defaultItem }]);
  const removeItem = (i) => showConfirm({
    title: 'Delete Service?',
    message: `"${items[i].title || 'Untitled'}" will be removed.`,
    onConfirm: () => save(items.filter((_, idx) => idx !== i)),
  });
  const moveItem = (i, d) => {
    const u = [...items];
    const t = i + d;
    if (t < 0 || t >= u.length) return;
    [u[i], u[t]] = [u[t], u[i]];
    save(u);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-primary">
          <i className="fas fa-briefcase" /> Services ({items.length})
        </div>
        <AddButton label="Add Service" onClick={addItem} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item, i) => (
          <div key={i} className="rounded-2xl border-2 border-gray-200 bg-white p-4 shadow-sm hover:border-primary/30">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Service #{i + 1}</span>
              <div className="flex gap-1">
                <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0} className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30">
                  <i className="fas fa-arrow-up text-[10px]" />
                </button>
                <button type="button" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30">
                  <i className="fas fa-arrow-down text-[10px]" />
                </button>
                <button type="button" onClick={() => removeItem(i)} className="flex h-6 w-6 items-center justify-center rounded bg-red-100 text-red-600 hover:bg-red-200">
                  <i className="fas fa-trash text-[10px]" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  className="input !w-20 !px-2 text-center text-2xl"
                  value={item.icon || '🛠️'}
                  onChange={(e) => updateItem(i, 'icon', e.target.value)}
                  placeholder="🛠️"
                  maxLength={2}
                />
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-bold text-gray-600">Title *</label>
                  <input className="input text-sm" value={item.title || ''} onChange={(e) => updateItem(i, 'title', e.target.value)} placeholder="Service name" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold text-gray-600">Description</label>
                <textarea className="input text-sm" rows="2" value={item.description || ''} onChange={(e) => updateItem(i, 'description', e.target.value)} placeholder="Short description" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <EmptyState icon="fa-briefcase" title="No services yet" actionLabel="Add First Service" onAction={addItem} />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN SETTINGS COMPONENT
═══════════════════════════════════════════════ */
export default function Settings() {
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState({ open: false });
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({
    'Branding & Nav': true,
    'Hero Section': true,
    'Statistics': true,
    'Contact Info': true,
    'About Preview': true,
    'About Page': true,
    'Founder / Owner': true,
    'Certificates & Clients': true,
    'Home Sections': true,
    'CTA Sections': true,
    'Page Images': true,
  });

  const addToast = (type, message, title, duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message, title, duration }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const showConfirm = ({ title, message, onConfirm, confirmText = 'Delete', danger = true }) => {
    setConfirmState({
      open: true,
      title,
      message,
      confirmText,
      danger,
      onConfirm: () => {
        onConfirm();
        setConfirmState({ open: false });
      },
    });
  };

  useEffect(() => {
    async function load() {
      try {
        const keys = SECTIONS.map((s) => s.key);
        const res = await Promise.all(
          keys.map((k) => api.get(`/settings/${k}`).catch(() => ({ value: '' })))
        );
        const map = {};
        keys.forEach((k, i) => { map[k] = res[i].value; });
        setValues(map);
      } catch (err) {
        console.error(err);
        addToast('error', 'Failed to load settings', 'Error');
      } finally {
        setReady(true);
      }
    }
    load();
  }, []);

  const handleChange = (key, value) => {
    setValues({ ...values, [key]: value });
    setHasChanges(true);
  };

  const handleFile = (key, e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      addToast('error', `Max 500KB allowed. Current: ${Math.round(file.size / 1024)}KB`, 'File too large', 4500);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => handleChange(key, reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let successCount = 0;
      for (const { key } of SECTIONS) {
        const val = values[key] ?? '';
        await api.put(`/settings/${key}`, { value: val });
        successCount++;
      }
      addToast('success', `${successCount} settings saved and applied to your site.`, '✅ Settings Saved Successfully!', 4000);
      setHasChanges(false);
    } catch (err) {
      addToast('error', err.message, 'Save Failed', 5000);
    } finally {
      setSaving(false);
    }
  };

  const toggleGroup = (group) => {
    setExpandedGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  const groupedSections = SECTIONS.reduce((acc, section) => {
    const group = section.group || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(section);
    return acc;
  }, {});

  const formatValue = (key, val) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') return JSON.stringify(val, null, 2);
    return String(val);
  };

  const renderField = ({ key, label, type, placeholder }) => {
    const isBrand = type === 'brand';
    const isNavLinks = type === 'navlinks';
    const isStringList = type === 'stringlist';
    const isCertificates = type === 'certificates';
    const isClients = type === 'clients';
    const isIndustries = type === 'industries';
    const isProcessSteps = type === 'processsteps';
    const isTestimonials = type === 'testimonials';
    const isFAQs = type === 'faqs';
    const isWhyChooseUs = type === 'whychooseus';
    const isServices = type === 'services';
    const isImage = type === 'image' || (key.includes('image') && !isCertificates && !isClients);
    const displayValue = formatValue(key, values[key]);

    return (
      <div key={key}>
        <label className="mb-2 flex items-center gap-2 text-sm font-bold text-gray-700">
          {label}
          {isImage && <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">Image</span>}
          {isBrand && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">Brand</span>}
          {(isNavLinks || isStringList || isIndustries || isProcessSteps || isTestimonials || isFAQs || isWhyChooseUs || isServices) && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">Visual Editor</span>
          )}
          {(isCertificates || isClients) && (
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700">Visual Editor</span>
          )}
          {type === 'textarea' && <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700">Text</span>}
        </label>

        {isBrand ? (
          <BrandEditor value={values[key]} onChange={(v) => handleChange(key, v)} />
        ) : isNavLinks ? (
          <NavLinksEditor value={values[key]} onChange={(v) => handleChange(key, v)} showConfirm={showConfirm} />
        ) : isStringList ? (
          <StringListEditor value={values[key]} onChange={(v) => handleChange(key, v)} showConfirm={showConfirm} placeholder={placeholder} />
        ) : isCertificates ? (
          <CertificatesEditor value={values[key]} onChange={(v) => handleChange(key, v)} showConfirm={showConfirm} />
        ) : isClients ? (
          <ClientsEditor value={values[key]} onChange={(v) => handleChange(key, v)} showConfirm={showConfirm} />
        ) : isIndustries ? (
          <IndustriesEditor value={values[key]} onChange={(v) => handleChange(key, v)} showConfirm={showConfirm} />
        ) : isProcessSteps ? (
          <ProcessStepsEditor value={values[key]} onChange={(v) => handleChange(key, v)} showConfirm={showConfirm} />
        ) : isTestimonials ? (
          <TestimonialsEditor value={values[key]} onChange={(v) => handleChange(key, v)} showConfirm={showConfirm} />
        ) : isFAQs ? (
          <FAQsEditor value={values[key]} onChange={(v) => handleChange(key, v)} showConfirm={showConfirm} />
        ) : isWhyChooseUs ? (
          <WhyChooseUsEditor value={values[key]} onChange={(v) => handleChange(key, v)} showConfirm={showConfirm} />
        ) : isServices ? (
          <ServicesEditor value={values[key]} onChange={(v) => handleChange(key, v)} showConfirm={showConfirm} />
        ) : isImage ? (
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-semibold text-gray-500">URL Input</p>
                <input className="input" value={displayValue} onChange={(e) => handleChange(key, e.target.value)} placeholder="https://example.com/image.jpg" />
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold text-gray-500">Or Upload (max 500KB)</p>
                <input type="file" accept="image/*" onChange={(e) => handleFile(key, e)} className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-xl file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20" />
              </div>
            </div>
            {displayValue && (
              <div className="relative inline-block">
                <img src={displayValue} alt="preview" className="max-h-40 rounded-2xl object-cover shadow-lg ring-1 ring-black/5" onError={(e) => { e.target.style.display = 'none'; }} />
                <button type="button" onClick={() => handleChange(key, '')} className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600">
                  <i className="fas fa-times text-xs" />
                </button>
              </div>
            )}
          </div>
        ) : type === 'textarea' ? (
          <textarea className="input" rows="4" value={displayValue} onChange={(e) => handleChange(key, e.target.value)} placeholder={`Enter ${label.toLowerCase()}…`} />
        ) : (
          <input className="input" type={type === 'number' ? 'number' : 'text'} value={displayValue} onChange={(e) => handleChange(key, e.target.value)} placeholder={`Enter ${label.toLowerCase()}…`} />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] py-10">
      <Toast toasts={toasts} removeToast={removeToast} />
      <ConfirmDialog
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        danger={confirmState.danger}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState({ open: false })}
      />

      <div className="mx-auto max-w-5xl px-6">
        <div className={`mb-8 flex flex-wrap items-center justify-between gap-4 ${ready ? 'animate-fade-in' : 'opacity-0'}`}>
          <div>
            <h1 className="text-4xl font-black text-dark">Website Settings</h1>
            <p className="mt-1 text-gray-500">Manage all content, images, and information across your website.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setExpandedGroups(Object.fromEntries(Object.keys(groupedSections).map((g) => [g, true])))} className="rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-primary/40">
              <i className="fas fa-expand-arrows-alt mr-1" /> Expand All
            </button>
            <button onClick={() => setExpandedGroups({})} className="rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-primary/40">
              <i className="fas fa-compress-arrows-alt mr-1" /> Collapse All
            </button>
          </div>
        </div>

        {!ready ? (
          <div className="space-y-6 opacity-0">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 rounded-3xl bg-white shadow-lg" />
            ))}
          </div>
        ) : (
          <div className="animate-fade-in space-y-6">
            {Object.entries(groupedSections).map(([groupName, sections]) => (
              <div key={groupName} className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-black/5">
                <button onClick={() => toggleGroup(groupName)} className="flex w-full items-center justify-between gap-4 bg-gradient-to-r from-white to-gray-50 px-6 py-5 text-left transition hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-red-500 text-xl text-white shadow-lg">
                      <i className={`fas ${GROUP_ICONS[groupName] || 'fa-cog'}`} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-dark">{groupName}</h2>
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                        {sections.length} field{sections.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition ${expandedGroups[groupName] ? 'rotate-180 bg-primary text-white' : ''}`}>
                    <i className="fas fa-chevron-down text-sm" />
                  </span>
                </button>

                {expandedGroups[groupName] && (
                  <div className="space-y-5 border-t border-gray-100 p-6">
                    {sections.map(renderField)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {ready && (
          <div className="sticky bottom-6 mt-10 animate-fade-in">
            <div className={`rounded-3xl border p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 ${hasChanges ? 'border-primary/40 bg-white/95 ring-2 ring-primary/20' : 'border-white/40 bg-white/80'}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-white shadow-lg ${hasChanges ? 'bg-gradient-to-br from-amber-500 to-orange-600 animate-pulse' : 'bg-gradient-to-br from-green-500 to-emerald-600'}`}>
                    <i className={`fas ${hasChanges ? 'fa-exclamation' : 'fa-check'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-dark">{hasChanges ? 'You have unsaved changes' : 'All changes saved'}</p>
                    <p className="text-xs text-gray-500">{hasChanges ? 'Click Save to apply changes' : 'Your website is up to date'}</p>
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving || !hasChanges}
                  className={`relative inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-3.5 font-bold text-white shadow-xl transition-all duration-300 ${!hasChanges ? 'cursor-not-allowed bg-gray-300' : 'bg-gradient-to-r from-primary to-red-600 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0'}`}
                >
                  {saving ? <><i className="fas fa-spinner fa-spin" /> Saving…</> : <><i className={`fas ${hasChanges ? 'fa-save' : 'fa-check-circle'}`} /> {hasChanges ? 'Save All Settings' : 'Saved'}</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
