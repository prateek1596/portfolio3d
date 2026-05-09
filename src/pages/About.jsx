import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import SkillChart from '../components/SkillChart'
import GitHubStats from '../components/GitHubStats'
import { useScrollStory } from '../hooks/useScrollStory'

function CountUp({ target, visible, suffix = '' }) {
  const [val, setVal] = useState(0)
  const done = useRef(false)
  useEffect(() => {
    if (!visible || done.current) return
    done.current = true
    let cur = 0
    const iv = setInterval(() => {
      cur = Math.min(cur + target / 28, target)
      setVal(Math.floor(cur))
      if (cur >= target) clearInterval(iv)
    }, 55)
    return () => clearInterval(iv)
  }, [visible, target])
  return <>{val}{suffix}</>
}

const STATS = [
  { n: 5, suffix: '+', label: 'Projects shipped' },
  { n: 6, suffix: '',  label: 'ML models built'  },
  { n: 8, suffix: '',  label: 'Stack layers deep' },
]

const TIMELINE = [
  { year: '2025', event: 'Building portfolio + open to roles' },
  { year: '2024', event: 'Built MedPredict, DRAMS, ManhwaVault, DQC' },
  { year: '2023', event: 'PokéCursor VSCode extension' },
  { year: '2022', event: 'Started full-stack journey' },
]

const FOCUS_AREAS = [
  {
    title: 'End-to-end product builds',
    body: 'From idea to deployed system: frontend, backend, data model, and delivery details tuned together.',
  },
  {
    title: 'ML features with useful UX',
    body: 'Models are most valuable when the interface explains outcomes clearly and makes action obvious.',
  },
  {
    title: 'Motion with restraint',
    body: 'Interactive polish matters, but only when it helps people understand, navigate, or trust the product.',
  },
]

