import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'

const WA = '5511953107865'
const waLink = (planName) =>
  `https://wa.me/${WA}?text=${encodeURIComponent(`Olá! Vim pelo site da Yarden Lab e gostaria de saber mais sobre o ${planName}.`)}`

const plans = [
  {
    category: 'Entrada',
    items: [
      {
        name: 'Diagnóstico Yarden',
        badge: 'Ponto de Partida',
        forWho: 'Para marcas que precisam entender onde estão antes de dar o próximo passo — fundadores e profissionais premium que sentem que o posicionamento não traduz o valor real do que entregam.',
        description: 'O diagnóstico essencial de marca. Posicionamento, tom de voz e diretrizes visuais entregues em 1 semana.',
        features: [
          'Imersão 1,5h com founder',
          'Posicionamento e manifesto de marca',
          'Tom de voz e linguagem',
          '3 pilares de comunicação',
          'Diretrizes visuais básicas',
          'Documento estratégico 8–12 páginas',
          'Análise com IA incluída',
        ],
        highlight: false,
        cta: 'Quero meu Diagnóstico',
      },
    ],
  },
  {
    category: 'Projetos',
    items: [
      {
        name: 'Plano Travessia',
        badge: 'Estratégia + Execução',
        forWho: 'Para quem quer estratégia completa de marca com 30 dias de execução real antes de comprometer com o longo prazo. Ideal para negócios em transição de posicionamento.',
        description: 'Estratégia completa + 30 dias de execução demonstrativa. Veja funcionar antes de decidir.',
        features: [
          'Imersão completa + plano de marca',
          'Mapeamento de jornada do cliente',
          'Calendário editorial 30 dias',
          '1 diária de captação',
          '8 conteúdos publicados',
          'Setup de automações com IA',
          'Apresentação executiva gravada',
        ],
        highlight: false,
        cta: 'Iniciar Travessia',
      },
      {
        name: 'Sprint de Captação',
        badge: 'Conteúdo Premium em Volume',
        forWho: 'Para marcas que têm um lançamento, evento ou precisam recarregar o calendário com conteúdo premium de uma vez — sem abrir mão da direção criativa.',
        description: '30–40 conteúdos premium prontos para 90 dias de presença consistente.',
        features: [
          'Briefing estratégico 1,5h',
          '1 diária extendida ou 2 meias-diárias',
          '30–40 conteúdos editados',
          'Mix: posts, reels e stories',
          'Calendário de uso 90 dias',
          'Legendas com IA + curadoria editorial',
        ],
        highlight: false,
        cta: 'Iniciar Sprint de Captação',
      },
      {
        name: 'Sprint Inteligência',
        badge: 'Tecnologia & IA Aplicada',
        forWho: 'Para empresas que precisam implementar inteligência artificial e tecnologia na operação de marca e vendas — sem depender de TI interno ou agências genéricas.',
        description: 'IA e tecnologia implementadas na sua operação. Diagnóstico técnico, arquitetura, build e handoff.',
        features: [
          'Diagnóstico tech completo',
          'Arquitetura de solução customizada',
          'Implementação de ferramentas e IA',
          'Integrações com sistemas internos',
          'Treinamento da equipe',
          'Documentação técnica completa',
          '30 dias de suporte pós-entrega',
        ],
        highlight: false,
        cta: 'Iniciar Sprint Inteligência',
      },
    ],
  },
  {
    category: 'Recorrente',
    items: [
      {
        name: 'Operação Corrente Light',
        badge: 'Presença Premium',
        forWho: 'Para profissionais e negócios premium que precisam de presença digital consistente e com direção criativa — sem gestão de tráfego pago.',
        description: 'Gestão completa de presença digital com direção criativa Yarden, mês a mês.',
        features: [
          '8 posts/mês + 8 reels editados',
          'Stories sob direção Yarden',
          '1 captação meia-diária/mês',
          'Calendário editorial mensal',
          '1 reunião mensal de alinhamento',
          'Dashboard de análise com IA',
          'Auto-resposta inteligente de DM',
        ],
        highlight: false,
        cta: 'Ativar Operação Corrente Light',
      },
      {
        name: 'Operação Corrente Standard',
        badge: 'Performance + Presença',
        forWho: 'Para marcas que querem presença premium aliada a tráfego pago integrado — resultado consistente de vendas com a estética que o negócio merece.',
        description: 'Gestão completa de presença digital + tráfego pago sob a mesma direção estratégica.',
        features: [
          'Tudo do plano Light',
          'Gestão de tráfego pago integrada',
          'Análise de dados trimestral aprofundada',
          'Relatório de performance mensal',
        ],
        highlight: false,
        cta: 'Ativar Operação Standard',
      },
      {
        name: 'Operação Yarden 360',
        badge: 'Inteligência Total de Marca',
        forWho: 'Para marcas premium com ambição real — que querem a Yarden Lab como a inteligência de marca da empresa. Para quem entende que crescimento consistente exige método, não sorte.',
        description: 'A Yarden Lab vira a inteligência de marca da sua empresa. Estratégia, estética, performance e IA sob um único organismo.',
        features: [
          '12 posts + 8 reels/mês com direção criativa',
          'Captação completa mensal',
          'Gestão de tráfego pago integrada',
          'Dashboard de marca custom',
          'Análise mensal profunda com IA',
          'Inteligência de mercado em tempo real',
          'Reunião quinzenal + relatório executivo',
          'Onboarding Plano Travessia incluído',
        ],
        highlight: true,
        cta: 'Falar sobre Yarden 360',
      },
    ],
  },
]

