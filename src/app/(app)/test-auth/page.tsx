'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login, getCurrentUser, checkEmailExists, fetchUsers } from '@/lib/api'
import { toast } from 'sonner'

export default function TestAuthPage() {
  const [email, setEmail] = useState('aurelien@gestionmax.fr')
  const [password, setPassword] = useState('')
  const [testEmail, setTestEmail] = useState('test@example.com')
  const [results, setResults] = useState<any>(null)

  const handleLogin = async () => {
    try {
      const response = await login({ email, password })
      console.log('✅ Connecté:', response)
      toast.success(`Connecté en tant que ${response.user.email}`)
      setResults(response)
    } catch (error: any) {
      console.error('❌ Erreur de connexion:', error)
      toast.error(error.message || 'Erreur de connexion')
    }
  }

  const handleGetCurrentUser = async () => {
    try {
      const user = await getCurrentUser()
      console.log('✅ Utilisateur courant:', user)
      toast.success(`Utilisateur: ${user.email}`)
      setResults(user)
    } catch (error: any) {
      console.error('❌ Erreur getCurrentUser:', error)
      toast.error(error.message || 'Non authentifié')
    }
  }

  const handleCheckEmail = async () => {
    try {
      const result = await checkEmailExists(testEmail)
      console.log('✅ Vérification email:', result)
      toast.success(
        result.exists
          ? `Email ${testEmail} existe`
          : result.needsAuth
            ? 'Authentification requise'
            : `Email ${testEmail} n'existe pas`
      )
      setResults(result)
    } catch (error: any) {
      console.error('❌ Erreur checkEmail:', error)
      toast.error(error.message)
    }
  }

  const handleFetchUsers = async () => {
    try {
      const response = await fetchUsers({ limit: 10 })
      console.log('✅ Utilisateurs:', response)
      toast.success(`${response.docs.length} utilisateurs chargés`)
      setResults(response)
    } catch (error: any) {
      console.error('❌ Erreur fetchUsers:', error)
      toast.error(error.message || 'Erreur lors du chargement')
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Test d'Authentification API</h1>

      <div className="grid gap-6">
        {/* Test Login */}
        <Card>
          <CardHeader>
            <CardTitle>1️⃣ Test Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Se connecter
            </Button>
          </CardContent>
        </Card>

        {/* Test getCurrentUser */}
        <Card>
          <CardHeader>
            <CardTitle>2️⃣ Test Utilisateur Courant</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGetCurrentUser} className="w-full">
              Récupérer l'utilisateur courant
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Vérifie que le cookie de session fonctionne
            </p>
          </CardContent>
        </Card>

        {/* Test checkEmailExists */}
        <Card>
          <CardHeader>
            <CardTitle>3️⃣ Test Vérification Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="testEmail">Email à vérifier</Label>
              <Input
                id="testEmail"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <Button onClick={handleCheckEmail} className="w-full">
              Vérifier l'email
            </Button>
          </CardContent>
        </Card>

        {/* Test fetchUsers */}
        <Card>
          <CardHeader>
            <CardTitle>4️⃣ Test Liste Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={handleFetchUsers} className="w-full">
              Charger les utilisateurs
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Nécessite d'être authentifié
            </p>
          </CardContent>
        </Card>

        {/* Résultats */}
        {results && (
          <Card className="bg-slate-50">
            <CardHeader>
              <CardTitle>📊 Résultats</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto p-4 bg-slate-900 text-green-400 rounded">
                {JSON.stringify(results, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>ℹ️ Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Backend requis:</strong> Le backend Payload CMS doit être démarré sur le port
              4200
            </p>
            <p>
              <strong>Ordre de test:</strong>
            </p>
            <ol className="list-decimal ml-6 space-y-1">
              <li>Se connecter avec vos identifiants</li>
              <li>Vérifier que getCurrentUser fonctionne (cookie OK)</li>
              <li>Tester checkEmailExists</li>
              <li>Tester fetchUsers</li>
            </ol>
            <p className="mt-4">
              <strong>Configuration:</strong> Toutes les requêtes utilisent{' '}
              <code className="bg-slate-200 px-1 rounded">credentials: 'include'</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
