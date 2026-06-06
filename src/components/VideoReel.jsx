import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

/**
 * VideoReel — "Por dentro do laboratório"
 *
 * VÍDEOS: salve os arquivos em  /public/videos/  com os nomes:
 *   video-01.mp4  video-02.mp4  video-03.mp4
 *   video-04.mp4  video-05.mp4  video-06.mp4
 *
 * Enquanto o arquivo não existir, o card mostra um placeholder elegante.
 * Quando o arquivo é colocado na pasta, o vídeo aparece automaticamente.
 *
 * Formatos suportados: .mp4 (H.264) — recomendado para compatibilidade.
 * Orientação: qualquer uma — object-fit: cover centraliza e recorta.
 */

const VIDEOS = [
  {
    id: '01',
    src: '/videos/video-01.mp4',
    title: 'Teaser',
    category: 'Awareness',
    duration: '',
    quote: 'Yarden Lab.',
    description: 'A primeira impressão que posiciona.',
  },
  {
    id: '02',
    src: '/videos/video-02.mp4',
    title: 'Manifesto',
    category: 'Consideração',
    duration: '',
    quote: 'Não somos uma agência.',
    description: 'A inteligência de marca que a sua empresa merece ter.',
  },
  {
    id: '03',
    src: '/videos/video-03.mp4',
    title: 'Quem Está Por Trás',
    category: 'Consideração',
    duration: '',
    quote: 'Estratégia criativa encontra performance.',
    description: 'Natália em Estratégia Criativa. Allisson em Performance.',
  },
  {
    id: '04',
    src: '/videos/video-04.mp4',
    title: 'O Laboratório',
    category: 'Conversão',
    duration: '',
    quote: 'Marca premium não se faz no Instagram.',
    description: 'Processo, método e resultado — no mesmo lugar.',
  },
  {
    id: '05',
    src: '/videos/video-05.mp4',
    title: 'Pra Quem Existimos',
    category: 'Conversão',
    duration: '',
    quote: 'A sua entrega pode ser premium.',
    description: 'Para profissionais cujo preço não reflete o posicionamento.',
  },
  {
    id: '06',
    src: '/videos/video-06.mp4',
    title: 'A Virada',
    category: 'Awareness',
    duration: '',
    quote: 'Em 2026, marca premium não vive só de estética.',
    description: 'Método, tecnologia e estética — tudo junto.',
  },
]

// ─── Placeholder shown while the video file isn't available ──────────────────
function VideoPlaceholder({ video, featured }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #0c0204 0%, #160508 100%)',
    }}>
      {/* Film frame icon */}
      <div style={{ marginBottom: '18px', opacity: 0.18 }}>
        <svg width={featured ? 48 : 36} height={featured ? 48 : 36} viewBox="0 0 24 24" fill="none" stroke="rgba(243,235,226,0.8)" strokeWidth="1.2" strokeLinecap="round">
          <rect x="2" y="2" width="20" height="20" rx="2"/>
          <path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5"/>
        </svg>
      </div>
      <span style={{
        color: 'rgba(243,235,226,0.18)', fontSize: '9px',
        letterSpacing: '0.22em', textTransform: 'uppercase',
        fontFamily: 'var(--font-serif)', fontStyle: 'normal',
      }}>
        Vídeo em breve
      </span>
    </div>
  )
}

// ─── Icon button ──────────────────────────────────────────────────────────────
function BtnIcon({ onClick, title, active, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: '5px 9px',
        display: 'flex', alignItems: 'center',
        color: active ? 'var(--cream)' : 'rgba(243,235,226,0.6)',
        transition: 'color 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--cream)')}
      onMouseLeave={e => (e.currentTarget.style.color = active ? 'var(--cream)' : 'rgba(243,235,226,0.6)')}
    >
      {children}
    </button>
  )
}

