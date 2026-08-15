import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const destinations = await prisma.destination.findMany({
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(destinations)
  } catch (error) {
    console.error('Destinations error:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des destinations' },
      { status: 500 }
    )
  }
}
