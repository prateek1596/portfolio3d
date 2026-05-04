import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const tabs = [
  { id: 'home', label: 'HOME', glyph: '⌂' },
  { id: 'work', label: 'WORK', glyph: '◈' },
  { id: 'about', label: 'ABOUT', glyph: '◉' },
  { id: 'blog', label: 'BLOG', glyph: '✦' },
  { id: 'contact', label: 'CONTACT', glyph: '◎' },
]

export default function BottomNav({ active, setActive, sounds }) {
  const collapseTimer = useRef(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateMode = () => {
      const mobile = window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(pointer: coarse)').matches
      setIsMobile(mobile)
      setIsExpanded(mobile)
    }

    updateMode()
    window.addEventListener('resize', updateMode)
    return () => window.removeEventListener('resize', updateMode)
  }, [])

  useEffect(() => {
    if (isMobile) {
      setIsExpanded(true)
    }
  }, [isMobile])

  const handleExpand = () => {
    if (isMobile) return
    if (collapseTimer.current) clearTimeout(collapseTimer.current)
    setIsExpanded(true)
  }

  const handleCollapse = () => {
    if (isMobile) return
    if (collapseTimer.current) clearTimeout(collapseTimer.current)
    collapseTimer.current = setTimeout(() => setIsExpanded(false), 200)
  }

  const navWidth = useMemo(() => {
    if (isMobile) return 'min(760px, calc(100vw - 16px))'
    return isExpanded ? 'min(760px, calc(100vw - 24px))' : 44
  }, [isExpanded, isMobile])

  return (
    <motion.nav
      onMouseEnter={handleExpand}
      onMouseLeave={handleCollapse}
      onFocusCapture={handleExpand}
      onBlurCapture={(event) => {
        if (isMobile) return
        if (!event.currentTarget.contains(event.relatedTarget)) {
          handleCollapse()
        }
      }}
      animate={{
        width: navWidth,
        height: isMobile ? 'calc(var(--nav-h) - 12px)' : isExpanded ? 'calc(var(--nav-h) - 12px)' : 44,
        opacity: 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 320,
        damping: 25,
      }}
      style={{
        position: 'fixed',
        left: '50%',
        bottom: isMobile ? 8 : 14,
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isExpanded || isMobile ? 'space-between' : 'center',
        gap: 0,
        border: '1px solid rgba(200,169,110,0.26)',
        borderRadius: 9999,
        background: 'linear-gradient(180deg, rgba(8,8,16,0.72), rgba(4,4,10,0.86))',
        backdropFilter: 'blur(22px) saturate(135%)',
        boxShadow: '0 12px 34px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 22px rgba(200,169,110,0.08)',
        overflow: 'hidden',
        zIndex: 500,
        willChange: 'transform, width, height',
      }}
    >
      {!isExpanded && !isMobile ? (
        <motion.button
          data-hover
          aria-label="Open navigation"
          onClick={handleExpand}
          onMouseEnter={() => sounds?.hover()}
          style={{
            width: 14,
            height: 14,
            border: '1px solid rgba(200,169,110,0.4)',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, rgba(200,169,110,0.6), rgba(200,169,110,0.2))',
            boxShadow: '0 0 12px rgba(200,169,110,0.25)',
            padding: 0,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        />
      ) : (
        tabs.map((tab) => {
          const isActive = active === tab.id
          return (
            <button
              key={tab.id}
              data-hover
              onClick={() => { sounds?.whoosh(); setActive(tab.id) }}
              onMouseEnter={() => sounds?.hover()}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: '1 1 0',
                minWidth: 0,
                height: '100%',
                gap: 3,
                padding: '8px 10px',
                border: 'none',
                borderLeft: tab.id === 'home' ? 'none' : '1px solid rgba(200,169,110,0.08)',
                background: 'none',
                color: isActive ? 'var(--gold)' : 'var(--text-faint)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.25em',
                fontSize: 9,
                textTransform: 'uppercase',
                transition: 'color 0.25s ease, background 0.25s ease, opacity 0.25s ease',
                overflow: 'hidden',
              }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  inset: '6px 10px auto 10px',
                  height: 34,
                  borderRadius: 9999,
                  background: isActive ? 'linear-gradient(180deg, rgba(200,169,110,0.18), rgba(200,169,110,0.08))' : 'transparent',
                  boxShadow: isActive ? '0 0 18px rgba(200,169,110,0.22), inset 0 1px 0 rgba(255,255,255,0.06)' : 'none',
                }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
              <motion.div
                style={{ position: 'absolute', inset: 0, background: isActive ? 'rgba(200,169,110,0.06)' : 'transparent' }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                style={{ fontSize: 17, lineHeight: 1, position: 'relative' }}
                animate={{ scale: isActive ? 1.05 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {tab.glyph}
              </motion.span>
              <motion.span
                style={{ position: 'relative', whiteSpace: 'nowrap' }}
                animate={{
                  opacity: 1,
                  maxHeight: 18,
                }}
                transition={{ duration: 0.2 }}
              >
                {tab.label}
              </motion.span>
            </button>
          )
        })
      )}
    </motion.nav>
  )
}
