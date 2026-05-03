import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlitchText from '../components/GlitchText'
import MagneticButton from '../components/MagneticButton'

// Project screenshots — use real URLs or local imports
// Placeholder: beautiful gradient preview cards
const makeGradient = (a, b) => `linear-gradient(135deg, ${a} 0%, ${b} 100%)`

const PROJECTS = [
  {
    num: '01', title: 'ADMRI', year: '2024',
    desc: 'Advanced Data & ML Research Initiative',
    long: 'Comprehensive platform for data analysis and machine learning research with advanced visualization, model training, and deployment capabilities.',
    tech: ['Python', 'FastAPI', 'React', 'TensorFlow', 'PostgreSQL'],
    color: 'var(--gold)',
    liveUrl: 'https://github.com/prateek1596?tab=repositories', githubUrl: 'https://github.com/prateek1596',
    screenshots: [
      { label: 'Dashboard', gradient: makeGradient('#1a1200', '#3d2a00'), icon: '◈', desc: 'Research dashboard with data analytics' },
      { label: 'ML Models', gradient: makeGradient('#002a1a', '#004030'), icon: '◉', desc: 'Model training and evaluation interface' },
      { label: 'Insights', gradient: makeGradient('#1a0010', '#3a0025'), icon: '◎', desc: 'Data insights and visualizations' },
    ],
  },
  {
    num: '02', title: 'MedPredict', year: '2024',
    desc: 'Multi-disease ML prediction system',
    long: 'Six ML models (LR, RF, SVM, XGBoost, LightGBM, Stacking Ensemble) with SHAP explainability, fairness analysis using Fairlearn, counterfactual exploration via DiCE, Optuna AutoML tuning, Redis caching and PWA support.',
    tech: ['FastAPI', 'XGBoost', 'LightGBM', 'SHAP', 'DiCE', 'Optuna', 'React', 'Redis', 'PostgreSQL'],
    color: 'var(--cyan)',
    liveUrl: 'https://github.com/prateek1596?tab=repositories', githubUrl: 'https://github.com/prateek1596',
    screenshots: [
      { label: 'Dashboard', gradient: makeGradient('#001a1a', '#003040'), icon: '⊞', desc: 'Disease prediction dashboard' },
      { label: 'SHAP View', gradient: makeGradient('#000d1a', '#001a30'), icon: '▣', desc: 'Model explainability analysis' },
      { label: 'Reports', gradient: makeGradient('#001a10', '#003020'), icon: '⊕', desc: 'Prediction reports and insights' },
    ],
  },
  {
    num: '03', title: 'DQC', year: '2024',
    desc: 'Dataset Quality Checker',
    long: 'CSV analysis tool with auto-clean pipeline functionality. Auto-fix/clean CSV data, generate quality reports with PDF export, and PWA support for offline use.',
    tech: ['Python', 'FastAPI', 'React', 'Vite', 'PWA', 'PDF Export'],
    color: 'var(--red)',
    liveUrl: 'https://github.com/prateek1596?tab=repositories', githubUrl: 'https://github.com/prateek1596',
    screenshots: [
      { label: 'Upload', gradient: makeGradient('#1a0005', '#30000a'), icon: '◆', desc: 'Drag-and-drop CSV upload' },
      { label: 'Analysis', gradient: makeGradient('#0d001a', '#1a0030'), icon: '◇', desc: 'Data quality analysis' },
      { label: 'Report', gradient: makeGradient('#001a1a', '#003030'), icon: '○', desc: 'Quality reports with visualizations' },
    ],
  },
  {
    num: '04', title: 'ClinicSight', year: '2024',
    desc: 'Healthcare clinic management system',
    long: 'Full-stack healthcare management platform with patient records, appointment scheduling, billing, and analytics. Built with modern tech stack and HIPAA compliance considerations.',
    tech: ['React', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'REST API', 'Authentication'],
    color: 'var(--gold)',
    liveUrl: 'https://github.com/prateek1596?tab=repositories', githubUrl: 'https://github.com/prateek1596',
    screenshots: [
      { label: 'Patients', gradient: makeGradient('#001a0d', '#003020'), icon: '↑', desc: 'Patient management interface' },
      { label: 'Appointments', gradient: makeGradient('#1a1000', '#302000'), icon: '≡', desc: 'Appointment scheduling system' },
      { label: 'Analytics', gradient: makeGradient('#0d0d1a', '#1a1a30'), icon: '≋', desc: 'Clinic analytics dashboard' },
    ],
  },
  {
    num: '05', title: 'ManhwaVault', year: '2024',
    desc: 'Mobile content scraper with notifications',
    long: 'React Native + Expo mobile app with FastAPI backend featuring a Git-based extension system. Background update checker with Expo push notifications and exponential backoff rate limiting.',
    tech: ['React Native', 'Expo', 'FastAPI', 'Git Extensions', 'Push Notifications', 'Redis'],
    color: 'var(--cyan)',
    liveUrl: 'https://github.com/prateek1596?tab=repositories', githubUrl: 'https://github.com/prateek1596',
    screenshots: [
      { label: 'Library', gradient: makeGradient('#000d1a', '#001a30'), icon: '♦', desc: 'Content library with tracking' },
      { label: 'Reader', gradient: makeGradient('#001a1a', '#003040'), icon: '⊞', desc: 'Full-screen reader with caching' },
      { label: 'Extensions', gradient: makeGradient('#001a10', '#003020'), icon: '⊕', desc: 'Git-based extension manager' },
    ],
  },
]

