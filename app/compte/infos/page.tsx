'use client'

import { useState, useEffect } from 'react'
import { AnimateIn } from '@/components/layout/AnimateIn'
import { useSession } from 'next-auth/react'

export default function Infos() {
  const { data: session } = useSession()
  const [form, setForm] = useState({
    name: '',
    phone: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [sauvegarde, setSauvegarde] = useState(false)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/user/profile')
        if (res.ok) {
          const data = await res.json()
          setForm({
            name: data.name || '',
            phone: data.phone || '',
          })
        }
      } catch (e) {
        console.error("Failed to fetch profile:", e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSauvegarde(true)
        setTimeout(() => setSauvegarde(false), 2000)
      }
    } catch (e) {
      console.error("Failed to save profile:", e)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[40vh] text-gris">Chargement...</div>
  }

  return (
    <div>
      <AnimateIn>
        <p className="section-eyebrow mb-2">Espace client</p>
        <h1 className="font-display text-3xl md:text-4xl text-vert mb-8 md:mb-10">Mes informations</h1>
      </AnimateIn>

      <AnimateIn delay={0.1}>
        <div className="bg-white rounded-3xl border border-creme-dark p-6 md:p-8 max-w-xl">
          <div className="space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                  Nom complet
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>

            <div>
              <label className="text-[12px] font-medium text-gris uppercase tracking-wider mb-2 block">
                Téléphone
              </label>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="06 00 00 00 00"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={handleSave}
                className={`w-full sm:w-auto transition-all rounded-full px-7 py-3 text-sm font-semibold ${
                  sauvegarde
                    ? 'bg-matcha-light text-white'
                    : 'btn-primary'
                }`}
              >
                {sauvegarde ? '✓ Sauvegardé !' : 'Sauvegarder les modifications'}
              </button>
            </div>

          </div>
        </div>
      </AnimateIn>
    </div>
  )
}
