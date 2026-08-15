import { prisma } from '@/lib/db'

export async function getDestinations() {
  return prisma.destination.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function getDestinationBySlug(slug: string) {
  return prisma.destination.findUnique({
    where: { slug },
  })
}

export async function getHealthcareFacilities({
  city,
  facilityType,
  specialty,
  limit = 20,
  offset = 0,
}: {
  city?: string
  facilityType?: string
  specialty?: string
  limit?: number
  offset?: number
}) {
  const where: any = { isVerified: true }

  if (city) where.city = city
  if (facilityType) where.facilityType = facilityType

  return prisma.healthcareFacility.findMany({
    where,
    include: {
      services: true,
      professionals: true,
    },
    take: limit,
    skip: offset,
    orderBy: { rating: 'desc' },
  })
}

export async function getProfessionals({
  specialty,
  city,
  limit = 20,
  offset = 0,
}: {
  specialty?: string
  city?: string
  limit?: number
  offset?: number
}) {
  const where: any = { isVerified: true }

  if (city && where.facility) {
    where.facility = { city }
  }

  return prisma.professionalProfile.findMany({
    where,
    include: {
      user: { select: { email: true, name: true, avatar: true } },
      facility: true,
      specialization: true,
    },
    take: limit,
    skip: offset,
  })
}