export default function Pricing() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [expandedCategory, setExpandedCategory] = useState('Recorrente')
  const [highlightedPlan, setHighlightedPlan] = useState(null)

  useEffect(() => {
    const handler = (e) => {
      const { category, planName } = e.detail
      setExpandedCategory(category)
      setHighlightedPlan(planName)
      setTimeout(() => {
        const slug = planName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
        const el = document.getElementById(`plan-${slug}`)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        setTimeout(() => setHighlightedPlan(null), 2500)
      }, 420)
    }
    window.addEventListener('openPricingPlan', handler)
    return () => window.removeEventListener('openPricingPlan', handler)
  }, [])

  return (
    <section id="pricing" style={{ background: 'var(--dusk)', padding: '140px 0' }}>
      <div className="container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '40px' }}
        >
          <div>
            <p className="section-label" style={{ color: 'var(--sienna)' }}>
              Soluções
            </p>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 300,
              fontSize: 'clamp(36px, 5vw, 68px)',
              lineHeight: 1.05,
              color: 'var(--espresso)',
            }}>
              O produto certo
              <br />
              <em style={{ fontStyle: 'normal' }}>para cada momento.</em>
            </h2>
          </div>
          <p style={{
            color: 'rgba(54,15,17,0.6)',
            maxWidth: '380px',
            lineHeight: 1.7,
            fontSize: 'clamp(14px, 1.4vw, 16px)',
            fontWeight: 300,
          }}>
            Cada produto foi desenhado para um momento específico da sua marca.
            Escolha o ponto de entrada certo e evolua no ritmo do seu crescimento.
          </p>
        </motion.div>

        {plans.map((category, ci) => (
          <motion.div
            key={category.category}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: ci * 0.15 }}
            style={{ marginBottom: '40px' }}
          >
            <button
              onClick={() => setExpandedCategory(expandedCategory === category.category ? '' : category.category)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '24px 32px',
                background: 'var(--cream)',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '2px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span style={{ color: 'rgba(54,15,17,0.35)', fontSize: '10px', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
                  {String(ci + 1).padStart(2, '0')}
                </span>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 400, color: 'var(--espresso)' }}>
                  {category.category}
                </span>
                <span style={{ background: 'var(--dusk)', color: 'rgba(54,15,17,0.5)', fontSize: '10px', padding: '4px 10px', letterSpacing: '0.1em' }}>
                  {category.items.length} {category.items.length === 1 ? 'produto' : 'produtos'}
                </span>
              </div>
              <div style={{
                color: 'var(--espresso)',
                transform: expandedCategory === category.category ? 'rotate(45deg)' : 'rotate(0)',
                transition: 'transform 0.3s ease',
                fontSize: '22px',
                lineHeight: 1,
              }}>
                +
              </div>
            </button>

            {expandedCategory === category.category && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(category.items.length, 3)}, 1fr)`,
                gap: '2px',
              }} className="pricing-cards">
                {category.items.map((plan, pi) => (
                  <motion.div
                    key={plan.name}
                    id={`plan-${plan.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: pi * 0.08 }}
                    style={{
                      background: plan.highlight ? 'var(--espresso)' : 'var(--cream)',
                      padding: '44px 36px',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: highlightedPlan === plan.name ? '0 0 0 2px var(--cream), 0 0 24px rgba(243, 235, 226,0.25)' : 'none',
                      transition: 'box-shadow 0.6s ease',
                    }}
                  >
                    <div style={{ display: 'inline-flex', alignItems: 'center', marginBottom: '20px' }}>
                      <span style={{
                        background: plan.highlight ? 'var(--cream)' : 'var(--dusk)',
                        color: plan.highlight ? '#fff' : 'rgba(54,15,17,0.6)',
                        fontSize: '9px',
                        fontWeight: 700,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        padding: '5px 12px',
                      }}>
                        {plan.badge}
                      </span>
                    </div>

                    <h3 style={{
                      fontFamily: 'var(--font-serif)',
                      fontWeight: 400,
                      fontSize: 'clamp(20px, 2vw, 26px)',
                      color: plan.highlight ? 'var(--cream)' : 'var(--espresso)',
                      marginBottom: '16px',
                    }}>
                      {plan.name}
                    </h3>

                    <div style={{
                      borderLeft: `2px solid ${plan.highlight ? 'rgba(243, 235, 226,0.5)' : 'var(--cream)'}`,
                      paddingLeft: '16px',
                      marginBottom: '24px',
                    }}>
                      <p style={{
                        color: plan.highlight ? 'rgba(243,235,226,0.65)' : 'rgba(54,15,17,0.65)',
                        fontSize: '13px',
                        lineHeight: 1.65,
                        fontStyle: 'normal',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: 300,
                      }}>
                        {plan.forWho}
                      </p>
                    </div>

                    <p style={{
                      color: plan.highlight ? 'rgba(243,235,226,0.5)' : 'rgba(54,15,17,0.5)',
                      fontSize: '13px',
                      lineHeight: 1.6,
                      marginBottom: '28px',
                      fontWeight: 300,
                    }}>
                      {plan.description}
                    </p>

                    <div style={{
                      borderTop: `1px solid ${plan.highlight ? 'rgba(243,235,226,0.12)' : 'var(--dusk)'}`,
                      paddingTop: '20px',
                      marginBottom: '28px',
                      flex: 1,
                    }}>
                      <ul style={{ listStyle: 'none' }}>
                        {plan.features.map(f => (
                          <li key={f} style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '10px',
                            marginBottom: '10px',
                            color: plan.highlight ? 'rgba(243,235,226,0.7)' : 'rgba(54,15,17,0.65)',
                            fontSize: '13px',
                            lineHeight: 1.5,
                          }}>
                            <span style={{ color: plan.highlight ? 'var(--cream)' : 'var(--cream)', marginTop: '3px', flexShrink: 0 }}>✓</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* WhatsApp CTA */}
                    <a
                      href={waLink(plan.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '14px 24px',
                        background: plan.highlight ? 'var(--cream)' : 'var(--espresso)',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        textDecoration: 'none',
                        transition: 'background 0.3s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = plan.highlight ? 'var(--cream)' : 'var(--sienna)'}
                      onMouseLeave={e => e.currentTarget.style.background = plan.highlight ? 'var(--cream)' : 'var(--espresso)'}
                    >
                      {/* WhatsApp minimal icon */}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                      {plan.cta}
                    </a>

                    {plan.highlight && (
                      <div style={{
                        position: 'absolute',
                        bottom: '-60px', right: '-60px',
                        width: '200px', height: '200px',
                        background: 'radial-gradient(circle, rgba(243, 235, 226,0.12) 0%, transparent 70%)',
                        pointerEvents: 'none',
                      }} />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ))}

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          style={{
            textAlign: 'center',
            color: 'rgba(54,15,17,0.45)',
            fontSize: '13px',
            marginTop: '40px',
            fontStyle: 'normal',
            fontFamily: 'var(--font-serif)',
          }}
        >
          Não sabe por onde começar? Agende uma conversa — identificamos o produto certo para o seu momento.
        </motion.p>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .pricing-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
