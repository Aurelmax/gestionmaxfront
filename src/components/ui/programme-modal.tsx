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
import {
  Clock,
  MapPin,
  Euro,
  CheckCircle,
  Award,
  Phone,
  Mail,
  Download,
  FileText,
  X,
} from 'lucide-react'

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
      const secondaryColor = '#7eb33f'

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

      objectifs.forEach((objectif, index) => {
        const lines = doc.splitTextToSize(`${index + 1}. ${objectif}`, 170)
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
      const prerequisLines = doc.splitTextToSize(programmeDetails.prerequis, 170)
      doc.text(prerequisLines, 20, yPosition + 10)
      yPosition += 10 + prerequisLines.length * 5 + 10

      doc.setFontSize(14)
      doc.setTextColor(primaryColor)
      doc.text('PUBLIC CONCERNÉ', 20, yPosition)

      doc.setFontSize(10)
      doc.setTextColor('#000000')
      const publicLines = doc.splitTextToSize(programmeDetails.public, 170)
      doc.text(publicLines, 20, yPosition + 10)
      yPosition += 10 + publicLines.length * 5 + 15

      // Programme détaillé
      doc.setFontSize(14)
      doc.setTextColor(primaryColor)
      doc.text('PROGRAMME DÉTAILLÉ', 20, yPosition)
      yPosition += 15

      programmeJour.forEach(jour => {
        // Vérifier si on a besoin d'une nouvelle page
        if (yPosition > 250) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(12)
        doc.setTextColor(secondaryColor)
        doc.text(jour.jour, 20, yPosition)
        yPosition += 10

        doc.setFontSize(10)
        doc.setTextColor('#000000')
        doc.text(`Matin: ${jour.matin.titre}`, 20, yPosition)
        yPosition += 8

        jour.matin.contenu.forEach(item => {
          const lines = doc.splitTextToSize(`• ${item}`, 160)
          doc.text(lines, 30, yPosition)
          yPosition += lines.length * 4 + 2
        })

        yPosition += 5
        doc.text(`Après-midi: ${jour.apresMidi.titre}`, 20, yPosition)
        yPosition += 8

        jour.apresMidi.contenu.forEach(item => {
          const lines = doc.splitTextToSize(`• ${item}`, 160)
          doc.text(lines, 30, yPosition)
          yPosition += lines.length * 4 + 2
        })

        yPosition += 10
      })

      // Modalités
      if (yPosition > 200) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFontSize(14)
      doc.setTextColor(primaryColor)
      doc.text('MODALITÉS', 20, yPosition)
      yPosition += 15

      doc.setFontSize(10)
      doc.setTextColor('#000000')
      doc.text(`Durée: ${programmeDetails.duree}`, 20, yPosition)
      doc.text(`Horaires: ${programmeDetails.horaires}`, 20, yPosition + 10)
      doc.text(`Tarif: ${programmeDetails.tarif}`, 20, yPosition + 20)

      // Contact
      yPosition += 40
      doc.setFontSize(14)
      doc.setTextColor(primaryColor)
      doc.text('CONTACT', 20, yPosition)
      yPosition += 15

      doc.setFontSize(10)
      doc.setTextColor('#000000')
      doc.text(`Email: ${programmeDetails.contact.email}`, 20, yPosition)
      doc.text(`Téléphone: ${programmeDetails.contact.telephone}`, 20, yPosition + 10)

      // Certification
      yPosition += 30
      doc.setFontSize(10)
      doc.setTextColor('#666666')
      doc.text('Organisme de formation certifié Qualiopi', 20, yPosition)
      doc.text('Référence: QUA230C60046', 20, yPosition + 10)

      // Télécharger le PDF
      doc.save(`Programme_${programme.titre.replace(/\s+/g, '_')}.pdf`)
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
      alert('Erreur lors de la génération du PDF. Veuillez réessayer.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Données spécifiques pour le programme SEO & WooCommerce
  const programmeDetails = {
    prerequis:
      "Avoir des connaissances de base sur WordPress, ou avoir suivi un module d'initiation.",
    public: 'Artisans, commerçants ou professions libérales.',
    duree: '21 heures ou 3 jours',
    horaires: '9h à 13h et de 14h à 17h (pauses incluses)',
    tarif: '1470€ Nets de taxes Art-293 du CGI',
    contact: {
      email: 'aurelien@gestionmax.fr',
      telephone: '06.46.02.24.68',
    },
  }

  const objectifs = [
    "Comprendre les principes fondamentaux du référencement naturel (SEO) et identifier les facteurs clés pour améliorer la visibilité d'un site web sur les moteurs de recherche.",
    "Mettre en œuvre des techniques avancées de SEO, incluant les optimisations on-page et off-page, et d'analyser les performances pour ajuster ses stratégies.",
    "Installer, configurer et personnaliser un site e-commerce avec WooCommerce en fonction des besoins commerciaux et techniques de l'apprenant(e).",
  ]

  const programmeJour = [
    {
      jour: 'Jour 1 : SEO - Les fondamentaux avec SEOPress (7 heures)',
      matin: {
        titre: 'Introduction au SEO et SEOPress',
        contenu: [
          'Comprendre les bases du référencement naturel',
          'Configuration initiale et outils indispensables (Google Search Console, Analytics vs Matomo)',
          'Stratégie SEO personnalisée',
          'Recherche et analyse des mots-clés avec Ubersuggest & Answer the public',
          "Mise en place d'une feuille de route SEO",
        ],
      },
      apresMidi: {
        titre: 'Création de contenu optimisé',
        contenu: [
          'Techniques pour rédiger du contenu efficace',
          "Structurer vos pages et articles avec SEOPress en prenant en compte l'importance de la taxonomie",
          'Le lexique du SEO',
        ],
      },
    },
    {
      jour: 'Jour 2 : SEO avancé et mise en pratique (7 heures)',
      matin: {
        titre: 'Optimisations On-Page',
        contenu: [
          'Analyse de contenu et amélioration des pages clés',
          'Gestion des redirections et détection des liens brisés',
        ],
      },
      apresMidi: {
        titre: 'Optimisations Off-Page et Suivi des performances SEO',
        contenu: [
          'Stratégies de netlinking (backlinks)',
          'Mise en avant sur des annuaires et plateformes locales',
          'Rapports de SEOPress Insights',
          'Ajustements SEO basés sur les données (Analytics, Search Console)',
        ],
      },
    },
    {
      jour: 'Jour 3 : Techniques de Vente WooCommerce (7 heures)',
      matin: {
        titre: 'Introduction à WooCommerce',
        contenu: [
          'Installation et configuration de base',
          'Gestion des produits (création, variation, catégories)',
          'Optimisation des fiches produits pour le SEO et la conversion',
          'Stratégie de vente en ligne',
          'Définir votre public cible et adapter vos offres',
          'Techniques de cross-selling et upselling',
        ],
      },
      apresMidi: {
        titre: 'Marketing et outils WooCommerce',
        contenu: [
          'Intégration des extensions marketing (codes promo, remises)',
          "Mise en place d'un système de paiement sécurisé et fluide",
          'Analyse des performances de ventes via des outils indispensables',
          "Plan d'action et clôture",
          "Élaboration d'une stratégie personnalisée pour allier SEO et e-commerce",
          'Session de questions-réponses',
          'Quizz',
        ],
      },
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto relative"
        showCloseButton={false}
      >
        {/* Croix rouge en haut à droite */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 shadow-lg"
          aria-label="Fermer le modal"
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

        {/* Navigation des onglets */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-[#1f3b8e] text-[#1f3b8e]'
                : 'text-gray-500 hover:text-[#1f3b8e]'
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('programme')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'programme'
                ? 'border-b-2 border-[#1f3b8e] text-[#1f3b8e]'
                : 'text-gray-500 hover:text-[#1f3b8e]'
            }`}
          >
            Programme détaillé
          </button>
          <button
            onClick={() => setActiveTab('modalites')}
            className={`px-4 py-2 font-medium ${
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
            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-600">{programme.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Objectifs pédagogiques</h3>
              <ul className="space-y-2">
                {objectifs.map((objectif, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-[#7eb33f] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{objectif}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-500">Prérequis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{programmeDetails.prerequis}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Public concerné
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{programmeDetails.public}</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Compétences développées</h3>
              <div className="flex flex-wrap gap-2">
                {programme.competences.map((competence, index) => {
                  const colors = [
                    'bg-blue-100 text-blue-800 border-blue-200',
                    'bg-green-100 text-green-800 border-green-200',
                    'bg-purple-100 text-purple-800 border-purple-200',
                    'bg-orange-100 text-orange-800 border-orange-200',
                    'bg-pink-100 text-pink-800 border-pink-200',
                    'bg-indigo-100 text-indigo-800 border-indigo-200',
                    'bg-teal-100 text-teal-800 border-teal-200',
                    'bg-amber-100 text-amber-800 border-amber-200',
                  ]
                  const colorClass = colors[index % colors.length]
                  return (
                    <Badge key={index} className={`${colorClass}`}>
                      {competence}
                    </Badge>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'programme' && (
          <div className="space-y-6">
            {programmeJour.map((jour, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{jour.jour}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-[#1f3b8e] mb-2">
                      Matin (9h - 13h) : {jour.matin.titre}
                    </h4>
                    <ul className="space-y-1">
                      {jour.matin.contenu.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-[#1f3b8e] rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1f3b8e] mb-2">
                      Après-midi (14h - 17h) : {jour.apresMidi.titre}
                    </h4>
                    <ul className="space-y-1">
                      {jour.apresMidi.contenu.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-[#1f3b8e] rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'modalites' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Durée et horaires
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">{programmeDetails.duree}</p>
                  <p className="text-sm text-gray-600">{programmeDetails.horaires}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Euro className="h-4 w-4" />
                    Tarif
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">{programmeDetails.tarif}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Modalités
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Formation en présentiel individuel</p>
                  <p className="text-sm text-gray-600">
                    Méthode expositive et démonstrative avec alternance théorie/pratique
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Certificat de réalisation de formation</p>
                  <p className="text-sm text-gray-600">Quiz d'évaluation des acquis</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Contact et informations</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#1f3b8e]" />
                  <span>{programmeDetails.contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-[#1f3b8e]" />
                  <span>{programmeDetails.contact.telephone}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-[#1f3b8e] mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-[#1f3b8e] mb-2">Documentation réglementaire</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Conformément aux exigences réglementaires, vous pouvez télécharger le programme
                    de formation complet au format PDF.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadPDF}
                    disabled={isGeneratingPDF}
                    className="border-[#1f3b8e] text-[#1f3b8e] hover:bg-[#1f3b8e] hover:text-white"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#1f3b8e] mr-2"></div>
                        Génération...
                      </>
                    ) : (
                      <>
                        <Download className="h-3 w-3 mr-2" />
                        Télécharger le programme
                      </>
                    )}
                  </Button>
                </div>
              </div>
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

          <Button className="bg-[#1f3b8e] hover:bg-[#7eb33f] text-white">
            RDV de Positionnement
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
