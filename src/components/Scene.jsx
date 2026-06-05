/* eslint-disable react-hooks/immutability */
import { useRef, useMemo, useEffect, lazy, Suspense } from 'react'
const HeroMesh = lazy(() => import('./HeroMesh'))
const Particles = lazy(() => import('./scene-parts/Particles'))
const GlowOrb = lazy(() => import('./scene-parts/GlowOrb'))
const CyanOrb = lazy(() => import('./scene-parts/CyanOrb'))
const RingStack = lazy(() => import('./scene-parts/RingStack'))
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial, Torus } from '@react-three/drei'
import * as THREE from 'three'
import { useReducedMotion } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'

function getSceneTheme(isDark) {
  if (typeof window === 'undefined') {
    return {
      grid: '#c8a96e',
      gridOpacity: 0.08,
      gridDivisions: 28,
      fogColor: '#04040a',
      fogDensity: 0.018,
      particleCount: 220,
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
        grid: '#373e56',
        gridOpacity: 0.034,
        gridDivisions: 20,
        fogColor: '#ece6da',
        fogDensity: 0.032,
        particleCount: 120,
        particle: '#0ea5c8',
        particleOpacity: 0.72,
        gold: '#8f774e',
        goldOpacity: 0.42,
        cyanOpacity: 0.24,
        redOpacity: 0.22,
        ambient: 0.4,
        mainLight: 0.88,
        accentLight: 0.62,
        redLight: 0.42,
      }
    : {
        grid: '#c8a96e',
        gridOpacity: 0.08,
        gridDivisions: 28,
        fogColor: '#04040a',
        fogDensity: 0.018,
        particleCount: 220,
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
    const size = 55, div = sceneTheme.gridDivisions
    for (let i = -div; i <= div; i++) {
      const v = (i / div) * size
      pts.push([v, 0, -size, v, 0, size])
      pts.push([-size, 0, v, size, 0, v])
    }
    return pts
  }, [sceneTheme.gridDivisions])
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

export default function Scene({ active }) {
  const { isDark } = useTheme()
  const reduceMotion = useReducedMotion()
  const sceneTheme = getSceneTheme(isDark)

  if (reduceMotion) {
    return (
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: `radial-gradient(circle at 20% 20%, ${sceneTheme.gold}18, transparent 28%), radial-gradient(circle at 80% 75%, ${sceneTheme.particle}12, transparent 26%), linear-gradient(180deg, ${sceneTheme.fogColor} 0%, ${sceneTheme.fogColor} 100%)`,
          pointerEvents: 'none',
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 'auto 12% 12%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
          opacity: 0.25,
        }} />
        <div style={{
          position: 'absolute',
          inset: '18% 16% auto auto',
          width: 220,
          height: 220,
          borderRadius: '50%',
          border: '1px solid rgba(200,169,110,0.1)',
          filter: 'blur(1px)',
        }} />
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 4, 14], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
      >
        <fogExp2 attach="fog" args={[sceneTheme.fogColor, sceneTheme.fogDensity]} />
        <CameraRig />
        <ambientLight intensity={sceneTheme.ambient} />
        <pointLight position={[10, 10, 10]} intensity={sceneTheme.mainLight} color={sceneTheme.gold} />
        <pointLight position={[-10, -5, 5]} intensity={sceneTheme.accentLight} color={sceneTheme.particle} />
        <pointLight position={[0, 8, -8]} intensity={sceneTheme.redLight} color="#ff2d55" />
        <Grid />
        <Suspense fallback={null}><Particles /></Suspense>
        <WireTorus />
        <WireIcosa />
        <WireOcta />
        <Suspense fallback={null}><GlowOrb /></Suspense>
        <Suspense fallback={null}><CyanOrb /></Suspense>
        <Suspense fallback={null}><RingStack /></Suspense>
        {/* Hide the HeroMesh decorative cluster on the Contact page */}
        {active !== 'contact' && (
          <Suspense fallback={null}>
            <HeroMesh />
          </Suspense>
        )}
      </Canvas>
    </div>
  )
}
