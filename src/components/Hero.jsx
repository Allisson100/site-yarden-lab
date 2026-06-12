import { useRef, useState, useLayoutEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useTime,
  useInView,
  useReducedMotion,
} from "framer-motion";

/* ════════════════════════════════════════════════════════════════════
   SERVIÇOS QUE ORBITAM A FRASE
   👉 Para trocar as palavras, edite SOMENTE este array.
   ════════════════════════════════════════════════════════════════════ */
const SERVICES = [
  "Marketing",
  "Branding",
  "Anúncios",
  "E-commerce",
  "Comunicação",
  "Redes Sociais",
  "Inteligência (IA)",
  "Site Institucional",
];

/* Imagem de fundo */
const BG_URL =
  "https://durqlolzozhibydhetzy.supabase.co/storage/v1/object/public/YardenLabFiles/fundo_hero.jpeg";

const toRad = (d) => (d * Math.PI) / 180;

/* Uma palavra orbitando a frase: elipse inclinada + profundidade
   (na frente = maior/opaca; atrás = menor/apagada). Sempre legível (sem girar). */
function OrbitWord({ label, baseAngle, a, b, tilt, dir, spin }) {
  const cosT = Math.cos(toRad(tilt));
  const sinT = Math.sin(toRad(tilt));
  const phi = useTransform(spin, (v) => toRad(baseAngle + dir * v));
  const x = useTransform(phi, (p) => a * Math.cos(p) * cosT - b * Math.sin(p) * sinT);
  const y = useTransform(phi, (p) => a * Math.cos(p) * sinT + b * Math.sin(p) * cosT);
  const depth = useTransform(phi, (p) => Math.sin(p)); // >0 frente | <0 atrás
  const scale = useTransform(depth, (d) => 0.72 + ((d + 1) / 2) * 0.46);
  const opacity = useTransform(depth, (d) => 0.4 + ((d + 1) / 2) * 0.6);
  const zIndex = useTransform(depth, (d) => (d > 0 ? 6 : 2));

  return (
    <motion.div style={{ position: "absolute", left: "50%", top: "50%", x, y, scale, opacity, zIndex }}>
      <span
        style={{
          display: "block",
          transform: "translate(-50%,-50%)",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(10px, 1vw, 15px)",
          letterSpacing: "0.03em",
          color: "var(--cream)",
          textShadow: "0 2px 16px rgba(0,0,0,0.7)",
        }}
      >
        {label}
      </span>
    </motion.div>
  );
}

/* Frase que se auto-ajusta a uma única linha dentro de uma largura-alvo */
function FitPhrase({ show, maxWidth }) {
  const wrapRef = useRef(null);
  const elRef = useRef(null);
  const [fs, setFs] = useState(54);

  useLayoutEffect(() => {
    const wrap = wrapRef.current, el = elRef.current;
    if (!wrap || !el) return;
    const fit = () => {
      const prev = el.style.fontSize;
      el.style.fontSize = "100px";
      const natural = el.scrollWidth;
      el.style.fontSize = prev;
      if (!natural) return;
      setFs(Math.min(120, (100 * wrap.clientWidth * 0.96) / natural));
    };
    fit();
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(fit);
      ro.observe(wrap);
    }
    if (document.fonts?.ready) document.fonts.ready.then(fit);
    return () => ro?.disconnect();
  }, [maxWidth]);

  return (
    <div ref={wrapRef} style={{ width: `${maxWidth}px`, maxWidth: "92vw", textAlign: "center" }}>
      <motion.span
        ref={elRef}
        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
        animate={show ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
        transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "inline-block",
          fontSize: `${fs}px`,
          whiteSpace: "nowrap",
          lineHeight: 1,
          fontFamily: "var(--font-serif)",
          fontWeight: 300,
          color: "var(--cream)",
          letterSpacing: "-0.01em",
          textShadow: "0 4px 30px rgba(0,0,0,0.6)",
        }}
      >
        A travessia{" "}
        <span style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}>começou</span>
      </motion.span>
    </div>
  );
}

export default function Hero() {
  const heroRef = useRef(null);
  const stageRef = useRef(null);
  const inView = useInView(heroRef, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();

  /* mede o palco (quadrado) p/ escalar as órbitas e a frase */
  const [S, setS] = useState(620);
  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((e) => { const w = e[0].contentRect.width; if (w) setS(w); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* órbita única em volta da frase — raios responsivos p/ caber no mobile */
  const small = S < 480;
  const a = (small ? 0.44 : 0.50) * S; // semi-eixo horizontal
  const b = (small ? 0.34 : 0.31) * S; // semi-eixo vertical
  const tilt = -8;
  const phraseW = Math.round((small ? 0.5 : 0.56) * S);

  const time = useTime();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start end", "end start"] });
  const spin = useTransform([time, scrollYProgress], ([t, p]) =>
    reduce ? 0 : (t / 1000) * 14 + p * 120,
  );

  const stageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, reduce ? 1 : 1.1]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.04, reduce ? 1.04 : 1.16]);

  const n = SERVICES.length;

  return (
    <section
      ref={heroRef}
      className="hero-orbit"
      style={{ position: "relative", minHeight: "100vh", overflow: "hidden", background: "var(--espresso)" }}
    >
      {/* imagem de fundo */}
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${BG_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          scale: bgScale,
          zIndex: 0,
        }}
      />
      {/* scrim espresso p/ legibilidade + foco no centro */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(70% 65% at 50% 50%, rgba(31,8,7,0.30) 0%, rgba(31,8,7,0.62) 60%, rgba(20,6,6,0.82) 100%), linear-gradient(180deg, rgba(31,8,7,0.55) 0%, rgba(31,8,7,0.35) 40%, rgba(31,8,7,0.7) 100%)",
          zIndex: 1,
        }}
      />

      {/* PALCO — frase central + serviços orbitando */}
      <motion.div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "min(92vw, 760px)",
          aspectRatio: "1 / 1",
          x: "-50%",
          y: "-50%",
          scale: stageScale,
          zIndex: 3,
        }}
      >
        <motion.div
          ref={stageRef}
          style={{ position: "relative", width: "100%", height: "100%", overflow: "visible" }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* glow suave atrás da frase */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "62%",
              height: "40%",
              transform: "translate(-50%,-50%)",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(104,45,27,0.5) 0%, transparent 70%)",
              filter: "blur(30px)",
              zIndex: 2,
            }}
          />

          {/* FRASE (núcleo) — centro */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(10px, 1.05vw, 13px)",
                fontWeight: 600,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(243,235,226,0.6)",
                marginBottom: "clamp(10px, 1.4vw, 18px)",
                textShadow: "0 2px 14px rgba(0,0,0,0.6)",
              }}
            >
              Uma estratégia 360°
            </motion.p>
            <FitPhrase show={inView} maxWidth={phraseW} />
          </div>

          {/* SERVIÇOS ORBITANDO */}
          {SERVICES.map((label, i) => (
            <OrbitWord
              key={label}
              label={label}
              baseAngle={(360 / n) * i}
              a={a}
              b={b}
              tilt={tilt}
              dir={1}
              spin={spin}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* dica de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.3 }}
        style={{ position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)", zIndex: 11 }}
      >
        <motion.div
          animate={reduce ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(243,235,226,0.4)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
