'use client'

import { useState } from 'react'
import { utilisateur } from '@/lib/data'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { MapPin, Plus, Pencil } from 'lucide-react'

export default function Adresses() {
  const [adresses] = useState(utilisateur.adresses)

  return (
    <div>
      <AnimateIn>
        <p className="section-eyebrow mb-2">Espace client</p>
        <h1 className="font-display text-3xl md:text-4xl text-vert mb-8 md:mb-10">Mes adresses</h1>
      </AnimateIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {adresses.map((a, i) => (
          <AnimateIn key={a.id} delay={i * 0.1}>
            <div className={`bg-white rounded-3xl p-5 md:p-6 border-2 transition-all h-full ${
              a.principale ? 'border-matcha' : 'border-creme-dark'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-creme flex items-center justify-center text-matcha shrink-0">
                    <MapPin size={15} />
                  </div>
                  <p className="font-medium text-vert text-[13px] md:text-[14px]">{a.label}</p>
                </div>
                {a.principale && (
                  <span className="text-[10px] font-semibold bg-matcha text-white px-2 py-1 rounded-full shrink-0">
                    Principale
                  </span>
                )}
              </div>
              <p className="text-[13px] md:text-[14px] text-texte leading-relaxed">{a.rue}</p>
              <p className="text-[12px] md:text-[13px] text-gris mt-1">{a.ville}</p>
              <button className="mt-4 flex items-center gap-1.5 text-[12px] text-matcha hover:underline">
                <Pencil size={12} /> Modifier
              </button>
            </div>
          </AnimateIn>
        ))}

        {/* Ajouter */}
        <AnimateIn delay={0.2}>
          <button className="bg-creme rounded-3xl p-5 md:p-6 border-2 border-dashed border-creme-dark hover:border-matcha transition-all w-full flex flex-col items-center justify-center gap-3 min-h-[160px]">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-matcha border border-creme-dark">
              <Plus size={18} />
            </div>
            <p className="text-[13px] font-medium text-gris">Ajouter une adresse</p>
          </button>
        </AnimateIn>
      </div>
    </div>
  )
}