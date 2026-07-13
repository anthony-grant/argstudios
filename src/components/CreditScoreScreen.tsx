// Ported from "Mobile credit score animation/Credit Score.dc.html" — that
// file was authored in a proprietary template DSL (custom runtime, not
// plain React) so this is a hand-translation of its template + Component
// logic into a normal React function component. Behavior, timings, and
// visuals are kept intentionally identical to the original.

import { useEffect, useRef, useState } from "react";

type Phase = "fetching" | "number" | "done";
type Tab = "current" | "history";

type FactorRow = { label: string; value: string; color: string };
type HistoryRow = {
  date: string;
  score: number;
  showTrend: boolean;
  trendArrow: string;
  trendColor: string;
};

const MIN_DELAY_MS = 300;
const MAX_DELAY_MS = 500;

const LEGEND_ROWS = [
  { label: "Excellent", range: "800 to 900", color: "#0E4F3C" },
  { label: "Very Good", range: "750 to 799", color: "#1FAE6E" },
  { label: "Good", range: "700 to 749", color: "#3DDC5B" },
  { label: "Fair", range: "600 to 699", color: "#F5A623" },
  { label: "Poor", range: "300 to 599", color: "#E85D4D" },
  { label: "NH", range: "No history available", color: "#9CA3AF" },
];

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.sin(a), y: cy - r * Math.cos(a) };
}

const GAUGE_CX = 150;
const GAUGE_CY = 140;
const GAUGE_R = 110;
const START_ANGLE = -144;
const TOTAL_SWEEP = 288;

function getTrackPath() {
  const p0 = polar(GAUGE_CX, GAUGE_CY, GAUGE_R, START_ANGLE);
  const p1 = polar(GAUGE_CX, GAUGE_CY, GAUGE_R, START_ANGLE + TOTAL_SWEEP);
  return `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A ${GAUGE_R} ${GAUGE_R} 0 1 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
}
const TRACK_PATH = getTrackPath();

function getSegments(arcProgressUnits: number) {
  const colors = ["#E85D4D", "#F5A623", "#3DDC5B", "#1FAE6E", "#0E4F3C"];
  const segAngle = TOTAL_SWEEP / 5;
  const overlap = 14;
  const segments = colors.map((color, i) => {
    const a0 = START_ANGLE + segAngle * i;
    const isLast = i === colors.length - 1;
    const a1 = a0 + segAngle + (isLast ? 0 : overlap);
    const p0 = polar(GAUGE_CX, GAUGE_CY, GAUGE_R, a0);
    const p1 = polar(GAUGE_CX, GAUGE_CY, GAUGE_R, a1);
    const d = `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A ${GAUGE_R} ${GAUGE_R} 0 0 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
    const localFraction = Math.max(0, Math.min(1, arcProgressUnits - i));
    return { d, color, offset: 1 - localFraction, localFraction };
  });
  return segments.filter((s) => s.localFraction > 0.001).reverse();
}

function getCategory(score: number) {
  if (score < 600) return { label: "Poor", color: "#E85D4D" };
  if (score < 700) return { label: "Fair", color: "#F5A623" };
  if (score < 750) return { label: "Good", color: "#3DDC5B" };
  if (score < 800) return { label: "Very Good", color: "#1FAE6E" };
  return { label: "Excellent", color: "#0E4F3C" };
}

function pickScore() {
  // Weighted toward Good/Very Good/Excellent; Poor/Fair show up less often.
  const bands = [
    { lo: 300, hi: 599, weight: 0.1 },
    { lo: 600, hi: 699, weight: 0.15 },
    { lo: 700, hi: 749, weight: 0.2 },
    { lo: 750, hi: 799, weight: 0.25 },
    { lo: 800, hi: 900, weight: 0.3 },
  ];
  let r = Math.random();
  for (const band of bands) {
    if (r < band.weight) return Math.round(band.lo + Math.random() * (band.hi - band.lo));
    r -= band.weight;
  }
  return 900;
}

