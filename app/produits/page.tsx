'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { categories } from '@/lib/data'
import { Badge } from '@/components/ui/Badge'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { Search, SlidersHorizontal, X, Check, Loader2, MapPin } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useToast } from '@/components/providers/ToastProvider'
import { calculateDiscount } from '@/lib/price-utils'
import { getProductImage } from '@/lib/product-image-utils'
import Image from 'next/image'

export default function Produits() {
  const [produits, setProduits] = useState<any[]>([])
  const { addItem } = useCartStore()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [categorieActive, setCategorieActive] = useState<string>('tous')
  const [recherche, setRecherche]             = useState('')
  const [drawerOuvert, setDrawerOuvert]       = useState(false)
  const [cityFilter, setCityFilter]           = useState('')
  const [deliveryCities, setDeliveryCities]    = useState<string[]>([])

  useEffect(() => {
    async function fetchDeliveryCities() {
      try {
        const res = await fetch('/api/admin/delivery-settings')
        if (res.ok) {
          const data = await res.json()
          const zones = data.zonesActives ? JSON.parse(data.zonesActives) : []
          setDeliveryCities(zones)
        }
      } catch (e) {
        console.error("Failed to fetch delivery cities:", e)
      }
    }
    fetchDeliveryCities()
  }, [])

  useEffect(() => {
    async function fetchProducts() {
      try {
        const url = cityFilter
          ? `/api/products?city=${encodeURIComponent(cityFilter)}`
          : '/api/products'
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          const mapped = data.map((p: any) => ({
            ...p,
            nom: p.name,
            prix: p.price,
            unite: p.unit,
            origine: p.origin,
            categorie: p.category
          }))
          setProduits(mapped)
        }
      } catch (e) {
        console.error("Failed to fetch products:", e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [cityFilter])

  const produitsFiltres = produits.filter((p) => {
    const matchCat    = categorieActive === 'tous' || p.categorie === categorieActive
    const matchSearch = p.nom.toLowerCase().includes(recherche.toLowerCase())
    return matchCat && matchSearch
  })

  const nbFiltresActifs = (categorieActive !== 'tous' ? 1 : 0) + (cityFilter ? 1 : 0)

  const resetFiltres = () => {
    setCategorieActive('tous')
    setCityFilter('')
    setDrawerOuvert(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blanc flex items-center justify-center">
        <Loader2 className="animate-spin text-vert" size={32} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blanc">

      {/* ── HEADER ───────────────────────────────────────────── */}
      <div className="bg-vert px-6 md:px-20 py-12 md:py-16 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-matcha/10 blur-3xl" />
        <AnimateIn>
          <p className="section-eyebrow text-matcha-light mb-3">Catalogue</p>
          <h1 className="font-display text-4xl md:text-5xl text-creme mb-4">Nos produits</h1>
          <p className="text-creme/50 text-[14px] md:text-[15px] max-w-md">
            Sélectionnés pour vous chaque matin sur notre stand et livrés chez vous.
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
            <div className="relative min-w-[160px]">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gris pointer-events-none" />
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="input-field pl-9 pr-8 appearance-none bg-white cursor-pointer text-[13px]"
              >
                <option value="">Toutes les villes</option>
                {deliveryCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
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
            <div className="flex gap-2 mb-10 flex-wrap">
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
            {cityFilter && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-matcha text-white text-[12px] font-medium">
                <MapPin size={10} />
                {cityFilter}
                <button onClick={() => setCityFilter('')}>
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6" key="product-grid">
            {produitsFiltres.map((p, i) => (
              <AnimateIn key={`prod-${p.id}`} delay={i * 0.05} direction="up">
                <Link href={`/produits/${p.id}`}>
                  <div className="card cursor-pointer group">
                    <div
                      className="aspect-square flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: '#f5f5f5' }}
                    >
                      <Image
                        src={getProductImage(p)}
                        alt={p.nom}
                        fill
                        className="object-cover transition-transform group-hover:scale-110 duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      {p.badge && (
                        <span className="absolute top-2 right-2 md:top-3 md:right-3 z-10">
                          <Badge label={p.badge} variant="vert" />
                        </span>
                      )}
                    </div>
                    <div className="p-3 md:p-4">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] md:text-[15px] font-medium text-texte">{p.nom}</p>
                        {(() => {
                          const { hasPromotion, discountPercent, promotionType, promotion } = calculateDiscount(p);
                          if (!hasPromotion) return null;
                          const label = promotionType === 'bundle'
                            ? `${promotion.bundleQuantity} pour ${promotion.bundlePrice}€`
                            : promotionType === 'fixed'
                            ? `-${promotion.discountAmount}€`
                            : `-${discountPercent}%`;
                          return (
                            <span className="bg-matcha text-white text-[9px] font-bold px-1.5 rounded-sm shrink-0">
                              {label}
                            </span>
                          );
                        })()}
                      </div>
                      <p className="text-[11px] md:text-[12px] text-gris mt-1 hidden md:block">{p.description}</p>
                      <div className="flex items-center justify-between mt-2 md:mt-3">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const { originalPrice, discountedPrice, hasPromotion } = calculateDiscount(p);
                            return (
                              <>
                                {hasPromotion && (
                                  <span className="font-display text-[12px] text-gris line-through">
                                    {originalPrice.toFixed(2)}€
                                  </span>
                                )}
                                <span className="font-display text-[14px] md:text-[17px] text-vert">
                                  {discountedPrice.toFixed(2)}€
                                  <span className="text-[10px] md:text-[11px] font-body text-gris"> /{p.unite}</span>
                                </span>
                              </>
                            );
                          })()}
                        </div>
                        <span className="text-[10px] md:text-[11px] text-gris hidden sm:block">{p.origine}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          const result = addItem(p)
                          if (result.alreadyExists) {
                            showToast('Produit déjà ajouté au panier', 'info')
                          } else {
                            showToast(`${p.nom} ajouté au panier !`)
                          }
                        }}
                        className="mt-2 md:mt-4 w-full py-2 md:py-2.5 rounded-xl bg-creme text-vert text-[12px] md:text-[13px] font-medium hover:bg-vert hover:text-white transition-colors"
                      >
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
      {drawerOuvert && (
        <div
          className="fixed left-0 right-0 bottom-0 z-[90] md:hidden bg-blanc rounded-t-3xl shadow-2xl"
          style={{ maxHeight: '85vh', overflowY: 'auto' }}
        >
          <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-blanc z-10">
            <div className="w-10 h-1 rounded-full bg-creme-dark" />
          </div>

          <div className="px-6 pb-10 pt-4">

            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl text-vert">Filtres</h3>
              <button
                onClick={() => setDrawerOuvert(false)}
                className="w-8 h-8 rounded-full border border-creme-dark grid place-items-center text-gris"
              >
                <X size={14} />
              </button>
            </div>

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

            <div className="mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gris mb-3">
                Ville de livraison
              </p>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="input-field w-full appearance-none bg-white cursor-pointer"
              >
                <option value="">Toutes les villes</option>
                {deliveryCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

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
      )}

    </div>
  )
}