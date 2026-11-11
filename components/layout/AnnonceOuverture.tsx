'use client'

import { useEffect, useState } from 'react'
import { areOrdersOpen, ORDERS_OPENING_LABEL } from '@/lib/orders-opening'

export function AnnonceOuverture() {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    setOpen(areOrdersOpen())
  }, [])

  if (open) return null

  return (
    <div className="bg-vert text-white px-6 py-2.5 flex items-center justify-center gap-3 min-h-[40px]">
      <span className="shrink-0">🎄</span>
      <span className="text-[12px] md:text-[13px] font-semibold text-center leading-snug">
        Les commandes ouvrent le {ORDERS_OPENING_LABEL} ! Découvrez dès maintenant nos produits.
      </span>
    </div>
  )
}
