/**
 * Performance monitoring utilities
 */

export const logWebVitals = () => {
  if ('web-vital' in window) {
    const vitals = window['web-vital']
    console.table(vitals)
  }
}

export const measurePerformance = (name, fn) => {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  console.log(`${name}: ${end - start}ms`)
  return result
}

export const enablePerformanceMonitoring = () => {
  // Core Web Vitals
  if ('PerformanceObserver' in window) {
    try {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          console.log('FID:', entry.processingDuration)
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift (CLS)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            console.log('CLS:', clsValue)
          }
        })
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      console.warn('Performance monitoring not available', e)
    }
  }
}

/**
 * Cache busting utility for better performance
 */
export const getCachedAsset = (url) => {
  return `${url}?v=${Date.now()}`
}

/**
 * Prefetch resources for faster loading
 */
export const prefetchResource = (url, type = 'script') => {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = url
  if (type === 'style') {
    link.as = 'style'
  } else if (type === 'font') {
    link.as = 'font'
    link.crossOrigin = 'anonymous'
  }
  document.head.appendChild(link)
}

/**
 * Preload critical resources
 */
export const preloadResource = (url, type = 'script') => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = url
  link.as = type === 'style' ? 'style' : type === 'font' ? 'font' : 'script'
  if (type === 'font') {
    link.crossOrigin = 'anonymous'
  }
  document.head.appendChild(link)
}
