'use client'

import { useState } from 'react'
import { produits, promotions } from '@/lib/data'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { useBanniere } from '@/components/layout/BanniereContext'
import { Plus, Tag, Pencil } from 'lucide-react'

export default function Promotions() {
  const [promos, setPromos] = useState(promotions)
  const { banniere, setBanniere } = useBanniere()

  const togglePromo = (id: string) => {
    setPromos(promos.map((p) =>
      p.id === id ? { ...p, actif: !p.actif } : p
    ))
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
            <div>
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
            <div>
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

          <div className="mt-4">
            <p className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2">Apercu</p>
            <div className={`rounded-2xl px-4 py-3 flex items-center justify-center gap-3 text-[13px] font-medium ${
              banniere.couleur === 'matcha' ? 'bg-matcha text-white' :
              banniere.couleur === 'or'     ? 'bg-or text-vert'      :
              'bg-vert text-white'
            }`}>
              <span>{banniere.emoji}</span>
              <span>{banniere.texte || 'Votre message ici...'}</span>
            </div>
          </div>
        </div>
      </AnimateIn>

      {/* Bouton ajouter */}
      <AnimateIn delay={0.1}>
        <div className="flex justify-end mb-6">
          <button className="btn-primary flex items-center gap-2">
            <Plus size={15} />
            Nouvelle promotion
          </button>
        </div>
      </AnimateIn>

      {/* Liste promos */}
      <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
        {promos.map((promo, i) => {
          const produit = produits.find((p) => p.id === promo.produitId)
          if (!produit) return null
          return (
            <AnimateIn key={promo.id} delay={i * 0.1}>
              <div className="bg-white rounded-3xl border border-creme-dark p-4 md:p-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div
                    className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-xl md:text-2xl shrink-0"
                    style={{ backgroundColor: produit.bgColor }}
                  >
                    {produit.emoji}
                  </div>
                  <div>
                    <p className="font-medium text-vert text-[14px] md:text-[15px]">{produit.nom}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-matcha text-white text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-full">
                        {promo.label}
                      </span>
                      <span className="text-[11px] md:text-[12px] text-gris hidden sm:block">
                        {promo.reduction}% de reduction
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 md:gap-4 shrink-0">
                  <button className="hidden sm:flex items-center gap-1.5 text-[12px] text-matcha hover:text-vert transition-colors">
                    <Pencil size={13} /> Modifier
                  </button>
                  <button
                    onClick={() => togglePromo(promo.id)}
                    className={`relative w-12 h-6 rounded-full transition-all ${
                      promo.actif ? 'bg-matcha' : 'bg-creme-dark'
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${
                      promo.actif ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                  <span className="text-[12px] text-gris w-14 hidden sm:block">
                    {promo.actif ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </AnimateIn>
          )
        })}
      </div>

      {/* Codes promos */}
      <AnimateIn delay={0.3}>
        <div className="bg-white rounded-3xl border border-creme-dark overflow-hidden">
          <div className="px-4 md:px-6 py-4 md:py-5 border-b border-creme-dark flex items-center justify-between">
            <h2 className="font-display text-lg md:text-xl text-vert">Codes promo</h2>
            <button className="btn-primary text-[12px] px-3 md:px-4 py-2 flex items-center gap-1.5">
              <Plus size={13} /> Nouveau code
            </button>
          </div>
          <div className="p-4 md:p-6">
            {[
              { code: 'BIENVENUE10', reduction: '10%', usage: 24, actif: true  },
              { code: 'ETE2026',     reduction: '15%', usage: 8,  actif: true  },
              { code: 'NOEL25',      reduction: '25%', usage: 52, actif: false },
            ].map((code) => (
              <div key={code.code} className="flex items-center justify-between py-3 md:py-4 border-b border-creme last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-creme flex items-center justify-center text-matcha border border-creme-dark shrink-0">
                    <Tag size={14} />
                  </div>
                  <div>
                    <p className="font-medium text-vert text-[13px] md:text-[14px] font-mono">{code.code}</p>
                    <p className="text-[11px] md:text-[12px] text-gris mt-0.5">{code.usage} utilisations</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  <span className="bg-matcha text-white text-[10px] md:text-[11px] font-bold px-2 py-0.5 rounded-full">
                    -{code.reduction}
                  </span>
                  <span className={`text-[10px] md:text-[11px] font-semibold px-2 md:px-3 py-1 rounded-full ${
                    code.actif ? 'bg-green-50 text-green-600' : 'bg-creme text-gris'
                  }`}>
                    {code.actif ? 'Actif' : 'Expire'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimateIn>
    </div>
  )
}