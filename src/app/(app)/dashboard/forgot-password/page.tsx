'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export const dynamic = 'force-dynamic'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Validation de l'email
      if (!email) {
        setError('Veuillez entrer votre adresse email')
        return
      }

      // Appel à l'API Payload CMS pour la réinitialisation
      const response = await fetch('/dashboard/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erreur lors de la demande de réinitialisation')
      }

      setIsSuccess(true)
      toast.success('Email de réinitialisation envoyé !')
    } catch (error) {
      console.error('Erreur de réinitialisation:', error)
      setError(error instanceof Error ? error.message : 'Erreur lors de la demande')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        {/* Bouton retour */}
        <div className="absolute top-4 left-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/login')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la connexion
          </Button>
        </div>

        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 rounded-full p-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl">Email envoyé !</CardTitle>
              <CardDescription>Vérifiez votre boîte de réception</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription className="text-green-800">
                  Un email contenant les instructions de réinitialisation a été envoyé à{' '}
                  <strong>{email}</strong>.
                </AlertDescription>
              </Alert>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Que faire ensuite ?</strong>
                </p>
                <ol className="text-sm text-blue-800 mt-2 space-y-1 list-decimal list-inside">
                  <li>Consultez votre boîte de réception</li>
                  <li>Ouvrez l'email de GestionMax Formation</li>
                  <li>Cliquez sur le lien de réinitialisation</li>
                  <li>Créez votre nouveau mot de passe</li>
                </ol>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-600 text-center">Vous n'avez pas reçu l'email ?</p>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsSuccess(false)
                      setEmail('')
                    }}
                  >
                    Renvoyer
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.push('/dashboard/login')}
                  >
                    Retour
                  </Button>
                </div>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                Le lien expire dans 1 heure pour des raisons de sécurité
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Bouton retour */}
      <div className="absolute top-4 left-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/login')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la connexion
        </Button>
      </div>

      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Mot de passe oublié ?</CardTitle>
            <CardDescription className="text-center">
              Entrez votre adresse email pour recevoir un lien de réinitialisation
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
                <Label htmlFor="email">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre.email@exemple.fr"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value)
                      if (error) setError('')
                    }}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Bouton de soumission */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Envoi en cours...
                  </>
                ) : (
                  'Envoyer le lien de réinitialisation'
                )}
              </Button>
            </form>

            {/* Informations */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-900">
                <strong>Informations importantes :</strong>
              </p>
              <ul className="text-xs text-blue-800 mt-2 space-y-1">
                <li>• Le lien de réinitialisation expirera dans 1 heure</li>
                <li>• Vérifiez vos spams si vous ne recevez pas l'email</li>
                <li>• Le lien ne peut être utilisé qu'une seule fois</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
