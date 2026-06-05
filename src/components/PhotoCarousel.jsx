import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";

/**
 * PhotoCarousel — entry animation: cards fly in from all 4 screen corners.
 *
 * PHOTOS: save your images to  /public/carousel/  and name them:
 *   foto-1.jpg, foto-2.jpg, foto-3.jpg, foto-4.jpg
 * (portrait orientation recommended — the carousel is taller than wide)
 * The 4 photos are duplicated automatically to fill 8 slides.
 */

const PHOTO_SRCS = [
  "/carousel/foto-1.jpg",
  "/carousel/foto-2.jpg",
  "/carousel/foto-3.jpg",
  "/carousel/foto-4.jpg",
];

// Fallback gradient for when the photo file doesn't exist yet
const FALLBACK_GRADIENTS = [
  "linear-gradient(145deg,#1c0608 0%,#2e1015 45%,#0f0305 100%)",
  "linear-gradient(150deg,#0b0810 0%,#1b1020 50%,#110408 100%)",
  "linear-gradient(128deg,#0f1010 0%,#0d1618 55%,#0c0207 100%)",
  "linear-gradient(142deg,#150608 0%,#1f0f10 50%,#0f0204 100%)",
];

// 8 slides = 4 photos × 2
const SLIDES = [...PHOTO_SRCS, ...PHOTO_SRCS].map((src, i) => ({
  src,
  gradient: FALLBACK_GRADIENTS[i % 4],
  label: [
    "Captação Premium",
    "Identidade Visual",
    "Branding Editorial",
    "Presença Digital",
  ][i % 4],
}));

// Where each card starts — genuinely outside the viewport
// Values in px; large enough to be off any screen size
const ENTRY_FROM = [
  { x: -1600, y: -900, rotate: -38 }, // top-left corner
  { x: 1600, y: -900, rotate: 34 }, // top-right corner
  { x: -1600, y: 900, rotate: 28 }, // bottom-left corner
  { x: 1600, y: 900, rotate: -34 }, // bottom-right corner
  { x: -1400, y: -1100, rotate: -22 }, // top-left (higher)
  { x: 1400, y: -1100, rotate: 26 }, // top-right (higher)
  { x: -1400, y: 1100, rotate: 18 }, // bottom-left (lower)
  { x: 1400, y: 1100, rotate: -20 }, // bottom-right (lower)
];

const CARD_W = 320;
const CARD_H = 420;
const CARD_GAP = 370; // distance between card centers during navigation

