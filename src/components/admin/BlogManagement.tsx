'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  FileText,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Calendar,
  User,
  TrendingUp,
  Clock,
  BarChart3,
} from 'lucide-react'
import { Article, ArticleFilters, ArticleStats } from '@/types/blog'
import { BlogService } from '@/lib/blog-service'
import { toast } from 'sonner'

export function BlogManagement() {
  const [articles, setArticles] = useState<Article[]>([])
  const [stats, setStats] = useState<ArticleStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<ArticleFilters>({})
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [articlesData, statsData] = await Promise.all([
        BlogService.getArticles(filters),
        BlogService.getArticleStats(),
      ])
      setArticles(articlesData)
      setStats(statsData)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      toast.error('Erreur lors du chargement des articles')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setFilters(prev => ({ ...prev, recherche: value || undefined }))
  }

  const handleFilterChange = (key: keyof ArticleFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
    }))
  }

  const handleDeleteArticle = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      try {
        await BlogService.deleteArticle(id)
        toast.success('Article supprimé avec succès')
        loadData()
      } catch (error) {
        toast.error('Erreur lors de la suppression')
      }
    }
  }

  const handleToggleFeatured = async (article: Article) => {
    try {
      await BlogService.updateArticle(article.id, {
        featured: !article.featured,
      })
      toast.success(`Article ${article.featured ? 'retiré des' : 'ajouté aux'} favoris`)
      loadData()
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const handleToggleStatus = async (article: Article) => {
    const newStatus = article.statut === 'publie' ? 'brouillon' : 'publie'
    try {
      await BlogService.updateArticle(article.id, {
        statut: newStatus,
      })
      toast.success(`Article ${newStatus === 'publie' ? 'publié' : 'mis en brouillon'}`)
      loadData()
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'publie':
        return 'bg-green-100 text-green-800'
      case 'brouillon':
        return 'bg-yellow-100 text-yellow-800'
      case 'archive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'publie':
        return 'Publié'
      case 'brouillon':
        return 'Brouillon'
      case 'archive':
        return 'Archivé'
      default:
        return status
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion du Blog</h1>
        <p className="text-muted-foreground">Gérez vos articles de blog et leur publication</p>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Articles
              </CardTitle>
              <FileText className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Publiés</CardTitle>
              <Eye className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.publies}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Brouillons
              </CardTitle>
              <EyeOff className="h-5 w-5 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.brouillons}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Vues Total
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.vuesTotal.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions et filtres */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>Liste des Articles</CardTitle>
              <p className="text-muted-foreground">Gérez tous vos articles de blog</p>
            </div>
            <Button
              className="flex items-center gap-2"
              onClick={() => (window.location.href = '/dashboard/blog/nouveau')}
            >
              <Plus className="h-4 w-4" />
              Nouvel Article
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un article..."
                className="pl-9"
                value={searchTerm}
                onChange={e => handleSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <select
                className="px-3 py-2 border rounded-md text-sm appearance-none bg-white"
                value={filters.statut || 'all'}
                onChange={e => handleFilterChange('statut', e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="publie">Publiés</option>
                <option value="brouillon">Brouillons</option>
                <option value="archive">Archivés</option>
              </select>

              <select
                className="px-3 py-2 border rounded-md text-sm appearance-none bg-white"
                value={
                  filters.featured === undefined
                    ? 'all'
                    : filters.featured
                      ? 'featured'
                      : 'not-featured'
                }
                onChange={e =>
                  handleFilterChange(
                    'featured',
                    e.target.value === 'featured'
                      ? 'true'
                      : e.target.value === 'not-featured'
                        ? 'false'
                        : 'all'
                  )
                }
              >
                <option value="all">Tous</option>
                <option value="featured">Favoris</option>
                <option value="not-featured">Non favoris</option>
              </select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Catégories</TableHead>
                <TableHead>Vues</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map(article => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {article.featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                      <div>
                        <div className="font-medium">{article.titre}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {article.tempsLecture} min
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {article.auteur}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge className={getStatusBadgeColor(article.statut)}>
                      {getStatusLabel(article.statut)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {article.categories.slice(0, 2).map(category => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                      {article.categories.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{article.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4 text-gray-400" />
                      {article.vue.toLocaleString()}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {article.datePublication
                        ? new Date(article.datePublication).toLocaleDateString()
                        : 'Non publié'}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => (window.location.href = `/dashboard/blog/${article.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleToggleStatus(article)}>
                          {article.statut === 'publie' ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Mettre en brouillon
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Publier
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleToggleFeatured(article)}>
                          <Star className="h-4 w-4 mr-2" />
                          {article.featured ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => handleDeleteArticle(article.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {articles.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">Aucun article trouvé</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
