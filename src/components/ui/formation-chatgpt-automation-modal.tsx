'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Clock,
  MapPin,
  Euro,
  CheckCircle,
  Phone,
  Mail,
  Users,
  X,
  Bot,
  Zap,
  FileText,
  Calendar,
  Settings,
} from 'lucide-react'

interface FormationChatgptAutomationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FormationChatgptAutomationModal({
  isOpen,
  onClose,
}: FormationChatgptAutomationModalProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const formationData = {
    titre: 'Génération de contenu avec ChatGPT + Automatisation Marketing',
    code: 'A015-IA-CGPT',
    duree: '14 heures (2 jours)',
    niveau: 'Débutant',
    modalite: 'Présentiel individuel',
    prix: '1960€',
    horaires: '9h à 13h et de 14h à 17h',
    prerequis: 'Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur',
    publicConcerne: 'Artisans, commerçants ou professions libérales',
    objectifs: [
      'Comprendre les fondamentaux de ChatGPT pour générer du contenu efficace et pertinent',
      'Créer des contenus optimisés pour le web, les réseaux sociaux et les campagnes marketing',
      "Mettre en place des stratégies d'automatisation pour maximiser l'impact des campagnes de marketing digital",
      "Utiliser des outils comme ChatGPT, Brevo, Make et d'autres solutions d'automatisations",
    ],
    programme: [
      {
        jour: 'Jour 1 : Maîtriser ChatGPT pour la création de contenu (7 heures)',
        matin: {
          titre: 'Matin (9h - 13h) - Découverte et prise en main de ChatGPT',
          contenu: [
            "Comprendre ce qu'est ChatGPT et comment il fonctionne",
            "Exemples d'applications pratiques pour la génération de contenu",
            "Rédaction d'articles de blog optimisés pour le SEO",
            'Création de scripts vidéo ou podcasts',
            'Production de contenu engageant pour les réseaux sociaux',
            'Structurer et affiner les prompts pour obtenir des résultats qualitatifs',
          ],
        },
        apresMidi: {
          titre: 'Après-midi (14h - 17h) - Ateliers pratiques',
          contenu: [
            "Création d'un calendrier éditorial avec ChatGPT",
            "Rédaction d'un article de blog ou de posts pour les réseaux sociaux",
            'Développement de contenu pour une newsletter',
            'Réécriture et amélioration des textes générés',
            "Ajout d'appels à l'action pour maximiser les conversions",
          ],
        },
      },
      {
        jour: 'Jour 2 : Automatisation Marketing avec des outils dédiés (7 heures)',
        matin: {
          titre: 'Matin (9h - 13h) - Découverte et configuration des outils',
          contenu: [
            "Définition et avantages de l'automatisation marketing",
            'Les outils phares : Brevo, Zapier, Make (Integromat)',
            "Création et gestion d'une campagne d'email marketing automatisée",
            "Segmentation des listes et scénarios d'automatisation",
            'Intégration de ChatGPT avec des outils tiers',
            'Planification de posts automatiques avec ChatGPT et Buffer',
          ],
        },
        apresMidi: {
          titre: 'Après-midi (14h - 17h) - Mise en application et stratégies avancées',
          contenu: [
            "Création d'un workflow automatisé complet combinant génération de contenu et diffusion",
            'Utilisation des analytics pour évaluer les performances des automatisations',
            'Optimisation des flux pour améliorer la productivité et les conversions',
            'Débriefing des productions réalisées',
            'Questions/réponses et validation des acquis',
          ],
        },
      },
    ],
    modalites: {
      pedagogiques:
        'Formation en présentiel individuel, avec une méthode expositive et démonstrative, alternant exposés théoriques et cas pratiques. Cette approche favorise une compréhension approfondie des concepts et une mise en application immédiate des compétences acquises.',
      techniques:
        'Salle de formation équipée de matériel informatique haut de gamme connectée à internet. Support de cours (Projet et ressources téléchargeables disponibles sur votre espace apprenant sur Notion, un hébergement Web, quizz, fiches pratiques).',
      evaluation:
        "Quiz en ligne via EVALBOX (20 questions par bloc), travaux pratiques, grille d'analyse des compétences, validation finale par projet. Ces modalités d'évaluation permettent d'assurer une validation progressive et complète des acquis théoriques et pratiques.",
      sanction:
        "Un certificat de réalisation de formation. Une feuille d'émargement individuelle sera conjointement signée par le formateur et chaque stagiaire.",
      niveau: "Aucune certification officielle n'est délivrée à l'issue de cette formation",
    },
    contact: {
      email: 'aurelien@gestionmax.fr',
      telephone: '06.46.02.24.68',
      referent: 'Aurélien LAVAYSSIERE - Référent pédagogique et qualité',
    },
    accessibilite:
      "Votre organisme est engagé dans une démarche d'accueil et d'accompagnement en formation des personnes en situation de handicap. Dans ce cadre, nous proposons : Un entretien téléphonique pour vous accompagner individuellement, D'évaluer vos besoins spécifiques au regard d'une situation de handicap, De mettre en œuvre les adaptations pédagogiques, organisationnelles et matériels nécessaires.",
    dates: {
      creation: '18/12/24',
      version: 'Version 1',
    },
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-[#1f3b8e]">
              {formationData.titre}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge className="bg-[#1f3b8e] text-white">{formationData.niveau}</Badge>
            <Badge variant="outline" className="border-[#7eb33f] text-[#7eb33f]">
              {formationData.modalite}
            </Badge>
            <Badge variant="default" className="bg-[#7eb33f]">
              {formationData.duree}
            </Badge>
            <Badge variant="default" className="bg-[#1f3b8e]">
              {formationData.prix}
            </Badge>
            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
              Code: {formationData.code}
            </Badge>
          </div>
          {/* Dates réglementaires */}
          <div className="flex gap-4 text-sm text-gray-600 mt-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Créé le: {formationData.dates.creation}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>•</span>
              <span>{formationData.dates.version}</span>
            </div>
          </div>
        </DialogHeader>

        {/* Navigation des onglets */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'overview'
                ? 'border-b-2 border-[#1f3b8e] text-[#1f3b8e]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('programme')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'programme'
                ? 'border-b-2 border-[#1f3b8e] text-[#1f3b8e]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Programme détaillé
          </button>
          <button
            onClick={() => setActiveTab('modalites')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'modalites'
                ? 'border-b-2 border-[#1f3b8e] text-[#1f3b8e]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Modalités
          </button>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'overview' && (
          <div className="space-y-6 text-gray-700">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-[#1f3b8e]">Prérequis</h3>
                <p className="text-gray-600">{formationData.prerequis}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-[#1f3b8e]">Public concerné</h3>
                <p className="text-gray-600">{formationData.publicConcerne}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-[#1f3b8e]">
                  Objectifs pédagogiques
                </h3>
                <ul className="space-y-2">
                  {formationData.objectifs.map((objectif, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-[#7eb33f] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{objectif}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-[#1f3b8e]">
                  Informations pratiques
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#1f3b8e]" />
                    <span>
                      <strong>Horaires:</strong> {formationData.horaires}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#1f3b8e]" />
                    <span>
                      <strong>Modalité:</strong> {formationData.modalite}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Euro className="h-5 w-5 text-[#1f3b8e]" />
                    <span>
                      <strong>Tarif:</strong> {formationData.prix} nets de taxes
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#1f3b8e]" />
                    <span>
                      <strong>Niveau:</strong> {formationData.niveau}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compétences clés */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-[#1f3b8e]">
                  Compétences développées
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">ChatGPT & IA</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Maîtrise des prompts efficaces</li>
                      <li>• Génération de contenu optimisé</li>
                      <li>• Articles de blog SEO</li>
                      <li>• Scripts vidéo et podcasts</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">Automatisation</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Workflows automatisés</li>
                      <li>• Intégration d'outils</li>
                      <li>• Campagnes emailing</li>
                      <li>• Publications automatiques</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">Contenu Marketing</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Posts réseaux sociaux</li>
                      <li>• Newsletters automatisées</li>
                      <li>• Calendriers éditoriaux</li>
                      <li>• Appels à l'action</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">Outils No-Code</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Make (Integromat)</li>
                      <li>• Brevo (ex-Sendinblue)</li>
                      <li>• Zapier</li>
                      <li>• Buffer</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'programme' && (
          <div className="space-y-8">
            {formationData.programme.map((jour, index) => (
              <Card key={index} className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-[#1f3b8e]">{jour.jour}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-[#1f3b8e] mb-3">{jour.matin.titre}</h4>
                    <ul className="space-y-2">
                      {jour.matin.contenu.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-[#1f3b8e] rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1f3b8e] mb-3">{jour.apresMidi.titre}</h4>
                    <ul className="space-y-2">
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
          <div className="space-y-6 text-gray-700">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-[#1f3b8e]">
                  Modalités pédagogiques
                </h3>
                <p className="text-gray-600 mb-4">{formationData.modalites.pedagogiques}</p>
                <p className="text-gray-600">{formationData.modalites.techniques}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-[#1f3b8e]">
                  Évaluation et sanction
                </h3>
                <p className="text-gray-600 mb-4">{formationData.modalites.evaluation}</p>
                <p className="text-gray-600 mb-4">{formationData.modalites.sanction}</p>
                <p className="text-gray-600">{formationData.modalites.niveau}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-[#1f3b8e]">
                  Accessibilité handicap
                </h3>
                <p className="text-gray-600">{formationData.accessibilite}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-[#1f3b8e]">
                  Contact et informations
                </h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[#1f3b8e]" />
                    <span>{formationData.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-[#1f3b8e]" />
                    <span>{formationData.contact.telephone}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{formationData.contact.referent}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button className="bg-[#1f3b8e] hover:bg-[#7eb33f] text-white">
            RDV de Positionnement
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
