import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const mouse = useRef({ x: 0, y: 0 })
  const ring = useRef({ x: 0, y: 0 })
  const raf = useRef(null)

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top = e.clientY + 'px'
      }
    }

    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.1
      ring.current.y += (mouse.current.y - ring.current.y) * 0.1
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x + 'px'
        ringRef.current.style.top = ring.current.y + 'px'
      }
      raf.current = requestAnimationFrame(animate)
    }

    const onEnter = () => setHovered(true)
    const onLeave = () => setHovered(false)

    document.addEventListener('mousemove', onMove)
    raf.current = requestAnimationFrame(animate)

    const els = document.querySelectorAll('button, a, [data-hover]')
    els.forEach(el => { el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave) })

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  const dotSize = hovered ? 6 : 10
  const ringSize = hovered ? 56 : 38
  const ringBorder = hovered ? 'var(--cyan)' : 'var(--gold)'

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', width: dotSize, height: dotSize,
        background: 'var(--cyan)', borderRadius: '50%',
        transform: 'translate(-50%,-50%)', pointerEvents: 'none',
        zIndex: 9999, mixBlendMode: 'difference',
        transition: 'width 0.2s, height 0.2s',
      }} />
      <div ref={ringRef} style={{
        position: 'fixed', width: ringSize, height: ringSize,
        border: `1px solid ${ringBorder}`, borderRadius: '50%',
        transform: 'translate(-50%,-50%)', pointerEvents: 'none',
        zIndex: 9998,
        transition: 'width 0.3s, height 0.3s, border-color 0.3s',
      }} />
    </>
  )
}
