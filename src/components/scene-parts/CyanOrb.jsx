import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sphere, MeshWobbleMaterial } from '@react-three/drei'
import { useTheme } from '../../hooks/useTheme'

export default function CyanOrb() {
  const m = useRef()
  const { isDark } = useTheme()
  const sceneTheme = isDark ? { particle: '#00e8ff', cyanOpacity: 0.1 } : { particle: '#0ea5c8', cyanOpacity: 0.24 }
  useFrame(({ clock }) => {
    if (m.current?.material) {
      m.current.material.factor = 0.4 + Math.sin(clock.elapsedTime * 0.6) * 0.2
    }
  })
  return (
    <Float speed={1.1} rotationIntensity={0.4} floatIntensity={0.9}>
      <Sphere ref={m} args={[0.55, 32, 32]} position={[6, -1.5, -5]}>
        <MeshWobbleMaterial color={sceneTheme.particle} transparent opacity={sceneTheme.cyanOpacity} factor={0.4} speed={2} />
      </Sphere>
    </Float>
  )
}
