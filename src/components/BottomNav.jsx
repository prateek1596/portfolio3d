import { motion } from 'framer-motion'

const tabs = [
  { id: 'home',    label: 'HOME',    glyph: '⌂' },
  { id: 'work',    label: 'WORK',    glyph: '◈' },
  { id: 'about',   label: 'ABOUT',   glyph: '◉' },
  { id: 'blog',    label: 'BLOG',    glyph: '✦' },
  { id: 'contact', label: 'CONTACT', glyph: '◎' },
]

export default function BottomNav({ active, setActive, sounds }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: 'var(--nav-h)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2,
      borderTop: '1px solid var(--panel-border)',
      background: 'var(--glass-bg-strong)', backdropFilter: 'blur(24px)',
      zIndex: 500,
    }}>
      {tabs.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            data-hover
            onClick={() => { sounds?.whoosh(); setActive(tab.id) }}
            onMouseEnter={() => sounds?.hover()}
            style={{
              position: 'relative',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 5, padding: '10px 28px', border: 'none',
              background: 'none',
              color: isActive ? 'var(--gold)' : 'var(--text-faint)',
              fontFamily: 'var(--font-mono)', letterSpacing: '0.25em',
              fontSize: 9, textTransform: 'uppercase',
              transition: 'color 0.3s', overflow: 'hidden',
            }}
          >
            <motion.div
              style={{ position: 'absolute', top: 0, left: '50%', x: '-50%', height: 2, background: 'var(--gold)', borderRadius: 1 }}
              animate={{ width: isActive ? '60%' : '0%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
            <motion.div
              style={{ position: 'absolute', inset: 0, background: isActive ? 'rgba(200,169,110,0.1)' : 'transparent' }}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              style={{ fontSize: 17, lineHeight: 1, position: 'relative' }}
              animate={{ y: isActive ? -2 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {tab.glyph}
            </motion.span>
            <span style={{ position: 'relative' }}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
