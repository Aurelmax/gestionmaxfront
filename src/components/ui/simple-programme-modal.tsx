'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, MapPin, Euro, Award, Phone, Mail, Download, X } from 'lucide-react'

interface SimpleProgrammeModalProps {
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
  isOpen: boolean
  onClose: () => void
}

export function SimpleProgrammeModal({ programme, isOpen, onClose }: SimpleProgrammeModalProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)

    try {
      // Simulation du téléchargement PDF
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Créer un blob avec le contenu du programme
      const content = `PROGRAMME DE FORMATION\n\n${programme.titre}\n\nDescription: ${programme.description}\n\nDurée: ${programme.duree} heures\nNiveau: ${programme.niveau}\nModalités: ${programme.modalites}\nPrix: ${programme.prix}€\n\nCompétences:\n${programme.competences.map(comp => `- ${comp}`).join('\n')}`

      const blob = new Blob([content], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Programme_${programme.titre.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto relative"
        showCloseButton={false}
      >
        {/* Croix rouge en haut à droite */}
        <button
          onClick={() => {
            console.log('Clic sur la croix de fermeture')
            onClose()
          }}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 shadow-lg"
          aria-label="Fermer le modal"
          type="button"
        >
          <X className="h-5 w-5" />
        </button>

        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1f3b8e] mb-4 pr-12">
            {programme.titre}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Modal détaillé pour la formation {programme.titre} - {programme.duree} heures - Niveau{' '}
            {programme.niveau} - {programme.modalites} - {programme.prix}€
          </DialogDescription>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-[#1f3b8e] text-white">{programme.niveau}</Badge>
            <Badge variant="outline" className="border-[#7eb33f] text-[#7eb33f]">
              {programme.modalites}
            </Badge>
            <Badge variant="outline" className="border-[#1f3b8e] text-[#1f3b8e]">
              {programme.duree}h
            </Badge>
            <Badge variant="outline" className="border-[#7eb33f] text-[#7eb33f]">
              {programme.prix}€
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#1f3b8e]">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{programme.description}</p>
            </CardContent>
          </Card>

          {/* Compétences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#1f3b8e]">Compétences acquises</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {programme.competences.map((competence, index) => {
                  const colors = [
                    'bg-blue-100 text-blue-800 border-blue-200',
                    'bg-green-100 text-green-800 border-green-200',
                    'bg-purple-100 text-purple-800 border-purple-200',
                    'bg-orange-100 text-orange-800 border-orange-200',
                    'bg-pink-100 text-pink-800 border-pink-200',
                    'bg-cyan-100 text-cyan-800 border-cyan-200',
                    'bg-yellow-100 text-yellow-800 border-yellow-200',
                    'bg-indigo-100 text-indigo-800 border-indigo-200',
                  ]
                  const colorClass = colors[index % colors.length]

                  return (
                    <Badge
                      key={competence}
                      variant="outline"
                      className={`text-xs border ${colorClass}`}
                    >
                      {competence}
                    </Badge>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Informations pratiques */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#1f3b8e]">Informations pratiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[#1f3b8e]" />
                  <div>
                    <p className="font-semibold">Durée</p>
                    <p className="text-gray-600">{programme.duree} heures</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#1f3b8e]" />
                  <div>
                    <p className="font-semibold">Modalités</p>
                    <p className="text-gray-600">{programme.modalites}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Euro className="h-5 w-5 text-[#1f3b8e]" />
                  <div>
                    <p className="font-semibold">Tarif</p>
                    <p className="text-gray-600">{programme.prix}€</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-[#1f3b8e]" />
                  <div>
                    <p className="font-semibold">Niveau</p>
                    <p className="text-gray-600">{programme.niveau}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#1f3b8e]">Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <Mail className="h-5 w-5 text-[#1f3b8e]" />
                <span>aurelien@gestionmax.fr</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#1f3b8e]" />
                <span>06.46.02.24.68</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="border-[#7eb33f] text-[#7eb33f] hover:bg-[#7eb33f] hover:text-white disabled:opacity-50"
          >
            {isGeneratingPDF ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#7eb33f] mr-2"></div>
                Génération...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Télécharger le programme PDF
              </>
            )}
          </Button>

          <Button className="bg-[#1f3b8e] hover:bg-[#7eb33f] text-white">
            RDV de Positionnement
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
