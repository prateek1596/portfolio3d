import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './EasterEggs.css'

export default function EasterEggs() {
  const [activeEasterEgg, setActiveEasterEgg] = useState(null)

  useEffect(() => {
    const handleEasterEgg = (e) => {
      setActiveEasterEgg(e.detail.name)
      setTimeout(() => setActiveEasterEgg(null), 2000)
    }

    window.addEventListener('easterEggTriggered', handleEasterEgg)
    return () => window.removeEventListener('easterEggTriggered', handleEasterEgg)
  }, [])

  return (
    <AnimatePresence>
      {activeEasterEgg && (
        <motion.div
          className="easter-egg-notification"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {activeEasterEgg === 'matrix' && '🟢 Matrix mode activated!'}
          {activeEasterEgg === 'rainbow' && '🌈 Rainbow mode activated!'}
          {activeEasterEgg === 'konami' && '🎮 Konami code unlocked!'}
          {activeEasterEgg === 'secret' && '🔒 Secret mode unlocked!'}
        </motion.div>
      )}

      {/* Matrix rain effect */}
      <div className="matrix-container">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="matrix-column">
            {Array.from({ length: 20 }).map((_, j) => (
              <div
                key={j}
                className="matrix-char"
                style={{
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                {String.fromCharCode(33 + Math.floor(Math.random() * 94))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </AnimatePresence>
  )
}
