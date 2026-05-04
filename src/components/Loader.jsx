import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

const LOADING_WORDS = ['INITIALIZING', 'LOADING ASSETS', 'BUILDING WORLD', 'ALMOST THERE']

function SkeletonBone({ start, end, radius = 0.08, color = '#c8a96e', opacity = 0.9 }) {
  const meshRef = useRef()
  const startVec = useMemo(() => new THREE.Vector3(...start), [start])
  const endVec = useMemo(() => new THREE.Vector3(...end), [end])

  useEffect(() => {
    if (!meshRef.current) return
    const direction = new THREE.Vector3().subVectors(endVec, startVec)
    const length = direction.length()
    const mid = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5)
    meshRef.current.position.copy(mid)
    meshRef.current.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.normalize()
    )
    meshRef.current.scale.set(1, length, 1)
  }, [endVec, startVec])

  return (
    <mesh ref={meshRef}>
      <cylinderGeometry args={[radius, radius, 1, 8]} />
      <meshStandardMaterial color={color} transparent opacity={opacity} roughness={0.35} metalness={0.2} />
    </mesh>
  )
}

function SkeletonFigure() {
  const group = useRef()

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.elapsedTime
    group.current.rotation.y = t * 0.45
    group.current.rotation.z = Math.sin(t * 0.65) * 0.06
  })

  const bones = useMemo(() => ([
    { start: [0, 1.95, 0], end: [0, 1.25, 0], radius: 0.16 },
    { start: [0, 1.25, 0], end: [0, 0.4, 0], radius: 0.12 },
    { start: [0, 1.75, 0], end: [-0.65, 1.2, 0], radius: 0.08 },
    { start: [0, 1.75, 0], end: [0.65, 1.2, 0], radius: 0.08 },
    { start: [-0.65, 1.2, 0], end: [-1.15, 0.45, 0], radius: 0.07 },
    { start: [0.65, 1.2, 0], end: [1.15, 0.45, 0], radius: 0.07 },
    { start: [0, 0.4, 0], end: [-0.5, -0.55, 0], radius: 0.09 },
    { start: [0, 0.4, 0], end: [0.5, -0.55, 0], radius: 0.09 },
    { start: [-0.5, -0.55, 0], end: [-0.5, -1.65, 0], radius: 0.08 },
    { start: [0.5, -0.55, 0], end: [0.5, -1.65, 0], radius: 0.08 },
  ]), [])

  return (
    <group ref={group} position={[0, -0.15, 0]}>
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.34, 22, 18]} />
        <meshStandardMaterial color="#e8d7b5" transparent opacity={0.95} roughness={0.3} metalness={0.08} />
      </mesh>
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color="#f4ecd8" transparent opacity={0.9} roughness={0.28} metalness={0.1} />
      </mesh>
      {bones.map((bone, index) => (
        <SkeletonBone key={index} {...bone} />
      ))}
      <mesh position={[0, 0.25, 0]}>
        <sphereGeometry args={[0.3, 18, 16]} />
        <meshStandardMaterial color="#c8a96e" transparent opacity={0.85} roughness={0.25} metalness={0.12} />
      </mesh>
      <mesh position={[-0.5, -1.72, 0]} rotation={[0, 0, 0.2]}>
        <sphereGeometry args={[0.16, 14, 12]} />
        <meshStandardMaterial color="#c8a96e" transparent opacity={0.9} roughness={0.25} metalness={0.12} />
      </mesh>
      <mesh position={[0.5, -1.72, 0]} rotation={[0, 0, -0.2]}>
        <sphereGeometry args={[0.16, 14, 12]} />
        <meshStandardMaterial color="#c8a96e" transparent opacity={0.9} roughness={0.25} metalness={0.12} />
      </mesh>
    </group>
  )
}

