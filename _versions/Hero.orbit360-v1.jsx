import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useTime,
  useInView,
  useReducedMotion,
} from "framer-motion";

/* ════════════════════════════════════════════════════════════════════
   SERVIÇOS DO ANEL 360°
   👉 Para trocar as palavras, edite SOMENTE este array.
      A ordem é o sentido horário a partir do topo. Pode ter quantos
      itens quiser — o anel se distribui sozinho.
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

const toRad = (deg) => (deg * Math.PI) / 180;

/* Um serviço orbitando: a posição (x,y) é recalculada a cada frame a partir
   de `spin`, mas o texto NUNCA gira (fica sempre legível na horizontal). */
function OrbitItem({ label, baseAngle, dotR, labelR, spin, index, show }) {
  const dotX = useTransform(spin, (a) => dotR * Math.cos(toRad(a + baseAngle)));
  const dotY = useTransform(spin, (a) => dotR * Math.sin(toRad(a + baseAngle)));
  const labX = useTransform(spin, (a) => labelR * Math.cos(toRad(a + baseAngle)));
  const labY = useTransform(spin, (a) => labelR * Math.sin(toRad(a + baseAngle)));

  return (
    <>
      {/* nó (ponto) sobre o anel */}
      <motion.div
        style={{ position: "absolute", left: "50%", top: "50%", x: dotX, y: dotY, zIndex: 2 }}
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.45 + index * 0.07 }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "var(--sienna)",
            transform: "translate(-50%,-50%)",
            boxShadow: "0 0 0 4px rgba(104,45,27,0.16)",
          }}
        />
      </motion.div>

      {/* rótulo (texto sempre na horizontal) */}
      <motion.div
        style={{ position: "absolute", left: "50%", top: "50%", x: labX, y: labY, zIndex: 3 }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={show ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.5 + index * 0.07 }}
      >
        <span
          className="orbit-label"
          style={{
            display: "block",
            transform: "translate(-50%,-50%)",
            whiteSpace: "nowrap",
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(10px, 1.05vw, 14px)",
            letterSpacing: "0.015em",
            color: "rgba(243,235,226,0.92)",
            fontWeight: 400,
          }}
        >
          {label}
        </span>
      </motion.div>
    </>
  );
}

export default function Hero() {
  const heroRef = useRef(null);
  const stageRef = useRef(null);
  const inView = useInView(heroRef, { once: true, margin: "-120px" });
  const reduce = useReducedMotion();

  /* Mede o lado do palco (quadrado) para escalar raios e fontes com proporção. */
  const [S, setS] = useState(560);
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      if (w) setS(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const ringR = S * 0.34; // anel tracejado + nós
  const labelGap = S < 420 ? 16 : S < 720 ? 46 : 62;
  const labelR = ringR + labelGap; // rótulos do lado de fora do anel

  /* Rotação do anel: giro contínuo (tempo) + impulso vindo do scroll. */
  const time = useTime();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start end", "end start"],
  });
  const spin = useTransform([time, scrollYProgress], ([t, p]) =>
    reduce ? 0 : (t / 78000) * 360 + p * 130,
  );

  /* Scroll → só transformações (escala/parallax). A opacidade fica por conta
     da animação de entrada, então nunca brigam. */
  const stageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, reduce ? 1 : 1.16]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);

  const n = SERVICES.length;
  const phraseMax = Math.round(S * 0.52);

  return (
    <section
      ref={heroRef}
      className="hero360"
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--espresso)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 16px",
      }}
    >
      {/* brilho radial quente ao fundo */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(60% 55% at 50% 48%, rgba(104,45,27,0.34) 0%, rgba(104,45,27,0.10) 38%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* PALCO — escala/parallax pelo scroll */}
      <motion.div
        ref={stageRef}
        style={{
          position: "relative",
          width: "min(82vw, 600px)",
          aspectRatio: "1 / 1",
          scale: stageScale,
          y: stageY,
          overflow: "visible",
        }}
      >
        {/* Anéis concêntricos + anel tracejado (eco de "travessia"/ondas) */}
        <motion.svg
          viewBox="0 0 100 100"
          aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {[12, 19, 26].map((r) => (
            <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="rgba(243,235,226,0.06)" strokeWidth="0.25" />
          ))}
          {/* anel principal (onde ficam os nós) */}
          <circle
            cx="50"
            cy="50"
            r="34"
            fill="none"
            stroke="rgba(216,213,210,0.22)"
            strokeWidth="0.3"
            strokeDasharray="0.6 1.8"
          />
          <circle cx="50" cy="50" r="41" fill="none" stroke="rgba(243,235,226,0.05)" strokeWidth="0.25" />
        </motion.svg>

        {/* CONTEÚDO CENTRAL — só a frase + emblema 360° */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            zIndex: 4,
            pointerEvents: "none",
          }}
        >
          {/* emblema 360° */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", marginBottom: "18px" }}
          >
            <motion.svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--sienna)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={reduce ? {} : { rotate: 360 }}
              transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.85 1 6.6 2.6" />
              <path d="M21 3v5h-5" />
            </motion.svg>
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(243,235,226,0.55)",
              }}
            >
              Estratégia 360°
            </span>
          </motion.div>

          {/* A FRASE */}
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontStyle: "normal",
              fontSize: "clamp(30px, 4.6vw, 60px)",
              lineHeight: 1.04,
              color: "var(--cream)",
              maxWidth: `${phraseMax}px`,
              margin: 0,
            }}
          >
            A travessia{" "}
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 300 }}>começou</span>
          </motion.h1>
        </div>

        {/* OS SERVIÇOS ORBITANDO */}
        {SERVICES.map((label, i) => (
          <OrbitItem
            key={label}
            label={label}
            baseAngle={-90 + (360 / n) * i}
            dotR={ringR}
            labelR={labelR}
            spin={spin}
            index={i}
            show={inView}
          />
        ))}
      </motion.div>

      {/* dica de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.4 }}
        style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", zIndex: 5 }}
      >
        <motion.div
          animate={reduce ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(243,235,226,0.4)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
