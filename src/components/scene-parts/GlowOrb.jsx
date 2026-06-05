import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Sphere, MeshDistortMaterial } from '@react-three/drei'
import { useTheme } from '../../hooks/useTheme'

export default function GlowOrb() {
  const m = useRef()
  const { isDark } = useTheme()
  const sceneTheme = isDark ? { gold: '#c8a96e', goldOpacity: 0.3, fogColor: '#04040a', fogDensity: 0.018 } : { gold: '#8f774e', goldOpacity: 0.42, fogColor: '#ece6da', fogDensity: 0.032 }
  useFrame(({ clock }) => {
    if (m.current?.material) {
      m.current.material.distort = 0.28 + Math.sin(clock.elapsedTime * 0.48) * 0.14
    }
  })
  return (
    <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.7}>
      <Sphere ref={m} args={[0.95, 64, 64]} position={[-4.5, 2.2, -6.5]}>
        <MeshDistortMaterial color={sceneTheme.gold} transparent opacity={sceneTheme.goldOpacity * 0.45} distort={0.3} speed={2} />
      </Sphere>
    </Float>
  )
}
