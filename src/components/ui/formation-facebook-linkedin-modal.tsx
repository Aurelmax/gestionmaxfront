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
  Target,
  BarChart3,
  Calendar,
  Facebook,
  Linkedin,
} from 'lucide-react'

interface FormationFacebookLinkedinModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FormationFacebookLinkedinModal({
  isOpen,
  onClose,
}: FormationFacebookLinkedinModalProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const formationData = {
    titre: 'Maîtriser Facebook Ads et LinkedIn Ads pour une stratégie publicitaire efficace',
    code: 'A014-FB-LI',
    duree: '28 heures (4 jours)',
    niveau: 'Intermédiaire',
    modalite: 'Présentiel individuel',
    prix: '1960€',
    horaires: '9h à 13h et de 14h à 17h',
    prerequis: 'Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur',
    publicConcerne: 'Artisans, commerçants ou professions libérales',
    objectifs: [
      'Comprendre les fondamentaux de la publicité sur Facebook et LinkedIn',
      'Créer et gérer des campagnes publicitaires performantes',
      'Utiliser les outils avancés de Meta Business Suite et de LinkedIn Ads',
      "Optimiser les performances des campagnes grâce à l'analyse des données et aux stratégies de retargeting",
    ],
    programme: [
      {
        jour: 'Jour 1 : Introduction et création de la base publicitaire (7 heures)',
        matin: {
          titre: 'Matin (9h - 13h) - Introduction aux publicités',
          contenu: [
            'Différences clés entre Facebook Ads et LinkedIn Ads',
            "Présentation des objectifs publicitaires et cas d'utilisation",
            "Création et optimisation d'une page Facebook professionnelle",
            'Configuration du compte publicitaire Facebook et LinkedIn',
          ],
        },
        apresMidi: {
          titre: 'Après-midi (14h - 17h) - Fondamentaux Facebook',
          contenu: [
            'Présentation de Meta Business Suite et des fonctionnalités principales',
            "Création de votre première campagne avec l'outil Boost",
            'Définir et créer des audiences cibles sur Facebook et LinkedIn',
            "Utilisation d'audiences personnalisées et lookalike",
          ],
        },
      },
      {
        jour: 'Jour 2 : Techniques avancées pour des campagnes performantes (7 heures)',
        matin: {
          titre: 'Matin (9h - 13h) - Stratégies publicitaires avancées',
          contenu: [
            'Optimisation des campagnes Facebook Ads et LinkedIn Ads',
            'Stratégies de contenu pour des publicités engageantes',
            'Suivi des performances publicitaires via Facebook Analytics et LinkedIn Campaign Manager',
            "Utilisation d'outils de veille concurrentielle",
          ],
        },
        apresMidi: {
          titre: 'Après-midi (14h - 17h) - Création de publicités sponsorisées',
          contenu: [
            'Publicités interactives et multi-objectifs (engagement, trafic, conversion)',
            'Techniques pour augmenter les taux de clics et de conversion',
            'Gestion des budgets publicitaires sur Facebook et LinkedIn',
            'Résolution des problèmes fréquents (ex : compte désactivé)',
          ],
        },
      },
      {
        jour: 'Jour 3 : Retargeting et stratégie de scaling (7 heures)',
        matin: {
          titre: 'Matin (9h - 13h) - Retargeting et remarketing',
          contenu: [
            'Mise en place de campagnes de retargeting sur Facebook et LinkedIn',
            "Création d'audiences basées sur les visiteurs du site web",
            'Ajustement des budgets pour maximiser les résultats',
            'Optimisation des campagnes à grande échelle',
          ],
        },
        apresMidi: {
          titre: 'Après-midi (14h - 17h) - Analyse et optimisation',
          contenu: [
            'Analyse des KPI : CTR, CPM, ROAS',
            'Amélioration continue grâce aux rapports publicitaires',
            'Alignement des publicités sur les objectifs commerciaux',
            'Optimisation des visuels et des textes publicitaires',
          ],
        },
      },
      {
        jour: 'Jour 4 : Gestion avancée et mise en pratique (7 heures)',
        matin: {
          titre: 'Matin (9h - 13h) - LinkedIn Ads et fonctionnalités avancées',
          contenu: [
            'Création et gestion des publicités LinkedIn (text ads, sponsored content)',
            'Stratégies pour une audience professionnelle',
            "Création et gestion d'une boutique Facebook",
            'Introduction aux fonctionnalités Facebook Live et Instagram Ads',
          ],
        },
        apresMidi: {
          titre: 'Après-midi (14h - 17h) - Mise en pratique complète',
          contenu: [
            "Mise en place d'une campagne complète Facebook et LinkedIn avec suivi des résultats",
            "Élaboration d'un plan publicitaire personnalisé pour chaque participant",
            'Revue des acquis et des résultats',
            'Questions-réponses et conseils pour aller plus loin',
          ],
        },
      },
    ],
    modalites: {
      pedagogiques:
        "Formation en présentiel individuel, utilisant une méthode expositive et démonstrative, avec une alternance d'exposés théoriques et de cas pratiques. Cette approche pédagogique est conçue pour diversifier les modes d'apprentissage et ainsi favoriser l'acquisition des connaissances et compétences des apprenants.",
      techniques:
        'Salle de formation équipée de matériel informatique haut de gamme connectée à internet. Support de cours (Projet et ressources téléchargeables disponibles sur votre espace apprenant sur Notion, un hébergement Web, quizz, fiches pratiques).',
      evaluation:
        "Quiz en ligne via EVALBOX (20 questions par bloc), travaux pratiques, grille d'analyse des compétences. Ces modalités d'évaluation permettent d'assurer une validation progressive et complète des acquis tout au long de la formation.",
      sanction:
        "Un certificat de réalisation de formation. Une feuille d'émargement individuelle sera conjointement signée par le formateur et chaque stagiaire.",
      niveau: 'Aucune certification obtenue',
    },
    contact: {
      email: 'aurelien@gestionmax.fr',
      telephone: '06.46.02.24.68',
      referent: 'Aurélien LAVAYSSIERE - Référent pédagogique et qualité',
    },
    accessibilite:
      "Votre organisme est engagé dans une démarche d'accueil et d'accompagnement en formation des personnes en situation de handicap. Dans ce cadre, nous proposons : Un entretien téléphonique pour vous accompagner individuellement, D'évaluer vos besoins spécifiques au regard d'une situation de handicap, De mettre en œuvre les adaptations pédagogiques, organisationnelles et matériels nécessaires.",
    dates: {
      creation: '28/11/24',
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
                      <Facebook className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">Facebook Ads</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Meta Business Suite</li>
                      <li>• Création de campagnes</li>
                      <li>• Ciblage d'audiences</li>
                      <li>• Optimisation des performances</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Linkedin className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">LinkedIn Ads</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Campaign Manager</li>
                      <li>• Publicités professionnelles</li>
                      <li>• Audience B2B</li>
                      <li>• Sponsored Content</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">Stratégies Avancées</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Retargeting et remarketing</li>
                      <li>• Audiences lookalike</li>
                      <li>• Scaling des campagnes</li>
                      <li>• A/B Testing</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">Analytics & Performance</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• KPI : CTR, CPM, ROAS</li>
                      <li>• Analyse des performances</li>
                      <li>• Rapports publicitaires</li>
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
