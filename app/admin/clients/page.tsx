'use client'

import { useState, useEffect } from 'react'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { Search, Loader2 } from 'lucide-react'

interface Client {
  id: string
  name: string | null
  email: string
  totalOrders: number
  totalSpent: number
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [recherche, setRecherche] = useState<string>('')

  const fetchClients = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/clients')
      if (res.ok) {
        const data = await res.json()
        setClients(data)
      }
    } catch (e) {
      console.error("Failed to fetch clients:", e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const clientsFiltres = clients.filter((c) =>
    `${c.name} ${c.email}`.toLowerCase().includes(recherche.toLowerCase())
  )

  const totalClients = clients.length
  const totalOrdersAll = clients.reduce((a, c) => a + c.totalOrders, 0)
  const totalRevenueAll = clients.reduce((a, c) => a + c.totalSpent, 0)
  const avgOrders = totalClients > 0 ? Math.round(totalOrdersAll / totalClients) : 0
  const avgBasket = totalClients > 0 ? (totalRevenueAll / totalClients).toFixed(2) : '0.00'

  return (
    <div>
      <AnimateIn>
        <p className="section-eyebrow mb-2">Admin</p>
        <h1 className="font-display text-3xl md:text-4xl text-vert mb-8 md:mb-10">Clients</h1>
      </AnimateIn>

      {/* Stats */}
      <AnimateIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          {[
            { label: 'Total clients',      valeur: totalClients },
            { label: 'Commandes moyennes', valeur: avgOrders },
            { label: 'Panier moyen',       valeur: `${avgBasket}€` },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-3xl p-5 md:p-6 border border-creme-dark">
              <p className="text-[12px] text-gris uppercase tracking-wider mb-1">{s.label}</p>
              <p className="font-display text-2xl md:text-3xl text-vert">{s.valeur}</p>
            </div>
          ))}
        </div>
      </AnimateIn>

      {/* Recherche */}
      <AnimateIn delay={0.15}>
        <div className="relative w-full sm:max-w-xs mb-6">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" />
          <input
            type="text"
            placeholder="Chercher un client..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </AnimateIn>

      {/* Table */}
      <AnimateIn delay={0.2}>
        <div className="bg-white rounded-3xl border border-creme-dark overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-vert" size={24} />
              <p className="text-gris text-sm">Chargement des clients...</p>
            </div>
          ) : (
            <>
              {/* Header desktop */}
              <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr] px-6 py-3 bg-creme border-b border-creme-dark">
                {['Client', 'Email', 'Commandes', 'Total'].map((h) => (
                  <p key={h} className="text-[11px] font-semibold uppercase tracking-wider text-gris">{h}</p>
                ))}
              </div>

              <div className="divide-y divide-creme">
                {clientsFiltres.length === 0 ? (
                  <div className="py-20 text-center text-gris text-sm">
                    {recherche ? 'Aucun client trouvé.' : 'Aucun client enregistré.'}
                  </div>
                ) : (
                  clientsFiltres.map((c) => (
                    <div key={c.id}>
                      {/* Desktop */}
                      <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr] px-6 py-4 items-center hover:bg-creme/40 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-creme flex items-center justify-center text-matcha font-semibold text-[13px]">
                            {c.name ? c.name[0] : '?'}
                          </div>
                          <p className="text-[14px] font-medium text-texte">{c.name || 'Utilisateur'}</p>
                        </div>
                        <p className="text-[13px] text-gris">{c.email}</p>
                        <p className="font-display text-[15px] text-vert">{c.totalOrders}</p>
                        <p className="font-display text-[15px] text-vert">{c.totalSpent.toFixed(2)}€</p>
                      </div>

                      {/* Mobile */}
                      <div className="md:hidden px-4 py-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-creme flex items-center justify-center text-matcha font-semibold text-[13px] shrink-0">
                            {c.name ? c.name[0] : '?'}
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-texte">{c.name || 'Utilisateur'}</p>
                            <p className="text-[11px] text-gris mt-0.5">{c.email}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-display text-[15px] text-vert">{c.totalSpent.toFixed(2)}€</p>
                          <p className="text-[11px] text-gris mt-0.5">{c.totalOrders} cmd</p>
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
    </div>
  )
}
