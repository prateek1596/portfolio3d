import { useEffect, useRef, useState } from 'react'

export default function Cursor() {
  const dotRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top = e.clientY + 'px'
      }
    }

    const onEnter = () => setHovered(true)
    const onLeave = () => setHovered(false)

    document.addEventListener('mousemove', onMove)

    const els = document.querySelectorAll('button, a, [data-hover]')
    els.forEach(el => { el.addEventListener('mouseenter', onEnter); el.addEventListener('mouseleave', onLeave) })

    return () => {
      document.removeEventListener('mousemove', onMove)
    }
  }, [])

  const dotSize = hovered ? 6 : 10

  return (
    <>
      <div ref={dotRef} style={{
        position: 'fixed', width: dotSize, height: dotSize,
        background: 'var(--cyan)', borderRadius: '50%',
        transform: 'translate(-50%,-50%)', pointerEvents: 'none',
        zIndex: 9999, mixBlendMode: 'var(--cursor-mix)',
        transition: 'width 0.2s, height 0.2s',
      }} />
    </>
  )
}
