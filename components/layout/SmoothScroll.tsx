'use client'

import { useEffect, useRef, useLayoutEffect } from 'react'
import Lenis from '@studio-freight/lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })
      lenisRef.current = lenis

      lenis.on('scroll', ScrollTrigger.update)

      const rafCallback = (time: number) => {
        lenis.raf(time * 1000)
      }
      rafCallbackRef.current = rafCallback
      gsap.ticker.add(rafCallback)

      gsap.ticker.lagSmoothing(0)
    }

    const destroyLenis = () => {
      if (lenisRef.current) {
        lenisRef.current.destroy()
        lenisRef.current = null
      }
      if (rafCallbackRef.current) {
        gsap.ticker.remove(rafCallbackRef.current)
        rafCallbackRef.current = null
      }
    }

    // Watch for Google Translate elements
    translateObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof Element) {
            // Google Translate injects a toolbar AND replaces page content
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
              // Translation was cancelled - reinitialize after a delay
              setTimeout(() => {
                isTranslatedRef.current = false
                initLenis()
              }, 500)
              return
            }
          }
        }
      }

      // Also check if body classes changed (another indicator of translation)
      if (document.body.classList.contains('translated-ltr') ||
          document.body.classList.contains('translated-rtl')) {
        if (!isTranslatedRef.current) {
          isTranslatedRef.current = true
          destroyLenis()
        }
      }
    })

    // Watch for body class changes which indicate translation state
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

    // Initialize Lenis
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