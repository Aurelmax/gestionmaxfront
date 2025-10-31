'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ProgrammeFormComplet } from '@/components/admin/ProgrammeFormComplet'
import { Programme } from '@/types/index'
import { toast } from 'sonner'

export default function EditProgrammePage() {
  const [programme, setProgramme] = useState<Programme | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
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
    } catch (error) {
      console.error('Erreur lors du chargement du programme:', error)
      toast.error('Erreur lors du chargement du programme')
      router.push('/dashboard/programmes')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (programmeData: Omit<Programme, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSaving(true)

    try {
      const response = await fetch(`/api/programmes/${programmeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(programmeData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la modification du programme')
      }

      toast.success('Programme modifié avec succès !')
      router.push('/dashboard/programmes')
    } catch (error: any) {
      console.error('Erreur lors de la modification du programme:', error)
      toast.error(error.message || 'Erreur lors de la modification du programme')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/programmes')
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
          <button
            onClick={() => router.push('/dashboard/programmes')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Modifier le programme</h1>
        <p className="text-muted-foreground">
          Modifiez les informations du programme : {programme.titre}
        </p>
      </div>

      <ProgrammeFormComplet
        programme={programme}
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={isSaving}
      />
    </div>
  )
}
