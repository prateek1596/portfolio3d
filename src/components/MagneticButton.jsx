import { motion } from 'framer-motion'
import { useMagnetic } from '../hooks/useMagnetic'

export default function MagneticButton({ children, style = {}, onClick, strength = 0.4, sounds, ...props }) {
  const { ref, sx, sy, onMove, onLeave } = useMagnetic(strength)

  return (
    <motion.div
      ref={ref}
      style={{ display: 'inline-block', x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-hover
    >
      <motion.button
        onClick={() => { sounds?.click(); onClick?.() }}
        onMouseEnter={() => sounds?.hover()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          cursor: 'pointer', background: 'none',
          border: '1px solid var(--gold)',
          color: 'var(--gold)',
          fontFamily: 'var(--font-mono)',
          fontSize: 10, letterSpacing: '0.3em',
          textTransform: 'uppercase',
          padding: '12px 28px',
          position: 'relative', overflow: 'hidden',
          ...style,
        }}
        {...props}
      >
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            background: 'var(--gold)', originX: 0,
          }}
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
        <span style={{ position: 'relative', mixBlendMode: 'difference', color: 'var(--white)' }}>
          {children}
        </span>
      </motion.button>
    </motion.div>
  )
}