export default function About({ visible, sounds }) {
  const containerRef = useRef(null)
  useScrollStory(containerRef)
  const { scrollYProgress } = useScroll({ container: containerRef })
  const rawY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const parallaxY = useSpring(rawY, { stiffness: 60, damping: 20 })

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', pointerEvents: visible ? 'all' : 'none' }}
    >
      <div style={{ minHeight: '100%', padding: '40px 8vw 60px', maxWidth: 900 }}>

        {/* Parallax headline */}
        <motion.div
          data-scroll-heading
          style={{ y: parallaxY }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 40 }}
          transition={{ delay: 0.1, duration: 0.7 }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(50px,8.5vw,100px)', lineHeight: 0.92, letterSpacing: '-0.01em', marginBottom: 28 }}>
            <div>I BUILD</div>
            <div style={{ WebkitTextStroke: '1.5px var(--gold)', color: 'transparent' }}>THINGS</div>
            <div>THAT WORK.</div>
          </div>
        </motion.div>

        {/* Positioning strip */}
        <motion.div
          data-scroll-content
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
          transition={{ delay: 0.22, duration: 0.55 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            alignItems: 'center',
            marginBottom: 26,
          }}
        >
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--gold)',
            border: '1px solid var(--panel-border)',
            padding: '8px 12px',
            background: 'rgba(255,255,255,0.02)',
          }}>
            Builder · Chennai · Remote
          </span>
          <span style={{
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            fontSize: 16,
            color: 'var(--text-muted)',
          }}>
            I focus on products that feel fast, clear, and worth returning to.
          </span>
        </motion.div>

        {/* Bio */}
        <motion.p
          data-scroll-content
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 'clamp(15px,1.7vw,20px)', lineHeight: 1.75, color: 'var(--text-muted)', maxWidth: 520, marginBottom: 36 }}
        >
          Final-year developer from{' '}
          <span style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Chennai</span>.
          I build end-to-end systems — ML pipelines, mobile apps, browser extensions —
          whatever the problem needs. I ship clean, fast, and with intention.
        </motion.p>

        {/* Focus areas */}
        <motion.div
          data-scroll-content
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ delay: 0.4, duration: 0.55 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 14,
            marginBottom: 38,
          }}
        >
          {FOCUS_AREAS.map((item) => (
            <div key={item.title} style={{
              border: '1px solid var(--panel-border)',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
              padding: '18px 18px 20px',
              minHeight: 156,
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: 'var(--cyan)',
                marginBottom: 10,
              }}>
                Focus
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 24,
                color: 'var(--text)',
                lineHeight: 0.95,
                marginBottom: 12,
              }}>
                {item.title}
              </div>
              <div style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: 14,
                lineHeight: 1.65,
                color: 'var(--text-muted)',
              }}>
                {item.body}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          data-scroll-content
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ delay: 0.45 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, marginBottom: 40, border: '1px solid var(--panel-border)', maxWidth: 480 }}
        >
          {STATS.map(({ n, suffix, label }, i) => (
            <div key={i} style={{ padding: '18px 22px', background: 'var(--panel-bg)' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 46, color: 'var(--gold)', lineHeight: 1 }}>
                <CountUp target={n} suffix={suffix} visible={visible} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-faint)', marginTop: 5 }}>{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Skill Chart — radar + bars */}
        <motion.div
          data-scroll-content
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ delay: 0.55 }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 4 }}>Skills</div>
          <SkillChart visible={visible} />
        </motion.div>

        {/* CTA strip */}
        <motion.div
          data-scroll-content
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 18 }}
          transition={{ delay: 0.62, duration: 0.5 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            marginTop: 32,
            marginBottom: 30,
            alignItems: 'center',
          }}
        >
          <motion.a
            href="mailto:prateekyadav1596@gmail.com?subject=Portfolio%20Conversation"
            data-hover
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              minHeight: 48,
              padding: '0 18px',
              border: '1px solid var(--panel-border-strong)',
              background: 'linear-gradient(180deg, rgba(200,169,110,0.12), rgba(200,169,110,0.04))',
              color: 'var(--gold)',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            Start a conversation
            <span aria-hidden="true">→</span>
          </motion.a>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            color: 'var(--text-faint)',
          }}>
            Best fit: product builds, ML-powered tools, and polished frontend systems.
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          data-scroll-content
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ delay: 0.7 }}
          style={{ marginTop: 44, paddingTop: 28, borderTop: '1px solid var(--rule-soft)' }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 20 }}>Timeline</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {TIMELINE.map(({ year, event }, i) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -16 }}
                transition={{ delay: 0.8 + i * 0.08 }}
                style={{ display: 'grid', gridTemplateColumns: '80px 1px 1fr', gap: '0 20px', alignItems: 'stretch', paddingBottom: 20 }}
              >
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--gold)', textAlign: 'right', paddingTop: 2 }}>{year}</div>
                <div style={{ background: 'var(--rule)', position: 'relative' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)' }} />
                </div>
                <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--text-muted)', paddingTop: 4 }}>{event}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Vibe footer */}
        <motion.div
          data-scroll-content
          initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0 }} transition={{ delay: 1.0 }}
          style={{ display: 'flex', gap: 40, flexWrap: 'wrap', marginTop: 24, paddingTop: 28, borderTop: '1px solid var(--rule-soft)' }}
        >
          {[{ label: 'Currently', val: 'Final year student' }, { label: 'Based in', val: 'Chennai, India' }, { label: 'Interests', val: 'Manhwa · ML · Dev tools' }].map(({ label, val }) => (
            <div key={label}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'var(--text-ghost)', marginBottom: 5 }}>{label}</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--gold)' }}>{val}</div>
            </div>
          ))}
        </motion.div>

        {/* GitHub Stats */}
        <motion.div
          data-scroll-content
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
          transition={{ delay: 1.1 }}
        >
          <GitHubStats username="prateek1596" />
        </motion.div>

      </div>
    </motion.div>
  )
}
