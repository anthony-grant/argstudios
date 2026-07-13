import { useParams, Link } from "react-router";
import { CORAL, DARK, CREAM, additionalImages } from "@/app/data";
import { renderLinkedText } from "@/lib/linkedText";

export default function AdditionalProjectDetail() {
  const { slug } = useParams();
  const img = additionalImages.find((i) => i.slug === slug);

  if (!img) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: DARK, color: CREAM }}>
        <p className="font-['DM_Mono',monospace] text-sm tracking-widest uppercase opacity-60">Not found</p>
        <Link to="/" className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase underline" style={{ color: CORAL }}>
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: DARK, color: CREAM }}>
      <div className="px-6 md:px-10 pt-10">
        <Link
          to="/#work"
          className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase inline-flex items-center gap-1.5"
          style={{ color: "rgba(246,242,236,0.6)" }}
        >
          ← Back
        </Link>
      </div>

      <div className="px-6 md:px-10 pt-10 pb-6" style={{ background: "#1A1A18" }}>
        <img src={img.src} alt={img.label} className="w-full h-auto max-h-[75vh] object-contain mx-auto block" />
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-10 py-16 md:py-20">
        <h1 className="font-['DM_Mono',monospace] text-2xl md:text-3xl tracking-tight mb-6" style={{ color: CREAM }}>
          {img.label}
        </h1>

        {img.description && (
          <p className="text-base md:text-lg leading-relaxed mb-8" style={{ color: "rgba(246,242,236,0.8)" }}>
            {renderLinkedText(img.description, undefined, { color: CORAL })}
          </p>
        )}

        {img.linkUrl && (
          <a
            href={img.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase inline-flex items-center gap-1.5 px-4 py-2.5 border"
            style={{ color: DARK, backgroundColor: CORAL, borderColor: CORAL }}
          >
            {img.linkLabel || "View link"} <span aria-hidden>→</span>
          </a>
        )}
      </div>
    </div>
  );
}
