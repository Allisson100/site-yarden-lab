import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const WA = '5511953107865'
const waLink = (name) =>
  `https://wa.me/${WA}?text=${encodeURIComponent(`Olá! Vim pelo site da Yarden Lab e gostaria de saber mais sobre o ${name}.`)}`

/* ── Planos — Yarden 360 primeiro ─────────────────────────────────── */
const PLANS = [
  /* 00 – DESTAQUE (largura total, topo) */
  {
    num: '07', name: 'Operação Yarden 360',
    badge: 'Inteligência Total de Marca', tagline: 'A Yarden vira sua inteligência de marca.',
    forWho: 'Para marcas premium com ambição real — que querem a Yarden Lab como a inteligência de marca da empresa. Para quem entende que crescimento consistente exige método, não sorte.',
    description: 'A Yarden Lab vira a inteligência de marca da sua empresa. Estratégia, estética, performance e IA sob um único organismo.',
    features: ['12 posts + 8 reels/mês com direção criativa','Captação completa mensal','Gestão de tráfego pago integrada','Dashboard de marca custom','Análise mensal profunda com IA','Inteligência de mercado em tempo real','Reunião quinzenal + relatório executivo','Onboarding Plano Travessia incluído'],
    highlight: true, cta: 'Falar sobre Yarden 360', featured: true,
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  },
  /* 01-06 — grade 3 colunas */
  {
    num: '01', name: 'Diagnóstico Yarden',
    badge: 'Ponto de Partida', tagline: 'O ponto de partida estratégico.',
    forWho: 'Para marcas que precisam entender onde estão antes de dar o próximo passo — fundadores e profissionais premium que sentem que o posicionamento não traduz o valor real do que entregam.',
    description: 'O diagnóstico essencial de marca. Posicionamento, tom de voz e diretrizes visuais entregues em 1 semana.',
    features: ['Imersão 1,5h com founder','Posicionamento e manifesto de marca','Tom de voz e linguagem','3 pilares de comunicação','Diretrizes visuais básicas','Documento estratégico 8–12 páginas','Análise com IA incluída'],
    highlight: false, cta: 'Quero meu Diagnóstico', featured: false,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M11 8v6M8 11h6" strokeLinecap="round"/></svg>,
  },
  {
    num: '02', name: 'Plano Travessia',
    badge: 'Estratégia + Execução', tagline: 'Estratégia completa em 4 semanas.',
    forWho: 'Para quem quer estratégia completa de marca com 30 dias de execução real antes de comprometer com o longo prazo. Ideal para negócios em transição de posicionamento.',
    description: 'Estratégia completa + 30 dias de execução demonstrativa. Veja funcionar antes de decidir.',
    features: ['Imersão completa + plano de marca','Mapeamento de jornada do cliente','Calendário editorial 30 dias','1 diária de captação','8 conteúdos publicados','Setup de automações com IA','Apresentação executiva gravada'],
    highlight: false, cta: 'Iniciar Travessia', featured: false,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/><path d="M17 3l4 3-4 3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    num: '03', name: 'Sprint de Captação',
    badge: 'Conteúdo Premium em Volume', tagline: '30–40 conteúdos prontos para 90 dias.',
    forWho: 'Para marcas que têm um lançamento, evento ou precisam recarregar o calendário com conteúdo premium de uma vez — sem abrir mão da direção criativa.',
    description: '30–40 conteúdos premium prontos para 90 dias de presença consistente.',
    features: ['Briefing estratégico 1,5h','1 diária extendida ou 2 meias-diárias','30–40 conteúdos editados','Mix: posts, reels e stories','Calendário de uso 90 dias','Legendas com IA + curadoria editorial'],
    highlight: false, cta: 'Iniciar Sprint de Captação', featured: false,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  },
  {
    num: '04', name: 'Sprint Inteligência',
    badge: 'Tecnologia & IA Aplicada', tagline: 'IA e tecnologia na sua operação.',
    forWho: 'Para empresas que precisam implementar inteligência artificial e tecnologia na operação de marca e vendas — sem depender de TI interno ou agências genéricas.',
    description: 'IA e tecnologia implementadas na sua operação. Diagnóstico técnico, arquitetura, build e handoff.',
    features: ['Diagnóstico tech completo','Arquitetura de solução customizada','Implementação de ferramentas e IA','Integrações com sistemas internos','Treinamento da equipe','Documentação técnica completa','30 dias de suporte pós-entrega'],
    highlight: false, cta: 'Iniciar Sprint Inteligência', featured: false,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2z"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/></svg>,
  },
  {
    num: '05', name: 'Operação Corrente Light',
    badge: 'Presença Premium', tagline: 'Presença digital gerida com método.',
    forWho: 'Para profissionais e negócios premium que precisam de presença digital consistente e com direção criativa — sem gestão de tráfego pago.',
    description: 'Gestão completa de presença digital com direção criativa Yarden, mês a mês.',
    features: ['8 posts/mês + 8 reels editados','Stories sob direção Yarden','1 captação meia-diária/mês','Calendário editorial mensal','1 reunião mensal de alinhamento','Dashboard de análise com IA','Auto-resposta inteligente de DM'],
    highlight: false, cta: 'Ativar Operação Corrente Light', featured: false,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" strokeLinecap="round"/><path d="M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  {
    num: '06', name: 'Operação Corrente Standard',
    badge: 'Performance + Presença', tagline: 'Presença premium aliada a tráfego pago.',
    forWho: 'Para marcas que querem presença premium aliada a tráfego pago integrado — resultado consistente de vendas com a estética que o negócio merece.',
    description: 'Gestão completa de presença digital + tráfego pago sob a mesma direção estratégica.',
    features: ['Tudo do plano Corrente Light','Gestão de tráfego pago integrada','Análise de dados trimestral aprofundada','Relatório de performance mensal'],
    highlight: false, cta: 'Ativar Operação Standard', featured: false,
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  },
]

/* ── Card de plano (sempre aberto) ──────────────────────────────────── */
function PlanCard({ plan, index, inView, isHighlighted }) {
  const hl    = plan.highlight
  const gold  = 'var(--gold)'
  const goldL = 'var(--gold-light)'

  return (
    <motion.div
      id={`plan-${plan.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: Math.min(index * 0.07, 0.5) }}
      style={{
        background: hl ? 'var(--burgundy)' : '#ffffff',
        padding: plan.featured ? '52px 60px' : '40px 36px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: plan.featured ? 'column' : 'column',
        boxShadow: isHighlighted
          ? '0 0 0 2px var(--gold), 0 8px 40px rgba(184,147,90,0.22)'
          : 'none',
        transition: 'box-shadow 0.6s ease',
        ...(plan.featured ? { gridColumn: '1 / -1' } : {}),
      }}
    >
      {/* Número */}
      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.24em', color: hl ? 'rgba(243,235,226,0.2)' : 'rgba(54,15,17,0.18)', marginBottom: '18px' }}>
        {plan.num}
      </div>

      {/* Ícone + badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
        <div style={{ color: hl ? goldL : 'var(--burgundy-mid)', flexShrink: 0 }}>{plan.icon}</div>
        <span style={{
          background: hl ? gold : 'var(--off-white)',
          color: hl ? '#fff' : 'rgba(54,15,17,0.5)',
          fontSize: '8px', fontWeight: 700, letterSpacing: '0.2em',
          textTransform: 'uppercase', padding: '4px 10px',
        }}>
          {plan.badge}
        </span>
      </div>

      {/* Nome + tagline */}
      <h3 style={{
        fontFamily: 'var(--font-serif)', fontWeight: 400,
        fontSize: plan.featured ? 'clamp(22px,2.8vw,36px)' : 'clamp(18px,1.8vw,24px)',
        color: hl ? 'var(--cream)' : 'var(--burgundy)',
        lineHeight: 1.15, marginBottom: '8px',
      }}>
        {plan.name}
      </h3>
      <p style={{ color: hl ? goldL : 'var(--burgundy-mid)', fontSize: '13px', fontStyle: 'italic', fontFamily: 'var(--font-serif)', marginBottom: '28px', lineHeight: 1.4 }}>
        {plan.tagline}
      </p>

      {/* Divisória dourada */}
      <div style={{ height: 1, background: hl ? 'rgba(184,147,90,0.35)' : 'rgba(54,15,17,0.08)', marginBottom: '28px' }} />

      {/* Layout interno: 2 cols no featured, 1 col nos demais */}
      <div className="plan-inner" style={{
        display: 'grid',
        gridTemplateColumns: plan.featured ? '1fr 1fr' : '1fr',
        gap: plan.featured ? '60px' : '24px',
        alignItems: 'stretch',
        flex: 1,
      }}>
        {/* Esquerda: para quem + descrição */}
        <div>
          <div style={{ borderLeft: `2px solid ${hl ? 'rgba(184,147,90,0.5)' : gold}`, paddingLeft: '16px', marginBottom: '18px' }}>
            <p style={{ color: hl ? 'rgba(243,235,226,0.6)' : 'rgba(54,15,17,0.58)', fontSize: '13px', lineHeight: 1.8, fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontWeight: 300 }}>
              {plan.forWho}
            </p>
          </div>
          <p style={{ color: hl ? 'rgba(243,235,226,0.42)' : 'rgba(54,15,17,0.45)', fontSize: '13px', lineHeight: 1.75, fontWeight: 300 }}>
            {plan.description}
          </p>
        </div>

        {/* Direita: features + CTA */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.26em', textTransform: 'uppercase', color: gold, marginBottom: '14px' }}>
            O que está incluído
          </p>
          <ul style={{ listStyle: 'none', flex: 1 }}>
            {plan.features.map(f => (
              <li key={f} style={{ display: 'flex', gap: '10px', marginBottom: '9px', color: hl ? 'rgba(243,235,226,0.7)' : 'rgba(54,15,17,0.65)', fontSize: '13px', lineHeight: 1.5 }}>
                <span style={{ color: hl ? goldL : gold, flexShrink: 0, marginTop: '2px' }}>✓</span>
                {f}
              </li>
            ))}
          </ul>

          <a
            href={waLink(plan.name)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              padding: '14px 28px',
              marginTop: '28px',
              background: hl ? gold : 'var(--burgundy)',
              color: '#fff', fontSize: '11px', fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              textDecoration: 'none', transition: 'background 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = hl ? 'var(--gold-light)' : 'var(--burgundy-mid)'}
            onMouseLeave={e => e.currentTarget.style.background = hl ? gold : 'var(--burgundy)'}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            {plan.cta}
          </a>
        </div>
      </div>

      {/* Brilho 360 */}
      {hl && (
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '240px', height: '240px',
          background: 'radial-gradient(circle, rgba(184,147,90,0.13) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
      )}
    </motion.div>
  )
}

/* ── Seção ──────────────────────────────────────────────────────────── */
export default function PlansSection() {
  const ref                             = useRef(null)
  const inView                          = useInView(ref, { once: true, margin: '-60px' })
  const [highlightedPlan, setHighlightedPlan] = useState(null)

  /* Deeplink da IA: rola até o plano e o destaca */
  useEffect(() => {
    const handler = (e) => {
      const { planName } = e.detail
      document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => {
        setHighlightedPlan(planName)
        const slug = planName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
        document.getElementById(`plan-${slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => setHighlightedPlan(null), 2500)
      }, 600)
    }
    window.addEventListener('openPricingPlan', handler)
    return () => window.removeEventListener('openPricingPlan', handler)
  }, [])

  const featuredPlan = PLANS[0]          // Yarden 360
  const gridPlans    = PLANS.slice(1)    // 6 planos restantes

  return (
    <section id="plans" style={{ background: 'var(--off-white)', padding: '140px 0 100px' }}>
      <div className="container" ref={ref}>

        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 }}
          style={{ marginBottom: '72px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '40px' }}
        >
          <div>
            <p className="section-label" style={{ color: 'var(--burgundy-mid)' }}>Nossas Soluções</p>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontWeight: 300, fontSize: 'clamp(34px,5vw,66px)', lineHeight: 1.05, color: 'var(--burgundy)' }}>
              Seis produtos.<br />
              <em style={{ fontStyle: 'italic' }}>Um método.</em>
            </h2>
          </div>
          <p style={{ color: 'rgba(54,15,17,0.55)', maxWidth: '340px', lineHeight: 1.8, fontSize: 'clamp(14px,1.3vw,15px)', fontWeight: 300 }}>
            Da estratégia inicial à operação completa integrada com IA — o produto certo para o estágio certo da sua marca.
          </p>
        </motion.div>

        {/* ── Grade de planos ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }} className="plans-grid">

          {/* Yarden 360 — topo, largura total */}
          <PlanCard
            plan={featuredPlan}
            index={0}
            inView={inView}
            isHighlighted={highlightedPlan === featuredPlan.name}
          />

          {/* 6 planos em grade */}
          {gridPlans.map((plan, i) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              index={i + 1}
              inView={inView}
              isHighlighted={highlightedPlan === plan.name}
            />
          ))}
        </div>

        {/* Rodapé */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 }}
          style={{ textAlign: 'center', color: 'rgba(54,15,17,0.35)', fontSize: '13px', marginTop: '52px', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}
        >
          Não sabe por onde começar? Agende uma conversa — identificamos o produto certo para o seu momento.
        </motion.p>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .plans-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .plans-grid { grid-template-columns: 1fr !important; }
          .plan-inner { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </section>
  )
}
