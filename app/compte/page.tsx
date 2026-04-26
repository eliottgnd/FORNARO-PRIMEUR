'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { ShoppingBag, MapPin, Heart, ArrowRight, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Compte() {
  const { data: session } = useSession()

  if (session?.user?.role === 'ADMIN') {
    redirect('/admin')
  }

  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUserData() {
      setIsLoading(true)
      try {
        const res = await fetch('/api/user/orders')
        if (res.ok) {
          const data = await res.json()
          setOrders(data)
        }
      } catch (e) {
        console.error("Failed to fetch orders:", e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserData()
  }, [])

  const derniereCommande = orders[0]

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-gris mb-4">Vous devez être connecté pour accéder à cet espace.</p>
        <Link href="/" className="btn-primary px-6 py-2">
          Retour à l'accueil
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-gris">Chargement...</div>
  }

  return (
    <div>
      <AnimateIn>
        <div className="mb-8 md:mb-10 flex items-center justify-between">
          <div>
            <p className="section-eyebrow mb-2">Espace client</p>
            <h1 className="font-display text-3xl md:text-4xl text-vert">
              Bienvenue, {session.user?.name || 'Utilisateur'} 👋
            </h1>
          </div>
          <button
            onClick={async () => {
              await signOut({ callbackUrl: '/' })
            }}
            className="flex items-center gap-2 text-[13px] font-medium text-gris hover:text-red-500 transition-colors"
          >
            <LogOut size={16} />
            Se déconnecter
          </button>
        </div>
      </AnimateIn>

      {/* Dernière commande */}
      <AnimateIn delay={0.1}>
        {derniereCommande ? (
          <div className="bg-vert rounded-3xl p-5 md:p-7 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-matcha-light mb-1">
                Dernière commande
              </p>
              <p className="font-display text-2xl md:text-3xl text-creme">
                {derniereCommande.total.toFixed(2)}€
              </p>
              <p className="text-creme/50 text-[12px] md:text-[13px] mt-1">
                {derniereCommande.id} · {new Date(derniereCommande.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Link href="/compte/commandes" className="flex-1 sm:flex-none">
                <button className="w-full btn-outline-light text-[13px] px-4 md:px-5 py-2">
                  Voir commande
                </button>
              </Link>
              <button className="flex-1 sm:flex-none btn-primary text-[13px] px-4 md:px-5 py-2">
                Re-commander
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-creme/50 rounded-3xl p-5 md:p-7 mb-6 text-center border border-dashed border-creme-dark">
            <p className="text-gris text-sm">Aucune commande passée pour le moment.</p>
            <Link href="/produits" className="text-vert font-medium text-sm hover:underline mt-2 inline-block">
              Découvrir nos produits →
            </Link>
          </div>
        )}
      </AnimateIn>

      {/* Raccourcis */}
      <AnimateIn delay={0.15}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          {[
            { icon: ShoppingBag, label: 'Mes commandes', desc: `${orders.length} commande${orders.length > 1 ? 's' : ''}`,                    href: '/compte/commandes' },
            { icon: MapPin,      label: 'Mes adresses',  desc: 'Gérer vos adresses',                                 href: '/compte/adresses'  },
            { icon: Heart,       label: 'Mes favoris',   desc: 'Voir mes favoris',                                 href: '/compte/favoris'   },
          ].map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="bg-white rounded-3xl p-5 md:p-6 border border-creme-dark hover:border-matcha transition-all group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-creme flex items-center justify-center text-matcha mb-3 md:mb-4 group-hover:bg-matcha group-hover:text-white transition-all">
                  <item.icon size={18} />
                </div>
                <p className="font-medium text-vert text-[13px] md:text-[14px]">{item.label}</p>
                <p className="text-[11px] md:text-[12px] text-gris mt-1">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </AnimateIn>

      {/* Historique */}
      <AnimateIn delay={0.2}>
        <div className="bg-white rounded-3xl border border-creme-dark overflow-hidden">
          <div className="px-4 md:px-6 py-4 md:py-5 border-b border-creme-dark flex items-center justify-between">
            <h2 className="font-display text-lg md:text-xl text-vert">Historique des commandes</h2>
            <Link href="/compte/commandes" className="flex items-center gap-1 text-[13px] text-matcha hover:underline">
              Voir tout <ArrowRight size={13} />
            </Link>
          </div>
          <div className="divide-y divide-creme-dark">
            {orders.map((cmd) => (
              <div key={cmd.id} className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] md:text-[13px] font-medium text-texte">{cmd.id}</p>
                  <p className="text-[11px] md:text-[12px] text-gris mt-0.5">{new Date(cmd.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="flex items-center gap-3 md:gap-6">
                  <span className={`text-[11px] font-semibold px-2 md:px-3 py-1 rounded-full ${
                    cmd.status === 'terminee'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-orange-50 text-orange-500'
                  }`}>
                    {cmd.status === 'terminee' ? 'Terminée' : 'En cours'}
                  </span>
                  <span className="font-display text-[14px] md:text-[15px] text-vert">
                    {cmd.total.toFixed(2)}€
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
