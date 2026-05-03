import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './EasterEggs.css'

export default function EasterEggs() {
  const [activeEasterEgg, setActiveEasterEgg] = useState(null)

  useEffect(() => {
    let timerRef = null

    const handleEasterEgg = (e) => {
      const eggName = e.detail.name
      setActiveEasterEgg(eggName)

      // Apply CSS classes based on egg type
      if (eggName === 'MATRIX') {
        document.body.classList.add('easter-egg-matrix')
      } else if (eggName === 'RAINBOW') {
        document.body.classList.add('easter-egg-rainbow')
      } else if (eggName === 'SECRET') {
        document.body.classList.add('easter-egg-secret')
      }

      // Clear existing timer if any
      if (timerRef) clearTimeout(timerRef)

      // Remove notification after 2 seconds
      timerRef = setTimeout(() => {
        setActiveEasterEgg(null)
        // Remove all easter egg classes
        document.body.classList.remove('easter-egg-matrix', 'easter-egg-rainbow', 'easter-egg-secret')
      }, 2000)
    }

    window.addEventListener('easterEggTriggered', handleEasterEgg)
    return () => {
      window.removeEventListener('easterEggTriggered', handleEasterEgg)
      if (timerRef) clearTimeout(timerRef)
    }
  }, [])

  const getEasterEggMessage = (name) => {
    const messages = {
      MATRIX: '🟢 Matrix mode activated!',
      RAINBOW: '🌈 Rainbow mode activated!',
      KONAMI: '🎮 Konami code unlocked!',
      SECRET: '🔒 Secret mode unlocked!',
    }
    return messages[name] || '✨ Easter egg found!'
  }

  return (
    <AnimatePresence>
      {activeEasterEgg && (
        <motion.div
          className="easter-egg-notification"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {getEasterEggMessage(activeEasterEgg)}
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
