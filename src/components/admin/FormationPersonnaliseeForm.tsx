'use client'
/* eslint-disable */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Save, X } from 'lucide-react'
import { toast } from 'sonner'

// Import des composants refactorisés
import { FormationBasicInfo } from './forms/FormationBasicInfo'
import { FormationAccessModalities } from './forms/FormationAccessModalities'
import { FormationTrainerInfo } from './forms/FormationTrainerInfo'
import { FormationEvaluation } from './forms/FormationEvaluation'
import { FormationAbandonConditions } from './forms/FormationAbandonConditions'
import {
  FormationPersonnaliseeFormProps,
  FormationPersonnaliseeFormData,
  FormationPersonnalisee,
} from '@/types/payload'

export function FormationPersonnaliseeForm({
  formation,
  onSave,
  onCancel,
  isLoading = false,
  rdvData,
}: FormationPersonnaliseeFormProps): JSX.Element {
  const [formData, setFormData] = useState<FormationPersonnaliseeFormData>({
    title:
      (formation as FormationPersonnalisee)?.title ||
      (rdvData
        ? `${rdvData.programmeTitre || ''} - ${rdvData.client.prenom} ${rdvData.client.nom}`
        : ''),
    codeFormation:
      (formation as FormationPersonnalisee)?.codeFormation ||
      (rdvData
        ? `A${Date.now().toString().slice(-6)}-${rdvData.client.nom.toUpperCase()}`
        : ''),
    statut: (formation as FormationPersonnalisee)?.statut || 'EN_COURS',
    objectifs: (formation as FormationPersonnalisee)?.objectifs || {
      root: { type: 'root', children: [] },
    },
    programmeDetail: (formation as FormationPersonnalisee)?.programmeDetail || [
      {
        jour: 'Jour 1',
        duree: '7 heures',
        modules: [
          {
            titre: 'Introduction',
            description: 'Présentation et objectifs',
            duree: '1h',
            contenu: { root: { type: 'root', children: [] } },
          },
        ],
      },
    ],
    modalitesAcces: (formation as FormationPersonnalisee)?.modalitesAcces || {
      prerequis: '',
      publicConcerne: '',
      duree: '',
      horaires: '',
      delaisMiseEnPlace: '',
      tarif: 0,
      modalitesReglement: '',
    },
    contactFormateur: (formation as FormationPersonnalisee)?.contactFormateur || {
      nom: '',
      email: '',
      telephone: '',
      role: '',
      biographie: '',
    },
    modalitesPedagogiques: (formation as FormationPersonnalisee)?.modalitesPedagogiques || {
      root: { type: 'root', children: [] },
    },
    ressourcesDispo: (formation as FormationPersonnalisee)?.ressourcesDispo || [],
    modalitesEvaluation: (formation as FormationPersonnalisee)?.modalitesEvaluation || {
      typesEvaluation: [],
      plateformeEvaluation: '',
      grilleAnalyse: '',
    },
    sanctionFormation: (formation as FormationPersonnalisee)?.sanctionFormation || '',
    niveauCertification: (formation as FormationPersonnalisee)?.niveauCertification || '',
    accessibiliteHandicap: (formation as FormationPersonnalisee)?.accessibiliteHandicap || {
      referentHandicap: '',
      contactReferent: '',
      adaptationsProposees: '',
    },
    cessationAbandon: (formation as FormationPersonnalisee)?.cessationAbandon || {
      conditionsRenonciation: '',
      facturationAbandon: '',
    },
  })

  const handleInputChange = (field: string, value: unknown): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNestedInputChange = (parent: string, field: string, value: unknown): void => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...((prev[parent as keyof FormationPersonnaliseeFormData] as Record<string, unknown>) ||
          {}),
        [field]: value,
      },
    }))
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()

    // Validation basique
    if (!formData.title.trim()) {
      toast.error('Le nom du programme est requis')
      return
    }

    if (!formData.codeFormation.trim()) {
      toast.error('Le code formation est requis')
      return
    }

    onSave(formData)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête avec informations RDV si disponibles */}
      {rdvData && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Informations du RDV de positionnement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                <strong>Client :</strong>{' '}
                {(rdvData['client'] as Record<string, unknown>)?.['prenom'] as string}{' '}
                {(rdvData['client'] as Record<string, unknown>)?.['nom'] as string}
              </p>
              <p>
                <strong>Email :</strong>{' '}
                {(rdvData['client'] as Record<string, unknown>)?.['email'] as string}
              </p>
              <p>
                <strong>Programme d&apos;intérêt :</strong> {rdvData['programmeTitre'] as string}
              </p>
              <p>
                <strong>Date du RDV :</strong>{' '}
                {new Date(rdvData['date'] as string).toLocaleDateString('fr-FR')} à{' '}
                {rdvData['heure'] as string}
              </p>
              {rdvData['notes'] ? (
                <p>
                  <strong>Notes :</strong> {String(rdvData['notes'])}
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <FormationBasicInfo formData={formData} onInputChange={handleInputChange} />

        <Separator />

        {/* Modalités d'accès */}
        <FormationAccessModalities
          formData={formData}
          onNestedInputChange={handleNestedInputChange}
        />

        <Separator />

        {/* Informations formateur */}
        <FormationTrainerInfo formData={formData} onNestedInputChange={handleNestedInputChange} />

        <Separator />

        {/* Évaluation */}
        <FormationEvaluation formData={formData} onNestedInputChange={handleNestedInputChange} />

        <Separator />

        {/* Conditions d'abandon */}
        <FormationAbandonConditions
          formData={formData}
          onNestedInputChange={handleNestedInputChange}
        />

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </div>
  )
}
