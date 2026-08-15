'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Heart, Activity, Utensils, Leaf, Sparkles, MapPin, Calendar, Users } from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
}

export default function HomePage() {
  const [email, setEmail] = useState('')

  const objectives = [
    { icon: Heart, title: 'Soins Médicaux', description: 'Consultations avec spécialistes vérifiés' },
    { icon: Activity, title: 'Remise en Forme', description: 'Programmes fitness personnalisés' },
    { icon: Utensils, title: 'Nutrition', description: 'Plans nutritionnels adaptés' },
    { icon: Leaf, title: 'Bien-être', description: 'Séjours détente et récupération' },
    { icon: Sparkles, title: 'Esthétique', description: 'Services cosmétiques premium' },
    { icon: Leaf, title: 'Thermalisme', description: 'Cures thermales naturelles' },
  ]

  const destinations = [
    { name: 'Alger', region: 'Nord', specialists: 145, facilities: 28 },
    { name: 'Oran', region: 'Ouest', specialists: 89, facilities: 15 },
    { name: 'Constantine', region: 'Est', specialists: 67, facilities: 12 },
  ]

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
        <div className="container-page py-4 flex items-center justify-between">
          <div className="font-display text-2xl font-bold text-primary">AHW</div>
          <div className="hidden md:flex gap-8">
            <Link href="#objectifs" className="text-sm font-medium hover:text-primary transition">Objectifs</Link>
            <Link href="#destinations" className="text-sm font-medium hover:text-primary transition">Destinations</Link>
            <Link href="#comment" className="text-sm font-medium hover:text-primary transition">Comment ça marche</Link>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/signin" className="btn-ghost text-sm">Connexion</Link>
            <Link href="/auth/signup" className="btn-primary text-sm">S'inscrire</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
        
        <motion.div 
          className="container-page text-center relative z-10 max-w-3xl"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 text-primary"
            variants={fadeInUp}
          >
            Prenez soin de vous.<br />
            <span className="text-secondary">Découvrez l'Algérie autrement.</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-muted mb-8 leading-relaxed"
            variants={fadeInUp}
          >
            Une nouvelle façon de préparer votre séjour de santé, de bien-être et de remise en forme en Algérie. Construisez votre parcours personnalisé avec des professionnels vérifiés et des établissements premium.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
          >
            <Link href="/journey/builder" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
              Construire mon parcours
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#destinations" className="btn-outline text-lg px-8 py-4 inline-flex items-center justify-center gap-2">
              Explorer les destinations
              <MapPin className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-4 mt-16 pt-16 border-t border-border"
            variants={fadeInUp}
          >
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted">Professionnels vérifiés</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary">120+</div>
              <div className="text-sm text-muted">Établissements premium</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">15</div>
              <div className="text-sm text-muted">Destinations algériennes</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Objectifs Section */}
      <section id="objectifs" className="py-20 bg-surface-soft">
        <div className="container-page">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Que souhaitez-vous améliorer ?</h2>
            <p className="text-lg text-muted">Explorez nos domaines de spécialisation</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {objectives.map((obj, idx) => {
              const Icon = obj.icon
              return (
                <motion.div 
                  key={idx}
                  className="card p-8 hover:shadow-lg transition-shadow group cursor-pointer"
                  variants={fadeInUp}
                  whileHover={{ y: -4 }}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{obj.title}</h3>
                  <p className="text-muted">{obj.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Destinations Preview */}
      <section id="destinations" className="py-20">
        <div className="container-page">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Destinations Algérie</h2>
            <p className="text-lg text-muted">Découvrez nos principaux pôles de santé</p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {destinations.map((dest, idx) => (
              <motion.div 
                key={idx}
                className="card overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                variants={fadeInUp}
                whileHover={{ y: -4 }}
              >
                <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-primary/40" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-1">{dest.name}</h3>
                  <p className="text-sm text-muted mb-4">{dest.region}</p>
                  <div className="flex justify-between text-sm">
                    <div>
                      <div className="font-semibold text-primary">{dest.specialists}</div>
                      <div className="text-muted">Spécialistes</div>
                    </div>
                    <div>
                      <div className="font-semibold text-primary">{dest.facilities}</div>
                      <div className="text-muted">Établissements</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Link href="/destinations" className="btn-secondary px-8 py-3 inline-flex items-center gap-2">
              Voir toutes les destinations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container-page text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Prêt à commencer votre parcours ?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">Décrivez simplement vos objectifs et laissez notre intelligence artificielle construire votre séjour idéal.</p>
            <Link href="/auth/signup" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-lg hover:bg-surface-soft transition">
              S'inscrire maintenant
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-soft border-t border-border py-12">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-display text-xl font-bold text-primary mb-4">AHW</div>
              <p className="text-sm text-muted">Plateforme premium de tourisme de santé en Algérie</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Plateforme</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link href="#" className="hover:text-primary transition">À propos</Link></li>
                <li><Link href="#" className="hover:text-primary transition">Fonctionnalités</Link></li>
                <li><Link href="#" className="hover:text-primary transition">Tarification</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link href="#" className="hover:text-primary transition">Centre d'aide</Link></li>
                <li><Link href="#" className="hover:text-primary transition">Contact</Link></li>
                <li><Link href="#" className="hover:text-primary transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-muted">
                <li><Link href="#" className="hover:text-primary transition">Confidentialité</Link></li>
                <li><Link href="#" className="hover:text-primary transition">Conditions</Link></li>
                <li><Link href="#" className="hover:text-primary transition">RGPD</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted">
            <p>&copy; 2024 Algeria Health & Wellness. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
