import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { SumUp } from '@sumup/sdk'

const sumupClient = new SumUp({
  apiKey: process.env.SUMUP_API_KEY || '',
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Veuillez vous connecter' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { amount, orderId } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Montant invalide' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Create SumUp checkout with hosted checkout
    const checkout = await sumupClient.checkouts.create({
      checkout_reference: orderId || `fornaro-${Date.now()}`,
      amount,
      currency: 'EUR',
      merchant_code: process.env.SUMUP_MERCHANT_CODE || '',
      description: `Commande Fornaro ${orderId?.slice(0, 8) || ''}`,
      hosted_checkout: {
        enabled: true,
      },
      redirect_url: `${baseUrl}/paiement/success?order=${orderId}`,
    })

    return NextResponse.json({
      checkoutId: checkout.id,
      hostedCheckoutUrl: (checkout as any).hostedCheckoutUrl,
      status: checkout.status,
    })
  } catch (e: any) {
    console.error('SumUp checkout error:', e)
    return NextResponse.json(
      { error: e.message || 'Erreur lors de la création du paiement' },
      { status: 500 }
    )
  }
}