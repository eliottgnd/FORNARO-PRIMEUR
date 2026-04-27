'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { ArrowLeft, ShoppingBasket, Heart, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import { useCartStore } from '@/store/useCartStore'
import { useSession } from 'next-auth/react'
import { useToast } from '@/components/providers/ToastProvider'
import { calculateDiscount } from '@/lib/price-utils'
import { getProductImage } from '@/lib/product-image-utils'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  description?: string
  category: string
  price: number
  unit: string
  origin: string
  image?: string
  badge?: string
  stockQuantity: number
  promotions?: { discountPercent: number; label: string }[]
  availabilities?: string[]
}

export default function FicheProduit() {
  const { id } = useParams()
  const [produit, setProduit] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [quantite, setQuantite] = useState(1)
  const [ajoute, setAjoute] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false)
  const { addItem } = useCartStore()
  const { toggleFavorite } = useFavoritesStore()
  const { data: session } = useSession()
  const { showToast } = useToast()

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`)
        if (res.ok) {
          const data = await res.json()
          setProduit(data)
          setIsFavorited(useFavoritesStore.getState().isFavorite(data.id))

          // Fetch related products after we have the product data
          try {
            const relatedRes = await fetch('/api/products')
            if (relatedRes.ok) {
              const allProducts = await relatedRes.json()
              setRelatedProducts(
                allProducts
                  .filter((p: Product) => p.category === data.category && p.id !== id)
                  .slice(0, 4)
              )
            }
          } catch (e) {
            console.error("Failed to fetch related products:", e)
          }
        } else {
          setProduit(null)
        }
      } catch (e) {
        console.error("Failed to fetch product:", e)
        setProduit(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (isLoading) {
    return (
      <div className="pt-[80px] min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-vert" size={32} />
      </div>
    )
  }

  if (!produit) {
    return (
      <div className="pt-[80px] min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-5xl mb-4">🥲</p>
          <p className="font-display text-2xl text-vert mb-2">Produit introuvable</p>
          <Link href="/produits">
            <button className="btn-primary mt-4">Retour aux produits</button>
          </Link>
        </div>
      </div>
    )
  }

  const handleAjouter = () => {
    const productForCart = {
      ...produit,
      nom: produit.name,
      prix: produit.price,
      unite: produit.unit,
      origine: produit.origin,
      categorie: produit.category,
      promotions: produit.promotions || [],
    }
    const result = addItem(productForCart)
    if (result.alreadyExists) {
      showToast('Produit déjà ajouté au panier', 'info')
    } else {
      showToast(`${produit.name} ajouté au panier !`)
    }
    setAjoute(true)
    setTimeout(() => setAjoute(false), 2000)
  }

  const handleToggleFavorite = async () => {
    if (!session) {
      showToast('Veuillez vous connecter pour ajouter aux favoris', 'info')
      return
    }
    if (!produit) return

    setIsTogglingFavorite(true)
    try {
      const isFav = useFavoritesStore.getState().isFavorite(produit.id)
      const method = isFav ? 'DELETE' : 'POST'
      const url = isFav ? `/api/favorites?productId=${produit.id}` : '/api/favorites'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: method === 'POST' ? JSON.stringify({ productId: produit.id }) : undefined,
      })

      if (res.ok) {
        toggleFavorite(produit.id)
        setIsFavorited(!isFav)
        showToast(isFav ? 'Retiré des favoris' : 'Ajouté aux favoris !')
      }
    } catch (e) {
      console.error("Failed to toggle favorite:", e)
    } finally {
      setIsTogglingFavorite(false)
    }
  }

  const { originalPrice, discountedPrice, discountPercent, hasPromotion } = calculateDiscount(produit)

  return (
    <div className="min-h-screen bg-blanc">

      {/* Retour */}
      <div className="px-6 md:px-20 pt-6 pb-2 md:py-6">
        <Link
          href="/produits"
          className="flex items-center gap-2 text-[13px] text-gris hover:text-vert transition-colors w-fit"
        >
          <ArrowLeft size={15} />
          Retour aux produits
        </Link>
      </div>

      {/* ── FICHE PRINCIPALE ─────────────────────────────────── */}
      <div className="px-6 md:px-20 pb-12 md:pb-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">

        {/* Visuel */}
        <AnimateIn direction="left">
          <div
            className="rounded-3xl aspect-square flex items-center justify-center text-[120px] md:text-[180px] relative overflow-hidden"
            style={{ backgroundColor: '#f5f5f5' }}
          >
            {(() => {
              const imgSrc = getProductImage(produit)
              const isPlaceholder = imgSrc === '/placeholder.webp'
              return isPlaceholder ? (
                <span className="select-none text-6xl">🍃</span>
              ) : (
                <Image
                  src={imgSrc}
                  alt={produit.name}
                  fill
                  className="object-cover"
                  priority
                />
              )
            })()}
            {produit.badge && (
              <span className="absolute top-4 right-4 md:top-5 md:right-5">
                <Badge label={produit.badge} variant="vert" />
              </span>
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
          </div>
        </AnimateIn>

        {/* Infos */}
        <AnimateIn direction="right">
          <div className="py-0 md:py-4">

            <div className="flex items-center gap-3 mb-3 md:mb-4">
              <span className="section-eyebrow">{produit.category}</span>
              <span className="text-gris">·</span>
              <span className="text-[13px] text-gris">{produit.origin}</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl text-vert mb-3 md:mb-4">{produit.name}</h1>

            <p className="text-[14px] md:text-[15px] text-gris leading-relaxed mb-6 md:mb-8">
              {produit.description}
            </p>

            {produit.availabilities && produit.availabilities.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {produit.availabilities.map((city) => (
                  <span
                    key={city}
                    className="px-3 py-1 rounded-full bg-creme text-gris text-[11px] md:text-[12px] border border-creme-dark"
                  >
                    📍 {city}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-baseline gap-2 mb-6 md:mb-8">
              <div className="flex items-center gap-3">
                {hasPromotion && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="bg-matcha text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        -{discountPercent}%
                      </span>
                      <span className="font-display text-2xl md:text-3xl text-gris line-through decoration-gris/50">
                        {originalPrice.toFixed(2)}€
                      </span>
                    </div>
                  </>
                )}
                <span className="font-display text-4xl md:text-5xl text-vert">
                  {discountedPrice.toFixed(2)}€
                </span>
                <span className="text-gris text-[14px] md:text-[15px]">/ {produit.unit}</span>
              </div>
            </div>

            {/* Quantite + Ajouter */}
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3 bg-creme rounded-2xl px-3 md:px-4 py-2.5 md:py-3 border border-creme-dark">
                <button
                  onClick={() => setQuantite(Math.max(0.5, quantite - 0.5))}
                  className="w-7 h-7 rounded-full bg-white border border-creme-dark text-vert font-semibold hover:bg-vert hover:text-white transition-colors grid place-items-center"
                >
                  -
                </button>
                <span className="font-display text-xl text-vert w-5 text-center">{quantite}</span>
                <button
                  onClick={() => setQuantite(quantite + 0.5)}
                  className="w-7 h-7 rounded-full bg-white border border-creme-dark text-vert font-semibold hover:bg-vert hover:text-white transition-colors grid place-items-center"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAjouter}
                className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 font-semibold text-[13px] md:text-[14px] transition-all ${
                  ajoute
                    ? 'bg-matcha text-white scale-[0.98]'
                    : 'bg-vert text-white hover:bg-vert-mid'
                }`}
              >
                <ShoppingBasket size={16} />
                {ajoute ? 'Ajouté !' : `Ajouter — ${(discountedPrice * quantite).toFixed(2)}€`}
              </button>

              <button
                onClick={handleToggleFavorite}
                disabled={isTogglingFavorite}
                className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl border grid place-items-center shrink-0 transition-all ${
                  isFavorited
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'border-creme-dark text-gris hover:text-vert hover:border-vert'
                }`}
              >
                <Heart size={17} fill={isFavorited ? 'currentColor' : 'none'} />
              </button>
            </div>

            {produit.stockQuantity > 0 ? (
              <p className="text-[12px] text-gris">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1.5" />
                En stock ({produit.stockQuantity} {produit.unit} disponibles)
              </p>
            ) : (
              <p className="text-[12px] text-red-500">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1.5" />
                Rupture de stock
              </p>
            )}

          </div>
        </AnimateIn>
      </div>

      {/* ── PRODUITS LIÉS ────────────────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="bg-creme px-6 md:px-20 py-12 md:py-16">
          <AnimateIn>
            <h2 className="font-display text-2xl md:text-3xl text-vert mb-6 md:mb-8">
              Vous aimerez aussi
            </h2>
          </AnimateIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {relatedProducts.map((p, i) => (
              <AnimateIn key={p.id} delay={i * 0.08} direction="up">
                <Link href={`/produits/${p.id}`}>
                  <div className="card cursor-pointer group">
                    <div
                      className="aspect-square flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: '#f5f5f5' }}
                    >
                      {(() => {
                        const imgSrc = getProductImage(p)
                        const isPlaceholder = imgSrc === '/placeholder.webp'
                        return isPlaceholder ? (
                          <span className="text-4xl md:text-5xl">🍃</span>
                        ) : (
                          <Image
                            src={imgSrc}
                            alt={p.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-110 duration-300"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        )
                      })()}
                      {p.badge && (
                        <span className="absolute top-2 right-2 md:top-3 md:right-3 z-10">
                          <Badge label={p.badge} variant="vert" />
                        </span>
                      )}
                    </div>
                    <div className="p-3 md:p-4">
                      <p className="text-[13px] md:text-[14px] font-medium text-texte">{p.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-display text-[14px] md:text-[15px] text-vert">
                          {p.price.toFixed(2)}€
                          <span className="text-[10px] md:text-[11px] font-body text-gris"> /{p.unit}</span>
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          const productForCart = {
                            ...p,
                            nom: p.name,
                            prix: p.price,
                            unite: p.unit,
                            origine: p.origin,
                            categorie: p.category,
                            promotions: p.promotions || [],
                          }
                          const result = addItem(productForCart)
                          if (result.alreadyExists) {
                            showToast('Produit déjà ajouté au panier', 'info')
                          } else {
                            showToast(`${p.name} ajouté au panier !`)
                          }
                        }}
                        className="mt-2 md:mt-3 w-full py-2 rounded-xl bg-creme text-vert text-[12px] font-medium hover:bg-vert hover:text-white transition-colors"
                      >
                        + Ajouter
                      </button>
                    </div>
                  </div>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </section>
      )}

    </div>
  )
}