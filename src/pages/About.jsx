import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

function CountUp({ target, visible }) {
  const [val, setVal] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    if (!visible || done.current) return
    done.current = true
    let current = 0
    const step = target / 28
    const iv = setInterval(() => {
      current = Math.min(current + step, target)
      setVal(Math.floor(current))
      if (current >= target) clearInterval(iv)
    }, 55)
    return () => clearInterval(iv)
  }, [visible, target])

  return <>{val}</>
}

const SKILLS = [
  { cat: 'Frontend', items: ['React', 'Vite', 'TailwindCSS', 'React Native', 'Framer Motion'] },
  { cat: 'Backend', items: ['FastAPI', 'Python', 'PostgreSQL', 'Redis', 'REST APIs'] },
  { cat: 'ML / AI', items: ['XGBoost', 'LightGBM', 'SHAP', 'Optuna', 'scikit-learn'] },
  { cat: 'Tooling', items: ['Git', 'Vite', 'Docker', 'Vercel', 'VS Code Extension API'] },
]

export default function About({ visible }) {
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
      <div style={{ maxWidth: 820, width: '100%' }}>
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 30 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(48px, 8vw, 96px)',
            lineHeight: 0.92, letterSpacing: '-0.01em',
          }}
        >
          <div>I BUILD</div>
          <div style={{ WebkitTextStroke: '1.5px var(--gold)', color: 'transparent' }}>THINGS</div>
          <div>THAT WORK.</div>
        </motion.div>

        {/* Bio */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-serif)', fontStyle: 'italic',
            fontSize: 'clamp(15px, 1.7vw, 20px)',
            lineHeight: 1.7, color: 'rgba(242,236,224,0.65)',
            maxWidth: 520, marginTop: 24,
          }}
        >
          Final-year developer from <span style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Chennai</span>. 
          I build end-to-end systems — ML pipelines, mobile apps, browser extensions — 
          whatever the problem needs. I ship clean, fast, and with intention.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 1, marginTop: 36,
            border: '1px solid rgba(200,169,110,0.12)',
            maxWidth: 480,
          }}
        >
          {[['5+', 'Projects shipped'], ['6', 'ML models built'], ['8', 'Stack layers deep']].map(([n, l], i) => (
            <div key={i} style={{
              padding: '18px 22px',
              background: 'rgba(200,169,110,0.04)',
            }}>
              <div style={{
                fontFamily: 'var(--font-display)', fontSize: 44,
                color: 'var(--gold)', lineHeight: 1,
              }}>
                {n.includes('+') ? <><CountUp target={parseInt(n)} visible={visible} />+</> : <CountUp target={parseInt(n)} visible={visible} />}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: 'rgba(242,236,224,0.38)', marginTop: 5,
              }}>{l}</div>
            </div>
          ))}
        </motion.div>

        {/* Skills grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginTop: 30, maxWidth: 600 }}
        >
          {SKILLS.map((s, i) => (
            <div key={i}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                letterSpacing: '0.35em', textTransform: 'uppercase',
                color: 'var(--red)', marginBottom: 8,
              }}>{s.cat}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {s.items.map(item => (
                  <span key={item} style={{
                    fontFamily: 'var(--font-mono)', fontSize: 9,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    border: '1px solid rgba(242,236,224,0.12)',
                    color: 'rgba(242,236,224,0.55)',
                    padding: '3px 9px',
                  }}>{item}</span>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
