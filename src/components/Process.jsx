import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const steps = [
  {
    num: '01',
    title: 'Imersão',
    subtitle: 'Entendemos a fundo',
    desc: 'Diagnóstico estratégico da sua marca, mercado e concorrentes. Identificamos gaps, oportunidades e o posicionamento ideal.',
    duration: '1–2 semanas',
  },
  {
    num: '02',
    title: 'Arquitetura',
    subtitle: 'Construímos o plano',
    desc: 'Plano de marca completo, calendário editorial, diretrizes criativas e mapa de canais com investimento recomendado.',
    duration: '1–2 semanas',
  },
  {
    num: '03',
    title: 'Execução',
    subtitle: 'Operamos com método',
    desc: 'Captação, produção de conteúdo, gestão de canais, automações com IA e gestão de tráfego — tudo integrado.',
    duration: 'Contínuo',
  },
  {
    num: '04',
    title: 'Inteligência',
    subtitle: 'Aprendemos e evoluímos',
    desc: 'Análise de dados mensal, relatórios com IA, ajuste de estratégia e evolução contínua das ferramentas e processos.',
    duration: 'Mensal',
  },
]

// Rio (desktop): meandro largo na faixa central, âncoras (34,18)(66,43)(34,68)(66,93)
const RIVER_DESKTOP =
  'M 50,7 C 50,13 34,14 34,18 C 34,30 66,31 66,43 C 66,55 34,56 34,68 C 34,80 66,81 66,93 C 66,98 56,101 52,104'

// y (vertical) e lado de cada marco — o x é definido no CSS (varia por breakpoint)
const ANCHORS = [
  { y: '13%', side: 'left' },
  { y: '38%', side: 'right' },
  { y: '63%', side: 'left' },
  { y: '88%', side: 'right' },
]

