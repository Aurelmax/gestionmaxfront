'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Save,
  Eye,
  ArrowLeft,
  Plus,
  X,
  Calendar,
  User,
  Tag,
  Image,
  FileText,
  Clock,
} from 'lucide-react'
import { ImageSelector } from './ImageSelector'
import { MultipleImageSelector } from './MultipleImageSelector'
import { CreateArticleRequest, Categorie, Tag as TagType } from '@/types/blog'
import { BlogService } from '@/lib/blog-service'
import { toast } from 'sonner'

interface ArticleEditorProps {
  articleId?: string
  mode: 'create' | 'edit'
}

export function ArticleEditor({ articleId, mode }: ArticleEditorProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<Categorie[]>([])
  const [tags, setTags] = useState<TagType[]>([])

  const [formData, setFormData] = useState<CreateArticleRequest>({
    titre: '',
    contenu: '',
    resume: '',
    auteur: 'Aurélien GestionMax',
    statut: 'brouillon',
    categories: [],
    tags: [],
    imagePrincipale: '',
    images: [],
    metaDescription: '',
    metaKeywords: [],
    featured: false,
  })

  const [newKeyword, setNewKeyword] = useState('')

  useEffect(() => {
    loadInitialData()
    if (mode === 'edit' && articleId) {
      loadArticle()
    }
  }, [mode, articleId])

  const loadInitialData = async () => {
    try {
      const [categoriesData, tagsData] = await Promise.all([
        BlogService.getCategories(),
        BlogService.getTags(),
      ])
      setCategories(categoriesData)
      setTags(tagsData)
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
    }
  }

  const loadArticle = async () => {
    if (!articleId) return

    setIsLoading(true)
    try {
      const article = await BlogService.getArticleById(articleId)
      if (article) {
        setFormData({
          titre: article.titre,
          contenu: article.contenu,
          resume: article.resume,
          auteur: article.auteur,
          statut: article.statut,
          categories: article.categories,
          tags: article.tags,
          metaDescription: article.metaDescription,
          metaKeywords: article.metaKeywords,
          featured: article.featured,
        })
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'article:", error)
      toast.error("Erreur lors du chargement de l'article")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateArticleRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCategoryToggle = (categorySlug: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categorySlug)
        ? prev.categories.filter(c => c !== categorySlug)
        : [...prev.categories, categorySlug],
    }))
  }

  const handleTagToggle = (tagSlug: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagSlug)
        ? prev.tags.filter(t => t !== tagSlug)
        : [...prev.tags, tagSlug],
    }))
  }

  const handleKeywordAdd = () => {
    if (newKeyword.trim() && !formData.metaKeywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        metaKeywords: [...prev.metaKeywords, newKeyword.trim()],
      }))
      setNewKeyword('')
    }
  }

  const handleKeywordRemove = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter(k => k !== keyword),
    }))
  }

  const handleSave = async (status: 'brouillon' | 'publie') => {
    setIsSaving(true)
    try {
      const articleData = {
        ...formData,
        statut: status,
        datePublication:
          status === 'publie'
            ? new Date().toISOString().split('T')[0]
            : formData.datePublication || new Date().toISOString().split('T')[0],
      }

      if (mode === 'create') {
        await BlogService.createArticle(articleData)
        toast.success(
          `Article ${status === 'publie' ? 'publié' : 'sauvegardé en brouillon'} avec succès`
        )
      } else if (articleId) {
        await BlogService.updateArticle(articleId, articleData)
        toast.success(`Article ${status === 'publie' ? 'publié' : 'mis à jour'} avec succès`)
      }

      router.push('/dashboard/blog')
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast.error("Erreur lors de la sauvegarde de l'article")
    } finally {
      setIsSaving(false)
    }
  }

  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/blog')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {mode === 'create' ? 'Nouvel Article' : "Modifier l'Article"}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'create' ? 'Créez un nouvel article de blog' : 'Modifiez votre article'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave('brouillon')}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
          <Button
            onClick={() => handleSave('publie')}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {isSaving ? 'Publication...' : 'Publier'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Titre */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informations de base
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Titre de l'article *</label>
                <Input
                  value={formData.titre}
                  onChange={e => handleInputChange('titre', e.target.value)}
                  placeholder="Entrez le titre de votre article"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Résumé *</label>
                <Textarea
                  value={formData.resume}
                  onChange={e => handleInputChange('resume', e.target.value)}
                  placeholder="Résumé court de l'article"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Contenu *</label>
                <Textarea
                  value={formData.contenu}
                  onChange={e => handleInputChange('contenu', e.target.value)}
                  placeholder="Contenu de l'article (HTML supporté)"
                  rows={15}
                />
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Temps de lecture estimé : {calculateReadingTime(formData.contenu)} minutes
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium">Image principale</label>
                <p className="text-xs text-gray-500 mb-3">
                  Image qui sera affichée en en-tête de l'article
                </p>
                <ImageSelector
                  value={formData.imagePrincipale}
                  onChange={url => handleInputChange('imagePrincipale', url)}
                  placeholder="Sélectionner une image principale"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Images supplémentaires</label>
                <p className="text-xs text-gray-500 mb-3">
                  Images qui peuvent être utilisées dans le contenu de l'article
                </p>
                <MultipleImageSelector
                  value={formData.images || []}
                  onChange={urls => handleInputChange('images', urls)}
                  maxImages={10}
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>Optimisation SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Meta Description *</label>
                <Textarea
                  value={formData.metaDescription}
                  onChange={e => handleInputChange('metaDescription', e.target.value)}
                  placeholder="Description pour les moteurs de recherche"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Mots-clés</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newKeyword}
                    onChange={e => setNewKeyword(e.target.value)}
                    placeholder="Ajouter un mot-clé"
                    onKeyPress={e => e.key === 'Enter' && handleKeywordAdd()}
                  />
                  <Button onClick={handleKeywordAdd} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.metaKeywords.map(keyword => (
                    <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                      {keyword}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleKeywordRemove(keyword)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publication */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Publication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Auteur</label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-gray-400" />
                  <Input
                    value={formData.auteur}
                    onChange={e => handleInputChange('auteur', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Statut</label>
                <select
                  className="w-full px-3 py-2 border rounded-md text-sm"
                  value={formData.statut}
                  onChange={e => handleInputChange('statut', e.target.value)}
                >
                  <option value="brouillon">Brouillon</option>
                  <option value="publie">Publié</option>
                  <option value="archive">Archivé</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={e => handleInputChange('featured', e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium">
                  Article en vedette
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Catégories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Catégories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      checked={formData.categories.includes(category.slug)}
                      onChange={() => handleCategoryToggle(category.slug)}
                      className="rounded"
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-sm flex items-center gap-2"
                    >
                      <span>{category.icone}</span>
                      {category.nom}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tags.map(tag => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`tag-${tag.id}`}
                      checked={formData.tags.includes(tag.slug)}
                      onChange={() => handleTagToggle(tag.slug)}
                      className="rounded"
                    />
                    <label htmlFor={`tag-${tag.id}`} className="text-sm">
                      {tag.nom}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
