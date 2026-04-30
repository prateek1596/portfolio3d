import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { gsap } from 'gsap'

const PHRASES = [
  'Full Stack Developer · Builder',
  'React + FastAPI Specialist',
  'ML Systems Engineer',
  'Open to Opportunities · Chennai',
]

const TAGS = ['React', 'FastAPI', 'Python', 'Machine Learning', 'TypeScript', 'React Native']

function TypeWriter() {
  const [text, setText] = useState('')
  const [pi, setPi] = useState(0)
  const [typing, setTyping] = useState(true)
  const timerRef = useRef(null)

  useEffect(() => {
    const phrase = '— ' + PHRASES[pi]
    timerRef.current = setInterval(() => {
      setText(prev => {
        if (typing) {
          const next = phrase.slice(0, prev.length + 1)
          if (next === phrase) { setTyping(false); clearInterval(timerRef.current); setTimeout(() => setTyping(true), 1400) }
          return next
        } else {
          const next = phrase.slice(0, prev.length - 1)
          if (next.length === 0) { setPi(p => (p + 1) % PHRASES.length); setTyping(true); clearInterval(timerRef.current) }
          return next
        }
      })
    }, 55)
    return () => clearInterval(timerRef.current)
  }, [pi, typing])

  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: 11,
      letterSpacing: '0.3em', color: 'var(--gold)',
      textTransform: 'uppercase', minHeight: 18,
      marginBottom: 28,
    }}>
      {text}<span style={{ opacity: Math.sin(Date.now() / 300) > 0 ? 1 : 0, color: 'var(--cyan)' }}>|</span>
    </div>
  )
}

function ScrambleChar({ char, delay }) {
  const CHARS = 'アイウエオカキABCDEFGHIJKLMNOPQRSTUVWXYZ#@!%&'
  const [display, setDisplay] = useState(char)
  const ref = useRef()

  useEffect(() => {
    const timeout = setTimeout(() => {
      let iter = 0
      const iv = setInterval(() => {
        setDisplay(CHARS[Math.floor(Math.random() * CHARS.length)])
        iter++
        if (iter > 6) { setDisplay(char); clearInterval(iv) }
      }, 40)
      return () => clearInterval(iv)
    }, delay)
    return () => clearTimeout(timeout)
  }, [char, delay])

  return (
    <motion.span
      ref={ref}
      whileHover={{
        y: -10, rotateX: 30, color: 'var(--cyan)',
        WebkitTextStroke: '0px',
        transition: { duration: 0.2 }
      }}
      style={{
        display: 'inline-block', transformOrigin: 'bottom center',
        cursor: 'default',
      }}
    >
      {display}
    </motion.span>
  )
}

export default function Home({ visible }) {
  const cardRef = useRef(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const springX = useSpring(rx, { stiffness: 80, damping: 20 })
  const springY = useSpring(ry, { stiffness: 80, damping: 20 })

  const rotateX = useTransform(springY, v => `${-v}deg`)
  const rotateY = useTransform(springX, v => `${v}deg`)

  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12
    rx.set(x)
    ry.set(y)
  }
  const handleMouseLeave = () => { rx.set(0); ry.set(0) }

  const name1 = 'PRATEEK'
  const name2 = 'BUILDS.'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center',
        padding: '0 8vw',
        pointerEvents: visible ? 'all' : 'none',
      }}
    >
      {/* Ghost number background */}
      <div style={{
        position: 'absolute', right: '6vw', top: '50%',
        transform: 'translateY(-50%)',
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(120px, 22vw, 260px)',
        color: 'transparent',
        WebkitTextStroke: '1px rgba(200,169,110,0.06)',
        userSelect: 'none', pointerEvents: 'none',
        lineHeight: 1,
      }}>
        PT
      </div>

      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <TypeWriter />
        </motion.div>

        {/* 3D tilt name */}
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transformStyle: 'preserve-3d',
            perspective: 800,
            rotateY,
            rotateX,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 30 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(72px, 13vw, 155px)',
              lineHeight: 0.9,
              letterSpacing: '-0.01em',
              userSelect: 'none',
            }}
          >
            <div>
              {name1.split('').map((c, i) => (
                <ScrambleChar key={i} char={c} delay={i * 80} />
              ))}
            </div>
            <div style={{ WebkitTextStroke: '1.5px var(--gold)', color: 'transparent' }}>
              {name2.split('').map((c, i) => (
                <ScrambleChar key={i} char={c} delay={300 + i * 80} />
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 'clamp(17px, 2.4vw, 28px)',
            color: 'rgba(242,236,224,0.6)',
            marginTop: 16,
          }}
        >
          Crafting <span style={{ color: 'var(--gold)', fontStyle: 'normal' }}>fast</span>, beautiful{' '}
          &amp; <span style={{ color: 'var(--gold)', fontStyle: 'normal' }}>intelligent</span> web systems
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          style={{ display: 'flex', gap: 10, marginTop: 32, flexWrap: 'wrap' }}
        >
          {TAGS.map((tag, i) => (
            <motion.div
              key={tag}
              data-hover
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -10 }}
              transition={{ delay: 0.7 + i * 0.07, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              style={{
                position: 'relative', overflow: 'hidden',
                border: '1px solid rgba(200,169,110,0.3)',
                padding: '7px 18px', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: 10,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'var(--gold)',
              }}
            >
              {tag}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