function computeFactors(score: number): FactorRow[] {
  const f = (score - 300) / 600;
  const paymentHistory = Math.round(40 + f * 55);
  const inquiries = Math.max(0, Math.round(6 - f * 5));
  const utilization = Math.max(5, Math.round(60 - f * 50));
  const accountsOpen = Math.max(1, Math.round(2 + f * 4));
  const accountsClosed = Math.max(0, Math.round(4 - f * 3));
  const ageYears = Math.max(1, Math.round(1 + f * 10));

  const good = "#3DDC5B";
  const mid = "#F5A623";
  const bad = "#E85D4D";
  return [
    { label: "Payment History", value: `${paymentHistory}%`, color: paymentHistory >= 70 ? good : paymentHistory >= 50 ? mid : bad },
    { label: "Inquiries", value: `${inquiries}`, color: inquiries <= 2 ? good : inquiries <= 4 ? mid : bad },
    { label: "Utilization", value: `${utilization}%`, color: utilization <= 30 ? good : utilization <= 50 ? mid : bad },
    { label: "Accounts Open / Closed", value: `${accountsOpen} / ${accountsClosed}`, color: accountsOpen >= accountsClosed ? good : mid },
    { label: "Age Of Credit History", value: `${ageYears} year${ageYears === 1 ? "" : "s"}`, color: ageYears >= 5 ? good : ageYears >= 2 ? mid : bad },
  ];
}

function formatDate(d: Date) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function computeHistory(target: number): HistoryRow[] {
  const scores = [target];
  for (let i = 1; i < 4; i++) {
    const delta = Math.round(5 + Math.random() * 30);
    const prev = Math.max(300, Math.min(900, scores[i - 1] - delta * (Math.random() > 0.25 ? 1 : -1)));
    scores.push(prev);
  }
  const rows: HistoryRow[] = [];
  const today = new Date();
  for (let i = 0; i < scores.length; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i * 30);
    const label = i === 0 ? "Today" : formatDate(d);
    let showTrend = false;
    let trendArrow = "";
    let trendColor = "";
    if (i > 0) {
      showTrend = true;
      if (scores[i] < scores[i - 1]) {
        trendArrow = "↑";
        trendColor = "#1FAE6E";
      } else if (scores[i] > scores[i - 1]) {
        trendArrow = "↓";
        trendColor = "#E85D4D";
      }
    }
    rows.push({ date: label, score: scores[i], showTrend, trendArrow, trendColor });
  }
  return rows;
}

// Position (in "band units", 0-5) that the arc reveal should stop at for a given score.
function computeProgressUnits(score: number) {
  const bands: [number, number][] = [
    [300, 599],
    [600, 699],
    [700, 749],
    [750, 799],
    [800, 900],
  ];
  for (let i = 0; i < bands.length; i++) {
    const [lo, hi] = bands[i];
    if (score <= hi || i === bands.length - 1) {
      const localFrac = Math.max(0, Math.min(1, (score - lo) / (hi - lo)));
      return i + localFrac;
    }
  }
  return 0;
}

