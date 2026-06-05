import { useEffect, useState } from 'react'

/**
 * useMediaQuery - Detect responsive breakpoints
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

/**
 * useMobileDetect - Check if user is on mobile device
 */
export const useMobileDetect = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const isDesktop = useMediaQuery('(min-width: 1025px)')

  return { isMobile, isTablet, isDesktop }
}

/**
 * useTouchDevice - Detect if device supports touch
 */
export const useTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    const checkTouch = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
      setIsTouchDevice(hasTouch)
    }

    const onTouchStart = () => setIsTouchDevice(true)

    checkTouch()
    window.addEventListener('touchstart', onTouchStart)

    return () => {
      window.removeEventListener('touchstart', onTouchStart)
    }
  }, [])

  return isTouchDevice
}

/**
 * useNetworkStatus - Monitor network connection
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [effectiveType, setEffectiveType] = useState('unknown')

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check Network Information API
    if ('connection' in navigator) {
      const connection = navigator.connection
      setEffectiveType(connection.effectiveType)

      const handleChange = () => {
        setEffectiveType(connection.effectiveType)
      }

      connection.addEventListener('change', handleChange)

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
        connection.removeEventListener('change', handleChange)
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, effectiveType }
}

/**
 * useVibration - Trigger haptic feedback on mobile
 */
export const useVibration = () => {
  const vibrate = (pattern = [100]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }

  const vibratePulse = () => vibrate([50, 100, 50])
  const vibrateSoft = () => vibrate([20])
  const vibrateHard = () => vibrate([200])

  return { vibrate, vibratePulse, vibrateSoft, vibrateHard }
}

/**
 * useFullscreen - Request fullscreen mode
 */
export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const requestFullscreen = async () => {
    try {
      const elem = document.documentElement
      if (elem.requestFullscreen) {
        await elem.requestFullscreen()
      }
    } catch (err) {
      console.error('Error requesting fullscreen:', err)
    }
  }

  const exitFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return { isFullscreen, requestFullscreen, exitFullscreen }
}
