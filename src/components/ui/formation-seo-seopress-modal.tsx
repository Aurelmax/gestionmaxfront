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
  Search,
  Target,
  BarChart3,
  Settings,
} from 'lucide-react'

interface FormationSeoSeopressModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FormationSeoSeopressModal({ isOpen, onClose }: FormationSeoSeopressModalProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const formationData = {
    titre: 'SEO les fondamentaux (SEOPRESS) & Techniques de Vente WooCommerce',
    code: 'A011-SW-WC',
    duree: '14 heures (2 jours)',
    niveau: 'Intermédiaire',
    modalite: 'Présentiel individuel',
    prix: '980€',
    horaires: '9h à 13h et de 14h à 17h (pauses incluses)',
    prerequis:
      "Avoir des connaissances de base sur WordPress, ou avoir suivi un module d'initiation",
    publicConcerne: 'Artisans, commerçants ou professions libérales',
    objectifs: [
      'Comprendre les bases du référencement naturel (SEO)',
      'Configurer et utiliser SEOPress pour optimiser un site WordPress',
      "Améliorer la visibilité d'un site web dans les moteurs de recherche",
      'Mettre en place une stratégie SEO durable et efficace',
    ],
    programme: [
      {
        jour: 'Jour 1 : Les bases du SEO et configuration de SEOPress (7 heures)',
        matin: {
          titre: 'Matin (9h00 - 13h00) - Comprendre le référencement naturel',
          contenu: [
            'Définition et importance du SEO',
            'Fonctionnement des moteurs de recherche (Google, Bing)',
            'Les trois piliers du SEO : optimisation technique, contenu optimisé, netlinking',
            'Les bonnes pratiques du SEO',
            "Qu'est-ce qu'un bon contenu ?",
            'Les erreurs SEO courantes à éviter',
          ],
        },
        apresMidi: {
          titre: 'Après-midi (14h00 - 17h00) - Découverte et configuration de SEOPress',
          contenu: [
            'Présentation de SEOPress : pourquoi choisir SEOPress ?',
            'Installation et activation du plugin',
            'Configuration initiale de SEOPress',
            'Paramétrage des titres et méta-descriptions',
            'Configuration du sitemap XML et soumission à Google Search Console',
            'Personnalisation des permaliens et gestion des redirections',
            'Exercice pratique : mise en place des paramètres SEOPress sur un site WordPress',
          ],
        },
      },
      {
        jour: 'Jour 2 : Optimisation SEO On-Page et suivi des performances (7 heures)',
        matin: {
          titre: 'Matin (9h00 - 13h00) - Optimisation On-Page',
          contenu: [
            'Recherche de mots-clés pertinents (Ubersuggest, Google Trends)',
            'Utilisation des balises H1, H2, H3 pour la hiérarchisation',
            'Optimisation des images (poids, balise ALT)',
            'Audit On-Page avec SEOPress',
            'Identification et correction des problèmes techniques',
            "Exercice pratique : optimisation d'un article ou d'une page pour le SEO",
          ],
        },
        apresMidi: {
          titre: 'Après-midi (14h00 - 17h00) - Suivi et amélioration continue',
          contenu: [
            'Intégration de Google Analytics dans SEOPress',
            'Interprétation des données de Google Search Console',
            'Suivi des positions avec SEOPress Insights',
            'Stratégie de netlinking et création de backlinks',
            'Gestion des erreurs 404 et des redirections',
            'Audit final du site et recommandations',
            "Mise en place d'une feuille de route SEO pour les prochains mois",
          ],
        },
      },
    ],
    modalites: {
      pedagogiques:
        'Formation en présentiel individuel, en utilisant une méthode expositive et démonstrative. Elle repose sur une alternance entre exposés théoriques et cas pratiques, afin de répondre aux besoins des apprenants adultes en formation professionnelle.',
      techniques:
        'Salle de formation équipée de matériel informatique haut de gamme connectée à internet. Support de cours (Projet et ressources téléchargeables disponibles sur votre espace apprenant sur Notion, un accès à ubersuggest et Answer the public, quizz, fiches pratiques).',
      evaluation:
        "Quiz en ligne via EVALBOX (environ 20 questions), travaux pratiques, grille d'analyse des compétences. Ces modalités permettent d'assurer une validation progressive et complète des acquis tout au long de la formation.",
      sanction:
        "Un certificat de réalisation de formation. Une feuille d'émargement individuelle sera conjointement signée par le formateur et chaque stagiaire.",
      niveau:
        "Cette formation n'est pas certifiante, mais un certificat de réalisation sera délivré à l'issue de la formation",
    },
    contact: {
      email: 'aurelien@gestionmax.fr',
      telephone: '06.46.02.24.68',
      referent: 'Aurélien LAVAYSSIERE - Référent pédagogique et qualité',
    },
    accessibilite:
      "Votre organisme est engagé dans une démarche d'accueil et d'accompagnement en formation des personnes en situation de handicap. Dans ce cadre, nous proposons : Un entretien téléphonique pour vous accompagner individuellement, D'évaluer vos besoins spécifiques au regard d'une situation de handicap, De mettre en œuvre les adaptations pédagogiques, organisationnelles et matériels nécessaires.",
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
                      <Search className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">SEO Fondamentaux</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Bases du référencement naturel</li>
                      <li>• Fonctionnement des moteurs de recherche</li>
                      <li>• Les trois piliers du SEO</li>
                      <li>• Bonnes pratiques et erreurs à éviter</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">SEOPress</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Installation et configuration</li>
                      <li>• Paramétrage titres et méta-descriptions</li>
                      <li>• Sitemap XML et Google Search Console</li>
                      <li>• Gestion des redirections</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">Optimisation On-Page</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Recherche de mots-clés</li>
                      <li>• Structure des balises H1, H2, H3</li>
                      <li>• Optimisation des images</li>
                      <li>• Audit et correction des problèmes</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">Suivi et Performance</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Google Analytics et Search Console</li>
                      <li>• Suivi des positions</li>
                      <li>• Stratégie de netlinking</li>
                      <li>• Feuille de route SEO</li>
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
