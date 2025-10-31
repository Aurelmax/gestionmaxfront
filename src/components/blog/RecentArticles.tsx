'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import type { Article } from '@/types/blog'

interface RecentArticlesProps {
  limit?: number
  showCategories?: boolean
}

export function RecentArticles({ limit = 4, showCategories = true }: RecentArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRecentArticles()
  }, [limit])

  const loadRecentArticles = async () => {
    try {
      const response = await fetch(`/api/blog?limit=${limit}&sort=-datePublication`)
      const data = await response.json()

      if (data.success) {
        setArticles(data.data.articles.slice(0, limit))
      }
    } catch (error) {
      console.error('Erreur lors du chargement des articles récents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return minutes
  }

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(limit)].map((_, i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600 text-lg">Aucun article publié pour le moment.</p>
        <p className="text-gray-500 mt-2">Revenez bientôt pour découvrir nos contenus !</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {articles.map(article => (
        <Card
          key={article.id}
          className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-2 border-transparent hover:border-[#7eb33f]/30"
        >
          <Link href={`/blog/${article.slug}`}>
            {/* Image */}
            {article.imageUrl && (
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <Image
                  src={article.imageUrl}
                  alt={article.titre}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            <CardContent className="p-6">
              {/* Catégories */}
              {showCategories && article.categories && article.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {article.categories.slice(0, 2).map((category, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-[#7eb33f]/10 text-[#7eb33f] hover:bg-[#7eb33f]/20"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Titre */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#1f3b8e] transition-colors line-clamp-2">
                {article.titre}
              </h3>

              {/* Extrait */}
              <p className="text-gray-600 mb-4 line-clamp-3">{article.extrait}</p>

              {/* Meta informations */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                {article.datePublication && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(article.datePublication)}</span>
                  </div>
                )}
                {article.contenu && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{calculateReadingTime(article.contenu)} min</span>
                  </div>
                )}
              </div>

              {/* Lien "Lire la suite" */}
              <div className="flex items-center gap-2 text-[#1f3b8e] font-semibold group-hover:gap-4 transition-all">
                <span>Lire la suite</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  )
}
