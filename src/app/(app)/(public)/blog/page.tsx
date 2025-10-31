'use client'

import { PublicLayout } from '@/components/layouts/public/PublicLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, User, Clock, Mail, Star, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import type { Article } from '@/types/blog'

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>(['Tous'])

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      const response = await fetch('/api/blog')
      const data = await response.json()

      if (data.success) {
        setArticles(data.data.articles)
        // Extraire les catégories uniques
        const allCategories = data.data.articles.flatMap(
          (article: Article) => article.categories
        ) as string[]
        const uniqueCategories: string[] = ['Tous', ...new Set<string>(allCategories)]
        setCategories(uniqueCategories)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error)
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

  const filteredArticles =
    selectedCategory === 'Tous'
      ? articles
      : articles.filter(article => article.categories.includes(selectedCategory))

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 overflow-hidden">
        <Image
          src="/formation-wordpress-antibes.webp"
          alt="Blog WordPress - Tutoriels, conseils et actualités formations WordPress par formateur certifié"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Blog WordPress</h1>
          <p className="text-xl text-gray-100 max-w-4xl mx-auto">
            Conseils, tutoriels et actualités pour maîtriser WordPress. Restez à jour avec les
            dernières tendances et bonnes pratiques.
          </p>
        </div>
      </section>

      {/* Success Banner */}
      <section className="bg-green-50 border-l-4 border-green-400 py-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                ✅ Blog connecté au back-office
              </h3>
              <p className="text-gray-700">
                Les articles sont maintenant gérés depuis l'interface d'administration et affichés
                en temps réel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`px-6 py-2 rounded-full ${
                  selectedCategory === category
                    ? 'bg-[#1f3b8e] text-white hover:bg-[#7eb33f]'
                    : 'bg-gray-100 text-gray-700 hover:bg-[#1f3b8e] hover:text-white'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des articles...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map(article => (
                <Card
                  key={article.id}
                  className="hover:shadow-lg transition-all duration-300 border border-gray-200"
                >
                  {/* Article Image */}
                  <div className="h-48 bg-gray-100 rounded-t-lg overflow-hidden relative">
                    {article.featured && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          En vedette
                        </Badge>
                      </div>
                    )}
                    {article.imagePrincipale ? (
                      <img
                        src={article.imagePrincipale}
                        alt={article.titre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-gray-400 text-sm">Image de l'article</div>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    {/* Category Badges */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.categories.slice(0, 2).map(category => (
                        <Badge
                          key={category}
                          className="bg-gray-100 text-gray-700 hover:bg-gray-100"
                        >
                          {category}
                        </Badge>
                      ))}
                      {article.categories.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{article.categories.length - 2}
                        </Badge>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-blue-900 mb-3 line-clamp-2">
                      <Link href={`/blog/${article.slug}`} className="hover:text-blue-700">
                        {article.titre}
                      </Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{article.resume}</p>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {article.auteur}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {article.datePublication
                          ? formatDate(article.datePublication)
                          : 'Non publié'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.tempsLecture} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.vue}
                      </span>
                    </div>

                    {/* Read Article Button */}
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-[#1f3b8e] text-[#1f3b8e] hover:bg-[#7eb33f] hover:text-white"
                    >
                      <Link href={`/blog/${article.slug}`}>Lire l'article</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredArticles.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucun article trouvé dans cette catégorie.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-blue-50">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Restez informé</h2>
          <p className="text-lg text-gray-600 mb-8">
            Recevez nos derniers articles et conseils WordPress directement dans votre boîte mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input type="email" placeholder="Votre adresse email" className="flex-1" />
            <Button className="bg-[#1f3b8e] hover:bg-[#7eb33f] text-white px-8">
              <Mail className="h-4 w-4 mr-2" />
              S'abonner
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
