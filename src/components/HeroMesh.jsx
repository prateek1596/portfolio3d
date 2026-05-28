import { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useDragControls } from '../hooks/useDragControls'

// DNA double helix made from spheres
function DNAHelix() {
  const group = useRef()
  const COUNT = 18

  const strands = useMemo(() => {
    const a = [], b = []
    for (let i = 0; i < COUNT; i++) {
      const t = (i / COUNT) * Math.PI * 4
      const r = 0.6
      a.push([Math.cos(t) * r, (i / COUNT) * 4 - 2, Math.sin(t) * r])
      b.push([Math.cos(t + Math.PI) * r, (i / COUNT) * 4 - 2, Math.sin(t + Math.PI) * r])
    }
    return { a, b }
  }, [])

  // allow parent to opt-out of animation via global reduced-motion
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  useFrame(({ clock }) => {
    if (reducedMotion) return
    if (group.current) group.current.rotation.y = clock.elapsedTime * 0.25
  })

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Strand A - gold */}
      {strands.a.map((pos, i) => (
        <mesh key={`a${i}`} position={pos}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#c8a96e" emissive="#c8a96e" emissiveIntensity={0.3} />
        </mesh>
      ))}
      {/* Strand B - cyan */}
      {strands.b.map((pos, i) => (
        <mesh key={`b${i}`} position={pos}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color="#00e8ff" emissive="#00e8ff" emissiveIntensity={0.3} />
        </mesh>
      ))}
      {/* Rungs */}
      {strands.a.map((posA, i) => {
        const posB = strands.b[i]
        const mid = [(posA[0]+posB[0])/2, (posA[1]+posB[1])/2, (posA[2]+posB[2])/2]
        const len = Math.sqrt(
          Math.pow(posB[0]-posA[0],2)+Math.pow(posB[1]-posA[1],2)+Math.pow(posB[2]-posA[2],2)
        )
        return (
          <mesh key={`r${i}`} position={mid}>
            <cylinderGeometry args={[0.012, 0.012, len, 6]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.15} />
          </mesh>
        )
      })}
    </group>
  )
}

// Orbiting torus rings around the DNA
function OrbitRings() {
  const r1 = useRef(), r2 = useRef(), r3 = useRef()
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  useFrame(({ clock }) => {
    if (reducedMotion) return
    const t = clock.elapsedTime
    if (r1.current) { r1.current.rotation.x = t * 0.5; r1.current.rotation.z = t * 0.3 }
    if (r2.current) { r2.current.rotation.y = t * 0.4; r2.current.rotation.x = t * 0.2 }
    if (r3.current) { r3.current.rotation.z = t * 0.6; r3.current.rotation.y = t * 0.15 }
  })
  return (
    <>
      <mesh ref={r1}>
        <torusGeometry args={[1.4, 0.018, 12, 100]} />
        <meshBasicMaterial color="#c8a96e" transparent opacity={0.35} />
      </mesh>
      <mesh ref={r2}>
        <torusGeometry args={[1.8, 0.012, 12, 100]} />
        <meshBasicMaterial color="#00e8ff" transparent opacity={0.2} />
      </mesh>
      <mesh ref={r3}>
        <torusGeometry args={[2.2, 0.008, 12, 100]} />
        <meshBasicMaterial color="#ff2d55" transparent opacity={0.12} />
      </mesh>
    </>
  )
}

export default function HeroMesh() {
  const groupRef = useRef()
  const rotation = useDragControls()

  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    try {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(mq.matches)
      const handler = (e) => setReducedMotion(e.matches)
      mq.addEventListener?.('change', handler)
      return () => mq.removeEventListener?.('change', handler)
    } catch (err) {
      return undefined
    }
  }, [])

  useFrame(() => {
    if (groupRef.current && rotation.current) {
      groupRef.current.rotation.x += (rotation.current.x - groupRef.current.rotation.x) * 0.1
      groupRef.current.rotation.y += (rotation.current.y - groupRef.current.rotation.y) * 0.1
    }
  })

  return (
    reducedMotion ? (
      <group ref={groupRef} position={[4.5, 0.5, -3]} scale={0.9}>
        <DNAHelix />
        <OrbitRings />
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 3, 3]} intensity={1} color="#c8a96e" />
        <pointLight position={[-3, -3, 3]} intensity={0.5} color="#00e8ff" />
      </group>
    ) : (
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <group ref={groupRef} position={[4.5, 0.5, -3]} scale={0.9}>
          <DNAHelix />
          <OrbitRings />
          <ambientLight intensity={0.5} />
          <pointLight position={[3, 3, 3]} intensity={1} color="#c8a96e" />
          <pointLight position={[-3, -3, 3]} intensity={0.5} color="#00e8ff" />
        </group>
      </Float>
    )
  )
}
