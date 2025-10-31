'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar, CheckCircle } from 'lucide-react'
import { RendezVousForm } from './RendezVousForm'

interface RendezVousModalProps {
  programmeId: string
  programmeTitre: string
  trigger?: React.ReactNode
}

export function RendezVousModal({ programmeId, programmeTitre, trigger }: RendezVousModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSuccess = () => {
    setIsSuccess(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsSuccess(false)
    }, 2000)
  }

  const defaultTrigger = (
    <Button className="w-full bg-[#1f3b8e] hover:bg-[#7eb33f] text-white">
      <Calendar className="h-4 w-4 mr-2" />
      RDV de Positionnement
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Demande de rendez-vous
          </DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Demande envoyée !</h3>
            <p className="text-gray-600">
              Votre demande de rendez-vous a été envoyée avec succès. Nous vous contacterons dans
              les plus brefs délais.
            </p>
          </div>
        ) : (
          <RendezVousForm
            programmeId={programmeId}
            programmeTitre={programmeTitre}
            onSuccess={handleSuccess}
            onCancel={() => setIsOpen(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