export default function CreditScoreScreen() {
  const [phase, setPhase] = useState<Phase>("fetching");
  const [displayScore, setDisplayScore] = useState(300);
  const [category, setCategory] = useState("Poor");
  const [categoryColor, setCategoryColor] = useState("#E85D4D");
  const [announceText, setAnnounceText] = useState("Fetching your score");
  const [arcProgressUnits, setArcProgressUnits] = useState(0);
  const [showLegend, setShowLegend] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("current");
  const [factorRows, setFactorRows] = useState<FactorRow[]>([]);
  const [historyRows, setHistoryRows] = useState<HistoryRow[]>([]);

  const rafRef = useRef<number | null>(null);
  const arcRafRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const arcTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasShownTooltipRef = useRef(false);

  function clearAllTimers() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (arcRafRef.current) cancelAnimationFrame(arcRafRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (arcTimeoutRef.current) clearTimeout(arcTimeoutRef.current);
  }

  function animateNumber(target: number, label: string) {
    const duration = 800;
    const start = performance.now();
    const startVal = 300 + Math.random() * 600;
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = ease(p);
      const rangeWidth = 600 * (1 - eased);
      const center = startVal + (target - startVal) * eased;
      let display = Math.round(center + (Math.random() - 0.5) * rangeWidth);
      display = Math.max(300, Math.min(900, display));
      if (p >= 1) display = target;
      setDisplayScore(display);
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setPhase("done");
        setAnnounceText(`Your credit score is ${target}, ${label}`);
        if (!hasShownTooltipRef.current) {
          hasShownTooltipRef.current = true;
          setShowTooltip(true);
        }
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }

  function startArc(target: number, duration: number) {
    const targetUnits = computeProgressUnits(target);
    if (duration <= 0) {
      setArcProgressUnits(targetUnits);
      return;
    }
    const start = performance.now();
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = ease(p);
      setArcProgressUnits(eased * targetUnits);
      if (p < 1) {
        arcRafRef.current = requestAnimationFrame(step);
      }
    };
    arcRafRef.current = requestAnimationFrame(step);
  }

  function reveal() {
    const target = pickScore();
    const { label, color } = getCategory(target);
    setPhase("number");
    setCategory(label);
    setCategoryColor(color);
    setDisplayScore(300);
    setArcProgressUnits(0);
    setFactorRows(computeFactors(target));
    setHistoryRows(computeHistory(target));
    animateNumber(target, label);
    const numberDuration = 800;
    const arcStartAt = 350;
    arcTimeoutRef.current = setTimeout(() => {
      startArc(target, numberDuration - arcStartAt);
    }, arcStartAt);
  }

  function startFetch() {
    const delay = MIN_DELAY_MS + Math.random() * Math.max(0, MAX_DELAY_MS - MIN_DELAY_MS);
    setPhase("fetching");
    setAnnounceText("Fetching your score");
    timeoutRef.current = setTimeout(reveal, delay);
  }

  function refetch() {
    clearAllTimers();
    setPhase("fetching");
    setDisplayScore(300);
    setArcProgressUnits(0);
    startFetch();
  }

  useEffect(() => {
    startFetch();
    return clearAllTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleGaugeTap() {
    if (showTooltip) setShowTooltip(false);
    if (phase === "done") refetch();
  }

  function dismissTooltip(e?: React.MouseEvent) {
    e?.stopPropagation();
    setShowTooltip(false);
  }

  const isFetching = phase === "fetching";
  const isRevealed = !isFetching;
  const isCurrentTab = activeTab === "current";
  const segments = getSegments(arcProgressUnits);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        position: "relative",
        overflow: "hidden",
        fontFamily: "-apple-system, 'Inter', system-ui, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <style>{`@keyframes credit-score-spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ flex: 1, overflowY: "auto", position: "relative", WebkitOverflowScrolling: "touch" }}>
        <div style={{ padding: "22px 20px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 21, fontWeight: 700, color: "oklch(28% 0.02 250)" }}>Credit Score</div>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "oklch(94% 0.008 250)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="oklch(45% 0.02 250)" strokeWidth={2} />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="oklch(45% 0.02 250)" strokeWidth={2} fill="none" />
            </svg>
          </div>
        </div>

        <div style={{ padding: "0 20px 16px", color: "oklch(56% 0.02 250)", fontSize: 13, textAlign: "center" }}>Last updated: Today</div>

        <div style={{ padding: "0 20px 24px" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            <button
              onClick={() => setActiveTab("current")}
              style={{
                flex: 1, textAlign: "center", padding: 10, borderRadius: 20, border: "none", cursor: "pointer",
                fontFamily: "inherit", fontWeight: 600, fontSize: 13,
                background: isCurrentTab ? "oklch(92% 0.035 235)" : "oklch(96% 0.006 250)",
                color: isCurrentTab ? "oklch(32% 0.06 235)" : "oklch(56% 0.02 250)",
              }}
            >
              Current Score
            </button>
            <button
              onClick={() => setActiveTab("history")}
              style={{
                flex: 1, textAlign: "center", padding: 10, borderRadius: 20, border: "none", cursor: "pointer",
                fontFamily: "inherit", fontWeight: 600, fontSize: 13,
                background: !isCurrentTab ? "oklch(92% 0.035 235)" : "oklch(96% 0.006 250)",
                color: !isCurrentTab ? "oklch(32% 0.06 235)" : "oklch(56% 0.02 250)",
              }}
            >
              Score History
            </button>
          </div>

          <div style={{ borderRadius: 20, border: "1px solid oklch(92% 0.006 250)", padding: "24px 16px", minHeight: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {isCurrentTab && (
              <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                {isFetching && (
                  <div role="status" aria-live="polite" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center", padding: "20px 8px" }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", border: "4px solid oklch(90% 0.012 235)", borderTopColor: "oklch(60% 0.13 235)", animation: "credit-score-spin 0.8s linear infinite" }} />
                    <div style={{ fontSize: 16, fontWeight: 600, color: "oklch(30% 0.02 250)" }}>Fetching your score…</div>
                    <div style={{ fontSize: 13, color: "oklch(55% 0.02 250)", maxWidth: 250, lineHeight: 1.5 }}>Hold tight, we're pulling your latest credit details.</div>
                  </div>
                )}

                {isRevealed && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                    <div onClick={handleGaugeTap} role="button" aria-label="Tap to fetch score again" style={{ position: "relative", width: 220, height: 190, cursor: "pointer" }}>
                      <svg viewBox="0 0 300 260" width="220" height="190" style={{ position: "absolute", top: 0, left: 0 }}>
                        <path d={TRACK_PATH} stroke="#E4E6EA" strokeWidth={28} fill="none" strokeLinecap="round" />
                        {segments.map((seg, i) => (
                          <path
                            key={i}
                            d={seg.d}
                            stroke={seg.color}
                            strokeWidth={28}
                            fill="none"
                            strokeLinecap="round"
                            pathLength={1}
                            style={{ strokeDasharray: 1, strokeDashoffset: seg.offset }}
                          />
                        ))}
                      </svg>
                      <div style={{ position: "absolute", left: 0, right: 0, top: 58, display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ fontSize: 50, fontWeight: 800, color: "oklch(25% 0.02 250)", letterSpacing: -1, fontVariantNumeric: "tabular-nums" }}>{displayScore}</div>
                        <div style={{ marginTop: 8, padding: "6px 16px", borderRadius: 999, fontSize: 12, fontWeight: 700, color: "#fff", background: categoryColor }}>{category}</div>
                      </div>

                      {showTooltip && (
                        <div style={{ position: "absolute", top: -6, right: -24, maxWidth: 180, background: "oklch(24% 0.02 250)", color: "#fff", borderRadius: 12, padding: "12px 14px", fontSize: 13, lineHeight: 1.4, boxShadow: "0 10px 24px oklch(20% 0.02 250 / 0.3)", zIndex: 10 }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <span style={{ flex: 1 }}>Tap here to see a new score</span>
                            <button onClick={dismissTooltip} aria-label="Dismiss tip" style={{ background: "none", border: "none", color: "#fff", opacity: 0.8, fontSize: 13, lineHeight: 1, cursor: "pointer", padding: 0, flexShrink: 0 }}>✕</button>
                          </div>
                          <div style={{ position: "absolute", bottom: -6, left: 40, width: 12, height: 12, background: "oklch(24% 0.02 250)", transform: "rotate(45deg)" }} />
                        </div>
                      )}
                    </div>
                    <button onClick={() => setShowLegend(true)} style={{ marginTop: 14, fontSize: 13, color: "oklch(56% 0.11 235)", textDecoration: "underline", cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "inherit" }}>
                      Score range: 300 – 900
                    </button>
                  </div>
                )}
              </div>
            )}

            {!isCurrentTab && (
              <div style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0 4px 10px", fontSize: 13, color: "oklch(56% 0.02 250)", fontWeight: 600 }}>
                  <span>Date</span>
                  <span>Score</span>
                </div>
                {historyRows.map((row, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 4px", borderTop: "1px solid oklch(93% 0.006 250)" }}>
                    <span style={{ fontSize: 15, color: "oklch(30% 0.02 250)" }}>{row.date}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 17, fontWeight: 700, color: "oklch(22% 0.02 250)" }}>
                      {row.showTrend && <span style={{ color: row.trendColor, fontSize: 15 }}>{row.trendArrow}</span>}
                      {row.score}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div aria-live="polite" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{announceText}</div>
        </div>

        <div style={{ padding: "0 20px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: "oklch(95% 0.006 250)", borderRadius: 16, padding: "14px 16px", cursor: "pointer" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1FAE6E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.7v.4h5.4v-.4c0-.7.3-1.3.8-1.7A6 6 0 0 0 12 3z" stroke="#fff" strokeWidth={1.6} fill="none" /></svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "oklch(22% 0.02 250)" }}>Credit score tips</div>
              <div style={{ fontSize: 13, color: "oklch(56% 0.02 250)" }}>Tap to learn how to improve your score</div>
            </div>
            <span style={{ color: "oklch(45% 0.02 250)", fontSize: 12 }}>▼</span>
          </div>
        </div>

        <div style={{ padding: "4px 20px 8px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 19, fontWeight: 800, color: "oklch(25% 0.02 250)" }}>Your Score Factors</div>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.03em", color: "#fff", background: "#1FAE6E", padding: "3px 9px", borderRadius: 999 }}>UPDATED</span>
        </div>
        <div>
          {factorRows.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "stretch", borderBottom: "1px solid oklch(94% 0.006 250)" }}>
              <div style={{ width: 4, background: f.color, flexShrink: 0 }} />
              <div style={{ flex: 1, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", color: "oklch(56% 0.02 250)", fontWeight: 600, marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: "oklch(20% 0.02 250)" }}>{f.value}</div>
                </div>
                <span style={{ color: "oklch(64% 0.1 235)", fontSize: 19 }}>›</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 24px", cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 16, fontWeight: 700, color: "oklch(22% 0.02 250)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="4" y="2" width="16" height="20" rx="2" stroke="oklch(28% 0.02 250)" strokeWidth={2} /><path d="M8 8h8M8 12h8M8 16h5" stroke="oklch(28% 0.02 250)" strokeWidth={2} /></svg>
            View Full Report
          </div>
          <span style={{ color: "oklch(64% 0.1 235)", fontSize: 19 }}>→</span>
        </div>
      </div>

      <div style={{ flexShrink: 0, background: "#fff", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "14px 8px 22px", borderTop: "1px solid oklch(94% 0.006 250)" }}>
        {[
          { label: "HOME", active: false },
          { label: "LOAN", active: false },
          { label: "CREDIT", active: true },
          { label: "INVITE", active: false },
        ].map((tab) => (
          <div key={tab.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: tab.active ? "oklch(45% 0.1 235)" : "oklch(60% 0.02 250)", fontSize: 11, fontWeight: tab.active ? 700 : 600 }}>
            <div style={{ width: 22, height: 22, borderRadius: 5, background: tab.active ? "oklch(60% 0.1 235)" : "oklch(85% 0.01 250)" }} />
            {tab.label}
          </div>
        ))}
      </div>

      {showLegend && (
        <div onClick={() => setShowLegend(false)} style={{ position: "absolute", inset: 0, background: "oklch(20% 0.02 250 / 0.45)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: "#fff", borderRadius: "20px 20px 0 0", overflow: "hidden", maxHeight: "80%", display: "flex", flexDirection: "column" }}>
            <div style={{ background: "oklch(88% 0.06 235)", padding: "20px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: "oklch(25% 0.02 250)" }}>Score Range Breakdown</div>
              <button onClick={() => setShowLegend(false)} aria-label="Close score range breakdown" style={{ background: "none", border: "none", fontSize: 20, lineHeight: 1, cursor: "pointer", color: "oklch(25% 0.02 250)" }}>✕</button>
            </div>
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", background: "oklch(95% 0.004 250)" }}>
              {LEGEND_ROWS.map((row) => (
                <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: 12, background: row.color, color: "#fff", fontWeight: 700, fontSize: 14 }}>
                  <span>{row.label}</span>
                  <span>{row.range}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
