import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import imgPortrait from "@/imports/ContentBlock1/portrait.webp";
import { CORAL, DARK, CREAM, projects } from "@/app/data";

// ─── Shared components ────────────────────────────────────────────────────────

function ArgLogo({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 2334 2334"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 88, height: 88, display: "block", transition: "fill 0.4s ease", fill: color }}
    >
      <path fillRule="evenodd" d="M1166.713,67.272c293.646,0 569.692,114.35 777.346,322c207.654,207.654 322,483.75 322,777.442c0,293.646 -114.346,569.692 -322,777.346c-207.654,207.65 -483.7,322 -777.346,322c-293.692,0 -569.787,-114.35 -777.438,-322c-207.654,-207.654 -322.004,-483.7 -322.004,-777.346c0,-293.692 114.35,-569.787 322.004,-777.442c207.65,-207.65 483.746,-322 777.438,-322m0,-23.604c-620.258,0 -1123.046,502.792 -1123.046,1123.046c0,620.163 502.787,1122.95 1123.046,1122.95c620.163,0 1122.95,-502.788 1122.95,-1122.95c0,-620.254 -502.787,-1123.046 -1122.95,-1123.046" />
      <path fillRule="evenodd" d="M1703.471,1601.976l-327.821,0c-4.842,0 -9.217,-2.979 -10.987,-7.492l-44.837,-113.838l-300.071,0l-43.533,113.742c-1.767,4.562 -6.146,7.588 -11.033,7.588l-322.654,0c-3.954,0 -7.679,-1.954 -9.867,-5.258c-2.142,-3.308 -2.563,-7.45 -1.025,-11.083l380.758,-909.946c1.813,-4.421 6.096,-7.263 10.892,-7.263l299.421,0c4.75,0 9.033,2.842 10.896,7.263l380.758,909.946c1.533,3.633 1.117,7.775 -1.071,11.083c-2.192,3.304 -5.867,5.258 -9.825,5.258m-319.812,-23.604l302.075,0l-370.888,-886.338l-283.729,0l-370.842,886.338l296.812,0l43.533,-113.742c1.767,-4.562 6.146,-7.592 11.033,-7.592l316.225,0c4.846,0 9.221,2.983 10.992,7.496l44.788,113.838Z" />
    </svg>
  );
}

