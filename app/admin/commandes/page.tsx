'use client'

import { useState, useEffect, useCallback } from 'react'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { Search, Loader2, Eye, Download, X, CheckCircle2, Clock, XCircle, ChevronDown } from 'lucide-react'
import { useToast } from '@/components/providers/ToastProvider'

interface OrderItem {
  id: string
  productId: string
  quantity: number
  priceAtPurchase: number
  product: { id: string; name: string; category: string; unit: string }
}

interface Address {
  id: string
  label: string
  street: string
  city: string
  zipCode: string | null
}

interface Order {
  id: string
  status: string
  paymentStatus: string
  total: number
  createdAt: string
  updatedAt: string
  user: { id: string; name: string | null; email: string; phone: string | null }
  address: Address | null
  items: OrderItem[]
}

const STATUS_LABELS: Record<string, string> = {
  'en-cours': 'En cours',
  'terminee': 'Terminée',
  'annulee': 'Annulée',
}

const PAYMENT_LABELS: Record<string, string> = {
  'en-attente': 'En attente',
  'payee': 'Payée',
}

const STATUS_COLORS: Record<string, string> = {
  'en-cours': 'bg-orange-100 text-orange-700 border-orange-200',
  'terminee': 'bg-green-100 text-green-700 border-green-200',
  'annulee': 'bg-red-100 text-red-700 border-red-200',
}

const PAYMENT_COLORS: Record<string, string> = {
  'en-attente': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'payee': 'bg-green-100 text-green-700 border-green-200',
}

function generateCSV(order: Order): string {
  const rows: string[][] = []

  rows.push(['Fornaro Primeur - Bon de Commande'])
  rows.push([])
  rows.push(['N° Commande', order.id])
  rows.push(['Date', new Date(order.createdAt).toLocaleString('fr-FR')])
  rows.push(['Client', order.user.name || 'N/A'])
  rows.push(['Email', order.user.email])
  if (order.user.phone) rows.push(['Téléphone', order.user.phone])
  rows.push(['Statut', STATUS_LABELS[order.status] || order.status])
  rows.push(['Paiement', PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus])
  rows.push([])

  if (order.address) {
    rows.push(['Adresse de livraison'])
    rows.push(['Label', order.address.label])
    rows.push(['Rue', order.address.street])
    rows.push(['Ville', order.address.city])
    if (order.address.zipCode) rows.push(['Code postal', order.address.zipCode])
    rows.push([])
  }

  rows.push(['Lignes de commande'])
  rows.push(['Produit', 'Catégorie', 'Quantité', 'Unité', 'Prix unitaire (€)', 'Sous-total (€)'])
  order.items.forEach(item => {
    const subtotal = item.priceAtPurchase * item.quantity
    rows.push([
      item.product.name,
      item.product.category,
      item.quantity.toString(),
      item.product.unit,
      item.priceAtPurchase.toFixed(2),
      subtotal.toFixed(2),
    ])
  })
  rows.push([])
  rows.push(['Total commande', '', '', '', '', order.total.toFixed(2)])

  return rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
}

