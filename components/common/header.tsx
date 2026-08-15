'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, LogOut, User, MapPin } from 'lucide-react'

export function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-border">
      <div className="container-page py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl font-bold text-primary">AHW</Link>

        <nav className="hidden md:flex gap-8">
          <Link href="/destinations" className="text-sm font-medium hover:text-primary transition">Destinations</Link>
          <Link href="/professionals" className="text-sm font-medium hover:text-primary transition">Professionnels</Link>
          <Link href="/journey/builder" className="text-sm font-medium hover:text-primary transition">Mon Parcours</Link>
        </nav>

        <div className="flex gap-3 items-center">
          {status === 'loading' ? (
            <div className="animate-pulse w-10 h-10 bg-surface rounded" />
          ) : status === 'authenticated' ? (
            <>
              <Link href="/dashboard" className="btn-ghost text-sm">
                <User className="w-4 h-4 mr-2" />
                Profil
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="btn-ghost text-sm">Connexion</Link>
              <Link href="/auth/signup" className="btn-primary text-sm">S'inscrire</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
