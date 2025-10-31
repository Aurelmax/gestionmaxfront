'use client'

import { useState, useMemo, useEffect } from 'react'
import { PublicLayout } from '@/components/layouts/public/PublicLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormationCard } from '@/components/shared/FormationCard'
import Image from 'next/image'
import { Search, SortAsc, SortDesc } from 'lucide-react'

export default function CataloguePage() {
  const [programmes, setProgrammes] = useState<
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
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNiveau, setSelectedNiveau] = useState('all')
  const [selectedModalite, setSelectedModalite] = useState('all')
  const [sortBy, setSortBy] = useState('default')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    const loadProgrammes = async () => {
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
          setProgrammes(transformedData)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des programmes:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadProgrammes()
  }, [])

  // Filtrage et tri des programmes
  const filteredAndSortedProgrammes = useMemo(() => {
    const filtered = programmes.filter(programme => {
      const matchesSearch =
        programme['titre'].toLowerCase().includes(searchQuery.toLowerCase()) ||
        programme['description'].toLowerCase().includes(searchQuery.toLowerCase()) ||
        programme['competences'].some((comp: string) =>
          comp.toLowerCase().includes(searchQuery.toLowerCase())
        )

      const matchesNiveau = selectedNiveau === 'all' || programme['niveau'] === selectedNiveau
      const matchesModalite =
        selectedModalite === 'all' || programme['modalites'] === selectedModalite

      return matchesSearch && matchesNiveau && matchesModalite
    })

    // Tri des programmes
    if (sortBy !== 'default') {
      filtered.sort((a, b) => {
        let comparison = 0

        switch (sortBy) {
          case 'prix':
            comparison = a['prix'] - b['prix']
            break
          case 'duree':
            comparison = a['duree'] - b['duree']
            break
          case 'titre':
            comparison = a['titre'].localeCompare(b['titre'])
            break
          default:
            return 0
        }

        return sortOrder === 'asc' ? comparison : -comparison
      })
    }

    return filtered
  }, [programmes, searchQuery, selectedNiveau, selectedModalite, sortBy, sortOrder])

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 overflow-hidden">
        <Image
          src="/formation-wordpress-antibes.webp"
          alt="Catalogue complet formations WordPress professionnelles Antibes - Éligibles CPF et OPCO"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Catalogue de Formations</h1>
          <p className="text-xl text-gray-100 max-w-4xl mx-auto">
            Découvrez notre catalogue complet de formations WordPress professionnelles. Formations
            éligibles CPF, adaptées aux entreprises et particuliers.
          </p>
        </div>
      </section>

      {/* Mention Formations personnalisées */}
      <section className="py-8 bg-blue-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="bg-blue-50 border-l-4 border-[#1f3b8e] rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-[#1f3b8e] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">i</span>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-[#1f3b8e] mb-3">
                  Formations personnalisées
                </h3>
                <div className="text-gray-700 space-y-3">
                  <p>
                    Les formations présentées dans ce catalogue sont conçues pour répondre aux
                    besoins spécifiques des artisans, commerçants et très petites entreprises (TPE).
                    Elles constituent une base structurée, construite à partir de situations
                    professionnelles courantes.
                  </p>
                  <p>
                    Toutefois, chaque module peut être entièrement adapté en fonction des résultats
                    du rendez-vous de positionnement initial, afin de tenir compte de vos objectifs,
                    contraintes et compétences déjà acquises. Cette phase d'analyse garantit la
                    pertinence du parcours proposé et son alignement avec vos besoins réels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filtres et recherche */}
      <section className="py-8 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Barre de recherche */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1f3b8e] h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Rechercher une formation..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10 border-[#1f3b8e] focus:border-[#7eb33f] focus:ring-[#7eb33f]"
                  />
                </div>
              </div>

              {/* Filtres */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedNiveau} onValueChange={setSelectedNiveau}>
                  <SelectTrigger className="w-full sm:w-40 border-[#1f3b8e] focus:border-[#7eb33f] focus:ring-[#7eb33f]">
                    <SelectValue placeholder="Niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les niveaux</SelectItem>
                    <SelectItem value="DEBUTANT">Débutant</SelectItem>
                    <SelectItem value="INTERMEDIAIRE">Intermédiaire</SelectItem>
                    <SelectItem value="AVANCE">Avancé</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedModalite} onValueChange={setSelectedModalite}>
                  <SelectTrigger className="w-full sm:w-40 border-[#1f3b8e] focus:border-[#7eb33f] focus:ring-[#7eb33f]">
                    <SelectValue placeholder="Modalité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes modalités</SelectItem>
                    <SelectItem value="PRESENTIEL">Présentiel</SelectItem>
                    <SelectItem value="DISTANCIEL">Distanciel</SelectItem>
                    <SelectItem value="HYBRIDE">Hybride</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40 border-[#1f3b8e] focus:border-[#7eb33f] focus:ring-[#7eb33f]">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Par défaut</SelectItem>
                    <SelectItem value="titre">Titre</SelectItem>
                    <SelectItem value="prix">Prix</SelectItem>
                    <SelectItem value="duree">Durée</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="w-10 h-10 border-[#1f3b8e] text-[#1f3b8e] hover:bg-[#1f3b8e] hover:text-white"
                >
                  {sortOrder === 'asc' ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Résultats */}
            <div className="mt-4 text-sm text-gray-600">
              {filteredAndSortedProgrammes.length} formation
              {filteredAndSortedProgrammes.length > 1 ? 's' : ''} trouvée
              {filteredAndSortedProgrammes.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </section>

      {/* Filtres et programmes */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f3b8e] mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des formations...</p>
              </div>
            </div>
          ) : filteredAndSortedProgrammes.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune formation trouvée</h3>
              <p className="text-gray-600 mb-6">
                Essayez de modifier vos critères de recherche ou vos filtres.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedNiveau('all')
                  setSelectedModalite('all')
                  setSortBy('default')
                }}
                className="bg-[#1f3b8e] hover:bg-[#7eb33f] text-white"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedProgrammes.map(programme => (
                <FormationCard key={programme.id} programme={programme} showDetails={true} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
