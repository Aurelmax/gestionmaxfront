'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, MapPin, Euro, Award, Phone, Mail, Download, X } from 'lucide-react'

interface SimpleModalProps {
  programme: {
    id: string
    titre: string
    description: string
    duree: number
    niveau: string
    modalites: string
    prix: number
    competences: string[]
    // Champs détaillés pour le programme
    objectifs?: string
    prerequis?: string
    publicConcerne?: string
    horaires?: string
    modalitesPedagogiques?: string
    evaluation?: string
    certification?: string
    accessibiliteHandicap?: string
    cessationAbandon?: string
    formateurNom?: string
    formateurEmail?: string
    formateurTelephone?: string
    formateurRole?: string
    formateurBiographie?: string
  }
}

export function SimpleModal({ programme }: SimpleModalProps) {
  const handleClose = () => {
    console.log('Fermeture du modal')
    // Fermeture immédiate avec window.location
    window.location.href = '/catalogue'
  }

  // Fermeture par touche Échap
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleDownloadPDF = async () => {
    try {
      const { default: jsPDF } = await import('jspdf')
      const doc = new jsPDF()

      doc.setFontSize(16)
      doc.text(programme.titre, 20, 20)
      doc.setFontSize(12)
      doc.text(programme.description, 20, 40)

      doc.save(`${programme.titre.replace(/\s+/g, '_')}.pdf`)
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto relative w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Croix rouge en haut à droite */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 shadow-lg"
          aria-label="Fermer le modal"
          type="button"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#1f3b8e] mb-4 pr-12">{programme.titre}</h2>
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
          </div>

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
                <CardTitle className="text-lg text-[#1f3b8e]">Compétences développées</CardTitle>
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

            {/* Programme détaillé */}
            {(programme.objectifs ||
              programme.prerequis ||
              programme.publicConcerne ||
              programme.horaires) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#1f3b8e]">Programme détaillé</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {programme.objectifs && (
                    <div>
                      <h4 className="font-semibold text-[#1f3b8e] mb-2">Objectifs pédagogiques</h4>
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {programme.objectifs}
                      </p>
                    </div>
                  )}

                  {programme.prerequis && (
                    <div>
                      <h4 className="font-semibold text-[#1f3b8e] mb-2">Prérequis</h4>
                      <p className="text-sm text-gray-700">{programme.prerequis}</p>
                    </div>
                  )}

                  {programme.publicConcerne && (
                    <div>
                      <h4 className="font-semibold text-[#1f3b8e] mb-2">Public concerné</h4>
                      <p className="text-sm text-gray-700">{programme.publicConcerne}</p>
                    </div>
                  )}

                  {programme.horaires && (
                    <div>
                      <h4 className="font-semibold text-[#1f3b8e] mb-2">Horaires</h4>
                      <p className="text-sm text-gray-700">{programme.horaires}</p>
                    </div>
                  )}

                  {programme.modalitesPedagogiques && (
                    <div>
                      <h4 className="font-semibold text-[#1f3b8e] mb-2">Modalités pédagogiques</h4>
                      <p className="text-sm text-gray-700">{programme.modalitesPedagogiques}</p>
                    </div>
                  )}

                  {programme.evaluation && (
                    <div>
                      <h4 className="font-semibold text-[#1f3b8e] mb-2">Évaluation</h4>
                      <p className="text-sm text-gray-700">{programme.evaluation}</p>
                    </div>
                  )}

                  {programme.certification && (
                    <div>
                      <h4 className="font-semibold text-[#1f3b8e] mb-2">Certification</h4>
                      <p className="text-sm text-gray-700">{programme.certification}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Informations pratiques */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-[#1f3b8e]">Informations pratiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#1f3b8e]" />
                    <span className="text-sm text-gray-600">Durée : {programme.duree} heures</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#1f3b8e]" />
                    <span className="text-sm text-gray-600">Modalité : {programme.modalites}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Euro className="h-5 w-5 text-[#1f3b8e]" />
                    <span className="text-sm text-gray-600">Tarif : {programme.prix}€</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-[#1f3b8e]" />
                    <span className="text-sm text-gray-600">Niveau : {programme.niveau}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formateur */}
            {(programme.formateurNom ||
              programme.formateurEmail ||
              programme.formateurTelephone ||
              programme.formateurRole ||
              programme.formateurBiographie) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#1f3b8e]">Votre formateur</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {programme.formateurNom && (
                    <div>
                      <h4 className="font-semibold text-[#1f3b8e] mb-2">Nom</h4>
                      <p className="text-sm text-gray-700">{programme.formateurNom}</p>
                    </div>
                  )}

                  {programme.formateurRole && (
                    <div>
                      <h4 className="font-semibold text-[#1f3b8e] mb-2">Rôle</h4>
                      <p className="text-sm text-gray-700">{programme.formateurRole}</p>
                    </div>
                  )}

                  {programme.formateurBiographie && (
                    <div>
                      <h4 className="font-semibold text-[#1f3b8e] mb-2">Biographie</h4>
                      <p className="text-sm text-gray-700">{programme.formateurBiographie}</p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4">
                    {programme.formateurEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-[#1f3b8e]" />
                        <span className="text-sm">{programme.formateurEmail}</span>
                      </div>
                    )}
                    {programme.formateurTelephone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-[#1f3b8e]" />
                        <span className="text-sm">{programme.formateurTelephone}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-[#1f3b8e]">Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-[#1f3b8e]" />
                    <span className="text-sm">aurelien@gestionmax.fr</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-[#1f3b8e]" />
                    <span className="text-sm">06.46.02.24.68</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={handleDownloadPDF}
                className="flex-1 bg-[#1f3b8e] hover:bg-[#7eb33f] text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger le programme (PDF)
              </Button>
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 border-[#1f3b8e] text-[#1f3b8e] hover:bg-[#1f3b8e] hover:text-white"
              >
                Retour au catalogue
              </Button>
            </div>

            {/* Bouton de fermeture d'urgence */}
            <div className="text-center pt-4">
              <Button
                onClick={handleClose}
                variant="destructive"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <X className="h-4 w-4 mr-2" />
                Fermer le modal
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
