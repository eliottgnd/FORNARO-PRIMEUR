import Link from 'next/link'

const liens = {
  navigation: [
    { label: 'Accueil',      href: '/'        },
    { label: 'Nos produits', href: '/produits' },
    { label: 'A propos',     href: '/a-propos' },
    { label: 'Contact',      href: '/contact'  },
  ],
  compte: [
    { label: 'Mes commandes',    href: '/compte/commandes' },
    { label: 'Mes adresses',     href: '/compte/adresses'  },
    { label: 'Mes informations', href: '/compte/infos'     },
    { label: 'Favoris',          href: '/compte/favoris'   },
  ],
}

export function Footer() {
  return (
    <footer className="bg-vert text-white">

      <div className="px-6 md:px-12 pt-12 md:pt-16 pb-8 md:pb-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">

        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <div className="font-display text-xl tracking-widest text-creme uppercase mb-4">
            For<span className="italic text-matcha-light">naro</span> PRIMEUR
          </div>
          <p className="text-sm text-creme/50 leading-relaxed max-w-[200px]">
            Entreprise familiale au Pays Basque et à votre écoute depuis plus de 40ans.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-matcha-light mb-4 md:mb-5">
            Navigation
          </p>
          <ul className="space-y-2 md:space-y-3">
            {liens.navigation.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-creme/60 hover:text-creme transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mon compte */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-matcha-light mb-4 md:mb-5">
            Mon compte
          </p>
          <ul className="space-y-2 md:space-y-3">
            {liens.compte.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-creme/60 hover:text-creme transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Commander */}
        <div className="col-span-2 md:col-span-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-matcha-light mb-4 md:mb-5">
            Commander
          </p>
          <Link href="/produits">
            <button className="btn-primary w-full md:w-auto text-center">
              Accéder aux produits
            </button>
          </Link>
        </div>

      </div>

      <div className="px-6 md:px-12 py-4 border-t border-creme/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-creme/30">
        <span>2026 © Fornaro Primeur</span>
        <a href="https://eliottashenstar.com" target="_blank" rel="noopener noreferrer" className="hover:text-creme/60 transition-colors">Créé par Eliott Ashenstar</a>
      </div>

    </footer>
  )
}