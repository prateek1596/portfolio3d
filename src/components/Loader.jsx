import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

const LOADING_WORDS = ['INITIALIZING', 'LOADING ASSETS', 'BUILDING WORLD', 'ALMOST THERE']
const RING_COUNT = 14

function InfinityRing({ radius, depth, segments, hueOffset, active, activeBoost, sweepPhase }) {
  const ring = useRef()

  const lights = useMemo(() => {
    const items = []
    for (let index = 0; index < segments; index++) {
      const angle = (index / segments) * Math.PI * 2
      const wave = (Math.sin(index * 0.55 + depth * 1.4) + 1) * 0.5
      const sweep = Math.max(0, 1 - Math.abs(Math.sin(angle + sweepPhase)) * 1.75)
      const glow = active ? 0.55 + wave * 0.45 + activeBoost : 0.08 + wave * 0.05
      const size = active ? 0.56 + wave * 0.48 + activeBoost * 0.18 : 0.26 + wave * 0.08
      const opacity = active ? 0.28 + wave * 0.38 + sweep * 0.2 : 0.04 + wave * 0.03
      items.push({
        position: [Math.cos(angle) * radius, Math.sin(angle) * radius, depth],
        rotation: [0, 0, angle + Math.PI / 2],
        color: new THREE.Color().setHSL((index / segments + hueOffset) % 1, 0.96, 0.55 + glow * 0.18).getStyle(),
        scale: size,
        opacity,
        sweep,
      })
    }
    return items
  }, [active, activeBoost, depth, hueOffset, radius, segments, sweepPhase])

  useFrame(({ clock }) => {
    if (!ring.current) return
    const t = clock.elapsedTime
    ring.current.rotation.z = Math.sin(t * 0.22 + depth * 0.5) * 0.1
    ring.current.rotation.x = Math.sin(t * 0.24 + depth * 0.25) * 0.075
    ring.current.position.z = depth + Math.sin(t * 0.7 + depth * 1.15) * 0.1
  })

  return (
    <group ref={ring}>
      {lights.map((light, index) => (
        <mesh key={index} position={light.position} rotation={light.rotation} scale={[light.scale, 0.085, 0.085]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={light.color}
            emissive={light.color}
            emissiveIntensity={active ? 2.2 + light.sweep * 1.4 : 0.15}
            transparent
            opacity={light.opacity}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      ))}

      <mesh scale={[radius * 1.02, radius * 1.02, 1]} position={[0, 0, depth]}>
        <ringGeometry args={[radius * 0.84, radius * 1.02, 160]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={active ? 0.09 + activeBoost * 0.4 : 0.015}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function InfinityTunnel() {
  const tunnel = useRef()
  const glow = useRef()
  const pointer = useRef({ x: 0, y: 0 })
  const [activeRings, setActiveRings] = useState(0)
  const [sweepPhase, setSweepPhase] = useState(0)

  useEffect(() => {
    let mounted = true
    const delays = [120, 180, 150, 210, 170, 140, 230, 160, 190, 175, 205, 145, 225, 180]
    let index = 0

    setActiveRings(0)

    const run = () => {
      if (!mounted) return
      setActiveRings(index)
      index += 1
      if (index <= RING_COUNT) {
        const delay = delays[index % delays.length]
        setTimeout(run, delay)
      }
    }

    const first = setTimeout(run, 140)

    const onMove = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 2
    }

    window.addEventListener('mousemove', onMove)
    return () => {
      mounted = false
      clearTimeout(first)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  useFrame(({ clock }) => {
    if (!tunnel.current) return
    const t = clock.elapsedTime
    setSweepPhase(t * 2.4)
    tunnel.current.rotation.z = Math.sin(t * 0.2) * 0.08 + pointer.current.x * 0.04
    tunnel.current.rotation.y = t * 0.08 + pointer.current.x * 0.12
    tunnel.current.rotation.x = pointer.current.y * 0.1
    tunnel.current.position.x = pointer.current.x * 0.22
    tunnel.current.position.y = pointer.current.y * 0.14
    if (glow.current) {
      glow.current.material.opacity = 0.16 + Math.sin(t * 0.95) * 0.04
    }
  })

  const rings = useMemo(() => {
    const items = []
    for (let index = 0; index < RING_COUNT; index++) {
      const depth = -index * 0.65
      const radius = 2.35 - index * 0.08
      const hueOffset = index * 0.055
      items.push({ depth, radius, hueOffset, segments: 84 - index * 2 })
    }
    return items
  }, [])

  return (
    <group ref={tunnel} position={[0, 0, 0]}>
      <mesh ref={glow} position={[0, 0, 1.1]}>
        <sphereGeometry args={[1.25, 36, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
      </mesh>

      {rings.map((ring, index) => (
        <InfinityRing
          key={index}
          {...ring}
          active={index <= activeRings}
          activeBoost={Math.max(0, activeRings - index) * 0.08}
          sweepPhase={sweepPhase}
        />
      ))}

      <mesh position={[0, 0, -9.4]}>
        <circleGeometry args={[1.2, 72]} />
        <meshBasicMaterial color="#060608" transparent opacity={0.99} />
      </mesh>

      <mesh position={[0, 0, -9.2]}>
        <ringGeometry args={[1.42, 2.18, 128]} />
        <meshBasicMaterial color="#ff4fd8" transparent opacity={0.08} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function InfinityLoaderScene() {
  return (
    <div style={{ position: 'relative', width: 'min(66vw, 560px)', maxWidth: '100%', height: 'min(50vh, 440px)' }}>
      <Canvas
        camera={{ position: [0, 0, 8.8], fov: 31 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.14} />
        <pointLight position={[3, 3, 6]} intensity={2.7} color="#ffffff" />
        <pointLight position={[-3, -2, 4]} intensity={1.55} color="#ff4fd8" />
        <pointLight position={[0, 0, 8]} intensity={1.25} color="#5effc8" />
        <Float speed={0.5} rotationIntensity={0.15} floatIntensity={0.12}>
          <InfinityTunnel />
        </Float>
      </Canvas>

      <div style={{
        position: 'absolute', inset: '8% 15%',
        borderRadius: '50%',
        background: 'radial-gradient(circle at center, rgba(6,6,10,0.98) 0 18%, rgba(8,8,14,0.92) 22%, rgba(12,12,22,0.72) 40%, rgba(255,79,216,0.08) 56%, transparent 74%)',
        boxShadow: 'inset 0 0 28px rgba(255,255,255,0.04), inset 0 0 90px rgba(255,79,216,0.08)',
        filter: 'blur(1.6px)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', inset: '8% 15%',
        borderRadius: '50%',
        background: 'radial-gradient(circle at center, transparent 0 24%, rgba(255,255,255,0.06) 34%, transparent 50%)',
        mixBlendMode: 'screen',
        opacity: 0.55,
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute', left: '15%', right: '15%', bottom: '12%', height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,79,216,0.68), rgba(94,255,200,0.82), transparent)',
        boxShadow: '0 0 20px rgba(255,79,216,0.18), 0 0 26px rgba(94,255,200,0.16)',
        opacity: 0.9,
      }} />
    </div>
  )
}

export default function Loader({ onDone }) {
  const [count, setCount] = useState(0)
  const [wordIdx, setWordIdx] = useState(0)
  const [done, setDone] = useState(false)
  const [showSkeleton, setShowSkeleton] = useState(false)
  const [exitTunnel, setExitTunnel] = useState(false)
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
        setTimeout(() => setExitTunnel(true), 180)
        setTimeout(() => setDone(true), 640)
        if (typeof onDone === 'function') setTimeout(onDone, 820)
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
          animate={{ opacity: exitTunnel ? 0 : 1 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          exit={{ opacity: 0 }}
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
            animate={{ y: ['-100vh', '100vh'], opacity: [0.05, 0.16, 0.05] }}
            transition={{ duration: 2.8, ease: 'linear', repeat: Infinity }}
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
              animate={{ opacity: exitTunnel ? 0 : 1, y: exitTunnel ? 12 : 0, scale: exitTunnel ? 0.985 : 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, position: 'relative' }}
            >
              {reducedMotion ? (
                <div style={{ width: 360, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
                  Reduced motion: loading...
                </div>
              ) : (
                <InfinityLoaderScene />
              )}
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: 9,
                letterSpacing: '0.35em', textTransform: 'uppercase',
                color: 'var(--text-faint)', textAlign: 'center',
                opacity: exitTunnel ? 0 : 1,
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
            animate={{ opacity: exitTunnel ? 0 : 1, y: exitTunnel ? 4 : 0 }}
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
            height: 1, background: 'var(--rule-soft)', opacity: exitTunnel ? 0.2 : 1,
          }}>
            <div style={{
              height: '100%', background: 'var(--gold)',
              width: count + '%', transition: 'width 0.05s linear, opacity 0.45s ease',
              opacity: exitTunnel ? 0.15 : 1,
            }} />
          </div>

          <div style={{
            position: 'absolute', bottom: 36, left: '10%',
            fontFamily: 'var(--font-mono)', fontSize: 9,
            letterSpacing: '0.35em', textTransform: 'uppercase',
            color: 'var(--text-faint)', opacity: exitTunnel ? 0.15 : 1,
          }}>
            Prateek · Portfolio · 2025
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
