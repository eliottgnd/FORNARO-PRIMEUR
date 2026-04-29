import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nos produits',
  description: 'Découvrez notre sélection de fruits, légumes et produits frais du jour, livrés à domicile au Pays Basque.',
  alternates: { canonical: 'https://fornaroprimeur.fr/produits' },
  openGraph: {
    url: 'https://fornaroprimeur.fr/produits',
    title: 'Nos produits | Fornaro Primeur',
    description: 'Fruits, légumes et produits frais du jour livrés à Biarritz, Hendaye et alentours.',
  },
}

export default function ProduitsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
