'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const fruits = [
  { emoji: '🍓', couleur: '#fce4ec' },
  { emoji: '🥦', couleur: '#e8f5e9' },
  { emoji: '🍊', couleur: '#fff8e1' },
]

export function Intro() {
  const containerRef = useRef<HTMLDivElement>(null)
  const fruit1Ref    = useRef<HTMLDivElement>(null)
  const fruit2Ref    = useRef<HTMLDivElement>(null)
  const fruit3Ref    = useRef<HTMLDivElement>(null)
  const logoRef      = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const tl = gsap.timeline()

    // Entrée des fruits de gauche à droite
    tl.fromTo(fruit1Ref.current,
      { opacity: 0, x: -60, scale: 0.8 },
      { opacity: 1, x: 0,   scale: 1, duration: 0.6, ease: 'back.out(1.4)' }
    )
    .fromTo(fruit2Ref.current,
      { opacity: 0, x: -60, scale: 0.8 },
      { opacity: 1, x: 0,   scale: 1, duration: 0.6, ease: 'back.out(1.4)' },
      '-=0.4'
    )
    .fromTo(fruit3Ref.current,
      { opacity: 0, x: -60, scale: 0.8 },
      { opacity: 1, x: 0,   scale: 1, duration: 0.6, ease: 'back.out(1.4)' },
      '-=0.4'
    )

    // Changement de couleur des fruits
    .to(fruit1Ref.current, {
      backgroundColor: '#1e3a28',
      duration: 0.4,
      ease: 'power2.inOut',
    }, '+=0.2')
    .to(fruit2Ref.current, {
      backgroundColor: '#1e3a28',
      duration: 0.4,
      ease: 'power2.inOut',
    }, '-=0.2')
    .to(fruit3Ref.current, {
      backgroundColor: '#1e3a28',
      duration: 0.4,
      ease: 'power2.inOut',
    }, '-=0.2')

    // Logo apparaît
    .fromTo(logoRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
      '-=0.2'
    )

    // Pause puis sortie vers le haut
    .to(containerRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power4.inOut',
      delay: 0.6,
      onComplete: () => setVisible(false),
    })

    return () => { tl.kill() }
  }, [])

  if (!visible) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-blanc flex flex-col items-center justify-center gap-10"
    >
      {/* Fruits */}
      <div className="flex items-center gap-6">
        {[
          { ref: fruit1Ref, ...fruits[0] },
          { ref: fruit2Ref, ...fruits[1] },
          { ref: fruit3Ref, ...fruits[2] },
        ].map((f, i) => (
          <div
            key={i}
            ref={f.ref}
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl"
            style={{ backgroundColor: f.couleur }}
          >
            {f.emoji}
          </div>
        ))}
      </div>

      {/* Logo */}
      <div ref={logoRef} className="opacity-0 font-display text-3xl text-vert tracking-widest uppercase">
        For<em className="text-matcha not-italic">naro</em>
      </div>
    </div>
  )
}