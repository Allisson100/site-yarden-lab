import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

/**
 * MediaReel — grade mista de fotos e vídeos.
 * Combina "Estética que converte e posiciona." + "Por dentro do laboratório."
 * Fotos: /public/carousel/foto-X.jpg
 * Vídeos: /public/videos/video-0X.mp4
 *
 * Layout:
 *   ┌────────────────┬──────────┐
 *   │  01 (feat 1×1) │    02    │
 *   │                ├──────────┤
 *   │                │    03    │
 *   ├────────┬───────┴───┬──────┤
 *   │   04   │    05     │  06  │
 *   └────────┴───────────┴──────┘
 */

/*
 * Layout — grade 3 colunas, 6 itens (2 vídeos + 4 fotos) com tamanhos variados.
 * Sequência embaralhada: vídeo, foto, foto, foto, foto, vídeo.
 *
 *  col:  1            2            3
 *  r1: [V01 ][P02 ─────────────]    ← vídeo vertical grande + foto larga
 *  r2: [tall][P03 ][P04 ]           ← vídeo cont. + 2 fotos
 *  r3: [P05 ──────────][V06 ]       ← foto larga + vídeo
 */

const MEDIA = [
  // 0 — vídeo grande VERTICAL (1 col × 2 linhas)
  {
    id: "01",
    type: "video",
    src: "/videos/video-01.mp4",
    title: "Teaser",
    category: "Awareness",
    quote: "Yarden Lab.",
    description: "A primeira impressão que posiciona.",
  },
  // 1 — foto LARGA horizontal (2 cols)
  {
    id: "02",
    type: "photo",
    src: "/carousel/foto-1.jpg",
    title: "Captação Premium",
    category: "Fotografia",
    quote: "Estética que converte.",
    description: "Cada imagem comunica um posicionamento.",
  },
  // 2 — foto quadrada
  {
    id: "03",
    type: "photo",
    src: "/carousel/foto-2.jpg",
    title: "Identidade Visual",
    category: "Fotografia",
    quote: "Presença que posiciona.",
    description: "Branding editorial com intenção e método.",
  },
  // 3 — foto quadrada
  {
    id: "04",
    type: "photo",
    src: "/carousel/foto-3.jpg",
    title: "Branding Editorial",
    category: "Fotografia",
    quote: "Sua marca, com método.",
    description: "Direção criativa premium para cada projeto.",
  },
  // 4 — foto LARGA horizontal (2 cols)
  {
    id: "05",
    type: "photo",
    src: "/carousel/foto-4.jpg",
    title: "Posicionamento",
    category: "Fotografia",
    quote: "A imagem que o mercado reconhece.",
    description: "Cada detalhe comunica valor e intenção.",
  },
  // 5 — vídeo
  {
    id: "06",
    type: "video",
    src: "/videos/video-02.mp4",
    title: "Manifesto",
    category: "Consideração",
    quote: "Não somos uma agência.",
    description: "A inteligência de marca que a sua empresa merece ter.",
  },
];

/* Posições na grade 3×3 — cada item ocupa um col/row span definido */
const GRID_POS = [
  { col: "1 / 2", row: "1 / 3" }, // 0: V01 — vídeo vertical grande (1 col × 2 linhas)
  { col: "2 / 4", row: "1 / 2" }, // 1: P02 — foto larga (2 cols)
  { col: "2 / 3", row: "2 / 3" }, // 2: P03 — foto quadrada
  { col: "3 / 4", row: "2 / 3" }, // 3: P04 — foto quadrada
  { col: "1 / 3", row: "3 / 4" }, // 4: P05 — foto larga (2 cols)
  { col: "3 / 4", row: "3 / 4" }, // 5: V06 — vídeo quadrado
];

// ── Ícone placeholder ─────────────────────────────────────────────────────────
function Placeholder({ isVideo, featured }) {
  const sz = featured ? 48 : 32;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #0c0204 0%, #160508 100%)",
      }}
    >
      <div style={{ marginBottom: 14, opacity: 0.18 }}>
        {isVideo ? (
          <svg
            width={sz}
            height={sz}
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(243,235,226,0.8)"
            strokeWidth="1.2"
            strokeLinecap="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="2" />
            <path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5" />
          </svg>
        ) : (
          <svg
            width={sz}
            height={sz}
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(243,235,226,0.8)"
            strokeWidth="1.2"
            strokeLinecap="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )}
      </div>
      <span
        style={{
          color: "rgba(243,235,226,0.18)",
          fontSize: "9px",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
        }}
      >
        {isVideo ? "Vídeo em breve" : "Foto em breve"}
      </span>
    </div>
  );
}

