'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Download } from 'lucide-react'

interface ProgrammeModalProps {
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

export function ProgrammeModal({ programme, isOpen, onClose }: ProgrammeModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'programme' | 'modalites'>('overview')
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  // Fonction pour générer et télécharger le PDF
  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true)

    try {
      // Import dynamique de jsPDF
      const { default: jsPDF } = await import('jspdf')

      // Créer un nouveau document PDF
      const doc = new jsPDF()

      // Configuration des couleurs
      const primaryColor = '#1f3b8e'

      // En-tête
      doc.setFontSize(20)
      doc.setTextColor(primaryColor)
      doc.text('PROGRAMME DE FORMATION', 20, 30)

      doc.setFontSize(16)
      doc.setTextColor('#000000')
      doc.text(programme.titre, 20, 45)

      // Informations générales
      doc.setFontSize(12)
      doc.text(`Durée: ${programme.duree} heures`, 20, 65)
      doc.text(`Niveau: ${programme.niveau}`, 20, 75)
      doc.text(`Modalités: ${programme.modalites}`, 20, 85)
      doc.text(`Prix: ${programme.prix}€`, 20, 95)

      // Description
      doc.setFontSize(14)
      doc.setTextColor(primaryColor)
      doc.text('DESCRIPTION', 20, 115)

      doc.setFontSize(10)
      doc.setTextColor('#000000')
      const descriptionLines = doc.splitTextToSize(programme.description, 170)
      doc.text(descriptionLines, 20, 125)

      let yPosition = 125 + descriptionLines.length * 5 + 10

      // Objectifs pédagogiques
      doc.setFontSize(14)
      doc.setTextColor(primaryColor)
      doc.text('OBJECTIFS PÉDAGOGIQUES', 20, yPosition)

      doc.setFontSize(10)
      doc.setTextColor('#000000')
      yPosition += 10

      const objectifs = [
        "Comprendre les principes fondamentaux du référencement naturel (SEO) et identifier les facteurs clés pour améliorer la visibilité d'un site web sur les moteurs de recherche.",
        "Mettre en œuvre des techniques avancées de SEO, incluant les optimisations on-page et off-page, et d'analyser les performances pour ajuster ses stratégies.",
        "Installer, configurer et personnaliser un site e-commerce avec WooCommerce en fonction des besoins commerciaux et techniques de l'apprenant(e).",
      ]

      objectifs.forEach(objectif => {
        const lines = doc.splitTextToSize(`• ${objectif}`, 170)
        doc.text(lines, 20, yPosition)
        yPosition += lines.length * 5 + 5
      })

      // Prérequis et public
      yPosition += 10
      doc.setFontSize(14)
      doc.setTextColor(primaryColor)
      doc.text('PRÉREQUIS', 20, yPosition)

      doc.setFontSize(10)
      doc.setTextColor('#000000')
      yPosition += 10
      doc.text(
        "Avoir des connaissances de base sur WordPress, ou avoir suivi un module d'initiation.",
        20,
        yPosition
      )

      yPosition += 15
      doc.setFontSize(14)
      doc.setTextColor(primaryColor)
      doc.text('PUBLIC CONCERNÉ', 20, yPosition)

      doc.setFontSize(10)
      doc.setTextColor('#000000')
      yPosition += 10
      doc.text('Artisans, commerçants ou professions libérales.', 20, yPosition)

      // Compétences développées
      yPosition += 20
      doc.setFontSize(14)
      doc.setTextColor(primaryColor)
      doc.text('COMPÉTENCES DÉVELOPPÉES', 20, yPosition)

      doc.setFontSize(10)
      doc.setTextColor('#000000')
      yPosition += 10

      programme.competences.forEach(competence => {
        doc.text(`• ${competence}`, 20, yPosition)
        yPosition += 5
      })

      // Pied de page
      doc.setFontSize(8)
      doc.setTextColor('#666666')
      doc.text('GestionMax Formation - Organisme certifié Qualiopi', 20, 280)
      doc.text('Contact: aurelien@gestionmax.fr - 06.46.02.24.68', 20, 285)

      // Sauvegarder le PDF
      doc.save(`Programme_${programme.titre.replace(/\s+/g, '_')}.pdf`)
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const objectifs = [
    "Comprendre les principes fondamentaux du référencement naturel (SEO) et identifier les facteurs clés pour améliorer la visibilité d'un site web sur les moteurs de recherche.",
    "Mettre en œuvre des techniques avancées de SEO, incluant les optimisations on-page et off-page, et d'analyser les performances pour ajuster ses stratégies.",
    "Installer, configurer et personnaliser un site e-commerce avec WooCommerce en fonction des besoins commerciaux et techniques de l'apprenant(e).",
  ]

  const competencesColors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-orange-100 text-orange-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#1f3b8e] mb-4">
            {programme.titre}
          </DialogTitle>

          {/* Badges d'information */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="secondary" className="bg-[#1f3b8e] text-white">
              {programme.niveau}
            </Badge>
            <Badge variant="outline" className="border-[#7eb33f] text-[#7eb33f]">
              {programme.modalites}
            </Badge>
            <Badge variant="secondary" className="bg-[#1f3b8e] text-white">
              {programme.duree}h
            </Badge>
            <Badge variant="outline" className="border-[#7eb33f] text-[#7eb33f]">
              {programme.prix}€
            </Badge>
          </div>
        </DialogHeader>

        {/* Navigation par onglets */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'overview'
                ? 'border-b-2 border-[#1f3b8e] text-[#1f3b8e]'
                : 'text-gray-500 hover:text-[#1f3b8e]'
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('programme')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'programme'
                ? 'border-b-2 border-[#1f3b8e] text-[#1f3b8e]'
                : 'text-gray-500 hover:text-[#1f3b8e]'
            }`}
          >
            Programme détaillé
          </button>
          <button
            onClick={() => setActiveTab('modalites')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'modalites'
                ? 'border-b-2 border-[#1f3b8e] text-[#1f3b8e]'
                : 'text-gray-500 hover:text-[#1f3b8e]'
            }`}
          >
            Modalités
          </button>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Description</h3>
              <p className="text-gray-600">{programme.description}</p>
            </div>

            {/* Objectifs pédagogiques */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Objectifs pédagogiques</h3>
              <ul className="space-y-2">
                {objectifs.map((objectif, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#7eb33f] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{objectif}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prérequis et Public concerné */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">Prérequis</h4>
                <p className="text-sm text-gray-600">
                  Avoir des connaissances de base sur WordPress, ou avoir suivi un module
                  d'initiation.
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">Public concerné</h4>
                <p className="text-sm text-gray-600">
                  Artisans, commerçants ou professions libérales.
                </p>
              </div>
            </div>

            {/* Compétences développées */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">Compétences développées</h3>
              <div className="flex flex-wrap gap-2">
                {programme.competences.map((competence, index) => (
                  <Badge
                    key={index}
                    className={`${competencesColors[index % competencesColors.length]} border-0`}
                  >
                    {competence}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'programme' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Programme détaillé en cours de développement...</p>
            </div>
          </div>
        )}

        {activeTab === 'modalites' && (
          <div className="space-y-6">
            <div className="text-center py-8">
              <p className="text-gray-500">Modalités en cours de développement...</p>
            </div>
          </div>
        )}

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

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-[#1f3b8e] text-[#1f3b8e] hover:bg-[#1f3b8e] hover:text-white"
            >
              Fermer
            </Button>
            <Button className="bg-[#1f3b8e] hover:bg-[#7eb33f] text-white">
              RDV de Positionnement
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
