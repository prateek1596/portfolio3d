import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useTheme } from '../hooks/useTheme'

export default function ThemeControls({ sounds }) {
  const { isDark, setIsDark, accent, setAccent, ACCENTS } = useTheme()
  const [open, setOpen] = useState(false)
  const [soundOn, setSoundOn] = useState(true)

  const toggle = () => {
    setOpen(o => !o)
    sounds?.click()
  }

  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 600,
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10,
    }}>
      {/* Toggle button */}
      <motion.button
        data-hover
        onClick={toggle}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        style={{
          width: 42, height: 42, borderRadius: '50%',
          border: '1px solid rgba(200,169,110,0.35)',
          background: 'rgba(4,4,10,0.85)', backdropFilter: 'blur(12px)',
          color: 'var(--gold)', fontSize: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        ⚙
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'rgba(4,4,10,0.92)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(200,169,110,0.15)',
              padding: '20px 20px', minWidth: 180,
            }}
          >
            {/* Dark / Light */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(242,236,224,0.35)', marginBottom: 8 }}>Theme</div>
              <motion.button
                data-hover
                onClick={() => { setIsDark(d => !d); sounds?.click() }}
                whileHover={{ scale: 1.03 }}
                style={{
                  width: '100%', padding: '8px 12px',
                  background: isDark ? 'rgba(200,169,110,0.1)' : 'rgba(242,236,224,0.1)',
                  border: '1px solid rgba(200,169,110,0.25)',
                  color: 'var(--gold)', fontFamily: 'var(--font-mono)',
                  fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <span>{isDark ? '◐' : '◑'}</span>
                <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
              </motion.button>
            </div>

            {/* Accent picker */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(242,236,224,0.35)', marginBottom: 8 }}>Accent</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {Object.entries(ACCENTS).map(([key, val]) => (
                  <motion.button
                    key={key}
                    data-hover
                    onClick={() => { setAccent(key); sounds?.click() }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: val.primary,
                      border: accent === key ? `2px solid var(--white)` : '2px solid transparent',
                      cursor: 'pointer', flexShrink: 0,
                    }}
                    title={val.label}
                  />
                ))}
              </div>
            </div>

            {/* Sound toggle */}
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(242,236,224,0.35)', marginBottom: 8 }}>Sound</div>
              <motion.button
                data-hover
                onClick={() => {
                  const next = !soundOn
                  setSoundOn(next)
                  if (sounds) sounds.enabled.current = next
                  if (next) sounds?.click()
                }}
                whileHover={{ scale: 1.03 }}
                style={{
                  width: '100%', padding: '8px 12px',
                  background: soundOn ? 'rgba(0,232,255,0.08)' : 'rgba(242,236,224,0.04)',
                  border: `1px solid ${soundOn ? 'rgba(0,232,255,0.3)' : 'rgba(242,236,224,0.1)'}`,
                  color: soundOn ? 'var(--cyan)' : 'rgba(242,236,224,0.3)',
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                <span>{soundOn ? '♪' : '♩'}</span>
                <span>{soundOn ? 'Sound On' : 'Sound Off'}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
