import { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function GalleryPage() {
  const [data, setData] = useState({
    ready: false,
    photos: [],
    videoUrl: '',
  });
  const [selected, setSelected] = useState(null);

  /* ═══════════════════════════════════════════
     LOAD DATA
  ═══════════════════════════════════════════ */
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        // Fetch photos + video URL in parallel
        const [photosRes, videoRes] = await Promise.all([
          api.get('/photos').catch(() => []),
          api.get('/settings/gallery_video_url').catch(() => ({ value: '' })),
        ]);

        if (cancelled) return;

        const photos = Array.isArray(photosRes) ? photosRes : [];
        const videoUrl = videoRes?.value || '';

        setData({
          ready: true,
          photos,
          videoUrl,
        });
      } catch (err) {
        console.error('Gallery load error:', err);
        if (!cancelled) setData(prev => ({ ...prev, ready: true }));
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  /* ═══════════════════════════════════════════
     YOUTUBE URL HELPER
  ═══════════════════════════════════════════ */
  const getYouTubeEmbed = (url) => {
    if (!url) return '';
    // Already an embed URL
    if (url.includes('/embed/')) return url;
    // Standard watch URL: youtube.com/watch?v=ID
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
    // Short URL: youtu.be/ID
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
    // Fallback — treat as raw ID
    return `https://www.youtube.com/embed/${url}`;
  };

  /* ═══════════════════════════════════════════
     RENDER
  ═══════════════════════════════════════════ */
  // Blank until ready
  if (!data.ready) {
    return <div className="min-h-screen bg-[#f0f2f5]" />;
  }

  const { photos, videoUrl } = data;
  const embedUrl = getYouTubeEmbed(videoUrl);

  return (
    <div className="animate-fade-in py-24">
      <div className="mx-auto max-w-7xl px-4">

        {/* ═══════ Header ═══════ */}
        <div className="mb-16 text-center">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            Our Work
          </span>
          <h1 className="section-title mt-4">Gallery</h1>
          <p className="section-subtitle">
            A glimpse of our projects, team, and capabilities.
          </p>
        </div>

        {/* ═══════ Photos Grid ═══════ */}
        {photos.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {photos.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="group relative animate-fade-in-up overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:ring-primary/30"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <img
                  src={p.image_url}
                  alt={p.title}
                  className="h-48 w-full object-cover transition duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />

                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-4 text-left text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-sm font-bold">{p.title}</p>
                  {p.category && (
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-white/70">
                      {p.category}
                    </p>
                  )}
                </div>

                {/* View icon */}
                <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100">
                  <i className="fas fa-expand text-xs" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-md rounded-3xl border-2 border-dashed border-gray-300 bg-white/50 p-12 text-center">
            <i className="fas fa-images text-5xl text-gray-300" />
            <p className="mt-4 text-gray-500">No photos yet.</p>
            <p className="mt-1 text-xs text-gray-400">
              Photos will appear here once added from admin panel.
            </p>
          </div>
        )}

        {/* ═══════ Video Section ═══════ */}
        {embedUrl && (
          <div className="mt-24">
            <div className="mb-10 text-center">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                Watch
              </span>
              <h2 className="section-title mt-4">Company Video</h2>
              <p className="section-subtitle">
                Learn more about what we do.
              </p>
            </div>

            <div className="aspect-video overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5">
              <iframe
                className="h-full w-full"
                src={embedUrl}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* ═══════ Lightbox ═══════ */}
        {selected && (
          <div
            className="lightbox-backdrop fixed inset-0 z-50 flex animate-fade-in items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div className="relative max-h-[90vh] max-w-5xl animate-scale-in">
              <img
                src={selected.image_url}
                alt={selected.title}
                className="max-h-[80vh] w-auto rounded-2xl shadow-2xl ring-1 ring-white/10"
              />

              {/* Title + category */}
              <div className="mt-4 text-center">
                <p className="text-lg font-bold text-white">{selected.title}</p>
                {selected.category && (
                  <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-white/60">
                    {selected.category}
                  </p>
                )}
              </div>
            </div>

            {/* Close button */}
            <button
              className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white backdrop-blur-md transition hover:bg-red-500 sm:right-6 sm:top-6"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              <i className="fas fa-times" />
            </button>

            {/* Photo counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-md">
              {photos.findIndex(p => p.id === selected.id) + 1} / {photos.length}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
