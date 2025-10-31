'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, MapPin, Euro, CheckCircle, Phone, Mail, Users, X } from 'lucide-react'

interface FormationWPDigitalModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FormationWPDigitalModal({ isOpen, onClose }: FormationWPDigitalModalProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const formationData = {
    titre: 'Création de son site internet (WordPress) + Stratégie de développement digital',
    code: 'A001-WP-DD',
    duree: '14 heures (2 jours)',
    niveau: 'Débutant',
    modalite: 'Présentiel individuel',
    prix: '980€',
    horaires: '9h à 13h et de 14h à 17h',
    prerequis: 'Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur',
    publicConcerne: 'Artisans, commerçants ou professions libérales',
    objectifs: [
      "Jour 1 : Apprendre à créer, personnaliser et gérer un site internet avec WordPress, en mettant l'accent sur la gestion du contenu, la personnalisation du design et l'ajout de fonctionnalités essentielles.",
      "Jour 2 : Comprendre les bases d'une stratégie de développement digital, incluant le SEO, la gestion des réseaux sociaux et l'utilisation de la publicité en ligne pour attirer et convertir des clients potentiels.",
    ],
    programme: [
      {
        jour: "Jour 1 : Création et gestion d'un site internet avec WordPress (7 heures)",
        matin: {
          titre: 'Matin (9h - 13h)',
          contenu: [
            "Introduction à WordPress : Qu'est-ce que WordPress ? Pourquoi choisir WordPress pour créer un site internet.",
            'Installation de WordPress : guide pratique pour installer son site sur son hébergeur.',
            'Configuration initiale : choisir un thème, régler les paramètres généraux (titre, fuseau horaire, langue, permaliens).',
            'Gestion de la structure du site : Création des pages essentielles (Accueil, À propos, Contact, Politique de confidentialité).',
            'Gestion des articles et catégories : pourquoi et comment organiser un blog.',
            'Mise en place des menus de navigation et sous-menus.',
          ],
        },
        apresMidi: {
          titre: 'Après-midi (14h - 17h)',
          contenu: [
            "Personnalisation de l'apparence du site : Choisir un thème adapté à votre activité (thèmes gratuits et payants).",
            'Personnalisation via le customizer : couleurs, typographies, menus et widgets.',
            "Introduction à l'éditeur Gutenberg (bloc de construction) pour une mise en page avancée sans coder.",
            'Ajout de fonctionnalités essentielles : Installer des plugins (sécurité, SEO, formulaires de contact).',
            'Introduction à un constructeur de pages (ex. Elementor) pour personnaliser davantage le design.',
            'Gérer la sécurité et les sauvegardes de votre site.',
          ],
        },
      },
      {
        jour: 'Jour 2 : Stratégie de développement digital (7 heures)',
        matin: {
          titre: 'Matin (9h - 13h)',
          contenu: [
            'Définir les objectifs commerciaux sur internet : Déterminer les objectifs spécifiques de votre site.',
            'Identifier votre audience cible : définition des personas et de leurs besoins.',
            'Analyser la concurrence et les tendances du marché.',
            'Introduction au référencement naturel (SEO) : Comprendre les bases du SEO.',
            'Optimisation on-page : amélioration de la vitesse du site, structure des URL, maillage interne.',
            'Utilisation de plugins SEO (ex. Yoast SEO) pour optimiser vos pages et articles.',
          ],
        },
        apresMidi: {
          titre: 'Après-midi (14h - 17h)',
          contenu: [
            'Stratégie sur les réseaux sociaux : Importance des réseaux sociaux pour accroître la visibilité.',
            'Choisir les bonnes plateformes : Facebook, LinkedIn, Instagram, YouTube, etc.',
            'Stratégie de contenu : créer des publications engageantes et régulières.',
            'Publicité en ligne : Introduction aux publicités payantes (Facebook Ads, Google Ads).',
            'Définir un budget et cibler votre audience : comment atteindre les bonnes personnes avec un petit budget.',
            'Outils pour analyser et suivre la performance : Google Analytics, Matomo.',
            "Automatisation de la communication : gestion des campagnes d'emailing (Mailchimp, Brevo).",
            "Conclusion et mise en place d'un plan d'action digital.",
          ],
        },
      },
    ],
    modalites: {
      pedagogiques:
        "Formation en présentiel individuel (méthode expositive et démonstrative) avec alternance d'exposés théoriques et de cas pratiques.",
      techniques:
        'Salle de formation équipée de matériel informatique haut de gamme connectée à internet. Support de cours (Projet et ressources téléchargeables sur Notion, un hébergement Web, quizz, fiches pratiques).',
      evaluation:
        "Quizz d'une dizaine de questions par l'intermédiaire de notre plateforme d'évaluation en ligne EVALBOX. Grille d'analyse des compétences, travaux pratiques.",
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
