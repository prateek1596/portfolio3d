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
      position: 'fixed', left: '50%', bottom: 14,
      transform: 'translateX(-50%)',
      width: 'min(760px, calc(100vw - 24px))',
      height: 'calc(var(--nav-h) - 12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0,
      border: '1px solid var(--panel-border)',
      borderRadius: 9999,
      background: 'linear-gradient(180deg, rgba(8,8,16,0.92), rgba(4,4,10,0.96))',
      backdropFilter: 'blur(24px)',
      boxShadow: '0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
      overflow: 'hidden',
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
              justifyContent: 'center',
              flex: '1 1 0',
              minWidth: 0,
              height: '100%',
              gap: 4,
              padding: '8px 10px',
              border: 'none',
              borderLeft: tab.id === 'home' ? 'none' : '1px solid rgba(200,169,110,0.08)',
              background: 'none',
              color: isActive ? 'var(--gold)' : 'var(--text-faint)',
              fontFamily: 'var(--font-mono)', letterSpacing: '0.25em',
              fontSize: 9, textTransform: 'uppercase',
              transition: 'color 0.3s, background 0.3s', overflow: 'hidden',
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
