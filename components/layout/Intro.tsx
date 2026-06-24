'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { IconPomme, IconCarotte, IconBocal } from '@/components/ui/Illustrations'

const items = [
  { Icon: IconPomme, couleur: '#fbeaea' },
  { Icon: IconCarotte, couleur: '#fdeedd' },
  { Icon: IconBocal, couleur: '#eaf3ea' },
]

export function Intro() {
  const containerRef = useRef<HTMLDivElement>(null)
  const boxesRef = useRef<HTMLDivElement[]>([])
  const logoRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const boxes = boxesRef.current.filter(Boolean)
    if (boxes.length === 0) return

    const tl = gsap.timeline()

    // Entrée rapide des boîtes (stagger)
    tl.fromTo(
      boxes,
      { opacity: 0, y: 24, scale: 0.85 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.5)', stagger: 0.1 },
    )
      // Passage en vert profond (le trait passe en crème pour rester lisible)
      .to(
        boxes,
        {
          backgroundColor: '#1e3a28',
          color: '#f5f0e8',
          duration: 0.35,
          ease: 'power2.inOut',
          stagger: 0.08,
        },
        '-=0.05',
      )
      // Logo
      .fromTo(
        logoRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' },
        '-=0.15',
      )
      // Sortie vers le haut
      .to(containerRef.current, {
        yPercent: -100,
        duration: 0.55,
        ease: 'power4.inOut',
        delay: 0.15,
        onComplete: () => setVisible(false),
      })

    return () => {
      tl.kill()
    }
  }, [])

  if (!visible) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-blanc flex flex-col items-center justify-center gap-10"
    >
      {/* Illustrations */}
      <div className="flex items-center gap-5 md:gap-6">
        {items.map((item, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) boxesRef.current[i] = el
            }}
            className="w-20 h-20 md:w-24 md:h-24 rounded-3xl flex items-center justify-center text-vert"
            style={{ backgroundColor: item.couleur }}
          >
            <item.Icon className="w-10 h-10 md:w-12 md:h-12" strokeWidth={1.5} />
          </div>
        ))}
      </div>

      {/* Logo */}
      <div
        ref={logoRef}
        className="opacity-0 font-display text-3xl text-vert tracking-widest uppercase"
      >
        For<em className="text-matcha not-italic">naro</em>
      </div>
    </div>
  )
}
