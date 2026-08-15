import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateJourneyRecommendations } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userInput, userId } = body

    if (!userInput || !userId) {
      return NextResponse.json(
        { message: 'userInput et userId requis' },
        { status: 400 }
      )
    }

    // Get AI recommendations
    const recommendations = await generateJourneyRecommendations(userInput)

    // Get patient profile
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId },
    })

    if (!patientProfile) {
      return NextResponse.json(
        { message: 'Profil patient non trouvé' },
        { status: 404 }
      )
    }

    // Create journey
    const journey = await prisma.journey.create({
      data: {
        patientProfileId: patientProfile.id,
        title: recommendations.description || 'Mon parcours santé',
        description: userInput,
        status: 'DRAFT',
        objectives: recommendations.objectives || [],
        specialties: recommendations.specialties || [],
        duration: recommendations.duration || 7,
        estimatedBudget: 0,
        aiRecommendations: JSON.stringify(recommendations),
      },
    })

    return NextResponse.json(
      {
        journey: {
          id: journey.id,
          title: journey.title,
          objectives: journey.objectives,
          specialties: journey.specialties,
          duration: journey.duration,
        },
        recommendations,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Journey creation error:', error)
    return NextResponse.json(
      { message: 'Erreur lors de la création du parcours' },
      { status: 500 }
    )
  }
}
