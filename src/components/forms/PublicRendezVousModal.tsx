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
import { PublicRendezVousForm } from './PublicRendezVousForm'

interface PublicRendezVousModalProps {
  programmeId: string
  programmeTitre: string
  trigger?: React.ReactNode
}

export function PublicRendezVousModal({
  programmeId,
  programmeTitre,
  trigger,
}: PublicRendezVousModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSuccess = () => {
    setIsSuccess(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsSuccess(false)
    }, 3000)
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
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Demande de rendez-vous
          </DialogTitle>
          <div className="bg-blue-50 p-4 rounded-lg mt-4">
            <h4 className="font-semibold text-blue-900 mb-2">Formation sélectionnée :</h4>
            <p className="text-blue-800">{programmeTitre}</p>
            <p className="text-sm text-blue-600 mt-2">
              💡 Ce rendez-vous de positionnement est gratuit et sans engagement. Il nous permettra
              d'analyser vos besoins et d'adapter la formation à votre profil.
            </p>
          </div>
        </DialogHeader>

        {isSuccess ? (
          <div className="text-center py-12">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-4">Demande envoyée !</h3>
            <p className="text-gray-600 mb-4">
              Votre demande de rendez-vous a été envoyée avec succès.
            </p>
            <p className="text-sm text-gray-500">
              Nous vous contacterons dans les 24h ouvrées pour confirmer votre rendez-vous.
            </p>
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Prochaines étapes :</strong>
                <br />
                • Vérification de votre demande
                <br />
                • Confirmation par email ou téléphone
                <br />• Envoi des détails du rendez-vous
              </p>
            </div>
          </div>
        ) : (
          <PublicRendezVousForm
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
