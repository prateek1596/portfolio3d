import { useEffect, useRef } from 'react'

/**
 * useEasterEggs - Track and trigger hidden Easter eggs
 */
export const useEasterEggs = () => {
  const keysPressed = useRef([])
  const easterEggTriggered = useRef({})

  const registerEasterEgg = (name, keys, callback) => {
    useEffect(() => {
      const handleKeyDown = (e) => {
        keysPressed.current.push(e.key.toLowerCase())

        // Keep only last N keys
        if (keysPressed.current.length > 20) {
          keysPressed.current.shift()
        }

        const keySequence = keysPressed.current.join('')
        if (keySequence.includes(keys.join('').toLowerCase())) {
          if (!easterEggTriggered.current[name]) {
            easterEggTriggered.current[name] = true
            callback()
            setTimeout(() => {
              easterEggTriggered.current[name] = false
            }, 1000)
          }
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }, [name, keys, callback])
  }

  return { registerEasterEgg }
}

/**
 * Pre-defined Easter eggs
 */
export const EASTER_EGGS = {
  // Konami code: ↑↑↓↓←→←→BA
  KONAMI: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],

  // Matrix rain
  MATRIX: ['m', 'a', 't', 'r', 'i', 'x'],

  // Rainbow mode
  RAINBOW: ['r', 'a', 'i', 'n', 'b', 'o', 'w'],

  // Secret profile
  SECRET: ['s', 'e', 'c', 'r', 'e', 't'],
}

export const triggerEasterEgg = (name) => {
  const event = new CustomEvent('easterEggTriggered', { detail: { name } })
  window.dispatchEvent(event)
}

export const onEasterEggTriggered = (callback) => {
  window.addEventListener('easterEggTriggered', (e) => {
    callback(e.detail.name)
  })
}
