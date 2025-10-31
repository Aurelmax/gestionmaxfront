'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  Euro,
  Target,
  FileText,
  User,
  Phone,
  Mail,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Download,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export default function ProgrammeDetailPage() {
  const [programme, setProgramme] = useState<Record<string, unknown> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const programmeId = params['id'] as string

  useEffect(() => {
    if (programmeId) {
      loadProgramme()
    }
  }, [programmeId])

  const loadProgramme = async () => {
    try {
      const response = await fetch(`/api/programmes/${programmeId}`)
      const result = await response.json()

      if (result.success) {
        setProgramme(result.data)
      } else {
        toast.error('Erreur lors du chargement du programme')
        router.push('/dashboard/programmes')
      }
    } catch (error: unknown) {
      console.error('Erreur lors du chargement du programme:', error)
      toast.error('Erreur lors du chargement du programme')
      router.push('/dashboard/programmes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!programme) return

    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer le programme "${(programme['titre'] as string) || ''}" ?`
      )
    ) {
      return
    }

    try {
      const response = await fetch(`/api/programmes/${programmeId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la suppression')
      }

      toast.success('Programme supprimé avec succès !')
      router.push('/dashboard/programmes')
    } catch (error: unknown) {
      console.error('Erreur lors de la suppression:', error)
      toast.error((error as Error).message || 'Erreur lors de la suppression du programme')
    }
  }

  const handleDownloadPDF = async () => {
    if (!programme) return

    try {
      const response = await fetch(`/api/programmes/${programmeId}/pdf`, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du PDF')
      }

      // Créer un blob et télécharger le fichier
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `${(programme['titre'] as string).replace(/[^a-zA-Z0-9]/g, '_')}.html`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Document téléchargé avec succès !')
    } catch (error: unknown) {
      console.error('Erreur lors du téléchargement:', error)
      toast.error((error as Error).message || 'Erreur lors du téléchargement du document')
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement du programme...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!programme) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Programme non trouvé</h1>
          <p className="text-muted-foreground mb-4">
            Le programme demandé n'existe pas ou a été supprimé.
          </p>
          <Button onClick={() => router.push('/dashboard/programmes')}>Retour à la liste</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header avec actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/dashboard/programmes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{(programme['titre'] as string) || ''}</h1>
            <p className="text-muted-foreground">
              Code: {(programme['codeFormation'] as string) || ''}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/dashboard/programmes/${programmeId}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Link>
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-muted-foreground whitespace-pre-line">
                  {(programme['description'] as string) || ''}
                </p>
              </div>

              {(programme['objectifs'] as string) && (
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Objectifs pédagogiques
                  </h4>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {(programme['objectifs'] as string) || ''}
                  </p>
                </div>
              )}

              {(programme['prerequis'] as string) && (
                <div>
                  <h4 className="font-semibold mb-2">Prérequis</h4>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {(programme['prerequis'] as string) || ''}
                  </p>
                </div>
              )}

              {(programme['publicConcerne'] as string) && (
                <div>
                  <h4 className="font-semibold mb-2">Public concerné</h4>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {(programme['publicConcerne'] as string) || ''}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Compétences */}
          {Array.isArray(programme['competences']) &&
            (programme['competences'] as string[]).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Compétences développées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(programme['competences'] as string[]).map((competence, index) => (
                      <Badge key={`${competence}-${index}`} variant="secondary">
                        {competence}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Ressources */}
          {Array.isArray(programme['ressources']) &&
            (programme['ressources'] as string[]).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Ressources et matériel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(programme['ressources'] as string[]).map((ressource, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{ressource}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

          {/* Évaluation et certification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Évaluation et certification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(programme['modalitesEvaluation'] as string) && (
                <div>
                  <h4 className="font-semibold mb-2">Modalités d'évaluation</h4>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {(programme['modalitesEvaluation'] as string) || ''}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(programme['sanctionFormation'] as string) && (
                  <div>
                    <h4 className="font-semibold mb-2">Sanction de la formation</h4>
                    <p className="text-muted-foreground">
                      {(programme['sanctionFormation'] as string) || ''}
                    </p>
                  </div>
                )}

                {(programme['niveauCertification'] as string) && (
                  <div>
                    <h4 className="font-semibold mb-2">Niveau/Certification</h4>
                    <p className="text-muted-foreground">
                      {(programme['niveauCertification'] as string) || ''}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Accessibilité et conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Accessibilité et conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(programme['accessibiliteHandicap'] as string) && (
                <div>
                  <h4 className="font-semibold mb-2">Accessibilité handicap</h4>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {(programme['accessibiliteHandicap'] as string) || ''}
                  </p>
                </div>
              )}

              {(programme['cessationAbandon'] as string) && (
                <div>
                  <h4 className="font-semibold mb-2">Cessation anticipée/Abandon</h4>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {(programme['cessationAbandon'] as string) || ''}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Statut et caractéristiques */}
          <Card>
            <CardHeader>
              <CardTitle>Caractéristiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Statut</span>
                <Badge variant={programme['statut'] === 'PUBLIE' ? 'default' : 'secondary'}>
                  {(programme['statut'] as string) || ''}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Durée
                </span>
                <span className="font-semibold">{programme['duree'] as number}h</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Euro className="h-4 w-4" />
                  Prix
                </span>
                <span className="font-semibold">{formatCurrency(programme['prix'] as number)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Niveau</span>
                <Badge variant="outline">{(programme['niveau'] as string) || ''}</Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Modalités</span>
                <Badge variant="outline">{(programme['modalites'] as string) || ''}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Informations pratiques */}
          <Card>
            <CardHeader>
              <CardTitle>Informations pratiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(programme['horaires'] as string) && (
                <div>
                  <h4 className="font-semibold mb-1">Horaires</h4>
                  <p className="text-sm text-muted-foreground">
                    {(programme['horaires'] as string) || ''}
                  </p>
                </div>
              )}

              {(programme['delaisMiseEnPlace'] as string) && (
                <div>
                  <h4 className="font-semibold mb-1">Délais de mise en place</h4>
                  <p className="text-sm text-muted-foreground">
                    {(programme['delaisMiseEnPlace'] as string) || ''}
                  </p>
                </div>
              )}

              {(programme['modalitesReglement'] as string) && (
                <div>
                  <h4 className="font-semibold mb-1">Modalités de règlement</h4>
                  <p className="text-sm text-muted-foreground">
                    {(programme['modalitesReglement'] as string) || ''}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact formateur */}
          {(programme['formateurNom'] as string) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Contact formateur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold">{(programme['formateurNom'] as string) || ''}</h4>
                  {(programme['formateurRole'] as string) && (
                    <p className="text-sm text-muted-foreground">
                      {(programme['formateurRole'] as string) || ''}
                    </p>
                  )}
                </div>

                {(programme['formateurEmail'] as string) && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${(programme['formateurEmail'] as string) || ''}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {(programme['formateurEmail'] as string) || ''}
                    </a>
                  </div>
                )}

                {(programme['formateurTelephone'] as string) && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${(programme['formateurTelephone'] as string) || ''}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {(programme['formateurTelephone'] as string) || ''}
                    </a>
                  </div>
                )}

                {(programme['formateurBiographie'] as string) && (
                  <div>
                    <h4 className="font-semibold mb-1">Biographie</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {(programme['formateurBiographie'] as string) || ''}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
