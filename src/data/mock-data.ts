import { User, Programme, Apprenant, RendezVous } from '@/types/common'

export const MOCK_USERS: User[] = [
  {
    id: '1',
    nom: 'Dubois',
    prenom: 'Marie',
    email: 'marie.dubois@gestionmax.fr',
    role: 'ADMIN',
    avatar: '/images/avatars/admin.jpg',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2025-01-01T10:00:00Z'),
  },
  {
    id: '2',
    nom: 'Martin',
    prenom: 'Pierre',
    email: 'pierre.martin@gestionmax.fr',
    role: 'FORMATEUR',
    createdAt: new Date('2024-02-01T10:00:00Z'),
    updatedAt: new Date('2025-01-01T10:00:00Z'),
  },
  {
    id: '3',
    nom: 'Dupont',
    prenom: 'Sophie',
    email: 'sophie.dupont@example.com',
    role: 'BENEFICIAIRE',
    createdAt: new Date('2024-11-01T10:00:00Z'),
    updatedAt: new Date('2025-01-01T10:00:00Z'),
  },
]

export const MOCK_PROGRAMMES: Programme[] = [
  {
    id: '1',
    codeFormation: 'A001-WP-DD',
    titre: 'Création de son site internet (WordPress) + Stratégie de développement digital',
    description: `Formation complète en 2 jours pour artisans, commerçants et professions libérales.

PRÉREQUIS : Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur.

PUBLIC CONCERNÉ : Artisans, commerçants ou professions libérales.

DURÉE : 14 heures ou 2 jours
HORAIRES : 9h à 13h et de 14h à 17h

OBJECTIFS PÉDAGOGIQUES :
Jour 1 : Apprendre à créer, personnaliser et gérer un site internet avec WordPress, en mettant l'accent sur la gestion du contenu, la personnalisation du design et l'ajout de fonctionnalités essentielles.

Jour 2 : Comprendre les bases d'une stratégie de développement digital, incluant le SEO, la gestion des réseaux sociaux et l'utilisation de la publicité en ligne pour attirer et convertir des clients potentiels.

PROGRAMME DÉTAILLÉ :

JOUR 1 - Création et gestion d'un site internet avec WordPress (7 heures)
MATIN (9h - 13h) :
1. Introduction à WordPress
   - Qu'est-ce que WordPress ? Pourquoi choisir WordPress
   - Installation de WordPress : guide pratique
   - Configuration initiale : thème, paramètres généraux

2. Gestion de la structure du site
   - Création des pages essentielles (Accueil, À propos, Contact, Politique de confidentialité)
   - Gestion des articles et catégories
   - Mise en place des menus de navigation

APRÈS-MIDI (14h - 17h) :
3. Personnalisation de l'apparence
   - Choix d'un thème adapté à votre activité
   - Personnalisation via le customizer
   - Introduction à l'éditeur Gutenberg

4. Ajout de fonctionnalités essentielles
   - Installation de plugins (sécurité, SEO, formulaires)
   - Introduction à Elementor
   - Gestion de la sécurité et sauvegardes

JOUR 2 - Stratégie de développement digital (7 heures)
MATIN (9h - 13h) :
1. Définir les objectifs commerciaux
   - Objectifs spécifiques du site
   - Identification de l'audience cible
   - Analyse de la concurrence

2. Introduction au SEO
   - Bases du référencement naturel
   - Optimisation on-page
   - Utilisation de plugins SEO

APRÈS-MIDI (14h - 17h) :
3. Stratégie sur les réseaux sociaux
   - Importance des réseaux sociaux
   - Choix des plateformes
   - Stratégie de contenu

4. Publicité en ligne et outils
   - Introduction aux publicités payantes
   - Définir un budget et cibler
   - Outils d'analyse (Google Analytics, Matomo)
   - Automatisation de la communication

5. Conclusion et plan d'action
   - Élaboration d'un plan d'action
   - Suivi et ajustement
   - Questions-réponses

MODALITÉS :
- Formation en présentiel individuel
- Méthode expositive et démonstrative
- Alternance d'exposés théoriques et de cas pratiques
- Support de cours sur Notion
- Évaluation par quizz sur EVALBOX
- Certificat de réalisation de formation

FORMATEUR : Aurélien LAVAYSSIERE
Contact : aurelien@gestionmax.fr - 06.46.02.24.68`,
    duree: 14,
    niveau: 'DEBUTANT',
    modalites: 'PRESENTIEL',
    prix: 980,
    statut: 'PUBLIE',
    formateurs: ['2'],
    competences: [
      'WordPress',
      'SEO',
      'Réseaux sociaux',
      'Publicité en ligne',
      'Google Analytics',
      'Elementor',
      'Yoast SEO',
      'Gutenberg',
      'Elementor',
      'Wordfence',
      'Contact Form 7',
      'Mailchimp',
      'Brevo',
    ],
    createdAt: new Date('2025-01-30T10:00:00Z'),
    updatedAt: new Date('2025-01-30T10:00:00Z'),
  },
  {
    id: '2',
    codeFormation: 'A008-BD-WC',
    titre: 'Marketing digital avec Brevo + Techniques de vente en ligne avec WooCommerce',
    description:
      'Formation complète en 2 jours : maîtrise du marketing digital avec Brevo (emailing, automatisation) + techniques de vente en ligne avec WooCommerce (gestion produits, paiements, conversion)',
    duree: 14,
    niveau: 'DEBUTANT',
    modalites: 'PRESENTIEL',
    prix: 980,
    statut: 'PUBLIE',
    formateurs: ['2'],
    competences: [
      'Brevo',
      'Emailing',
      'Automatisation',
      'WooCommerce',
      'E-commerce',
      'Conversion',
      'Marketing digital',
      'SMS Marketing',
    ],
    createdAt: new Date('2025-02-01T10:00:00Z'),
    updatedAt: new Date('2025-02-01T10:00:00Z'),
  },
  {
    id: '3',
    codeFormation: 'A009-SW-MA',
    titre: 'Gestion de la sécurité de votre site & analyse Web',
    description:
      "Formation complète en 2 jours : sécurisation et maintenance d'un site WordPress + analyse des statistiques avec Matomo (conforme RGPD)",
    duree: 14,
    niveau: 'DEBUTANT',
    modalites: 'PRESENTIEL',
    prix: 980,
    statut: 'PUBLIE',
    formateurs: ['2'],
    competences: [
      'Sécurité WordPress',
      'Maintenance',
      'Sauvegarde',
      'Matomo',
      'Analytics',
      'RGPD',
      'Sécurisation',
      'Statistiques',
    ],
    createdAt: new Date('2025-02-05T10:00:00Z'),
    updatedAt: new Date('2025-02-05T10:00:00Z'),
  },
  {
    id: '4',
    codeFormation: 'A010-WP-IM',
    titre: 'Créer et Gérer un Site WordPress + Stratégie de Contenu Inbound Marketing',
    description:
      "Formation complète en 3 jours : création et gestion d'un site WordPress + stratégie de contenu inbound marketing pour attirer, convertir et fidéliser une audience",
    duree: 21,
    niveau: 'DEBUTANT',
    modalites: 'PRESENTIEL',
    prix: 1470,
    statut: 'PUBLIE',
    formateurs: ['2'],
    competences: [
      'WordPress',
      'Inbound Marketing',
      'Stratégie de contenu',
      'SEO',
      'Personas',
      'Calendrier éditorial',
      'Google Analytics',
      'Matomo',
      'Brevo',
      'Réseaux sociaux',
    ],
    createdAt: new Date('2025-02-10T10:00:00Z'),
    updatedAt: new Date('2025-02-10T10:00:00Z'),
  },
  {
    id: '5',
    codeFormation: 'A011-SW-WC',
    titre: 'SEO les fondamentaux (SEOPRESS) & Techniques de Vente WooCommerce',
    description:
      "Formation complète en 2 jours : maîtrise des bases du référencement naturel (SEO) et configuration de SEOPress pour optimiser la visibilité d'un site WordPress",
    duree: 14,
    niveau: 'INTERMEDIAIRE',
    modalites: 'PRESENTIEL',
    prix: 980,
    statut: 'PUBLIE',
    formateurs: ['2'],
    competences: [
      'SEO',
      'SEOPress',
      'Google Search Console',
      'Google Analytics',
      'Mots-clés',
      'Optimisation technique',
      'Netlinking',
      'Sitemap XML',
      'Audit SEO',
    ],
    createdAt: new Date('2025-02-15T10:00:00Z'),
    updatedAt: new Date('2025-02-15T10:00:00Z'),
  },
  {
    id: '6',
    codeFormation: 'A012-CV-WEB-WC',
    titre: 'Maîtriser Canva pour le web, les réseaux sociaux et la vente en ligne',
    description:
      'Formation complète en 2 jours : création et optimisation de visuels professionnels avec Canva pour le web, les réseaux sociaux et la vente en ligne',
    duree: 14,
    niveau: 'DEBUTANT',
    modalites: 'PRESENTIEL',
    prix: 980,
    statut: 'PUBLIE',
    formateurs: ['2'],
    competences: [
      'Canva',
      'Design graphique',
      'Réseaux sociaux',
      'Web',
      'Publicité en ligne',
      'Optimisation visuelle',
      'Identité de marque',
      'Création de contenu',
    ],
    createdAt: new Date('2025-02-20T10:00:00Z'),
    updatedAt: new Date('2025-02-20T10:00:00Z'),
  },
  {
    id: '7',
    codeFormation: 'A014-FB-LI',
    titre: 'Maîtriser Facebook Ads et LinkedIn Ads pour une stratégie publicitaire efficace',
    description:
      'Formation complète en 4 jours : maîtrise des publicités Facebook et LinkedIn, création de campagnes performantes, retargeting et optimisation des performances',
    duree: 28,
    niveau: 'INTERMEDIAIRE',
    modalites: 'PRESENTIEL',
    prix: 1960,
    statut: 'PUBLIE',
    formateurs: ['2'],
    competences: [
      'Facebook Ads',
      'LinkedIn Ads',
      'Meta Business Suite',
      'Campagnes publicitaires',
      'Retargeting',
      'Analytics',
      'Audiences',
      'Optimisation',
      'ROAS',
      'CTR',
    ],
    createdAt: new Date('2025-02-25T10:00:00Z'),
    updatedAt: new Date('2025-02-25T10:00:00Z'),
  },
  {
    id: '8',
    codeFormation: 'A015-IA-CGPT',
    titre: 'Génération de contenu avec ChatGPT + Automatisation Marketing',
    description:
      "Formation complète en 2 jours : maîtrise de ChatGPT pour la génération de contenu et mise en place d'automatisations marketing avec Make, Brevo et autres outils",
    duree: 14,
    niveau: 'DEBUTANT',
    modalites: 'PRESENTIEL',
    prix: 1960,
    statut: 'PUBLIE',
    formateurs: ['2'],
    competences: [
      'ChatGPT',
      'IA générative',
      'Automatisation',
      'Make',
      'Brevo',
      'Marketing automation',
      'Génération de contenu',
      'Workflows',
      'No-code',
      'Productivité',
    ],
    createdAt: new Date('2025-02-28T10:00:00Z'),
    updatedAt: new Date('2025-02-28T10:00:00Z'),
  },
]

