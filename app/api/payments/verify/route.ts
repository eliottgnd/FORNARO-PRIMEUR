import { NextRequest, NextResponse } from 'next/server'
import { SumUp } from '@sumup/sdk'

const sumupClient = new SumUp({
  apiKey: process.env.SUMUP_API_KEY || '',
})

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const checkoutId = searchParams.get('checkout_id')

    if (!checkoutId) {
      return NextResponse.json({ error: 'Missing checkout_id' }, { status: 400 })
    }

    const checkout = await sumupClient.checkouts.get(checkoutId)

    return NextResponse.json({
      checkoutId: checkout.id,
      status: checkout.status,
      amount: checkout.amount,
      currency: checkout.currency,
    })
  } catch (e: any) {
    console.error('SumUp verify error:', e)
    return NextResponse.json({ error: e.message || 'Erreur' }, { status: 500 })
  }
}