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
  BookOpen,
  Target,
  TrendingUp,
  Share2,
} from 'lucide-react'

interface FormationWordPressInboundModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FormationWordPressInboundModal({
  isOpen,
  onClose,
}: FormationWordPressInboundModalProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const formationData = {
    titre: 'Créer et Gérer un Site WordPress + Stratégie de Contenu Inbound Marketing',
    code: 'A010-WP-IM',
    duree: '21 heures (3 jours)',
    niveau: 'Débutant',
    modalite: 'Présentiel individuel',
    prix: '1470€',
    horaires: '9h à 13h et de 14h à 17h',
    prerequis: 'Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur',
    publicConcerne: 'Artisans, commerçants ou professions libérales',
    objectifs: [
      'Jour 1 : Créer et gérer un site WordPress de manière autonome, avec une maîtrise des bases techniques et des fonctionnalités essentielles.',
      "Jour 2 : Comprendre les principes de l'Inbound Marketing et élaborer une stratégie de contenu performante",
      'Jour 3 : Mettre en place des outils et méthodes pour attirer, convertir et fidéliser une audience en ligne.',
    ],
    programme: [
      {
        jour: 'Jour 1 : Découverte et prise en main de WordPress (7 heures)',
        matin: {
          titre: 'Matin (9h - 13h) - Introduction à WordPress',
          contenu: [
            "Qu'est-ce que WordPress ? Ses avantages pour la création de sites web.",
            'Présentation des fonctionnalités principales : pages, articles, médias.',
            "Installation et configuration initiale : choix d'un hébergeur, installation de WordPress.",
            'Configuration de base : permaliens, fuseau horaire, langue.',
            'Création des premières pages : Accueil, À propos, Contact.',
            'Gestion des menus de navigation et des widgets.',
          ],
        },
        apresMidi: {
          titre: 'Après-midi (14h - 17h) - Personnalisation et fonctionnalités',
          contenu: [
            'Choisir et installer un thème adapté à son activité.',
            'Introduction au Customizer : typographies, couleurs, mise en page.',
            "Introduction à l'éditeur Gutenberg : ajouter et organiser des blocs.",
            'Installer des plugins indispensables : SEO, sécurité, formulaires de contact.',
            'Premiers réglages pour la sécurité et les sauvegardes.',
          ],
        },
      },
      {
        jour: "Jour 2 : Bases de l'Inbound Marketing et stratégie de contenu (7 heures)",
        matin: {
          titre: "Matin (9h - 13h) - Introduction à l'Inbound Marketing",
          contenu: [
            "Qu'est-ce que l'Inbound Marketing ? Principes et avantages.",
            "Comprendre le parcours client : de l'attraction à la fidélisation.",
            'Définir ses objectifs de contenu : trafic, conversion, engagement.',
            'Identifier son audience cible : qui sont vos clients potentiels ?',
            'Définir les besoins, attentes et comportements des personas.',
            'Élaborer des contenus adaptés à chaque étape du parcours client.',
          ],
        },
        apresMidi: {
          titre: 'Après-midi (14h - 17h) - Planification et optimisation',
          contenu: [
            'Choisir les types de contenu : articles de blog, vidéos, infographies, études de cas.',
            'Introduction à la recherche de mots-clés pour le SEO.',
            "Création d'un calendrier éditorial : fréquence, sujets, canaux.",
            'Rédiger des titres accrocheurs et optimiser les balises (title, meta description).',
            'Structurer les contenus avec des balises HTML (H1, H2, H3).',
            "Insérer des appels à l'action (CTA) pour inciter à l'engagement.",
          ],
        },
      },
      {
        jour: 'Jour 3 : Mise en pratique avec les outils (7 heures)',
        matin: {
          titre: 'Matin (9h - 13h) - Mise en œuvre de la stratégie',
          contenu: [
            'Publier un article optimisé pour le SEO avec Gutenberg.',
            'Ajouter des images, des vidéos et des liens internes/externes.',
            "Introduction aux outils de suivi d'impact du contenu (Google Analytics VS Matomo).",
            'Planifier et partager des contenus sur les réseaux sociaux.',
            'Découverte de plateformes comme Buffer ou Hootsuite pour gérer les publications.',
            'Introduction aux automatisations de campagnes avec Brevo.',
          ],
        },
        apresMidi: {
          titre: 'Après-midi (14h - 17h) - Fidélisation et suivi',
          contenu: [
            'Introduction aux techniques pour convertir les visiteurs en leads qualifiés (e-books, newsletters).',
            'Introduction aux indicateurs de performance (taux de clics, engagement, conversions).',
            'Ajuster la stratégie en fonction des données collectées.',
            'Quiz de fin de formation et mise en pratique.',
            "Ateliers pratiques pour consolider les compétences : création d'un article, planification d'une campagne.",
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

            {/* Compétences clés */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-[#1f3b8e]">
                  Compétences développées
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">WordPress</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Installation et configuration</li>
                      <li>• Gestion des contenus</li>
                      <li>• Personnalisation des thèmes</li>
                      <li>• Plugins essentiels</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">Inbound Marketing</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Stratégie de contenu</li>
                      <li>• Personas et parcours client</li>
                      <li>• Calendrier éditorial</li>
                      <li>• Optimisation SEO</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">Analytics & Performance</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Google Analytics / Matomo</li>
                      <li>• Indicateurs de performance</li>
                      <li>• Optimisation des conversions</li>
                      <li>• Suivi des campagnes</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Share2 className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">Diffusion & Automatisation</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Réseaux sociaux</li>
                      <li>• Outils de planification</li>
                      <li>• Automatisation Brevo</li>
                      <li>• Fidélisation client</li>
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
