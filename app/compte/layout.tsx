'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { ShoppingBag, MapPin, User, Heart, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'

const liens = [
  { label: 'Mes commandes',    href: '/compte/commandes', icon: ShoppingBag },
  { label: 'Mes adresses',     href: '/compte/adresses',  icon: MapPin      },
  { label: 'Mes informations', href: '/compte/infos',     icon: User        },
  { label: 'Favoris',          href: '/compte/favoris',   icon: Heart       },
]

export default function CompteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [menuOuvert, setMenuOuvert] = useState(false)

  return (
    <div className="min-h-screen bg-blanc flex flex-col md:flex-row">

      {/* ── SIDEBAR DESKTOP ──────────────────────────────────── */}
      <aside className="hidden md:flex w-72 bg-white border-r border-creme-dark flex-col py-10 px-6 shrink-0">
        <div className="mb-8 px-2">
          <div className="w-14 h-14 rounded-2xl bg-creme flex items-center justify-center text-2xl mb-3">
            👤
          </div>
          <p className="font-display text-lg text-vert">Bienvenue, {session?.user?.name || 'Utilisateur'}</p>
          <p className="text-[12px] text-gris mt-0.5">{session?.user?.email}</p>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {liens.map((l) => (
            <Link key={l.href} href={l.href}>
              <div className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-medium transition-all',
                pathname === l.href
                  ? 'bg-vert text-white'
                  : 'text-gris hover:bg-creme hover:text-vert'
              )}>
                <l.icon size={16} />
                {l.label}
              </div>
            </Link>
          ))}
        </nav>

        <button
          onClick={async () => await signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-medium text-gris hover:bg-red-50 hover:text-red-500 transition-all mt-4"
        >
          <LogOut size={16} />
          Se déconnecter
        </button>
      </aside>

      {/* ── NAVBAR MOBILE COMPTE ─────────────────────────────── */}
      <div className="md:hidden bg-white border-b border-creme-dark px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-creme flex items-center justify-center text-lg">
            👤
          </div>
          <div>
            <p className="font-display text-[14px] text-vert leading-tight">Bienvenue, {session?.user?.name || 'Utilisateur'}</p>
            <p className="text-[11px] text-gris">Mon espace client</p>
          </div>
        </div>
        <button
          onClick={() => setMenuOuvert(!menuOuvert)}
          className="w-9 h-9 rounded-xl border border-creme-dark grid place-items-center text-vert"
        >
          {menuOuvert ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Menu mobile dropdown */}
      {menuOuvert && (
        <div className="md:hidden bg-white border-b border-creme-dark px-6 py-3 flex flex-col gap-1 z-20">
          {liens.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOuvert(false)}>
              <div className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-medium transition-all',
                pathname === l.href
                  ? 'bg-vert text-white'
                  : 'text-gris hover:bg-creme hover:text-vert'
              )}>
                <l.icon size={16} />
                {l.label}
              </div>
            </Link>
          ))}
          <button
            onClick={async () => await signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-medium text-gris hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <LogOut size={16} />
            Se déconnecter
          </button>
        </div>
      )}

      {/* ── CONTENU ──────────────────────────────────────────── */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {children}
      </main>

    </div>
  )
}