import { useRef, useCallback } from 'react'

// Generate tones with Web Audio API — no files needed
function createAudioCtx() {
  if (typeof window === 'undefined') return null
  return new (window.AudioContext || window.webkitAudioContext)()
}

function playTone(ctx, freq, type = 'sine', duration = 0.08, gain = 0.12, delay = 0) {
  if (!ctx) return
  try {
    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()
    osc.connect(gainNode)
    gainNode.connect(ctx.destination)
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + delay + duration)
    gainNode.gain.setValueAtTime(0, ctx.currentTime + delay)
    gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration)
    osc.start(ctx.currentTime + delay)
    osc.stop(ctx.currentTime + delay + duration + 0.05)
  } catch (e) {}
}

export function useSounds() {
  const ctxRef = useRef(null)
  // Start with sounds disabled; ThemeControls can toggle sounds.enabled.current = true
  const enabled = useRef(false)

  const getCtx = useCallback(() => {
    if (!enabled.current) return null
    if (!ctxRef.current) ctxRef.current = createAudioCtx()
    return ctxRef.current
  }, [])

  const click = useCallback(() => {
    if (!enabled.current) return
    const ctx = getCtx()
    playTone(ctx, 800, 'sine', 0.06, 0.1)
  }, [])

  const hover = useCallback(() => {
    if (!enabled.current) return
    const ctx = getCtx()
    playTone(ctx, 1200, 'sine', 0.04, 0.04)
  }, [])

  const whoosh = useCallback(() => {
    if (!enabled.current) return
    const ctx = getCtx()
    playTone(ctx, 400, 'sawtooth', 0.15, 0.08)
    playTone(ctx, 200, 'sine', 0.1, 0.05, 0.05)
  }, [])

  const success = useCallback(() => {
    if (!enabled.current) return
    const ctx = getCtx()
    playTone(ctx, 523, 'sine', 0.1, 0.1)       // C
    playTone(ctx, 659, 'sine', 0.1, 0.1, 0.1)  // E
    playTone(ctx, 784, 'sine', 0.12, 0.1, 0.2) // G
  }, [])

  const glitch = useCallback(() => {
    if (!enabled.current) return
    const ctx = getCtx()
    for (let i = 0; i < 3; i++) {
      playTone(ctx, 100 + Math.random() * 400, 'square', 0.03, 0.06, i * 0.04)
    }
  }, [])

  return { click, hover, whoosh, success, glitch, enabled }
}
