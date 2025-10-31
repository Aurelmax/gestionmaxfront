'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Database, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export default function PayloadRealPage() {
  const [payloadStatus, setPayloadStatus] = useState<
    'checking' | 'running' | 'error' | 'not-running'
  >('checking')
  const [error, setError] = useState<string | null>(null)

  const checkPayloadStatus = useCallback(async () => {
    try {
      // Vérifier si Payload est accessible
      const response = await fetch('/api/payload/health')
      if (response.ok) {
        setPayloadStatus('running')
        setError(null)
      } else {
        setPayloadStatus('not-running')
        setError("Payload CMS n'est pas accessible")
      }
    } catch {
      setPayloadStatus('error')
      setError('Erreur de connexion à Payload CMS')
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const checkStatus = async () => {
      if (isMounted) {
        await checkPayloadStatus()
      }
    }

    checkStatus()

    return () => {
      isMounted = false
    }
  }, [checkPayloadStatus])

  const startPayload = async () => {
    try {
      // Essayer de démarrer Payload via l'API
      const response = await fetch('/api/payload/start', {
        method: 'POST',
      })

      if (response.ok) {
        setPayloadStatus('running')
        setError(null)
      } else {
        setError('Impossible de démarrer Payload CMS')
      }
    } catch {
      setError('Erreur lors du démarrage de Payload CMS')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Interface Payload CMS Réelle</h1>
        <p className="text-muted-foreground">Accès direct à l'interface Payload CMS</p>
      </div>

      {/* Statut de Payload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Statut de Payload CMS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payloadStatus === 'checking' && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Vérification du statut...</span>
              </div>
            )}

            {payloadStatus === 'running' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Payload CMS est en cours d'exécution et accessible.
                </AlertDescription>
              </Alert>
            )}

            {payloadStatus === 'not-running' && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>Payload CMS n'est pas en cours d'exécution.</AlertDescription>
              </Alert>
            )}

            {payloadStatus === 'error' && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>Erreur: {error}</AlertDescription>
              </Alert>
            )}

            {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

            <div className="flex gap-2">
              <Button onClick={checkPayloadStatus} variant="outline">
                Vérifier le statut
              </Button>
              {payloadStatus !== 'running' && (
                <Button onClick={startPayload}>Démarrer Payload CMS</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interface Payload */}
      {payloadStatus === 'running' ? (
        <Card>
          <CardHeader>
            <CardTitle>Interface Payload CMS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 border rounded-md">
              <iframe
                src="/admin"
                className="w-full h-full border-0"
                title="Payload CMS Interface"
                onError={() => setError("Erreur de chargement de l'interface Payload")}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Interface Payload CMS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 border rounded-md flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Payload CMS non disponible</h3>
                <p className="text-muted-foreground mb-4">
                  Payload CMS doit être démarré pour accéder à l'interface.
                </p>
                <Button onClick={startPayload}>Démarrer Payload CMS</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Problème identifié :</h4>
              <p className="text-muted-foreground">
                Payload CMS ne peut pas démarrer à cause d'un conflit entre Node.js 20 et la
                bibliothèque 'undici'.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Solutions possibles :</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Utiliser Node.js 18 au lieu de Node.js 20</li>
                <li>Mettre à jour les dépendances Payload</li>
                <li>Utiliser Docker avec Node.js 18</li>
                <li>Attendre une mise à jour de Payload CMS</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Solution temporaire :</h4>
              <p className="text-muted-foreground">
                Utilisez l'interface simulée dans <code>/admin/payload</code> pour gérer vos
                données.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
