'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProgrammeFormComplet } from '@/components/admin/ProgrammeFormComplet'
import { Programme } from '@/types/index'
import { toast } from 'sonner'

export default function NouveauProgrammePage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSave = async (programmeData: Omit<Programme, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/programmes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(programmeData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors de la création du programme')
      }

      toast.success('Programme créé avec succès !')
      router.push('/dashboard/programmes')
    } catch (error: any) {
      console.error('Erreur lors de la création du programme:', error)
      toast.error(error.message || 'Erreur lors de la création du programme')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard/programmes')
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nouveau programme de formation</h1>
        <p className="text-muted-foreground">
          Créez un nouveau programme de formation pour votre catalogue
        </p>
      </div>

      <ProgrammeFormComplet onSave={handleSave} onCancel={handleCancel} isLoading={isLoading} />
    </div>
  )
}
