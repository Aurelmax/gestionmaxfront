import {
  Article,
  Categorie,
  Tag,
  CreateArticleRequest,
  UpdateArticleRequest,
  ArticleFilters,
  ArticleStats,
} from '@/types/blog'
import { api } from '@/lib/apiClient'

/**
 * Service pour gérer les articles, catégories et tags via l'API Payload CMS
 * Remplace l'ancien système de données mock par des appels API réels
 */

// Fonction pour générer un slug à partir d'un titre
const generateSlug = (titre: string): string => {
  return titre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Fonction pour calculer le temps de lecture
const calculateReadingTime = (contenu: string): number => {
  const wordsPerMinute = 200
  const words = contenu.replace(/<[^>]*>/g, '').split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

// Mapper les données de l'API vers le type Article
const mapApiArticleToArticle = (apiArticle: any): Article => {
  return {
    id: apiArticle.id,
    titre: apiArticle.titre,
    slug: apiArticle.slug,
    contenu: apiArticle.contenu,
    resume: apiArticle.resume,
    auteur: apiArticle.auteur,
    datePublication: apiArticle.datePublication,
    dateModification: apiArticle.updatedAt?.split('T')[0],
    statut: apiArticle.statut,
    categories: Array.isArray(apiArticle.categories)
      ? apiArticle.categories.map((cat: any) => (typeof cat === 'string' ? cat : cat.slug || cat.nom))
      : [],
    tags: Array.isArray(apiArticle.tags)
      ? apiArticle.tags.map((tag: any) => (typeof tag === 'string' ? tag : tag.slug || tag.nom))
      : [],
    imagePrincipale: apiArticle.imagePrincipale?.url || apiArticle.imagePrincipale,
    metaDescription: apiArticle.metaDescription,
    metaKeywords: Array.isArray(apiArticle.metaKeywords)
      ? apiArticle.metaKeywords.map((kw: any) => kw.keyword || kw)
      : [],
    vue: apiArticle.vue || 0,
    tempsLecture: apiArticle.tempsLecture || 5,
    featured: apiArticle.featured || false,
    createdAt: apiArticle.createdAt,
    updatedAt: apiArticle.updatedAt,
  }
}

class BlogService {
  // Articles
  static async getArticles(filters?: ArticleFilters): Promise<Article[]> {
    try {
      const params: Record<string, string> = {}

      // Construire les filtres pour l'API Payload
      if (filters) {
        const where: any = {}

        if (filters.statut) {
          where.statut = { equals: filters.statut }
        }

        if (filters.featured !== undefined) {
          where.featured = { equals: filters.featured }
        }

        if (filters.auteur) {
          where.auteur = { contains: filters.auteur }
        }

        if (filters.recherche) {
          where.or = [
            { titre: { contains: filters.recherche } },
            { resume: { contains: filters.recherche } },
          ]
        }

        if (Object.keys(where).length > 0) {
          params['where'] = JSON.stringify(where)
        }
      }

      // Récupérer les articles de l'API
      const response: any = await api.articles.list(params)
      const articles = response.docs || []

      return articles.map(mapApiArticleToArticle)
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error)
      return []
    }
  }

  static async getArticleById(id: string): Promise<Article | null> {
    try {
      const apiArticle: any = await api.articles.get(id)
      return mapApiArticleToArticle(apiArticle)
    } catch (error) {
      console.error(`Erreur lors du chargement de l'article ${id}:`, error)
      return null
    }
  }

  static async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const response: any = await api.articles.list({
        where: JSON.stringify({ slug: { equals: slug } }),
        limit: '1',
      })

      if (response.docs && response.docs.length > 0) {
        return mapApiArticleToArticle(response.docs[0])
      }

      return null
    } catch (error) {
      console.error(`Erreur lors du chargement de l'article avec slug ${slug}:`, error)
      return null
    }
  }

  static async createArticle(articleData: CreateArticleRequest): Promise<Article> {
    try {
      const dataToSend: any = {
        ...articleData,
        slug: (articleData as any).slug || generateSlug(articleData.titre),
        tempsLecture: calculateReadingTime(articleData.contenu),
        vue: 0,
      }

      const response: any = await api.articles.create(dataToSend)
      return mapApiArticleToArticle(response.doc || response)
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error)
      throw error
    }
  }

  static async updateArticle(id: string, articleData: UpdateArticleRequest): Promise<Article> {
    try {
      const dataToUpdate: any = { ...articleData }

      // Si le titre change, régénérer le slug
      if (articleData.titre) {
        dataToUpdate.slug = generateSlug(articleData.titre)
      }

      // Si le contenu change, recalculer le temps de lecture
      if (articleData.contenu) {
        dataToUpdate.tempsLecture = calculateReadingTime(articleData.contenu)
      }

      const response: any = await api.articles.update(id, dataToUpdate)
      return mapApiArticleToArticle(response.doc || response)
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'article ${id}:`, error)
      throw error
    }
  }

  static async deleteArticle(id: string): Promise<void> {
    try {
      await api.articles.delete(id)
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'article ${id}:`, error)
      throw error
    }
  }

  static async incrementViews(id: string): Promise<void> {
    try {
      // Récupérer l'article actuel
      const article = await this.getArticleById(id)
      if (article) {
        // Incrémenter les vues
        await api.articles.update(id, {
          vue: article.vue + 1,
        })
      }
    } catch (error) {
      console.error(`Erreur lors de l'incrémentation des vues pour l'article ${id}:`, error)
    }
  }

  // Catégories
  static async getCategories(): Promise<Categorie[]> {
    try {
      const response: any = await api.categories.list()
      const categories = response.docs || []

      return categories.map((cat: any) => ({
        id: cat.id,
        nom: cat.nom,
        slug: cat.slug,
        description: cat.description || '',
        couleur: cat.couleur || '#3B82F6',
        icone: cat.icone || '📝',
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
      }))
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error)
      return []
    }
  }

  static async getCategoryById(id: string): Promise<Categorie | null> {
    try {
      const cat: any = await api.categories.get(id)
      return {
        id: cat.id,
        nom: cat.nom,
        slug: cat.slug,
        description: cat.description || '',
        couleur: cat.couleur || '#3B82F6',
        icone: cat.icone || '📝',
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
      }
    } catch (error) {
      console.error(`Erreur lors du chargement de la catégorie ${id}:`, error)
      return null
    }
  }

  static async createCategory(
    categoryData: Omit<Categorie, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Categorie> {
    try {
      const response: any = await api.categories.create(categoryData)
      const cat = response.doc || response
      return {
        id: cat.id,
        nom: cat.nom,
        slug: cat.slug,
        description: cat.description || '',
        couleur: cat.couleur || '#3B82F6',
        icone: cat.icone || '📝',
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
      }
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error)
      throw error
    }
  }

  // Tags
  static async getTags(): Promise<Tag[]> {
    try {
      const response: any = await api.tags.list()
      const tags = response.docs || []

      return tags.map((tag: any) => ({
        id: tag.id,
        nom: tag.nom,
        slug: tag.slug,
        couleur: tag.couleur || '#6B7280',
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
      }))
    } catch (error) {
      console.error('Erreur lors du chargement des tags:', error)
      return []
    }
  }

  static async getTagById(id: string): Promise<Tag | null> {
    try {
      const tag: any = await api.tags.get(id)
      return {
        id: tag.id,
        nom: tag.nom,
        slug: tag.slug,
        couleur: tag.couleur || '#6B7280',
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
      }
    } catch (error) {
      console.error(`Erreur lors du chargement du tag ${id}:`, error)
      return null
    }
  }

  static async createTag(tagData: Omit<Tag, 'id' | 'createdAt' | 'updatedAt'>): Promise<Tag> {
    try {
      const response: any = await api.tags.create(tagData)
      const tag = response.doc || response
      return {
        id: tag.id,
        nom: tag.nom,
        slug: tag.slug,
        couleur: tag.couleur || '#6B7280',
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
      }
    } catch (error) {
      console.error('Erreur lors de la création du tag:', error)
      throw error
    }
  }

  // Statistiques
  static async getArticleStats(): Promise<ArticleStats> {
    try {
      // Récupérer tous les articles
      const articles = await this.getArticles()
      const categories = await this.getCategories()

      const publies = articles.filter(a => a.statut === 'publie')
      const brouillons = articles.filter(a => a.statut === 'brouillon')
      const archives = articles.filter(a => a.statut === 'archive')

      const vuesTotal = articles.reduce((sum, article) => sum + article.vue, 0)

      const articlesPopulaires = [...articles].sort((a, b) => b.vue - a.vue).slice(0, 5)

      const categoriesPopulaires = categories
        .map(category => ({
          categorie: category.nom,
          count: articles.filter(a => a.categories.includes(category.slug)).length,
        }))
        .sort((a, b) => b.count - a.count)

      const auteursActifs = Array.from(new Set(articles.map(a => a.auteur)))
        .map(auteur => ({
          auteur: auteur,
          count: articles.filter(a => a.auteur === auteur).length,
        }))
        .sort((a, b) => b.count - a.count)

      return {
        total: articles.length,
        publies: publies.length,
        brouillons: brouillons.length,
        archives: archives.length,
        vuesTotal,
        articlesPopulaires,
        categoriesPopulaires,
        auteursActifs,
      }
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error)
      return {
        total: 0,
        publies: 0,
        brouillons: 0,
        archives: 0,
        vuesTotal: 0,
        articlesPopulaires: [],
        categoriesPopulaires: [],
        auteursActifs: [],
      }
    }
  }
}

export { BlogService }
