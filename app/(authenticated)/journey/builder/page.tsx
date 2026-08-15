'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Heart, Activity, Utensils, Leaf, Sparkles, Loader } from 'lucide-react'

const objectives = [
  { id: 'medical', icon: Heart, label: 'Soins Médicaux', color: 'text-red-500' },
  { id: 'fitness', icon: Activity, label: 'Remise en Forme', color: 'text-blue-500' },
  { id: 'nutrition', icon: Utensils, label: 'Nutrition', color: 'text-green-500' },
  { id: 'wellness', icon: Leaf, label: 'Bien-être', color: 'text-emerald-500' },
  { id: 'aesthetic', icon: Sparkles, label: 'Esthétique', color: 'text-pink-500' },
]

export default function JourneyBuilder() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    selectedObjectives: [] as string[],
    duration: '',
    description: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [journeyData, setJourneyData] = useState<any>(null)

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  const toggleObjective = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedObjectives: prev.selectedObjectives.includes(id)
        ? prev.selectedObjectives.filter(o => o !== id)
        : [...prev.selectedObjectives, id]
    }))
  }

  const handleSubmit = async () => {
    if (!formData.description.trim()) {
      alert('Veuillez décrire votre projet')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/journey/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: formData.description,
          userId: session?.user?.id,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setJourneyData(data)
        setStep(3)
      } else {
        alert('Erreur: ' + data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface-soft py-12">
      <div className="container-page max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Construisez votre parcours</h1>
          <p className="text-lg text-muted">Décrivez vos objectifs et nous créerons votre séjour idéal</p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between mb-8 px-4">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex flex-col items-center flex-1">
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? 'bg-primary text-white' : 'bg-surface border-2 border-border text-muted'
                }`}
                whileHover={{ scale: 1.05 }}
              >
                {s}
              </motion.div>
              <div className="text-sm mt-2 text-center text-muted">
                {s === 1 && 'Objectifs'}
                {s === 2 && 'Description'}
                {s === 3 && 'Recommandations'}
              </div>
            </div>
          ))}
        </div>

        {/* Step 1: Objectives */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Sélectionnez vos objectifs</CardTitle>
                <CardDescription>Choisissez les domaines qui vous intéressent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {objectives.map(obj => {
                    const Icon = obj.icon
                    const isSelected = formData.selectedObjectives.includes(obj.id)
                    return (
                      <motion.button
                        key={obj.id}
                        onClick={() => toggleObjective(obj.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        <Icon className={`w-8 h-8 mx-auto mb-2 ${obj.color}`} />
                        <div className="text-sm font-medium">{obj.label}</div>
                      </motion.button>
                    )
                  })}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => setStep(2)}
                  disabled={formData.selectedObjectives.length === 0}
                  className="w-full"
                >
                  Continuer
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Description */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Décrivez votre projet</CardTitle>
                <CardDescription>Expliquez en détail ce que vous souhaitez accomplir</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Durée souhaitée (en jours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="7"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: e.target.value })}
                    min="1"
                    max="30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Votre projet</Label>
                  <textarea
                    id="description"
                    placeholder="Ex: Je viens en Algérie pour 10 jours. Je souhaite faire un bilan général, des soins dentaires, améliorer ma condition physique et profiter de quelques jours de détente."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none min-h-32"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Retour
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 inline-flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader className="w-4 h-4 animate-spin" />}
                  {isLoading ? 'Génération en cours...' : 'Générer mon parcours'}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Recommendations */}
        {step === 3 && journeyData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Votre parcours personnalisé</CardTitle>
                <CardDescription>{journeyData.journey.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-surface-soft p-4 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{journeyData.journey.duration}</div>
                    <div className="text-sm text-muted">Jours</div>
                  </div>
                  <div className="bg-surface-soft p-4 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">{journeyData.journey.objectives.length}</div>
                    <div className="text-sm text-muted">Objectifs</div>
                  </div>
                  <div className="bg-surface-soft p-4 rounded-lg">
                    <div className="text-2xl font-bold text-accent">{journeyData.journey.specialties.length}</div>
                    <div className="text-sm text-muted">Spécialités</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Objectifs recommandés</h3>
                  <div className="flex flex-wrap gap-2">
                    {journeyData.journey.objectives.map((obj: string, i: number) => (
                      <span key={i} className="badge badge-primary">{obj}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Spécialités</h3>
                  <div className="flex flex-wrap gap-2">
                    {journeyData.journey.specialties.map((spec: string, i: number) => (
                      <span key={i} className="badge badge-secondary">{spec}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="w-full"
                >
                  Voir mon parcours complet
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
