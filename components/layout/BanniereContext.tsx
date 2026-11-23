'use client'

import { createContext, useContext, useState } from 'react'

export type BanniereTaille = 'petite' | 'moyenne' | 'grande'

export const BANNIERE_TAILLE_DEFAUT: BanniereTaille = 'moyenne'

// Classes Tailwind par taille : conteneur, texte, emoji.
export const BANNIERE_TAILLES: Record<BanniereTaille, { label: string; box: string; texte: string; emoji: string }> = {
  petite:  { label: 'Petite',  box: 'py-2.5 min-h-[40px]', texte: 'text-[12px] md:text-[13px] font-medium',  emoji: 'text-base' },
  moyenne: { label: 'Moyenne', box: 'py-3 min-h-[50px]',   texte: 'text-[14px] md:text-[16px] font-semibold', emoji: 'text-xl' },
  grande:  { label: 'Grande',  box: 'py-4 min-h-[64px]',   texte: 'text-[16px] md:text-[20px] font-semibold', emoji: 'text-2xl' },
}

export function getBanniereTaille(taille?: string) {
  return BANNIERE_TAILLES[(taille as BanniereTaille) in BANNIERE_TAILLES ? (taille as BanniereTaille) : BANNIERE_TAILLE_DEFAUT]
}

interface Banniere {
  actif:   boolean
  texte:   string
  emoji:   string
  couleur: 'vert' | 'matcha' | 'or'
  taille?: BanniereTaille
}

interface BanniereContextType {
  banniere:    Banniere
  setBanniere: (b: Banniere) => void
}

const defaultBanniere: Banniere = {
  actif:   false,
  texte:   '',
  emoji:   '',
  couleur: 'vert',
}

const BanniereContext = createContext<BanniereContextType>({
  banniere:    defaultBanniere,
  setBanniere: () => {},
})

export function BanniereProvider({ children }: { children: React.ReactNode }) {
  const [banniere, setBanniere] = useState<Banniere>(defaultBanniere)

  return (
    <BanniereContext.Provider value={{ banniere, setBanniere }}>
      {children}
    </BanniereContext.Provider>
  )
}

export const useBanniere = () => useContext(BanniereContext)