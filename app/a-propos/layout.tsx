import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Qui sommes-nous ? Fornaro Primeur, votre primeur en ligne au Pays Basque. Des fruits et légumes frais sélectionnés chaque jour.',
  alternates: { canonical: 'https://fornaroprimeur.fr/a-propos' },
}

export default function AProposLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
