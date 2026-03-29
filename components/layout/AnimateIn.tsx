'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface AnimateInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
}

export function AnimateIn({
  children,
  className,
  delay = 0,
  direction = 'up',
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const fromVars: gsap.TweenVars = {
      opacity: 0,
      y: direction === 'up'    ?  40 : 0,
      x: direction === 'left'  ? -40 : direction === 'right' ? 40 : 0,
    }

    gsap.fromTo(el, fromVars, {
      opacity: 1,
      y: 0,
      x: 0,
      duration: 0.9,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
      },
    })
  }, [delay, direction])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}