function SkeletonLoaderScene() {
  return (
    <div style={{ position: 'relative', width: 'min(62vw, 520px)', maxWidth: '100%', height: 'min(48vh, 420px)' }}>
      <Canvas
        camera={{ position: [0, 0.2, 7.5], fov: 34 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 5, 7]} intensity={1.6} color="#c8a96e" />
        <pointLight position={[-4, -2, 4]} intensity={0.7} color="#00e8ff" />
        <Float speed={1.2} rotationIntensity={0.45} floatIntensity={0.4}>
          <SkeletonFigure />
        </Float>
      </Canvas>

      <div style={{
        position: 'absolute', inset: 'auto 14% 14% 14%',
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(200,169,110,0.85), transparent)',
        boxShadow: '0 0 18px rgba(200,169,110,0.2)',
      }} />
    </div>
  )
}

export default function Loader({ onDone }) {
  const [count, setCount] = useState(0)
  const [wordIdx, setWordIdx] = useState(0)
  const [done, setDone] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(false)

  useEffect(() => {
    const start = Date.now()
    const duration = 2200
    const skeletonDelay = setTimeout(() => setShowSkeleton(true), 1400)
    const iv = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const val = Math.floor(eased * 100)
      setCount(val)
      setWordIdx(Math.floor(eased * (LOADING_WORDS.length - 1)))
      if (progress >= 1) {
        clearInterval(iv)
        clearTimeout(skeletonDelay)
        setTimeout(() => setDone(true), 300)
        setTimeout(onDone, 900)
      }
    }, 16)
    return () => {
      clearInterval(iv)
      clearTimeout(skeletonDelay)
    }
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9000,
            background: 'var(--page-gradient)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Scan line */}
          <motion.div
            animate={{ y: ['-100vh', '100vh'] }}
            transition={{ duration: 2.2, ease: 'linear' }}
            style={{
              position: 'absolute', left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
              opacity: 0.16, pointerEvents: 'none',
            }}
          />

          {/* Corner brackets */}
          {[
            { top: 40, left: 40, borderTop: '1px solid', borderLeft: '1px solid' },
            { top: 40, right: 40, borderTop: '1px solid', borderRight: '1px solid' },
            { bottom: 40, left: 40, borderBottom: '1px solid', borderLeft: '1px solid' },
            { bottom: 40, right: 40, borderBottom: '1px solid', borderRight: '1px solid' },
          ].map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              style={{ position: 'absolute', width: 32, height: 32, borderColor: 'var(--panel-border)', opacity: 0.75, ...s }}
            />
          ))}

          {/* Ghost outline number */}
          {showSkeleton ? (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, position: 'relative' }}
            >
              <SkeletonLoaderScene />
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                letterSpacing: '0.35em', textTransform: 'uppercase',
                color: 'var(--text-faint)', textAlign: 'center',
              }}>
                Building the 3D scene
              </div>
            </motion.div>
          ) : (
            <>
              <div style={{
                position: 'absolute',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(120px, 22vw, 220px)',
                lineHeight: 1, letterSpacing: '-0.04em',
                color: 'transparent',
                WebkitTextStroke: '1px var(--text-faint)',
                userSelect: 'none',
              }}>
                {String(count).padStart(2, '0')}
              </div>

              {/* Main counter */}
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(120px, 22vw, 220px)',
                lineHeight: 1, letterSpacing: '-0.04em',
                color: 'var(--text)',
                userSelect: 'none', position: 'relative',
              }}>
                {String(count).padStart(2, '0')}
              </div>
            </>
          )}

          {/* Status word */}
          <motion.div
            key={wordIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '0.5em', textTransform: 'uppercase',
              color: 'var(--gold)', marginTop: 16,
            }}
          >
            {LOADING_WORDS[wordIdx]}
          </motion.div>

          {/* Progress track */}
          <div style={{
            position: 'absolute', bottom: 60, left: '10%', right: '10%',
            height: 1, background: 'var(--rule-soft)',
          }}>
            <div style={{
              height: '100%', background: 'var(--gold)',
              width: count + '%', transition: 'width 0.05s linear',
            }} />
          </div>

          <div style={{
            position: 'absolute', bottom: 36, left: '10%',
            fontFamily: 'var(--font-mono)', fontSize: 9,
            letterSpacing: '0.35em', textTransform: 'uppercase',
            color: 'var(--text-faint)',
          }}>
            Prateek · Portfolio · 2025
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
