'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, Lock, Mail, Shield, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { payloadUserService } from '@/lib/payload-user-service'

export const dynamic = 'force-dynamic'

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Validation des champs
      if (!formData.email || !formData.password) {
        setError('Veuillez remplir tous les champs')
        return
      }

      // Tentative de connexion
      const response = await payloadUserService.login({
        email: formData.email,
        password: formData.password,
      })

      if (response.user && response.token) {
        // Stocker le token
        localStorage.setItem('auth_token', response.token)

        toast.success('Connexion réussie !')

        // Rediriger vers le dashboard personnalisé
        router.push('/dashboard')
      } else {
        setError('Identifiants incorrects')
      }
    } catch (error) {
      console.error('Erreur de connexion:', error)
      setError(error instanceof Error ? error.message : 'Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Bouton retour */}
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au site
        </Button>
      </div>

      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">GestionMax</h1>
          <p className="text-gray-600 mt-2">Espace d'administration</p>
        </div>

        {/* Formulaire de connexion */}
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Connexion</CardTitle>
            <CardDescription className="text-center">
              Connectez-vous à votre espace d'administration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Message d'erreur */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Champ email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@gestionmax.fr"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Champ mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Bouton de connexion */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connexion...
                  </>
                ) : (
                  'Se connecter'
                )}
              </Button>

              {/* Lien mot de passe oublié */}
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => router.push('/dashboard/forgot-password')}
                  className="text-sm text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </Button>
              </div>

              {/* DÉVELOPPEMENT UNIQUEMENT - Ces éléments ne s'affichent qu'en local */}
              {process.env.NODE_ENV === 'development' && (
                <>
                  {/* Bouton de connexion rapide */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => {
                      setFormData({ email: 'aurelien@gestionmax.fr', password: 'nw*T/y@_yVjkS?Q' })
                      toast.success('Identifiants Aurélien remplis')
                    }}
                  >
                    👤 Remplir mes identifiants
                  </Button>

                  {/* Bouton de développement - Bypass login (temporaire) */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full mt-2 text-xs"
                    onClick={() => {
                      // Simuler un utilisateur admin connecté
                      localStorage.setItem('auth_token', 'dev_admin_token')
                      localStorage.setItem('user_email', 'admin@gestionmax.fr')
                      toast.success('Mode développement activé - Accès direct au dashboard')
                      router.push('/dashboard')
                    }}
                  >
                    🔧 Mode Dev (Bypass)
                  </Button>
                </>
              )}
            </form>

            {/* DÉVELOPPEMENT UNIQUEMENT - Informations utilisateur */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">
                  Authentification Payload CMS :
                </h3>
                <div className="text-xs text-blue-800 space-y-2">
                  <div>
                    <strong>Admin:</strong> admin@gestionmax.fr / AdminGestionMax2025!
                  </div>
                  <div className="mt-2 p-2 bg-blue-100 rounded">
                    <p className="font-semibold mb-1">🔒 Authentification unifiée</p>
                    <p>
                      L'authentification passe par Payload CMS. Une fois connecté, vous aurez accès à
                      la fois au dashboard React et à l'admin Payload.
                    </p>
                  </div>
                </div>
                <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                  <p className="text-xs text-green-800">
                    💡 <strong>Astuce:</strong> Cliquez sur "Se connecter via Payload CMS" pour une
                    auth sécurisée !
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>© 2024 GestionMax - Formation Pro</p>
          <p className="mt-1">Tous droits réservés</p>
        </div>
      </div>
    </div>
  )
}