// ─── Video card ───────────────────────────────────────────────────────────────
function VideoCard({ video, refCallback, paused, hasSound, featured, cardHeight, shouldLoad, onTogglePlay, onToggleSound, onFullscreen }) {
  const [hovered,  setHovered]  = useState(false)
  const [hasError, setHasError] = useState(false)
  const [loaded,   setLoaded]   = useState(false)

  return (
    <div
      style={{ position: 'relative', height: cardHeight ?? (featured ? '100%' : '100%'), background: '#060002', overflow: 'hidden' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Placeholder — shown until video loads or on error */}
      {(!loaded || hasError) && (
        <VideoPlaceholder video={video} featured={featured} />
      )}

      {/* Video element — src só é definido quando shouldLoad=true (seção próxima do viewport) */}
      {!hasError && (
        <video
          ref={refCallback}
          src={shouldLoad ? video.src : undefined}
          loop
          muted
          playsInline
          preload={shouldLoad ? (featured ? 'auto' : 'metadata') : 'none'}
          onError={() => setHasError(true)}
          onLoadedData={() => setLoaded(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center center',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.5s',
          }}
        />
      )}

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(6,0,2,0.92) 0%, rgba(6,0,2,0.15) 55%, rgba(6,0,2,0.45) 100%)',
      }} />

      {/* Diagonal accent line */}
      <div style={{
        position: 'absolute', top: 0, right: featured ? '38%' : '24%', width: '1px', height: '100%',
        background: 'linear-gradient(to bottom, transparent, rgba(243, 235, 226,0.1), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Top: id + category */}
      <div style={{ position: 'absolute', top: 18, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'rgba(243, 235, 226,0.9)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.3em', fontFamily: 'var(--font-serif)' }}>
          {video.id}
        </span>
        <span style={{ color: 'rgba(243,235,226,0.3)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', border: '1px solid rgba(243,235,226,0.09)', padding: '3px 8px' }}>
          {video.category}{video.duration ? ` · ${video.duration}` : ''}
        </span>
      </div>

      {/* Bottom: title + quote + hover description */}
      <div style={{ position: 'absolute', bottom: 40, left: 20, right: 20 }}>
        <motion.div animate={{ y: hovered ? -4 : 0 }} transition={{ duration: 0.3 }}>
          <p style={{ color: 'rgba(243,235,226,0.38)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '6px' }}>
            {video.title}
          </p>
          <p style={{
            fontFamily: 'var(--font-serif)', fontWeight: 300, fontStyle: 'normal',
            fontSize: featured ? 'clamp(15px,1.6vw,22px)' : '14px',
            color: 'var(--cream)', lineHeight: 1.3, maxWidth: '360px',
          }}>
            {video.quote}
          </p>
          <AnimatePresence>
            {hovered && (
              <motion.p
                key="desc"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ color: 'rgba(243,235,226,0.45)', fontSize: '12px', lineHeight: 1.6, marginTop: '8px', fontWeight: 300, maxWidth: '320px' }}
              >
                {video.description}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Sound-on indicator */}
      {hasSound && (
        <div style={{ position: 'absolute', bottom: 32, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, var(--cream), rgba(243, 235, 226,0.2), transparent)', pointerEvents: 'none' }} />
      )}

      {/* Controls bar — only when video is loaded */}
      {loaded && !hasError && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          display: 'flex', alignItems: 'center', padding: '2px 8px',
          background: 'rgba(4,0,1,0.72)', backdropFilter: 'blur(6px)',
          opacity: hovered ? 1 : 0.35,
          transition: 'opacity 0.3s',
        }}>
          <BtnIcon onClick={onTogglePlay} title={paused ? 'Reproduzir' : 'Pausar'}>
            {paused ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,3 20,12 6,21"/></svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="3" width="4" height="18"/><rect x="15" y="3" width="4" height="18"/></svg>
            )}
          </BtnIcon>

          <BtnIcon onClick={onToggleSound} title={hasSound ? 'Silenciar' : 'Ativar som'} active={hasSound}>
            {hasSound ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
              </svg>
            )}
          </BtnIcon>

          <div style={{ flex: 1 }} />

          <BtnIcon onClick={onFullscreen} title="Tela cheia">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>
            </svg>
          </BtnIcon>
        </div>
      )}
    </div>
  )
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function VideoReel() {
  const sectionRef  = useRef(null)
  // shouldLoad: dispara 500px ANTES da seção aparecer → vídeos já carregando quando o usuário chegar
  const shouldLoad  = useInView(sectionRef, { once: true, margin: '500px' })
  // inView: dispara quando a seção entra de fato na tela → aciona autoplay e animações
  const inView      = useInView(sectionRef, { once: true, margin: '-100px' })
  const domRefs     = useRef([])

  const setRef  = (idx) => (el) => { domRefs.current[idx] = el }

  const [paused,   setPaused]   = useState(VIDEOS.map(() => false))
  const [soundIdx, setSoundIdx] = useState(null) // only one video has sound at a time

  // Autoplay all when section is visible
  useEffect(() => {
    if (!inView) return
    domRefs.current.forEach(v => { if (v) v.play().catch(() => {}) })
  }, [inView])

  // Sync muted state
  useEffect(() => {
    domRefs.current.forEach((v, i) => { if (v) v.muted = i !== soundIdx })
  }, [soundIdx])

  const togglePlay = useCallback((idx) => {
    const v = domRefs.current[idx]
    if (!v) return
    if (v.paused) {
      v.play().catch(() => {})
      setPaused(p => p.map((x, i) => i === idx ? false : x))
    } else {
      v.pause()
      setPaused(p => p.map((x, i) => i === idx ? true : x))
    }
  }, [])

  const toggleSound = useCallback((idx) => {
    setSoundIdx(prev => prev === idx ? null : idx)
  }, [])

  const goFullscreen = useCallback((idx) => {
    const v = domRefs.current[idx]
    if (!v) return
    ;(v.requestFullscreen || v.webkitRequestFullscreen || (() => {})).call(v)
  }, [])

  const cardProps = (idx, extra = {}) => ({
    video:          VIDEOS[idx],
    refCallback:    setRef(idx),
    paused:         paused[idx],
    hasSound:       soundIdx === idx,
    shouldLoad,                            // ← lazy-load controlado
    onTogglePlay:   () => togglePlay(idx),
    onToggleSound:  () => toggleSound(idx),
    onFullscreen:   () => goFullscreen(idx),
    ...extra,
  })

  return (
    <section id="videos" style={{ background: '#060002', padding: '140px 0', position: 'relative' }} ref={sectionRef}>

      {/* Top rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(243, 235, 226,0.3), transparent)' }} />

      <div className="container">

        {/* ── Header ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: '56px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '32px' }}
        >
          <div>
            <p className="section-label" style={{ color: 'var(--cream)' }}>A Marca em Movimento</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(36px,5vw,68px)', lineHeight: 1.05, color: 'var(--cream)' }}>
              Por dentro
              <br />
              <em style={{ fontStyle: 'normal', color: 'var(--cream)' }}>do laboratório.</em>
            </h2>
          </div>
          <p style={{ color: 'rgba(243,235,226,0.38)', maxWidth: '300px', lineHeight: 1.7, fontSize: '14px', fontWeight: 300 }}>
            Todos os vídeos reproduzem juntos. Clique no ícone de som para ouvir um — os outros silenciam.
          </p>
        </motion.div>

        {/*
          ── Grid (desktop) ─────────────────────────────────────

              ┌──────────────┬─────────┐
              │  01 (square) │   02    │
              │   featured   ├─────────┤
              │              │   03    │
              ├──────┬───────┴───┬─────┤
              │  04  │    05     │  06 │
              └──────┴───────────┴─────┘
        */}

        {/* Top row */}
        <motion.div
          className="vr-top"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="vr-featured">
            <VideoCard {...cardProps(0, { featured: true })} />
          </div>
          <div className="vr-side">
            <VideoCard {...cardProps(1)} />
            <VideoCard {...cardProps(2)} />
          </div>
        </motion.div>

        {/* Bottom row */}
        <motion.div
          className="vr-bottom"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <VideoCard {...cardProps(3, { cardHeight: '300px' })} />
          <VideoCard {...cardProps(4, { cardHeight: '300px' })} />
          <VideoCard {...cardProps(5, { cardHeight: '300px' })} />
        </motion.div>

      </div>

      {/* Bottom rule */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(to right, transparent, rgba(243, 235, 226,0.15), transparent)' }} />

      <style>{`
        /* ── Top row: featured (square) + 2 stacked landscape ── */
        .vr-top {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
          margin-bottom: 2px;
        }
        .vr-featured {
          aspect-ratio: 1 / 1;   /* Instagram 1:1 square */
        }
        .vr-featured > * {
          height: 100% !important;
        }
        .vr-side {
          display: flex;
          flex-direction: column;
          gap: 2px;
          /* sem height explícito — o grid stretch preenche a linha sozinho */
        }
        .vr-side > * {
          flex: 1;
          min-height: 0;
          height: 0 !important; /* !important sobrescreve o inline height:'100%' do VideoCard;
                                   flex:1 assume o controle e divide o espaço igualmente */
        }

        /* ── Bottom row: 3 equal cards (height set inline per card) ── */
        .vr-bottom {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 2px;
        }

        /* ── Tablet ── */
        @media (max-width: 1100px) {
          .vr-bottom { grid-template-columns: 1fr 1fr !important; }
          .vr-bottom > *:last-child { grid-column: 1 / -1; }
        }

        /* ── Mobile ── */
        @media (max-width: 720px) {
          .vr-bottom { display: none !important; }
          .vr-top  { grid-template-columns: 1fr !important; }
          .vr-featured { aspect-ratio: 1 !important; }
          .vr-side > * { height: 260px !important; flex: none !important; }
        }
      `}</style>
    </section>
  )
}
