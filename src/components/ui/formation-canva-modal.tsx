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
  Palette,
  Share2,
  Monitor,
  Target,
  Calendar,
} from 'lucide-react'

interface FormationCanvaModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FormationCanvaModal({ isOpen, onClose }: FormationCanvaModalProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const formationData = {
    titre: 'Maîtriser Canva pour le web, les réseaux sociaux et la vente en ligne',
    code: 'A012-CV-WEB-WC',
    duree: '14 heures (2 jours)',
    niveau: 'Débutant',
    modalite: 'Présentiel individuel',
    prix: '980€',
    horaires: '9h à 13h et de 14h à 17h',
    prerequis: 'Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur',
    publicConcerne: 'Artisans, commerçants ou professions libérales',
    objectifs: [
      'Créer et optimiser des visuels professionnels attractifs adaptés au web et aux réseaux sociaux',
      'Respecter les principes du design graphique',
      'Maîtriser les fonctionnalités essentielles de Canva',
      'Optimiser la création de contenus visuels pour une utilisation professionnelle',
    ],
    programme: [
      {
        jour: 'Jour 1 : Découvrir Canva et créer des visuels attractifs (7 heures)',
        matin: {
          titre: 'Matin (9h00 - 13h00) - Introduction à Canva',
          contenu: [
            'Présentation de Canva : version gratuite et Pro',
            "Création d'un compte et prise en main de l'interface",
            'Exploration des modèles existants : affiches, posts, bannières, stories',
            'Les fondamentaux du design : couleurs, typographies, alignements',
            'Choisir les formats adaptés pour chaque plateforme (Facebook, Instagram, LinkedIn)',
            'Optimiser les visuels pour une communication professionnelle et cohérente',
          ],
        },
        apresMidi: {
          titre: 'Après-midi (14h00 - 17h00) - Création de visuels pour les réseaux sociaux',
          contenu: [
            'Concevoir des publications engageantes : post carrousel, stories, visuels de couverture',
            'Pratique : création de visuels pour Instagram et Facebook',
            'Ajouter des éléments interactifs : icônes, stickers, animations',
            'Importer des images, polices et logos pour une identité de marque unique',
            'Utiliser les bibliothèques Canva : photos, vidéos et illustrations',
          ],
        },
      },
      {
        jour: 'Jour 2 : Stratégie de contenu et optimisation pour le web (7 heures)',
        matin: {
          titre: 'Matin (9h00 - 13h00) - Optimiser ses visuels pour le web',
          contenu: [
            'Adapter la taille et la résolution des visuels (SEO et rapidité de chargement)',
            'Exporter les fichiers aux formats appropriés (PNG, JPEG, PDF, MP4)',
            'Intégrer les visuels dans un site WordPress ou blog',
            'Créer des fiches produits optimisées et intégrer des images professionnelles',
            'Réaliser des visuels adaptés aux publicités Facebook Ads et Google Ads',
            "Exercice pratique : création d'une annonce visuelle",
          ],
        },
        apresMidi: {
          titre: 'Après-midi (14h00 - 17h00) - Planifier et diffuser le contenu visuel',
          contenu: [
            'Planification des publications avec des outils gratuits (Meta Business Suite, Canva Planner)',
            'Analyse des performances des visuels grâce aux statistiques des réseaux sociaux',
            "Création d'une série de visuels adaptés aux besoins professionnels de chaque participant",
            'Présentation et feedback',
          ],
        },
      },
    ],
    modalites: {
      pedagogiques:
        "Formation en présentiel individuel en utilisant une méthode expositive et démonstrative, adaptée aux besoins des professionnels en formation continue. Elle repose sur une alternance d'exposés théoriques et de cas pratiques.",
      techniques:
        'Salle de formation équipée de matériel informatique haut de gamme connectée à internet. Support de cours (Projet et ressources téléchargeables sur Notion, un hébergement Web, quizz, fiches pratiques) et un accès à Canva Pro.',
      evaluation:
        "Quizz d'une dizaine de questions par l'intermédiaire de notre plateforme d'évaluation en ligne EVALBOX. Grille d'analyse des compétences, travaux pratiques.",
      sanction:
        "Un certificat de réalisation de formation. Une feuille d'émargement individuelle sera conjointement signée par le formateur et chaque stagiaire.",
      niveau:
        "Cette formation n'est pas certifiante, cependant, elle permet de maîtriser les fonctionnalités essentielles de Canva et d'optimiser la création de contenus visuels pour une utilisation professionnelle sur le web et les réseaux sociaux",
    },
    contact: {
      email: 'aurelien@gestionmax.fr',
      telephone: '06.46.02.24.68',
      referent: 'Aurélien LAVAYSSIERE - Référent pédagogique et qualité',
    },
    accessibilite:
      "Votre organisme est engagé dans une démarche d'accueil et d'accompagnement en formation des personnes en situation de handicap. Dans ce cadre, nous proposons : Un entretien téléphonique pour vous accompagner individuellement, D'évaluer vos besoins spécifiques au regard d'une situation de handicap, De mettre en œuvre les adaptations pédagogiques, organisationnelles et matériels nécessaires.",
    dates: {
      creation: '25/11/24',
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
                      <Palette className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">Design Graphique</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Principes du design (couleurs, typographies)</li>
                      <li>• Création d'identité visuelle</li>
                      <li>• Optimisation des visuels</li>
                      <li>• Formats adaptés par plateforme</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Share2 className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">Réseaux Sociaux</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Posts Instagram et Facebook</li>
                      <li>• Stories et carrousels</li>
                      <li>• Bannières LinkedIn</li>
                      <li>• Éléments interactifs</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">Web & E-commerce</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Visuels pour sites web</li>
                      <li>• Fiches produits optimisées</li>
                      <li>• Bannières et newsletters</li>
                      <li>• Intégration WordPress</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">Publicité & Performance</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Facebook Ads et Google Ads</li>
                      <li>• Planification des publications</li>
                      <li>• Analyse des performances</li>
                      <li>• Optimisation continue</li>
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
