import { useEffect, useState } from "react";
import { Link } from "react-router";
import { CORAL, DARK } from "@/app/data";

const PDF_URL = "/uploads/balancing-efficiency-and-velocity-presentation-v4-1783930075930.pdf";

export default function MetaPresentation() {
  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  async function tryPassword(pw: string): Promise<boolean> {
    const res = await fetch("/api/protected", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: "meta", password: pw }),
    });
    return res.ok;
  }

  useEffect(() => {
    const cached = sessionStorage.getItem("password:meta");
    if (cached) {
      tryPassword(cached).then((ok) => {
        if (ok) setUnlocked(true);
        else sessionStorage.removeItem("password:meta");
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setAuthError("");
    try {
      const ok = await tryPassword(passwordInput);
      if (!ok) {
        setAuthError("Incorrect password");
        return;
      }
      sessionStorage.setItem("password:meta", passwordInput);
      setUnlocked(true);
    } catch {
      setAuthError("Something went wrong. Try again.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: DARK, fontFamily: "'Epilogue', sans-serif" }}>
      <nav className="flex items-center justify-between px-6 md:px-10 py-6">
        <Link
          to="/work/meta"
          className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase hover:opacity-60 transition-opacity"
          style={{ color: "rgba(246,242,236,0.5)" }}
        >
          ← Meta
        </Link>
        <Link to="/" className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase hover:opacity-60 transition-opacity" style={{ color: "rgba(246,242,236,0.3)" }}>
          Site home
        </Link>
      </nav>

      {!unlocked ? (
        <div className="flex-1 flex items-center justify-center px-6">
          <form onSubmit={handleUnlock} className="w-full max-w-sm">
            <p className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase mb-4" style={{ color: "rgba(246,242,236,0.4)" }}>
              This presentation is password protected
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
        </div>
      ) : (
        <div className="flex-1 flex flex-col px-6 md:px-10 pb-10">
          <p className="font-['DM_Mono',monospace] text-xs tracking-widest uppercase mb-4" style={{ color: CORAL }}>
            Balancing Efficiency and Velocity
          </p>
          <div
            className="flex-1 w-full max-w-5xl mx-auto overflow-hidden"
            style={{ minHeight: "80vh", background: "#1A1A18", border: "1px solid rgba(246,242,236,0.1)" }}
            onContextMenu={(e) => e.preventDefault()}
          >
            <iframe
              src={`${PDF_URL}#toolbar=0&navpanes=0`}
              title="Balancing Efficiency and Velocity presentation"
              style={{ width: "100%", height: "100%", minHeight: "80vh", border: "none" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
