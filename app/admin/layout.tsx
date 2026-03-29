'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'
import { LayoutDashboard, Package, Tag, Users, Truck, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const liens = [
  { label: "Vue d'ensemble",      href: '/admin',            icon: LayoutDashboard },
  { label: 'Gestion des stocks',  href: '/admin/stocks',     icon: Package         },
  { label: 'Promotions',          href: '/admin/promotions', icon: Tag             },
  { label: 'Clients',             href: '/admin/clients',    icon: Users           },
  { label: 'Param. livraison',    href: '/admin/livraison',  icon: Truck           },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [menuOuvert, setMenuOuvert] = useState(false)

  return (
    <div className="min-h-screen bg-blanc flex flex-col md:flex-row">

      {/* ── SIDEBAR DESKTOP ──────────────────────────────────── */}
      <aside className="hidden md:flex w-72 bg-vert flex-col py-10 px-6 shrink-0">
        <div className="mb-8 px-2">
          <div className="w-14 h-14 rounded-2xl bg-matcha/30 flex items-center justify-center text-2xl mb-3">
            👩‍💼
          </div>
          <p className="font-display text-lg text-creme">Bonjour, Audrey !</p>
          <p className="text-[12px] text-creme/40 mt-0.5">Administratrice</p>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {liens.map((l) => (
            <Link key={l.href} href={l.href}>
              <div className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-medium transition-all',
                pathname === l.href
                  ? 'bg-white/15 text-white'
                  : 'text-creme/50 hover:bg-white/10 hover:text-white'
              )}>
                <l.icon size={16} />
                {l.label}
              </div>
            </Link>
          ))}
        </nav>
        <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-medium text-creme/40 hover:bg-white/10 hover:text-white transition-all mt-4">
          <LogOut size={16} />
          Se déconnecter
        </button>
      </aside>

      {/* ── NAVBAR MOBILE ADMIN ──────────────────────────────── */}
      <div className="md:hidden bg-vert px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-matcha/30 flex items-center justify-center text-lg">
            👩‍💼
          </div>
          <div>
            <p className="font-display text-[14px] text-creme leading-tight">Bonjour, Audrey !</p>
            <p className="text-[11px] text-creme/40">Administratrice</p>
          </div>
        </div>
        <button
          onClick={() => setMenuOuvert(!menuOuvert)}
          className="w-9 h-9 rounded-xl border border-white/20 grid place-items-center text-white"
        >
          {menuOuvert ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Menu mobile dropdown admin */}
      {menuOuvert && (
        <div className="md:hidden bg-vert border-b border-white/10 px-6 py-3 flex flex-col gap-1">
          {liens.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOuvert(false)}>
              <div className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-medium transition-all',
                pathname === l.href
                  ? 'bg-white/15 text-white'
                  : 'text-creme/50 hover:bg-white/10 hover:text-white'
              )}>
                <l.icon size={16} />
                {l.label}
              </div>
            </Link>
          ))}
          <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-medium text-creme/40 hover:bg-white/10 hover:text-white transition-all">
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