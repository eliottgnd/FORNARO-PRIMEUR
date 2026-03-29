'use client'

import { useState } from 'react'
import Link from 'next/link'
import { produits, categories, sousTags } from '@/lib/data'
import { Badge } from '@/components/ui/Badge'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { Search, SlidersHorizontal, X, Check } from 'lucide-react'

export default function Produits() {
  const [categorieActive, setCategorieActive] = useState<string>('tous')
  const [sousTagActif, setSousTagActif]       = useState<string>('tous')
  const [recherche, setRecherche]             = useState('')
  const [drawerOuvert, setDrawerOuvert]       = useState(false)

  const produitsFiltres = produits.filter((p) => {
    const matchCat    = categorieActive === 'tous' || p.categorie === categorieActive
    const matchSearch = p.nom.toLowerCase().includes(recherche.toLowerCase())
    return matchCat && matchSearch
  })

  const nbFiltresActifs = (categorieActive !== 'tous' ? 1 : 0) + (sousTagActif !== 'tous' ? 1 : 0)

  const resetFiltres = () => {
    setCategorieActive('tous')
    setSousTagActif('tous')
    setDrawerOuvert(false)
  }

  return (
    <div className=" min-h-screen bg-blanc">

      {/* ── HEADER ───────────────────────────────────────────── */}
      <div className="bg-vert px-6 md:px-20 py-12 md:py-16 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-matcha/10 blur-3xl" />
        <AnimateIn>
          <p className="section-eyebrow text-matcha-light mb-3">Catalogue</p>
          <h1 className="font-display text-4xl md:text-5xl text-creme mb-4">Nos produits</h1>
          <p className="text-creme/50 text-[14px] md:text-[15px] max-w-md">
            Selectionnes chaque matin sur les marches du Pays Basque, livres frais chez vous.
          </p>
        </AnimateIn>
      </div>

      <div className="px-6 md:px-20 py-8 md:py-12">

        {/* ── BARRE RECHERCHE + FILTRES ────────────────────────── */}
        <AnimateIn>
          <div className="flex gap-3 mb-6 md:mb-8">
            <div className="relative flex-1 md:max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" />
              <input
                type="text"
                placeholder="Chercher un produit..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <button
              onClick={() => setDrawerOuvert(true)}
              className="md:hidden flex items-center gap-2 px-4 py-3 rounded-2xl border border-creme-dark bg-white text-[13px] font-medium text-vert relative"
            >
              <SlidersHorizontal size={16} />
              Filtres
              {nbFiltresActifs > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-matcha text-white text-[10px] font-bold grid place-items-center">
                  {nbFiltresActifs}
                </span>
              )}
            </button>
          </div>
        </AnimateIn>

        {/* ── FILTRES DESKTOP ──────────────────────────────────── */}
        <div className="hidden md:block">
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
        </div>

        {/* Filtres actifs mobile */}
        {nbFiltresActifs > 0 && (
          <div className="flex md:hidden gap-2 mb-4 flex-wrap">
            {categorieActive !== 'tous' && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-vert text-white text-[12px] font-medium">
                {categories.find((c) => c.id === categorieActive)?.label}
                <button onClick={() => setCategorieActive('tous')}>
                  <X size={12} />
                </button>
              </span>
            )}
            {sousTagActif !== 'tous' && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-matcha text-white text-[12px] font-medium">
                {sousTagActif}
                <button onClick={() => setSousTagActif('tous')}>
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}

        {/* ── RESULTATS ────────────────────────────────────────── */}
        <p className="text-[12px] md:text-[13px] text-gris mb-6">
          {produitsFiltres.length} produit{produitsFiltres.length > 1 ? 's' : ''} disponible{produitsFiltres.length > 1 ? 's' : ''}
        </p>

        {produitsFiltres.length === 0 ? (
          <div className="text-center py-16 md:py-24">
            <p className="text-5xl mb-4">🥲</p>
            <p className="font-display text-2xl text-vert mb-2">Aucun produit trouve</p>
            <p className="text-gris text-[14px]">Essayez un autre filtre ou une autre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {produitsFiltres.map((p, i) => (
              <AnimateIn key={p.id} delay={i * 0.05} direction="up">
                <Link href={`/produits/${p.id}`}>
                  <div className="card cursor-pointer group">
                    <div
                      className="aspect-square flex items-center justify-center text-4xl md:text-6xl relative overflow-hidden"
                      style={{ backgroundColor: p.bgColor }}
                    >
                      <span className="transition-transform group-hover:scale-110 duration-300">
                        {p.emoji}
                      </span>
                      {p.badge && (
                        <span className="absolute top-2 right-2 md:top-3 md:right-3">
                          <Badge label={p.badge} variant="vert" />
                        </span>
                      )}
                    </div>
                    <div className="p-3 md:p-4">
                      <p className="text-[13px] md:text-[15px] font-medium text-texte">{p.nom}</p>
                      <p className="text-[11px] md:text-[12px] text-gris mt-1 hidden md:block">{p.description}</p>
                      <div className="flex items-center justify-between mt-2 md:mt-3">
                        <span className="font-display text-[14px] md:text-[17px] text-vert">
                          {p.prix.toFixed(2)}€
                          <span className="text-[10px] md:text-[11px] font-body text-gris"> /{p.unite}</span>
                        </span>
                        <span className="text-[10px] md:text-[11px] text-gris hidden sm:block">{p.origine}</span>
                      </div>
                      <button className="mt-2 md:mt-4 w-full py-2 md:py-2.5 rounded-xl bg-creme text-vert text-[12px] md:text-[13px] font-medium hover:bg-vert hover:text-white transition-colors">
                        + Ajouter
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
      <div className="px-6 md:px-20 pb-16 md:pb-20">
        <AnimateIn>
          <div className="bg-vert rounded-3xl px-6 md:px-8 py-5 md:py-6 flex items-center gap-4 md:gap-5">
            <span className="text-3xl md:text-4xl">💬</span>
            <div>
              <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-widest text-matcha-light">
                Le conseil du primeur
              </p>
              <p className="text-creme text-[13px] md:text-[14px] mt-1 leading-relaxed">
                Les fraises sont particulierement sucrees cette semaine. Parfaites pour un dessert ou un smoothie frais !
              </p>
            </div>
          </div>
        </AnimateIn>
      </div>

      {/* ── OVERLAY ──────────────────────────────────────────── */}
      {drawerOuvert && (
        <div
          className="fixed inset-0 bg-black/40 z-[80] md:hidden"
          onClick={() => setDrawerOuvert(false)}
        />
      )}

      {/* ── DRAWER FILTRES MOBILE ────────────────────────────── */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-[90] md:hidden bg-blanc rounded-t-3xl shadow-2xl transition-transform duration-300 ease-out ${
          drawerOuvert ? 'translate-y-0' : 'translate-y-[110%]'
        }`}
        style={{ maxHeight: '85vh', overflowY: 'auto' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-blanc z-10">
          <div className="w-10 h-1 rounded-full bg-creme-dark" />
        </div>

        <div className="px-6 pb-10 pt-4">

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl text-vert">Filtres</h3>
            <button
              onClick={() => setDrawerOuvert(false)}
              className="w-8 h-8 rounded-full border border-creme-dark grid place-items-center text-gris"
            >
              <X size={14} />
            </button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gris mb-3">
              Categorie
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[{ id: 'tous', label: 'Tous', emoji: '✨' }, ...categories].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategorieActive(cat.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-[13px] font-medium border transition-all ${
                    categorieActive === cat.id
                      ? 'bg-vert text-white border-vert'
                      : 'bg-white text-gris border-creme-dark'
                  }`}
                >
                  <span>{'emoji' in cat ? cat.emoji : ''}</span>
                  <span>{cat.label}</span>
                  {categorieActive === cat.id && <Check size={14} className="ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sous-tags */}
          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gris mb-3">
              Type
            </p>
            <div className="flex flex-wrap gap-2">
              {['Tous', ...sousTags].map((tag) => {
                const val = tag === 'Tous' ? 'tous' : tag
                return (
                  <button
                    key={tag}
                    onClick={() => setSousTagActif(val)}
                    className={`px-4 py-2 rounded-full text-[12px] border transition-all ${
                      sousTagActif === val
                        ? 'bg-matcha text-white border-matcha font-semibold'
                        : 'bg-creme text-gris border-transparent'
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={resetFiltres}
              className="flex-1 py-3 rounded-2xl border border-creme-dark text-[13px] font-medium text-gris"
            >
              Reinitialiser
            </button>
            <button
              onClick={() => setDrawerOuvert(false)}
              className="flex-1 py-3 rounded-2xl bg-vert text-white text-[13px] font-medium"
            >
              Voir {produitsFiltres.length} produit{produitsFiltres.length > 1 ? 's' : ''}
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}