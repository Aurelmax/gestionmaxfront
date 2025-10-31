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
  Mail as MailIcon,
  ShoppingCart,
} from 'lucide-react'

interface FormationBrevoWooCommerceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function FormationBrevoWooCommerceModal({
  isOpen,
  onClose,
}: FormationBrevoWooCommerceModalProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const formationData = {
    titre: 'Marketing digital avec Brevo + Techniques de vente en ligne avec WooCommerce',
    code: 'A008-BD-WC',
    duree: '14 heures (2 jours)',
    niveau: 'Débutant',
    modalite: 'Présentiel individuel',
    prix: '980€',
    horaires: '9h à 13h et de 14h à 17h',
    prerequis: 'Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur',
    publicConcerne: 'Artisans, commerçants ou professions libérales',
    objectifs: [
      "Jour 1 : Comprendre et maîtriser l'utilisation de Brevo pour la création de campagnes de marketing digital efficaces et automatisées, tout en analysant les performances des campagnes pour optimiser les résultats.",
      "Jour 2 : Apprendre à gérer un site WordPress avec WooCommerce, en mettant l'accent sur la gestion des produits et services, des paiements, des promotions et des stratégies pour maximiser les ventes et améliorer le taux de conversion.",
    ],
    programme: [
      {
        jour: 'Jour 1 : Marketing digital avec Brevo (7 heures)',
        matin: {
          titre: 'Matin (9h - 13h)',
          contenu: [
            'Introduction au marketing digital avec Brevo : Présentation de Brevo (anciennement Sendinblue) : ses fonctionnalités et ses avantages pour le marketing digital.',
            "Création et gestion d'un compte Brevo : paramétrage du compte, intégration avec le site web (WordPress ou autre).",
            'Utilisation de Brevo pour les campagnes email : Création de listes de contacts, segmentation de la base de données.',
            'Paramétrage des campagnes emailing : newsletters, emails automatiques, promotions.',
            "Automatisation des campagnes marketing : Introduction aux workflows d'automatisation.",
            'Automatisation des emails en fonction du comportement des utilisateurs (abonnement, panier abandonné, etc.).',
            "Analyse des résultats : Suivi des taux d'ouverture, de clics et autres indicateurs clés de performance (KPI) dans Brevo.",
            "Introduction aux SMS marketing : comment l'intégrer dans une stratégie de marketing digital.",
          ],
        },
        apresMidi: {
          titre: 'Après-midi (14h - 17h)',
          contenu: [
            "Optimisation des campagnes marketing : A/B Testing dans Brevo : tester différentes versions d'un email pour voir celle qui performe le mieux.",
            'Personnalisation des emails et segmentation avancée : comment créer des emails ciblés et pertinents.',
            "Mise en place d'une stratégie multicanal : email + SMS + notifications push pour un marketing digital intégré.",
            "Suivi et analyse des résultats : Mise en place de rapports détaillés pour mesurer l'efficacité des campagnes.",
            'Optimisation de la campagne en fonction des résultats obtenus.',
          ],
        },
      },
      {
        jour: 'Jour 2 : Techniques de vente en ligne avec WooCommerce (7 heures)',
        matin: {
          titre: 'Matin (9h - 13h)',
          contenu: [
            'Introduction à WooCommerce et gestion des produits : Présentation de WooCommerce : installation et configuration de base.',
            'Gestion des produits : ajouter, organiser et catégoriser les produits.',
            'Options de paiement : configuration des différents modes de paiement (PayPal, cartes bancaires, virements, etc.).',
            'Gestion des stocks : paramétrer les niveaux de stock et les alertes de réapprovisionnement.',
            'Configuration des options de livraison : tarifs de livraison, zones géographiques, transporteurs.',
            'Gestion des commandes : statut de la commande, gestion des retours et des remboursements.',
            'Mise en place des promotions : création de coupons de réduction, ventes flash, offres limitées.',
          ],
        },
        apresMidi: {
          titre: 'Après-midi (14h - 17h)',
          contenu: [
            'Stratégies pour améliorer le taux de conversion : Optimisation de la page produit : améliorer la présentation des produits pour augmenter les ventes.',
            'Mise en place des stratégies de vente croisée et montée en gamme (upsell et cross-sell).',
            'Utilisation des avis clients et témoignages pour renforcer la confiance.',
            "Extensions WooCommerce pour améliorer l'expérience client : gestion des avis, notifications personnalisées, intégration avec les réseaux sociaux.",
            'Suivi des performances avec les statistiques de WooCommerce : taux de conversion, panier moyen, produits populaires.',
            'Analyse des KPIs e-commerce : taux de conversion, abandon de panier, fidélisation.',
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
                      <MailIcon className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">Marketing digital avec Brevo</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Campagnes emailing automatisées</li>
                      <li>• Segmentation et personnalisation</li>
                      <li>• A/B Testing et optimisation</li>
                      <li>• SMS Marketing</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-[#1f3b8e]" />
                      <span className="font-medium">E-commerce avec WooCommerce</span>
                    </div>
                    <ul className="ml-7 space-y-1 text-sm text-gray-600">
                      <li>• Gestion des produits et stocks</li>
                      <li>• Configuration des paiements</li>
                      <li>• Stratégies de conversion</li>
                      <li>• Analyse des performances</li>
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