const SCRAMBLE = 'アイウエオカキクABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%'

function WorkItem({ project, index, visible, onOpen, sounds }) {
  const [title, setTitle] = useState(project.title)
  const [hovered, setHovered] = useState(false)

  const scramble = useCallback(() => {
    sounds?.glitch()
    const orig = project.title
    let iter = 0
    const iv = setInterval(() => {
      setTitle(orig.split('').map((c, i) => {
        if (c === ' ') return ' '
        if (i < iter * 0.55) return orig[i]
        return SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
      }).join(''))
      iter += 0.65
      if (iter > orig.length * 1.6) { setTitle(orig); clearInterval(iv) }
    }, 36)
  }, [project.title])

  return (
    <motion.div
      initial={{ opacity: 0, x: -28 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -28 }}
      transition={{ delay: 0.08 + index * 0.08, duration: 0.5, ease: 'easeOut' }}
      onMouseEnter={() => { setHovered(true); scramble() }}
      onMouseLeave={() => setHovered(false)}
      onClick={() => { onOpen(project); sounds?.whoosh() }}
      data-hover
      style={{
        display: 'grid', gridTemplateColumns: '52px 1fr 100px 28px',
        alignItems: 'center', gap: 20,
        padding: `20px 0 20px ${hovered ? 14 : 0}px`,
        borderBottom: '1px solid var(--rule-soft)',
        cursor: 'none', position: 'relative',
        transition: 'padding-left 0.3s ease',
      }}
    >
      <motion.div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: project.color, originY: 0.5 }}
        animate={{ scaleY: hovered ? 1 : 0 }} transition={{ duration: 0.22 }} />

      <span style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: hovered ? project.color : 'var(--text-ghost)', transition: 'color 0.3s', lineHeight: 1 }}>
        {project.num}
      </span>

      <div>
        <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(17px,2.2vw,24px)', color: hovered ? 'var(--text)' : 'var(--text-soft)', transition: 'all 0.3s' }}>
          {title}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)', marginTop: 4 }}>
          {project.desc}
        </div>
        <AnimatePresence>
          {hovered && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
              style={{ overflow: 'hidden', display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {project.tech.slice(0, 5).map(t => (
                <span key={t} style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', border: `1px solid ${project.color}44`, color: project.color, padding: '2px 8px' }}>{t}</span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', color: 'var(--text-ghost)', textTransform: 'uppercase', textAlign: 'right' }}>
        {project.year}
      </div>

      <motion.div animate={{ x: hovered ? 5 : 0 }} style={{ fontSize: 20, color: hovered ? project.color : 'var(--text-ghost)', transition: 'color 0.3s' }}>→</motion.div>
    </motion.div>
  )
}

/* ─── Screenshot Gallery in Modal ─── */
function ScreenshotGallery({ screenshots, color }) {
  const [active, setActive] = useState(0)

  return (
    <div style={{ marginBottom: 32 }}>
      {/* Main display */}
      <motion.div
        key={active}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          height: 200,
          background: screenshots[active].gradient,
          border: `1px solid ${color}22`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 10, marginBottom: 12,
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Animated grid lines */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(var(--grid-line-soft) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line-soft) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ fontSize: 36, position: 'relative' }}>{screenshots[active].icon}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color, position: 'relative' }}>{screenshots[active].label}</div>
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--text-faint)', position: 'relative', textAlign: 'center', maxWidth: '80%' }}>{screenshots[active].desc}</div>
      </motion.div>

      {/* Thumbnails */}
      <div style={{ display: 'flex', gap: 8 }}>
        {screenshots.map((s, i) => (
          <motion.button
            key={i}
            data-hover
            onClick={() => setActive(i)}
            whileHover={{ scale: 1.04 }}
            style={{
              flex: 1, height: 52,
              background: s.gradient,
              border: `1px solid ${i === active ? color : 'var(--panel-border)'}`,
              cursor: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, transition: 'border-color 0.2s',
            }}
          >
            {s.icon}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function Modal({ project, onClose, sounds }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={() => { onClose(); sounds?.click() }}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'var(--glass-bg-strong)', backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4vw', overflowY: 'auto' }}
    >
      <motion.div
        initial={{ scale: 0.88, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 20, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: 660, background: 'var(--panel-bg-elevated)', border: `1px solid ${project.color}22`, padding: '44px 48px', position: 'relative' }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: project.color }} />
        <button onClick={() => { onClose(); sounds?.click() }} data-hover
          style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', color: 'var(--text-faint)', fontSize: 22, cursor: 'none' }}>×</button>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: project.color, marginBottom: 10 }}>
          {project.num} · {project.year}
        </div>

        <GlitchText
          as="div"
          sounds={sounds}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,52px)', lineHeight: 0.95, marginBottom: 20 }}
        >
          {project.title}
        </GlitchText>

        {/* Screenshot gallery */}
        <ScreenshotGallery screenshots={project.screenshots} color={project.color} />

        <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 16, lineHeight: 1.75, color: 'var(--text-muted)', marginBottom: 24 }}>
          {project.long}
        </p>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 12 }}>
          Tech Stack
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
          {project.tech.map(t => (
            <motion.span key={t} whileHover={{ borderColor: project.color, color: project.color, scale: 1.04 }}
              style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', border: `1px solid ${project.color}44`, color: 'var(--text-muted)', padding: '5px 12px', cursor: 'default', transition: 'all 0.2s' }}>
              {t}
            </motion.span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <MagneticButton onClick={() => { sounds?.click(); window.open(project.liveUrl, '_blank') }} sounds={sounds}
            style={{ flex: 1, justifyContent: 'center', borderColor: project.color, color: project.color }}>
            Live Demo →
          </MagneticButton>
          <MagneticButton onClick={() => { sounds?.click(); window.open(project.githubUrl, '_blank') }} sounds={sounds}
            style={{ flex: 1, justifyContent: 'center', borderColor: 'var(--panel-border)', color: 'var(--text-muted)' }}>
            GitHub ↗
          </MagneticButton>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function Work({ visible, sounds }) {
  const [modal, setModal] = useState(null)

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.4 }}
        style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', padding: '0 8vw', pointerEvents: visible ? 'all' : 'none', overflowY: 'auto' }}
      >
        <div style={{ width: '100%', maxWidth: 720 }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 12 }} transition={{ delay: 0.05 }}
            style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}
          >
            Selected Work
            <span style={{ color: 'var(--text-ghost)', fontSize: 9 }}>— hover to preview · click to expand</span>
          </motion.div>

          {PROJECTS.map((p, i) => (
            <WorkItem key={p.num} project={p} index={i} visible={visible} onOpen={setModal} sounds={sounds} />
          ))}
        </div>
      </motion.div>

      <AnimatePresence>
        {modal && <Modal project={modal} onClose={() => setModal(null)} sounds={sounds} />}
      </AnimatePresence>
    </>
  )
}
