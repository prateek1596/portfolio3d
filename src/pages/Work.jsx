import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'

const PROJECTS = [
  {
    num: '01',
    title: 'MedPredict',
    desc: 'Multi-disease ML prediction system',
    tech: ['FastAPI', 'XGBoost', 'SHAP', 'React', 'Redis'],
    year: '2024',
  },
  {
    num: '02',
    title: 'ManhwaVault',
    desc: 'Mobile scraper with push notifications',
    tech: ['React Native', 'Expo', 'FastAPI', 'Git Extensions'],
    year: '2024',
  },
  {
    num: '03',
    title: 'DRAMS',
    desc: 'Real-time disaster resource management',
    tech: ['React', 'Tailwind', 'RBAC', 'CRUD'],
    year: '2024',
  },
  {
    num: '04',
    title: 'Dataset Quality Checker',
    desc: 'CSV analysis with auto-clean pipeline',
    tech: ['Python', 'FastAPI', 'React', 'PWA'],
    year: '2024',
  },
  {
    num: '05',
    title: 'PokéCursor VSCode',
    desc: 'Sprite companion VS Code extension',
    tech: ['TypeScript', 'WebView API', 'Extension API'],
    year: '2023',
  },
]

const SCRAMBLE_CHARS = 'アイウエオカキクABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%'

function WorkItem({ project, index, visible }) {
  const [title, setTitle] = useState(project.title)
  const [hovered, setHovered] = useState(false)

  const scramble = useCallback(() => {
    const orig = project.title
    let iter = 0
    const iv = setInterval(() => {
      setTitle(orig.split('').map((c, i) => {
        if (c === ' ') return ' '
        if (i < iter * 0.6) return orig[i]
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      }).join(''))
      iter += 0.7
      if (iter > orig.length * 1.5) { setTitle(orig); clearInterval(iv) }
    }, 38)
  }, [project.title])

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -30 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.5, ease: 'easeOut' }}
      onMouseEnter={() => { setHovered(true); scramble() }}
      onMouseLeave={() => setHovered(false)}
      data-hover
      style={{
        display: 'grid',
        gridTemplateColumns: '52px 1fr 28px',
        alignItems: 'center',
        gap: 20, padding: '20px 0',
        borderBottom: '1px solid rgba(242,236,224,0.06)',
        cursor: 'pointer', position: 'relative',
        paddingLeft: hovered ? 14 : 0,
        transition: 'padding-left 0.3s ease',
      }}
    >
      {/* Left accent bar */}
      <motion.div
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: 2, background: 'var(--cyan)',
          originY: 0.5,
        }}
        animate={{ scaleY: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      />

      {/* Number */}
      <span style={{
        fontFamily: 'var(--font-display)', fontSize: 30,
        color: hovered ? 'var(--gold)' : 'rgba(200,169,110,0.25)',
        transition: 'color 0.3s', lineHeight: 1,
      }}>{project.num}</span>

      {/* Content */}
      <div>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(18px, 2.2vw, 26px)',
          color: hovered ? 'var(--white)' : 'rgba(242,236,224,0.85)',
          transition: 'color 0.3s',
          letterSpacing: hovered ? '0.02em' : 0,
          transition: 'all 0.3s',
        }}>{title}</div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'rgba(242,236,224,0.38)', marginTop: 4,
        }}>{project.desc}</div>
        <motion.div
          animate={{ height: hovered ? 'auto' : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ overflow: 'hidden', display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: hovered ? 8 : 0 }}
        >
          {project.tech.map(t => (
            <span key={t} style={{
              fontFamily: 'var(--font-mono)', fontSize: 9,
              letterSpacing: '0.15em', textTransform: 'uppercase',
              border: '1px solid rgba(0,232,255,0.25)',
              color: 'var(--cyan)', padding: '2px 9px',
            }}>{t}</span>
          ))}
        </motion.div>
      </div>

      {/* Arrow */}
      <motion.span
        animate={{ x: hovered ? 4 : 0, color: hovered ? 'var(--cyan)' : 'rgba(242,236,224,0.15)' }}
        transition={{ duration: 0.2 }}
        style={{ fontSize: 20 }}
      >→</motion.span>
    </motion.div>
  )
}

export default function Work({ visible }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center',
        padding: '0 8vw',
        pointerEvents: visible ? 'all' : 'none',
        overflowY: 'auto',
      }}
    >
      <div style={{ width: '100%', maxWidth: 680 }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }}
          transition={{ delay: 0.05, duration: 0.4 }}
          style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            letterSpacing: '0.4em', textTransform: 'uppercase',
            color: 'var(--red)', marginBottom: 20,
          }}
        >
          Selected Work
        </motion.div>
        {PROJECTS.map((p, i) => (
          <WorkItem key={p.num} project={p} index={i} visible={visible} />
        ))}
      </div>
    </motion.div>
  )
}
