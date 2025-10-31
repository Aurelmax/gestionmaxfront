'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Download,
  FileText,
  Calendar,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  Users,
  BookOpen,
  Clock,
  Mail,
  MapPin,
} from 'lucide-react'

interface ArticleProps {
  number: string
  title: string
  content: string
  icon: React.ComponentType<{ className?: string }>
  isImportant?: boolean
}

function Article({ number, title, content, icon: Icon, isImportant = false }: ArticleProps) {
  return (
    <Card
      className={`p-6 hover:shadow-lg transition-shadow ${isImportant ? 'border-l-4 border-l-[#1f3b8e] bg-blue-50' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`p-3 rounded-lg ${isImportant ? 'bg-[#1f3b8e] text-white' : 'bg-gray-100 text-gray-700'}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant={isImportant ? 'default' : 'secondary'} className="text-sm">
              Article {number}
            </Badge>
            {isImportant && (
              <Badge className="bg-yellow-100 text-yellow-800 text-xs">Important</Badge>
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            {content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-3 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

export function ReglementInterieur() {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      // Simulation du téléchargement PDF
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Créer un blob avec le contenu du règlement
      const content = document.getElementById('reglement-content')?.innerText || ''
      const blob = new Blob([content], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'Reglement_Interieur_GestionMax_2023.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const articles = [
    {
      number: '1',
      title: 'Bases du Règlement Intérieur',
      content:
        "Le présent Règlement Intérieur est actualisé en fonction de l'évolution de la législation, et notamment des dispositions du Décret 2019-1143 du 7 novembre 2019 (Article 4). Il obéit aux dispositions des articles L.6352-3 et 5 et R.6352-1 à 15 du Code du travail. Les sanctions pénales sont exposées en articles L.6355-8 et 9 du Code du travail.\n\nCe Règlement Intérieur est disponible et consultable par tout stagiaire ou apprenti avant son entrée en formation.",
      icon: FileText,
      isImportant: true,
    },
    {
      number: '2',
      title: "Informations remises au stagiaire ou à l'apprenti",
      content:
        "Selon les dispositions de l'article L6353.8 du Code du travail, modifié par la Loi 2018-771 du 5 septembre 2018, les informations suivantes sont remises avant l'inscription définitive :\n\n• Les objectifs (objectifs professionnels et objectifs de développement des compétences professionnelles) et le contenu de la formation\n• La liste des formateurs et des enseignants\n• Les horaires\n• Les modalités d'évaluation de la formation\n• Les coordonnées de la personne chargée des relations avec les stagiaires\n• Le règlement intérieur applicable à la formation\n\nPour les contrats conclus par des personnes physiques, avant inscription définitive et tout règlement de frais, les informations mentionnées précédemment sont délivrées, ainsi que :\n\n• Les tarifs\n• Les modalités de règlement et les conditions financières prévues en cas de cessation anticipée de la formation ou d'abandon en cours de stage",
      icon: BookOpen,
    },
    {
      number: '3',
      title: "Informations demandées au stagiaire ou à l'apprenti",
      content:
        "Selon les dispositions de l'article L6353.9 du Code du travail, modifié par la Loi 2018-771 du 5 septembre 2018, les informations demandées, sous quelque forme que ce soit, par un Prestataire de formation au candidat à une action telle que définie à l'article L6313-1 du Code du travail, à un stagiaire ou un apprenti ne peuvent avoir comme finalité que d'apprécier son aptitude à suivre l'action de formation, qu'elle soit sollicitée, proposée ou poursuivie. Ces informations doivent présenter un lien direct et nécessaire avec l'action de formation, et il doit y être répondu de bonne foi.",
      icon: User,
    },
    {
      number: '4',
      title: 'Assiduité, ponctualité, absences',
      content:
        "Les stagiaires ou apprentis sont tenus de suivre toutes les séquences programmées par le Prestataire de formation, avec assiduité et ponctualité, et sans interruption. Des feuilles de présence sont émargées par les stagiaires ou apprentis, par demi-journées, et contresignées par l'intervenant.\n\nToute absence prévisible du stagiaire ou de l'apprenti, qu'il soit également ou non le client, et ce quelle qu'en soit la cause, doit être annoncée et déclarée par écrit, sur feuille libre ou par mail. Selon le contexte, les dispositions des Conditions Générales de Vente du Prestataire de formation, de la Convention ou du Contrat de Formation, du devis, et plus généralement de l'article L6354-1 s'appliqueront.\n\nEn cas de maladie, le stagiaire ou l'apprenti doit prévenir l'établissement dès la première demi-journée d'absence. Un certificat médical doit être présenté dans les 48 heures.",
      icon: Clock,
      isImportant: true,
    },
    {
      number: '5',
      title: 'Participation, matériel et locaux de formation',
      content:
        "La présence de chacun des stagiaires ou apprentis doit s'accompagner d'une participation active et de l'accomplissement d'efforts personnels, y compris en intersessions dans le cas de journées de formation séparées si un travail de conception et/ou des exercices sont nécessaires et/ou indispensables au bon déroulement de la journée de formation suivante.\n\nLes stagiaires ou apprentis sont tenus de conserver en bon état ce qui a été mis à disposition par l'établissement.\n\nLa documentation pédagogique remise lors des sessions de formation est protégée au titre des droits d'auteur et ne peut être réutilisée autrement que pour un strict usage personnel.",
      icon: Shield,
    },
    {
      number: '6',
      title: 'Santé, hygiène et sécurité',
      content:
        "Le règlement intérieur est établi dans tous les Prestataires de formation, y compris dans ceux qui accueillent les stagiaires et apprentis dans des locaux mis à leur disposition. Lorsque le Prestataire comporte plusieurs établissements, ou qu'il dispense l'activité de formation par apprentissage, le règlement intérieur peut faire l'objet des adaptations nécessaires, notamment en matière de santé et de sécurité au travail.",
      icon: Shield,
    },
    {
      number: '7',
      title: 'Discipline – Sanctions – Procédure',
      content:
        "Il est formellement interdit aux stagiaires ou apprentis, notamment et sans que cette liste soit exhaustive :\n\n• D'introduire des boissons alcoolisées dans les locaux dans lesquels la formation se déroule, et de se présenter aux formations en état d'ébriété\n• D'emporter ou de modifier des supports ou matériels de formation\n• De faire preuve d'un comportement répréhensible par la Loi\n\nConstitue une sanction toute mesure, autre que les observations verbales, prise par le responsable du Prestataire de formation ou son représentant, à la suite d'un agissement du stagiaire ou de l'apprenti considéré par lui comme fautif.",
      icon: AlertTriangle,
      isImportant: true,
    },
    {
      number: '8',
      title: 'Représentation des stagiaires : élection et scrutin',
      content:
        "Pour les actions de formation organisées en sessions d'une durée totale supérieure à cinq cents heures, il est procédé simultanément à l'élection d'un délégué titulaire et d'un délégué suppléant au scrutin uninominal à deux tours. Tous les stagiaires ou apprentis sont électeurs et éligibles.\n\nLe scrutin se déroule pendant les heures de formation. Il a lieu au plus tôt vingt heures et au plus tard quarante heures après le début de la première session collective.",
      icon: Users,
    },
    {
      number: '9',
      title: 'Mandat et attributions des délégués des stagiaires',
      content:
        "Les délégués sont élus pour la durée de la formation. Leurs fonctions prennent fin lorsqu'ils cessent de participer à la formation.\n\nLes délégués font toute suggestion pour améliorer le déroulement des formations et les conditions de vie des stagiaires du Prestataire de formation. Ils présentent les réclamations individuelles ou collectives relatives à ces matières, aux conditions de santé et de sécurité au travail et à l'application du règlement Intérieur.",
      icon: Users,
    },
    {
      number: '10',
      title: 'Procédure de réclamation',
      content:
        "Les clients, stagiaires, apprentis, financeurs, équipe pédagogique « parties prenantes » à la prestation ont la possibilité à tout moment de faire une réclamation relative aux offres et prestations de formations du Prestataire de Formation par écrit en face-à-face, par courrier postal ou par mail en utilisant exclusivement le formulaire de réclamation disponible en téléchargement sur le site du Prestataire de Formation ou à demander à aurelien@gestionmax.fr et à retourner à la même adresse mail à l'attention du responsable du Prestataire de Formation.\n\nChaque réclamation sera étudiée et une réponse sera apportée à son expéditeur dans les meilleurs délais, idéalement par retour de mail au moyen du formulaire de réponse aux réclamations.",
      icon: Mail,
      isImportant: true,
    },
  ]

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#1f3b8e] text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <FileText className="h-4 w-4" />
            Règlement Intérieur
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Règlement Intérieur du Prestataire de formation professionnelle
          </h1>
          <div className="flex items-center justify-center gap-4 text-lg text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Version actualisée du 01/01/2022
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              GESTIONMAX
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Document officiel régissant les conditions de formation et les droits et obligations de
            tous les participants
          </p>
        </div>

        {/* Download Section */}
        <div className="mb-12">
          <Card className="p-8 bg-gradient-to-r from-[#1f3b8e] to-[#7eb33f] text-white">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-3">Télécharger le Règlement Intérieur</h2>
                <p className="text-lg opacity-90 mb-4">
                  Consultez et téléchargez le document officiel au format PDF
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Version officielle
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Mise à jour 2023
                  </div>
                </div>
              </div>
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                size="lg"
                className="bg-white text-[#1f3b8e] hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#1f3b8e] mr-2"></div>
                    Téléchargement...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Télécharger PDF
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Contact Info */}
        <div className="mb-12">
          <Card className="p-6 bg-white border-l-4 border-l-[#7eb33f]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-[#1f3b8e]/10 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-[#1f3b8e]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Lieu</p>
                  <p className="text-gray-600">Antibes, France</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#1f3b8e]/10 p-2 rounded-lg">
                  <Mail className="h-5 w-5 text-[#1f3b8e]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Contact</p>
                  <p className="text-gray-600">aurelien@gestionmax.fr</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#1f3b8e]/10 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-[#1f3b8e]" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Entrée en vigueur</p>
                  <p className="text-gray-600">20 juin 2023</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Articles */}
        <div id="reglement-content" className="space-y-8">
          {articles.map(article => (
            <Article
              key={article.number}
              number={article.number}
              title={article.title}
              content={article.content}
              icon={article.icon}
              isImportant={article.isImportant}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-gray-100 to-blue-100">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Signature et validation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Lieu et date</p>
                  <p className="text-gray-600">A Antibes, le 20/06/2023</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Signataire</p>
                  <p className="text-gray-600">Aurélien LAVAYSSIERE – Formateur indépendant</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-300">
                <p className="text-sm text-gray-600">
                  Le présent Règlement Intérieur entre en vigueur le 20 juin 2023, et remplace
                  toutes les versions précédentes.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
