'use client'

import { createContext, useContext, useState } from 'react'

interface Banniere {
  actif:   boolean
  texte:   string
  emoji:   string
  couleur: 'vert' | 'matcha' | 'or'
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