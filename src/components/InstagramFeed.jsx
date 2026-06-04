import { useRef, useState, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

/**
 * InstagramFeed — grade 3 colunas quadradas, estilo Instagram mobile.
 * Este componente é exibido APENAS em mobile (≤768px via .mobile-only no App).
 * No desktop o PhotoCarousel e o VideoReel assumem o lugar.
 *
 * Fotos: /public/carousel/foto-1.jpg … foto-4.jpg
 * Vídeos: /public/videos/video-01.mp4 … video-06.mp4
 */

const MEDIA = [
  { id: 0, type: 'photo', src: '/carousel/foto-1.jpg', label: 'Captação Premium'    },
  { id: 1, type: 'video', src: '/videos/video-01.mp4', label: 'Teaser'              },
  { id: 2, type: 'photo', src: '/carousel/foto-2.jpg', label: 'Identidade Visual'   },
  { id: 3, type: 'video', src: '/videos/video-02.mp4', label: 'Brand Film'          },
  { id: 4, type: 'photo', src: '/carousel/foto-3.jpg', label: 'Branding Editorial'  },
  { id: 5, type: 'video', src: '/videos/video-03.mp4', label: 'Campanha'            },
  { id: 6, type: 'video', src: '/videos/video-04.mp4', label: 'Produto'             },
  { id: 7, type: 'photo', src: '/carousel/foto-4.jpg', label: 'Presença Digital'    },
  { id: 8, type: 'video', src: '/videos/video-05.mp4', label: 'Lifestyle'           },
  { id: 9, type: 'video', src: '/videos/video-06.mp4', label: 'Editorial'           },
]

/* ── Célula da grade (quadrado 1:1) ─────────────────────────────────── */
function GridCell({ item, index, inView, onOpen }) {
  const [loaded, setLoaded]   = useState(false)
  const [error, setError]     = useState(false)
  const videoRef              = useRef(null)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4) }}
      onClick={() => onOpen(item.id)}
      style={{
        position: 'relative',
        aspectRatio: '4 / 5',   /* portrait Instagram — mais alto que largo */
        overflow: 'hidden',
        cursor: 'pointer',
        background: item.type === 'video'
          ? 'linear-gradient(145deg,#0e0714 0%,#1a0d1e 100%)'
          : 'linear-gradient(145deg,#1c0608 0%,#0f0305 100%)',
      }}
    >
      {/* Foto */}
      {item.type === 'photo' && (
        <img
          src={item.src}
          alt={item.label}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            display: error ? 'none' : 'block',
          }}
        />
      )}

      {/* Vídeo — thumbnail do primeiro frame */}
      {item.type === 'video' && !error && (
        <video
          ref={videoRef}
          src={item.src}
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
          }}
        />
      )}

      {/* Placeholder */}
      {(!loaded || error) && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {item.type === 'video'
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(243,235,226,0.18)" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(243,235,226,0.18)" strokeWidth="1.2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          }
        </div>
      )}

      {/* Badge de vídeo (canto superior direito) */}
      {item.type === 'video' && loaded && (
        <div style={{ position: 'absolute', top: 6, right: 6, opacity: 0.7 }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
      )}
    </motion.div>
  )
}

