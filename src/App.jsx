import Navbar      from './components/Navbar'
import Hero         from './components/Hero'
import Ticker       from './components/Ticker'
import Manifesto    from './components/Manifesto'
import PhotoCarousel from './components/PhotoCarousel'
import InstagramFeed from './components/InstagramFeed'
import VideoReel    from './components/VideoReel'
import Process      from './components/Process'
import AISection    from './components/AISection'
import PlansSection from './components/PlansSection'
import Contact      from './components/Contact'
import Footer       from './components/Footer'

/**
 * Ordem das seções:
 *   Menu + Banner → Quem somos → Fotos (desktop: carrossel | mobile: grid 3-col)
 *   → Vídeos (desktop) → Método → IA → Planos → Contato
 *
 * desktop-only: visível apenas em telas ≥ 769 px
 * mobile-only : visível apenas em telas ≤ 768 px
 */
export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Ticker />

        {/* Quem somos */}
        <Manifesto />

        {/* Fotos — desktop: carrossel animado | mobile: grade 3-col Instagram */}
        <div className="desktop-only"><PhotoCarousel /></div>
        <div className="mobile-only"><InstagramFeed /></div>

        {/* Vídeos — desktop only; no mobile já estão no InstagramFeed */}
        <div className="desktop-only"><VideoReel /></div>

        {/* Método que gera resultado */}
        <Process />

        {/* Inteligência aplicada */}
        <AISection />

        {/* Planos */}
        <PlansSection />

        {/* Contato */}
        <Contact />
      </main>
      <Footer />
    </>
  )
}
