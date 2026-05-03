import { useRef, useEffect } from 'react'

/**
 * useDragControls - Handle 3D model rotation via drag/touch
 * Returns rotation values to apply to 3D mesh
 */
export const useDragControls = () => {
  const isDragging = useRef(false)
  const previousMousePosition = useRef({ x: 0, y: 0 })
  const rotation = useRef({ x: 0, y: 0 })
  const targetRotation = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMouseDown = (e) => {
      isDragging.current = true
      previousMousePosition.current = { x: e.clientX, y: e.clientY }
    }

    const onMouseMove = (e) => {
      if (!isDragging.current) return

      const deltaX = e.clientX - previousMousePosition.current.x
      const deltaY = e.clientY - previousMousePosition.current.y

      targetRotation.current.x += deltaY * 0.01
      targetRotation.current.y += deltaX * 0.01

      previousMousePosition.current = { x: e.clientX, y: e.clientY }
    }

    const onMouseUp = () => {
      isDragging.current = false
    }

    // Touch events for mobile
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging.current = true
        previousMousePosition.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        }
      }
    }

    const onTouchMove = (e) => {
      if (!isDragging.current || e.touches.length !== 1) return

      const deltaX = e.touches[0].clientX - previousMousePosition.current.x
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y

      targetRotation.current.x += deltaY * 0.01
      targetRotation.current.y += deltaX * 0.01

      previousMousePosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }

      e.preventDefault()
    }

    const onTouchEnd = () => {
      isDragging.current = false
    }

    // Smoothly interpolate to target rotation
    const animate = () => {
      rotation.current.x += (targetRotation.current.x - rotation.current.x) * 0.1
      rotation.current.y += (targetRotation.current.y - rotation.current.y) * 0.1
    }

    // Apply damping when not dragging
    const damp = () => {
      if (!isDragging.current) {
        targetRotation.current.x *= 0.98
        targetRotation.current.y *= 0.98
      }
    }

    const animationFrame = setInterval(() => {
      animate()
      damp()
    }, 16)

    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchstart', onTouchStart, { passive: false })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      clearInterval(animationFrame)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  return rotation
}
