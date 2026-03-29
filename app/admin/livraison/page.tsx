'use client'

import { useState } from 'react'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { Truck, Clock, MapPin, Save } from 'lucide-react'

export default function Livraison() {
  const [settings, setSettings] = useState({
    heureLimit:      '20:00',
    heureLivraison:  '07:00',
    fraisLivraison:  '3.90',
    minimumCommande: '15.00',
    zonesActives:    ['Biarritz', 'Hendaye'],
  })

  const zones = ['Biarritz', 'Hendaye', 'Bayonne', 'Anglet', 'Saint-Jean-de-Luz']

  const toggleZone = (zone: string) => {
    setSettings((s) => ({
      ...s,
      zonesActives: s.zonesActives.includes(zone)
        ? s.zonesActives.filter((z) => z !== zone)
        : [...s.zonesActives, zone],
    }))
  }

  return (
    <div>
      <AnimateIn>
        <p className="section-eyebrow mb-2">Admin</p>
        <h1 className="font-display text-3xl md:text-4xl text-vert mb-8 md:mb-10">
          Paramètres de livraison
        </h1>
      </AnimateIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

        {/* Horaires */}
        <AnimateIn delay={0.1}>
          <div className="bg-white rounded-3xl border border-creme-dark p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="w-10 h-10 rounded-xl bg-creme flex items-center justify-center text-matcha">
                <Clock size={18} />
              </div>
              <h2 className="font-display text-lg md:text-xl text-vert">Horaires</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                  Heure limite de commande
                </label>
                <input
                  type="time"
                  value={settings.heureLimit}
                  onChange={(e) => setSettings({ ...settings, heureLimit: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                  Heure de livraison
                </label>
                <input
                  type="time"
                  value={settings.heureLivraison}
                  onChange={(e) => setSettings({ ...settings, heureLivraison: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </AnimateIn>

        {/* Tarifs */}
        <AnimateIn delay={0.15}>
          <div className="bg-white rounded-3xl border border-creme-dark p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="w-10 h-10 rounded-xl bg-creme flex items-center justify-center text-matcha">
                <Truck size={18} />
              </div>
              <h2 className="font-display text-lg md:text-xl text-vert">Tarifs</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                  Frais de livraison (€)
                </label>
                <input
                  type="number"
                  step="0.10"
                  value={settings.fraisLivraison}
                  onChange={(e) => setSettings({ ...settings, fraisLivraison: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                  Minimum de commande (€)
                </label>
                <input
                  type="number"
                  step="0.50"
                  value={settings.minimumCommande}
                  onChange={(e) => setSettings({ ...settings, minimumCommande: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </AnimateIn>

        {/* Zones */}
        <AnimateIn delay={0.2} className="md:col-span-2">
          <div className="bg-white rounded-3xl border border-creme-dark p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="w-10 h-10 rounded-xl bg-creme flex items-center justify-center text-matcha">
                <MapPin size={18} />
              </div>
              <h2 className="font-display text-lg md:text-xl text-vert">Zones de livraison</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {zones.map((zone) => (
                <button
                  key={zone}
                  onClick={() => toggleZone(zone)}
                  className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[12px] md:text-[13px] font-medium border transition-all ${
                    settings.zonesActives.includes(zone)
                      ? 'bg-matcha text-white border-matcha'
                      : 'bg-white text-gris border-creme-dark hover:border-matcha'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>
        </AnimateIn>

      </div>

      {/* Sauvegarder */}
      <AnimateIn delay={0.25}>
        <div className="flex justify-end mt-6">
          <button className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
            <Save size={16} />
            Sauvegarder les paramètres
          </button>
        </div>
      </AnimateIn>
    </div>
  )
}