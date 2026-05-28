import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * LazyImage - Lazy load images with blur-up effect
 */
export default function LazyImage({ src, alt, placeholder, className = '', srcSet, sizes, loading = 'lazy' }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        rootMargin: '50px',
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={imgRef} className={`lazy-image-wrapper ${className}`} style={{ position: 'relative', overflow: 'hidden' }}>
      {placeholder && !isLoaded && (
        <motion.img
          src={placeholder}
          alt={alt}
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            filter: 'blur(10px)',
            zIndex: 1,
          }}
        />
      )}
      {isVisible && (
        <motion.img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          loading={loading}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={className}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 2,
            position: 'relative',
          }}
        />
      )}
    </div>
  )
}
