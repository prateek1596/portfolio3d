import { useRef, useEffect, useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

const PHRASES = [
  'Full Stack Developer · Builder',
  'React + FastAPI Specialist',
  'ML Systems Engineer',
  'Open to Opportunities · Chennai',
]
const TAGS = ['React', 'FastAPI', 'Python', 'Machine Learning', 'TypeScript', 'React Native']
const SCRAMBLE = 'アイウエオカキクケコサシスセソABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&'

/* ── Typewriter cycling through phrases ── */
function TypeWriter() {
  const [text, setText] = useState('')
  const [pi, setPi] = useState(0)
  const [typing, setTyping] = useState(true)
  const timer = useRef(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const phrase = '— ' + PHRASES[pi]
    timer.current = setInterval(() => {
      setText(prev => {
        if (typing) {
          const next = phrase.slice(0, prev.length + 1)
          if (next === phrase) {
            setTyping(false)
            clearInterval(timer.current)
            setTimeout(() => setTyping(true), 1500)
          }
          return next
        } else {
          const next = phrase.slice(0, prev.length - 1)
          if (next.length === 0) {
            setPi(p => (p + 1) % PHRASES.length)
            setTyping(true)
            clearInterval(timer.current)
          }
          return next
        }
      })
    }, 55)
    return () => clearInterval(timer.current)
  }, [pi, typing])

  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 530)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: 11,
      letterSpacing: '0.3em', color: 'var(--gold)',
      textTransform: 'uppercase', minHeight: 18, marginBottom: 28,
    }}>
      {text}
      <span style={{ color: 'var(--cyan)', opacity: tick % 2 === 0 ? 1 : 0 }}>|</span>
    </div>
  )
}

/* ── Individual letter with scramble-on-mount + lift-on-hover ── */
function ScrambleChar({ char, delay }) {
  const [display, setDisplay] = useState(char)
  useEffect(() => {
    const timeout = setTimeout(() => {
      let iter = 0
      const iv = setInterval(() => {
        setDisplay(SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)])
        iter++
        if (iter > 8) { setDisplay(char); clearInterval(iv) }
      }, 38)
      return () => clearInterval(iv)
    }, delay)
    return () => clearTimeout(timeout)
  }, [char, delay])

  return (
    <motion.span
      whileHover={{
        y: -14,
        color: 'var(--cyan)',
        WebkitTextStroke: '0px',
        transition: { duration: 0.15 },
      }}
      style={{ display: 'inline-block', transformOrigin: 'bottom center', cursor: 'default' }}
    >
      {display}
    </motion.span>
  )
}

