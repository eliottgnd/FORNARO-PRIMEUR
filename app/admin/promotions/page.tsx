'use client'

import { useState, useEffect } from 'react'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { useBanniere } from '@/components/layout/BanniereContext'
import { Plus, Tag, Pencil, Loader2, X } from 'lucide-react'
import { getProductImage } from '@/lib/product-image-utils'

interface Promotion {
  id: string
  productId: string
  discountPercent: number
  label: string
  isActive: boolean
  product?: {
    name: string
    image?: string
  }
}

interface PromoCode {
  id: string
  code: string
  discountPercent: number
  currentUsage: number
  isActive: boolean
  startDate?: string | Date
  endDate?: string | Date
}

interface Product {
  id: string
  name: string
  image?: string
}

export default function Promotions() {
  const [promos, setPromos] = useState<Promotion[]>([])
  const [codes, setCodes] = useState<PromoCode[]>([])
  const [produits, setProduits] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false)
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null)
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [codeSaveLoading, setCodeSaveLoading] = useState<boolean>(false)

  const { banniere, setBanniere } = useBanniere()

  const fetchAll = async () => {
    setIsLoading(true)
    try {
      const [pRes, cRes, prRes, bRes] = await Promise.all([
        fetch('/api/admin/promotions'),
        fetch('/api/admin/promo-codes'),
        fetch('/api/admin/products'),
        fetch('/api/admin/banners')
      ])
      if (pRes.ok) setPromos(await pRes.json())
      if (cRes.ok) setCodes(await cRes.json())
      if (prRes.ok) setProduits(await prRes.json())
      if (bRes.ok) {
        const bannerData = await bRes.json()
        setBanniere(bannerData)
      }
    } catch (e) {
      console.error("Failed to fetch promotions:", e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const togglePromo = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/promotions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      if (res.ok) {
        setPromos(promos.map((p) => p.id === id ? { ...p, isActive: !currentStatus } : p))
      }
    } catch (e) {
      console.error("Error toggling promo:", e)
    }
  }

  const deletePromo = async (id: string) => {
    if (!confirm('Supprimer cette promotion ?')) return
    try {
      const res = await fetch(`/api/admin/promotions/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setPromos(promos.filter((p) => p.id !== id))
      }
    } catch (e) {
      console.error("Error deleting promo:", e)
    }
  }

  const handleSavePromotion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaveLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const url = editingPromo ? `/api/admin/promotions/${editingPromo.id}` : '/api/admin/promotions'
      const method = editingPromo ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        await fetchAll()
        setIsModalOpen(false)
        setEditingPromo(null)
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

  return (
    <div>
      <AnimateIn>
        <p className="section-eyebrow mb-2">Admin</p>
        <h1 className="font-display text-3xl md:text-4xl text-vert mb-8 md:mb-10">Promotions</h1>
      </AnimateIn>

      {/* Banniere */}
      <AnimateIn delay={0.05}>
        <div className="bg-white rounded-3xl border border-creme-dark p-5 md:p-6 mb-8 md:mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg md:text-xl text-vert">Banniere promotionnelle</h2>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-gris hidden sm:block">
                {banniere.actif ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={() => setBanniere({ ...banniere, actif: !banniere.actif })}
                className={`relative w-12 h-6 rounded-full transition-all ${
                  banniere.actif ? 'bg-matcha' : 'bg-creme-dark'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                  banniere.actif ? 'left-7' : 'left-1'
                }`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                Texte
              </label>
              <input
                type="text"
                value={banniere.texte}
                onChange={(e) => setBanniere({ ...banniere, texte: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                Emoji
              </label>
              <input
                type="text"
                value={banniere.emoji}
                onChange={(e) => setBanniere({ ...banniere, emoji: e.target.value })}
                className="input-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                Couleur
              </label>
              <div className="flex gap-2">
                {(['vert', 'matcha', 'or'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setBanniere({ ...banniere, couleur: c })}
                    className={`flex-1 py-2 rounded-xl text-[12px] font-medium border-2 transition-all ${
                      banniere.couleur === c ? 'border-vert scale-[1.02]' : 'border-transparent'
                    } ${
                      c === 'vert'   ? 'bg-vert text-white'   :
                      c === 'matcha' ? 'bg-matcha text-white' :
                      'bg-or text-vert'
                    }`}
                  >
                    {c === 'vert' ? 'Vert' : c === 'matcha' ? 'Matcha' : 'Or'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-creme/50 rounded-2xl border border-creme-dark">
            <p className="text-[12px] font-medium text-gris uppercase tracking-wider mb-3">Aperçu et enregistrement</p>
            <div className={`rounded-2xl px-4 py-3 flex items-center justify-center gap-3 text-[13px] font-medium mb-4 ${
              banniere.couleur === 'matcha' ? 'bg-matcha text-white' :
              banniere.couleur === 'or'     ? 'bg-or text-vert'      :
              'bg-vert text-white'
            }`}>
              <span>{banniere.emoji}</span>
              <span>{banniere.texte || 'Votre message ici...'}</span>
            </div>
            <button
              onClick={async () => {
                const res = await fetch('/api/admin/banners', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(banniere)
                })
                if (res.ok) {
                  alert('Bannière mise à jour !')
                  await fetchAll()
                }
              }}
              className="w-full py-2.5 rounded-xl bg-vert text-white text-[13px] font-semibold hover:bg-vert-mid transition-colors"
            >
              Enregistrer la bannière
            </button>
          </div>
        </div>
      </AnimateIn>

      {/* Bouton ajouter */}
      <AnimateIn delay={0.1}>
        <div className="flex justify-end mb-6">
          <button
            onClick={() => { setEditingPromo(null); setIsModalOpen(true); }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={15} />
            Nouvelle promotion
          </button>
        </div>
      </AnimateIn>

      {/* Liste promos */}
      <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
        {isLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-vert" /></div>
        ) : (
          promos.map((promo, i) => {
            const produit = produits.find((p) => p.id === promo.productId)
            if (!produit) return null
            return (
              <AnimateIn key={promo.id} delay={i * 0.1}>
                <div className="bg-white rounded-3xl border border-creme-dark p-4 md:p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div
                      className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden"
                      style={{ backgroundColor: '#f5f5f5' }}
                    >
                      <img
                        src={getProductImage(produit)}
                        alt={produit.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.webp' }}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-vert text-[14px] md:text-[15px]">{produit.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="bg-matcha text-white text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-full">
                          {promo.label}
                        </span>
                        <span className="text-[11px] md:text-[12px] text-gris hidden sm:block">
                          {promo.discountPercent}% de reduction
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4 shrink-0">
                    <button
                      onClick={() => { setEditingPromo(promo); setIsModalOpen(true); }}
                      className="hidden sm:flex items-center gap-1.5 text-[12px] text-matcha hover:text-vert transition-colors"
                    >
                      <Pencil size={13} /> Modifier
                    </button>
                    <button
                      onClick={() => deletePromo(promo.id)}
                      className="hidden sm:flex items-center gap-1.5 text-[12px] text-red-400 hover:text-red-600 transition-colors"
                    >
                      <X size={13} /> Supprimer
                    </button>
                    <button
                      onClick={() => togglePromo(promo.id, promo.isActive)}
                      className={`relative w-12 h-6 rounded-full transition-all ${
                        promo.isActive ? 'bg-matcha' : 'bg-creme-dark'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                        promo.isActive ? 'left-7' : 'left-1'
                      }`} />
                    </button>
                    <span className="text-[12px] text-gris w-14 hidden sm:block">
                      {promo.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </AnimateIn>
            )
          })
        )}
      </div>

      {/* Codes promos */}
      <AnimateIn delay={0.3}>
        <div className="bg-white rounded-3xl border border-creme-dark overflow-hidden">
          <div className="px-4 md:px-6 py-4 md:py-5 border-b border-creme-dark flex items-center justify-between">
            <h2 className="font-display text-lg md:text-xl text-vert">Codes promo</h2>
            <div className="flex gap-2">
               <button
                onClick={() => setIsCodeModalOpen(true)}
                className="btn-primary text-[12px] px-3 md:px-4 py-2 flex items-center gap-1.5"
              >
                <Plus size={13} /> Nouveau code
              </button>
            </div>
          </div>
          <div className="p-4 md:p-6 space-y-4">
            {isLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-vert" /></div>
            ) : (
              codes.map((code) => (
                <div key={code.id} className="bg-white rounded-2xl border border-creme-dark p-4 flex items-center justify-between gap-4 hover:border-matcha transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-creme flex items-center justify-center text-matcha border border-creme-dark shrink-0">
                      <Tag size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-display font-bold text-vert text-lg font-mono">{code.code}</p>
                        <span className="bg-matcha text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          -{code.discountPercent}%
                        </span>
                      </div>
                      <p className="text-[12px] text-gris mt-1">
                        {code.currentUsage} utilisations • {code.isActive ? 'Actif' : 'Expiré'}
                      </p>
                      {code.startDate || code.endDate ? (
                        <p className="text-[11px] text-gris italic mt-1">
                          Valable du {code.startDate ? new Date(code.startDate).toLocaleDateString() : '...'} au {code.endDate ? new Date(code.endDate).toLocaleDateString() : '...'}
                        </p>
                      ) : (
                        <p className="text-[11px] text-gris italic mt-1">Pas de date limite définie</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        await fetch(`/api/admin/promo-codes/${code.id}`, { method: 'DELETE' })
                        fetchAll()
                      }}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      title="Supprimer"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </AnimateIn>

      {/* Modal Promotion */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blanc/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-creme-dark overflow-hidden">
            <div className="px-6 py-4 border-b border-creme-dark flex items-center justify-between bg-creme/30">
              <h2 className="font-display text-xl text-vert">
                {editingPromo ? 'Modifier la promotion' : 'Nouvelle promotion'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gris hover:text-vert transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSavePromotion} className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-gris">Produit</label>
                  <select
                    name="productId"
                    defaultValue={editingPromo?.productId || ''}
                    required
                    className="input-field w-full"
                  >
                    <option value="">Sélectionnez un produit...</option>
                    {produits.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-gris">Réduction (%)</label>
                    <input name="discountPercent" type="number" defaultValue={editingPromo?.discountPercent || ''} required className="input-field w-full" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-gris">Label (ex: -20%)</label>
                    <input name="label" defaultValue={editingPromo?.label || ''} className="input-field w-full" />
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
                <button type="submit" className="btn-primary flex-1" disabled={saveLoading}>
                  {saveLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Code Promo */}
      {isCodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blanc/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-creme-dark overflow-hidden">
            <div className="px-6 py-4 border-b border-creme-dark flex items-center justify-between bg-creme/30">
              <h2 className="font-display text-xl text-vert">Nouveau code promo</h2>
              <button onClick={() => setIsCodeModalOpen(false)} className="text-gris hover:text-vert transition-colors">
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setCodeSaveLoading(true);
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData.entries());
                try {
                  const res = await fetch('/api/admin/promo-codes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                  });
                  if (res.ok) {
                    await fetchAll();
                    setIsCodeModalOpen(false);
                    alert('Code promo créé avec succès !');
                  } else {
                    const err = await res.json();
                    alert(err.message || 'Erreur lors de la création du code');
                  }
                } catch (error) {
                  alert('Erreur réseau');
                } finally {
                  setCodeSaveLoading(false);
                }
              }}
              className="p-6 space-y-4"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-gris">Code (ex: BIENVENUE10)</label>
                  <input name="code" required className="input-field w-full uppercase" placeholder="CODE10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-gris">Réduction (%)</label>
                    <input name="discountPercent" type="number" required className="input-field w-full" placeholder="10" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-gris">Limite d'utilisation</label>
                    <input name="usageLimit" type="number" className="input-field w-full" placeholder="100" />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCodeModalOpen(false)}
                  className="flex-1 py-2 text-[13px] font-medium text-gris hover:text-texte transition-colors"
                >
                  Annuler
                </button>
                <button type="submit" className="btn-primary flex-1" disabled={codeSaveLoading}>
                  {codeSaveLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