export default function PhotoCarousel() {
  const sectionRef = useRef(null);
  const timerRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const [active, setActive] = useState(0);
  // 'pre'→invisible | 'entering'→fly-in spring | 'idle'→fast navigation
  const [phase, setPhase] = useState("pre");
  // overflow: visible during entry so cards appear from outside section bounds
  const [sectionOverflow, setSectionOverflow] = useState("hidden");
  const [dragStart, setDragStart] = useState(null);

  // Fire entry animation when section first enters viewport
  useEffect(() => {
    if (!inView || phase !== "pre") return;
    setSectionOverflow("visible");
    // tiny delay so browser paints the initial off-screen positions first
    const t1 = setTimeout(() => setPhase("entering"), 60);
    // switch back to hidden after cards have landed (spring ≈ 2 s)
    const t2 = setTimeout(() => {
      setPhase("idle");
      setSectionOverflow("hidden");
    }, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [inView, phase]);

  // Auto-advance every 5 s (starts only after cards have landed)
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(
      () => setActive((prev) => (prev + 1) % SLIDES.length),
      5000,
    );
  }, []);

  useEffect(() => {
    if (phase === "idle") startTimer();
    return () => clearInterval(timerRef.current);
  }, [phase, startTimer]);

  const goTo = useCallback(
    (idx) => {
      clearInterval(timerRef.current);
      setActive(idx);
      startTimer();
    },
    [startTimer],
  );

  const prev = () => goTo((active - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((active + 1) % SLIDES.length);

  // Swipe
  const onPointerDown = (e) => setDragStart(e.clientX);
  const onPointerUp = (e) => {
    if (dragStart === null) return;
    const d = dragStart - e.clientX;
    if (d > 50) next();
    if (d < -50) prev();
    setDragStart(null);
  };

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#D8D5D2",
        padding: "130px 0 110px",
        overflow: sectionOverflow,
        position: "relative",
      }}
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 }}
          style={{ marginBottom: "80px", maxWidth: "680px" }}
        >
          <p className="section-label" style={{ color: "var(--espresso)" }}>
            Nossa Produção
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: "clamp(32px, 4.5vw, 58px)",
              lineHeight: 1.06,
              color: "var(--espresso)",
              marginBottom: "18px",
            }}
          >
            Estética que converte
            <br />
            <em style={{ fontStyle: "italic", color: "var(--espresso)" }}>
              e posiciona.
            </em>
          </h2>
          <p
            style={{
              color: "var(--espresso)",
              fontSize: "clamp(14px,1.4vw,16px)",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            Cada projeto nasce de uma estratégia — e termina com uma identidade
            que o mercado reconhece.
          </p>
        </motion.div>
      </div>

      {/* ── Carousel track ────────────────────────────────────── */}
      <div
        style={{ position: "relative", height: CARD_H + 40 }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div
          style={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {SLIDES.map((slide, i) => {
            // Compute position relative to active slide (with wrap-around)
            const raw = i - active;
            const wrapped =
              ((raw + SLIDES.length / 2 + SLIDES.length) % SLIDES.length) -
              SLIDES.length / 2;
            const isAct = wrapped === 0;
            const isAdj = Math.abs(wrapped) === 1;

            const tX = wrapped * CARD_GAP;
            const tScale = isAct ? 1 : isAdj ? 0.8 : 0.65;
            const tOp = isAct ? 1 : isAdj ? 0.4 : 0;
            const tRot = isAct ? 0 : wrapped > 0 ? 4 : -4;
            const tZ = isAct ? 20 : isAdj ? 10 : 1;

            return (
              <motion.div
                key={i}
                // All cards start at their corner origin (off-screen)
                initial={{
                  x: ENTRY_FROM[i].x,
                  y: ENTRY_FROM[i].y,
                  rotate: ENTRY_FROM[i].rotate,
                  opacity: 0,
                  scale: 0.8,
                }}
                animate={
                  phase !== "pre"
                    ? {
                        x: tX,
                        y: 0,
                        rotate: tRot,
                        opacity: tOp,
                        scale: tScale,
                      }
                    : {}
                }
                transition={
                  phase === "entering"
                    ? // Entry: slow spring with bounce & stagger — the "toss" feel
                      {
                        type: "spring",
                        stiffness: 48,
                        damping: 13,
                        delay: i * 0.09,
                      }
                    : // Navigation: snappy spring, no delay
                      { type: "spring", stiffness: 280, damping: 30, delay: 0 }
                }
                onClick={() => !isAct && goTo(i)}
                style={{
                  position: "absolute",
                  width: CARD_W,
                  height: CARD_H,
                  zIndex: tZ,
                  cursor: isAct ? "default" : "pointer",
                  userSelect: "none",
                  flexShrink: 0,
                }}
              >
                {/* ── Card face ───────────────────────────────── */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    background: slide.gradient,
                  }}
                >
                  {/* Photo — covers entire card */}
                  <img
                    src={slide.src}
                    alt={slide.label}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                      display: "block",
                    }}
                    // If file not found, img just won't render — gradient shows instead
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />

                  {/* Bottom gradient for readability */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      background:
                        "linear-gradient(to bottom, transparent 50%, rgba(8,2,4,0.7) 100%)",
                    }}
                  />

                  {/* Decorative corners */}
                  {[
                    ["top", "left"],
                    ["top", "right"],
                    ["bottom", "left"],
                    ["bottom", "right"],
                  ].map(([v, h]) => (
                    <div
                      key={v + h}
                      style={{
                        position: "absolute",
                        [v]: 14,
                        [h]: 14,
                        width: 18,
                        height: 18,
                        borderTop:
                          v === "top"
                            ? "1px solid rgba(243, 235, 226,0.4)"
                            : "none",
                        borderBottom:
                          v === "bottom"
                            ? "1px solid rgba(243, 235, 226,0.4)"
                            : "none",
                        borderLeft:
                          h === "left"
                            ? "1px solid rgba(243, 235, 226,0.4)"
                            : "none",
                        borderRight:
                          h === "right"
                            ? "1px solid rgba(243, 235, 226,0.4)"
                            : "none",
                        pointerEvents: "none",
                      }}
                    />
                  ))}

                  {/* Label on active card */}
                  {isAct && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 22,
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        pointerEvents: "none",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "8px",
                          letterSpacing: "0.24em",
                          textTransform: "uppercase",
                          color: "rgba(243,235,226,0.55)",
                          fontWeight: 600,
                        }}
                      >
                        {slide.label}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Prev / Next ───────────────────────────────────── */}
        {["prev", "next"].map((dir) => (
          <button
            key={dir}
            onClick={dir === "prev" ? prev : next}
            style={{
              position: "absolute",
              [dir === "prev" ? "left" : "right"]: 32,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 30,
              background: "rgba(9,1,4,0.65)",
              border: "1px solid rgba(243,235,226,0.1)",
              color: "rgba(243,235,226,0.45)",
              width: 44,
              height: 44,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(6px)",
              transition: "all 0.25s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(243, 235, 226,0.55)";
              e.currentTarget.style.color = "var(--cream)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(243,235,226,0.1)";
              e.currentTarget.style.color = "rgba(243,235,226,0.45)";
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              {dir === "prev" ? (
                <path d="M15 18l-6-6 6-6" />
              ) : (
                <path d="M9 18l6-6-6-6" />
              )}
            </svg>
          </button>
        ))}
      </div>

      {/* ── Dot indicators ─────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
          marginTop: "36px",
        }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === active ? 26 : 5,
              height: 5,
              padding: 0,
              border: "none",
              background:
                i === active ? "var(--cream)" : "rgba(243,235,226,0.12)",
              cursor: "pointer",
              transition: "all 0.35s ease",
            }}
          />
        ))}
      </div>

      {/* ── Footnote ──────────────────────────────────────── */}
      <div className="container" style={{ marginTop: "60px" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          style={{ display: "flex", alignItems: "center", gap: "16px" }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(243,235,226,0.06)",
            }}
          />
          {/* <p
            style={{
              color: "rgba(243,235,226,0.22)",
              fontSize: "10px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              margin: 0,
            }}
          >
            Portfólio completo sob solicitação
          </p> */}
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "rgba(243,235,226,0.06)",
            }}
          />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .photo-carousel-track { height: ${Math.round(CARD_H * 0.8) + 40}px !important; }
        }
      `}</style>
    </section>
  );
}