/* ── Resume download button ── */
function ResumeButton({ visible }) {
  const [downloading, setDownloading] = useState(false)

  const handleClick = () => {
    setDownloading(true)
    setTimeout(() => setDownloading(false), 1800)
  }

  return (
    <motion.a
      href="/Resume%20-%20Prateek.pdf"
      download="Prateek_Resume.pdf"
      onClick={handleClick}
      data-hover
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
      transition={{ delay: 1.0, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 14,
        marginTop: 30, textDecoration: 'none', position: 'relative', overflow: 'hidden',
        border: '1px solid var(--panel-border)',
        background: 'var(--glass-bg)',
        padding: '13px 30px',
        fontFamily: 'var(--font-mono)', fontSize: 10,
        letterSpacing: '0.3em', textTransform: 'uppercase',
        color: downloading ? 'var(--text)' : 'var(--cyan)',
        transition: 'color 0.3s',
      }}
    >
      {/* Fill sweep on hover */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        animate={{ scaleX: downloading ? 1 : 0 }}
        transition={{ duration: downloading ? 0.4 : 0.3 }}
        style={{
          position: 'absolute', inset: 0,
          background: downloading ? 'var(--cyan)' : 'rgba(0,232,255,0.1)',
          transformOrigin: 'left', pointerEvents: 'none',
        }}
      />

      {/* Icon */}
      <motion.span
        animate={{ y: downloading ? [0, 4, 0] : 0 }}
        transition={{ duration: 0.6, repeat: downloading ? Infinity : 0 }}
        style={{ fontSize: 15, position: 'relative', color: 'var(--text)' }}
      >
        {downloading ? '↓' : '↓'}
      </motion.span>

      <span style={{ position: 'relative' }}>
        {downloading ? 'Downloading...' : 'Download Resume'}
      </span>

      {/* Pulse dot */}
      {downloading && (
        <motion.span
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          style={{
            width: 5, height: 5, borderRadius: '50%',
            background: 'var(--text)', position: 'relative',
          }}
        />
      )}
    </motion.a>
  )
}

export default function Home({ visible, sounds, navigate }) {
  const cardRef = useRef(null)
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const sx = useSpring(rx, { stiffness: 80, damping: 20 })
  const sy = useSpring(ry, { stiffness: 80, damping: 20 })
  const rotY = useTransform(sx, v => `${v}deg`)
  const rotX = useTransform(sy, v => `${-v}deg`)

  const onMove = (e) => {
    const r = cardRef.current?.getBoundingClientRect()
    if (!r) return
    rx.set(((e.clientX - r.left) / r.width - 0.5) * 18)
    ry.set(((e.clientY - r.top) / r.height - 0.5) * 12)
  }
  const onLeave = () => { rx.set(0); ry.set(0) }

  const ctaStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    minHeight: 48,
    padding: '0 20px',
    borderRadius: 9999,
    border: '1px solid var(--panel-border-strong)',
    background: 'linear-gradient(180deg, rgba(200,169,110,0.14), rgba(200,169,110,0.05))',
    color: 'var(--text)',
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    letterSpacing: '0.26em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    cursor: 'none',
  }

  const ghostCtaStyle = {
    ...ctaStyle,
    background: 'rgba(255,255,255,0.02)',
    color: 'var(--gold)',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', padding: '0 8vw',
        pointerEvents: visible ? 'all' : 'none',
      }}
    >
      {/* Ghost initials */}
      <div style={{
        position: 'absolute', right: '6vw', top: '50%',
        transform: 'translateY(-50%)',
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(120px, 22vw, 260px)',
          color: 'transparent',
          WebkitTextStroke: '1px var(--text-ghost)',
        userSelect: 'none', pointerEvents: 'none', lineHeight: 1,
      }}>
        PT
      </div>

      <div>
        {/* Typewriter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <TypeWriter />
        </motion.div>

        {/* 3D tilt name block */}
        <motion.div
          ref={cardRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          style={{ transformStyle: 'preserve-3d', perspective: 800, rotateY: rotY, rotateX: rotX }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 30 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(72px, 13vw, 155px)',
              lineHeight: 0.9, letterSpacing: '-0.01em', userSelect: 'none',
            }}
          >
            <div>
              {'PRATEEK'.split('').map((c, i) => (
                <ScrambleChar key={i} char={c} delay={i * 80} />
              ))}
            </div>
            <div style={{ WebkitTextStroke: '1.5px var(--gold)', color: 'transparent' }}>
              {'BUILDS.'.split('').map((c, i) => (
                <ScrambleChar key={i} char={c} delay={300 + i * 80} />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 'clamp(17px, 2.4vw, 28px)',
            color: 'var(--text-muted)', marginTop: 16,
          }}
        >
          Crafting{' '}
          <span style={{ color: 'var(--gold)', fontStyle: 'normal' }}>fast</span>,
          {' '}beautiful &amp;{' '}
          <span style={{ color: 'var(--gold)', fontStyle: 'normal' }}>intelligent</span>
          {' '}web systems
        </motion.div>

        {/* Tech tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}
        >
          {TAGS.map((tag, i) => (
            <motion.div
              key={tag}
              data-hover
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -10 }}
              transition={{ delay: 0.7 + i * 0.07 }}
              whileHover={{ scale: 1.06, borderColor: 'rgba(200,169,110,0.7)' }}
              style={{
                border: '1px solid rgba(200,169,110,0.28)',
                padding: '7px 18px', cursor: 'none',
                fontFamily: 'var(--font-mono)', fontSize: 10,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'var(--gold)', transition: 'border-color 0.2s',
              }}
            >
              {tag}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 18 }}
          transition={{ delay: 0.82, duration: 0.5 }}
          style={{ display: 'flex', gap: 12, marginTop: 30, flexWrap: 'wrap' }}
        >
          <motion.button
            data-hover
            onClick={() => { sounds?.click(); navigate?.('work') }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={ctaStyle}
          >
            View Work
            <span aria-hidden="true">→</span>
          </motion.button>

          <motion.button
            data-hover
            onClick={() => { sounds?.click(); navigate?.('contact') }}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={ghostCtaStyle}
          >
            Contact Me
          </motion.button>
        </motion.div>

        {/* Resume CTA */}
        <ResumeButton visible={visible} />
      </div>
    </motion.div>
  )
}
