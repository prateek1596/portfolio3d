import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * useScrollStory - Create smooth scroll storytelling animations
 * Animates elements as they scroll into view with parallax and stagger effects
 */
export const useScrollStory = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Animate section headings
    const headings = containerRef.current.querySelectorAll('[data-scroll-heading]')
    headings.forEach((heading) => {
      gsap.fromTo(
        heading,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: heading,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 0.5,
          },
        }
      )
    })

    // Animate section content
    const contents = containerRef.current.querySelectorAll('[data-scroll-content]')
    contents.forEach((content, i) => {
      gsap.fromTo(
        content,
        { opacity: 0, y: 30, x: i % 2 === 0 ? -20 : 20 },
        {
          opacity: 1,
          y: 0,
          x: 0,
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: {
            trigger: content,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 0.5,
          },
        }
      )
    })

    // Parallax background effect
    const parallaxBGs = containerRef.current.querySelectorAll('[data-parallax]')
    parallaxBGs.forEach((bg) => {
      gsap.to(bg, {
        y: -100,
        scrollTrigger: {
          trigger: bg,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
        },
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return containerRef
}

/**
 * Trigger smooth scroll to element
 */
export const smoothScrollTo = (target, offset = 0) => {
  gsap.to(window, {
    scrollTo: { y: target, offsetY: offset },
    duration: 0.8,
    ease: 'power2.inOut',
  })
}
