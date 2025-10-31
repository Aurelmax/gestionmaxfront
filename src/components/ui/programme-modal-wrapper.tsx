'use client'

import { SimpleModal } from '@/components/ui/simple-modal'
// import { Programme } from '@/types/common';

interface ProgrammeModalWrapperProps {
  programme: {
    id: string
    titre: string
    description: string
    duree: number
    niveau: string
    modalites: string
    prix: number
    competences: string[]
  }
}

export function ProgrammeModalWrapper({ programme }: ProgrammeModalWrapperProps) {
  return <SimpleModal programme={programme} />
}
