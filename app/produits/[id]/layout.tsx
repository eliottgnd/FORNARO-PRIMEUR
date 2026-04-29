import type { Metadata } from 'next'
import { prisma } from '@/lib/auth/prisma'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true, description: true, image: true, category: true },
  })

  if (!product) return { title: 'Produit introuvable' }

  return {
    title: product.name,
    description: product.description || `${product.name} — fruits et légumes frais livrés au Pays Basque par Fornaro Primeur.`,
    alternates: { canonical: `https://fornaroprimeur.fr/produits/${id}` },
    openGraph: {
      url: `https://fornaroprimeur.fr/produits/${id}`,
      title: `${product.name} | Fornaro Primeur`,
      description: product.description || `Achetez ${product.name} en ligne, livré frais à domicile.`,
      images: product.image ? [{ url: product.image, alt: product.name }] : [],
    },
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