function Nav({ activeSection }: { activeSection: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { id: "work", label: "Work" },
    { id: "about", label: "About" },
    { id: "contact", label: "Contact" },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const logoColor = activeSection === "about" ? "#ee3b24" : "#FFFFFF";
  const navTextColor = activeSection === "about" ? DARK : "#FFFFFF";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10">
      <button onClick={() => scrollTo("hero")} className="transition-opacity hover:opacity-60" aria-label="Home">
        <ArgLogo color={logoColor} />
      </button>

      <div className="hidden md:flex items-center gap-8">
        {links.map((l) => (
          <button
            key={l.id}
            onClick={() => scrollTo(l.id)}
            className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase transition-opacity hover:opacity-50"
            style={{ color: navTextColor, opacity: activeSection === l.id ? 1 : 0.5 }}
          >
            {l.label}
          </button>
        ))}
      </div>

      <button
        className="md:hidden font-['DM_Mono',monospace] text-xs tracking-widest uppercase"
        style={{ color: navTextColor }}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "Close" : "Menu"}
      </button>

      {menuOpen && (
        <div className="absolute top-full left-0 right-0 flex flex-col gap-6 px-6 py-8" style={{ background: DARK }}>
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              className="font-['Bricolage_Grotesque',sans-serif] font-semibold text-4xl text-left text-white hover:text-[#FF5A5F] transition-colors"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

// ─── useFitText ───────────────────────────────────────────────────────────────

function useFitText(active: boolean) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const inner = innerRef.current;
    const text = textRef.current;
    if (!inner || !text) return;

    const fit = () => {
      const availH = inner.clientHeight;
      const availW = inner.clientWidth;
      if (availH === 0 || availW === 0) return;
      let lo = 8, hi = 600;
      for (let i = 0; i < 30; i++) {
        const mid = (lo + hi) / 2;
        text.style.fontSize = `${mid}px`;
        if (text.scrollHeight <= availH) lo = mid;
        else hi = mid;
      }
      text.style.fontSize = `${lo}px`;
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(inner);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [active]);

  return { outerRef, innerRef, textRef };
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  const scrollToWork = () => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  const { outerRef, innerRef, textRef } = useFitText(true);

  return (
    <section
      id="hero"
      className="relative min-h-screen md:h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: CORAL, padding: "0 clamp(1.5rem, 4vw, 60px)" }}
    >
      <div ref={outerRef} className="w-full" style={{ height: "60vh", paddingTop: "clamp(130px, 15vh, 180px)" }}>
        <div ref={innerRef} className="w-full h-full overflow-hidden">
          <h1
            ref={textRef}
            className="font-['Space_Grotesk',sans-serif] text-white leading-[1.05] tracking-[-0.02em] w-full"
            style={{ fontWeight: 300, whiteSpace: "normal" }}
          >
            <span style={{ fontWeight: 700 }}>anthony grant</span>
            {" "}is a Designer of user interfaces
            <span className="opacity-60"> / </span>brands
            <span className="opacity-60"> / </span>visual artist
            <span className="opacity-60"> / </span>living &amp; creating in the Bay Area, California.
          </h1>
        </div>
      </div>

      <div
        className="flex items-end justify-between gap-6 w-full"
        style={{ height: "40vh", paddingBottom: "clamp(1.5rem, 4vh, 60px)" }}
      >
        <button onClick={scrollToWork} className="hover:opacity-60 transition-opacity shrink-0" aria-label="Scroll to work">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 14 H28 Q34 14 34 20 V36" stroke="#7C1515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M27 29 L34 37 L41 29" stroke="#7C1515" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="relative shrink-0" style={{ width: "clamp(80px, 18vh, 200px)", height: "clamp(80px, 18vh, 200px)" }}>
          <svg width="0" height="0" className="absolute">
            <defs>
              <clipPath id="portrait-clip" clipPathUnits="objectBoundingBox">
                <path d="M0.524 0.027C0.543 0.008 0.573 0.008 0.592 0.027L0.973 0.407C0.982 0.416 0.987 0.429 0.987 0.441V0.938C0.987 0.964 0.964 0.987 0.938 0.987H0.441C0.429 0.987 0.416 0.982 0.407 0.973L0.027 0.592C0.008 0.573 0.008 0.543 0.027 0.524L0.524 0.027Z" />
              </clipPath>
            </defs>
          </svg>
          <img src={imgPortrait} alt="Anthony Grant" className="w-full h-full object-cover" style={{ clipPath: "url(#portrait-clip)" }} />
        </div>
      </div>
    </section>
  );
}

// ─── Work ─────────────────────────────────────────────────────────────────────

function WorkRow({ project }: { project: typeof projects[0] }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={`/work/${project.slug}`} className="block">
      <div
        className="relative border-t py-8 md:py-10 cursor-pointer overflow-hidden"
        style={{ borderColor: "rgba(246,242,236,0.1)" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="absolute inset-0 transition-opacity duration-300 pointer-events-none" style={{ background: CORAL, opacity: hovered ? 1 : 0 }} />

        <div className="relative z-10 grid grid-cols-12 gap-4 items-center px-1">
          <span
            className="col-span-2 md:col-span-1 font-['DM_Mono',monospace] text-xs tracking-widest transition-colors duration-300"
            style={{ color: hovered ? "rgba(255,255,255,0.5)" : "rgba(246,242,236,0.3)" }}
          >
            {project.index}
          </span>

          <div className="col-span-8 md:col-span-6">
            <h3
              className="font-['Bricolage_Grotesque',sans-serif] font-bold leading-none tracking-tight transition-colors duration-300"
              style={{ fontSize: "clamp(1.8rem, 4.5vw, 5rem)", color: hovered ? DARK : "#F6F2EC" }}
            >
              {project.title}
            </h3>
          </div>

          <div className="hidden md:flex col-span-3 flex-col gap-1 items-end">
            <span
              className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase transition-colors duration-300"
              style={{ color: hovered ? DARK : "rgba(246,242,236,0.5)" }}
            >
              {project.category}
            </span>
          </div>

          <div className="col-span-2 md:col-span-2 flex justify-end">
            <span
              className="font-['DM_Mono',monospace] text-lg transition-all duration-300"
              style={{ color: hovered ? DARK : "rgba(246,242,236,0.3)", transform: hovered ? "translate(4px, -4px)" : "none" }}
            >
              ↗
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Work() {
  return (
    <section id="work" className="min-h-screen px-6 md:px-10 py-24 md:py-32" style={{ backgroundColor: DARK }}>
      <div className="mb-16 md:mb-24">
        <h2 className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase" style={{ color: "rgba(246,242,236,0.4)" }}>
          Selected Work
        </h2>
      </div>

      <div>
        {projects.map((p) => <WorkRow key={p.slug} project={p} />)}
        <div className="border-t" style={{ borderColor: "rgba(246,242,236,0.1)" }} />
      </div>
    </section>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  return (
    <section id="about" className="px-6 md:px-10 py-24 md:py-32" style={{ backgroundColor: CREAM }}>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
        <div className="md:col-span-2">
          <span className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase" style={{ color: "rgba(12,12,11,0.4)" }}>
            About
          </span>
        </div>

        <div className="md:col-span-7">
          <p className="font-['Bricolage_Grotesque',sans-serif] font-bold leading-[1.05] tracking-tight mb-12" style={{ fontSize: "clamp(2rem, 5vw, 5rem)", color: DARK }}>
            Interfaces that feel inevitable. Brands that earn recognition. Art that refuses easy explanation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <p className="font-['Epilogue',sans-serif] font-light leading-relaxed mb-6" style={{ fontSize: "1.05rem", color: "rgba(12,12,11,0.8)" }}>
                Anthony Grant is a San Francisco Bay Area designer and visual artist. His design practice spans UI/UX product design, brand identity, and visual systems — work that finds the intersection of human intuition and organizational clarity.
              </p>
              <p className="font-['Epilogue',sans-serif] font-light leading-relaxed" style={{ fontSize: "1.05rem", color: "rgba(12,12,11,0.8)" }}>
                Outside the screen, Anthony maintains an active studio practice in painting and mixed media, exhibited through his fine art site and ongoing collaborations with Bay Area cultural institutions.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <p className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(12,12,11,0.4)" }}>Disciplines</p>
                <ul className="flex flex-col gap-1">
                  {["UI / UX Design", "Brand Identity", "Visual Systems", "Art Direction", "Painting & Fine Art"].map((d) => (
                    <li key={d} className="font-['Epilogue',sans-serif] font-light border-b py-2" style={{ borderColor: "rgba(12,12,11,0.1)", color: DARK }}>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase mb-3" style={{ color: "rgba(12,12,11,0.4)" }}>Find me online</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "argstudios.com", href: "https://argstudios.com" },
                    { label: "anthonyrichardgrant.com", href: "https://anthonyrichardgrant.com" },
                    { label: "@anthony.r.grant", href: "https://instagram.com/anthony.r.grant" },
                  ].map((link) => (
                    <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="font-['DM_Mono',monospace] text-sm hover:opacity-50 transition-opacity inline-flex items-center gap-2" style={{ color: CORAL }}>
                      {link.label} <span className="text-xs">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 flex flex-col items-end justify-end">
          <p className="font-['DM_Mono',monospace] text-xs tracking-widest text-right" style={{ color: "rgba(12,12,11,0.35)" }}>
            Bay Area, CA
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact() {
  return (
    <section id="contact" className="relative min-h-[70vh] flex flex-col justify-between px-6 md:px-10 py-16 md:py-24 overflow-hidden" style={{ backgroundColor: CORAL }}>
      <div>
        <span className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase mb-8 block" style={{ color: "#7C1515" }}>Contact</span>
        <a href="mailto:hello@argstudios.com" className="group block">
          <h2 className="font-['Bricolage_Grotesque',sans-serif] font-extrabold text-white leading-none tracking-tighter transition-opacity hover:opacity-70" style={{ fontSize: "clamp(3rem, 12vw, 12rem)" }}>
            Let's work<br />together.
          </h2>
        </a>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mt-20">
        <div className="flex flex-col gap-3">
          {[
            { label: "Email", value: "hello@argstudios.com", href: "mailto:hello@argstudios.com" },
            { label: "Studio", value: "argstudios.com", href: "https://argstudios.com" },
            { label: "Art", value: "anthonyrichardgrant.com", href: "https://anthonyrichardgrant.com" },
            { label: "Instagram", value: "@anthony.r.grant", href: "https://instagram.com/anthony.r.grant" },
          ].map((item) => (
            <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-baseline gap-4 group">
              <span className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase w-20 shrink-0" style={{ color: "#7C1515" }}>{item.label}</span>
              <span className="font-['Epilogue',sans-serif] font-light text-white group-hover:opacity-50 transition-opacity">{item.value}</span>
            </a>
          ))}
        </div>
        <p className="font-['DM_Mono',monospace] text-xs" style={{ color: "rgba(124,21,21,0.6)" }}>© {new Date().getFullYear()} Anthony Grant</p>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sections = ["hero", "work", "about", "contact"];
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { threshold: 0.3 }
    );
    sections.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Epilogue', sans-serif" }}>
      <Nav activeSection={activeSection} />
      <Hero />
      <Work />
      <About />
      <Contact />
    </div>
  );
}
