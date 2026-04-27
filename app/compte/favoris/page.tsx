'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { Heart, ArrowLeft, Trash2, Loader2, ShoppingBasket } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/store/useCartStore'
import { useToast } from '@/components/providers/ToastProvider'
import { calculateDiscount } from '@/lib/price-utils'
import { getProductImage } from '@/lib/product-image-utils'
import Image from 'next/image'

export default function Favoris() {
  const { data: session } = useSession()
  const [favorites, setFavorites] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const { addItem } = useCartStore()
  const { showToast } = useToast()

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const res = await fetch('/api/favorites')
        if (res.ok) {
          const data = await res.json()
          setFavorites(data)
        }
      } catch (e) {
        console.error("Failed to fetch favorites:", e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchFavorites()
  }, [])

  const handleRemove = async (productId: string) => {
    setRemovingId(productId)
    try {
      const res = await fetch(`/api/favorites?productId=${productId}`, { method: 'DELETE' })
      if (res.ok) {
        setFavorites(prev => prev.filter(p => p.id !== productId))
        showToast('Produit retiré des favoris')
      }
    } catch (e) {
      console.error("Failed to remove favorite:", e)
    } finally {
      setRemovingId(null)
    }
  }

  const handleAddToCart = (product: any) => {
    const productForCart = {
      ...product,
      nom: product.name,
      prix: product.price,
      unite: product.unit,
      origine: product.origin,
      categorie: product.category,
      promotions: product.promotions || [],
    }
    const result = addItem(productForCart)
    if (result.alreadyExists) {
      showToast('Produit déjà ajouté au panier', 'info')
    } else {
      showToast(`${product.name} ajouté au panier !`)
    }
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-gris mb-4">Vous devez être connecté pour accéder à vos favoris.</p>
        <Link href="/" className="btn-primary px-6 py-2">
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Retour */}
      <div className="mb-6">
        <Link
          href="/compte"
          className="flex items-center gap-2 text-[13px] text-gris hover:text-vert transition-colors w-fit"
        >
          <ArrowLeft size={15} />
          Retour à mon compte
        </Link>
      </div>

      <AnimateIn>
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <div className="w-12 h-12 rounded-xl bg-matcha/10 flex items-center justify-center text-matcha">
            <Heart size={22} />
          </div>
          <div>
            <p className="section-eyebrow mb-1">Espace client</p>
            <h1 className="font-display text-3xl md:text-4xl text-vert">Mes favoris</h1>
          </div>
        </div>
      </AnimateIn>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-vert" size={32} />
        </div>
      ) : favorites.length === 0 ? (
        <AnimateIn>
          <div className="bg-creme/50 rounded-3xl p-8 md:p-10 text-center border border-dashed border-creme-dark">
            <div className="w-16 h-16 rounded-full bg-creme flex items-center justify-center text-gris mx-auto mb-4">
              <Heart size={28} />
            </div>
            <p className="font-display text-xl text-vert mb-2">Aucun favori</p>
            <p className="text-gris text-sm mb-6">
              Vous n'avez pas encore de produits favoris.
            </p>
            <Link href="/produits" className="btn-primary inline-flex items-center gap-2">
              <ShoppingBasket size={16} />
              Découvrir nos produits
            </Link>
          </div>
        </AnimateIn>
      ) : (
        <AnimateIn delay={0.05}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {favorites.map((product) => {
              const { originalPrice, discountedPrice, discountPercent, hasPromotion } = calculateDiscount(product)
              return (
                <div key={product.id} className="card relative group">
                  <Link href={`/produits/${product.id}`}>
                    <div
                      className="aspect-square flex items-center justify-center relative overflow-hidden"
                      style={{ backgroundColor: '#f5f5f5' }}
                    >
                      {(() => {
                      const imgSrc = getProductImage(product)
                      const isPlaceholder = imgSrc === '/placeholder.webp'
                      return isPlaceholder ? (
                        <span className="text-4xl md:text-5xl">🍃</span>
                      ) : (
                        <Image
                          src={imgSrc}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-110 duration-300"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      )
                    })()}
                    </div>
                    <div className="p-3 md:p-4">
                      <p className="text-[13px] md:text-[14px] font-medium text-texte line-clamp-1">{product.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-display text-[14px] md:text-[15px] text-vert">
                          {discountedPrice.toFixed(2)}€
                          <span className="text-[10px] md:text-[11px] font-body text-gris"> /{product.unit}</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-2 md:mt-3 w-full py-2 rounded-xl bg-creme text-vert text-[12px] font-medium hover:bg-vert hover:text-white transition-colors"
                  >
                    + Ajouter
                  </button>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemove(product.id)}
                    disabled={removingId === product.id}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-red-400 hover:text-red-600 hover:bg-white flex items-center justify-center shadow-sm transition-all opacity-0 group-hover:opacity-100 md:opacity-100"
                    title="Retirer des favoris"
                  >
                    {removingId === product.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </AnimateIn>
      )}
    </div>
  )
}