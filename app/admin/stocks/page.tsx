'use client'

import { useState, useEffect } from 'react'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { Search, Pencil, Plus, Loader2, X, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getProductImagePreview, getProductImage } from '@/lib/product-image-utils'

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
  availabilities?: { city: string }[]
}

export default function Stocks() {
  const [produits, setProduits] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [recherche, setRecherche] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [deliveryCities, setDeliveryCities] = useState<string[]>([])
  const [loadingCities, setLoadingCities] = useState<boolean>(true)
  const [uploadingImage, setUploadingImage] = useState<boolean>(false)
  const [currentImage, setCurrentImage] = useState<string | undefined>(undefined)

  const fetchProduits = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/products')
      if (res.ok) {
        const data = await res.json()
        setProduits(data)
      }
    } catch (e) {
      console.error("Failed to fetch products:", e)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDeliveryCities = async () => {
    setLoadingCities(true)
    try {
      const res = await fetch('/api/admin/delivery-settings')
      if (res.ok) {
        const data = await res.json()
        const zones = data.zonesActives ? JSON.parse(data.zonesActives) : []
        setDeliveryCities(zones)
      }
    } catch (e) {
      console.error("Failed to fetch delivery cities:", e)
    } finally {
      setLoadingCities(false)
    }
  }

  useEffect(() => {
    fetchProduits()
    fetchDeliveryCities()
  }, [])

  useEffect(() => {
    if (isModalOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`

      const handleWheel = (e: WheelEvent) => {
        e.preventDefault()
        e.stopPropagation()
      }

      window.addEventListener('wheel', handleWheel, { passive: false })
      return () => {
        window.removeEventListener('wheel', handleWheel)
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
        document.body.style.paddingRight = ''
      }
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isModalOpen])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const { filename } = await res.json()
        setCurrentImage(filename)
      } else {
        const err = await res.json()
        alert(err.message || 'Erreur lors du téléchargement de l\'image')
      }
    } catch (e) {
      alert('Erreur réseau lors du téléchargement')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaveLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    // Ensure cities are sent as a comma-separated string to match API expectations
    data.cities = selectedCities.join(',')

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products'
      const method = editingProduct ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        await fetchProduits()
        setIsModalOpen(false)
        setEditingProduct(null)
      } else {
        const err = await res.json()
        alert(err.message || 'Une erreur est survenue')
      }
    } catch (e) {
      alert('Erreur réseau')
    } finally {
      setSaveLoading(false)
    }
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setSelectedCities(product.availabilities?.map(a => a.city) || [])
    setCurrentImage(product.image)
    setIsModalOpen(true)
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setSelectedCities([])
    setCurrentImage(undefined)
    setIsModalOpen(true)
  }

  const handleDeleteProduct = (id: string) => {
    setDeleteConfirmId(id)
  }

  const confirmDelete = async () => {
    if (!deleteConfirmId) return
    setSaveLoading(true)
    try {
      const res = await fetch(`/api/admin/products/${deleteConfirmId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        await fetchProduits()
        setDeleteConfirmId(null)
      } else {
        const err = await res.json()
        alert(err.message || 'Une erreur est survenue')
      }
    } catch (e) {
      alert('Erreur réseau')
    } finally {
      setSaveLoading(false)
    }
  }

  const toggleCity = (city: string) => {
    setSelectedCities(prev =>
      prev.includes(city)
        ? prev.filter(c => c !== city)
        : [...prev, city]
    )
  }

  const removeCity = (city: string) => {
    setSelectedCities(prev => prev.filter(c => c !== city))
  }

  const produitsFiltres = produits.filter((p) =>
    p.name.toLowerCase().includes(recherche.toLowerCase())
  )

  return (
    <div className="relative">
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
          <button
            onClick={openAddModal}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Plus size={15} />
            Ajouter un produit
          </button>
        </div>
      </AnimateIn>

      <AnimateIn delay={0.15}>
        <div className="bg-white rounded-3xl border border-creme-dark overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-vert" size={24} />
              <p className="text-gris text-sm">Chargement des stocks...</p>
            </div>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_80px] px-6 py-3 bg-creme border-b border-creme-dark">
                {['Produit', 'Catégorie', 'Prix', 'Origine', ''].map((h) => (
                  <p key={h} className="text-[11px] font-semibold uppercase tracking-wider text-gris">
                    {h}
                  </p>
                ))}
              </div>

              <div className="divide-y divide-creme">
                {produitsFiltres.length === 0 ? (
                  <div className="py-20 text-center text-gris text-sm">
                    {recherche ? 'Aucun produit trouvé.' : 'Aucun produit en stock.'}
                  </div>
                ) : (
                  produitsFiltres.map((p) => (
                    <div key={p.id}>
                      <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_80px] px-6 py-4 items-center hover:bg-creme/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl overflow-hidden"
                            style={{ backgroundColor: '#f5f5f5' }}
                          >
                            <img
                              src={getProductImage(p)}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/public/placeholder.webp'
                              }}
                            />
                          </div>
                          <div>
                            <p className="text-[14px] font-medium text-texte">{p.name}</p>
                            {p.badge && (
                              <span className="text-[10px] bg-vert text-white px-2 py-0.5 rounded-full font-semibold">
                                {p.badge}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-[13px] text-gris capitalize">{p.category}</p>
                        <p className="font-display text-[15px] text-vert">
                          {p.price.toFixed(2)}€
                          <span className="text-[11px] font-body text-gris"> /{p.unit}</span>
                        </p>
                        <p className="text-[13px] text-gris">{p.origin}</p>
                        <div className="flex flex-col items-end gap-1">
                          <button
                            onClick={() => openEditModal(p)}
                            className="flex items-center gap-1.5 text-[12px] text-matcha hover:text-vert transition-colors"
                          >
                            <Pencil size={13} /> Modifier
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="flex items-center gap-1.5 text-[12px] text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={13} /> Supprimer
                          </button>
                        </div>
                      </div>

                      <div className="md:hidden px-4 py-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0 overflow-hidden"
                            style={{ backgroundColor: '#f5f5f5' }}
                          >
                            <img
                              src={getProductImage(p)}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/public/placeholder.webp'
                              }}
                            />
                          </div>
                          <div>
                            <p className="text-[14px] font-medium text-texte">{p.name}</p>
                            <p className="text-[12px] text-gris mt-0.5">{p.origin}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <p className="font-display text-[15px] text-vert">
                            {p.price.toFixed(2)}€
                            <span className="text-[11px] font-body text-gris"> /{p.unit}</span>
                          </p>
                          <div className="flex flex-col items-end gap-1">
                            <button
                              onClick={() => openEditModal(p)}
                              className="flex items-center gap-1 text-[12px] text-matcha hover:text-vert transition-colors"
                            >
                              <Pencil size={12} /> Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="flex items-center gap-1 text-[12px] text-red-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={12} /> Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </AnimateIn>

      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-blanc/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-creme-dark overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} />
              </div>
              <h2 className="font-display text-xl text-texte mb-2">Confirmer la suppression</h2>
              <p className="text-gris text-sm mb-6">
                Êtes-vous sûr de vouloir supprimer le produit <span className="font-medium text-texte">"{produits.find(p => p.id === deleteConfirmId)?.name}"</span> ?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2 text-[13px] font-medium text-gris hover:text-texte transition-colors"
                >
                  Annuler
                </button>
                <Button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Suppression...' : 'Supprimer'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blanc/50 backdrop-blur-sm p-4 overflow-hidden">
          <div className="relative w-full max-w-4xl max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-creme-dark overflow-hidden flex flex-col stocks-modal-inner">
            <div className="px-6 py-4 border-b border-creme-dark flex items-center justify-between bg-creme/30 shrink-0">
              <h2 className="font-display text-xl text-vert">
                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gris hover:text-vert transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 overflow-y-auto flex-1 modal-scrollable" tabIndex={-1} style={{ outline: 'none' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-gris">Nom du produit</label>
                  <input name="name" defaultValue={editingProduct?.name || ''} required className="input-field w-full" />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-gris">Catégorie</label>
                  <select name="category" defaultValue={editingProduct?.category || 'fruits'} className="input-field w-full">
                    <option value="fruits">Fruits</option>
                    <option value="legumes">Légumes</option>
                    <option value="epicerie">Épicerie</option>
                    <option value="local">Local</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-gris">Prix (€)</label>
                  <input name="price" type="number" step="0.01" defaultValue={editingProduct?.price || ''} required className="input-field w-full" />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-gris">Unité (ex: kg, botte)</label>
                  <input name="unit" defaultValue={editingProduct?.unit || 'kg'} required className="input-field w-full" />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-gris">Origine</label>
                  <input name="origin" defaultValue={editingProduct?.origin || ''} required className="input-field w-full" />
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-gris">Image du produit (.webp uniquement)</label>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept=".webp"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="product-image-upload"
                      />
                      <label
                        htmlFor="product-image-upload"
                        className="btn-secondary text-[12px] px-3 py-1.5 cursor-pointer flex items-center justify-center gap-2"
                      >
                        {uploadingImage ? <Loader2 size={12} className="animate-spin" /> : null}
                        {uploadingImage ? 'Téléchargement...' : 'Choisir une image'}
                      </label>
                      <input
                        name="image"
                        value={currentImage || editingProduct?.image || ''}
                        readOnly
                        className="input-field flex-1 text-[12px] bg-creme/50"
                        placeholder="Nom du fichier image"
                      />
                    </div>
                    {currentImage && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-creme-dark">
                        <img src={`/${currentImage}`} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-gris">Badge (Optionnel)</label>
                  <input name="badge" defaultValue={editingProduct?.badge || ''} className="input-field w-full" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[12px] font-medium text-gris">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingProduct?.description || ''}
                    className="input-field w-full h-24 resize-none"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[12px] font-medium text-gris">Quantité en stock</label>
                  <input name="stockQuantity" type="number" defaultValue={editingProduct?.stockQuantity || 0} className="input-field w-full" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[12px] font-medium text-gris">Villes de disponibilité</label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {deliveryCities.map((city) => (
                        <button
                          type="button"
                          key={city}
                          onClick={() => toggleCity(city)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                            selectedCities.includes(city)
                              ? 'bg-vert text-white border-vert shadow-sm'
                              : 'bg-white text-gris border-creme-dark hover:border-vert hover:text-vert'
                          }`}
                        >
                          {city}
                        </button>
                      ))}
                      {deliveryCities.length === 0 && loadingCities === false && (
                        <p className="text-gris text-[11px] italic">Aucune ville configurée dans les paramètres de livraison.</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCities.map((city) => (
                        <span
                          key={city}
                          className="px-2 py-1 bg-vert/10 text-vert text-[11px] font-medium rounded-lg flex items-center gap-1"
                        >
                          {city}
                          <button onClick={() => removeCity(city)} className="hover:text-red-500">
                            <X size={10} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <input type="hidden" name="cities" value={selectedCities.join(',')} />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 text-[13px] font-medium text-gris hover:text-texte transition-colors"
                >
                  Annuler
                </button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={saveLoading}
                >
                  {saveLoading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
