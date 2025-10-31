'use client'
/* eslint-disable */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Shield, LogOut } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: string
  requiredPermission?: string
}

export function AuthGuard({ children, requiredRole, requiredPermission }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  // Mode debug temporaire - bypasser l'authentification
  const isDebugMode =
    typeof window !== 'undefined' &&
    (localStorage.getItem('debug_mode') === 'true' || window.location.search.includes('debug=true'))

  useEffect(() => {
    if (!isLoading) {
      setIsChecking(false)

      // En mode debug, bypasser l'authentification
      if (isDebugMode) {
        return
      }

      if (!isAuthenticated || !user) {
        router.push('/dashboard/login')
        return
      }

      // Vérifier le rôle requis
      if (requiredRole && user.role !== requiredRole) {
        router.push('/dashboard/login?error=insufficient_permissions')
        return
      }

      // Vérifier la permission requise
      if (requiredPermission && !user.permissions?.includes(requiredPermission as any)) {
        router.push('/dashboard/login?error=insufficient_permissions')
        return
      }
    }
  }, [isAuthenticated, user, isLoading, requiredRole, requiredPermission, router])

  // Affichage de chargement
  if (isLoading || isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold mb-2">Vérification de l'authentification</h2>
            <p className="text-gray-600">Veuillez patienter...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // En mode debug, autoriser l'accès
  if (isDebugMode) {
    return <>{children}</>
  }

  // Utilisateur non authentifié
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Accès non autorisé</h2>
            <p className="text-gray-600 mb-4">
              Vous devez être connecté pour accéder à cette page.
            </p>
            <div className="space-y-2">
              <Button
                onClick={() => {
                  console.log('Redirection vers /dashboard/login')
                  window.location.href = '/dashboard/login'
                }}
                className="w-full"
              >
                Se connecter
              </Button>
              {process.env.NODE_ENV === 'development' && (
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.setItem('debug_mode', 'true')
                    window.location.reload()
                  }}
                  className="w-full"
                >
                  🔧 Mode Debug (Temporaire)
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Permissions insuffisantes
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Permissions insuffisantes</h2>
            <p className="text-gray-600 mb-4">
              Votre rôle ({user.role}) ne vous permet pas d'accéder à cette page.
              <br />
              Rôle requis : {requiredRole}
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Retour au dashboard
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Se déconnecter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Permission spécifique requise
  if (requiredPermission && !user.permissions?.includes(requiredPermission as any)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Permission requise</h2>
            <p className="text-gray-600 mb-4">
              Vous n'avez pas la permission nécessaire pour accéder à cette page.
              <br />
              Permission requise : {requiredPermission}
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => router.push('/dashboard')}>
                Retour au dashboard
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Se déconnecter
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Utilisateur authentifié avec les bonnes permissions
  return <>{children}</>
}