export const MOCK_APPRENANTS: Apprenant[] = [
  {
    id: '1',
    nom: 'Dupont',
    prenom: 'Sophie',
    email: 'sophie.dupont@example.com',
    telephone: '0612345678',
    dateNaissance: '1995-03-15',
    adresse: '12 Rue de la Paix, 75001 Paris',
    statut: 'ACTIF',
    programmes: ['1'],
    progression: 65,
    createdAt: new Date('2024-12-01T10:00:00Z'),
    updatedAt: new Date('2025-01-15T14:30:00Z'),
  },
  {
    id: '2',
    nom: 'Bernard',
    prenom: 'Lucas',
    email: 'lucas.bernard@example.com',
    telephone: '0698765432',
    dateNaissance: '1992-07-22',
    adresse: '8 Avenue Victor Hugo, 06000 Nice',
    statut: 'ACTIF',
    programmes: ['1', '2'],
    progression: 42,
    createdAt: new Date('2024-11-15T14:30:00Z'),
    updatedAt: new Date('2025-01-10T09:00:00Z'),
  },
]

export const MOCK_RENDEZ_VOUS: RendezVous[] = [
  {
    id: '1',
    programmeId: '1',
    programmeTitre:
      'Création de son site internet (WordPress) + Stratégie de développement digital',
    client: {
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie.dupont@email.com',
      telephone: '06.12.34.56.78',
      entreprise: 'Boulangerie Dupont',
    },
    type: 'positionnement',
    statut: 'confirme',
    date: '2025-02-15',
    heure: '10:00',
    duree: 60,
    lieu: 'presentiel',
    adresse: '123 Rue de la Paix, 06000 Nice',
    notes: 'Premier contact pour évaluer le niveau et les besoins',
    rappelEnvoye: true,
    createdAt: '2025-01-30T10:00:00Z',
    updatedAt: '2025-01-30T10:00:00Z',
    createdBy: '2',
  },
  {
    id: '2',
    programmeId: '2',
    programmeTitre: 'Marketing digital avec Brevo + Techniques de vente en ligne avec WooCommerce',
    client: {
      nom: 'Martin',
      prenom: 'Pierre',
      email: 'pierre.martin@email.com',
      telephone: '06.87.65.43.21',
      entreprise: 'Électricité Martin',
    },
    type: 'information',
    statut: 'enAttente',
    date: '2025-02-20',
    heure: '14:30',
    duree: 45,
    lieu: 'visio',
    lienVisio: 'https://meet.google.com/abc-defg-hij',
    notes: "Demande d'informations sur les formations marketing digital",
    rappelEnvoye: false,
    createdAt: '2025-01-31T14:00:00Z',
    updatedAt: '2025-01-31T14:00:00Z',
    createdBy: '2',
  },
  {
    id: '3',
    programmeId: '3',
    programmeTitre: 'Gestion de la sécurité de votre site & analyse Web',
    client: {
      nom: 'Bernard',
      prenom: 'Sophie',
      email: 'sophie.bernard@email.com',
      telephone: '06.98.76.54.32',
      entreprise: "Cabinet d'avocats Bernard",
    },
    type: 'inscription',
    statut: 'termine',
    date: '2025-01-25',
    heure: '09:00',
    duree: 90,
    lieu: 'presentiel',
    adresse: '456 Avenue des Champs, 06000 Nice',
    notes: 'Inscription confirmée, formation réalisée avec succès',
    rappelEnvoye: true,
    createdAt: '2025-01-20T09:00:00Z',
    updatedAt: '2025-01-25T18:00:00Z',
    createdBy: '2',
  },
]

// KPIs pour le dashboard
export const MOCK_STATS = {
  totalApprenants: 42,
  apprenantActifs: 35,
  totalProgrammes: 12,
  programmesActifs: 8,
  tauxReussite: 87,
  tauxSatisfaction: 4.5,
  prochainRendezVous: 5,
  documentsGeneres: 128,
}
