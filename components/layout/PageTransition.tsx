'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { gsap } from 'gsap'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname   = usePathname()
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isFirst    = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      gsap.set(overlayRef.current, { yPercent: -100 })
      return
    }

    const overlay = overlayRef.current
    const content = contentRef.current
    if (!overlay || !content) return

    gsap.killTweensOf([overlay, content])

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { yPercent: -100 })
      }
    })

    tl.set(overlay,  { yPercent: 100 })
    tl.to(overlay,   { yPercent: 0,    duration: 0.4, ease: 'power3.inOut' })
    tl.to(overlay,   { yPercent: -100, duration: 0.4, ease: 'power3.inOut', delay: 0.05 })
    tl.fromTo(content,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0,  duration: 0.4, ease: 'power3.out' },
      '-=0.15'
    )

    return () => { tl.kill() }
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