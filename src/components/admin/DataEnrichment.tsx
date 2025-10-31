'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Database,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Play,
  Eye,
  Settings,
  Users,
  BookOpen,
  GraduationCap,
  FileText,
} from 'lucide-react'
import { toast } from 'sonner'

interface EnrichmentResult {
  collection: string
  status: 'success' | 'error' | 'warning'
  message: string
  count?: number
  duration?: number
}

interface EnrichmentStats {
  total: number
  successful: number
  errors: number
  warnings: number
}

export function DataEnrichment() {
  const [isEnriching, setIsEnriching] = useState(false)
  // const [isPreviewMode, setIsPreviewMode] = useState(false) // Removed: unused variable
  const [results, setResults] = useState<EnrichmentResult[]>([])
  const [stats, setStats] = useState<EnrichmentStats | null>(null)
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])

  const collections = [
    {
      id: 'programmes',
      name: 'Programmes',
      description: 'Enrichir les compétences, descriptions, objectifs et codes CPF',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      id: 'users',
      name: 'Utilisateurs',
      description: 'Ajouter les permissions et métadonnées selon les rôles',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      id: 'apprenants',
      name: 'Apprenants',
      description: 'Calculer la progression et enrichir les profils',
      icon: GraduationCap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      id: 'articles',
      name: 'Articles',
      description: 'Optimiser le SEO, meta descriptions et temps de lecture',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
  ]

  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollections(prev =>
      prev.includes(collectionId) ? prev.filter(id => id !== collectionId) : [...prev, collectionId]
    )
  }

  const handleEnrichment = async (preview = false) => {
    setIsEnriching(true)
    setResults([])
    setStats(null)

    try {
      const collectionsToEnrich =
        selectedCollections.length > 0 ? selectedCollections : collections.map(c => c.id)

      const promises = collectionsToEnrich.map(async collectionId => {
        const startTime = Date.now()

        try {
          const response = await fetch('/api/enrich-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              collection: collectionId,
              dryRun: preview,
              verbose: true,
            }),
          })

          const result = await response.json()
          const duration = Date.now() - startTime

          return {
            collection: collectionId,
            status: result.success ? ('success' as const) : ('error' as const),
            message: result.message || 'Enrichissement terminé',
            count: result.count as number | undefined,
            duration,
          }
        } catch (error) {
          const duration = Date.now() - startTime
          return {
            collection: collectionId,
            status: 'error' as const,
            message: `Erreur: ${error}`,
            count: undefined,
            duration,
          }
        }
      })

      const enrichmentResults = await Promise.all(promises)
      setResults(enrichmentResults)

      // Calculer les statistiques
      const newStats: EnrichmentStats = {
        total: enrichmentResults.length,
        successful: enrichmentResults.filter(r => r.status === 'success').length,
        errors: enrichmentResults.filter(r => r.status === 'error').length,
        warnings: 0, // No warnings currently returned by enrichment process
      }
      setStats(newStats)

      // Afficher un toast de succès
      if (preview) {
        toast.success("Aperçu de l'enrichissement généré")
      } else {
        toast.success(
          `Enrichissement terminé: ${newStats.successful}/${newStats.total} collections`
        )
      }
    } catch (error) {
      toast.error("Erreur lors de l'enrichissement des données")
      console.error('Erreur:', error)
    } finally {
      setIsEnriching(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      default:
        return <Database className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Enrichissement des Données</h1>
        <p className="text-muted-foreground">
          Améliorez et enrichissez automatiquement vos données Payload CMS
        </p>
      </div>

      {/* Statistiques */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Résultats de l'enrichissement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
                <div className="text-sm text-muted-foreground">Succès</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.warnings}</div>
                <div className="text-sm text-muted-foreground">Avertissements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
                <div className="text-sm text-muted-foreground">Erreurs</div>
              </div>
            </div>

            {stats.total > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progression</span>
                  <span>{Math.round((stats.successful / stats.total) * 100)}%</span>
                </div>
                <Progress value={(stats.successful / stats.total) * 100} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sélection des collections */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Collections à enrichir
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collections.map(collection => {
              const Icon = collection.icon
              const isSelected = selectedCollections.includes(collection.id)

              return (
                <div
                  key={collection.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected
                      ? `${collection.bgColor} ${collection.borderColor} border-2`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleCollectionToggle(collection.id)}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`h-6 w-6 ${collection.color} mt-1`} />
                    <div className="flex-1">
                      <h3 className="font-semibold">{collection.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{collection.description}</p>
                    </div>
                    <Badge variant={isSelected ? 'default' : 'outline'}>
                      {isSelected ? 'Sélectionné' : 'Non sélectionné'}
                    </Badge>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedCollections(collections.map(c => c.id))}
            >
              Tout sélectionner
            </Button>
            <Button variant="outline" onClick={() => setSelectedCollections([])}>
              Tout désélectionner
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions d'enrichissement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => handleEnrichment(true)}
              disabled={isEnriching}
              variant="outline"
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              {isEnriching ? 'Génération...' : 'Aperçu (Mode test)'}
            </Button>

            <Button
              onClick={() => handleEnrichment(false)}
              disabled={isEnriching}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              {isEnriching ? 'Enrichissement...' : 'Enrichir les données'}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-4">
            💡 <strong>Conseil :</strong> Utilisez d'abord l'aperçu pour voir ce qui sera modifié,
            puis lancez l'enrichissement réel.
          </p>
        </CardContent>
      </Card>

      {/* Résultats */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Résultats détaillés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {results.map((result, index) => {
                const collection = collections.find(c => c.id === result.collection)
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{collection?.name || result.collection}</h4>
                          {result.count && <Badge variant="outline">{result.count} éléments</Badge>}
                          {result.duration && <Badge variant="outline">{result.duration}ms</Badge>}
                        </div>
                        <p className="text-sm">{result.message}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
