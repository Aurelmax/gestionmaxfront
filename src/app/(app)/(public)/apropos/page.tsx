'use client'

import { useState } from 'react'
import { PublicLayout } from '@/components/layouts/public/PublicLayout'

export const dynamic = 'force-dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CVModal } from '@/components/ui/cv-modal'
import {
  Users,
  BookOpen,
  Shield,
  Clock,
  Download,
  ExternalLink,
  CheckCircle,
  Mail,
  Phone,
  Award,
  CheckCircle2,
  Book,
} from 'lucide-react'
import Image from 'next/image'

export default function AproposPage() {
  const [isCVModalOpen, setIsCVModalOpen] = useState(false)

  const handleOpenCVModal = () => {
    setIsCVModalOpen(true)
  }

  const handleCloseCVModal = () => {
    setIsCVModalOpen(false)
  }
  const stats = [
    {
      icon: BookOpen,
      title: 'Formations',
      value: '120+',
      subtitle: 'Sessions réalisées',
      color: 'text-blue-600',
    },
    {
      icon: Users,
      title: 'Apprenants',
      value: '500+',
      subtitle: 'Personnes formées',
      color: 'text-green-600',
    },
    {
      icon: Shield,
      title: 'Satisfaction',
      value: '98%',
      subtitle: 'Taux satisfaction',
      color: 'text-orange-600',
    },
    {
      icon: Clock,
      title: 'Expérience',
      value: '8',
      subtitle: "Années d'expertise",
      color: 'text-purple-600',
    },
  ]

  const certifications = [
    {
      icon: Award,
      title: 'Qualiopi',
      description: 'Certification qualité des organismes de formation',
      button: 'N° 2024-QUAL-1234',
      color: 'text-blue-600',
    },
    {
      icon: CheckCircle2,
      title: 'OPCO',
      description: 'Organisme Paritaire Collecteur Agréé pour la formation professionnelle',
      button: 'Toutes nos formations',
      color: 'text-green-600',
    },
    {
      icon: Book,
      title: 'Datadock',
      description: 'Référencement qualité des organismes de formation',
      button: 'Référencé depuis 2017',
      color: 'text-purple-600',
    },
  ]

  const methodPoints = [
    "Approche pratique avec cas d'usage réels",
    'Groupes restreints pour un suivi personnalisé',
    'Support de cours détaillé fourni',
    'Évaluations continues et certificat de réussite',
    'Support technique 3 mois post-formation',
  ]

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 overflow-hidden">
        <Image
          src="/formation-wordpress-antibes.webp"
          alt="À propos GestionMax - Formateur WordPress certifié Qualiopi indépendant à Antibes depuis 8 ans"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">À propos de GestionMax Formateur</h1>
          <p className="text-xl text-gray-100 max-w-4xl mx-auto">
            Formateur indépendant certifié Qualiopi avec plus de 8 ans d'expérience dans
            l'enseignement WordPress. Passionné par la transmission de connaissances et
            l'accompagnement personnalisé de chaque apprenant.
          </p>
        </div>
      </section>

      {/* Votre formateur expert */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text and Features */}
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Votre formateur expert</h2>
              <p className="text-lg text-gray-600 mb-8">
                Formateur indépendant certifié Qualiopi avec plus de 8 ans d'expérience dans
                l'enseignement WordPress. Passionné par la transmission de connaissances et
                l'accompagnement personnalisé de chaque apprenant.
              </p>

              <Button
                onClick={handleOpenCVModal}
                className="bg-[#1f3b8e] hover:bg-[#7eb33f] text-white px-6 py-3 rounded-lg mb-4 inline-flex items-center"
              >
                <Download className="h-5 w-5 mr-2" />
                <ExternalLink className="h-4 w-4 ml-2" />
                Consulter le CV du formateur
              </Button>

              <p className="text-sm text-gray-500 mb-8">
                Conformément aux exigences Qualiopi, notre CV est disponible pour consultation
              </p>

              <div className="space-y-4">
                {[
                  'Certification Qualiopi (7 indicateurs)',
                  'Référencement Datadock',
                  'Formations éligibles CPF',
                  'Suivi personnalisé post-formation',
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Statistics */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <Card key={index} className="p-6 text-center shadow-lg">
                    <CardContent className="p-0">
                      <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{stat.title}</h3>
                      <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                      <p className="text-sm text-gray-600">{stat.subtitle}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications et agréments */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Certifications et agréments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {certifications.map((cert, index) => {
              const Icon = cert.icon
              return (
                <Card key={index} className="p-8 text-center shadow-lg">
                  <CardContent className="p-0">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <Icon className={`h-8 w-8 ${cert.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{cert.title}</h3>
                    <p className="text-gray-600 mb-6">{cert.description}</p>
                    <Button className="bg-brand-secondary hover:bg-brand-primary text-white px-4 py-2 rounded-lg">
                      {cert.button}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Méthode pédagogique et Informations légales */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Méthode pédagogique */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Notre méthode pédagogique</h3>
              <div className="space-y-4">
                {methodPoints.map((point, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Informations légales */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Informations légales</h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Raison sociale:</strong> GestionMax
                </p>
                <p>
                  <strong>Statut juridique:</strong> Entreprise individuelle
                </p>
                <p>
                  <strong>SIRET:</strong> 483 797 213 00061
                </p>
                <p>
                  <strong>N° déclaration d'activité:</strong> 93 06 107 8906
                </p>
                <p>
                  <strong>Certification Qualiopi:</strong> QUA230C60046
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Cet enregistrement ne vaut pas agrément de l'État (Article L.6352-12 du Code du
                travail)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">
            Une question ? Parlons de votre projet !
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Chaque projet est unique. Contactez-moi pour discuter de vos besoins et créer une
            formation adaptée à vos objectifs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#1f3b8e] hover:bg-[#7eb33f] text-white px-8 py-3 rounded-lg">
              <Mail className="h-5 w-5 mr-2" />
              aurelien@gestionmax.fr
            </Button>
            <Button
              variant="outline"
              className="border-[#1f3b8e] text-[#1f3b8e] hover:bg-[#7eb33f] hover:text-white px-8 py-3 rounded-lg"
            >
              <Phone className="h-5 w-5 mr-2" />
              06 46 02 24 68
            </Button>
          </div>
        </div>
      </section>

      {/* Modal CV */}
      <CVModal isOpen={isCVModalOpen} onClose={handleCloseCVModal} />
    </PublicLayout>
  )
}