function River({ d, kind, inView }) {
  return (
    <svg
      className={`river-svg ${kind}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', zIndex: 0, pointerEvents: 'none' }}
    >
      <path d={d} fill="none" stroke="#682D1B" strokeOpacity="0.1" strokeWidth="11" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <motion.path
        d={d}
        fill="none"
        stroke="#682D1B"
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={inView ? { pathLength: 1 } : {}}
        transition={{ duration: 3, ease: 'easeInOut' }}
      />
    </svg>
  )
}

export default function Process() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const flowRef = useRef(null)
  const [mobilePath, setMobilePath] = useState('')

  // No mobile (≤600px) o layout é empilhado/alternado com alturas variáveis,
  // então o rio é desenhado dinamicamente conectando o centro real de cada bolha.
  useEffect(() => {
    const build = () => {
      const flow = flowRef.current
      if (!flow) return
      if (window.innerWidth > 600) { setMobilePath(''); return }
      const fr = flow.getBoundingClientRect()
      const bubbles = [...flow.querySelectorAll('.river-bubble')]
      if (bubbles.length < 2) return
      const pts = bubbles.map((b) => {
        const r = b.getBoundingClientRect()
        return { x: r.left + r.width / 2 - fr.left, y: r.top + r.height / 2 - fr.top }
      })
      let d = `M ${pts[0].x} ${Math.max(0, pts[0].y - 36)} L ${pts[0].x} ${pts[0].y}`
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i - 1], c = pts[i]
        const midY = (p.y + c.y) / 2
        d += ` C ${p.x} ${midY}, ${c.x} ${midY}, ${c.x} ${c.y}`
      }
      const last = pts[pts.length - 1]
      d += ` L ${last.x} ${last.y + 36}`
      setMobilePath(d)
    }
    build()
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(build)
    const t = setTimeout(build, 450)
    window.addEventListener('resize', build)
    return () => { clearTimeout(t); window.removeEventListener('resize', build) }
  }, [])

  return (
    <section id="method" style={{ background: 'var(--cream)', padding: 'clamp(60px, 8vw, 110px) 0 clamp(72px, 10vw, 140px)', overflow: 'hidden' }}>
      <div className="container" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: '40px' }}
        >
          <p className="section-label" style={{ color: 'var(--sienna)' }}>
            Como Trabalhamos
          </p>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 300,
            fontSize: 'clamp(36px, 5vw, 68px)',
            lineHeight: 1.05,
            color: 'var(--espresso)',
            maxWidth: '640px',
          }}>
            Método que gera
            <em style={{ fontStyle: 'normal' }}> resultado real.</em>
          </h2>
          <p style={{ color: 'var(--sienna)', fontSize: '16px', fontStyle: 'normal', fontFamily: 'var(--font-serif)', marginTop: '16px', lineHeight: 1.5 }}>
            Como o rio Jordão, nosso método tem um curso — da nascente à foz.
          </p>
        </motion.div>

        {/* ── Curso do rio: os marcos seguem o traçado serpenteando ── */}
        <div className="river-flow" ref={flowRef}>
          <River d={RIVER_DESKTOP} kind="desktop" inView={inView} />

          {/* Rio do mobile — caminho dinâmico ligando as bolhas alternadas */}
          {mobilePath && (
            <svg
              className="river-svg-mobile-dyn"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', zIndex: 0, pointerEvents: 'none' }}
            >
              <path d={mobilePath} fill="none" stroke="#682D1B" strokeOpacity="0.1" strokeWidth="9" strokeLinecap="round" />
              <path d={mobilePath} fill="none" stroke="#682D1B" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}

          {steps.map((step, i) => {
            const a = ANCHORS[i]
            const isLeft = a.side === 'left'
            return (
              <motion.div
                key={step.num}
                className={`river-step ${isLeft ? 'is-left' : 'is-right'}`}
                initial={{ opacity: 0, y: 22 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4 + i * 0.4 }}
                style={{ '--y': a.y }}
              >
                {/* Bolha numerada — fica sobre o rio */}
                <div className="river-bubble">
                  <div style={{
                    width: '72px', height: '72px',
                    border: '1px solid var(--sienna)',
                    background: 'var(--cream)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    <div style={{ position: 'absolute', inset: '6px', background: i === 0 ? 'var(--espresso)' : 'transparent' }} />
                    <span style={{
                      fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 300,
                      color: i === 0 ? 'var(--cream)' : 'var(--espresso)', position: 'relative', zIndex: 1,
                    }}>
                      {step.num}
                    </span>
                  </div>
                </div>

                {/* Conteúdo no lado de FORA da bolha (longe do rio) */}
                <div className="river-text">
                  <div style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sienna)', marginBottom: '12px', fontWeight: 600 }}>
                    {step.subtitle}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(28px, 3vw, 40px)', color: 'var(--espresso)', marginBottom: '16px', lineHeight: 1.1 }}>
                    {step.title}
                  </h3>
                  <p style={{ color: 'rgba(54,15,17,0.65)', fontSize: 'clamp(15px, 1.5vw, 18px)', lineHeight: 1.7, marginBottom: '18px', fontWeight: 300 }}>
                    {step.desc}
                  </p>
                  <div className="river-duration" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    color: 'rgba(54,15,17,0.45)', fontSize: '12px', letterSpacing: '0.1em',
                  }}>
                    <span style={{ width: '16px', height: '1px', background: 'currentColor', display: 'inline-block' }} />
                    {step.duration}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <style>{`
        .river-flow {
          position: relative;
          height: clamp(820px, 68vw, 980px);
          margin-top: 24px;
        }
        .river-step {
          position: absolute;
          top: var(--y);
          left: 0; right: 0;
          height: 0;
          z-index: 1;
        }
        .river-bubble {
          position: absolute;
          top: 0;
          transform: translate(-50%, -50%);
        }
        .river-text {
          position: absolute;
          top: 0;
          transform: translateY(-50%);
          width: min(400px, 30%);
        }
        .river-duration { flex-direction: row; }

        /* Desktop/tablet: meandro largo na faixa central, texto nas bordas */
        .is-left  .river-bubble { left: 34%; }
        .is-right .river-bubble { left: 66%; }
        .is-left  .river-text { right: calc(66% + 60px); text-align: right; }
        .is-right .river-text { left:  calc(66% + 60px); text-align: left; }
        .is-left  .river-duration { flex-direction: row-reverse; }

        .river-svg.desktop { display: block; }
        .river-svg.mobile  { display: none; }

        /* ── Tablet: mesmo meandro do desktop (intercalado), texto mais estreito ── */
        @media (max-width: 1024px) {
          .river-text { width: min(300px, 32%); }
        }

        /* ── Phone: empilha vertical, mas ALTERNANDO o lado (como o desktop) ── */
        @media (max-width: 600px) {
          .river-flow {
            height: auto !important;
            display: flex;
            flex-direction: column;
            gap: 40px;
            margin-top: 8px;
            position: relative;   /* contexto para o SVG do rio (dinâmico) */
          }
          .river-svg { display: none !important; }            /* esconde o do desktop */
          .river-svg-mobile-dyn { display: block !important; } /* mostra o dinâmico */

          .river-step {
            position: relative !important;   /* fica ACIMA do rio (z-index) */
            z-index: 1;
            height: auto !important;
            transform: none !important;
            display: flex;
            align-items: flex-start;
            gap: 16px;
          }
          .river-step.is-left  { flex-direction: row; }          /* bolha esq · texto dir */
          .river-step.is-right { flex-direction: row-reverse; }  /* bolha dir · texto esq */

          .river-bubble {
            position: static !important;
            transform: none !important;
            flex-shrink: 0;
          }
          .river-text {
            position: static !important;
            transform: none !important;
            width: auto !important;
            flex: 1;
            min-width: 0;
          }
          .is-left  .river-text { text-align: left !important; }
          .is-right .river-text { text-align: right !important; }
          .is-left  .river-duration { flex-direction: row !important; }
          .is-right .river-duration { flex-direction: row-reverse !important; }
        }
      `}</style>
    </section>
  )
}
