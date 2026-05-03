import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LOADING_WORDS = ['INITIALIZING', 'LOADING ASSETS', 'BUILDING WORLD', 'ALMOST THERE']

export default function Loader({ onDone }) {
  const [count, setCount] = useState(0)
  const [wordIdx, setWordIdx] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const start = Date.now()
    const duration = 2200
    const iv = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const val = Math.floor(eased * 100)
      setCount(val)
      setWordIdx(Math.floor(eased * (LOADING_WORDS.length - 1)))
      if (progress >= 1) {
        clearInterval(iv)
        setTimeout(() => setDone(true), 300)
        setTimeout(onDone, 900)
      }
    }, 16)
    return () => clearInterval(iv)
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9000,
            background: 'var(--bg)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Scan line */}
          <motion.div
            animate={{ y: ['-100vh', '100vh'] }}
            transition={{ duration: 2.2, ease: 'linear' }}
            style={{
              position: 'absolute', left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
              opacity: 0.25, pointerEvents: 'none',
            }}
          />

          {/* Corner brackets */}
          {[
            { top: 40, left: 40, borderTop: '1px solid', borderLeft: '1px solid' },
            { top: 40, right: 40, borderTop: '1px solid', borderRight: '1px solid' },
            { bottom: 40, left: 40, borderBottom: '1px solid', borderLeft: '1px solid' },
            { bottom: 40, right: 40, borderBottom: '1px solid', borderRight: '1px solid' },
          ].map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              style={{ position: 'absolute', width: 32, height: 32, borderColor: 'var(--panel-border)', ...s }}
            />
          ))}

          {/* Ghost outline number */}
          <div style={{
            position: 'absolute',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(120px, 22vw, 220px)',
            lineHeight: 1, letterSpacing: '-0.04em',
            color: 'transparent',
            WebkitTextStroke: '1px var(--text-ghost)',
            userSelect: 'none',
          }}>
            {String(count).padStart(2, '0')}
          </div>

          {/* Main counter */}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(120px, 22vw, 220px)',
            lineHeight: 1, letterSpacing: '-0.04em',
            color: 'var(--text)',
            userSelect: 'none', position: 'relative',
          }}>
            {String(count).padStart(2, '0')}
          </div>

          {/* Status word */}
          <motion.div
            key={wordIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '0.5em', textTransform: 'uppercase',
              color: 'var(--gold)', marginTop: 16,
            }}
          >
            {LOADING_WORDS[wordIdx]}
          </motion.div>

          {/* Progress track */}
          <div style={{
            position: 'absolute', bottom: 60, left: '10%', right: '10%',
            height: 1, background: 'var(--rule-soft)',
          }}>
            <div style={{
              height: '100%', background: 'var(--gold)',
              width: count + '%', transition: 'width 0.05s linear',
            }} />
          </div>

          <div style={{
            position: 'absolute', bottom: 36, left: '10%',
            fontFamily: 'var(--font-mono)', fontSize: 9,
            letterSpacing: '0.35em', textTransform: 'uppercase',
            color: 'var(--text-faint)',
          }}>
            Prateek · Portfolio · 2025
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