/* ── Lightbox mobile ────────────────────────────────────────────────── */
function Lightbox({ items, initialIdx, onClose }) {
  const [idx, setIdx] = useState(initialIdx)
  const videoRef      = useRef(null)
  const item          = items[idx]

  const prev = () => setIdx(i => (i - 1 + items.length) % items.length)
  const next = () => setIdx(i => (i + 1) % items.length)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (item.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [idx])

  const goFullscreen = () => {
    const v = videoRef.current
    if (!v) return
    if (v.requestFullscreen)            v.requestFullscreen()
    else if (v.webkitRequestFullscreen) v.webkitRequestFullscreen()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 3000,
        background: 'rgba(9,1,4,0.97)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column',
      }}
      onClick={onClose}
    >
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} style={{ width: '100%' }}>
            {item.type === 'photo'
              ? <img
                  src={item.src}
                  alt={item.label}
                  style={{ maxWidth: '100vw', maxHeight: '85vh', objectFit: 'contain', display: 'block' }}
                />
              : <video
                  ref={videoRef}
                  src={item.src}
                  controls
                  autoPlay
                  playsInline
                  style={{
                    /* 9:16 portrait: altura máxima 88vh, largura proporcional */
                    height: '88vh',
                    maxHeight: '88vh',
                    width: 'auto',
                    maxWidth: '100vw',
                    display: 'block',
                    background: '#000',
                    aspectRatio: '9 / 16',
                  }}
                />
            }
          </motion.div>
        </AnimatePresence>

        {/* Barra inferior */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '12px 16px 0' }}>
          <span style={{ color: 'rgba(243,235,226,0.4)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            {item.label}
          </span>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ color: 'rgba(243,235,226,0.25)', fontSize: '10px' }}>{idx + 1} / {items.length}</span>
            {item.type === 'video' && (
              <button onClick={goFullscreen} style={{ background: 'none', border: '1px solid rgba(243,235,226,0.2)', color: 'rgba(243,235,226,0.5)', padding: '4px 10px', cursor: 'pointer', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                Tela cheia
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Setas nav */}
      {[{ dir: 'prev', pos: 'left', action: prev }, { dir: 'next', pos: 'right', action: next }].map(({ dir, pos, action }) => (
        <button key={dir} onClick={e => { e.stopPropagation(); action() }} style={{
          position: 'fixed', [pos]: '10px', top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(9,1,4,0.7)', border: '1px solid rgba(243,235,226,0.1)',
          color: 'rgba(243,235,226,0.7)', width: 38, height: 38,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            {dir === 'prev' ? <path d="M15 18l-6-6 6-6"/> : <path d="M9 18l6-6-6-6"/>}
          </svg>
        </button>
      ))}

      {/* Fechar */}
      <button onClick={onClose} style={{
        position: 'fixed', top: 14, right: 14,
        background: 'rgba(9,1,4,0.7)', border: '1px solid rgba(243,235,226,0.12)',
        color: 'rgba(243,235,226,0.7)', width: 36, height: 36,
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </motion.div>
  )
}

/* ── Seção ──────────────────────────────────────────────────────────── */
export default function InstagramFeed() {
  const sectionRef            = useRef(null)
  const inView                = useInView(sectionRef, { once: true, margin: '-40px' })
  const [lightbox, setLightbox] = useState(null)

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      style={{ background: '#000', position: 'relative', paddingBottom: '48px' }}
    >
      {/* Cabeçalho mobile */}
      <div style={{ padding: '52px 24px 28px' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p style={{
            fontSize: '9px', fontWeight: 700, letterSpacing: '0.28em',
            textTransform: 'uppercase', color: 'var(--gold)',
            display: 'flex', alignItems: 'center', gap: '10px',
            marginBottom: '14px',
          }}>
            <span style={{ width: 24, height: 1, background: 'var(--gold)', display: 'inline-block', opacity: 0.5 }} />
            Nossa Produção
          </p>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontWeight: 300,
            fontSize: 'clamp(28px, 8vw, 42px)', lineHeight: 1.1,
            color: 'var(--cream)', marginBottom: '10px',
          }}>
            Estética que converte<br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>e posiciona.</em>
          </h2>
          <p style={{ color: 'rgba(243,235,226,0.4)', fontSize: '13px', lineHeight: 1.65, fontWeight: 300 }}>
            Cada projeto nasce de uma estratégia — e termina com uma identidade que o mercado reconhece.
          </p>
        </motion.div>
      </div>

      {/* Grade 3 colunas — full-width, 1px gap, idêntico ao Instagram */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1px',
        background: '#000', /* a cor do gap */
      }}>
        {MEDIA.map((item, i) => (
          <GridCell
            key={item.id}
            item={item}
            index={i}
            inView={inView}
            onOpen={setLightbox}
          />
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox items={MEDIA} initialIdx={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
