import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const services = [
  {
    num: '01',
    name: 'Diagnóstico Yarden',
    tagline: 'O ponto de partida estratégico.',
    description: 'Diagnóstico essencial de marca com imersão, posicionamento e diretrizes visuais. Tudo que você precisa para começar com método.',
    pricingCategory: 'Entrada',
    planName: 'Diagnóstico Yarden',
    highlight: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        <path d="M11 8v6M8 11h6" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    num: '02',
    name: 'Plano Travessia',
    tagline: 'Estratégia completa em 4 semanas.',
    description: 'Plano estratégico + 30 dias de execução demonstrativa com IA aplicada, captação real e apresentação executiva.',
    pricingCategory: 'Projetos',
    planName: 'Plano Travessia',
    highlight: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/>
        <path d="M17 3l4 3-4 3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    num: '03',
    name: 'Operação Corrente',
    tagline: 'Presença digital gerida com método.',
    description: 'Gestão completa de conteúdo, captação mensal, análise de dados e automações — para profissionais premium que querem constância.',
    pricingCategory: 'Recorrente',
    planName: 'Operação Corrente Light',
    highlight: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" strokeLinecap="round"/>
        <path d="M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    num: '04',
    name: 'Operação Yarden 360',
    tagline: 'A Yarden vira sua inteligência de marca.',
    description: 'Operação total integrada — estratégia, estética, tecnologia e IA como um único organismo. Para marcas premium com ambição real.',
    pricingCategory: 'Recorrente',
    planName: 'Operação Yarden 360',
    highlight: true,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    num: '05',
    name: 'Sprint Inteligência',
    tagline: 'IA e tecnologia na sua operação.',
    description: 'Implementação de ferramentas, automações e dashboards com IA. Diagnóstico técnico, arquitetura e handoff com documentação completa.',
    pricingCategory: 'Projetos',
    planName: 'Sprint Inteligência',
    highlight: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2z"/>
        <circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/>
      </svg>
    ),
  },
  {
    num: '06',
    name: 'Sprint de Captação',
    tagline: '30–40 conteúdos prontos para 90 dias.',
    description: 'Captação intensiva + produção de conteúdo de alto padrão para lançamentos, eventos ou recarga estratégica de estoque criativo.',
    pricingCategory: 'Projetos',
    planName: 'Sprint de Captação',
    highlight: false,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
      </svg>
    ),
  },
]

function goToPricingCard(category, planName) {
  const el = document.getElementById('pricing')
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth' })
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('openPricingPlan', { detail: { category, planName } }))
  }, 500)
}

export default function Services() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section id="services" style={{ background: 'var(--off-white)', padding: '140px 0' }}>
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: '80px' }}
        >
          <p className="section-label" style={{ color: 'var(--burgundy-mid)' }}>
            Nossas Soluções
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '40px', flexWrap: 'wrap' }}>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 300,
              fontSize: 'clamp(36px, 5vw, 68px)',
              lineHeight: 1.05,
              color: 'var(--burgundy)',
              maxWidth: '620px',
            }}>
              Seis produtos.
              <br />
              <em style={{ fontStyle: 'italic' }}>Um método.</em>
            </h2>
            <p style={{
              color: 'rgba(54,15,17,0.6)',
              maxWidth: '380px',
              lineHeight: 1.7,
              fontSize: 'clamp(14px, 1.4vw, 16px)',
              fontWeight: 300,
            }}>
              Da estratégia inicial à operação completa integrada com IA —
              temos o produto certo para o estágio certo da sua marca.
            </p>
          </div>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2px',
        }} className="services-grid">
          {services.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.08 }}
              onClick={() => goToPricingCard(s.pricingCategory, s.planName)}
              style={{
                background: s.highlight ? 'var(--burgundy)' : 'white',
                padding: '52px 44px',
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
              whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(54,15,17,0.12)', transition: { duration: 0.25 } }}
            >
              <div style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                color: s.highlight ? 'rgba(243,235,226,0.35)' : 'rgba(54,15,17,0.25)',
                marginBottom: '28px',
              }}>
                {s.num}
              </div>

              <div style={{
                color: s.highlight ? 'var(--gold-light)' : 'var(--burgundy-mid)',
                marginBottom: '24px',
              }}>
                {s.icon}
              </div>

              <h3 style={{
                fontFamily: 'var(--font-serif)',
                fontWeight: 400,
                fontSize: 'clamp(20px, 2vw, 26px)',
                lineHeight: 1.2,
                color: s.highlight ? 'var(--cream)' : 'var(--burgundy)',
                marginBottom: '10px',
              }}>
                {s.name}
              </h3>

              <p style={{
                color: s.highlight ? 'var(--gold-light)' : 'var(--burgundy-mid)',
                fontSize: '13px',
                fontStyle: 'italic',
                fontFamily: 'var(--font-serif)',
                marginBottom: '20px',
              }}>
                {s.tagline}
              </p>

              <div style={{
                width: '36px',
                height: '1px',
                background: s.highlight ? 'rgba(243,235,226,0.25)' : 'var(--sand)',
                marginBottom: '20px',
              }} />

              <p style={{
                color: s.highlight ? 'rgba(243,235,226,0.65)' : 'rgba(54,15,17,0.62)',
                fontSize: 'clamp(13px, 1.3vw, 15px)',
                lineHeight: 1.7,
                fontWeight: 300,
                flex: 1,
              }}>
                {s.description}
              </p>

              {/* Footer — arrow only, no price */}
              <div style={{
                borderTop: `1px solid ${s.highlight ? 'rgba(243,235,226,0.12)' : 'var(--off-white)'}`,
                paddingTop: '24px',
                marginTop: '32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{
                  color: s.highlight ? 'rgba(243,235,226,0.5)' : 'rgba(54,15,17,0.4)',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}>
                  Ver detalhes
                </span>
                <div style={{
                  width: '36px', height: '36px',
                  border: `1px solid ${s.highlight ? 'rgba(243,235,226,0.25)' : 'var(--sand)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: s.highlight ? 'var(--cream)' : 'var(--burgundy)',
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {s.highlight && (
                <div style={{
                  position: 'absolute',
                  top: '-40px', right: '-40px',
                  width: '160px', height: '160px',
                  background: 'radial-gradient(circle, rgba(184,147,90,0.15) 0%, transparent 70%)',
                  pointerEvents: 'none',
                }} />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          style={{ textAlign: 'center', marginTop: '64px' }}
        >
          <a href="#pricing" className="btn-dark">
            Ver todos os produtos
          </a>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .services-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
