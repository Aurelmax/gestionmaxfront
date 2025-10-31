'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { PublicLayout } from '@/components/layouts/public/PublicLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, User, Clock, ArrowLeft, Star, Eye, Share2 } from 'lucide-react'
import type { Article } from '@/types/blog'

export default function ArticlePage() {
  const params = useParams()
  const slug = params['slug'] as string

  const [article, setArticle] = useState<Article | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadArticle = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/blog/${slug}`)
      const data = await response.json()

      if (data.success) {
        setArticle(data.data)
      } else {
        setError(data.error || 'Article non trouvé')
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'article:", error)
      setError("Erreur lors du chargement de l'article")
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  useEffect(() => {
    if (slug) {
      loadArticle()
    }
  }, [slug, loadArticle])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const shareArticle = () => {
    if (navigator.share && article) {
      navigator.share({
        title: article.titre,
        text: article.resume,
        url: window.location.href,
      })
    } else {
      // Fallback: copier l'URL dans le presse-papier
      navigator.clipboard.writeText(window.location.href)
      alert('Lien copié dans le presse-papier !')
    }
  }

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    )
  }

  if (error || !article) {
    return (
      <PublicLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto text-center">
              <Card>
                <CardContent className="py-12">
                  <h1 className="text-2xl font-bold mb-4">Article non trouvé</h1>
                  <p className="text-muted-foreground mb-6">
                    {error ||
                      "L'article que vous recherchez n'existe pas ou n'est plus disponible."}
                  </p>
                  <Button asChild>
                    <Link href="/blog">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Retour au blog
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Navigation */}
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au blog
                </Link>
              </Button>
              <Button variant="outline" onClick={shareArticle}>
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </div>

            {/* En-tête de l'article */}
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Titre */}
                  <div className="flex items-start gap-2">
                    {article.featured && (
                      <Star className="h-6 w-6 text-yellow-500 fill-current mt-1" />
                    )}
                    <h1 className="text-4xl font-bold leading-tight text-gray-900">
                      {article.titre}
                    </h1>
                  </div>

                  {/* Résumé */}
                  <p className="text-xl text-gray-600 leading-relaxed">{article.resume}</p>

                  {/* Métadonnées */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{article.auteur}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {article.datePublication
                          ? formatDate(article.datePublication)
                          : 'Non publié'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{article.tempsLecture} min de lecture</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>{article.vue} vues</span>
                    </div>
                  </div>

                  {/* Catégories et tags */}
                  <div className="flex flex-wrap gap-2">
                    {article.categories.map(category => (
                      <Badge key={category} variant="secondary" className="flex items-center gap-1">
                        {category}
                      </Badge>
                    ))}
                    {article.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image principale */}
            {article.imagePrincipale && (
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={article.imagePrincipale}
                      alt={article.titre}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contenu de l'article */}
            <Card>
              <CardContent className="p-8">
                <div
                  dangerouslySetInnerHTML={{ __html: article.contenu }}
                  className="prose prose-lg max-w-none article-content"
                />
              </CardContent>
            </Card>

            {/* Métadonnées SEO (cachées) */}
            <div className="hidden">
              <meta name="description" content={article.metaDescription} />
              <meta name="keywords" content={article.metaKeywords.join(', ')} />
              <meta property="og:title" content={article.titre} />
              <meta property="og:description" content={article.resume} />
              <meta property="og:type" content="article" />
              <meta property="article:author" content={article.auteur} />
              <meta property="article:published_time" content={article.datePublication} />
              {article.categories.map(category => (
                <meta key={category} property="article:section" content={category} />
              ))}
              {article.tags.map(tag => (
                <meta key={tag} property="article:tag" content={tag} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
