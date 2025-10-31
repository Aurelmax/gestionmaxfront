'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lock, Eye, EyeOff, CheckCircle2, Shield } from 'lucide-react'
import { toast } from 'sonner'

export const dynamic = 'force-dynamic'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) {
      setError('Token de réinitialisation manquant ou invalide')
    }
  }, [token])

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caractères'
    }
    if (!/[A-Z]/.test(password)) {
      return 'Le mot de passe doit contenir au moins une majuscule'
    }
    if (!/[a-z]/.test(password)) {
      return 'Le mot de passe doit contenir au moins une minuscule'
    }
    if (!/[0-9]/.test(password)) {
      return 'Le mot de passe doit contenir au moins un chiffre'
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Le mot de passe doit contenir au moins un caractère spécial'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Validation
      if (!formData.password || !formData.confirmPassword) {
        setError('Veuillez remplir tous les champs')
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas')
        return
      }

      const passwordError = validatePassword(formData.password)
      if (passwordError) {
        setError(passwordError)
        return
      }

      if (!token) {
        setError('Token de réinitialisation manquant')
        return
      }

      // Appel à l'API Payload CMS pour réinitialiser le mot de passe
      const response = await fetch('/dashboard/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors de la réinitialisation')
      }

      setIsSuccess(true)
      toast.success('Mot de passe réinitialisé avec succès !')

      // Redirection après 3 secondes
      setTimeout(() => {
        router.push('/dashboard/login')
      }, 3000)
    } catch (error) {
      console.error('Erreur de réinitialisation:', error)
      setError(error instanceof Error ? error.message : 'Erreur lors de la réinitialisation')
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
    if (error) setError('')
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Mot de passe réinitialisé !</CardTitle>
              <CardDescription>Votre mot de passe a été mis à jour avec succès</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                </AlertDescription>
              </Alert>

              <div className="mt-6">
                <Button className="w-full" onClick={() => router.push('/dashboard/login')}>
                  Se connecter
                </Button>
              </div>

              <p className="text-sm text-gray-600 text-center mt-4">
                Redirection automatique dans 3 secondes...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">GestionMax</h1>
          <p className="text-gray-600 mt-2">Réinitialisation du mot de passe</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Nouveau mot de passe</CardTitle>
            <CardDescription className="text-center">
              Choisissez un mot de passe sécurisé pour votre compte
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

              {/* Champ nouveau mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
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

              {/* Champ confirmation mot de passe */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Exigences du mot de passe */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-2">
                  Exigences du mot de passe :
                </p>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                    • Au moins 8 caractères
                  </li>
                  <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                    • Au moins une lettre majuscule
                  </li>
                  <li className={/[a-z]/.test(formData.password) ? 'text-green-600' : ''}>
                    • Au moins une lettre minuscule
                  </li>
                  <li className={/[0-9]/.test(formData.password) ? 'text-green-600' : ''}>
                    • Au moins un chiffre
                  </li>
                  <li
                    className={
                      /[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'text-green-600' : ''
                    }
                  >
                    • Au moins un caractère spécial (!@#$%^&*...)
                  </li>
                </ul>
              </div>

              {/* Bouton de soumission */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Réinitialisation...
                  </>
                ) : (
                  'Réinitialiser le mot de passe'
                )}
              </Button>

              {/* Lien retour */}
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  onClick={() => router.push('/dashboard/login')}
                  className="text-sm"
                >
                  Retour à la connexion
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ResetPasswordForm />
    </Suspense>
  )
}