// ── Botão de controle ─────────────────────────────────────────────────────────
function Btn({ onClick, title, active, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "5px 9px",
        display: "flex",
        alignItems: "center",
        color: active ? "var(--cream)" : "rgba(243,235,226,0.6)",
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--cream)")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.color = active
          ? "var(--cream)"
          : "rgba(243,235,226,0.6)")
      }
    >
      {children}
    </button>
  );
}

// ── Card unificado (foto ou vídeo) ────────────────────────────────────────────
function MediaCard({
  item,
  refCallback,
  paused,
  hasSound,
  featured,
  cardHeight,
  shouldLoad,
  onTogglePlay,
  onToggleSound,
  onFullscreen,
}) {
  const [hovered, setHovered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const isVideo = item.type === "video";

  return (
    <div
      style={{
        position: "relative",
        height: cardHeight ?? "100%",
        background: "#090104",
        overflow: "hidden",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Placeholder */}
      {(!loaded || hasError) && (
        <Placeholder isVideo={isVideo} featured={featured} />
      )}

      {/* ── Foto ── */}
      {!isVideo && !hasError && (
        <img
          src={item.src}
          alt={item.title}
          onLoad={() => setLoaded(true)}
          onError={() => setHasError(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transition: "transform 0.6s ease",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            opacity: loaded ? 1 : 0,
          }}
        />
      )}

      {/* ── Vídeo ── */}
      {isVideo && !hasError && (
        <video
          ref={refCallback}
          src={shouldLoad ? item.src : undefined}
          loop
          muted
          playsInline
          preload={shouldLoad ? (featured ? "auto" : "metadata") : "none"}
          onError={() => setHasError(true)}
          onLoadedData={() => setLoaded(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.5s",
          }}
        />
      )}

      {/* Gradiente sobre a mídia */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(to top, rgba(6,0,2,0.92) 0%, rgba(6,0,2,0.12) 55%, rgba(6,0,2,0.38) 100%)",
        }}
      />

      {/* Linha diagonal decorativa */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: featured ? "38%" : "22%",
          width: "1px",
          height: "100%",
          background:
            "linear-gradient(to bottom, transparent, rgba(243, 235, 226,0.08), transparent)",
          pointerEvents: "none",
        }}
      />

      {/* Topo: número + categoria */}
      <div
        style={{
          position: "absolute",
          top: 18,
          left: 20,
          right: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "rgba(243, 235, 226,0.85)",
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.3em",
            fontFamily: "var(--font-serif)",
          }}
        >
          {item.id}
        </span>
        <span
          style={{
            color: "rgba(243,235,226,0.28)",
            fontSize: "9px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            border: "1px solid rgba(243,235,226,0.09)",
            padding: "3px 8px",
          }}
        >
          {item.category}
        </span>
      </div>

      {/* Rodapé: título + quote + desc hover */}
      <div
        style={{
          position: "absolute",
          bottom: isVideo ? 40 : 22,
          left: 20,
          right: 20,
        }}
      >
        <motion.div
          animate={{ y: hovered ? -4 : 0 }}
          transition={{ duration: 0.28 }}
        >
          <p
            style={{
              color: "rgba(243,235,226,0.35)",
              fontSize: "9px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            {item.title}
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: featured ? "clamp(15px,1.6vw,22px)" : "14px",
              color: "var(--cream)",
              lineHeight: 1.3,
              maxWidth: "360px",
            }}
          >
            {item.quote}
          </p>
          <AnimatePresence>
            {hovered && (
              <motion.p
                key="desc"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  color: "rgba(243,235,226,0.42)",
                  fontSize: "12px",
                  lineHeight: 1.6,
                  marginTop: "8px",
                  fontWeight: 300,
                  maxWidth: "320px",
                }}
              >
                {item.description}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Controles (só para vídeos carregados) */}
      {isVideo && loaded && !hasError && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            padding: "2px 8px",
            background: "rgba(4,0,1,0.72)",
            backdropFilter: "blur(6px)",
            opacity: hovered ? 1 : 0.35,
            transition: "opacity 0.3s",
          }}
        >
          <Btn onClick={onTogglePlay} title={paused ? "Reproduzir" : "Pausar"}>
            {paused ? (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <polygon points="6,3 20,12 6,21" />
              </svg>
            ) : (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <rect x="5" y="3" width="4" height="18" />
                <rect x="15" y="3" width="4" height="18" />
              </svg>
            )}
          </Btn>
          <Btn
            onClick={onToggleSound}
            title={hasSound ? "Silenciar" : "Ativar som"}
            active={hasSound}
          >
            {hasSound ? (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            ) : (
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </Btn>
          <div style={{ flex: 1 }} />
          <Btn onClick={onFullscreen} title="Tela cheia">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
            </svg>
          </Btn>
        </div>
      )}

      {/* Badge "foto" discreto */}
      {!isVideo && loaded && (
        <div
          style={{ position: "absolute", top: 10, right: 10, opacity: 0.45 }}
        >
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--cream)"
            strokeWidth="1.4"
            strokeLinecap="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ── Seção principal ───────────────────────────────────────────────────────────
export default function MediaReel() {
  const sectionRef = useRef(null);
  const shouldLoad = useInView(sectionRef, { once: true, margin: "500px" });
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const domRefs = useRef([]);

  const setRef = (idx) => (el) => {
    domRefs.current[idx] = el;
  };

  // apenas os índices de vídeo precisam de estado de play
  const videoIndices = MEDIA.map((m, i) =>
    m.type === "video" ? i : -1,
  ).filter((i) => i >= 0);

  const [paused, setPaused] = useState(MEDIA.map(() => false));
  const [soundIdx, setSoundIdx] = useState(null);

  useEffect(() => {
    if (!inView) return;
    videoIndices.forEach((i) => {
      const v = domRefs.current[i];
      if (v) v.play().catch(() => {});
    });
  }, [inView]);

  useEffect(() => {
    videoIndices.forEach((i) => {
      const v = domRefs.current[i];
      if (v) v.muted = i !== soundIdx;
    });
  }, [soundIdx]);

  const togglePlay = useCallback((idx) => {
    const v = domRefs.current[idx];
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPaused((p) => p.map((x, i) => (i === idx ? false : x)));
    } else {
      v.pause();
      setPaused((p) => p.map((x, i) => (i === idx ? true : x)));
    }
  }, []);

  const toggleSound = useCallback(
    (idx) => setSoundIdx((prev) => (prev === idx ? null : idx)),
    [],
  );
  const goFullscreen = useCallback((idx) => {
    const v = domRefs.current[idx];
    if (!v) return;
    (v.requestFullscreen || v.webkitRequestFullscreen || (() => {})).call(v);
  }, []);

  const cardProps = (idx, extra = {}) => {
    const item = MEDIA[idx];
    return {
      item,
      refCallback: item.type === "video" ? setRef(idx) : undefined,
      paused: paused[idx],
      hasSound: soundIdx === idx,
      shouldLoad,
      onTogglePlay: () => togglePlay(idx),
      onToggleSound: () => toggleSound(idx),
      onFullscreen: () => goFullscreen(idx),
      ...extra,
    };
  };

  return (
    <section
      id="portfolio"
      style={{
        background: "var(--cream)",
        padding: "140px 0",
        position: "relative",
      }}
      ref={sectionRef}
    >
      {/* Linha superior decorativa */}
      {/* <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(243, 235, 226,0.25), transparent)",
        }}
      /> */}

      <div className="container">
        {/* ── Header ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{
            marginBottom: "56px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "32px",
          }}
        >
          <div>
            <p className="section-label" style={{ color: "var(--espresso)" }}>
              Nossa Produção
            </p>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 300,
                fontSize: "clamp(36px,5vw,68px)",
                lineHeight: 1.05,
                color: "var(--espresso)",
              }}
            >
              Estética que converte
              <br />
              <em style={{ fontStyle: "italic" }}>e posiciona.</em>
            </h2>
          </div>
          <p
            style={{
              color: "rgba(243,235,226,0.35)",
              maxWidth: "300px",
              lineHeight: 1.7,
              fontSize: "14px",
              fontWeight: 300,
            }}
          >
            Cada projeto nasce de uma estratégia — e termina com uma identidade
            que o mercado reconhece.
          </p>
        </motion.div>

        {/* ── Grid ──────────────────────────────────────────────── */}
        <div className="mr-grid">
          {MEDIA.map((item, idx) => (
            <motion.div
              key={item.id}
              className="mr-cell"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + idx * 0.08 }}
              style={{
                gridColumn: GRID_POS[idx].col,
                gridRow: GRID_POS[idx].row,
              }}
            >
              <MediaCard {...cardProps(idx, { featured: idx === 0 })} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Linha inferior decorativa */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            "linear-gradient(to right, transparent, rgba(243, 235, 226,0.12), transparent)",
        }}
      />

      <style>{`
        .mr-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          grid-auto-rows: 290px;   /* altura base de cada linha; vídeo grande = 2× */
          gap: 2px;
        }
        .mr-cell { min-height: 0; min-width: 0; }
        .mr-cell > * { height: 100%; }

        /* Tablet/mobile: mantém o MESMO grid 3 colunas, só reduz a altura das linhas */
        @media (max-width: 900px) {
          .mr-grid { grid-auto-rows: 200px; }
        }
        @media (max-width: 600px) {
          .mr-grid { grid-auto-rows: 150px; gap: 1.5px; }
        }
        @media (max-width: 400px) {
          .mr-grid { grid-auto-rows: 124px; }
        }
      `}</style>
    </section>
  );
}
