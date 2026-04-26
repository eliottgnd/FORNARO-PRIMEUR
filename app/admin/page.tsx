'use client'

import { useState, useEffect } from 'react'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { ShoppingBag, Users, Package, TrendingUp, Download, Loader2, RefreshCw } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useBanniere } from '@/components/layout/BanniereContext'

const COLORS = ['#7a9e7e', '#1e3a28', '#a8c5a0', '#ede6d6']

interface KPI {
  icon: any
  label: string
  valeur: string | number
  suffix: string
  color: string
}

interface OrderSummary {
  id: string
  createdAt: string
  user: { name: string | null }
  status: string
  paymentStatus: string
  total: number
}

interface ClientSummary {
  id: string
  name: string | null
  email: string
  _count: { orders: number }
  totalSpent: number
}

function BanniereAdmin() {
  const { banniere, setBanniere } = useBanniere()

  return (
    <div className="bg-white rounded-3xl border border-creme-dark p-5 md:p-6 mb-8">
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
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats')
        if (res.ok) {
          setStats(await res.json())
        }
      } catch (e) {
        console.error("Failed to fetch stats:", e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 30_000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        setStats(await res.json())
      }
    } catch (e) {
      console.error("Failed to fetch stats:", e)
    } finally {
      setIsRefreshing(false)
    }
  }

  const extraireListeJour = () => {
    if (!stats) return

    const now = new Date()
    const mois = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    const { kpis, recentOrders, topClients, categoryDistribution = [], statusDistribution = [] } = stats

    const lines: string[] = []

    lines.push('RAPPORT MENSUEL - FORNARO PRIMEUR')
    lines.push('Periode: ' + mois)
    lines.push('Date export: ' + now.toLocaleDateString('fr-FR') + '\n')

    lines.push('INDICATEURS CLES')
    lines.push('Total Commandes,' + String(kpis?.orders || 0))
    lines.push('Revenu Total,' + (kpis?.revenue?.toFixed(2) || '0.00') + ' EUR')
    lines.push('Nombre Clients,' + String(kpis?.clients || 0))
    lines.push('Nombre Produits,' + String(kpis?.products || 0) + '\n')

    lines.push('STATUT DES COMMANDES')
    lines.push('Statut,Nombre')
    ;(statusDistribution || []).forEach((s: any) => {
      const statut = s.status.charAt(0).toUpperCase() + s.status.slice(1)
      lines.push(statut + ',' + s._count.id)
    })
    lines.push('')

    lines.push('PRODUITS PAR CATEGORIE')
    lines.push('Categorie,Nb Produits')
    ;(categoryDistribution || []).forEach((c: any) => {
      const cat = c.category.charAt(0).toUpperCase() + c.category.slice(1)
      lines.push(cat + ',' + c._count.id)
    })
    lines.push('')

    lines.push('COMMANDES RECENTES')
    lines.push('N Commande,Date,Client,Total (EUR),Statut,Paiement')
    ;(recentOrders || []).forEach((cmd: OrderSummary) => {
      const date = new Date(cmd.createdAt).toLocaleDateString('fr-FR')
      const client = cmd.user?.name || 'Inconnu'
      const statut = cmd.status === 'annulee' ? 'Annulee' : cmd.status === 'terminee' ? 'Terminee' : 'En cours'
      const paiement = cmd.paymentStatus === 'payee' ? 'Payee' : 'En attente'
      lines.push(cmd.id + ',' + date + ',' + client + ',' + cmd.total.toFixed(2) + ',' + statut + ',' + paiement)
    })
    lines.push('')

    lines.push('MEILLEURS CLIENTS')
    lines.push('Nom,Email,Commandes,Total (EUR)')
    ;(topClients || []).forEach((c: ClientSummary) => {
      lines.push((c.name || 'Utilisateur') + ',' + c.email + ',' + c._count.orders + ',' + (c.totalSpent?.toFixed(2) || '0.00'))
    })

    const csvContent = lines.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    const dateStr = now.toLocaleDateString('fr-FR').replace(/\//g, '-')
    link.download = 'Fornaro_Rapport_' + dateStr + '.csv'
    link.click()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-vert" size={32} />
      </div>
    )
  }

  const { kpis, recentOrders, topClients, categoryDistribution = [], statusDistribution = [] } = stats || {}

  const dataStatuts = (statusDistribution || []).map((s: any) => ({
    name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
    value: s._count.id
  }))

  const dataCategories = (categoryDistribution || []).map((c: any) => ({
    name: c.category,
    value: c._count.id
  }))

  return (
    <div>
      <AnimateIn>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <p className="section-eyebrow mb-2">Dashboard</p>
            <h1 className="font-display text-3xl md:text-4xl text-vert">Vue d'ensemble</h1>
            <p className="text-gris text-[13px] md:text-[14px] mt-1">
              Données en temps réel de votre activité.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-creme-dark bg-white text-[13px] font-medium text-vert hover:bg-creme transition-all disabled:opacity-50"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              Actualiser
            </button>
            <button
              onClick={extraireListeJour}
              className="flex items-center gap-3 bg-vert text-white rounded-2xl px-5 md:px-6 py-3 md:py-4 font-semibold text-[13px] md:text-[14px] hover:bg-vert-mid transition-all hover:-translate-y-0.5 w-full sm:w-auto justify-center sm:justify-start"
            >
              <Download size={18} />
              <div className="text-left">
                <p>Exporter les données</p>
                <p className="text-[11px] text-matcha-light font-normal">
                  Rapport mensuel CSV
                </p>
              </div>
            </button>
          </div>
        </div>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {[
            { icon: ShoppingBag, label: 'Commandes',    valeur: kpis?.orders || 0,       suffix: '',    color: 'text-matcha' },
            { icon: TrendingUp,  label: 'Revenu',       valeur: kpis?.revenue?.toFixed(0) || '0', suffix: '€',   color: 'text-vert'   },
            { icon: Users,       label: 'Clients',      valeur: kpis?.clients || 0,          suffix: '',    color: 'text-matcha' },
            { icon: Package,     label: 'Produits',     valeur: kpis?.products || 0,         suffix: '',    color: 'text-vert'   },
          ].map((kpi: KPI) => (
            <div key={kpi.label} className="bg-white rounded-3xl p-4 md:p-6 border border-creme-dark">
              <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl bg-creme flex items-center justify-center ${kpi.color} mb-3 md:mb-4`}>
                <kpi.icon size={17} />
              </div>
              <p className="text-[11px] md:text-[12px] text-gris uppercase tracking-wider">{kpi.label}</p>
              <p className="font-display text-2xl md:text-3xl text-vert mt-1">
                {kpi.valeur}{kpi.suffix}
              </p>
            </div>
          ))}
        </div>
      </AnimateIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <AnimateIn delay={0.15}>
          <div className="bg-white rounded-3xl border border-creme-dark p-5 md:p-6">
            <h2 className="font-display text-lg md:text-xl text-vert mb-4 md:mb-6">Statut des commandes</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={dataStatuts} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                  {dataStatuts.map((_: { name: string; value: number }, i: number) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #ede6d6', fontSize: '13px' }} />
                <Legend iconType="circle" iconSize={10} formatter={(v) => <span style={{ fontSize: '12px', color: '#6b6b5e' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.2}>
          <div className="bg-white rounded-3xl border border-creme-dark p-5 md:p-6">
            <h2 className="font-display text-lg md:text-xl text-vert mb-4 md:mb-6">Produits par categorie</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={dataCategories} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                  {dataCategories.map((_: { name: string; value: number }, i: number) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #ede6d6', fontSize: '13px' }} />
                <Legend iconType="circle" iconSize={10} formatter={(v) => <span style={{ fontSize: '12px', color: '#6b6b5e' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AnimateIn>
      </div >

      <AnimateIn delay={0.25}>
        <div className="bg-white rounded-3xl border border-creme-dark overflow-hidden mb-4 md:mb-6">
          <div className="px-4 md:px-6 py-4 md:py-5 border-b border-creme-dark">
            <h2 className="font-display text-lg md:text-xl text-vert">Commandes récentes</h2>
          </div>
          <div className="divide-y divide-creme-dark">
            {recentOrders?.map((cmd: OrderSummary) => (
              <div key={cmd.id} className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[12px] md:text-[13px] font-medium text-vert">{cmd.id.slice(0, 8)}...</p>
                  <p className="text-[11px] md:text-[12px] text-gris mt-0.5">{new Date(cmd.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="flex items-center gap-2 md:gap-6">
                  <span className={`text-[10px] md:text-[11px] font-semibold px-2 md:px-3 py-1 rounded-full ${
                    cmd.status === 'annulee' ? 'bg-red-50 text-red-500' :
                    cmd.status === 'terminee' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-500'
                  }`}>
                    {cmd.status === 'annulee' ? 'Annulée' : cmd.status === 'terminee' ? 'Terminée' : 'En cours'}
                  </span>
                  <span className={`text-[10px] md:text-[11px] font-semibold px-2 md:px-3 py-1 rounded-full hidden sm:block ${
                    cmd.paymentStatus === 'payee' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'
                  }`}>
                    {cmd.paymentStatus === 'payee' ? 'Payée' : 'En attente'}
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

      <AnimateIn delay={0.3}>
        <div className="bg-white rounded-3xl border border-creme-dark overflow-hidden">
          <div className="px-4 md:px-6 py-4 md:py-5 border-b border-creme-dark">
            <h2 className="font-display text-lg md:text-xl text-vert">Meilleurs clients</h2>
          </div>
          <div className="divide-y divide-creme-dark">
            {topClients?.map((c: ClientSummary) => (
              <div key={c.id} className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-creme flex items-center justify-center text-matcha font-semibold text-[12px] md:text-[13px] shrink-0">
                    {c.name ? c.name[0] : '?'}
                  </div>
                  <div>
                    <p className="text-[12px] md:text-[13px] font-medium text-texte">{c.name || 'Utilisateur'}</p>
                    <p className="text-[11px] md:text-[12px] text-gris hidden sm:block">{c.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:gap-8">
                  <div className="text-center hidden sm:block">
                    <p className="text-[11px] text-gris uppercase tracking-wider">Commandes</p>
                    <p className="font-display text-base md:text-lg text-vert">{c._count.orders}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] text-gris uppercase tracking-wider hidden sm:block">Total</p>
                    <p className="font-display text-base md:text-lg text-vert">{c.totalSpent?.toFixed(2) || '0.00'}€</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimateIn>
    </div>
  )
}
