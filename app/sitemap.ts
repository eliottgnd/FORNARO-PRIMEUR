import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/auth/prisma'

const BASE = 'https://fornaroprimeur.fr'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await prisma.product.findMany({
    select: { id: true, updatedAt: true },
  })

  const productUrls = products.map((p) => ({
    url: `${BASE}/produits/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    { url: BASE,                      lastModified: new Date(), changeFrequency: 'daily',   priority: 1 },
    { url: `${BASE}/produits`,        lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/a-propos`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/contact`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ...productUrls,
  ]
}
