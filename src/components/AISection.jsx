import { useRef, useState, useCallback } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const PLAN_CATEGORIES = {
  'Diagnóstico Yarden':        'Entrada',
  'Plano Travessia':           'Projetos',
  'Sprint de Captação':        'Projetos',
  'Sprint Inteligência':       'Projetos',
  'Operação Corrente Light':   'Recorrente',
  'Operação Corrente Standard':'Recorrente',
  'Operação Yarden 360':       'Recorrente',
}

// ─── Left panel: clean oversized brand symbol only ───────────────────────────
function BrandSymbolPanel({ phase }) {
  const isActive = phase === 'loading' || phase === 'streaming'
  const isDone   = phase === 'done'

  return (
    <div style={{
      height: '100%',
      background: 'transparent',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Symbol — oversized, bleeds in all directions */}
      <motion.div
        animate={isActive
          ? { scale: [1, 1.05, 1], opacity: [0.5, 0.92, 0.5] }
          : { scale: 1, opacity: isDone ? 1 : 0.6 }
        }
        transition={{
          scale:   { duration: 5.5, repeat: isActive ? Infinity : 0, ease: 'easeInOut' },
          opacity: { duration: 5.5, repeat: isActive ? Infinity : 0, ease: 'easeInOut' },
        }}
        style={{
          position: 'absolute',
          inset: '-42%',
          pointerEvents: 'none',
        }}
      >
        {/* Wrapper de rotação — gira enquanto analisa (só desktop, painel já oculto no mobile) */}
        <motion.div
          animate={isActive ? { rotate: 360 } : { rotate: 0 }}
          transition={isActive
            ? { duration: 14, repeat: Infinity, ease: 'linear' }
            : { duration: 1.2, ease: 'easeOut' }
          }
          style={{ width: '100%', height: '100%' }}
        >
          <img
            src="/logos/yarden-symbol.svg"
            alt=""
            style={{
              width: '100%', height: '100%', objectFit: 'contain',
              opacity: isActive ? 0.28 : isDone ? 0.32 : 0.14,
              filter: 'grayscale(20%)',
              transition: 'opacity 0.8s ease',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Subtle gold glow that pulses during analysis */}
      <motion.div
        animate={isActive
          ? { opacity: [0.04, 0.14, 0.04] }
          : { opacity: isDone ? 0.1 : 0.02 }
        }
        transition={{ duration: 4, repeat: isActive ? Infinity : 0, ease: 'easeInOut' }}
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at center, rgba(184,147,90,0.18) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

// ─── Streaming text renderer with section formatting ──────────────────────────
function StreamText({ text, streaming }) {
  const lines = text.split('\n')

  return (
    <div>
      {lines.map((line, i) => {
        const headerMatch = line.trim().match(/^---\s*(.+?)\s*---$/)
        if (headerMatch) {
          return (
            <div key={i} style={{
              color: 'var(--gold)',
              fontSize: '9px', letterSpacing: '0.22em',
              textTransform: 'uppercase', fontWeight: 700,
              marginTop: i === 0 ? 0 : '22px', marginBottom: '10px',
              paddingBottom: '8px',
              borderBottom: '1px solid rgba(184,147,90,0.15)',
            }}>
              {headerMatch[1]}
            </div>
          )
        }
        if (/^[•\-]\s/.test(line.trim())) {
          return (
            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '7px', color: 'rgba(243,235,226,0.75)' }}>
              <span style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '2px' }}>—</span>
              <span style={{ fontSize: '13px', lineHeight: 1.75, fontWeight: 300 }}>
                {line.trim().replace(/^[•\-]\s*/, '')}
              </span>
            </div>
          )
        }
        if (!line.trim()) return <div key={i} style={{ height: '8px' }} />

        const isLast = i === lines.length - 1
        return (
          <div key={i} style={{ color: 'rgba(243,235,226,0.72)', fontSize: '13px', lineHeight: 1.78, fontWeight: 300, marginBottom: '2px' }}>
            {line}
            {streaming && isLast && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.85, repeat: Infinity }}
                style={{ display: 'inline-block', width: 2, height: '13px', background: 'var(--gold)', verticalAlign: 'text-bottom', marginLeft: 2 }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Shared field label wrapper ───────────────────────────────────────────────
function Field({ label, optional, children }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <label style={{ color: 'rgba(243,235,226,0.45)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
          {label}
        </label>
        {optional && <span style={{ color: 'rgba(243,235,226,0.2)', fontSize: '9px', letterSpacing: '0.06em' }}>opcional</span>}
      </div>
      {children}
    </div>
  )
}

const baseInput = {
  width: '100%', boxSizing: 'border-box',
  background: 'rgba(243,235,226,0.03)',
  border: '1px solid rgba(243,235,226,0.09)',
  color: 'var(--cream)', padding: '10px 13px',
  fontSize: '13px', fontFamily: 'inherit', fontWeight: 300,
  outline: 'none', resize: 'none',
  transition: 'border-color 0.2s',
}

const focusHandlers = {
  onFocus: e => (e.target.style.borderColor = 'rgba(184,147,90,0.45)'),
  onBlur:  e => (e.target.style.borderColor = 'rgba(243,235,226,0.09)'),
}

// ─── Turnstile (only in production) ──────────────────────────────────────────
function TurnstileWidget({ onVerify }) {
  const containerRef = useRef(null)
  const widgetId = useRef(null)
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

  // In dev mode skip entirely
  if (import.meta.env.DEV || !siteKey) return null

  const initWidget = () => {
    if (!containerRef.current || !window.turnstile) return
    widgetId.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey, theme: 'dark', size: 'normal',
      callback: onVerify,
      'expired-callback': () => onVerify(''),
      'error-callback': () => onVerify(''),
    })
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const mountedRef = useRef(false)
  if (!mountedRef.current) {
    mountedRef.current = true
    if (typeof window !== 'undefined') {
      if (window.turnstile) {
        setTimeout(initWidget, 0)
      } else if (!document.getElementById('cf-turnstile-script')) {
        const s = document.createElement('script')
        s.id = 'cf-turnstile-script'
        s.src = 'https://challenges.cloudflare.com/turnstile/v1/api.js'
        s.async = s.defer = true
        s.onload = initWidget
        document.head.appendChild(s)
      }
    }
  }

  return <div ref={containerRef} style={{ margin: '14px 0' }} />
}

// ─── Main component ───────────────────────────────────────────────────────────
const PANEL_HEIGHT = 580

export default function AISection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY
  const [form, setForm] = useState({ brandDescription: '', mainProblems: '', siteUrl: '', instagram: '' })
  const [turnstileToken, setTurnstileToken] = useState(
    (import.meta.env.DEV || !siteKey) ? 'dev-bypass' : ''
  )

  const [phase, setPhase] = useState('form')
  const [loadingStep, setLoadingStep] = useState('')
  const [displayedText, setDisplayedText] = useState('')
  const [planName, setPlanName] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleTurnstileVerify = useCallback(token => setTurnstileToken(token), [])
  const setField = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const canSubmit =
    phase === 'form' &&
    form.brandDescription.trim().length >= 20 &&
    (import.meta.env.DEV || !siteKey || turnstileToken.length > 0)

  const handleSubmit = async () => {
    if (!canSubmit) return
    setPhase('loading')
    setLoadingStep('Iniciando análise...')
    setDisplayedText('')
    setPlanName(null)
    setErrorMsg('')

    // Local buffer — batches SSE tokens into ~4-word chunks every 120 ms
    let textBuffer = ''
    let flushTimer = null
    const flush = () => {
      const chunk = textBuffer
      textBuffer = ''
      if (chunk) setDisplayedText(prev => prev + chunk)
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, turnstileToken }),
      })
      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || `Erro ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let sseBuffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        sseBuffer += decoder.decode(value, { stream: true })
        const lines = sseBuffer.split('\n')
        sseBuffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const event = JSON.parse(line.slice(6))
            if (event.type === 'loading') {
              setLoadingStep(event.step)
            } else if (event.type === 'delta') {
              setPhase('streaming')
              textBuffer += event.text
              clearTimeout(flushTimer)
              flushTimer = setTimeout(flush, 120)
            } else if (event.type === 'done') {
              clearTimeout(flushTimer)
              flush()
              setPlanName(event.planName)
              setPhase('done')
            } else if (event.type === 'error') {
              clearTimeout(flushTimer)
              setErrorMsg(event.message)
              setPhase('error')
            }
          } catch { /* skip malformed lines */ }
        }
      }
      // Safety flush if stream closed without explicit done
      clearTimeout(flushTimer)
      flush()
      setPhase(p => p === 'streaming' ? 'done' : p)

    } catch (err) {
      clearTimeout(flushTimer)
      setErrorMsg(err.message || 'Erro de conexão. Tente novamente.')
      setPhase('error')
    }
  }

  const handleViewPlan = () => {
    const category = planName ? PLAN_CATEGORIES[planName] : null
    if (!category) return
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('openPricingPlan', { detail: { category, planName } }))
    }, 500)
  }

  const reset = () => {
    setPhase('form'); setDisplayedText(''); setPlanName(null); setErrorMsg('')
    setTurnstileToken((import.meta.env.DEV || !siteKey) ? 'dev-bypass' : '')
  }

  return (
    <section id="ai" style={{ background: 'var(--burgundy-deep)', padding: '140px 0' }}>
      <div className="container" ref={ref}>

        {/* ── Header ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: '80px', maxWidth: '800px' }}
        >
          <p className="section-label" style={{ color: 'var(--gold)' }}>Inteligência Aplicada</p>
          <h2 style={{
            fontFamily: 'var(--font-serif)', fontWeight: 300,
            fontSize: 'clamp(36px, 5vw, 68px)', lineHeight: 1.05,
            color: 'var(--cream)', marginBottom: '20px',
          }}>
            Descreva sua marca.
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--gold-light)' }}>A IA diagnostica e indica o caminho.</em>
          </h2>
          <p style={{ color: 'rgba(243,235,226,0.5)', fontSize: 'clamp(14px, 1.4vw, 16px)', lineHeight: 1.7, fontWeight: 300 }}>
            Análise real gerada por IA — diagnóstico honesto, pontos críticos e plano recomendado.
            Gratuita e em menos de 60 segundos.
          </p>
        </motion.div>

        {/* ── Grid ─────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', height: `${PANEL_HEIGHT}px` }} className="ai-grid">

          {/* Left — dimensions panel */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            style={{ height: `${PANEL_HEIGHT}px`, overflow: 'hidden' }}
          >
            <BrandSymbolPanel phase={phase} />
          </motion.div>

          {/* Right — form / result */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3 }}
            style={{
              background: '#1e080a',
              padding: '40px 36px',
              display: 'flex', flexDirection: 'column',
              height: `${PANEL_HEIGHT}px`, overflow: 'hidden',
            }}
          >
            {/* ── Static header — always visible ────────────────── */}
            <div style={{ flexShrink: 0, marginBottom: '22px', paddingBottom: '18px', borderBottom: '1px solid rgba(243,235,226,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: 'var(--gold)', fontSize: '9px', letterSpacing: '0.28em', textTransform: 'uppercase', fontWeight: 700 }}>
                  Yarden Intelligence
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <motion.div
                    animate={
                      phase === 'loading' || phase === 'streaming'
                        ? { opacity: [0.3, 1, 0.3] }
                        : { opacity: 1 }
                    }
                    transition={{ duration: 1.4, repeat: (phase === 'loading' || phase === 'streaming') ? Infinity : 0 }}
                    style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: phase === 'done' ? 'rgba(120,200,120,0.9)' : 'var(--gold)',
                    }}
                  />
                  <span style={{ color: 'rgba(243,235,226,0.35)', fontSize: '10px', letterSpacing: '0.1em' }}>
                    {phase === 'done'      ? 'Análise concluída' :
                     phase === 'loading'   ? 'Processando...'    :
                     phase === 'streaming' ? 'Analisando...'     :
                     phase === 'error'     ? 'Erro na análise'   :
                                            'Aguardando dados'}
                  </span>
                </div>
              </div>
              <p style={{ color: 'rgba(243,235,226,0.5)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}>
                Diagnóstico Gratuito de Marca
              </p>
            </div>

            <AnimatePresence mode="wait">

              {/* FORM */}
              {phase === 'form' && (
                <motion.div key="form"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                >
                  <Field label="Descrição da marca">
                    <textarea rows={4} maxLength={300} value={form.brandDescription}
                      onChange={setField('brandDescription')} {...focusHandlers}
                      placeholder="Ex: somos uma cafeteria artesanal em São Paulo focada em experiência e qualidade..."
                      style={baseInput}
                    />
                    <div style={{ textAlign: 'right', fontSize: '10px', marginTop: '3px',
                      color: form.brandDescription.length > 280 ? 'rgba(220,100,80,0.8)' : 'rgba(243,235,226,0.2)' }}>
                      {form.brandDescription.length}/300
                    </div>
                  </Field>

                  <Field label="Principais problemas atuais" optional>
                    <textarea rows={2} value={form.mainProblems}
                      onChange={setField('mainProblems')} {...focusHandlers}
                      placeholder="Ex: baixo engajamento, identidade visual inconsistente..."
                      style={baseInput}
                    />
                  </Field>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <Field label="Site da empresa" optional>
                      <input type="text" value={form.siteUrl}
                        onChange={setField('siteUrl')} {...focusHandlers}
                        placeholder="meusite.com"
                        style={{ ...baseInput, padding: '10px 13px' }}
                      />
                    </Field>
                    <Field label="Instagram (sem @)" optional>
                      <input type="text" value={form.instagram}
                        onChange={setField('instagram')} {...focusHandlers}
                        placeholder="yardenlab_"
                        style={{ ...baseInput, padding: '10px 13px' }}
                      />
                    </Field>
                  </div>

                  <TurnstileWidget onVerify={handleTurnstileVerify} />

                  <div style={{ flex: 1 }} />

                  <button onClick={handleSubmit} disabled={!canSubmit}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      width: '100%', padding: '14px',
                      background: canSubmit ? 'var(--gold)' : 'rgba(184,147,90,0.15)',
                      color: canSubmit ? '#fff' : 'rgba(243,235,226,0.25)',
                      border: 'none', cursor: canSubmit ? 'pointer' : 'default',
                      fontSize: '10px', fontWeight: 700, letterSpacing: '0.16em',
                      textTransform: 'uppercase', fontFamily: 'inherit',
                      transition: 'background 0.3s',
                    }}
                    onMouseEnter={e => { if (canSubmit) e.currentTarget.style.background = 'var(--gold-light)' }}
                    onMouseLeave={e => { if (canSubmit) e.currentTarget.style.background = 'var(--gold)' }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
                    </svg>
                    Analisar minha marca
                  </button>
                </motion.div>
              )}

              {/* LOADING */}
              {phase === 'loading' && (
                <motion.div key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '28px' }}
                >
                  <div style={{ width: '180px', overflow: 'hidden', height: '1px', background: 'rgba(243,235,226,0.06)' }}>
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      style={{ height: '100%', width: '45%', background: 'linear-gradient(to right, transparent, var(--gold), transparent)' }}
                    />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <motion.p animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.3, repeat: Infinity }}
                      style={{ color: 'rgba(243,235,226,0.5)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '8px' }}>
                      {loadingStep}
                    </motion.p>
                    <p style={{ color: 'rgba(243,235,226,0.2)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '13px' }}>
                      Analisando sua marca...
                    </p>
                  </div>
                  <div style={{ width: '100px', overflow: 'hidden', height: '1px', background: 'rgba(243,235,226,0.04)' }}>
                    <motion.div
                      animate={{ x: ['200%', '-100%'] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: 0.5 }}
                      style={{ height: '100%', width: '45%', background: 'linear-gradient(to right, transparent, rgba(184,147,90,0.35), transparent)' }}
                    />
                  </div>
                </motion.div>
              )}

              {/* STREAMING / DONE */}
              {(phase === 'streaming' || phase === 'done') && (
                <motion.div key="result"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
                >
                  {/* Top bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <motion.div
                        animate={phase === 'streaming' ? { opacity: [0.4, 1, 0.4] } : { opacity: 1 }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        style={{ width: 5, height: 5, borderRadius: '50%', background: phase === 'done' ? 'rgba(120,200,120,0.9)' : 'var(--gold)' }}
                      />
                      <span style={{ color: 'var(--gold)', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 700 }}>
                        {phase === 'streaming' ? 'Analisando...' : 'Diagnóstico Concluído'}
                      </span>
                    </div>
                    {phase === 'done' && (
                      <button onClick={reset}
                        style={{ background: 'none', border: 'none', color: 'rgba(243,235,226,0.3)', fontSize: '11px', cursor: 'pointer', letterSpacing: '0.06em' }}
                        onMouseEnter={e => e.currentTarget.style.color = 'rgba(243,235,226,0.65)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(243,235,226,0.3)'}
                      >
                        Nova análise →
                      </button>
                    )}
                  </div>

                  {/* Scrollable result — capped height */}
                  <div className="analysis-result" style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingRight: '6px' }}>
                    {/* Stable container — only fades in once; text grows in batches every 120 ms */}
                    <motion.div
                      key="stream-result"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <StreamText text={displayedText} streaming={phase === 'streaming'} />
                    </motion.div>
                  </div>

                  {/* CTA after done */}
                  <AnimatePresence>
                    {phase === 'done' && planName && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.25 }}
                        style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(243,235,226,0.07)', flexShrink: 0 }}
                      >
                        <p style={{ color: 'rgba(243,235,226,0.35)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '10px' }}>
                          Plano recomendado
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontStyle: 'italic', color: 'var(--cream)', fontWeight: 300 }}>
                            {planName}
                          </span>
                          <button onClick={handleViewPlan}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              background: 'none', border: '1px solid rgba(184,147,90,0.3)',
                              color: 'var(--gold)', padding: '6px 14px',
                              fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em',
                              textTransform: 'uppercase', cursor: 'pointer',
                              fontFamily: 'inherit', transition: 'all 0.25s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(184,147,90,0.08)'; e.currentTarget.style.borderColor = 'var(--gold)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'rgba(184,147,90,0.3)' }}
                          >
                            Ver detalhes do plano
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* ERROR */}
              {phase === 'error' && (
                <motion.div key="error"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '16px' }}
                >
                  <div style={{ background: 'rgba(200,80,80,0.05)', border: '1px solid rgba(200,80,80,0.18)', padding: '18px 20px' }}>
                    <p style={{ color: 'rgba(200,80,80,0.8)', fontSize: '13px', lineHeight: 1.65, fontWeight: 300 }}>{errorMsg}</p>
                  </div>
                  <button onClick={reset}
                    style={{
                      background: 'none', border: '1px solid rgba(243,235,226,0.12)',
                      color: 'rgba(243,235,226,0.45)', padding: '11px', fontSize: '10px',
                      cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase',
                      fontFamily: 'inherit', transition: 'all 0.25s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(243,235,226,0.3)'; e.currentTarget.style.color = 'var(--cream)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(243,235,226,0.12)'; e.currentTarget.style.color = 'rgba(243,235,226,0.45)' }}
                  >
                    Tentar novamente
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </div>

        {/* ── AI features strip ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px', marginTop: '2px' }}
          className="ai-features"
        >
          {[
            { icon: '◈', title: 'Análise de Audiência',        desc: 'IA monitora comentários e DMs identificando objeções e oportunidades.' },
            { icon: '◇', title: 'Auto-resposta Inteligente',   desc: 'Respostas automáticas em DM com personalidade da sua marca.' },
            { icon: '○', title: 'Dashboard de Marca',          desc: 'Relatórios mensais gerados por IA com recomendações estratégicas.' },
            { icon: '△', title: 'Inteligência de Mercado',     desc: 'IA monitora concorrentes e tendências em tempo real.' },
          ].map(f => (
            <div key={f.title} style={{ background: '#180709', padding: '36px 28px', borderTop: '1px solid rgba(243,235,226,0.05)' }}>
              <div style={{ color: 'var(--gold)', fontSize: '20px', marginBottom: '16px', lineHeight: 1 }}>{f.icon}</div>
              <h4 style={{ color: 'var(--cream)', fontSize: '14px', fontWeight: 500, marginBottom: '10px', letterSpacing: '0.02em' }}>{f.title}</h4>
              <p style={{ color: 'rgba(243,235,226,0.45)', fontSize: '13px', lineHeight: 1.6, fontWeight: 300 }}>{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .ai-grid { grid-template-columns: 1fr !important; height: auto !important; }
          .ai-grid > *:first-child { display: none !important; }
          .ai-grid > * { height: auto !important; min-height: 320px; }
          .ai-features { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 540px) {
          .ai-features { grid-template-columns: 1fr !important; }
        }
        .analysis-result::-webkit-scrollbar { width: 2px; }
        .analysis-result::-webkit-scrollbar-track { background: transparent; }
        .analysis-result::-webkit-scrollbar-thumb { background: rgba(184,147,90,0.2); border-radius: 2px; }
      `}</style>
    </section>
  )
}
