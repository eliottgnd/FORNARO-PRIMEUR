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

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': 'https://fornaroprimeur.fr/#business',
      name: 'Fornaro Primeur',
      url: 'https://fornaroprimeur.fr',
      description: 'Primeur en ligne au Pays Basque. Fruits, légumes et produits frais sélectionnés chaque jour, livrés à domicile à Biarritz, Hendaye et alentours.',
      image: 'https://fornaroprimeur.fr/images/hero-bg.jpg',
      priceRange: '€€',
      servesCuisine: 'Fruits et légumes frais',
      areaServed: ['Biarritz', 'Hendaye', 'Pays Basque'],
      hasMap: [
        'https://maps.google.com/?q=Rue+des+Halles,+64200+Biarritz',
        'https://maps.google.com/?q=Marché+de+Sokoburu,+64700+Hendaye',
      ],
      location: [
        {
          '@type': 'Place',
          name: 'Marché de Biarritz',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Rue des Halles',
            addressLocality: 'Biarritz',
            postalCode: '64200',
            addressCountry: 'FR',
          },
        },
        {
          '@type': 'Place',
          name: "Marché d'Hendaye — Marché de Sokoburu",
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Marché de Sokoburu',
            addressLocality: 'Hendaye',
            postalCode: '64700',
            addressCountry: 'FR',
          },
        },
      ],
      sameAs: ['https://fornaroprimeur.fr'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://fornaroprimeur.fr/#website',
      url: 'https://fornaroprimeur.fr',
      name: 'Fornaro Primeur',
      publisher: { '@id': 'https://fornaroprimeur.fr/#business' },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://fornaroprimeur.fr/produits?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" translate="no" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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