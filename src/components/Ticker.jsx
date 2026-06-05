import { useRef } from 'react'
import { motion } from 'framer-motion'

const words = [
  'Estratégia de Marca', '·', 'Inteligência Artificial', '·',
  'Marketing 360°', '·', 'Tecnologia Aplicada', '·',
  'Direção Criativa', '·', 'Automação Inteligente', '·',
  'Dados & Insights', '·', 'Conteúdo Premium', '·',
  'Posicionamento', '·', 'Performance', '·',
]

const doubled = [...words, ...words]

export default function Ticker() {
  return (
    <div style={{
      background: 'var(--espresso)',
      borderTop: '1px solid rgba(243,235,226,0.08)',
      borderBottom: '1px solid rgba(243,235,226,0.08)',
      overflow: 'hidden',
      padding: '18px 0',
    }}>
      <motion.div
        style={{ display: 'flex', gap: '32px', width: 'max-content' }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          duration: 28,
          ease: 'linear',
          repeat: Infinity,
        }}
      >
        {doubled.map((word, i) => (
          <span key={i} style={{
            color: word === '·' ? 'var(--cream)' : 'rgba(243,235,226,0.55)',
            fontSize: '11px',
            fontWeight: word === '·' ? 400 : 500,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            {word}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
