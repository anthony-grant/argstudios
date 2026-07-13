import { useEffect } from "react";
import { Link } from "react-router";
import { CORAL, DARK } from "@/app/data";
import { AndroidDevice } from "@/components/AndroidFrame";
import CreditScoreScreen from "@/components/CreditScoreScreen";

export default function CreditScoreDemo() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: DARK, fontFamily: "'Epilogue', sans-serif" }}>
      <nav className="flex items-center justify-between px-6 md:px-10 py-6">
        <Link
          to="/work/branch"
          className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase hover:opacity-60 transition-opacity"
          style={{ color: "rgba(246,242,236,0.5)" }}
        >
          ← Branch International
        </Link>
        <Link to="/" className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase hover:opacity-60 transition-opacity" style={{ color: "rgba(246,242,236,0.3)" }}>
          Site home
        </Link>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <p className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase mb-2" style={{ color: CORAL }}>
          Interactive prototype
        </p>
        <h1 className="font-['Bricolage_Grotesque',sans-serif] font-bold text-white text-center mb-2" style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)" }}>
          Credit Score Reveal
        </h1>
        <p className="text-center mb-10" style={{ color: "rgba(246,242,236,0.5)", maxWidth: "42ch" }}>
          Tap the gauge once it settles to pull a new score.
        </p>

        <div style={{ transform: "scale(0.85)", transformOrigin: "top center" }}>
          <AndroidDevice>
            <CreditScoreScreen />
          </AndroidDevice>
        </div>
      </div>
    </div>
  );
}
