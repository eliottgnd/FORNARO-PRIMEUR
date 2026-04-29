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

  const extraireListeJour = async () => {
    const now = new Date()
    const dateParam = now.toISOString().split('T')[0]

    const res = await fetch('/api/admin/stats?date=' + dateParam)
    if (!res.ok) return
    const dailyStats = await res.json()

    const { kpis, recentOrders, topClients, categoryDistribution = [], statusDistribution = [] } = dailyStats

    const jour = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

    const lines: string[] = []

    lines.push('RAPPORT JOURNALIER - FORNARO PRIMEUR')
    lines.push('Journee: ' + jour)
    lines.push('Date export: ' + now.toLocaleDateString('fr-FR') + '\n')

    lines.push('INDICATEURS DU JOUR')
    lines.push('Commandes du jour,' + String(kpis?.orders || 0))
    lines.push('Revenu du jour,' + (kpis?.revenue?.toFixed(2) || '0.00') + ' EUR')
    lines.push('Total Clients,' + String(kpis?.clients || 0))
    lines.push('Total Produits,' + String(kpis?.products || 0) + '\n')

    lines.push('STATUT DES COMMANDES DU JOUR')
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

    lines.push('COMMANDES DU JOUR')
    lines.push('N Commande,Heure,Client,Total (EUR),Statut,Paiement')
    ;(recentOrders || []).forEach((cmd: OrderSummary) => {
      const heure = new Date(cmd.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      const client = cmd.user?.name || 'Inconnu'
      const statut = cmd.status === 'annulee' ? 'Annulee' : cmd.status === 'terminee' ? 'Terminee' : 'En cours'
      const paiement = cmd.paymentStatus === 'payee' ? 'Payee' : 'En attente'
      lines.push(cmd.id + ',' + heure + ',' + client + ',' + cmd.total.toFixed(2) + ',' + statut + ',' + paiement)
    })
    lines.push('')

    lines.push('CLIENTS AYANT COMMANDE AUJOURD\'HUI')
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
                  Rapport journalier CSV
                </p>
              </div>
            </button>
          </div>
        </div>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {[
            { icon: ShoppingBag, label: 'Commandes',    valeur: kpis?.orders || 0,       suffix: '',    color: 'text-matcha' },
            { icon: TrendingUp,  label: 'Revenu',       valeur: kpis?.revenue?.toFixed(0) || '0', suffix: '€',   color: 'text-vert'   },
            { icon: Users,       label: 'Clients',      valeur: kpis?.clients || 0,          suffix: '',    color: 'text-matcha' },
            { icon: Package,     label: 'Produits',     valeur: kpis?.products || 0,         suffix: '',    color: 'text-vert'   },
          ].map((kpi: KPI) => (
            <div key={kpi.label} className="bg-white rounded-2xl p-4 border border-creme-dark">
              <div className={`w-8 h-8 rounded-lg bg-creme flex items-center justify-center ${kpi.color} mb-2`}>
                <kpi.icon size={15} />
              </div>
              <p className="text-[10px] text-gris uppercase tracking-wider">{kpi.label}</p>
              <p className="font-display text-xl md:text-2xl text-vert mt-0.5">
                {kpi.valeur}{kpi.suffix}
              </p>
            </div>
          ))}
        </div>
      </AnimateIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <AnimateIn delay={0.15}>
          <div className="bg-white rounded-2xl border border-creme-dark p-4 md:p-5">
            <h2 className="font-display text-base md:text-lg text-vert mb-3 md:mb-4">Statut des commandes</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={dataStatuts} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                  {dataStatuts.map((_: { name: string; value: number }, i: number) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #ede6d6', fontSize: '13px' }} />
                <Legend iconType="circle" iconSize={10} formatter={(v) => <span style={{ fontSize: '12px', color: '#6b6b5e' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.2}>
          <div className="bg-white rounded-2xl border border-creme-dark p-4 md:p-5">
            <h2 className="font-display text-base md:text-lg text-vert mb-3 md:mb-4">Produits par categorie</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={dataCategories} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={4} dataKey="value">
                  {dataCategories.map((_: { name: string; value: number }, i: number) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #ede6d6', fontSize: '13px' }} />
                <Legend iconType="circle" iconSize={10} formatter={(v) => <span style={{ fontSize: '12px', color: '#6b6b5e' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AnimateIn>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <AnimateIn delay={0.25}>
          <div className="bg-white rounded-2xl border border-creme-dark overflow-hidden max-h-[340px] flex flex-col">
            <div className="px-4 py-3 border-b border-creme-dark shrink-0">
              <h2 className="font-display text-base text-vert">Commandes récentes</h2>
            </div>
            <div className="divide-y divide-creme-dark overflow-y-auto flex-1">
              {recentOrders?.slice(0, 6).map((cmd: OrderSummary) => (
                <div key={cmd.id} className="px-4 py-2.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="font-mono text-[11px] font-medium text-vert">{cmd.id.slice(0, 8)}...</p>
                    <p className="text-[10px] text-gris">{new Date(cmd.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                      cmd.status === 'annulee' ? 'bg-red-50 text-red-500' :
                      cmd.status === 'terminee' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-500'
                    }`}>
                      {cmd.status === 'annulee' ? 'Ann.' : cmd.status === 'terminee' ? 'Term.' : 'Enc.'}
                    </span>
                    <span className="font-display text-[13px] text-vert">
                      {cmd.total.toFixed(2)}€
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.3}>
          <div className="bg-white rounded-2xl border border-creme-dark overflow-hidden max-h-[340px] flex flex-col">
            <div className="px-4 py-3 border-b border-creme-dark shrink-0">
              <h2 className="font-display text-base text-vert">Meilleurs clients</h2>
            </div>
            <div className="divide-y divide-creme-dark overflow-y-auto flex-1">
              {topClients?.slice(0, 6).map((c: ClientSummary) => (
                <div key={c.id} className="px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-creme flex items-center justify-center text-matcha font-semibold text-[11px] shrink-0">
                      {c.name ? c.name[0] : '?'}
                    </div>
                    <p className="text-[11px] md:text-[12px] font-medium text-texte truncate max-w-[100px]">{c.name || 'Utilisateur'}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[11px] text-gris hidden sm:block">{c._count.orders} cmd</span>
                    <span className="font-display text-[13px] text-vert">{c.totalSpent?.toFixed(2) || '0.00'}€</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>
      </div>
    </div>
  )
}
