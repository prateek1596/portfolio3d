import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#@$%&アイウカキサシ01'

export default function GlitchText({ children, as = 'div', style = {}, sounds, ...props }) {
  const [glitching, setGlitching] = useState(false)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetX2, setOffsetX2] = useState(0)
  const timerRef = useRef(null)
  const Tag = as

  const startGlitch = () => {
    setGlitching(true)
    sounds?.glitch()
    let ticks = 0
    timerRef.current = setInterval(() => {
      setOffsetX((Math.random() - 0.5) * 6)
      setOffsetX2((Math.random() - 0.5) * 4)
      ticks++
      if (ticks > 8) {
        clearInterval(timerRef.current)
        setGlitching(false)
        setOffsetX(0)
        setOffsetX2(0)
      }
    }, 50)
  }

  const stopGlitch = () => {
    clearInterval(timerRef.current)
    setGlitching(false)
    setOffsetX(0)
    setOffsetX2(0)
  }

  return (
    <Tag
      onMouseEnter={startGlitch}
      onMouseLeave={stopGlitch}
      style={{ position: 'relative', display: 'inline-block', ...style }}
      {...props}
    >
      {/* Red channel */}
      {glitching && (
        <span style={{
          position: 'absolute', inset: 0,
          color: '#ff2d55', clipPath: 'inset(20% 0 60% 0)',
          transform: `translateX(${offsetX}px)`,
          pointerEvents: 'none', opacity: 0.7,
        }}>{children}</span>
      )}
      {/* Cyan channel */}
      {glitching && (
        <span style={{
          position: 'absolute', inset: 0,
          color: '#00e8ff', clipPath: 'inset(50% 0 20% 0)',
          transform: `translateX(${offsetX2}px)`,
          pointerEvents: 'none', opacity: 0.7,
        }}>{children}</span>
      )}
      {/* Main */}
      <span style={{ position: 'relative' }}>{children}</span>
    </Tag>
  )
}
