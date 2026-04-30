import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Grid() {
  const groupRef = useRef()
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.008
    }
  })

  const lines = useMemo(() => {
    const pts = []
    const size = 40
    const divisions = 20
    for (let i = -divisions; i <= divisions; i++) {
      const x = (i / divisions) * size
      pts.push([x, 0, -size, x, 0, size]) // vertical lines
      pts.push([-size, 0, x, size, 0, x]) // horizontal lines
    }
    return pts
  }, [])

  return (
    <group ref={groupRef} position={[0, -3, 0]} rotation={[-0.3, 0, 0]}>
      {lines.map((p, i) => {
        const points = [new THREE.Vector3(p[0], p[1], p[2]), new THREE.Vector3(p[3], p[4], p[5])]
        const geo = new THREE.BufferGeometry().setFromPoints(points)
        return (
          <line key={i} geometry={geo}>
            <lineBasicMaterial color="#c8a96e" transparent opacity={0.06} />
          </line>
        )
      })}
    </group>
  )
}

function Particles() {
  const mesh = useRef()
  const count = 120

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sp = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20
      sp[i] = Math.random() * 0.3 + 0.05
    }
    return { positions: pos, speeds: sp }
  }, [])

  useFrame((state) => {
    if (!mesh.current) return
    const pos = mesh.current.geometry.attributes.position.array
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i] * 0.008
      if (pos[i * 3 + 1] > 10) pos[i * 3 + 1] = -10
      pos[i * 3] += Math.sin(t * speeds[i] + i) * 0.001
    }
    mesh.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#00e8ff" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

function FloatingTorus() {
  const mesh = useRef()
  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime
    mesh.current.rotation.x = t * 0.18
    mesh.current.rotation.z = t * 0.12
    mesh.current.position.y = Math.sin(t * 0.5) * 0.4
  })
  return (
    <mesh ref={mesh} position={[5, 1, -6]}>
      <torusGeometry args={[1.2, 0.04, 16, 100]} />
      <meshBasicMaterial color="#c8a96e" transparent opacity={0.25} wireframe />
    </mesh>
  )
}

function FloatingIcosa() {
  const mesh = useRef()
  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime
    mesh.current.rotation.x = t * 0.22
    mesh.current.rotation.y = t * 0.18
    mesh.current.position.y = Math.cos(t * 0.4) * 0.5 - 1
  })
  return (
    <mesh ref={mesh} position={[-5.5, 0, -5]}>
      <icosahedronGeometry args={[1.0, 0]} />
      <meshBasicMaterial color="#00e8ff" transparent opacity={0.12} wireframe />
    </mesh>
  )
}

export default function Scene() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 4, 14], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <Grid />
        <Particles />
        <FloatingTorus />
        <FloatingIcosa />
      </Canvas>
    </div>
  )
}
