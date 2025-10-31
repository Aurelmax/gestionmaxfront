'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { userService } from '@/lib/user-service'
import { toast } from 'sonner'

export default function DiagnosticPage() {
  const [diagnostic, setDiagnostic] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runDiagnostic = async () => {
    setIsLoading(true)
    try {
      console.log('🔍 Démarrage du diagnostic...')

      // Test 1: Récupérer les utilisateurs
      const users = await userService.getUsers()
      console.log('👥 Utilisateurs trouvés:', users)

      // Test 2: Vérifier localStorage
      const storedUsers = localStorage.getItem('gestionmax_users')
      console.log('💾 localStorage:', storedUsers)

      // Test 3: Tentative de connexion
      let loginTest = null
      try {
        loginTest = await userService.login({
          email: 'aurelien@gestionmax.fr',
          password: 'nw*T/y@_yVjkS?Q',
        })
        console.log('✅ Test de connexion réussi:', loginTest)
      } catch (error) {
        console.log('❌ Test de connexion échoué:', error)
        loginTest = { error: error instanceof Error ? error.message : 'Erreur inconnue' }
      }

      setDiagnostic({
        users,
        userCount: users.length,
        localStorage: storedUsers ? JSON.parse(storedUsers) : null,
        loginTest,
        timestamp: new Date().toISOString(),
      })

      toast.success('Diagnostic terminé')
    } catch (error) {
      console.error('❌ Erreur lors du diagnostic:', error)
      setDiagnostic({ error: error instanceof Error ? error.message : 'Erreur inconnue' })
      toast.error('Erreur lors du diagnostic')
    } finally {
      setIsLoading(false)
    }
  }

  const clearLocalStorage = () => {
    localStorage.removeItem('gestionmax_users')
    localStorage.removeItem('auth_token')
    toast.success('localStorage vidé')
    setDiagnostic(null)
  }

  const forceSaveUsers = () => {
    // Forcer la sauvegarde des utilisateurs
    const users = [
      {
        id: '1',
        email: 'aurelien@gestionmax.fr',
        password: 'nw*T/y@_yVjkS?Q',
        name: 'Aurélien',
        firstName: 'Aurélien',
        lastName: 'GestionMax',
        role: 'admin',
        status: 'active',
      },
    ]
    localStorage.setItem('gestionmax_users', JSON.stringify(users))
    toast.success('Utilisateurs sauvegardés dans localStorage')
    setDiagnostic(null)
  }

  const directLogin = () => {
    // Connexion directe
    localStorage.setItem('auth_token', 'debug_token_admin')
    toast.success('Connexion directe réussie')
    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">🔧 Diagnostic du Système</h1>
          <p className="text-gray-600">
            Page de diagnostic non protégée pour résoudre les problèmes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={runDiagnostic} disabled={isLoading} className="h-20">
            {isLoading ? 'Diagnostic en cours...' : '🔍 Lancer le diagnostic'}
          </Button>

          <Button onClick={directLogin} className="h-20 bg-green-600 hover:bg-green-700">
            🚀 Connexion Directe
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={clearLocalStorage} variant="outline" className="h-20">
            🗑️ Vider localStorage
          </Button>

          <Button onClick={forceSaveUsers} variant="outline" className="h-20">
            💾 Forcer sauvegarde
          </Button>
        </div>

        {diagnostic && (
          <Card>
            <CardHeader>
              <CardTitle>Résultats du Diagnostic</CardTitle>
              <CardDescription>
                Timestamp: {new Date(diagnostic.timestamp).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Utilisateurs trouvés:</h3>
                  <p className="text-sm text-gray-600">{diagnostic.userCount} utilisateur(s)</p>
                  {diagnostic.users && diagnostic.users.length > 0 && (
                    <div className="mt-2">
                      {diagnostic.users.map((user: any, index: number) => (
                        <div key={index} className="text-sm bg-gray-100 p-2 rounded">
                          {user.email} ({user.role})
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold">localStorage:</h3>
                  <p className="text-sm text-gray-600">
                    {diagnostic.localStorage ? 'Données présentes' : 'Aucune donnée'}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Test de connexion:</h3>
                  {diagnostic.loginTest?.error ? (
                    <p className="text-sm text-red-600">❌ {diagnostic.loginTest.error}</p>
                  ) : (
                    <p className="text-sm text-green-600">✅ Connexion réussie</p>
                  )}
                </div>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer font-semibold">Détails techniques</summary>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto mt-2 max-h-96">
                  {JSON.stringify(diagnostic, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              1. <strong>Lancer le diagnostic</strong> pour vérifier l'état du système
            </p>
            <p>
              2. <strong>Connexion Directe</strong> pour accéder immédiatement à l'admin
            </p>
            <p>
              3. <strong>Vider localStorage</strong> si vous voulez repartir à zéro
            </p>
            <p>
              4. <strong>Forcer la sauvegarde</strong> pour recréer les utilisateurs
            </p>
            <p>5. Ouvrez la console (F12) pour voir les logs détaillés</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
