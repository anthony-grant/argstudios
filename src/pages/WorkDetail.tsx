import { useParams, Link, useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";
import { CORAL, DARK, CREAM, projects, additionalImages } from "@/app/data";

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

      {/* Hero */}
      <section className="min-h-screen flex flex-col justify-end px-6 md:px-10 pb-16 md:pb-24 pt-40" style={{ backgroundColor: DARK }}>
        <div className="max-w-5xl">
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

          <p
            className="font-['Epilogue',sans-serif] font-light leading-relaxed"
            style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)", color: "rgba(246,242,236,0.7)", maxWidth: "60ch" }}
          >
            {project.description}
          </p>
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
            {filteredImages.map((img) => (
              <div key={img.src} className="mb-3 overflow-hidden group cursor-pointer" style={{ breakInside: "avoid" }}>
                <div className="relative overflow-hidden" style={{ background: "#1A1A18" }}>
                  <img src={img.src} alt={img.label} className="w-full h-auto block transition-transform duration-500 group-hover:scale-105" />
                  <div
                    className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(to top, rgba(12,12,11,0.85) 0%, transparent 60%)" }}
                  >
                    <span className="font-['DM_Mono',monospace] text-xs tracking-widest" style={{ color: "rgba(246,242,236,0.9)" }}>
                      {img.label}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <>
          {/* Cover image */}
          <section className="px-6 md:px-10 py-2">
            <div className="w-full overflow-hidden" style={{ aspectRatio: "16/9", background: "#1A1A18" }}>
              <img src={project.img} alt={project.title} className="w-full h-full object-cover opacity-80" />
            </div>
          </section>

          {/* Placeholder content blocks */}
          <section className="px-6 md:px-10 py-24 md:py-32">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="w-full flex items-center justify-center"
                  style={{ height: 280, background: "#1A1A18", border: "1px solid rgba(246,242,236,0.08)" }}
                >
                  <p className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase" style={{ color: "rgba(246,242,236,0.15)" }}>
                    —
                  </p>
                </div>
              ))}
            </div>
          </section>
        </>
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
