import { useRef } from 'react'
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

// Rio (mobile): meandro vertical à ESQUERDA, âncoras (18,18)(34,43)(18,68)(34,93)
const RIVER_MOBILE =
  'M 26,4 C 26,10 18,12 18,18 C 18,30 34,31 34,43 C 34,55 18,56 18,68 C 18,80 34,81 34,93 C 34,98 28,101 26,104'

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
            <em style={{ fontStyle: 'italic' }}> resultado real.</em>
          </h2>
          <p style={{ color: 'rgba(54,15,17,0.5)', fontSize: '14px', fontStyle: 'italic', fontFamily: 'var(--font-serif)', marginTop: '14px' }}>
            Como o rio Jordão, nosso método tem um curso — da nascente à foz.
          </p>
        </motion.div>

        {/* ── Curso do rio: os marcos seguem o traçado serpenteando ── */}
        <div className="river-flow">
          <River d={RIVER_DESKTOP} kind="desktop" inView={inView} />
          <River d={RIVER_MOBILE}  kind="mobile"  inView={inView} />

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

        /* ── Tablet: aperta um pouco o texto ── */
        @media (max-width: 1024px) {
          .river-text { width: min(320px, 30%); }
        }

        /* ── Mobile/phone: rio vertical à esquerda, texto à direita ── */
        @media (max-width: 680px) {
          .river-flow { height: clamp(1360px, 370vw, 1620px); margin-top: 12px; }
          .river-svg.desktop { display: none; }
          .river-svg.mobile  { display: block; }

          .is-left  .river-bubble { left: 18%; }
          .is-right .river-bubble { left: 34%; }

          .river-text { width: 52% !important; }
          .is-left  .river-text,
          .is-right .river-text {
            left: 46% !important;
            right: auto !important;
            text-align: left !important;
          }
          .is-left  .river-duration,
          .is-right .river-duration { flex-direction: row !important; }
        }
      `}</style>
    </section>
  )
}
