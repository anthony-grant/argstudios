import { useParams, Link, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { CORAL, DARK, CREAM, projects, additionalImages } from "@/app/data";

// Recognizes YouTube/Vimeo links and returns an embeddable, chrome-free
// background URL; anything else is treated as a direct video file URL.
function getBackgroundVideoInfo(url?: string | null): { type: "embed" | "file"; src: string } | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{6,})/);
  if (yt) {
    const id = yt[1];
    return {
      type: "embed",
      src: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0`,
    };
  }
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) {
    const id = vimeo[1];
    return { type: "embed", src: `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&loop=1&background=1` };
  }
  return { type: "file", src: url };
}

function hexToRgba(hex?: string | null, opacity = 0): string | undefined {
  if (!hex) return undefined;
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  if (Number.isNaN(num) || full.length !== 6) return undefined;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${opacity})`;
}

function ArgLogo({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 2334 2334"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 64, height: 64, display: "block", fill: color, transition: "fill 0.3s ease" }}
    >
      <path fillRule="evenodd" d="M1166.713,67.272c293.646,0 569.692,114.35 777.346,322c207.654,207.654 322,483.75 322,777.442c0,293.646 -114.346,569.692 -322,777.346c-207.654,207.65 -483.7,322 -777.346,322c-293.692,0 -569.787,-114.35 -777.438,-322c-207.654,-207.654 -322.004,-483.7 -322.004,-777.346c0,-293.692 114.35,-569.787 322.004,-777.442c207.65,-207.65 483.746,-322 777.438,-322m0,-23.604c-620.258,0 -1123.046,502.792 -1123.046,1123.046c0,620.163 502.787,1122.95 1123.046,1122.95c620.163,0 1122.95,-502.788 1122.95,-1122.95c0,-620.254 -502.787,-1123.046 -1122.95,-1123.046" />
      <path fillRule="evenodd" d="M1703.471,1601.976l-327.821,0c-4.842,0 -9.217,-2.979 -10.987,-7.492l-44.837,-113.838l-300.071,0l-43.533,113.742c-1.767,4.562 -6.146,7.588 -11.033,7.588l-322.654,0c-3.954,0 -7.679,-1.954 -9.867,-5.258c-2.142,-3.308 -2.563,-7.45 -1.025,-11.083l380.758,-909.946c1.813,-4.421 6.096,-7.263 10.892,-7.263l299.421,0c4.75,0 9.033,2.842 10.896,7.263l380.758,909.946c1.533,3.633 1.117,7.775 -1.071,11.083c-2.192,3.304 -5.867,5.258 -9.825,5.258m-319.812,-23.604l302.075,0l-370.888,-886.338l-283.729,0l-370.842,886.338l296.812,0l43.533,-113.742c1.767,-4.562 6.146,-7.592 11.033,-7.592l316.225,0c4.846,0 9.221,2.983 10.992,7.496l44.788,113.838Z" />
    </svg>
  );
}

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: DARK }}>
        <p className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase mb-6" style={{ color: "rgba(246,242,236,0.4)" }}>
          Project not found
        </p>
        <Link to="/" className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white text-4xl hover:opacity-60 transition-opacity">
          ← Back home
        </Link>
      </div>
    );
  }

  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const isGallery = project.slug === "additional-projects";

  // Password-protected projects: the real content never ships in the client
  // bundle. It's fetched fresh from api/protected.js every time the page
  // loads. Only the *password* is cached in sessionStorage (not the
  // content), so a returning visitor in the same tab isn't re-prompted, but
  // they always see the current content — including any edits made via the
  // admin panel since they last unlocked it.
  type DemoLink = { url: string; label: string };
  type CaseStudyContent = {
    description: string;
    role?: string;
    approach?: string;
    outcome?: string;
    metric?: { value: string; label: string } | null;
    img: string;
    video?: string;
    overlayColor?: string;
    overlayOpacity?: number;
    overlayBlendMode?: string;
    backgroundColor?: string;
    gallery?: string[];
    galleryModal?: boolean;
    demos?: DemoLink[];
  };
  const [unlocked, setUnlocked] = useState<CaseStudyContent | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [checking, setChecking] = useState(false);
  const isLocked = Boolean(project.protected) && !unlocked;

  async function fetchProtectedContent(pw: string): Promise<boolean> {
    const res = await fetch("/api/protected", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, password: pw }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setUnlocked(data);
    return true;
  }

  useEffect(() => {
    setUnlocked(null);
    setPasswordInput("");
    setAuthError("");
    if (project.protected) {
      const cachedPassword = sessionStorage.getItem(`password:${slug}`);
      if (cachedPassword) {
        fetchProtectedContent(cachedPassword).then((ok) => {
          if (!ok) sessionStorage.removeItem(`password:${slug}`);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setAuthError("");
    try {
      const ok = await fetchProtectedContent(passwordInput);
      if (!ok) {
        setAuthError("Incorrect password");
        return;
      }
      sessionStorage.setItem(`password:${slug}`, passwordInput);
    } catch {
      setAuthError("Something went wrong. Try again.");
    } finally {
      setChecking(false);
    }
  }

  // Tag toggles for the gallery: derived automatically from whatever tags
  // exist on additionalImages, so adding a tag to any image is all it takes
  // to make a new toggle appear here — no other code changes needed.
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const allTags = useMemo(
    () => Array.from(new Set(additionalImages.flatMap((img) => img.tags))).sort(),
    []
  );
  const toggleTag = (tag: string) => {
    setActiveTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };
  const filteredImages =
    activeTags.length === 0
      ? additionalImages
      : additionalImages.filter((img) => img.tags.some((t) => activeTags.includes(t)));

  // Unified content for the case-study body: protected projects only have
  // this once unlocked, everyone else has it straight from data.ts.
  const content: CaseStudyContent | null = project.protected
    ? unlocked
    : (project as unknown as CaseStudyContent);
  const hasWriteup = Boolean(content?.role || content?.approach || content?.outcome);
  const videoInfo = getBackgroundVideoInfo(content?.video);
  const hasBackgroundMedia = Boolean(videoInfo || content?.img);
  const overlayBg = hexToRgba(content?.overlayColor, content?.overlayOpacity ?? 0);
  const galleryImages = content?.gallery || [];

  useEffect(() => {
    if (lightboxIndex === null || galleryImages.length === 0) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxIndex(null);
      else if (e.key === "ArrowLeft") setLightboxIndex((i) => (i === null ? null : (i - 1 + galleryImages.length) % galleryImages.length));
      else if (e.key === "ArrowRight") setLightboxIndex((i) => (i === null ? null : (i + 1) % galleryImages.length));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, galleryImages.length]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: DARK, fontFamily: "'Epilogue', sans-serif" }}>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4">
        <Link to="/" className="transition-opacity hover:opacity-60" aria-label="Home">
          <ArgLogo color="#FFFFFF" />
        </Link>
        <Link
          to="/#work"
          onClick={(e) => { e.preventDefault(); navigate("/"); setTimeout(() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" }), 100); }}
          className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase hover:opacity-50 transition-opacity"
          style={{ color: "rgba(246,242,236,0.5)" }}
        >
          ← Work
        </Link>
      </nav>

      {/* Hero — a full-bleed background image or video (with an optional
          tint overlay for legibility) sits behind everything; falls back to
          a solid color, or DARK if none is set. */}
      <section
        className="relative min-h-screen flex flex-col justify-end px-6 md:px-10 pb-16 md:pb-24 pt-40 overflow-hidden"
        style={{ backgroundColor: content?.backgroundColor || DARK }}
      >
        {hasBackgroundMedia && (
          <div className="absolute inset-0" style={{ zIndex: 0 }}>
            {videoInfo?.type === "file" ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                src={videoInfo.src}
              />
            ) : videoInfo?.type === "embed" ? (
              <div className="absolute inset-0 overflow-hidden">
                <iframe
                  src={videoInfo.src}
                  allow="autoplay; fullscreen"
                  title="Background video"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "100vw",
                    height: "56.25vw",
                    minHeight: "100vh",
                    minWidth: "177.78vh",
                    border: "none",
                    pointerEvents: "none",
                  }}
                />
              </div>
            ) : (
              content?.img && (
                <img src={content.img} alt="" className="w-full h-full object-cover" />
              )
            )}
          </div>
        )}
        {hasBackgroundMedia && overlayBg && (
          <div
            className="absolute inset-0"
            style={{
              zIndex: 1,
              background: overlayBg,
              mixBlendMode: (content?.overlayBlendMode || "normal") as React.CSSProperties["mixBlendMode"],
            }}
          />
        )}

        <div className="max-w-5xl relative" style={{ zIndex: 2 }}>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase" style={{ color: "rgba(246,242,236,0.3)" }}>
              {project.index}
            </span>
            <span className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase" style={{ color: CORAL }}>
              {project.category}
            </span>
          </div>

          <h1
            className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white leading-none tracking-tight mb-10"
            style={{ fontSize: "clamp(3.5rem, 10vw, 10rem)" }}
          >
            {project.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-12">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase px-3 py-1.5 border"
                style={{ color: "rgba(246,242,236,0.5)", borderColor: "rgba(246,242,236,0.15)" }}
              >
                {tag}
              </span>
            ))}
          </div>

          {isLocked ? (
            <form onSubmit={handleUnlock} className="max-w-sm">
              <p
                className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase mb-4"
                style={{ color: "rgba(246,242,236,0.4)" }}
              >
                This project is password protected
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  autoFocus
                  className="flex-1 bg-transparent border px-3 py-2 font-['Epilogue',sans-serif] text-white outline-none"
                  style={{ borderColor: "rgba(246,242,236,0.2)" }}
                />
                <button
                  type="submit"
                  disabled={checking}
                  className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase px-4 py-2 border transition-colors disabled:opacity-50"
                  style={{ color: DARK, backgroundColor: CORAL, borderColor: CORAL }}
                >
                  {checking ? "Checking…" : "Unlock"}
                </button>
              </div>
              {authError && (
                <p className="font-['DM_Mono',monospace] text-xs mt-3" style={{ color: CORAL }}>
                  {authError}
                </p>
              )}
            </form>
          ) : (
            <>
              <p
                className="font-['Epilogue',sans-serif] font-light leading-relaxed"
                style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)", color: "rgba(246,242,236,0.7)", maxWidth: "60ch" }}
              >
                {content?.description}
              </p>
              {content?.demos && content.demos.length > 0 && (
                <div className="flex flex-col md:flex-row gap-3 mt-8">
                  {content.demos.slice(0, 3).map((d, i) => {
                    const isExternal = /^https?:\/\//i.test(d.url);
                    const btnClass =
                      "inline-flex items-center justify-center gap-2 font-['DM_Mono',monospace] text-xs tracking-widest uppercase px-5 py-3 border transition-colors hover:opacity-80";
                    const btnStyle = { color: DARK, backgroundColor: CORAL, borderColor: CORAL };
                    return isExternal ? (
                      <a key={i} href={d.url} target="_blank" rel="noopener noreferrer" className={btnClass} style={btnStyle}>
                        {d.label} →
                      </a>
                    ) : (
                      <Link key={i} to={d.url} className={btnClass} style={btnStyle}>
                        {d.label} →
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {isGallery ? (
        /* Gallery of additional project images */
        <section className="px-6 md:px-10 py-24 md:py-32">
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {allTags.map((tag) => {
                const active = activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase px-3 py-1.5 border transition-colors duration-200"
                    style={
                      active
                        ? { color: DARK, backgroundColor: CORAL, borderColor: CORAL }
                        : { color: "rgba(246,242,236,0.5)", borderColor: "rgba(246,242,236,0.15)" }
                    }
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          )}
          <div style={{ columns: "3 280px", columnGap: "12px" }}>
            {filteredImages.map((img) => {
              const hasPage = Boolean(img.description);
              const overlay = (
                <div
                  className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(to top, rgba(12,12,11,0.85) 0%, transparent 60%)" }}
                >
                  {hasPage ? (
                    <span
                      className="inline-flex items-center gap-1.5 font-['DM_Mono',monospace] text-xs tracking-widest px-3 py-1.5 border"
                      style={{ color: DARK, backgroundColor: CORAL, borderColor: CORAL }}
                    >
                      {img.label} <span aria-hidden>→</span>
                    </span>
                  ) : (
                    <span className="font-['DM_Mono',monospace] text-xs tracking-widest" style={{ color: "rgba(246,242,236,0.9)" }}>
                      {img.label}
                    </span>
                  )}
                </div>
              );
              const tile = (
                <div className="relative overflow-hidden" style={{ background: "#1A1A18" }}>
                  <img src={img.src} alt={img.label} className="w-full h-auto block transition-transform duration-500 group-hover:scale-105" />
                  {overlay}
                </div>
              );
              return hasPage ? (
                <Link
                  key={img.slug || img.src}
                  to={`/work/additional-projects/${img.slug}`}
                  className="block mb-3 overflow-hidden group cursor-pointer"
                  style={{ breakInside: "avoid" }}
                >
                  {tile}
                </Link>
              ) : (
                <div key={img.slug || img.src} className="mb-3 overflow-hidden group" style={{ breakInside: "avoid" }}>
                  {tile}
                </div>
              );
            })}
          </div>
        </section>
      ) : isLocked ? null : (
        <>
          <section className="px-6 md:px-10 py-24 md:py-32">
            {hasWriteup ? (
              <>
                {/* Role / Approach / Outcome */}
                <div className="max-w-3xl space-y-16 mb-20">
                  {content?.role && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
                      <div className="md:col-span-3">
                        <p className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase" style={{ color: "rgba(246,242,236,0.3)" }}>
                          Role
                        </p>
                      </div>
                      <div className="md:col-span-9">
                        <p className="font-['Epilogue',sans-serif] font-light leading-relaxed" style={{ fontSize: "1.15rem", color: "rgba(246,242,236,0.85)" }}>
                          {content.role}
                        </p>
                      </div>
                    </div>
                  )}

                  {content?.approach && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
                      <div className="md:col-span-3">
                        <p className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase" style={{ color: "rgba(246,242,236,0.3)" }}>
                          Approach
                        </p>
                      </div>
                      <div className="md:col-span-9">
                        <p className="font-['Epilogue',sans-serif] font-light leading-relaxed" style={{ fontSize: "1.15rem", color: "rgba(246,242,236,0.85)" }}>
                          {content.approach}
                        </p>
                      </div>
                    </div>
                  )}

                  {content?.outcome && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
                      <div className="md:col-span-3">
                        <p className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase" style={{ color: "rgba(246,242,236,0.3)" }}>
                          Outcome
                        </p>
                      </div>
                      <div className="md:col-span-9">
                        <p className="font-['Epilogue',sans-serif] font-light leading-relaxed" style={{ fontSize: "1.15rem", color: "rgba(246,242,236,0.85)" }}>
                          {content.outcome}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Metric callout */}
                {content?.metric && (
                  <div className="mb-20 pt-12 border-t" style={{ borderColor: "rgba(246,242,236,0.1)" }}>
                    <p
                      className="font-['Bricolage_Grotesque',sans-serif] font-bold leading-none tracking-tight mb-3"
                      style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", color: CORAL }}
                    >
                      {content.metric.value}
                    </p>
                    <p className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase" style={{ color: "rgba(246,242,236,0.4)" }}>
                      {content.metric.label}
                    </p>
                  </div>
                )}

                {/* Gallery — flexible, 0 to many images. When galleryModal is
                    enabled, images open a one-at-a-time lightbox instead of
                    just sitting in the masonry grid. */}
                {galleryImages.length > 0 && (
                  <div style={{ columns: "2 320px", columnGap: "12px" }}>
                    {galleryImages.map((src, i) =>
                      content?.galleryModal ? (
                        <button
                          key={src}
                          type="button"
                          onClick={() => setLightboxIndex(i)}
                          className="mb-3 block w-full overflow-hidden cursor-pointer"
                          style={{ breakInside: "avoid", background: "#1A1A18", border: "none", padding: 0 }}
                        >
                          <img src={src} alt="" className="w-full h-auto block" />
                        </button>
                      ) : (
                        <div key={src} className="mb-3 overflow-hidden" style={{ breakInside: "avoid", background: "#1A1A18" }}>
                          <img src={src} alt="" className="w-full h-auto block" />
                        </div>
                      )
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-3">
                  <p className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase" style={{ color: "rgba(246,242,236,0.3)" }}>
                    Overview
                  </p>
                </div>
                <div className="md:col-span-7">
                  <div
                    className="w-full rounded-none flex items-center justify-center"
                    style={{ height: 320, background: "#1A1A18", border: "1px solid rgba(246,242,236,0.08)" }}
                  >
                    <p className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase" style={{ color: "rgba(246,242,236,0.2)" }}>
                      Case study coming soon
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {/* Gallery lightbox — one image at a time, with pagination controls
          centered at the bottom of the modal. */}
      {lightboxIndex !== null && galleryImages.length > 0 && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          style={{ background: "rgba(12,12,11,0.92)" }}
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
            aria-label="Close"
            className="absolute top-6 right-6 font-['DM_Mono',monospace] text-2xl hover:opacity-60 transition-opacity"
            style={{ color: "#F6F2EC", background: "none", border: "none", cursor: "pointer", lineHeight: 1 }}
          >
            ✕
          </button>

          <img
            src={galleryImages[lightboxIndex]}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-[80vh] object-contain"
          />

          {galleryImages.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-8 left-1/2 flex items-center gap-5"
              style={{ transform: "translateX(-50%)" }}
            >
              <button
                type="button"
                onClick={() => setLightboxIndex((i) => (i === null ? null : (i - 1 + galleryImages.length) % galleryImages.length))}
                aria-label="Previous image"
                className="font-['DM_Mono',monospace] text-lg hover:opacity-60 transition-opacity"
                style={{ color: "#F6F2EC", background: "none", border: "none", cursor: "pointer" }}
              >
                ←
              </button>
              <span className="font-['DM_Mono',monospace] text-xs tracking-widest" style={{ color: "rgba(246,242,236,0.7)" }}>
                {lightboxIndex + 1} / {galleryImages.length}
              </span>
              <button
                type="button"
                onClick={() => setLightboxIndex((i) => (i === null ? null : (i + 1) % galleryImages.length))}
                aria-label="Next image"
                className="font-['DM_Mono',monospace] text-lg hover:opacity-60 transition-opacity"
                style={{ color: "#F6F2EC", background: "none", border: "none", cursor: "pointer" }}
              >
                →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Next project */}
      <section className="border-t" style={{ borderColor: "rgba(246,242,236,0.1)" }}>
        <Link to={`/work/${nextProject.slug}`} className="group block px-6 md:px-10 py-16 md:py-20 hover:bg-[#FF5A5F] transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase mb-4 transition-colors duration-300" style={{ color: "rgba(246,242,236,0.4)" }}>
                Next project
              </p>
              <h3
                className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white leading-none tracking-tight transition-colors duration-300"
                style={{ fontSize: "clamp(2rem, 6vw, 6rem)" }}
              >
                {nextProject.title}
              </h3>
            </div>
            <span className="font-['DM_Mono',monospace] text-4xl text-white opacity-30 group-hover:opacity-100 group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-300">
              ↗
            </span>
          </div>
        </Link>
      </section>
    </div>
  );
}
