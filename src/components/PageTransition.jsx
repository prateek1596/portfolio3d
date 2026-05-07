import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

export default function PageTransition({ pageKey }) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return null
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey + '-curtain'}
        initial={{ scaleX: 0, originX: '0%' }}
        animate={{
          scaleX: [0, 1, 1, 0],
          originX: ['0%', '0%', '100%', '100%'],
        }}
        transition={{
          duration: 0.6,
          times: [0, 0.42, 0.52, 1],
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{
          position: 'fixed', inset: 0, zIndex: 800,
          background: 'var(--gold)', pointerEvents: 'none',
          willChange: 'transform',
        }}
      />
    </AnimatePresence>
  )
}
