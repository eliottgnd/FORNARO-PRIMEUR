'use client'

import { useEffect, useRef, useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname   = usePathname()
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isFirst    = useRef(true)
  const tlRef      = useRef<gsap.core.Timeline | null>(null)

  // Cleanup any running animations before DOM changes
  useLayoutEffect(() => {
    return () => {
      if (tlRef.current) {
        tlRef.current.kill()
        tlRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const overlay = overlayRef.current
    const content = contentRef.current
    if (!overlay || !content) return

    // Kill any existing animation on these elements
    gsap.killTweensOf([overlay, content])
    if (tlRef.current) {
      tlRef.current.kill()
    }

    if (isFirst.current) {
      isFirst.current = false
      gsap.set(overlay, { yPercent: -100 })
      return
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { yPercent: -100 })
      }
    })
    tlRef.current = tl

    tl.set(overlay,  { yPercent: 100 })
    tl.to(overlay,   { yPercent: 0,    duration: 0.4, ease: 'power3.inOut' })
    tl.to(overlay,   { yPercent: -100, duration: 0.4, ease: 'power3.inOut', delay: 0.05 })
    tl.fromTo(content,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0,  duration: 0.4, ease: 'power3.out' },
      '-=0.15'
    )

    return () => {
      tl.kill()
      tlRef.current = null
    }
  }, [pathname])

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[100] bg-vert pointer-events-none"
      />
      <div ref={contentRef} style={{ minHeight: 0 }}>
        {children}
      </div>
    </>
  )
}