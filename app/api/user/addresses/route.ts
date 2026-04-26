import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/auth/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  // Admin account cannot create addresses
  if (session.user.id === 'admin') {
    return NextResponse.json({ error: 'Les administrateurs ne peuvent pas créer d\'adresses de livraison' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { label, street, city, zipCode, isDefault } = body

    // If this is default, unset others
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        label,
        street,
        city,
        zipCode,
        isDefault: isDefault || false,
      },
    })

    return NextResponse.json(address)
  } catch (e: any) {
    console.error("CREATE_ADDRESS_ERROR:", e)
    return NextResponse.json({ error: e.message || 'Erreur serveur' }, { status: 500 })
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: { isDefault: 'desc' },
    })
    return NextResponse.json(addresses)
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
