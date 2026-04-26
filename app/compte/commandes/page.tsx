'use client'

import { useState, useEffect } from 'react'
import { AnimateIn } from '@/components/layout/AnimateIn'

export default function Commandes() {
  const [commandes, setCommandes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/user/orders')
        if (res.ok) {
          const data = await res.json()
          setCommandes(data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [])

  if (isLoading) return <div className="flex items-center justify-center min-h-[40vh] text-gris">Chargement...</div>

  return (
    <div className="min-h-screen">
      <AnimateIn>
        <p className="section-eyebrow mb-2">Espace client</p>
        <h1 className="font-display text-3xl md:text-4xl text-vert mb-8 md:mb-10">Mes commandes</h1>
      </AnimateIn>

      <div className="space-y-4">
        {commandes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gris">Vous n'avez pas encore passé de commande.</p>
          </div>
        ) : (
          commandes.map((cmd, i) => (
            <AnimateIn key={cmd.id} delay={i * 0.1}>
              <div className="bg-white rounded-3xl border border-creme-dark overflow-hidden">

                {/* Header */}
                <div className="px-4 md:px-6 py-4 bg-creme flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-vert text-[13px] md:text-[14px]">{cmd.id}</p>
                    <p className="text-[11px] md:text-[12px] text-gris mt-0.5">
                      {new Date(cmd.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4 flex-wrap">
                    <span className={`text-[11px] font-semibold px-2 md:px-3 py-1 rounded-full ${
                      cmd.paymentStatus === 'payee'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-orange-50 text-orange-500'
                    }`}>
                      {cmd.paymentStatus === 'payee' ? 'Payée' : 'En attente'}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 md:px-3 py-1 rounded-full ${
                      cmd.status === 'terminee'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-blue-50 text-blue-500'
                    }`}>
                      {cmd.status === 'terminee' ? 'Terminée' : 'En cours'}
                    </span>
                    <span className="font-display text-lg md:text-xl text-vert ml-auto sm:ml-0">
                      {cmd.total.toFixed(2)}€
                    </span>
                  </div>
                </div>

                {/* Produits */}
                <div className="px-4 md:px-6 py-3 divide-y divide-creme">
                  {cmd.items.map((item: any, idx: number) => (
                    <div key={idx} className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-creme flex items-center justify-center text-[12px] md:text-sm shrink-0">
                          x{item.quantity}
                        </span>
                        <p className="text-[13px] md:text-[14px] text-texte">{item.product.name}</p>
                      </div>
                      <p className="text-[13px] md:text-[14px] font-medium text-vert">
                        {(item.priceAtPurchase * item.quantity).toFixed(2)}€
                      </p>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="px-4 md:px-6 py-4 border-t border-creme-dark flex gap-3">
                  <button className="btn-primary text-[12px] md:text-[13px] px-4 md:px-5 py-2">
                    Re-commander
                  </button>
                  <button className="btn-outline-dark text-[12px] md:text-[13px] px-4 md:px-5 py-2">
                    Voir le détail
                  </button>
                </div>

              </div>
            </AnimateIn>
          ))
        )}
      </div>
    </div>
  )
}
