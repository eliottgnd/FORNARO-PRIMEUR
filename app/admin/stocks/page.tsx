'use client'

import { useState } from 'react'
import { produits } from '@/lib/data'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { Search, Pencil, Plus } from 'lucide-react'

export default function Stocks() {
  const [recherche, setRecherche] = useState('')

  const produitsFiltres = produits.filter((p) =>
    p.nom.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <div>
      <AnimateIn>
        <p className="section-eyebrow mb-2">Admin</p>
        <h1 className="font-display text-3xl md:text-4xl text-vert mb-8 md:mb-10">
          Gestion des stocks
        </h1>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" />
            <input
              type="text"
              placeholder="Chercher un produit..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button className="btn-primary flex items-center justify-center gap-2">
            <Plus size={15} />
            Ajouter un produit
          </button>
        </div>
      </AnimateIn>

      <AnimateIn delay={0.15}>
        <div className="bg-white rounded-3xl border border-creme-dark overflow-hidden">

          {/* Header table — desktop seulement */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_80px] px-6 py-3 bg-creme border-b border-creme-dark">
            {['Produit', 'Catégorie', 'Prix', 'Origine', ''].map((h) => (
              <p key={h} className="text-[11px] font-semibold uppercase tracking-wider text-gris">
                {h}
              </p>
            ))}
          </div>

          <div className="divide-y divide-creme">
            {produitsFiltres.map((p) => (
              <div key={p.id}>

                {/* Layout desktop */}
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_80px] px-6 py-4 items-center hover:bg-creme/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: p.bgColor }}
                    >
                      {p.emoji}
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-texte">{p.nom}</p>
                      {p.badge && (
                        <span className="text-[10px] bg-vert text-white px-2 py-0.5 rounded-full font-semibold">
                          {p.badge}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-[13px] text-gris capitalize">{p.categorie}</p>
                  <p className="font-display text-[15px] text-vert">
                    {p.prix.toFixed(2)}€
                    <span className="text-[11px] font-body text-gris"> /{p.unite}</span>
                  </p>
                  <p className="text-[13px] text-gris">{p.origine}</p>
                  <button className="flex items-center gap-1.5 text-[12px] text-matcha hover:text-vert transition-colors">
                    <Pencil size={13} /> Modifier
                  </button>
                </div>

                {/* Layout mobile */}
                <div className="md:hidden px-4 py-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: p.bgColor }}
                    >
                      {p.emoji}
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-texte">{p.nom}</p>
                      <p className="text-[12px] text-gris mt-0.5">{p.origine}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="font-display text-[15px] text-vert">
                      {p.prix.toFixed(2)}€
                      <span className="text-[11px] font-body text-gris"> /{p.unite}</span>
                    </p>
                    <button className="flex items-center gap-1 text-[12px] text-matcha">
                      <Pencil size={12} /> Modifier
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </AnimateIn>
    </div>
  )
}