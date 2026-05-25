import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three'

export default function Hero() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const w = window.innerWidth
    const h = window.innerHeight

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(w, h)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100)
    camera.position.z = 5

    // --- Particles ---
    const COUNT = 80
    const pos = new Float32Array(COUNT * 3)
    const vel = []

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 11
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 3
      vel.push([(Math.random() - 0.5) * 0.0035, (Math.random() - 0.5) * 0.0035])
    }

    const ptGeo = new THREE.BufferGeometry()
    const posAttr = new THREE.BufferAttribute(pos, 3)
    ptGeo.setAttribute('position', posAttr)

    const ptMat = new THREE.PointsMaterial({
      color: 0xc8a882,
      size: 0.038,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    })
    const pts = new THREE.Points(ptGeo, ptMat)
    scene.add(pts)

    // --- Lines ---
    const maxSegs = COUNT * COUNT
    const lpos = new Float32Array(maxSegs * 6)
    const lGeo = new THREE.BufferGeometry()
    const lposAttr = new THREE.BufferAttribute(lpos, 3)
    lposAttr.setUsage(THREE.DynamicDrawUsage)
    lGeo.setAttribute('position', lposAttr)

    const lMat = new THREE.LineBasicMaterial({
      color: 0xa07858,
      transparent: true,
      opacity: 0.18,
    })
    const segs = new THREE.LineSegments(lGeo, lMat)
    scene.add(segs)

    const THRESH = 2.4
    const mouse = { x: 0, y: 0 }

    const onMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 11
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 8
    }

    const onTouch = (e) => {
      if (!e.touches[0]) return
      mouse.x = (e.touches[0].clientX / window.innerWidth - 0.5) * 11
      mouse.y = -(e.touches[0].clientY / window.innerHeight - 0.5) * 8
    }

    const onResize = () => {
      const nw = window.innerWidth
      const nh = window.innerHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }

    window.addEventListener('mousemove', onMouse)
    window.addEventListener('touchmove', onTouch, { passive: true })
    window.addEventListener('resize', onResize)

    // Pause when not visible
    let visible = true
    const observer = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
    observer.observe(canvas)

    let raf
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      let segCount = 0

      for (let i = 0; i < COUNT; i++) {
        pos[i * 3]     += vel[i][0]
        pos[i * 3 + 1] += vel[i][1]

        if (Math.abs(pos[i * 3])     > 5.5) vel[i][0] *= -1
        if (Math.abs(pos[i * 3 + 1]) > 4.0) vel[i][1] *= -1

        // Gentle mouse repulsion
        const dx = mouse.x - pos[i * 3]
        const dy = mouse.y - pos[i * 3 + 1]
        const md = Math.sqrt(dx * dx + dy * dy)
        if (md < 2.5) {
          vel[i][0] -= (dx / md) * 0.00018
          vel[i][1] -= (dy / md) * 0.00018
        }

        // Speed cap
        const sp = Math.sqrt(vel[i][0] ** 2 + vel[i][1] ** 2)
        if (sp > 0.008) { vel[i][0] *= 0.95; vel[i][1] *= 0.95 }

        for (let j = i + 1; j < COUNT; j++) {
          const ddx = pos[i * 3]     - pos[j * 3]
          const ddy = pos[i * 3 + 1] - pos[j * 3 + 1]
          const ddz = pos[i * 3 + 2] - pos[j * 3 + 2]
          const dist = Math.sqrt(ddx * ddx + ddy * ddy + ddz * ddz)

          if (dist < THRESH) {
            const base = segCount * 6
            lpos[base]     = pos[i * 3];     lpos[base + 1] = pos[i * 3 + 1]; lpos[base + 2] = pos[i * 3 + 2]
            lpos[base + 3] = pos[j * 3];     lpos[base + 4] = pos[j * 3 + 1]; lpos[base + 5] = pos[j * 3 + 2]
            segCount++
          }
        }
      }

      lGeo.setDrawRange(0, segCount * 2)
      posAttr.needsUpdate = true
      lposAttr.needsUpdate = true

      pts.rotation.y  += 0.00025
      segs.rotation.y += 0.00025

      renderer.render(scene, camera)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('touchmove', onTouch)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      ptGeo.dispose(); ptMat.dispose()
      lGeo.dispose(); lMat.dispose()
    }
  }, [])

  return (
    <section style={{
      position: 'relative',
      height: '100vh',
      minHeight: '640px',
      background: 'linear-gradient(160deg, #1c0608 0%, #360f11 55%, #2a0d0f 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      overflow: 'hidden',
    }}>
      {/* Three.js Canvas */}
      <canvas ref={canvasRef} style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }} />

      {/* Gradient overlays */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(104,45,27,0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '30%',
        background: 'linear-gradient(to top, rgba(28,6,8,0.6), transparent)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p style={{
            color: 'var(--gold)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}>
            <span style={{ display: 'inline-block', width: '36px', height: '1px', background: 'var(--gold)' }} />
            Marketing · Tecnologia · Inteligência
          </p>

          <h1 style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 300,
            fontSize: 'clamp(52px, 8vw, 110px)',
            lineHeight: 1.0,
            color: 'var(--cream)',
            maxWidth: '880px',
            marginBottom: '36px',
          }}>
            Onde estratégia
            <br />
            encontra{' '}
            <em style={{ color: 'var(--gold-light)', fontStyle: 'italic', fontWeight: 300 }}>
              inteligência.
            </em>
          </h1>

          <p style={{
            color: 'rgba(243,235,226,0.65)',
            fontSize: 'clamp(15px, 1.6vw, 19px)',
            lineHeight: 1.7,
            maxWidth: '540px',
            marginBottom: '52px',
            fontWeight: 300,
          }}>
            Yarden Lab é a plataforma completa de marca para empresas premium —
            da estratégia criativa à inteligência artificial, tudo funcionando como um organismo único.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a href="#plans" className="btn-primary">
              Conheça as Soluções
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a href="#plans" className="btn-outline-light">
              Ver Planos
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          color: 'rgba(243,235,226,0.4)',
          cursor: 'pointer',
        }}
        onClick={() => document.querySelector('#manifesto')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>

      {/* Bottom stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '60px',
          display: 'flex',
          gap: '48px',
        }}
        className="hero-stats"
      >
        {[
          { num: '6', label: 'Soluções' },
          { num: '360°', label: 'Marketing' },
          { num: 'IA', label: 'Aplicada' },
        ].map(({ num, label }) => (
          <div key={label} style={{ textAlign: 'right' }}>
            <div style={{
              color: 'var(--cream)',
              fontSize: 'clamp(22px, 3vw, 36px)',
              fontFamily: 'var(--font-serif)',
              fontWeight: 300,
              lineHeight: 1,
            }}>{num}</div>
            <div style={{
              color: 'rgba(243,235,226,0.45)',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginTop: '6px',
            }}>{label}</div>
          </div>
        ))}
      </motion.div>

      <style>{`
        @media (max-width: 768px) {
          .hero-stats { display: none !important; }
        }
      `}</style>
    </section>
  )
}
