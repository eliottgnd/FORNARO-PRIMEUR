import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez Fornaro Primeur pour toute question sur nos livraisons de fruits et légumes frais au Pays Basque.',
  alternates: { canonical: 'https://fornaroprimeur.fr/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
