import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function RingStack() {
  const group = useRef()
  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.elapsedTime
    group.current.rotation.y = t * 0.08
    group.current.rotation.x = Math.sin(t * 0.3) * 0.15
    group.current.position.y = Math.sin(t * 0.25) * 0.4 + 1
  })
  return (
    <group ref={group} position={[-2, 0, -9]}>
      {[1.8, 1.4, 1.0].map((r, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + i * 0.3, 0, i * 0.5]}>
          <torusGeometry args={[r, 0.018, 12, 80]} />
          <meshBasicMaterial color={'#c8a96e'} transparent opacity={0.9 * (0.5 - i * 0.1)} />
        </mesh>
      ))}
    </group>
  )
}
