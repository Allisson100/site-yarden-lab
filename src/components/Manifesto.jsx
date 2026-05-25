import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
}

export default function Manifesto() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="manifesto" style={{ background: 'var(--cream)', padding: '140px 0' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '100px',
          alignItems: 'center',
        }}
          className="manifesto-grid"
          ref={ref}
        >
          {/* Left — Image */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ position: 'relative' }}
          >
            <div style={{
              position: 'absolute',
              top: '-20px', left: '-20px',
              width: '60%', height: '60%',
              border: '1px solid var(--sand)',
              zIndex: 0,
            }} />
            <img
              src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&auto=format&fit=crop&q=80"
              alt="Espaço criativo Yarden Lab"
              style={{
                width: '100%',
                height: '580px',
                objectFit: 'cover',
                position: 'relative',
                zIndex: 1,
                filter: 'saturate(0.85)',
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: '-24px', right: '-24px',
              background: 'var(--burgundy)',
              padding: '28px 36px',
              zIndex: 2,
            }}>
              <div style={{
                color: 'var(--cream)',
                fontSize: 'clamp(28px, 3.5vw, 44px)',
                fontFamily: 'var(--font-serif)',
                fontWeight: 300,
                fontStyle: 'italic',
                lineHeight: 1.1,
              }}>
                360°
              </div>
              <div style={{
                color: 'rgba(243,235,226,0.55)',
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                marginTop: '6px',
              }}>
                Visão de marca
              </div>
            </div>
          </motion.div>

          {/* Right — Text */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ duration: 0.9, delay: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="section-label" style={{ color: 'var(--burgundy-mid)', marginBottom: '32px' }}>
              Quem Somos
            </p>

            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 300,
              fontSize: 'clamp(36px, 4.5vw, 62px)',
              lineHeight: 1.1,
              color: 'var(--burgundy)',
              marginBottom: '36px',
            }}>
              Marcas premium
              <br />
              merecem{' '}
              <em style={{ fontStyle: 'italic', color: 'var(--burgundy-mid)' }}>
                inteligência
              </em>
              <br />
              de verdade.
            </h2>

            <div style={{
              width: '48px',
              height: '1px',
              background: 'var(--gold)',
              marginBottom: '32px',
            }} />

            <p style={{
              color: 'rgba(54,15,17,0.7)',
              fontSize: 'clamp(15px, 1.5vw, 17px)',
              lineHeight: 1.8,
              marginBottom: '24px',
              fontWeight: 300,
            }}>
              A Yarden Lab é um laboratório de marca que une estratégia criativa,
              tecnologia de ponta e inteligência artificial para construir presença real no mercado.
            </p>

            <p style={{
              color: 'rgba(54,15,17,0.6)',
              fontSize: 'clamp(14px, 1.4vw, 16px)',
              lineHeight: 1.8,
              marginBottom: '48px',
              fontWeight: 300,
            }}>
              Não entregamos apenas conteúdo bonito. Entregamos um organismo vivo —
              estratégia, estética e dados funcionando juntos para que sua marca cresça com método e intenção.
            </p>

            <div style={{ display: 'flex', gap: '48px', marginBottom: '48px' }} className="stats-row">
              {[
                { num: '6', label: 'Soluções integradas' },
                { num: '360°', label: 'Marketing completo' },
                { num: '100%', label: 'Foco em premium' },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div style={{
                    color: 'var(--burgundy)',
                    fontSize: 'clamp(28px, 3vw, 44px)',
                    fontFamily: 'var(--font-serif)',
                    fontWeight: 300,
                    lineHeight: 1,
                  }}>{num}</div>
                  <div style={{
                    color: 'rgba(54,15,17,0.5)',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginTop: '8px',
                  }}>{label}</div>
                </div>
              ))}
            </div>

            <a href="#plans" className="btn-dark">
              Nossas Soluções
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .manifesto-grid {
            grid-template-columns: 1fr !important;
            gap: 60px !important;
          }
          .stats-row {
            gap: 28px !important;
          }
        }
      `}</style>
    </section>
  )
}
