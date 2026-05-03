import { useRef, useMemo, useEffect } from 'react'
import HeroMesh from './HeroMesh'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial, Torus } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '../hooks/useTheme'

function getSceneTheme(isDark) {
  if (typeof window === 'undefined') {
    return {
      grid: '#c8a96e',
      gridOpacity: 0.08,
      particle: '#00e8ff',
      particleOpacity: 0.55,
      gold: '#c8a96e',
      goldOpacity: 0.3,
      cyanOpacity: 0.1,
      redOpacity: 0.18,
      ambient: 0.2,
      mainLight: 0.6,
      accentLight: 0.35,
      redLight: 0.2,
    }
  }

  return !isDark
    ? {
        grid: 'rgba(55,62,86,0.85)',
        gridOpacity: 0.045,
        particle: '#0ea5c8',
        particleOpacity: 0.58,
        gold: '#8f774e',
        goldOpacity: 0.32,
        cyanOpacity: 0.2,
        redOpacity: 0.18,
        ambient: 0.3,
        mainLight: 0.78,
        accentLight: 0.56,
        redLight: 0.34,
      }
    : {
        grid: '#c8a96e',
        gridOpacity: 0.08,
        particle: '#00e8ff',
        particleOpacity: 0.55,
        gold: '#c8a96e',
        goldOpacity: 0.3,
        cyanOpacity: 0.1,
        redOpacity: 0.18,
        ambient: 0.2,
        mainLight: 0.6,
        accentLight: 0.35,
        redLight: 0.2,
      }
}

/* ─── Perspective grid that slowly tilts ─── */
function Grid() {
  const group = useRef()
  const { isDark } = useTheme()
  const sceneTheme = getSceneTheme(isDark)
  useFrame((_, dt) => { if (group.current) group.current.rotation.x += dt * 0.005 })
  const lines = useMemo(() => {
    const pts = []
    const size = 55, div = 28
    for (let i = -div; i <= div; i++) {
      const v = (i / div) * size
      pts.push([v, 0, -size, v, 0, size])
      pts.push([-size, 0, v, size, 0, v])
    }
    return pts
  }, [])
  return (
    <group ref={group} position={[0, -4.5, 0]} rotation={[-0.28, 0, 0]}>
      {lines.map((p, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(p[0], p[1], p[2]),
          new THREE.Vector3(p[3], p[4], p[5]),
        ])
        return (
          <line key={i} geometry={geo}>
            <lineBasicMaterial color={sceneTheme.grid} transparent opacity={i % 4 === 0 ? sceneTheme.gridOpacity : sceneTheme.gridOpacity * 0.55} />
          </line>
        )
      })}
    </group>
  )
}

/* ─── Floating particles ─── */
function Particles() {
  const mesh = useRef()
  const { isDark } = useTheme()
  const sceneTheme = getSceneTheme(isDark)
  const COUNT = 220
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

/* ─── Wireframe torus ─── */
function WireTorus() {
  const m = useRef()
  const { isDark } = useTheme()
  const sceneTheme = getSceneTheme(isDark)
  useFrame(({ clock }) => {
    if (!m.current) return
    const t = clock.elapsedTime
    m.current.rotation.x = t * 0.14
    m.current.rotation.z = t * 0.09
    m.current.position.y = Math.sin(t * 0.42) * 0.55
  })
  return (
    <mesh ref={m} position={[5.5, 0.5, -7]}>
      <torusGeometry args={[1.5, 0.025, 16, 140]} />
      <meshBasicMaterial color={sceneTheme.gold} transparent opacity={sceneTheme.goldOpacity} wireframe />
    </mesh>
  )
}

/* ─── Icosahedron wireframe ─── */
function WireIcosa() {
  const m = useRef()
  const { isDark } = useTheme()
  const sceneTheme = getSceneTheme(isDark)
  useFrame(({ clock }) => {
    if (!m.current) return
    const t = clock.elapsedTime
    m.current.rotation.x = t * 0.19
    m.current.rotation.y = t * 0.14
    m.current.position.y = Math.cos(t * 0.32) * 0.65 - 1
  })
  return (
    <mesh ref={m} position={[-6, 0.5, -5]}>
      <icosahedronGeometry args={[1.15, 0]} />
      <meshBasicMaterial color={sceneTheme.particle} transparent opacity={sceneTheme.cyanOpacity} wireframe />
    </mesh>
  )
}

/* ─── Octahedron wireframe (red accent) ─── */
function WireOcta() {
  const m = useRef()
  const { isDark } = useTheme()
  const sceneTheme = getSceneTheme(isDark)
  useFrame(({ clock }) => {
    if (!m.current) return
    const t = clock.elapsedTime
    m.current.rotation.x = t * 0.24
    m.current.rotation.z = t * 0.17
    m.current.position.y = Math.sin(t * 0.55 + 1) * 0.42
  })
  return (
    <mesh ref={m} position={[3.8, -2.2, -4]}>
      <octahedronGeometry args={[0.75, 0]} />
      <meshBasicMaterial color="#ff2d55" transparent opacity={sceneTheme.redOpacity} wireframe />
    </mesh>
  )
}

/* ─── Distorted glowing orb ─── */
function GlowOrb() {
  const m = useRef()
  const { isDark } = useTheme()
  const sceneTheme = getSceneTheme(isDark)
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

/* ─── Second orb (cyan) ─── */
function CyanOrb() {
  const m = useRef()
  const { isDark } = useTheme()
  const sceneTheme = getSceneTheme(isDark)
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

/* ─── Ring stack ─── */
function RingStack() {
  const group = useRef()
  const { isDark } = useTheme()
  const sceneTheme = getSceneTheme(isDark)
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
          <meshBasicMaterial color={sceneTheme.gold} transparent opacity={sceneTheme.goldOpacity * (0.5 - i * 0.1)} />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Mouse-driven camera rig ─── */
function CameraRig() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 4 })

  useEffect(() => {
    const fn = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [])

  useFrame(() => {
    target.current.x += (mouse.current.x * 1.8 - target.current.x) * 0.035
    target.current.y += (-mouse.current.y * 1.2 + 4 - target.current.y) * 0.035
    camera.position.x = target.current.x
    camera.position.y = target.current.y
    camera.lookAt(0, 0, 0)
  })
  return null
}

export default function Scene() {
  const { isDark } = useTheme()
  const sceneTheme = getSceneTheme(isDark)
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 4, 14], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <CameraRig />
        <ambientLight intensity={sceneTheme.ambient} />
        <pointLight position={[10, 10, 10]} intensity={sceneTheme.mainLight} color={sceneTheme.gold} />
        <pointLight position={[-10, -5, 5]} intensity={sceneTheme.accentLight} color={sceneTheme.particle} />
        <pointLight position={[0, 8, -8]} intensity={sceneTheme.redLight} color="#ff2d55" />
        <Grid />
        <Particles />
        <WireTorus />
        <WireIcosa />
        <WireOcta />
        <GlowOrb />
        <CyanOrb />
        <RingStack />
        <HeroMesh />
      </Canvas>
    </div>
  )
}