function downloadCSV(order: Order) {
  const csv = generateCSV(order)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `commande_${order.id.slice(0, 8)}_${new Date(order.createdAt).toISOString().slice(0,10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function CommandesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { showToast } = useToast()

  const fetchOrders = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.set('status', statusFilter)
      if (search) params.set('search', search)
      const res = await fetch(`/api/admin/orders?${params}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
      }
    } catch (e) {
      showToast("Erreur lors du chargement des commandes", "error")
    } finally {
      setIsLoading(false)
    }
  }, [search, statusFilter, showToast])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const updateOrderStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status, paymentStatus }),
    })
    if (res.ok) {
      const updated = await res.json()
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updated } : o))
      if (selectedOrder?.id === orderId) setSelectedOrder(prev => prev ? { ...prev, ...updated } : null)
      showToast("Commande mise à jour", "success")
    } else {
      showToast("Erreur lors de la mise à jour", "error")
    }
  }

  const stats = {
    total: orders.length,
    enCours: orders.filter(o => o.status === 'en-cours').length,
    terminee: orders.filter(o => o.status === 'terminee').length,
    annulee: orders.filter(o => o.status === 'annulee').length,
    revenue: orders.reduce((s, o) => s + o.total, 0),
  }

  return (
    <div>
      <AnimateIn>
        <p className="section-eyebrow mb-2">Admin</p>
        <h1 className="font-display text-3xl md:text-4xl text-vert mb-8">Commandes</h1>
      </AnimateIn>

      {/* Stats */}
      <AnimateIn delay={0.1}>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 md:gap-4 mb-6 md:mb-8">
          {[
            { label: 'Total', valeur: stats.total },
            { label: 'En cours', valeur: stats.enCours },
            { label: 'Terminées', valeur: stats.terminee },
            { label: 'Annulées', valeur: stats.annulee },
            { label: 'Revenu', valeur: `${stats.revenue.toFixed(2)}€` },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-3xl p-4 md:p-5 border border-creme-dark">
              <p className="text-[11px] text-gris uppercase tracking-wider mb-1">{s.label}</p>
              <p className="font-display text-xl md:text-2xl text-vert">{s.valeur}</p>
            </div>
          ))}
        </div>
      </AnimateIn>

      {/* Filters */}
      <AnimateIn delay={0.15}>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gris" />
            <input
              type="text"
              placeholder="N° commande, client, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field pr-10 appearance-none cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="en-cours">En cours</option>
              <option value="terminee">Terminée</option>
              <option value="annulee">Annulée</option>
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gris pointer-events-none" />
          </div>
        </div>
      </AnimateIn>

      {/* Orders table */}
      <AnimateIn delay={0.2}>
        <div className="bg-white rounded-3xl border border-creme-dark overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="animate-spin text-vert" size={24} />
              <p className="text-gris text-sm">Chargement des commandes...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center text-gris text-sm">
              {search ? 'Aucune commande trouvée.' : 'Aucune commande enregistrée.'}
            </div>
          ) : (
            <>
              {/* Desktop header */}
              <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_1fr_80px_90px_100px_60px] px-6 py-3 bg-creme border-b border-creme-dark">
                {['Commande', 'Client', 'Date', 'Articles', 'Statut', 'Total', ''].map(h => (
                  <p key={h} className="text-[11px] font-semibold uppercase tracking-wider text-gris">{h}</p>
                ))}
              </div>

              <div className="divide-y divide-creme">
                {orders.map((order) => (
                  <div key={order.id} className="px-6 py-4 hover:bg-creme/40 transition-colors">
                    {/* Desktop row */}
                    <div className="hidden md:grid grid-cols-[1.5fr_1.5fr_1fr_80px_90px_100px_60px] items-center gap-4">
                      <div>
                        <p className="font-mono text-[13px] text-vert font-medium">{order.id.slice(0, 8)}...</p>
                        <p className="text-[11px] text-gris mt-0.5">{order.user.email}</p>
                      </div>
                      <p className="text-[13px] text-texte truncate">{order.user.name || 'Client'}</p>
                      <p className="text-[12px] text-gris">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                      <p className="font-display text-[14px] text-vert text-center">{order.items.length}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border text-center ${STATUS_COLORS[order.status]}`}>
                        {STATUS_LABELS[order.status]}
                      </span>
                      <p className="font-display text-[15px] text-vert text-right font-semibold">{order.total.toFixed(2)}€</p>
                      <button onClick={() => setSelectedOrder(order)} className="p-2 hover:bg-creme rounded-xl transition-colors justify-self-center" title="Voir détails">
                        <Eye size={15} className="text-vert" />
                      </button>
                    </div>

                    {/* Mobile card */}
                    <div className="md:hidden flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[12px] text-vert font-medium">{order.id.slice(0, 8)}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${STATUS_COLORS[order.status]}`}>
                            {STATUS_LABELS[order.status]}
                          </span>
                        </div>
                        <p className="text-[12px] text-gris truncate">{order.user.name || order.user.email}</p>
                        <p className="text-[11px] text-gris/60 mt-0.5">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="text-right shrink-0 flex flex-col items-end gap-1">
                        <p className="font-display text-[15px] text-vert font-semibold">{order.total.toFixed(2)}€</p>
                        <button onClick={() => setSelectedOrder(order)} className="text-[11px] text-matcha hover:underline">
                          Voir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </AnimateIn>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-white rounded-t-3xl border-b border-creme-dark px-6 py-5 flex items-start justify-between">
              <div>
                <p className="font-mono text-vert font-semibold">{selectedOrder.id}</p>
                <p className="text-xs text-gris mt-1">{new Date(selectedOrder.createdAt).toLocaleString('fr-FR')}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => downloadCSV(selectedOrder)}
                  className="flex items-center gap-2 px-3 py-2 bg-vert text-white text-xs font-medium rounded-xl hover:bg-vert/90 transition-colors"
                >
                  <Download size={13} />
                  CSV
                </button>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-creme rounded-xl">
                  <X size={18} className="text-gris" />
                </button>
              </div>
            </div>

            {/* Client & address */}
            <div className="px-6 py-5 border-b border-creme">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gris mb-2">Client</p>
                  <p className="text-sm font-medium text-vert">{selectedOrder.user.name || 'Client'}</p>
                  <p className="text-xs text-gris">{selectedOrder.user.email}</p>
                  {selectedOrder.user.phone && <p className="text-xs text-gris">{selectedOrder.user.phone}</p>}
                </div>
                {selectedOrder.address && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gris mb-2">Livraison</p>
                    <p className="text-sm font-medium text-vert">{selectedOrder.address.label}</p>
                    <p className="text-xs text-gris">{selectedOrder.address.street}</p>
                    <p className="text-xs text-gris">{selectedOrder.address.city}{selectedOrder.address.zipCode ? `, ${selectedOrder.address.zipCode}` : ''}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="px-6 py-5 border-b border-creme">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gris mb-3">Articles ({selectedOrder.items.length})</p>
              <div className="space-y-3">
                {selectedOrder.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between gap-4 py-2 border-b border-creme/50 last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-vert">{item.product.name}</p>
                      <p className="text-xs text-gris">{item.product.category} · {item.quantity} {item.product.unit}</p>
                    </div>
                    <p className="font-display text-sm font-semibold text-vert">{(item.priceAtPurchase * item.quantity).toFixed(2)}€</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t-2 border-vert">
                <p className="font-semibold text-vert">Total</p>
                <p className="font-display text-xl font-bold text-vert">{selectedOrder.total.toFixed(2)}€</p>
              </div>
            </div>

            {/* Status controls */}
            <div className="px-6 py-5 border-b border-creme">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gris mb-2">Statut commande</p>
                  <div className="flex flex-wrap gap-2">
                    {(['en-cours', 'terminee', 'annulee'] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => updateOrderStatus(selectedOrder.id, s)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          selectedOrder.status === s
                            ? STATUS_COLORS[s] + ' border-current'
                            : 'border-creme-dark text-gris hover:border-vert hover:text-vert'
                        }`}
                      >
                        {s === 'en-cours' && <Clock size={12} />}
                        {s === 'terminee' && <CheckCircle2 size={12} />}
                        {s === 'annulee' && <XCircle size={12} />}
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gris mb-2">Paiement</p>
                  <div className="flex flex-wrap gap-2">
                    {(['en-attente', 'payee'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => updateOrderStatus(selectedOrder.id, selectedOrder.status, p)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          selectedOrder.paymentStatus === p
                            ? PAYMENT_COLORS[p] + ' border-current'
                            : 'border-creme-dark text-gris hover:border-vert hover:text-vert'
                        }`}
                      >
                        {PAYMENT_LABELS[p]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Download */}
            <div className="px-6 py-5 flex justify-end">
              <button
                onClick={() => downloadCSV(selectedOrder)}
                className="flex items-center gap-2 px-5 py-3 bg-vert text-white rounded-2xl font-medium text-sm hover:bg-vert/90 transition-colors"
              >
                <Download size={16} />
                Télécharger le CSV
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}