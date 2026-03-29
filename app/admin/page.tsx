'use client'

import { commandes, clients, produits } from '@/lib/data'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { ShoppingBag, Users, Package, TrendingUp, Download } from 'lucide-react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useBanniere } from '@/components/layout/BanniereContext'
import * as XLSX from 'xlsx'

const COLORS = ['#7a9e7e', '#1e3a28', '#a8c5a0', '#ede6d6']

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
  const totalRevenu         = commandes.reduce((acc, c) => acc + c.total, 0)
  const commandesAujourdhui = commandes.filter((c) => c.statut === 'en-cours').length

  const dataStatuts = [
    { name: 'Terminees', value: commandes.filter((c) => c.statut === 'terminee').length },
    { name: 'En cours',  value: commandes.filter((c) => c.statut === 'en-cours').length },
  ]

  const dataCategories = [
    { name: 'Fruits',   value: produits.filter((p) => p.categorie === 'fruits').length   },
    { name: 'Legumes',  value: produits.filter((p) => p.categorie === 'legumes').length  },
    { name: 'Epicerie', value: produits.filter((p) => p.categorie === 'epicerie').length },
    { name: 'Local',    value: produits.filter((p) => p.categorie === 'local').length    },
  ]

  const extraireListeJour = () => {
    const wb = XLSX.utils.book_new()
    const lignesCommandes = commandes
      .filter((c) => c.statut === 'en-cours')
      .flatMap((cmd) => {
        const client  = clients.find((cl) => cl.id === 'c1')
        const adresse = '1 Rue du Theatre, 64200 Biarritz'
        return cmd.produits.map((p) => ({
          'N Commande':        cmd.id,
          'Date':              cmd.date,
          'Client':            client ? `${client.prenom} ${client.nom}` : 'Client',
          'Email':             client?.email ?? '',
          'Adresse livraison': adresse,
          'Produit':           p.nom,
          'Quantite':          p.qte,
          'Prix unitaire':     p.prix.toFixed(2) + 'EUR',
          'Sous-total':        (p.prix * p.qte).toFixed(2) + 'EUR',
          'Total commande':    cmd.total.toFixed(2) + 'EUR',
          'Statut paiement':   cmd.paiement === 'payee' ? 'Payee' : 'En attente',
        }))
      })
    const wsCommandes = XLSX.utils.json_to_sheet(
      lignesCommandes.length > 0 ? lignesCommandes : [{ 'Info': 'Aucune commande en cours' }]
    )
    wsCommandes['!cols'] = [
      { wch: 16 }, { wch: 12 }, { wch: 18 }, { wch: 26 },
      { wch: 30 }, { wch: 14 }, { wch: 10 }, { wch: 14 },
      { wch: 12 }, { wch: 16 }, { wch: 16 },
    ]
    XLSX.utils.book_append_sheet(wb, wsCommandes, 'Commandes du jour')

    const lignesClients = clients.map((c) => ({
      'Prenom': c.prenom, 'Nom': c.nom, 'Email': c.email,
      'Nb commandes': c.commandes, 'Total achats': c.total.toFixed(2) + 'EUR',
    }))
    const wsClients = XLSX.utils.json_to_sheet(lignesClients)
    wsClients['!cols'] = [{ wch: 14 }, { wch: 14 }, { wch: 28 }, { wch: 14 }, { wch: 14 }]
    XLSX.utils.book_append_sheet(wb, wsClients, 'Clients')

    const produitsAPreparer: Record<string, number> = {}
    commandes.filter((c) => c.statut === 'en-cours').forEach((cmd) => {
      cmd.produits.forEach((p) => {
        produitsAPreparer[p.nom] = (produitsAPreparer[p.nom] || 0) + p.qte
      })
    })
    const lignesProduits = Object.entries(produitsAPreparer).map(([nom, qte]) => ({
      'Produit': nom, 'Quantite totale a preparer': qte,
    }))
    const wsProduits = XLSX.utils.json_to_sheet(
      lignesProduits.length > 0 ? lignesProduits : [{ 'Info': 'Aucun produit a preparer' }]
    )
    wsProduits['!cols'] = [{ wch: 20 }, { wch: 28 }]
    XLSX.utils.book_append_sheet(wb, wsProduits, 'Produits a preparer')

    const date = new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')
    XLSX.writeFile(wb, `Fornaro_Livraisons_${date}.xlsx`)
  }

  return (
    <div>

      {/* Header */}
      <AnimateIn>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <p className="section-eyebrow mb-2">Dashboard</p>
            <h1 className="font-display text-3xl md:text-4xl text-vert">Vue d'ensemble</h1>
            <p className="text-gris text-[13px] md:text-[14px] mt-1">
              Vous avez{' '}
              <span className="text-vert font-semibold">
                {commandesAujourdhui} commande{commandesAujourdhui > 1 ? 's' : ''}
              </span>{' '}
              en cours ce matin.
            </p>
          </div>
          <button
            onClick={extraireListeJour}
            className="flex items-center gap-3 bg-vert text-white rounded-2xl px-5 md:px-6 py-3 md:py-4 font-semibold text-[13px] md:text-[14px] hover:bg-vert-mid transition-all hover:-translate-y-0.5 w-full sm:w-auto justify-center sm:justify-start"
          >
            <Download size={18} />
            <div className="text-left">
              <p>Extraire la liste du jour</p>
              <p className="text-[11px] text-matcha-light font-normal">
                Commandes · Clients · Produits
              </p>
            </div>
          </button>
        </div>
      </AnimateIn>

      {/* KPI */}
      <AnimateIn delay={0.1}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          {[
            { icon: ShoppingBag, label: 'Commandes',    valeur: commandes.length,       suffix: '',    color: 'text-matcha' },
            { icon: TrendingUp,  label: 'Revenu',       valeur: totalRevenu.toFixed(0), suffix: '€',   color: 'text-vert'   },
            { icon: Users,       label: 'Clients',      valeur: clients.length,          suffix: '',    color: 'text-matcha' },
            { icon: Package,     label: 'Produits',     valeur: produits.length,         suffix: '',    color: 'text-vert'   },
          ].map((kpi) => (
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

      {/* Camemberts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <AnimateIn delay={0.15}>
          <div className="bg-white rounded-3xl border border-creme-dark p-5 md:p-6">
            <h2 className="font-display text-lg md:text-xl text-vert mb-4 md:mb-6">Statut des commandes</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={dataStatuts} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value">
                  {dataStatuts.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
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
                  {dataCategories.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #ede6d6', fontSize: '13px' }} />
                <Legend iconType="circle" iconSize={10} formatter={(v) => <span style={{ fontSize: '12px', color: '#6b6b5e' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </AnimateIn>
      </div>

      {/* Commandes recentes */}
      <AnimateIn delay={0.25}>
        <div className="bg-white rounded-3xl border border-creme-dark overflow-hidden mb-4 md:mb-6">
          <div className="px-4 md:px-6 py-4 md:py-5 border-b border-creme-dark">
            <h2 className="font-display text-lg md:text-xl text-vert">Commandes recentes</h2>
          </div>
          <div className="divide-y divide-creme-dark">
            {commandes.map((cmd) => (
              <div key={cmd.id} className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] md:text-[13px] font-medium text-texte">{cmd.id}</p>
                  <p className="text-[11px] md:text-[12px] text-gris mt-0.5">{cmd.date}</p>
                </div>
                <div className="flex items-center gap-2 md:gap-6">
                  <span className={`text-[10px] md:text-[11px] font-semibold px-2 md:px-3 py-1 rounded-full hidden sm:block ${
                    cmd.paiement === 'payee' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-500'
                  }`}>
                    {cmd.paiement === 'payee' ? 'Payee' : 'En attente'}
                  </span>
                  <span className={`text-[10px] md:text-[11px] font-semibold px-2 md:px-3 py-1 rounded-full ${
                    cmd.statut === 'terminee' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-500'
                  }`}>
                    {cmd.statut === 'terminee' ? 'Terminee' : 'En cours'}
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

      {/* Meilleurs clients */}
      <AnimateIn delay={0.3}>
        <div className="bg-white rounded-3xl border border-creme-dark overflow-hidden">
          <div className="px-4 md:px-6 py-4 md:py-5 border-b border-creme-dark">
            <h2 className="font-display text-lg md:text-xl text-vert">Meilleurs clients</h2>
          </div>
          <div className="divide-y divide-creme-dark">
            {clients.map((c) => (
              <div key={c.id} className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-creme flex items-center justify-center text-matcha font-semibold text-[12px] md:text-[13px] shrink-0">
                    {c.prenom[0]}{c.nom[0]}
                  </div>
                  <div>
                    <p className="text-[12px] md:text-[13px] font-medium text-texte">{c.prenom} {c.nom}</p>
                    <p className="text-[11px] md:text-[12px] text-gris hidden sm:block">{c.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:gap-8">
                  <div className="text-center hidden sm:block">
                    <p className="text-[11px] text-gris uppercase tracking-wider">Commandes</p>
                    <p className="font-display text-base md:text-lg text-vert">{c.commandes}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] text-gris uppercase tracking-wider hidden sm:block">Total</p>
                    <p className="font-display text-base md:text-lg text-vert">{c.total.toFixed(2)}€</p>
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