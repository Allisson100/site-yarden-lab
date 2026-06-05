import Navbar      from './components/Navbar'
import Hero         from './components/Hero'
import Ticker       from './components/Ticker'
import Manifesto    from './components/Manifesto'
import MediaReel    from './components/MediaReel'
import InstagramFeed from './components/InstagramFeed'
import Process      from './components/Process'
import AISection    from './components/AISection'
import PlansSection from './components/PlansSection'
import Contact      from './components/Contact'
import Footer       from './components/Footer'

/**
 * Ordem das seções:
 *   Menu + Banner → Produção (desktop: grade mista | mobile: grid 3-col)
 *   → Método → IA → Planos → Quem somos → Contato
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

        {/* Produção — desktop: grade mista fotos+vídeos | mobile: grade 3-col Instagram */}
        <div className="desktop-only"><MediaReel /></div>
        <div className="mobile-only"><InstagramFeed /></div>

        {/* Método que gera resultado */}
        <Process />

        {/* Inteligência aplicada */}
        <AISection />

        {/* Planos */}
        <PlansSection />

        {/* Quem somos */}
        <Manifesto />

        {/* Contato */}
        <Contact />
      </main>
      <Footer />
    </>
  )
}
