'use client'

import { useEffect, useRef, useLayoutEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

declare global {
  interface Window {
    __lenisInstance?: Lenis | null
  }
}

function isScrollable(element: HTMLElement | null): boolean {
  if (!element || element === document.body || element === document.documentElement) return false
  const style = window.getComputedStyle(element)
  const overflowY = style.overflowY
  if (
    (overflowY === 'auto' || overflowY === 'scroll') &&
    element.scrollHeight > element.clientHeight + 1
  ) {
    return true
  }
  return isScrollable(element.parentElement)
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafCallbackRef = useRef<((time: number) => void) | null>(null)
  const isTranslatedRef = useRef(false)

  // Cleanup before any DOM changes
  useLayoutEffect(() => {
    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
      if (rafCallbackRef.current) {
        gsap.ticker.remove(rafCallbackRef.current)
        rafCallbackRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    let translateObserver: MutationObserver | null = null

    const initLenis = () => {
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }
      if (rafCallbackRef.current) {
        gsap.ticker.remove(rafCallbackRef.current)
      }

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        gestureOrientation: 'vertical',
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      })
      lenisRef.current = lenis

      window.__lenisInstance = lenis

      lenis.on('scroll', ScrollTrigger.update)

      // Stop wheel events from scrollable containers before Lenis processes them
      // so native inner scroll (admin dashboard, drawers, modals…) works.
      const handleWheel = (e: WheelEvent) => {
        const target = e.target as HTMLElement | null
        if (!target) return
        if (isScrollable(target)) {
          e.stopImmediatePropagation()
        }
      }

      const handleTouchStart = (e: TouchEvent) => {
        const target = e.target as HTMLElement | null
        if (!target) return
        if (isScrollable(target)) {
          if (lenisRef.current) {
            lenisRef.current.stop()
          }
        }
      }

      const handleTouchEnd = () => {
        if (lenisRef.current) {
          lenisRef.current.start()
        }
      }

      document.addEventListener('wheel', handleWheel, { capture: true, passive: false })
      document.addEventListener('touchstart', handleTouchStart, { capture: true, passive: true })

      // Store cleanup for these listeners
      ;(lenis as any).__cleanupWheel = () => {
        document.removeEventListener('wheel', handleWheel, { capture: true })
        document.removeEventListener('touchstart', handleTouchStart, { capture: true })
      }

      const rafCallback = (time: number) => {
        lenis.raf(time * 1000)
      }
      rafCallbackRef.current = rafCallback
      gsap.ticker.add(rafCallback)

      gsap.ticker.lagSmoothing(0)
    }

    const destroyLenis = () => {
      if (lenisRef.current) {
        ;(lenisRef.current as any).__cleanupWheel?.()
        lenisRef.current.destroy()
        lenisRef.current = null
        window.__lenisInstance = null
      }
      if (rafCallbackRef.current) {
        gsap.ticker.remove(rafCallbackRef.current)
        rafCallbackRef.current = null
      }
    }

    translateObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof Element) {
            if (node.classList?.contains('goog-toolbar') ||
                node.id?.startsWith('google_translate') ||
                node.classList?.contains('skiptranslate') ||
                node.getAttribute('id') === ':1.container' ||
                document.body.classList.contains('translated-ltr') ||
                document.body.classList.contains('translated-rtl')) {
              if (!isTranslatedRef.current) {
                isTranslatedRef.current = true
                destroyLenis()
              }
              return
            }
          }
        }
        for (const node of mutation.removedNodes) {
          if (node instanceof Element) {
            if (node.classList?.contains('goog-toolbar') ||
                node.id?.startsWith('google_translate') ||
                node.classList?.contains('skiptranslate')) {
              setTimeout(() => {
                isTranslatedRef.current = false
                initLenis()
              }, 500)
              return
            }
          }
        }
      }

      if (document.body.classList.contains('translated-ltr') ||
          document.body.classList.contains('translated-rtl')) {
        if (!isTranslatedRef.current) {
          isTranslatedRef.current = true
          destroyLenis()
        }
      }
    })

    const bodyObserver = new MutationObserver(() => {
      if (document.body.classList.contains('translated-ltr') ||
          document.body.classList.contains('translated-rtl')) {
        if (!isTranslatedRef.current) {
          isTranslatedRef.current = true
          destroyLenis()
        }
      } else {
        if (isTranslatedRef.current) {
          isTranslatedRef.current = false
          initLenis()
        }
      }
    })

    translateObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'id'],
    })

    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    })

    initLenis()

    return () => {
      translateObserver?.disconnect()
      bodyObserver?.disconnect()
      destroyLenis()
    }
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>
      {children}
    </div>
  )
}