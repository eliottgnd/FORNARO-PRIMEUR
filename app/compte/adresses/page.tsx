'use client'

import { useState, useEffect } from 'react'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { MapPin, Plus, Pencil, Trash2 } from 'lucide-react'

export default function Adresses() {
  const [adresses, setAdresses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState({ label: '', street: '', city: '', zipCode: '', isDefault: false })

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const res = await fetch('/api/user/addresses')
        if (res.ok) {
          const data = await res.json()
          setAdresses(data)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAddresses()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const newAddr = await res.json()
        setAdresses([...adresses, newAddr])
        setIsAdding(false)
        setForm({ label: '', street: '', city: '', zipCode: '', isDefault: false })
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (isLoading) return <div className="flex items-center justify-center min-h-[40vh] text-gris">Chargement...</div>

  return (
    <div>
      <AnimateIn>
        <p className="section-eyebrow mb-2">Espace client</p>
        <h1 className="font-display text-3xl md:text-4xl text-vert mb-8 md:mb-10">Mes adresses</h1>
      </AnimateIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {adresses.map((a, i) => (
          <AnimateIn key={a.id} delay={i * 0.1}>
            <div className={`bg-white rounded-3xl p-5 md:p-6 border-2 transition-all h-full ${
              a.isDefault ? 'border-matcha' : 'border-creme-dark'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-creme flex items-center justify-center text-matcha shrink-0">
                    <MapPin size={15} />
                  </div>
                  <p className="font-medium text-vert text-[13px] md:text-[14px]">{a.label}</p>
                </div>
                {a.isDefault && (
                  <span className="text-[10px] font-semibold bg-matcha text-white px-2 py-1 rounded-full shrink-0">
                    Principale
                  </span>
                )}
              </div>
              <p className="text-[13px] md:text-[14px] text-texte leading-relaxed">{a.street}</p>
              <p className="text-[12px] md:text-[13px] text-gris mt-1">{a.zipCode} {a.city}</p>
              <div className="flex gap-3 mt-4">
                <button className="flex items-center gap-1.5 text-[12px] text-matcha hover:underline">
                  <Pencil size={12} /> Modifier
                </button>
                <button className="flex items-center gap-1.5 text-[12px] text-red-400 hover:underline">
                  <Trash2 size={12} /> Supprimer
                </button>
              </div>
            </div>
          </AnimateIn>
        ))}

        <AnimateIn delay={0.2}>
          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-creme rounded-3xl p-5 md:p-6 border-2 border-dashed border-creme-dark hover:border-matcha transition-all w-full flex flex-col items-center justify-center gap-3 min-h-[160px]"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-matcha border border-creme-dark">
                <Plus size={18} />
              </div>
              <p className="text-[13px] font-medium text-gris">Ajouter une adresse</p>
            </button>
          ) : (
            <form onSubmit={handleAdd} className="bg-white rounded-3xl p-5 md:p-6 border-2 border-matcha transition-all w-full flex flex-col gap-3 min-h-[160px]">
              <input
                placeholder="Surnom (ex: Domicile)"
                className="input-field text-xs"
                value={form.label}
                onChange={e => setForm({...form, label: e.target.value})}
                required
              />
              <input
                placeholder="Rue et numéro"
                className="input-field text-xs"
                value={form.street}
                onChange={e => setForm({...form, street: e.target.value})}
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="Ville"
                  className="input-field text-xs"
                  value={form.city}
                  onChange={e => setForm({...form, city: e.target.value})}
                  required
                />
                <input
                  placeholder="CP"
                  className="input-field text-xs"
                  value={form.zipCode}
                  onChange={e => setForm({...form, zipCode: e.target.value})}
                />
              </div>
              <label className="flex items-center gap-2 text-xs text-gris">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={e => setForm({...form, isDefault: e.target.checked})}
                />
                Définir comme adresse principale
              </label>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary text-xs px-4 py-2">Ajouter</button>
                <button type="button" onClick={() => setIsAdding(false)} className="btn-outline-dark text-xs px-4 py-2">Annuler</button>
              </div>
            </form>
          )}
        </AnimateIn>
      </div>
    </div>
  )
}
