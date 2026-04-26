'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBasket, Search, User, Menu, X } from 'lucide-react'
import { clsx } from 'clsx'
import { useState, useEffect, useRef } from 'react'
import { AuthModal } from '@/components/ui/AuthModal'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/store/useCartStore'
import CartDrawer from '@/components/cart/CartDrawer'

const liens = [
  { label: 'Accueil',      href: '/'        },
  { label: 'Nos produits', href: '/produits' },
  { label: 'A propos',     href: '/a-propos' },
  { label: 'Contact',      href: '/contact'  },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { getUniqueItemCount } = useCartStore()
  const [menuOuvert, setMenuOuvert] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const [menuTop, setMenuTop] = useState(65)

  useEffect(() => {
    setMounted(true)
    const updateMenuTop = () => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect()
        setMenuTop(rect.bottom)
      }
    }
    updateMenuTop()
    window.addEventListener('scroll', updateMenuTop)
    window.addEventListener('resize', updateMenuTop)
    return () => {
      window.removeEventListener('scroll', updateMenuTop)
      window.removeEventListener('resize', updateMenuTop)
    }
  }, [])

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 md:py-5 bg-blanc/90 backdrop-blur-md border-b border-matcha/10"
      >
        {/* Logo */}
        <Link href="/" className="font-display text-xl tracking-widest text-vert uppercase">
          For<span className="italic text-matcha">naro</span> PRIMEUR
        </Link>

        {/* Liens desktop */}
        <ul className="hidden md:flex gap-8 list-none">
          {liens.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={clsx(
                  'text-[13px] font-medium uppercase tracking-widest transition-colors',
                  pathname === l.href ? 'text-vert' : 'text-gris hover:text-vert'
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions desktop */}
        <div className="hidden md:flex items-center gap-3">
          <button className="w-9 h-9 rounded-full border border-creme-dark grid place-items-center text-gris hover:bg-creme-dark transition-colors">
            <Search size={15} />
          </button>
          <button
            onClick={() => setCartOpen(true)}
            className="flex items-center gap-2 bg-vert text-white rounded-full px-4 py-2 text-[13px] font-medium hover:bg-vert-mid transition-colors"
          >
            <ShoppingBasket size={15} />
            Mon panier
            {mounted && getUniqueItemCount() > 0 && (
              <span className="bg-matcha-light text-white text-[11px] font-bold w-5 h-5 rounded-full grid place-items-center">
                {getUniqueItemCount()}
              </span>
            )}
          </button>
           {session ? (
             <Link
               href="/compte"
               className="w-9 h-9 rounded-full bg-matcha/20 grid place-items-center text-matcha hover:bg-matcha/30 transition-colors"
             >
               <User size={16} />
             </Link>
           ) : (
             <button
               onClick={() => setAuthModalOpen(true)}
               className="w-9 h-9 rounded-full bg-matcha/20 grid place-items-center text-matcha hover:bg-matcha/30 transition-colors"
             >
               <User size={16} />
             </button>
           )}
        </div>

        {/* Actions mobile */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setCartOpen(true)}
            className="w-9 h-9 rounded-full border border-creme-dark grid place-items-center text-gris relative"
          >
            <ShoppingBasket size={16} />
            {mounted && getUniqueItemCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-matcha text-white text-[8px] font-bold w-4 h-4 rounded-full grid place-items-center">
                {getUniqueItemCount()}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOuvert(!menuOuvert)}
            className="w-9 h-9 rounded-full border border-creme-dark grid place-items-center text-vert"
          >
            {menuOuvert ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </nav>

      {/* Menu mobile */}
      <div
        className={clsx(
          'fixed left-0 right-0 z-40 bg-blanc border-b border-creme-dark transition-all duration-300 md:hidden',
          menuOuvert
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
        style={{ top: menuTop }}
      >
        <div className="px-6 py-4 flex flex-col gap-1">
          {liens.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOuvert(false)}
              className={clsx(
                'py-3 px-4 rounded-2xl text-[14px] font-medium transition-colors',
                pathname === l.href
                  ? 'bg-vert text-white'
                  : 'text-gris hover:bg-creme hover:text-vert'
              )}
            >
              {l.label}
            </Link>
          ))}
           <div className="mt-3 pt-3 border-t border-creme-dark flex gap-3">
             {session ? (
               <Link
                 href="/compte"
                 onClick={() => setMenuOuvert(false)}
                 className="w-full flex items-center justify-center gap-2 bg-creme text-vert rounded-2xl py-3 text-[13px] font-medium"
               >
                 <User size={15} />
                 Mon compte
               </Link>
             ) : (
               <button
                 onClick={() => {
                   setMenuOuvert(false)
                   setAuthModalOpen(true)
                 }}
                 className="w-full flex items-center justify-center gap-2 bg-creme text-vert rounded-2xl py-3 text-[13px] font-medium"
               >
                 <User size={15} />
                 Mon compte
               </button>
             )}
             <button className="flex-1 flex items-center justify-center gap-2 bg-vert text-white rounded-2xl py-3 text-[13px] font-medium">
               <Search size={15} />
               Rechercher
             </button>
           </div>
        </div>
      </div>

       {/* Overlay */}
       {menuOuvert && (
         <div
           className="fixed inset-0 z-30 md:hidden"
           onClick={() => setMenuOuvert(false)}
         />
       )}

       {/* Auth Modal */}
       <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
       <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
     </>
   )
 }
