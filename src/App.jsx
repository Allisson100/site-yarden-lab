import IntroHero from "./components/IntroHero";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Ticker from "./components/Ticker";
import Manifesto from "./components/Manifesto";
import MediaReel from "./components/MediaReel";
import Process from "./components/Process";
import AISection from "./components/AISection";
import PlansSection from "./components/PlansSection";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

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
      {/* Tela de abertura — fixa no fundo, revelada ao rolar */}
      <IntroHero />

      {/* Site real — desliza por cima do intro ao rolar; volta ao subir */}
      <div className="site-shell">
        <Navbar />
        <main>
          <Hero />
          {/* <Ticker /> */}

          {/* Método que gera resultado */}
          <Process />

          {/* Produção — grade mista de fotos + vídeos (mesmo grid em todas as telas) */}
          <MediaReel />

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
      </div>
    </>
  );
}
