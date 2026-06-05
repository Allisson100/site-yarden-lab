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

// Traçado do rio (Jordão) — desce serpenteando, passando por cada marco.
// Âncoras: (34,18) (66,43) (34,68) (66,93) em viewBox 0..100 — alinhadas às bolhas.
// O rio fica na faixa central; o texto vai para as bordas (sem sobreposição).
const RIVER_D =
  'M 50,7 C 50,13 34,14 34,18 C 34,30 66,31 66,43 C 66,55 34,56 34,68 C 34,80 66,81 66,93 C 66,98 56,101 52,104'

// Posição de cada marco ao longo do rio (bolha sobre o rio; texto no lado de FORA)
const ANCHORS = [
  { x: '34%', y: '13%', side: 'left' },
  { x: '66%', y: '38%', side: 'right' },
  { x: '34%', y: '63%', side: 'left' },
  { x: '66%', y: '88%', side: 'right' },
]

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
          {/* O rio */}
          <svg
            className="river-svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', zIndex: 0, pointerEvents: 'none' }}
          >
            {/* leito largo */}
            <path d={RIVER_D} fill="none" stroke="#682D1B" strokeOpacity="0.1" strokeWidth="11" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            {/* corrente — desenha da nascente à foz ao entrar na tela */}
            <motion.path
              d={RIVER_D}
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

          {/* Marcos posicionados ao longo do rio */}
          {steps.map((step, i) => {
            const a = ANCHORS[i]
            const isLeft = a.side === 'left'
            return (
              <motion.div
                key={step.num}
                className={`river-step ${isLeft ? 'is-left' : 'is-right'}`}
                initial={{ opacity: 0, y: 22 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.4 + i * 0.45 }}
                style={{ position: 'absolute', top: a.y, left: 0, right: 0, height: 0, zIndex: 1 }}
              >
                {/* Bolha numerada — fica sobre o rio */}
                <div
                  className="river-bubble"
                  style={{ position: 'absolute', left: a.x, top: 0, transform: 'translate(-50%, -50%)' }}
                >
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

                {/* Conteúdo no lado de FORA da bolha (longe do rio, sem sobrepor) */}
                <div
                  className="river-text"
                  style={{
                    position: 'absolute',
                    top: 0,
                    transform: 'translateY(-50%)',
                    width: 'min(400px, 30%)',
                    ...(isLeft
                      // marco à esquerda → texto à ESQUERDA dele
                      ? { right: `calc(${100 - parseInt(a.x, 10)}% + 60px)`, textAlign: 'right' }
                      // marco à direita → texto à DIREITA dele
                      : { left: `calc(${parseInt(a.x, 10)}% + 60px)`, textAlign: 'left' }),
                  }}
                >
                  <div style={{ fontSize: '12px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--sienna)', marginBottom: '12px', fontWeight: 600 }}>
                    {step.subtitle}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 400, fontSize: 'clamp(28px, 3vw, 40px)', color: 'var(--espresso)', marginBottom: '16px', lineHeight: 1.1 }}>
                    {step.title}
                  </h3>
                  <p style={{ color: 'rgba(54,15,17,0.65)', fontSize: 'clamp(15px, 1.5vw, 18px)', lineHeight: 1.7, marginBottom: '18px', fontWeight: 300 }}>
                    {step.desc}
                  </p>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    color: 'rgba(54,15,17,0.45)', fontSize: '12px', letterSpacing: '0.1em',
                    flexDirection: isLeft ? 'row-reverse' : 'row',
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

        /* ── Mobile/tablet estreito: empilha em coluna, rio reto à esquerda ── */
        @media (max-width: 820px) {
          .river-flow {
            height: auto !important;
            padding-left: 28px;
            border-left: 2px solid rgba(104,45,27,0.25);   /* o rio, vertical */
            margin-left: 6px;
          }
          .river-svg { display: none !important; }
          .river-step {
            position: static !important;
            height: auto !important;
            transform: none !important;
            margin-bottom: 44px;
          }
          .river-step:last-child { margin-bottom: 0; }
          .river-bubble {
            position: static !important;
            transform: none !important;
            margin-bottom: 18px;
            margin-left: -64px;   /* puxa a bolha sobre a linha do rio */
          }
          .river-text {
            position: static !important;
            transform: none !important;
            width: auto !important;
            text-align: left !important;
          }
          .river-text > div:last-child { flex-direction: row !important; }
        }
      `}</style>
    </section>
  )
}
