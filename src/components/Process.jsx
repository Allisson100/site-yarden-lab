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

export default function Process() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="method" style={{ background: 'var(--cream)', padding: '140px 0', overflow: 'hidden' }}>
      <div className="container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: '80px' }}
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
        </motion.div>

        {/* Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0', position: 'relative' }} className="process-grid">
          {/* Connecting line */}
          <div style={{
            position: 'absolute',
            top: '36px',
            left: '10%', right: '10%',
            height: '1px',
            background: 'linear-gradient(to right, transparent, var(--dusk) 20%, var(--dusk) 80%, transparent)',
            zIndex: 0,
          }} className="process-line" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              style={{ padding: '0 32px 0 0', position: 'relative', zIndex: 1 }}
            >
              {/* Step number bubble */}
              <div style={{
                width: '72px', height: '72px',
                border: '1px solid var(--dusk)',
                background: 'var(--cream)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '36px',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  inset: '6px',
                  background: i === 0 ? 'var(--espresso)' : 'transparent',
                  transition: 'background 0.3s',
                }} />
                <span style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '22px',
                  color: i === 0 ? 'var(--cream)' : 'var(--espresso)',
                  position: 'relative',
                  zIndex: 1,
                  fontWeight: 300,
                }}>
                  {step.num}
                </span>
              </div>

              <div style={{
                fontSize: '10px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--cream)',
                marginBottom: '10px',
                fontWeight: 600,
              }}>
                {step.subtitle}
              </div>

              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 400,
                fontSize: 'clamp(22px, 2.5vw, 30px)',
                color: 'var(--espresso)',
                marginBottom: '16px',
              }}>
                {step.title}
              </h3>

              <p style={{
                color: 'rgba(54,15,17,0.6)',
                fontSize: 'clamp(13px, 1.3vw, 15px)',
                lineHeight: 1.7,
                marginBottom: '20px',
                fontWeight: 300,
              }}>
                {step.desc}
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(54,15,17,0.4)',
                fontSize: '11px',
                letterSpacing: '0.1em',
              }}>
                <span style={{ width: '16px', height: '1px', background: 'currentColor', display: 'inline-block' }} />
                {step.duration}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .process-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 48px !important; }
          .process-line { display: none; }
        }
        @media (max-width: 540px) {
          .process-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
