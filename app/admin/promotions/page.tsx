'use client'

import { useState, useEffect } from 'react'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { useBanniere } from '@/components/layout/BanniereContext'
import { Plus, Tag, Pencil, Loader2, X } from 'lucide-react'
import { getProductImage } from '@/lib/product-image-utils'

interface Promotion {
  id: string
  productId: string
  type: 'percent' | 'fixed' | 'bundle'
  discountPercent?: number | null
  discountAmount?: number | null
  bundleQuantity?: number | null
  bundlePrice?: number | null
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
  const [promoType, setPromoType] = useState<'percent' | 'fixed' | 'bundle'>('percent')
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [codeSaveLoading, setCodeSaveLoading] = useState<boolean>(false)
  const [conseil, setConseil] = useState({ emoji: '🍓', titre: 'Le conseil du primeur', texte: '' })
  const [conseilSaving, setConseilSaving] = useState(false)

  const { banniere, setBanniere } = useBanniere()

  const fetchAll = async () => {
    setIsLoading(true)
    try {
      const [pRes, cRes, prRes, bRes, cslRes] = await Promise.all([
        fetch('/api/admin/promotions'),
        fetch('/api/admin/promo-codes'),
        fetch('/api/admin/products'),
        fetch('/api/admin/banners'),
        fetch('/api/admin/conseil'),
      ])
      if (pRes.ok) setPromos(await pRes.json())
      if (cRes.ok) setCodes(await cRes.json())
      if (prRes.ok) setProduits(await prRes.json())
      if (bRes.ok) {
        const bannerData = await bRes.json()
        setBanniere(bannerData)
      }
      if (cslRes.ok) setConseil(await cslRes.json())
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

  useEffect(() => {
    if (isModalOpen || isCodeModalOpen) {
      if (window.__lenisInstance?.stop) {
        window.__lenisInstance.stop()
      }

      return () => {
        if (window.__lenisInstance?.start) {
          window.__lenisInstance.start()
        }
      }
    }
  }, [isModalOpen, isCodeModalOpen])

  return (
    <div>
      <AnimateIn>
        <p className="section-eyebrow mb-2">Admin</p>
        <h1 className="font-display text-2xl md:text-3xl text-vert mb-6">Promotions</h1>
      </AnimateIn>

      {/* Banniere */}
      <AnimateIn delay={0.05}>
        <div className="bg-white rounded-2xl border border-creme-dark p-4 md:p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base md:text-lg text-vert">Banniere promotionnelle</h2>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-gris hidden sm:block">
                {banniere.actif ? 'Active' : 'Inactive'}
              </span>
              <button
                onClick={() => setBanniere({ ...banniere, actif: !banniere.actif })}
                className={`relative w-11 h-5.5 rounded-full transition-all ${
                  banniere.actif ? 'bg-matcha' : 'bg-creme-dark'
                }`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                  banniere.actif ? 'left-6' : 'left-0.5'
                }`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-gris uppercase tracking-wider mb-1.5 block">
                Texte
              </label>
              <input
                type="text"
                value={banniere.texte}
                onChange={(e) => setBanniere({ ...banniere, texte: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-gris uppercase tracking-wider mb-1.5 block">
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
              <label className="text-[11px] font-medium text-gris uppercase tracking-wider mb-1.5 block">
                Couleur
              </label>
              <div className="flex gap-2">
                {(['vert', 'matcha', 'or'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setBanniere({ ...banniere, couleur: c })}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium border-2 transition-all ${
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

          <div className="mt-4 p-3 bg-creme/50 rounded-xl border border-creme-dark">
            <p className="text-[11px] font-medium text-gris uppercase tracking-wider mb-2">Aperçu</p>
            <div className={`rounded-xl px-3 py-2 flex items-center justify-center gap-2 text-[12px] font-medium mb-3 ${
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
              className="w-full py-2 rounded-lg bg-vert text-white text-[12px] font-semibold hover:bg-vert-mid transition-colors"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </AnimateIn>

      {/* Bouton ajouter */}
      <AnimateIn delay={0.1}>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => { setEditingPromo(null); setPromoType('percent'); setIsModalOpen(true); }}
            className="btn-primary text-[12px] px-4 py-2 flex items-center gap-2"
          >
            <Plus size={14} />
            Promotion
          </button>
        </div>
      </AnimateIn>

      {/* Liste promos */}
      <div className="space-y-2 mb-6">
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin text-vert" /></div>
        ) : (
          promos.map((promo, i) => {
            const produit = produits.find((p) => p.id === promo.productId)
            if (!produit) return null
            return (
              <AnimateIn key={promo.id} delay={i * 0.05}>
                <div className="bg-white rounded-xl border border-creme-dark p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
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
                      <p className="font-medium text-vert text-[13px]">{produit.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="bg-matcha text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          {promo.label}
                        </span>
                        <span className="text-[10px] text-gris">
                          {promo.type === 'percent' && `${promo.discountPercent}% de réduction`}
                          {promo.type === 'fixed' && `-${promo.discountAmount}€`}
                          {promo.type === 'bundle' && `${promo.bundleQuantity} pour ${promo.bundlePrice}€`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setEditingPromo(promo)
                        setPromoType(promo.type || 'percent')
                        setIsModalOpen(true)
                      }}
                      className="p-1.5 text-gris hover:text-vert transition-colors"
                      title="Modifier"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => deletePromo(promo.id)}
                      className="p-1.5 text-gris hover:text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <X size={13} />
                    </button>
                    <button
                      onClick={() => togglePromo(promo.id, promo.isActive)}
                      className={`relative w-10 h-5 rounded-full transition-all ${
                        promo.isActive ? 'bg-matcha' : 'bg-creme-dark'
                      }`}
                    >
                      <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-all ${
                        promo.isActive ? 'left-5.5' : 'left-0.5'
                      }`} />
                    </button>
                  </div>
                </div>
              </AnimateIn>
            )
          })
        )}
      </div>

      {/* Conseil du primeur */}
      <AnimateIn delay={0.18}>
        <div className="bg-white rounded-2xl border border-creme-dark p-4 md:p-5 mb-6">
          <h2 className="font-display text-base md:text-lg text-vert mb-4">Conseil du primeur</h2>

          {/* Aperçu */}
          <div className="flex items-start gap-3 bg-creme/40 rounded-xl p-3 mb-4 border border-creme-dark max-w-xs">
            <span className="text-2xl">{conseil.emoji}</span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-matcha">{conseil.titre}</p>
              <p className="text-[12px] text-texte leading-snug mt-1">{conseil.texte || '…'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-gris uppercase tracking-wider mb-1.5 block">Emoji</label>
              <input
                type="text"
                value={conseil.emoji}
                onChange={(e) => setConseil({ ...conseil, emoji: e.target.value })}
                className="input-field"
                placeholder="🍓"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-gris uppercase tracking-wider mb-1.5 block">Titre</label>
              <input
                type="text"
                value={conseil.titre}
                onChange={(e) => setConseil({ ...conseil, titre: e.target.value })}
                className="input-field"
                placeholder="Le conseil du primeur"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] font-medium text-gris uppercase tracking-wider mb-1.5 block">Message</label>
              <textarea
                value={conseil.texte}
                onChange={(e) => setConseil({ ...conseil, texte: e.target.value })}
                className="input-field resize-none"
                rows={2}
                placeholder="Les fraises sont particulièrement sucrées cette semaine."
              />
            </div>
          </div>

          <button
            onClick={async () => {
              setConseilSaving(true)
              try {
                const res = await fetch('/api/admin/conseil', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(conseil),
                })
                if (!res.ok) throw new Error()
              } finally {
                setConseilSaving(false)
              }
            }}
            disabled={conseilSaving}
            className="mt-4 w-full py-2 rounded-lg bg-vert text-white text-[12px] font-semibold hover:bg-vert-mid transition-colors disabled:opacity-50"
          >
            {conseilSaving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </AnimateIn>

      {/* Codes promos */}
      <AnimateIn delay={0.2}>
        <div className="bg-white rounded-2xl border border-creme-dark overflow-hidden">
          <div className="px-4 py-3 border-b border-creme-dark flex items-center justify-between">
            <h2 className="font-display text-base text-vert">Codes promo</h2>
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="btn-primary text-[11px] px-3 py-1.5 flex items-center gap-1.5"
            >
              <Plus size={12} /> Code
            </button>
          </div>
          <div className="p-3 space-y-2 max-h-[240px] overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-6"><Loader2 className="animate-spin text-vert" /></div>
            ) : (
              codes.map((code) => (
                <div key={code.id} className="bg-creme/30 rounded-xl border border-creme-dark p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-creme flex items-center justify-center text-matcha border border-creme-dark shrink-0">
                      <Tag size={14} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-display font-bold text-vert text-sm font-mono">{code.code}</p>
                        <span className="bg-matcha text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                          -{code.discountPercent}%
                        </span>
                      </div>
                      <p className="text-[10px] text-gris">
                        {code.currentUsage} utilisations
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      await fetch(`/api/admin/promo-codes/${code.id}`, { method: 'DELETE' })
                      fetchAll()
                    }}
                    className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </AnimateIn>

      {/* Modal Promotion */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blanc/50 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-creme-dark">
            <div className="px-6 py-4 border-b border-creme-dark flex items-center justify-between bg-creme/30">
              <h2 className="font-display text-xl text-vert">
                {editingPromo ? 'Modifier la promotion' : 'Nouvelle promotion'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gris hover:text-vert transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSavePromotion} className="p-6 space-y-4">
              {/* Produit */}
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

              {/* Type de promo */}
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-gris">Type de promotion</label>
                <input type="hidden" name="type" value={promoType} />
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: 'percent', label: '% Réduction' },
                    { value: 'fixed',   label: '€ Réduction' },
                    { value: 'bundle',  label: 'Lot' },
                  ] as const).map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPromoType(value)}
                      className={`py-2 rounded-xl text-[12px] font-medium border-2 transition-all ${
                        promoType === value
                          ? 'border-matcha bg-matcha/10 text-matcha'
                          : 'border-creme-dark text-gris hover:border-matcha/40'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Champs selon le type */}
              {promoType === 'percent' && (
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-gris">Réduction (%)</label>
                  <input
                    name="discountPercent"
                    type="number"
                    min="1"
                    max="100"
                    defaultValue={editingPromo?.discountPercent ?? ''}
                    required
                    className="input-field w-full"
                    placeholder="ex: 20"
                  />
                </div>
              )}

              {promoType === 'fixed' && (
                <div className="space-y-1">
                  <label className="text-[12px] font-medium text-gris">Réduction (€)</label>
                  <input
                    name="discountAmount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    defaultValue={editingPromo?.discountAmount ?? ''}
                    required
                    className="input-field w-full"
                    placeholder="ex: 2.00"
                  />
                </div>
              )}

              {promoType === 'bundle' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-gris">Quantité du lot</label>
                    <input
                      name="bundleQuantity"
                      type="number"
                      min="2"
                      defaultValue={editingPromo?.bundleQuantity ?? ''}
                      required
                      className="input-field w-full"
                      placeholder="ex: 3"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-medium text-gris">Prix du lot (€)</label>
                    <input
                      name="bundlePrice"
                      type="number"
                      min="0.01"
                      step="0.01"
                      defaultValue={editingPromo?.bundlePrice ?? ''}
                      required
                      className="input-field w-full"
                      placeholder="ex: 5.00"
                    />
                  </div>
                </div>
              )}

              {/* Label personnalisé */}
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-gris">
                  Label <span className="text-gris/60 font-normal">(optionnel, généré automatiquement)</span>
                </label>
                <input
                  name="label"
                  defaultValue={editingPromo?.label || ''}
                  className="input-field w-full"
                  placeholder={
                    promoType === 'percent' ? 'ex: -20%' :
                    promoType === 'fixed'   ? 'ex: -2€'  :
                    'ex: 3 pour 5€'
                  }
                />
              </div>

              <div className="flex gap-3 pt-2">
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
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-creme-dark">
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
