import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateJourneyRecommendations(userInput: string) {
  try {
    const message = await client.messages.create({
      model: 'gpt-4',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Tu es un assistant IA spécialisé dans le tourisme médical en Algérie. Un utilisateur demande: "${userInput}"

Génère une réponse JSON structurée avec:
- objectives: array de domaines d'intérêt
- specialties: array de spécialités médicales pertinentes
- duration: durée recommandée en jours
- destinations: destinations algériennes recommandées
- description: description du parcours proposé

Réponse JSON uniquement, pas de texte avant ou après.`,
        },
      ],
    })

    const content = message.content[0]
    if (content.type === 'text') {
      return JSON.parse(content.text)
    }
  } catch (error) {
    console.error('AI Error:', error)
    // Return mock response as fallback
    return {
      objectives: ['consultation médicale', 'bien-être'],
      specialties: ['Médecine générale', 'Wellness'],
      duration: 7,
      destinations: ['Alger'],
      description: 'Parcours personnalisé de santé et bien-être',
    }
  }
}
