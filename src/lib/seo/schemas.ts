/**
 * Schema Markup JSON-LD pour le SEO
 * Documentation: https://schema.org/
 */

import { Organization, LocalBusiness, Course, FAQPage, WithContext } from 'schema-dts'

const baseUrl = process.env['NEXT_PUBLIC_BASE_URL'] || 'https://gestionmax.fr'

/**
 * Schema Organization - Informations sur l'entreprise
 */
export const organizationSchema: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${baseUrl}/#organization`,
  name: 'GestionMax Formation',
  legalName: 'GestionMax - Aurélien LAVAYSSIERE',
  url: baseUrl,
  logo: {
    '@type': 'ImageObject',
    '@id': `${baseUrl}/#logo`,
    url: `${baseUrl}/visuel-formation-gestionmax-antibes.png`,
    contentUrl: `${baseUrl}/visuel-formation-gestionmax-antibes.png`,
    width: 400,
    height: 120,
    caption: 'Logo GestionMax Formation',
  },
  image: `${baseUrl}/formation-wordpress-antibes.webp`,
  description:
    'Organisme de formation professionnelle spécialisé WordPress. Certifié Qualiopi, formations éligibles CPF, OPCO et FAF.',
  founder: {
    '@type': 'Person',
    name: 'Aurélien LAVAYSSIERE',
    jobTitle: 'Formateur WordPress Indépendant',
  },
  foundingDate: '2016',
  telephone: '+33-6-XX-XX-XX-XX', // À compléter
  email: 'contact@gestionmax.fr',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Antibes', // À compléter avec adresse exacte
    addressLocality: 'Antibes',
    addressRegion: 'Provence-Alpes-Côte d\'Azur',
    postalCode: '06600',
    addressCountry: 'FR',
  },
  areaServed: {
    '@type': 'GeoCircle',
    geoMidpoint: {
      '@type': 'GeoCoordinates',
      latitude: 43.5808,
      longitude: 7.1251,
    },
    geoRadius: '50000', // 50km autour d'Antibes
  },
  sameAs: [
    // À compléter avec vos réseaux sociaux
    'https://www.linkedin.com/company/gestionmax',
    'https://twitter.com/gestionmax',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+33-6-XX-XX-XX-XX',
    contactType: 'customer service',
    availableLanguage: ['French'],
    areaServed: 'FR',
  },
}

/**
 * Schema LocalBusiness - Entreprise locale à Antibes
 */
export const localBusinessSchema: WithContext<LocalBusiness> = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${baseUrl}/#localbusiness`,
  name: 'GestionMax Formation WordPress Antibes',
  image: {
    '@type': 'ImageObject',
    url: `${baseUrl}/formation-wordpress-antibes.webp`,
    contentUrl: `${baseUrl}/formation-wordpress-antibes.webp`,
  },
  description:
    'Centre de formation WordPress à Antibes. Formateur certifié Qualiopi avec 8 ans d\'expérience. Formations éligibles CPF pour professionnels et particuliers.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Antibes',
    addressLocality: 'Antibes',
    addressRegion: 'Provence-Alpes-Côte d\'Azur',
    postalCode: '06600',
    addressCountry: 'FR',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 43.5808,
    longitude: 7.1251,
  },
  url: baseUrl,
  telephone: '+33-6-XX-XX-XX-XX',
  email: 'contact@gestionmax.fr',
  priceRange: '€€',
  // Lien vers l'Organization pour éviter les doublons et renforcer la relation
  parentOrganization: {
    '@id': `${baseUrl}/#organization`,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  // aggregateRating supprimé - À activer uniquement si vous affichez réellement des avis sur la page
  // Sinon Google peut pénaliser pour incohérence contenu ↔ données structurées
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Formations WordPress',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Formation WordPress Débutant',
          description: 'Formation WordPress pour débutants, niveau initiation',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Formation WordPress Avancé',
          description: 'Formation WordPress avancée, développement et personnalisation',
        },
      },
    ],
  },
}

/**
 * Schema Course - Détails d'une formation
 */
export function createCourseSchema(course: {
  id: string
  titre: string
  description: string
  duree: number
  prix: number
  niveau: string
  competences: string[]
}): WithContext<Course> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${baseUrl}/catalogue/${course.id}#course`,
    name: course.titre,
    description: course.description,
    provider: {
      '@id': `${baseUrl}/#organization`,
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      courseWorkload: `PT${course.duree}H`,
      instructor: {
        '@type': 'Person',
        name: 'Aurélien LAVAYSSIERE',
        jobTitle: 'Formateur WordPress Certifié',
      },
      location: {
        '@type': 'Place',
        name: 'Antibes',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Antibes',
          addressCountry: 'FR',
        },
      },
    },
    offers: {
      '@type': 'Offer',
      price: course.prix.toString(),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
    },
    coursePrerequisites: course.niveau === 'Débutant' ? 'Aucun prérequis' : 'Connaissance de base WordPress',
    educationalLevel: course.niveau,
    teaches: course.competences,
    inLanguage: 'fr',
    isAccessibleForFree: false,
  }
}

/**
 * Schema FAQPage - Section Questions/Réponses
 */
export const faqPageSchema: WithContext<FAQPage> = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${baseUrl}/#faq`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Les formations sont-elles éligibles au CPF ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui, nos formations WordPress sont éligibles au Compte Personnel de Formation (CPF). Elles sont également prises en charge par les OPCO et le FAF pour les professionnels.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quelle est la durée des formations ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La durée varie selon le niveau et les objectifs. Les formations vont de 14 heures (2 jours) à 35 heures (5 jours). Nous proposons également des formations sur mesure adaptées à vos besoins.',
      },
    },
    {
      '@type': 'Question',
      name: 'Où se déroulent les formations ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Les formations se déroulent à Antibes (06) dans des salles équipées. Nous proposons également des formations en distanciel via visioconférence et des formations sur site dans votre entreprise.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quel est le taux de réussite des formations ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nous affichons un taux de réussite de 95% sur l\'ensemble de nos formations. Plus de 500 apprenants ont été formés avec succès depuis 2016.',
      },
    },
    {
      '@type': 'Question',
      name: 'Êtes-vous certifié Qualiopi ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Oui, GestionMax Formation est certifié Qualiopi depuis 2024. Cette certification atteste de la qualité de nos processus de formation et permet la prise en charge par les organismes financeurs (CPF, OPCO, FAF).',
      },
    },
    {
      '@type': 'Question',
      name: 'Comment se déroule le positionnement avant la formation ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Avant chaque formation, nous réalisons un entretien de positionnement gratuit pour évaluer votre niveau actuel, définir vos objectifs et personnaliser le programme. Cet entretien peut se faire en présentiel, par téléphone ou en visioconférence.',
      },
    },
  ],
}

/**
 * Fonction pour injecter les schemas dans le DOM
 */
export function injectSchema(schema: WithContext<Organization | LocalBusiness | Course | FAQPage>) {
  return {
    __html: JSON.stringify(schema),
  }
}
