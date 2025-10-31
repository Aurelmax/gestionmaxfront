'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOut, CheckCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Effectuer la déconnexion immédiatement
    const performLogout = () => {
      console.log('🚪 Déconnexion forcée...')

      // Supprimer tous les tokens et données d'authentification
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('debug_mode')
      localStorage.removeItem('gestionmax_users')

      console.log('✅ Toutes les données supprimées')

      // Rediriger vers la page de login après un court délai
      setTimeout(() => {
        router.push('/dashboard/login')
        router.refresh()
      }, 2000)
    }

    performLogout()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">Déconnexion réussie</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">Vous avez été déconnecté avec succès.</p>
          <p className="text-sm text-gray-500">Redirection vers la page de connexion...</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
          <Button onClick={() => router.push('/dashboard/login')} className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            Aller à la page de connexion
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
