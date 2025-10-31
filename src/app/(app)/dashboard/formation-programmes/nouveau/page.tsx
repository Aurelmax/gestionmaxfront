'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormationPersonnaliseeForm } from '@/components/admin/FormationPersonnaliseeForm'
import { toast } from 'sonner'
import { RendezVous } from '@/types/rendez-vous'
import { safeDate } from '@/lib/utils/date'

export default function NouvelleFormationPersonnaliseePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [rdvData, setRdvData] = useState<RendezVous | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const rdvId = searchParams.get('rdvId')

  const loadRdvData = useCallback(async () => {
    try {
      const response = await fetch(`/api/rendez-vous/${rdvId}`)
      const result = await response.json()

      if (result.success) {
        setRdvData(result.data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement du RDV:', error)
    }
  }, [rdvId])

  useEffect(() => {
    if (rdvId) {
      loadRdvData()
    }
  }, [rdvId, loadRdvData])

  const handleSave = async (formationData: Record<string, unknown>) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/formation-programmes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formationData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la création de la formation')
      }

      toast.success('Formation personnalisée créée avec succès !')
      router.push('/dashboard/formation-programmes')
    } catch (error: unknown) {
      console.error('Erreur lors de la création de la formation:', error)
      toast.error((error as Error).message || 'Erreur lors de la création de la formation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/formation-programmes')
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {rdvData
            ? 'Formation personnalisée basée sur le RDV'
            : 'Nouvelle formation personnalisée'}
        </h1>
        <p className="text-muted-foreground">
          {rdvData
            ? `Création d'une formation personnalisée pour ${rdvData.client.prenom} ${rdvData.client.nom} basée sur le RDV de positionnement du ${safeDate(rdvData.date).toLocaleDateString('fr-FR')}`
            : 'Créez une nouvelle formation personnalisée avec structure réglementaire complète'}
        </p>
        {rdvData && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900">Informations du RDV de positionnement :</h3>
            <div className="mt-2 text-sm text-blue-800">
              <p>
                <strong>Client :</strong> {rdvData.client.prenom} {rdvData.client.nom}
              </p>
              <p>
                <strong>Email :</strong> {rdvData.client.email}
              </p>
              <p>
                <strong>Programme d'intérêt :</strong> {rdvData.programmeTitre}
              </p>
              <p>
                <strong>Date du RDV :</strong> {safeDate(rdvData.date).toLocaleDateString('fr-FR')}{' '}
                à {rdvData.heure}
              </p>
              {rdvData.notes && (
                <p>
                  <strong>Notes :</strong> {rdvData.notes}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <FormationPersonnaliseeForm
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={isLoading}
        rdvData={rdvData ?? undefined}
      />
    </div>
  )
}
