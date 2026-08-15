import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const city = searchParams.get('city')
    const facilityType = searchParams.get('type')
    const specialty = searchParams.get('specialty')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = { isVerified: true }

    if (city) where.city = city
    if (facilityType) where.facilityType = facilityType

    const facilities = await prisma.healthcareFacility.findMany({
      where,
      include: {
        services: true,
        professionals: {
          include: {
            user: { select: { name: true, avatar: true } },
          },
        },
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { rating: 'desc' },
    })

    const total = await prisma.healthcareFacility.count({ where })

    return NextResponse.json({
      data: facilities,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Facilities error:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des établissements' },
      { status: 500 }
    )
  }
}
