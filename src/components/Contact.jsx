import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

// To enable real email delivery:
// 1. Sign up free at formspree.io
// 2. Create a form and copy the form ID (e.g. "xrgzkvby")
// 3. Create .env.local in the project root with: VITE_FORMSPREE_ID=xrgzkvby
const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID || ''

const WA_NUMBER = '5511953107865'

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  )
}

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', service: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => {
    setError('')
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!FORMSPREE_ID) {
      const subject = `Contato via Site — ${form.service || 'Geral'}`
      const body = [
        `Nome: ${form.name}`,
        `Empresa: ${form.company}`,
        `E-mail: ${form.email}`,
        `Telefone: ${form.phone}`,
        `Serviço de interesse: ${form.service}`,
        '',
        form.message,
      ].join('\n')
      window.open(
        `mailto:contato@yardenlab.com.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      )
      setSent(true)
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSent(true)
      } else {
        setError('Não foi possível enviar. Tente pelo WhatsApp.')
      }
    } catch {
      setError('Não foi possível enviar. Tente pelo WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(243,235,226,0.06)',
    border: '1px solid rgba(243,235,226,0.14)',
    color: 'var(--cream)',
    padding: '16px 20px',
    fontSize: '14px',
    fontFamily: 'var(--font-sans)',
    fontWeight: 300,
    outline: 'none',
    transition: 'border-color 0.3s',
    borderRadius: 0,
    appearance: 'none',
  }

  const contacts = [
    {
      label: 'E-mail',
      value: 'contato@yardenlab.com.br',
      href: 'mailto:contato@yardenlab.com.br',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      ),
    },
    {
      label: 'WhatsApp',
      value: '+55 11 95310-7865',
      href: `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Olá, vim pelo site da Yarden Lab e gostaria de conversar.')}`,
      icon: <WhatsAppIcon />,
    },
    {
      label: 'Instagram',
      value: '@yardenlab_',
      href: 'https://instagram.com/yardenlab_',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      value: 'Yarden Lab',
      href: 'https://www.linkedin.com/in/yarden-lab-10a17a410/',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
  ]

  return (
    <section id="contact" style={{
      background: 'var(--burgundy)',
      padding: '140px 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `url("https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&auto=format&fit=crop&q=60")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.06,
      }} />

      <div className="container" ref={ref} style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.2fr',
          gap: '100px',
          alignItems: 'start',
        }} className="contact-grid">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9 }}
          >
            <p className="section-label" style={{ color: 'var(--gold)' }}>
              Contato
            </p>
            <h2 style={{
              fontFamily: 'var(--font-serif)',
              fontWeight: 300,
              fontSize: 'clamp(36px, 5vw, 68px)',
              lineHeight: 1.05,
              color: 'var(--cream)',
              marginBottom: '32px',
            }}>
              Vamos construir
              <br />
              <em style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>juntos.</em>
            </h2>

            <p style={{
              color: 'rgba(243,235,226,0.6)',
              fontSize: 'clamp(14px, 1.4vw, 17px)',
              lineHeight: 1.7,
              marginBottom: '56px',
              fontWeight: 300,
            }}>
              Se sua marca está pronta para crescer com método, inteligência e estética —
              a Yarden Lab é o parceiro certo. Conte-nos sobre o seu momento e vamos juntos encontrar o caminho ideal.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {contacts.map(({ label, value, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target={label !== 'E-mail' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  <div style={{
                    width: '44px', height: '44px',
                    border: '1px solid rgba(243,235,226,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--gold)',
                    flexShrink: 0,
                    transition: 'border-color 0.2s, background 0.2s',
                  }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ color: 'rgba(243,235,226,0.35)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {label}
                    </div>
                    <div style={{ color: 'var(--cream)', fontSize: '15px', fontWeight: 300 }}>
                      {value}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15 }}
            style={{
              background: 'rgba(12,3,5,0.5)',
              border: '1px solid rgba(243,235,226,0.08)',
              padding: '52px 44px',
              backdropFilter: 'blur(10px)',
            }}
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center', padding: '40px 0' }}
                >
                  <div style={{
                    width: '64px', height: '64px',
                    border: '1px solid var(--gold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 28px',
                    color: 'var(--gold)',
                    fontSize: '24px',
                  }}>
                    ✓
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '32px',
                    color: 'var(--cream)',
                    marginBottom: '16px',
                    fontWeight: 300,
                    fontStyle: 'italic',
                  }}>
                    Mensagem enviada.
                  </h3>
                  <p style={{ color: 'rgba(243,235,226,0.55)', lineHeight: 1.7, fontWeight: 300 }}>
                    Nossa equipe entrará em contato em até 24 horas úteis para agendar uma conversa.
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleSubmit}>
                  <p style={{
                    color: 'var(--gold)',
                    fontSize: '10px',
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    fontWeight: 600,
                    marginBottom: '32px',
                  }}>
                    Iniciar Conversa
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginBottom: '2px' }}>
                    <input
                      name="name"
                      placeholder="Nome completo"
                      required
                      value={form.name}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(243,235,226,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(243,235,226,0.14)'}
                    />
                    <input
                      name="company"
                      placeholder="Empresa / Marca"
                      value={form.company}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(243,235,226,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(243,235,226,0.14)'}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginBottom: '2px' }}>
                    <input
                      name="email"
                      type="email"
                      placeholder="E-mail"
                      required
                      value={form.email}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(243,235,226,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(243,235,226,0.14)'}
                    />
                    <input
                      name="phone"
                      placeholder="Telefone / WhatsApp"
                      value={form.phone}
                      onChange={handleChange}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'rgba(243,235,226,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(243,235,226,0.14)'}
                    />
                  </div>

                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    style={{ ...inputStyle, marginBottom: '2px', cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(243,235,226,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(243,235,226,0.14)'}
                  >
                    <option value="" style={{ background: '#1c0608' }}>Produto de interesse</option>
                    <option value="diagnostico" style={{ background: '#1c0608' }}>Diagnóstico Yarden</option>
                    <option value="travessia" style={{ background: '#1c0608' }}>Plano Travessia</option>
                    <option value="corrente-light" style={{ background: '#1c0608' }}>Operação Corrente Light</option>
                    <option value="corrente-standard" style={{ background: '#1c0608' }}>Operação Corrente Standard</option>
                    <option value="360" style={{ background: '#1c0608' }}>Operação Yarden 360</option>
                    <option value="inteligencia" style={{ background: '#1c0608' }}>Sprint Inteligência</option>
                    <option value="captacao" style={{ background: '#1c0608' }}>Sprint de Captação</option>
                    <option value="outro" style={{ background: '#1c0608' }}>Ainda não sei, quero conversar</option>
                  </select>

                  <textarea
                    name="message"
                    placeholder="Conte sobre sua marca e o momento atual..."
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    style={{ ...inputStyle, resize: 'vertical', marginBottom: '2px' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(243,235,226,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(243,235,226,0.14)'}
                  />

                  {error && (
                    <p style={{
                      color: 'rgba(243,100,80,0.85)',
                      fontSize: '12px',
                      marginBottom: '12px',
                      textAlign: 'center',
                    }}>
                      {error}{' '}
                      <a
                        href={`https://wa.me/${WA_NUMBER}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--gold-light)', textDecoration: 'underline' }}
                      >
                        Falar pelo WhatsApp
                      </a>
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: '2px', opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? 'Enviando...' : 'Enviar Mensagem'}
                    {!loading && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>

                  <p style={{
                    color: 'rgba(243,235,226,0.25)',
                    fontSize: '11px',
                    textAlign: 'center',
                    marginTop: '16px',
                    lineHeight: 1.5,
                  }}>
                    Resposta em até 24 horas úteis. Sem compromisso.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 60px !important; }
        }
        input::placeholder, textarea::placeholder {
          color: rgba(243,235,226,0.3);
        }
        select option { background: #1c0608; color: #f3ebe2; }
      `}</style>
    </section>
  )
}
