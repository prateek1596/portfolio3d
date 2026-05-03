import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './EasterEggs.css'

export default function EasterEggs() {
  const [activeEasterEgg, setActiveEasterEgg] = useState(null)

  useEffect(() => {
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

      // Remove notification after 2 seconds
      const timer = setTimeout(() => {
        setActiveEasterEgg(null)
      }, 2000)

      return () => clearTimeout(timer)
    }

    window.addEventListener('easterEggTriggered', handleEasterEgg)
    return () => window.removeEventListener('easterEggTriggered', handleEasterEgg)
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
