'use client'

import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import type { ComponentProps } from 'react'

const initialProps = {
  pathLength: 0,
  opacity: 0,
} as const

const animateProps = {
  pathLength: 1,
  opacity: 1,
} as const

type FornaroSignatureProps = ComponentProps<typeof motion.svg> & {
  speed?: number
}

const signaturePaths = [
  {
    label: 'f',
    d: 'M48 178C63 113 78 61 98 30C112 8 131 12 130 35C129 65 98 93 55 95M32 101C72 98 109 95 146 92',
    duration: 1,
  },
  {
    label: 'o',
    d: 'M164 126C184 91 229 94 231 132C233 166 206 190 178 184C151 178 149 151 164 126Z',
    duration: 0.8,
    delay: 0.75,
  },
  {
    label: 'r',
    d: 'M260 184C269 142 274 117 278 96M275 124C288 100 310 88 326 101C334 108 333 121 326 131',
    duration: 0.75,
    delay: 1.35,
  },
  {
    label: 'n',
    d: 'M348 184C356 142 361 116 365 96M361 134C380 101 421 83 424 119C425 138 414 158 416 173C418 186 434 188 449 171',
    duration: 0.95,
    delay: 1.9,
  },
  {
    label: 'a',
    d: 'M523 107C514 96 496 92 479 101C453 115 441 154 454 175C467 196 500 183 516 153C522 140 525 121 528 96M527 96C521 132 514 168 527 181C538 192 556 183 568 166',
    duration: 1.05,
    delay: 2.75,
  },
  {
    label: 'r2',
    d: 'M588 184C597 142 602 117 606 96M603 124C616 100 638 88 654 101C662 108 661 121 654 131',
    duration: 0.75,
    delay: 3.55,
  },
  {
    label: 'o2',
    d: 'M693 126C713 91 758 94 760 132C762 166 735 190 707 184C680 178 678 151 693 126Z',
    duration: 0.9,
    delay: 4.1,
  },
  {
    label: 'leaf',
    d: 'M517 50C538 24 575 20 598 31C579 57 545 67 517 50ZM518 50C541 47 566 40 590 31',
    duration: 0.75,
    delay: 4.95,
    className: 'text-matcha',
  },
]

function FornaroSignatureEffect({ className, speed = 1, ...props }: FornaroSignatureProps) {
  const calc = (x: number) => x * speed

  return (
    <motion.svg
      className={clsx('h-24 w-full max-w-[760px]', className)}
      exit={{ opacity: 0 }}
      fill="none"
      initial={{ opacity: 1 }}
      stroke="currentColor"
      strokeWidth="13"
      transition={{ duration: 0.5 }}
      viewBox="0 0 800 220"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Fornaro</title>
      {signaturePaths.map(({ label, d, duration, delay = 0, className: pathClassName }) => (
        <motion.path
          key={label}
          animate={animateProps}
          className={pathClassName}
          d={d}
          initial={initialProps}
          style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
          transition={{
            duration: calc(duration),
            ease: 'easeInOut',
            delay: calc(delay),
            opacity: { duration: calc(duration * 0.45), delay: calc(delay) },
          }}
        />
      ))}
    </motion.svg>
  )
}

export function MaintenanceScreen() {
  return (
    <main className="maintenance-screen" aria-labelledby="maintenance-title">
      <div className="maintenance-glow maintenance-glow--left" />
      <div className="maintenance-glow maintenance-glow--right" />

      <section className="maintenance-card">
        <div className="maintenance-signature" aria-hidden="true">
          <FornaroSignatureEffect className="text-vert" speed={0.92} />
        </div>

        <p className="section-eyebrow">Site momentanément en pause</p>
        <h1 id="maintenance-title" className="maintenance-title">
          Fornaro Primeur revient très vite.
        </h1>
        <p className="maintenance-copy">
          Nous mettons la boutique au frais quelques instants pour préparer une meilleure expérience.
          Les commandes, le compte client et l’administration sont temporairement indisponibles.
        </p>
        <div className="maintenance-status" role="status" aria-live="polite">
          <span />
          Réouverture en préparation
        </div>
      </section>
    </main>
  )
}
