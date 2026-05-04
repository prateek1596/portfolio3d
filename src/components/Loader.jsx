import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

const LOADING_WORDS = ['INITIALIZING', 'LOADING ASSETS', 'BUILDING WORLD', 'ALMOST THERE']

function InfinityRing({ radius, depth, segments, hueOffset }) {
  const ring = useRef()

  const lights = useMemo(() => {
    const items = []
    for (let index = 0; index < segments; index++) {
      const angle = (index / segments) * Math.PI * 2
      const pulse = (Math.sin(index * 0.55 + depth * 1.4) + 1) * 0.5
      items.push({
        position: [Math.cos(angle) * radius, Math.sin(angle) * radius, depth],
        rotation: [0, 0, angle + Math.PI / 2],
        color: new THREE.Color().setHSL((index / segments + hueOffset) % 1, 0.95, 0.62 + pulse * 0.12).getStyle(),
        scale: 0.7 + pulse * 0.55,
        opacity: 0.4 + pulse * 0.5,
      })
    }
    return items
  }, [depth, hueOffset, radius, segments])

  useFrame(({ clock }) => {
    if (!ring.current) return
    const t = clock.elapsedTime
    ring.current.rotation.z = Math.sin(t * 0.18 + depth * 0.5) * 0.08
    ring.current.rotation.x = Math.sin(t * 0.22 + depth * 0.25) * 0.08
    ring.current.position.z = depth + Math.sin(t * 0.65 + depth) * 0.12
  })

  return (
    <group ref={ring}>
      {lights.map((light, index) => (
        <mesh key={index} position={light.position} rotation={light.rotation} scale={[light.scale, 0.08, 0.08]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={light.color}
            emissive={light.color}
            emissiveIntensity={1.8}
            transparent
            opacity={light.opacity}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

function InfinityTunnel() {
  const tunnel = useRef()

  useFrame(({ clock }) => {
    if (!tunnel.current) return
    const t = clock.elapsedTime
    tunnel.current.rotation.z = Math.sin(t * 0.2) * 0.08
    tunnel.current.rotation.y = t * 0.1
  })

  const rings = useMemo(() => {
    const items = []
    for (let index = 0; index < 14; index++) {
      const depth = -index * 0.65
      const radius = 2.35 - index * 0.08
      const hueOffset = index * 0.055
      items.push({ depth, radius, hueOffset, segments: 84 - index * 2 })
    }
    return items
  }, [])

  return (
    <group ref={tunnel} position={[0, 0, 0]}>
      <mesh position={[0, 0, 0.8]}>
        <torusGeometry args={[1.25, 0.1, 20, 120]} />
        <meshStandardMaterial color="#100f16" emissive="#000000" roughness={0.45} metalness={0.1} />
      </mesh>

      {rings.map((ring, index) => (
        <InfinityRing key={index} {...ring} />
      ))}

      <mesh position={[0, 0, -9.5]}>
        <circleGeometry args={[1.7, 72]} />
        <meshBasicMaterial color="#09090d" transparent opacity={0.95} />
      </mesh>

      <mesh position={[0, 0, -9.2]}>
        <ringGeometry args={[1.55, 2.05, 96]} />
        <meshBasicMaterial color="#ff4fd8" transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function InfinityLoaderScene() {
  return (
    <div style={{ position: 'relative', width: 'min(66vw, 560px)', maxWidth: '100%', height: 'min(50vh, 440px)' }}>
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 32 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.22} />
        <pointLight position={[3, 3, 6]} intensity={2.3} color="#ffffff" />
        <pointLight position={[-3, -2, 4]} intensity={1.3} color="#ff4fd8" />
        <pointLight position={[0, 0, 8]} intensity={1.1} color="#5effc8" />
        <Float speed={0.7} rotationIntensity={0.2} floatIntensity={0.15}>
          <InfinityTunnel />
        </Float>
      </Canvas>

      <div style={{
        position: 'absolute', inset: '10% 16%',
        borderRadius: '50%',
        background: 'radial-gradient(circle at center, rgba(8,8,12,0.9) 0 22%, rgba(10,10,18,0.75) 40%, rgba(255,79,216,0.08) 58%, transparent 73%)',
        filter: 'blur(2px)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', left: '15%', right: '15%', bottom: '12%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,79,216,0.7), rgba(94,255,200,0.8), transparent)',
        boxShadow: '0 0 20px rgba(255,79,216,0.18), 0 0 26px rgba(94,255,200,0.16)',
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
              <InfinityLoaderScene />
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                letterSpacing: '0.35em', textTransform: 'uppercase',
                color: 'var(--text-faint)', textAlign: 'center',
              }}>
                Infinity light tunnel
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
