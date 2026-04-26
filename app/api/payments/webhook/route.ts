import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/auth/prisma'
import { SumUp } from '@sumup/sdk'

const sumupClient = new SumUp({
  apiKey: process.env.SUMUP_API_KEY || '',
})

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    // const signature = req.headers.get('x-sumup-signature')
    // TODO: Verify webhook signature if SUMUP_WEBHOOK_SECRET is configured

    const event = JSON.parse(rawBody)

    // Handle different event types
    switch (event.type) {
      case 'checkout.completed':
        // Payment successful - update order status and decrement stock
        const completedCheckoutId = event.data?.id || event.data?.checkout_reference
        let order = await prisma.order.findFirst({
          where: {
            OR: [
              { paymentId: completedCheckoutId },
              { id: event.data?.checkout_reference },
            ],
          },
          include: { items: true },
        })

        if (order && order.paymentStatus !== 'paye') {
          // Decrement stock for each item
          for (const item of order.items) {
            await prisma.product.update({
              where: { id: item.productId },
              data: { stockQuantity: { decrement: item.quantity } },
            })
          }
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: 'paye',
              status: 'confirme',
            },
          })
        }
        break

      case 'checkout.failed':
        // Payment failed
        const failedCheckoutId = event.data?.id || event.data?.checkout_reference
        if (failedCheckoutId) {
          const failedOrder = await prisma.order.findFirst({
            where: {
              OR: [
                { paymentId: failedCheckoutId },
                { id: event.data?.checkout_reference },
              ],
            },
          })
          if (failedOrder) {
            await prisma.order.update({
              where: { id: failedOrder.id },
              data: {
                paymentStatus: 'echec',
              },
            })
          }
        }
        break

      default:
        console.log('Unhandled SumUp webhook event:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (e: any) {
    console.error('SumUp webhook error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  // Handle SumUp return_url callback (GET request with checkout_id)
  try {
    const { searchParams } = new URL(req.url)
    const checkoutId = searchParams.get('checkout_id')

    if (!checkoutId) {
      return NextResponse.json({ error: 'Missing checkout_id' }, { status: 400 })
    }

    // Find order by paymentId (SumUp checkout ID)
    const order = await prisma.order.findFirst({
      where: { paymentId: checkoutId },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Verify the checkout status with SumUp
    try {
      const checkout = await sumupClient.checkouts.get(checkoutId)

      if (checkout.status === 'PAID') {
        // Payment confirmed - update order if not already paid
        if (order.paymentStatus !== 'paye') {
          // Decrement stock
          for (const item of order.items) {
            await prisma.product.update({
              where: { id: item.productId },
              data: { stockQuantity: { decrement: item.quantity } },
            })
          }
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: 'paye',
              status: 'confirme',
            },
          })
        }
        return NextResponse.json({ status: 'success', orderId: order.id })
      } else if (checkout.status === 'FAILED') {
        await prisma.order.update({
          where: { id: order.id },
          data: { paymentStatus: 'echec' },
        })
        return NextResponse.json({ status: 'failed', orderId: order.id })
      } else {
        return NextResponse.json({ status: checkout.status, orderId: order.id })
      }
    } catch (e: any) {
      console.error('SumUp checkout lookup error:', e)
      // Return current order status even if we can't verify with SumUp
      return NextResponse.json({
        status: order.paymentStatus,
        orderId: order.id,
      })
    }
  } catch (e: any) {
    console.error('SumUp return_url error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}