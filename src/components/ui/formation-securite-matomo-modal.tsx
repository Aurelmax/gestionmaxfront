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
  Shield,
  BarChart3,
} from 'lucide-react'

interface FormationSecuriteMatomoModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FormationSecuriteMatomoModal({
  isOpen,
  onClose,
}: FormationSecuriteMatomoModalProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const formationData = {
    titre: 'Gestion de la sécurité de votre site & analyse Web',
    code: 'A009-SW-MA',
    duree: '14 heures (2 jours)',
    niveau: 'Débutant',
    modalite: 'Présentiel individuel',
    prix: '980€',
    horaires: '9h à 13h et de 14h à 17h',
    prerequis: 'Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur',
    publicConcerne: 'Artisans, commerçants ou professions libérales',
    objectifs: [
      "Jour 1 : À l'issue de la première journée, l'apprenant(e) sera capable de mettre en place une stratégie globale de gestion de la sécurité de son site WordPress, incluant l'exécution des mises à jour de sécurité, de maintenance et fonctionnelles, ainsi que la sécurisation et la sauvegarde de son site.",
      "Jour 2 : À l'issue de la deuxième journée, l'apprenant(e) sera capable d'installer et de configurer Matomo pour Suivre et comprendre les statistiques de son sites web grâce à un outil gratuit et en conformité RGPD : Matomo Analytics.",
    ],
    programme: [
      {
        jour: 'Jour 1 : Sécurité WordPress (7 heures)',
        matin: {
          titre: 'Matin (9h - 13h) - Les fondamentaux de la sécurité',
          contenu: [
            'Importance des mises à jour (sécurité, maintenance, fonctionnelles).',
            'Meilleures pratiques pour les identifiants et mots de passe.',
            'Création d\'un compte administrateur "fantôme".',
            "Modification de l'accès à la page de connexion.",
            'Techniques de blocage des tentatives de connexion excessives.',
            'Blocage des URL malicieuses.',
            "Présentation d'un plugin tout-en-un pour sécuriser le site.",
          ],
        },
        apresMidi: {
          titre: 'Après-midi (14h - 17h) - Mise en pratique',
          contenu: [
            'Installation du plugin de sécurité.',
            "Exercices d'application et simulations.",
            'Sauvegarde de votre site (méthodes et outils).',
            'Restauration de votre site.',
            'Import et export de données.',
            'Quiz de fin de journée pour évaluer les connaissances acquises.',
          ],
        },
      },
      {
        jour: 'Jour 2 : Analyse statistique Web avec Matomo (7 heures)',
        matin: {
          titre: 'Matin (9h - 13h) - Introduction à Matomo',
          contenu: [
            'Présentation de Matomo et de ses fonctionnalités.',
            'Installation de Matomo sur un serveur.',
            'Configuration initiale et intégration avec WordPress.',
            'Mise en place de balises de suivi.',
          ],
        },
        apresMidi: {
          titre: 'Après-midi (14h - 17h) - Analyse et interprétation des données',
          contenu: [
            'Lecture et interprétation des rapports de Matomo.',
            'Mise en place et suivi des objectifs (conversions).',
            'Analyse du comportement des utilisateurs sur le site.',
            "Stratégies d'amélioration basées sur les données analytiques.",
            'Cas pratiques : interprétation de rapports et élaboration de recommandations.',
          ],
        },
      },
    ],
    modalites: {
      pedagogiques:
        "Formation en présentiel individuel (méthode expositive et démonstrative) avec alternance d'exposés théoriques et de cas pratiques. Cette méthode permet de varier les modes d'apprentissage pour favoriser l'acquisition des connaissances et des compétences.",
      techniques:
        'Salle de formation équipée de matériel informatique haut de gamme connectée à internet. Support de cours (Projet et ressources téléchargeables sur Notion, un hébergement Web, quizz, fiches pratiques).',
      evaluation:
        "Quizz d'une vingtaine de questions par l'intermédiaire de notre plateforme d'évaluation en ligne EVALBOX. Grille d'analyse des compétences, travaux pratiques.",
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
                      <Shield className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">Sécurité WordPress</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Mises à jour de sécurité</li>
                      <li>• Protection contre les attaques</li>
                      <li>• Sauvegarde et restauration</li>
                      <li>• Maintenance préventive</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">Analytics avec Matomo</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Installation et configuration</li>
                      <li>• Analyse des statistiques</li>
                      <li>• Conformité RGPD</li>
                      <li>• Optimisation des performances</li>
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
