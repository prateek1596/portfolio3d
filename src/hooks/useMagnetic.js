import { useRef, useCallback } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

export function useMagnetic(strength = 0.35) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 18 })
  const sy = useSpring(y, { stiffness: 200, damping: 18 })

  const onMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * strength)
    y.set((e.clientY - cy) * strength)
  }, [strength])

  const onLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [])

  return { ref, sx, sy, onMove, onLeave }
}
