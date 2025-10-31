'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Eye, Edit, Trash2, FileText, Download } from 'lucide-react'
import { toast } from 'sonner'
import { FormationPersonnalisee } from '@/types/payload'

export default function FormationProgrammesPage() {
  const [programmes, setProgrammes] = useState<FormationPersonnalisee[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProgrammes = async () => {
      try {
        const response = await fetch('/api/formation-programmes')
        const data = await response.json()
        if (data.success) {
          setProgrammes(data.data)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des programmes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProgrammes()
  }, [])

  const handleDelete = async (programmeId: string, programmeTitre: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la formation "${programmeTitre}" ?`)) {
      return
    }

    try {
      const response = await fetch(`/api/formation-programmes/${programmeId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la suppression')
      }

      toast.success('Formation supprimée avec succès !')
      // Recharger la liste
      const response2 = await fetch('/api/formation-programmes')
      const data = await response2.json()
      if (data.success) {
        setProgrammes(data.data)
      }
    } catch (error: unknown) {
      console.error('Erreur lors de la suppression:', error)
      toast.error((error as Error).message || 'Erreur lors de la suppression de la formation')
    }
  }

  const handleDownloadPDF = async (programmeId: string, programmeTitre: string) => {
    try {
      const response = await fetch(`/api/formation-programmes/${programmeId}/pdf`, {
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
      a.download = `${programmeTitre.replace(/[^a-zA-Z0-9]/g, '_')}.html`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('PDF téléchargé avec succès !')
    } catch (error: unknown) {
      console.error('Erreur lors du téléchargement du PDF:', error)
      toast.error((error as Error).message || 'Erreur lors du téléchargement du PDF')
    }
  }

  const getStatutBadge = (statut: string) => {
    const variants = {
      EN_COURS: 'secondary',
      FINALISEE: 'default',
      LIVREE: 'outline',
      ARCHIVE: 'destructive',
    } as const

    const labels = {
      EN_COURS: 'En cours',
      FINALISEE: 'Finalisée',
      LIVREE: 'Livrée',
      ARCHIVE: 'Archivée',
    }

    return (
      <Badge variant={variants[statut as keyof typeof variants] || 'secondary'}>
        {labels[statut as keyof typeof labels] || statut}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Formations Personnalisées</h1>
          <p className="text-muted-foreground">
            Gestion des programmes de formation personnalisés créés après entretien de
            positionnement
          </p>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des programmes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Formations Personnalisées</h1>
          <p className="text-muted-foreground">
            Gestion des programmes de formation personnalisés créés après entretien de
            positionnement
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/formation-programmes/nouveau">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle formation
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programmes.map(programme => (
          <Card key={programme.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{programme.titre}</CardTitle>
                {getStatutBadge(programme.statut)}
              </div>
              <div className="text-sm text-muted-foreground">Code: {programme.codeFormation}</div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Durée:</span>
                  <span className="font-medium">{programme.duree || 'Non définie'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tarif:</span>
                  <span className="font-medium">
                    {programme.prix ? `${programme.prix}€` : 'Non défini'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Niveau:</span>
                  <span className="font-medium">{programme.niveau || 'Non défini'}</span>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {programme.description || 'Aucune description disponible'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/formation-programmes/${programme.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/formation-programmes/${programme.id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(programme.id, programme.titre || programme.title)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Supprimer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    onClick={() =>
                      handleDownloadPDF(programme.id, programme.titre || programme.title)
                    }
                  >
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {programmes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun programme de formation</h3>
            <p className="text-muted-foreground text-center mb-4">
              Commencez par créer votre premier programme de formation réglementaire.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Créer un programme
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
