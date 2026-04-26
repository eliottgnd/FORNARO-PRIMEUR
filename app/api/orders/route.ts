import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/auth/prisma'
import { SumUp } from '@sumup/sdk'

const sumupClient = new SumUp({
  apiKey: process.env.SUMUP_API_KEY || '',
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Veuillez vous connecter pour commander' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { items, addressId, total, deliveryCost } = body

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Le panier est vide' }, { status: 400 })
    }

    // Validate stock availability before creating anything
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })
      if (!product) throw new Error(`Produit ${item.productId} non trouvé`)
      if (product.stockQuantity < item.quantity) {
        throw new Error(`Stock insuffisant pour ${product.name}`)
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const redirectUrl = `${baseUrl}/paiement/success`

    // Check if SumUp credentials are configured (not placeholder values)
    const hasValidCredentials =
      process.env.SUMUP_API_KEY &&
      process.env.SUMUP_API_KEY !== 'your_sumup_api_key_here' &&
      process.env.SUMUP_MERCHANT_CODE &&
      process.env.SUMUP_MERCHANT_CODE !== 'your_merchant_code_here'

    if (!hasValidCredentials) {
      throw new Error('Configuration SumUp requise - Veuillez configurer SUMUP_API_KEY et SUMUP_MERCHANT_CODE dans le fichier .env')
    }

    // Create SumUp checkout with hosted checkout
    const checkout = await sumupClient.checkouts.create({
      checkout_reference: `fornaro-${Date.now()}`,
      amount: total,
      currency: 'EUR',
      merchant_code: process.env.SUMUP_MERCHANT_CODE!,
      description: `Commande Fornaro`,
      hosted_checkout: {
        enabled: true,
      },
      redirect_url: redirectUrl,
    })

    // Log checkout response for debugging
    console.log('SumUp checkout response:', JSON.stringify(checkout))

    // Create pending order (stock will be decremented after payment via webhook)
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: total,
        status: 'en-cours',
        paymentStatus: 'en-attente',
        paymentId: checkout.id,
        addressId: addressId,
        deliveryCost: deliveryCost || 0,
      },
    })

    // Create order items
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })
      if (!product) throw new Error(`Produit ${item.productId} non trouvé`)

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: product.price,
        },
      })
    }

    const hostedCheckoutUrl = (checkout as any).hosted_checkout_url || (checkout as any).hostedCheckoutUrl

    return NextResponse.json({
      orderId: order.id,
      checkoutId: checkout.id,
      hostedCheckoutUrl,
      status: 'pending_payment',
    })
  } catch (e: any) {
    console.error('Order creation error:', e)
    return NextResponse.json({ error: e.message || 'Erreur lors de la commande', details: e.stack }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Veuillez vous connecter' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get('orderId')

    if (!orderId) {
      return NextResponse.json({ error: 'orderId manquant' }, { status: 400 })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { product: true } } },
    })

    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 })
    }

    // Only allow the order owner to view it
    if (order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 })
    }

    return NextResponse.json(order)
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Erreur' }, { status: 500 })
  }
}