'use client'

import { useBanniere } from './BanniereContext'
import { X } from 'lucide-react'

export function BannierePromo() {
  const { banniere, setBanniere } = useBanniere()

  if (!banniere.actif) return null

  const bgClass =
    banniere.couleur === 'matcha' ? 'bg-matcha' :
    banniere.couleur === 'or'     ? 'bg-or'     :
    'bg-vert'

  const textClass =
    banniere.couleur === 'or' ? 'text-vert' : 'text-white'

  return (
    <div className={`sticky top-0 z-[60] ${bgClass} ${textClass} px-6 pr-12 py-2.5 flex items-center justify-center gap-3 min-h-[40px]`}>
      <span className="shrink-0">{banniere.emoji}</span>
      <span className="text-[12px] md:text-[13px] font-medium text-center leading-snug">
        {banniere.texte}
      </span>
      <button
        onClick={() => setBanniere({ ...banniere, actif: false })}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
      >
        <X size={14} />
      </button>
    </div>
  )
}