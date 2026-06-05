import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from '../../hooks/useTheme'

export default function Particles() {
  const mesh = useRef()
  const { isDark } = useTheme()
  const sceneTheme = (() => {
    // minimal fallback if useTheme unavailable during server-side
    if (typeof window === 'undefined') return { particleCount: 120, particle: '#0ea5c8', particleOpacity: 0.72 }
    return getSceneTheme(isDark)
  })()
  // fallback getSceneTheme: replicate essential values used here
  function getSceneTheme(isDarkLocal) {
    return isDarkLocal ? { particleCount: 220, particle: '#00e8ff', particleOpacity: 0.55 } : { particleCount: 120, particle: '#0ea5c8', particleOpacity: 0.72 }
  }

  const COUNT = sceneTheme.particleCount
  const { pos, sp } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    const sp = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 45
      pos[i * 3 + 1] = (Math.random() - 0.5) * 26
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22
      sp[i] = Math.random() * 0.45 + 0.05
    }
    return { pos, sp }
  }, [])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const arr = mesh.current.geometry.attributes.position.array
    const t = clock.elapsedTime
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] += sp[i] * 0.007
      if (arr[i * 3 + 1] > 13) arr[i * 3 + 1] = -13
      arr[i * 3] += Math.sin(t * sp[i] * 0.4 + i) * 0.0007
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={pos} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.032} color={sceneTheme.particle} transparent opacity={sceneTheme.particleOpacity} sizeAttenuation />
    </points>
  )
}
