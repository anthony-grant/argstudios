import { Link } from "react-router";
import { DARK, CORAL } from "@/app/data";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-start justify-between px-6 md:px-10 py-16 md:py-24"
      style={{ backgroundColor: DARK }}
    >
      <span className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase" style={{ color: CORAL }}>
        404
      </span>

      <div>
        <h1
          className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white leading-none tracking-tight mb-8"
          style={{ fontSize: "clamp(4rem, 14vw, 14rem)" }}
        >
          Not<br />found.
        </h1>
        <Link
          to="/"
          className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase hover:opacity-50 transition-opacity inline-flex items-center gap-3"
          style={{ color: "rgba(246,242,236,0.5)" }}
        >
          ← Back home
        </Link>
      </div>

      <p className="font-['DM_Mono',monospace] text-xs" style={{ color: "rgba(246,242,236,0.2)" }}>
        © {new Date().getFullYear()} Anthony Grant
      </p>
    </div>
  );
}
