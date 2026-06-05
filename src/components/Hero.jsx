import { motion as m } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="hero-section"
      style={{
        position: "relative",
        height: "100vh",
        minHeight: "640px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        overflow: "hidden",
      }}
    >
      {/* Foto de fundo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url(/hero-bg.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Overlay escuro para legibilidade do texto */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(18,4,6,0.62)",
          pointerEvents: "none",
        }}
      />

      {/* Gradiente suave no fundo */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(to top, rgba(18,4,6,0.75), transparent)",
          pointerEvents: "none",
        }}
      />

      {/* Conteúdo */}
      <div
        className="container"
        style={{ position: "relative", zIndex: 1, width: "100%" }}
      >
        <m.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p
            style={{
              color: "var(--cream)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              marginBottom: "32px",
              // marginTop: "60px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            Marketing strategy · Branding · AI
          </p>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: "clamp(52px, 6vw, 110px)",
              // fontSize: "32px",
              fontStyle: "italic",
              lineHeight: 1.0,
              color: "var(--cream)",
              maxWidth: "880px",
              marginBottom: "36px",
            }}
          >
            A travessia {/* <br /> */}
            <em
              style={{
                color: "#F3EBE2",
                fontStyle: "initial",
                fontWeight: 300,
                fontSize: "clamp(52px, 5vw, 110px)",
                fontFamily: "var(--font-sans)",
              }}
            >
              começou.
            </em>
          </h1>

          <p
            style={{
              color: "rgba(243,235,226,0.65)",
              fontSize: "clamp(15px, 1.6vw, 19px)",
              lineHeight: 1.7,
              maxWidth: "540px",
              marginBottom: "52px",
              fontWeight: 300,
            }}
          >
            Yarden Lab é a inteligência completa de marca para empresas premium
            — da estratégia criativa à IA, tudo funcionando como um organismo
            único.
          </p>

          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <a href="#plans" className="btn-primary">
              Conheça as Soluções
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href="#plans" className="btn-outline-light">
              Ver Planos
            </a>
          </div>
        </m.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-section {
            height: auto !important;
            min-height: unset !important;
            justify-content: flex-start !important;
            padding-top: 110px !important;
            padding-bottom: 72px !important;
          }
        }
      `}</style>
    </section>
  );
}
