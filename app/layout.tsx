import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/NavBar'
import { Footer } from '@/components/layout/Footer'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { Intro } from '@/components/layout/Intro'
import { PageTransition } from '@/components/layout/PageTransition'
import { BanniereProvider } from '@/components/layout/BanniereContext'
import { BannierePromo } from '@/components/layout/BannierePromo'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { ToastProvider } from '@/components/providers/ToastProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://fornaroprimeur.fr'),
  title: {
    default: 'Fornaro Primeur — Fruits & légumes frais livrés au Pays Basque',
    template: '%s | Fornaro Primeur',
  },
  description: 'Primeur en ligne au Pays Basque. Fruits, légumes et produits frais sélectionnés chaque jour, livrés à domicile à Biarritz, Hendaye et alentours.',
  keywords: ['primeur', 'fruits légumes', 'livraison', 'Pays Basque', 'Biarritz', 'Hendaye', 'frais', 'maraîcher'],
  authors: [{ name: 'Fornaro Primeur' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://fornaroprimeur.fr',
    siteName: 'Fornaro Primeur',
    title: 'Fornaro Primeur — Fruits & légumes frais livrés au Pays Basque',
    description: 'Primeur en ligne au Pays Basque. Fruits, légumes et produits frais sélectionnés chaque jour, livrés à domicile à Biarritz, Hendaye et alentours.',
    images: [{ url: '/images/hero-bg.jpg', width: 1200, height: 630, alt: 'Fornaro Primeur' }],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://fornaroprimeur.fr' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" translate="no" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ToastProvider>
            <BanniereProvider>
              <Intro />
              <SmoothScroll>
                <div className="flex flex-col min-h-screen">
                  <BannierePromo />
                  <Navbar />
                  <PageTransition>
                    <main className="flex-1">{children}</main>
                  </PageTransition>
                  <Footer />
                </div>
              </SmoothScroll>
            </BanniereProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}