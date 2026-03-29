'use client'

import { useState } from 'react'
import Link from 'next/link'
import { produits, categories, sousTags } from '@/lib/data'
import { Badge } from '@/components/ui/Badge'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { Search } from 'lucide-react'

export default function Produits() {
  const [categorieActive, setCategorieActive] = useState<string>('tous')
  const [sousTagActif, setSousTagActif] = useState<string>('tous')
  const [recherche, setRecherche] = useState('')

  const produitsFiltres = produits.filter((p) => {
    const matchCat    = categorieActive === 'tous' || p.categorie === categorieActive
    const matchSearch = p.nom.toLowerCase().includes(recherche.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="pt-[80px] min-h-screen bg-blanc">

      {/* ── HEADER PAGE ──────────────────────────────────────── */}
      <div className="bg-vert px-20 py-16 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-matcha/10 blur-3xl" />
        <AnimateIn>
          <p className="section-eyebrow text-matcha-light mb-3">Catalogue</p>
          <h1 className="font-display text-5xl text-creme mb-4">Nos produits</h1>
          <p className="text-creme/50 text-[15px] max-w-md">
            Sélectionnés chaque matin sur les marchés du Pays Basque, livrés frais chez vous.
          </p>
        </AnimateIn>
      </div>

      <div className="px-20 py-12">

        {/* ── RECHERCHE ────────────────────────────────────────── */}
        <AnimateIn>
          <div className="relative max-w-md mb-10">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" />
            <input
              type="text"
              placeholder="Chercher un produit..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </AnimateIn>

        {/* ── FILTRES CATÉGORIES ───────────────────────────────── */}
        <AnimateIn delay={0.05}>
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setCategorieActive('tous')}
              className={`px-5 py-2 rounded-full text-[13px] border transition-all ${
                categorieActive === 'tous'
                  ? 'bg-vert text-white border-vert'
                  : 'bg-white text-gris border-creme-dark hover:border-vert hover:text-vert'
              }`}
            >
              Tous
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategorieActive(cat.id)}
                className={`px-5 py-2 rounded-full text-[13px] border transition-all ${
                  categorieActive === cat.id
                    ? 'bg-vert text-white border-vert'
                    : 'bg-white text-gris border-creme-dark hover:border-vert hover:text-vert'
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </AnimateIn>

        {/* ── FILTRES SOUS-TAGS ────────────────────────────────── */}
        <AnimateIn delay={0.1}>
          <div className="flex gap-2 mb-10 flex-wrap">
            <button
              onClick={() => setSousTagActif('tous')}
              className={`px-4 py-1.5 rounded-full text-[12px] border transition-all ${
                sousTagActif === 'tous'
                  ? 'bg-matcha text-white border-matcha font-semibold'
                  : 'bg-creme text-gris border-transparent hover:border-matcha hover:text-vert'
              }`}
            >
              Tous
            </button>
            {sousTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSousTagActif(tag)}
                className={`px-4 py-1.5 rounded-full text-[12px] border transition-all ${
                  sousTagActif === tag
                    ? 'bg-matcha text-white border-matcha font-semibold'
                    : 'bg-creme text-gris border-transparent hover:border-matcha hover:text-vert'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </AnimateIn>

        {/* ── RÉSULTATS ────────────────────────────────────────── */}
        <p className="text-[13px] text-gris mb-6">
          {produitsFiltres.length} produit{produitsFiltres.length > 1 ? 's' : ''} disponible{produitsFiltres.length > 1 ? 's' : ''}
        </p>

        {produitsFiltres.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🥲</p>
            <p className="font-display text-2xl text-vert mb-2">Aucun produit trouvé</p>
            <p className="text-gris text-[14px]">Essayez un autre filtre ou une autre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-6">
            {produitsFiltres.map((p, i) => (
              <AnimateIn key={p.id} delay={i * 0.05} direction="up">
                <Link href={`/produits/${p.id}`}>
                  <div className="card cursor-pointer group">
                    <div
                      className="aspect-square flex items-center justify-center text-6xl relative overflow-hidden"
                      style={{ backgroundColor: p.bgColor }}
                    >
                      <span className="transition-transform group-hover:scale-110 duration-300">
                        {p.emoji}
                      </span>
                      {p.badge && (
                        <span className="absolute top-3 right-3">
                          <Badge label={p.badge} variant="vert" />
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-[15px] font-medium text-texte">{p.nom}</p>
                      <p className="text-[12px] text-gris mt-1">{p.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-display text-[17px] text-vert">
                          {p.prix.toFixed(2)}€
                          <span className="text-[11px] font-body text-gris"> /{p.unite}</span>
                        </span>
                        <span className="text-[11px] text-gris">{p.origine}</span>
                      </div>
                      <button className="mt-4 w-full py-2.5 rounded-xl bg-creme text-vert text-[13px] font-medium hover:bg-vert hover:text-white transition-colors">
                        + Ajouter au panier
                      </button>
                    </div>
                  </div>
                </Link>
              </AnimateIn>
            ))}
          </div>
        )}
      </div>

      {/* ── CONSEIL DU PRIMEUR ───────────────────────────────── */}
      <div className="px-20 pb-20">
        <AnimateIn>
          <div className="bg-vert rounded-3xl px-8 py-6 flex items-center gap-5">
            <span className="text-4xl">💬</span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-matcha-light">
                Le conseil du primeur
              </p>
              <p className="text-creme text-[14px] mt-1 leading-relaxed">
                Les fraises sont particulièrement sucrées cette semaine. Parfaites pour un dessert ou un smoothie frais !
              </p>
            </div>
          </div>
        </AnimateIn>
      </div>

    </div>
  )
}