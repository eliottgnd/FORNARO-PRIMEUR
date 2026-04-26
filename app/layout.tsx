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
  title: 'Fornaro Primeur — Le meilleur du marche, livre chez vous',
  description: 'Fruits, legumes et produits frais selectionnes chaque jour au Pays Basque.',
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