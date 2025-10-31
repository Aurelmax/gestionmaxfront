'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PublicLayout } from '@/components/layouts/public/PublicLayout'
import { FormationCard } from '@/components/shared/FormationCard'
import { ModernFAQ } from '@/components/shared/ModernFAQ'
import { SchemaMarkup } from '@/components/seo/SchemaMarkup'
import { organizationSchema, localBusinessSchema, faqPageSchema } from '@/lib/seo/schemas'
import {
  ArrowRight,
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Search,
  Filter,
  CheckCircle,
  User,
  Target,
} from 'lucide-react'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [formations, setFormations] = useState<
    Array<{
      id: string
      titre: string
      description: string
      duree: number
      niveau: string
      modalites: string
      prix: number
      competences: string[]
    }>
  >([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFormations = async () => {
      try {
        const response = await fetch('/api/programmes')
        const result = await response.json()
        if (result.success) {
          // Transformer les données MongoDB pour correspondre à l'interface attendue
          const transformedData = result.data.map((programme: Record<string, unknown>) => ({
            id: programme['_id'],
            codeFormation: programme['codeFormation'],
            titre: programme['titre'],
            description: programme['description'],
            duree: programme['duree'],
            niveau: programme['niveau'],
            modalites: programme['modalites'],
            prix: programme['prix'],
            competences: ((programme['competences'] as unknown[]) || [])
              .map((comp: unknown) =>
                typeof comp === 'string' ? comp : (comp as { competence: string }).competence
              )
              .filter(
                (comp: string, index: number, arr: string[]) => arr.indexOf(comp) === index // Supprimer les doublons
              ),
          }))
          setFormations(transformedData)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des formations:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadFormations()
  }, [])

  // Stats pour le formateur (utilisées dans la section "Votre formateur certifié")
  const formateurStats = [
    { label: 'Apprenants formés', value: '500+', icon: Users },
    { label: 'Formations', value: '50+', icon: BookOpen },
    { label: 'Taux de réussite', value: '95%', icon: TrendingUp },
    { label: 'Certifié Qualiopi', value: '2024', icon: Award },
  ]

  // Filtrage des formations
  const filteredFormations = formations.filter(formation => {
    const matchesSearch =
      formation['titre'].toLowerCase().includes(searchQuery.toLowerCase()) ||
      formation['description'].toLowerCase().includes(searchQuery.toLowerCase()) ||
      formation['competences'].some((comp: string) =>
        comp.toLowerCase().includes(searchQuery.toLowerCase())
      )

    return matchesSearch
  })

  const categories = [
    { id: 'all', label: 'Toutes les formations' },
    { id: 'developpement', label: 'Développement' },
    { id: 'design', label: 'Design' },
    { id: 'data', label: 'Data Science' },
    { id: 'marketing', label: 'Marketing' },
  ]

  return (
    <PublicLayout>
      {/* Schema Markup pour le SEO */}
      <SchemaMarkup schema={[organizationSchema, localBusinessSchema, faqPageSchema]} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 overflow-hidden">
        <Image
          src="/formation-wordpress-antibes.webp"
          alt="Formation WordPress professionnelle à Antibes - Salle de formation moderne avec formateur certifié Qualiopi"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Formations WordPress Professionnelles</h1>
          <p className="text-xl text-gray-100 max-w-4xl mx-auto mb-8">
            Développez vos compétences WordPress avec un formateur certifié. Formations éligibles
            FAF & OPCO et conformes Qualiopi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-brand-primary hover:bg-brand-secondary text-white"
              asChild
            >
              <Link href="/catalogue">
                Découvrir nos formations
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white hover:text-brand-primary"
              asChild
            >
              <Link href="/contact">Demander un devis</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Votre formateur certifié */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Votre formateur certifié</h2>
              <p className="text-lg text-gray-600 mb-6">
                Formateur indépendant certifié Qualiopi avec plus de 8 ans d'expérience dans
                l'enseignement WordPress. Passionné par la transmission de connaissances et
                l'accompagnement personnalisé de chaque apprenant.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {formateurStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-brand-primary mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 rounded-lg shadow-lg overflow-hidden relative">
                <Image
                  src="/formateur-background.webp"
                  alt="Aurélien LAVAYSSIERE - Formateur WordPress certifié Qualiopi indépendant à Antibes avec 8 ans d'expérience"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/80 to-brand-secondary/80" />
                <div className="relative z-10 flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                      <User className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Formateur WordPress à Antibes
                    </h3>
                    <p className="text-white/90 text-sm mb-1">Aurélien LAVAYSSIERE</p>
                    <p className="text-white/90 text-sm">Certifié Qualiopi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Catalogue de Formations */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Notre Catalogue de Formations</h2>
            <p className="text-lg text-gray-600">
              Découvrez nos programmes de formation WordPress adaptés à tous les niveaux
            </p>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Rechercher une formation..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filtres
                </Button>
              </div>
            </div>

            {/* Catégories */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Grille des formations */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f3b8e] mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des formations...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFormations.slice(0, 6).map(formation => (
                <FormationCard key={formation.id} programme={formation} showDetails={true} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button size="lg" className="bg-[#7eb33f] hover:bg-[#1f3b8e] text-white" asChild>
              <Link href="/catalogue">Voir toutes les formations</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Processus pédagogique personnalisé */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Processus pédagogique personnalisé</h2>
            <p className="text-lg text-gray-600">Une approche adaptée à vos besoins et objectifs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Positionnement</h3>
              <p className="text-sm text-gray-600">
                Évaluation de votre niveau et définition de vos objectifs
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Planification</h3>
              <p className="text-sm text-gray-600">
                Création d'un parcours personnalisé adapté à votre rythme
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Formation</h3>
              <p className="text-sm text-gray-600">
                Apprentissage progressif avec accompagnement individuel
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Certification</h3>
              <p className="text-sm text-gray-600">
                Validation des acquis et obtention de votre certification
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Moderne */}
      <ModernFAQ />

      {/* CTA Section */}
      <section className="bg-[#1f3b8e] text-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à vous former ?</h2>
          <p className="text-lg mb-8 text-gray-100">
            Contactez-nous pour discuter de votre projet de formation
          </p>
          <Button size="lg" className="bg-[#7eb33f] hover:bg-[#1f3b8e] text-white" asChild>
            <Link href="/contact">Demander un devis</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  )
}
