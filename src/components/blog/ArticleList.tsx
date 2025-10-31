'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, User, Clock, Eye, Search, Filter, Star } from 'lucide-react'
import { Article, Categorie, Tag } from '@/types/blog'

interface ArticleListProps {
  initialArticles?: Article[]
  showFilters?: boolean
  limit?: number
}

export function ArticleList({
  initialArticles = [],
  showFilters = true,
  limit = 6,
}: ArticleListProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [categories, setCategories] = useState<Categorie[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    recherche: '',
    categorie: '',
    tag: '',
    featured: false,
  })

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()

      if (filters.recherche) params.append('recherche', filters.recherche)
      if (filters.categorie) params.append('categorie', filters.categorie)
      if (filters.tag) params.append('tag', filters.tag)
      if (filters.featured) params.append('featured', 'true')

      params.append('limit', limit.toString())
      params.append('statut', 'publie')

      const response = await fetch(`/api/blog?${params}`)
      const data = await response.json()

      if (data.success) {
        setArticles(data.data.articles)
      }

      // Charger les catégories et tags pour les filtres
      if (showFilters) {
        const [categoriesRes, tagsRes] = await Promise.all([
          fetch('/api/blog/categories'),
          fetch('/api/blog/tags'),
        ])

        const [categoriesData, tagsData] = await Promise.all([categoriesRes.json(), tagsRes.json()])

        if (categoriesData.success) setCategories(categoriesData.data)
        if (tagsData.success) setTags(tagsData.data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      recherche: '',
      categorie: '',
      tag: '',
      featured: false,
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Filtres */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher..."
                  className="pl-9"
                  value={filters.recherche}
                  onChange={e => handleFilterChange('recherche', e.target.value)}
                />
              </div>

              <select
                className="px-3 py-2 border rounded-md text-sm"
                value={filters.categorie}
                onChange={e => handleFilterChange('categorie', e.target.value)}
              >
                <option value="">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.slug}>
                    {category.icone} {category.nom}
                  </option>
                ))}
              </select>

              <select
                className="px-3 py-2 border rounded-md text-sm"
                value={filters.tag}
                onChange={e => handleFilterChange('tag', e.target.value)}
              >
                <option value="">Tous les tags</option>
                {tags.map(tag => (
                  <option key={tag.id} value={tag.slug}>
                    {tag.nom}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={filters.featured}
                  onChange={e => handleFilterChange('featured', e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="featured" className="text-sm flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  En vedette
                </label>
              </div>
            </div>

            {(filters.recherche || filters.categorie || filters.tag || filters.featured) && (
              <div className="mt-4">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Effacer les filtres
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Liste des articles */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <Card key={article.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${article.slug}`}>
                        {article.featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current inline mr-1" />
                        )}
                        {article.titre}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {article.resume}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {/* Catégories et tags */}
                  <div className="flex flex-wrap gap-1">
                    {article.categories.slice(0, 2).map(category => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                    {article.categories.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.categories.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Métadonnées */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {article.auteur}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {article.datePublication ? formatDate(article.datePublication) : 'Non publié'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {article.tempsLecture} min
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {article.vue}
                    </div>
                  </div>

                  {/* Lien vers l'article */}
                  <Button asChild className="w-full">
                    <Link href={`/blog/${article.slug}`}>Lire l'article</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {articles.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Aucun article trouvé</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
