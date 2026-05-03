import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const RADAR_SKILLS = [
  { label: 'Frontend', value: 90 },
  { label: 'Backend',  value: 85 },
  { label: 'ML / AI',  value: 80 },
  { label: 'Mobile',   value: 72 },
  { label: 'DevOps',   value: 60 },
  { label: 'Design',   value: 68 },
]

const BAR_SKILLS = [
  { label: 'React / Vite',     pct: 92, color: 'var(--cyan)' },
  { label: 'Python / FastAPI', pct: 88, color: 'var(--gold)' },
  { label: 'Machine Learning', pct: 80, color: 'var(--red)'  },
  { label: 'TypeScript',       pct: 78, color: 'var(--cyan)' },
  { label: 'React Native',     pct: 72, color: 'var(--gold)' },
  { label: 'Three.js / R3F',   pct: 65, color: 'var(--cyan)' },
]

function polarToXY(angle, r, cx, cy) {
  const rad = (angle - 90) * (Math.PI / 180)
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)]
}

function RadarChart({ visible }) {
  const [progress, setProgress] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    if (!visible || done.current) return
    done.current = true
    let p = 0
    const iv = setInterval(() => {
      p = Math.min(p + 0.04, 1)
      setProgress(p)
      if (p >= 1) clearInterval(iv)
    }, 20)
    return () => clearInterval(iv)
  }, [visible])

  const size = 200
  const cx = size / 2, cy = size / 2
  const maxR = size * 0.38
  const N = RADAR_SKILLS.length
  const levels = [0.25, 0.5, 0.75, 1.0]

  // Web polygon
  const dataPoints = RADAR_SKILLS.map((s, i) => {
    const angle = (i / N) * 360
    const r = (s.value / 100) * maxR * progress
    return polarToXY(angle, r, cx, cy)
  })
  const polyline = dataPoints.map(p => p.join(',')).join(' ')

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        {/* Grid rings */}
        {levels.map((l, li) => {
          const pts = Array.from({ length: N }, (_, i) => {
            const angle = (i / N) * 360
            return polarToXY(angle, maxR * l, cx, cy).join(',')
          }).join(' ')
          return (
            <polygon key={li} points={pts}
              fill="none" stroke="var(--panel-border)" strokeWidth={1} />
          )
        })}
        {/* Spokes */}
        {RADAR_SKILLS.map((_, i) => {
          const angle = (i / N) * 360
          const [x, y] = polarToXY(angle, maxR, cx, cy)
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--rule-soft)" strokeWidth={1} />
        })}
        {/* Data polygon */}
        <motion.polygon
          points={polyline}
          fill="var(--gold-dim)"
          stroke="var(--gold)"
          strokeWidth={1.5}
          initial={{ opacity: 0 }}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ delay: 0.3 }}
        />
        {/* Data dots */}
        {dataPoints.map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y} r={3}
            fill="var(--gold)" opacity={visible ? 1 : 0} />
        ))}
        {/* Labels */}
        {RADAR_SKILLS.map((s, i) => {
          const angle = (i / N) * 360
          const [x, y] = polarToXY(angle, maxR + 18, cx, cy)
          return (
            <text key={i} x={x} y={y}
              textAnchor="middle" dominantBaseline="middle"
              fill="var(--text-faint)"
              fontSize={8} fontFamily="var(--font-mono)"
              style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}
            >
              {s.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}

function SkillBar({ label, pct, color, visible, index }) {
  const [width, setWidth] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    if (!visible || done.current) return
    done.current = true
    const timeout = setTimeout(() => {
      let w = 0
      const iv = setInterval(() => {
        w = Math.min(w + pct / 30, pct)
        setWidth(w)
        if (w >= pct) clearInterval(iv)
      }, 20)
      return () => clearInterval(iv)
    }, index * 80)
    return () => clearTimeout(timeout)
  }, [visible, pct, index])

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -20 }}
      transition={{ delay: 0.2 + index * 0.07 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color }}>{Math.round(width)}%</span>
      </div>
      <div style={{ height: 2, background: 'var(--rule-soft)', position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: width + '%', background: color,
          transition: 'width 0.05s linear',
          boxShadow: `0 0 8px ${color}88`,
        }} />
      </div>
    </motion.div>
  )
}

export default function SkillChart({ visible }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start', marginTop: 36, maxWidth: 640 }}>
      {/* Radar */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 16 }}>Skill Radar</div>
        <RadarChart visible={visible} />
      </div>

      {/* Bars */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: 16 }}>Proficiency</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {BAR_SKILLS.map((s, i) => (
            <SkillBar key={s.label} {...s} visible={visible} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
