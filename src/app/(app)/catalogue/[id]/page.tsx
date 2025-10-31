'use client'

import { use, useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { PublicLayout } from '@/components/layouts/public/PublicLayout'
import { ProgrammeModalWrapper } from '@/components/ui/programme-modal-wrapper'

interface ProgrammePageProps {
  params: Promise<{
    id: string
  }>
}

interface ProgrammeData {
  id: string
  titre: string
  description: string
  duree: number
  niveau: string
  modalites: string
  prix: number
  competences: string[]
}

export default function ProgrammePage({ params }: ProgrammePageProps) {
  const { id } = use(params)
  const [programme, setProgramme] = useState<ProgrammeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProgramme = async () => {
      try {
        const response = await fetch(`/api/programmes/${id}`)
        const result = await response.json()
        if (result.success) {
          // Transformer les données MongoDB pour correspondre à l'interface attendue
          const transformedProgramme = {
            id: result.data._id,
            codeFormation: result.data.codeFormation,
            titre: result.data.titre,
            description: result.data.description,
            duree: result.data.duree,
            niveau: result.data.niveau,
            modalites: result.data.modalites,
            prix: result.data.prix,
            competences: ((result.data.competences as unknown[]) || [])
              .map((comp: unknown) =>
                typeof comp === 'string' ? comp : (comp as { competence: string }).competence
              )
              .filter(
                (comp: string, index: number, arr: string[]) => arr.indexOf(comp) === index // Supprimer les doublons
              ),
            // Ajouter les champs détaillés pour le programme
            objectifs: result.data.objectifs,
            prerequis: result.data.prerequis,
            publicConcerne: result.data.publicConcerne,
            horaires: result.data.horaires,
            modalitesPedagogiques: result.data.modalitesPedagogiques,
            evaluation: result.data.evaluation,
            certification: result.data.certification,
            accessibiliteHandicap: result.data.accessibiliteHandicap,
            cessationAbandon: result.data.cessationAbandon,
            formateurNom: result.data.formateurNom,
            formateurEmail: result.data.formateurEmail,
            formateurTelephone: result.data.formateurTelephone,
            formateurRole: result.data.formateurRole,
            formateurBiographie: result.data.formateurBiographie,
          }
          setProgramme(transformedProgramme)
        } else {
          notFound()
        }
      } catch (error) {
        console.error('Erreur lors du chargement du programme:', error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }
    loadProgramme()
  }, [id])

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f3b8e] mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement du programme...</p>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (!programme) {
    notFound()
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-6">
          <ProgrammeModalWrapper programme={programme} />
        </div>
      </div>
    </PublicLayout>
  )
}
