'use client'

import { useState, useEffect } from 'react'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { Plus, Trash2, Loader2, CalendarDays, Users, ToggleLeft, ToggleRight } from 'lucide-react'

interface Slot {
  id: string
  date: string
  label: string | null
  maxCapacity: number
  isActive: boolean
  booked: number
  remaining: number
}

const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const MOIS = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sep.', 'oct.', 'nov.', 'déc.']

function getDateParts(iso: string) {
  const datePart = iso.split('T')[0]
  const [year, month, day] = datePart.split('-').map(Number)
  return { year, month, day, date: new Date(year, month - 1, day) }
}

function formatDate(iso: string) {
  const { date, year, month, day } = getDateParts(iso)
  return `${JOURS[date.getDay()]} ${day} ${MOIS[month - 1]} ${year}`
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isToday(iso: string) {
  return iso.split('T')[0] === getLocalDateKey()
}

function isPast(iso: string) {
  return iso.split('T')[0] < getLocalDateKey()
}

export default function Creneaux() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ date: '', label: '', maxCapacity: '5' })

  const fetchSlots = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/delivery-slots', { cache: 'no-store' })
      if (res.ok) setSlots(await res.json())
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchSlots() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/delivery-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        await fetchSlots()
        setIsModalOpen(false)
        setForm({ date: '', label: '', maxCapacity: '5' })
      } else {
        const err = await res.json()
        alert(err.message)
      }
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (slot: Slot) => {
    await fetch(`/api/admin/delivery-slots/${slot.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !slot.isActive }),
    })
    setSlots(slots.map(s => s.id === slot.id ? { ...s, isActive: !s.isActive } : s))
  }

  const updateCapacity = async (slot: Slot, val: string) => {
    const cap = parseInt(val)
    if (isNaN(cap) || cap < slot.booked) return
    await fetch(`/api/admin/delivery-slots/${slot.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maxCapacity: cap }),
    })
    setSlots(slots.map(s => s.id === slot.id ? { ...s, maxCapacity: cap, remaining: cap - s.booked } : s))
  }

  const deleteSlot = async (slot: Slot) => {
    if (!confirm(`Supprimer le créneau du ${formatDate(slot.date)} ?`)) return
    const res = await fetch(`/api/admin/delivery-slots/${slot.id}`, { method: 'DELETE' })
    if (res.ok) {
      setSlots(slots.filter(s => s.id !== slot.id))
    } else {
      const err = await res.json()
      alert(err.message)
    }
  }

  const upcoming = slots.filter(s => !isPast(s.date))
  const past = slots.filter(s => isPast(s.date))

  return (
    <div>
      <AnimateIn>
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="section-eyebrow mb-2">Admin</p>
            <h1 className="font-display text-3xl md:text-4xl text-vert">Créneaux de livraison</h1>
            <p className="text-gris text-[13px] mt-1">Gérez les jours de livraison disponibles et leur capacité.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2 text-[13px]"
          >
            <Plus size={16} /> Nouveau créneau
          </button>
        </div>
      </AnimateIn>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-vert" size={28} /></div>
      ) : (
        <>
          {/* Créneaux à venir */}
          <AnimateIn delay={0.05}>
            <h2 className="font-display text-lg text-vert mb-3">À venir</h2>
            {upcoming.length === 0 ? (
              <div className="bg-white rounded-2xl border border-creme-dark p-8 text-center text-gris text-sm mb-8">
                Aucun créneau planifié — créez le premier ci-dessus.
              </div>
            ) : (
              <div className="space-y-3 mb-8">
                {upcoming.map((slot) => {
                  const pct = Math.round((slot.booked / slot.maxCapacity) * 100)
                  return (
                    <div key={slot.id} className={`bg-white rounded-2xl border p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${slot.isActive ? 'border-creme-dark' : 'border-creme-dark opacity-60'}`}>
                      {/* Date + label */}
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-xl bg-creme flex items-center justify-center shrink-0">
                            <CalendarDays size={18} className="text-matcha" />
                          </div>
                          <div>
                            <p className="font-medium text-vert text-[14px]">
                              {formatDate(slot.date)}
                              {isToday(slot.date) && <span className="ml-2 text-[10px] bg-matcha text-white px-1.5 py-0.5 rounded-full font-normal">Aujourd’hui</span>}
                            </p>
                            {slot.label && <p className="text-[11px] text-gris">{slot.label}</p>}
                          </div>
                        </div>

                        {/* Jauge capacité */}
                        <div className="flex-1 max-w-[180px]">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] text-gris flex items-center gap-1"><Users size={11} /> {slot.booked}/{slot.maxCapacity} places</span>
                            <span className={`text-[11px] font-medium ${slot.remaining === 0 ? 'text-red-500' : slot.remaining <= 2 ? 'text-orange-500' : 'text-matcha'}`}>
                              {slot.remaining === 0 ? 'Complet' : `${slot.remaining} dispo.`}
                            </span>
                          </div>
                          <div className="h-1.5 bg-creme rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${pct >= 100 ? 'bg-red-400' : pct >= 70 ? 'bg-orange-400' : 'bg-matcha'}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Capacité éditable */}
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[11px] text-gris">Cap.</span>
                          <input
                            type="number"
                            min={slot.booked}
                            defaultValue={slot.maxCapacity}
                            onBlur={(e) => updateCapacity(slot, e.target.value)}
                            className="w-14 text-center text-[13px] font-medium border border-creme-dark rounded-lg px-1 py-1 outline-none focus:border-matcha"
                          />
                        </div>

                        {/* Toggle actif */}
                        <button onClick={() => toggleActive(slot)} className="shrink-0 text-gris hover:text-vert transition-colors" title={slot.isActive ? 'Désactiver' : 'Activer'}>
                          {slot.isActive
                            ? <ToggleRight size={24} className="text-matcha" />
                            : <ToggleLeft size={24} />
                          }
                        </button>

                        {/* Supprimer */}
                        <button onClick={() => deleteSlot(slot)} className="shrink-0 text-gris hover:text-red-500 transition-colors p-1" title="Supprimer">
                          <Trash2 size={15} />
                        </button>
                    </div>
                  )
                })}
              </div>
            )}
          </AnimateIn>

          {/* Créneaux passés */}
          {past.length > 0 && (
            <AnimateIn delay={0.1}>
              <h2 className="font-display text-lg text-vert mb-3 opacity-60">Passés</h2>
              <div className="space-y-2">
                {past.slice(-5).reverse().map((slot) => (
                  <div key={slot.id} className="bg-creme/40 rounded-xl border border-creme-dark p-3 flex items-center gap-4 opacity-60">
                    <CalendarDays size={15} className="text-gris shrink-0" />
                    <span className="text-[13px] text-gris flex-1">{formatDate(slot.date)}</span>
                    <span className="text-[12px] text-gris">{slot.booked}/{slot.maxCapacity} livraisons</span>
                    <button onClick={() => deleteSlot(slot)} className="text-gris hover:text-red-500 transition-colors p-1">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </AnimateIn>
          )}
        </>
      )}

      {/* Modal création */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-blanc/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-creme-dark">
            <div className="px-6 py-4 border-b border-creme-dark bg-creme/30 rounded-t-3xl flex items-center justify-between">
              <h2 className="font-display text-xl text-vert">Nouveau créneau</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gris hover:text-vert text-xl leading-none">✕</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-gris uppercase tracking-wider block">Date de livraison</label>
                <input
                  type="date"
                  value={form.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  required
                  className="input-field w-full"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-gris uppercase tracking-wider block">
                  Nombre de places
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.maxCapacity}
                  onChange={(e) => setForm({ ...form, maxCapacity: e.target.value })}
                  required
                  className="input-field w-full"
                  placeholder="5"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-medium text-gris uppercase tracking-wider block">
                  Label <span className="font-normal text-gris/60">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={form.label}
                  onChange={(e) => setForm({ ...form, label: e.target.value })}
                  className="input-field w-full"
                  placeholder="ex: Livraison matin"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-[13px] font-medium text-gris hover:text-texte transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Création...' : 'Créer le créneau'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
