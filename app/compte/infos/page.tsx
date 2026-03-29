'use client'

import { useState } from 'react'
import { utilisateur } from '@/lib/data'
import { AnimateIn } from '@/components/layout/AnimateIn'

export default function Infos() {
  const [form, setForm] = useState({
    prenom:    utilisateur.prenom,
    nom:       utilisateur.nom,
    email:     utilisateur.email,
    telephone: utilisateur.telephone,
  })
  const [sauvegarde, setSauvegarde] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    setSauvegarde(true)
    setTimeout(() => setSauvegarde(false), 2000)
  }

  return (
    <div>
      <AnimateIn>
        <p className="section-eyebrow mb-2">Espace client</p>
        <h1 className="font-display text-3xl md:text-4xl text-vert mb-8 md:mb-10">Mes informations</h1>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <div className="bg-white rounded-3xl border border-creme-dark p-6 md:p-8 max-w-xl">
          <div className="space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                  Prénom
                </label>
                <input
                  name="prenom"
                  value={form.prenom}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                  Nom
                </label>
                <input
                  name="nom"
                  value={form.nom}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                Téléphone
              </label>
              <input
                name="telephone"
                type="tel"
                value={form.telephone}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={handleSave}
                className={`w-full sm:w-auto transition-all rounded-full px-7 py-3 text-sm font-semibold ${
                  sauvegarde
                    ? 'bg-matcha-light text-white'
                    : 'btn-primary'
                }`}
              >
                {sauvegarde ? '✓ Sauvegardé !' : 'Sauvegarder les modifications'}
              </button>
            </div>

          </div>
        </div>
      </AnimateIn>
    </div>
  )
}