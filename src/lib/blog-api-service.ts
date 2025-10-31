/**
 * Service de gestion du blog via Payload API
 */

import { payloadApi } from './payload-api-service'
import type {
  Article,
  Categorie,
  Tag,
  CreateArticleRequest,
  UpdateArticleRequest,
  ArticleFilters,
  ArticleStats,
} from '@/types/blog'

export class BlogApiService {
  /**
   * Récupérer tous les articles
   */
  static async getArticles(filters?: ArticleFilters): Promise<Article[]> {
    try {
      const where: any = {}

      if (filters) {
        if (filters.statut) {
          where.statut = { equals: filters.statut }
        }
        if (filters.categorie) {
          where.categories = { contains: filters.categorie }
        }
        if (filters.tag) {
          where.tags = { contains: filters.tag }
        }
        if (filters.auteur) {
          where.auteur = { equals: filters.auteur }
        }
        if (filters.featured !== undefined) {
          where.featured = { equals: filters.featured }
        }
        if (filters.dateDebut && filters.dateFin) {
          where.datePublication = {
            greaterThanEqual: filters.dateDebut,
            lessThanEqual: filters.dateFin,
          }
        }
        if (filters.recherche) {
          where.or = [
            { titre: { contains: filters.recherche } },
            { resume: { contains: filters.recherche } },
            { contenu: { contains: filters.recherche } },
          ]
        }
      }

      const response = await payloadApi.findAll('articles', {
        where,
        sort: '-datePublication',
        depth: 2,
      })

      return response.docs.map(this.transformPayloadToArticle)
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error)
      throw error
    }
  }

  /**
   * Récupérer un article par ID
   */
  static async getArticleById(id: string): Promise<Article | null> {
    try {
      const article = await payloadApi.findById('articles', id, { depth: 2 })
      return this.transformPayloadToArticle(article)
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'article ${id}:`, error)
      return null
    }
  }

  /**
   * Récupérer un article par slug
   */
  static async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const response = await payloadApi.findAll('articles', {
        where: {
          slug: {
            equals: slug,
          },
        },
        limit: 1,
        depth: 2,
      })

      if (response.docs.length > 0) {
        return this.transformPayloadToArticle(response.docs[0])
      }
      return null
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'article ${slug}:`, error)
      return null
    }
  }

  /**
   * Créer un nouvel article
   */
  static async createArticle(articleData: CreateArticleRequest): Promise<Article> {
    try {
      const payloadData = this.transformArticleToPayload(articleData)
      const article = await payloadApi.create('articles', payloadData, { depth: 2 })
      return this.transformPayloadToArticle(article)
    } catch (error) {
      console.error("Erreur lors de la création de l'article:", error)
      throw error
    }
  }

  /**
   * Mettre à jour un article
   */
  static async updateArticle(id: string, articleData: UpdateArticleRequest): Promise<Article> {
    try {
      const payloadData = this.transformArticleToPayload(articleData)
      const article = await payloadApi.update('articles', id, payloadData, { depth: 2 })
      return this.transformPayloadToArticle(article)
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'article ${id}:`, error)
      throw error
    }
  }

  /**
   * Supprimer un article
   */
  static async deleteArticle(id: string): Promise<void> {
    try {
      await payloadApi.delete('articles', id)
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'article ${id}:`, error)
      throw error
    }
  }

  /**
   * Incrémenter le nombre de vues d'un article
   */
  static async incrementViews(id: string): Promise<Article> {
    try {
      const article = await this.getArticleById(id)
      if (!article) {
        throw new Error('Article non trouvé')
      }

      const updatedArticle = await payloadApi.update(
        'articles',
        id,
        {
          vue: (article.vue || 0) + 1,
        },
        { depth: 2 }
      )

      return this.transformPayloadToArticle(updatedArticle)
    } catch (error) {
      console.error(`Erreur lors de l'incrémentation des vues de l'article ${id}:`, error)
      throw error
    }
  }

  /**
   * Récupérer les articles publiés
   */
  static async getPublishedArticles(): Promise<Article[]> {
    try {
      const response = await payloadApi.findAll('articles', {
        where: {
          statut: { equals: 'publie' },
        },
        sort: '-datePublication',
        depth: 2,
      })

      return response.docs.map(this.transformPayloadToArticle)
    } catch (error) {
      console.error('Erreur lors de la récupération des articles publiés:', error)
      throw error
    }
  }

  /**
   * Récupérer les articles en vedette
   */
  static async getFeaturedArticles(): Promise<Article[]> {
    try {
      const response = await payloadApi.findAll('articles', {
        where: {
          featured: { equals: true },
          statut: { equals: 'publie' },
        },
        sort: '-datePublication',
        depth: 2,
      })

      return response.docs.map(this.transformPayloadToArticle)
    } catch (error) {
      console.error('Erreur lors de la récupération des articles en vedette:', error)
      throw error
    }
  }

  /**
   * Récupérer toutes les catégories
   */
  static async getCategories(): Promise<Categorie[]> {
    try {
      const response = await payloadApi.findAll('categories', {
        sort: 'nom',
        depth: 1,
      })

      return response.docs.map(this.transformPayloadToCategorie)
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error)
      throw error
    }
  }

  /**
   * Récupérer une catégorie par slug
   */
  static async getCategorieBySlug(slug: string): Promise<Categorie | null> {
    try {
      const response = await payloadApi.findAll('categories', {
        where: {
          slug: { equals: slug },
        },
        limit: 1,
        depth: 1,
      })

      if (response.docs.length > 0) {
        return this.transformPayloadToCategorie(response.docs[0])
      }
      return null
    } catch (error) {
      console.error(`Erreur lors de la récupération de la catégorie ${slug}:`, error)
      return null
    }
  }

  /**
   * Récupérer tous les tags
   */
  static async getTags(): Promise<Tag[]> {
    try {
      const response = await payloadApi.findAll('tags', {
        sort: 'nom',
        depth: 1,
      })

      return response.docs.map(this.transformPayloadToTag)
    } catch (error) {
      console.error('Erreur lors de la récupération des tags:', error)
      throw error
    }
  }

  /**
   * Récupérer un tag par slug
   */
  static async getTagBySlug(slug: string): Promise<Tag | null> {
    try {
      const response = await payloadApi.findAll('tags', {
        where: {
          slug: { equals: slug },
        },
        limit: 1,
        depth: 1,
      })

      if (response.docs.length > 0) {
        return this.transformPayloadToTag(response.docs[0])
      }
      return null
    } catch (error) {
      console.error(`Erreur lors de la récupération du tag ${slug}:`, error)
      return null
    }
  }

  /**
   * Récupérer les statistiques du blog
   */
  static async getBlogStats(): Promise<ArticleStats> {
    try {
      const response = await payloadApi.findAll('articles', { depth: 0 })
      const articles = response.docs

      const stats: ArticleStats = {
        total: articles.length,
        publies: articles.filter((a: any) => a.statut === 'publie').length,
        brouillons: articles.filter((a: any) => a.statut === 'brouillon').length,
        archives: articles.filter((a: any) => a.statut === 'archive').length,
        vuesTotal: articles.reduce((sum: number, a: any) => sum + (a.vue || 0), 0),
        articlesPopulaires: [],
        categoriesPopulaires: [],
        auteursActifs: [],
      }

      // Articles populaires (top 5 par vues)
      const articlesPopulaires = articles
        .sort((a: any, b: any) => (b.vue || 0) - (a.vue || 0))
        .slice(0, 5)
        .map(this.transformPayloadToArticle)
      stats.articlesPopulaires = articlesPopulaires

      // Catégories populaires
      const categoriesCount: Record<string, number> = {}
      articles.forEach((article: any) => {
        if (article.categories) {
          article.categories.forEach((cat: any) => {
            const catName = typeof cat === 'string' ? cat : cat.nom
            categoriesCount[catName] = (categoriesCount[catName] || 0) + 1
          })
        }
      })
      stats.categoriesPopulaires = Object.entries(categoriesCount)
        .map(([categorie, count]) => ({ categorie, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      // Auteurs actifs
      const auteursCount: Record<string, number> = {}
      articles.forEach((article: any) => {
        const auteur = article.auteur
        if (auteur) {
          auteursCount[auteur] = (auteursCount[auteur] || 0) + 1
        }
      })
      stats.auteursActifs = Object.entries(auteursCount)
        .map(([auteur, count]) => ({ auteur, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      return stats
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques du blog:', error)
      throw error
    }
  }

  /**
   * Transformer les données Payload vers le format Article
   */
  private static transformPayloadToArticle(payloadData: any): Article {
    return {
      id: payloadData.id,
      titre: payloadData.titre,
      slug: payloadData.slug,
      contenu: payloadData.contenu,
      resume: payloadData.resume,
      auteur: payloadData.auteur,
      datePublication: payloadData.datePublication,
      dateModification: payloadData.dateModification,
      statut: payloadData.statut,
      categories: payloadData.categories || [],
      tags: payloadData.tags || [],
      imagePrincipale: payloadData.imagePrincipale,
      images: payloadData.images || [],
      metaDescription: payloadData.metaDescription,
      metaKeywords: payloadData.metaKeywords || [],
      vue: payloadData.vue || 0,
      tempsLecture: payloadData.tempsLecture,
      featured: payloadData.featured || false,
      createdAt: payloadData.createdAt,
      updatedAt: payloadData.updatedAt,
    }
  }

  /**
   * Transformer les données Article vers le format Payload
   */
  private static transformArticleToPayload(articleData: any): any {
    return {
      titre: articleData.titre,
      slug: articleData.slug,
      contenu: articleData.contenu,
      resume: articleData.resume,
      auteur: articleData.auteur,
      datePublication: articleData.datePublication,
      statut: articleData.statut,
      categories: articleData.categories,
      tags: articleData.tags,
      imagePrincipale: articleData.imagePrincipale,
      images: articleData.images,
      metaDescription: articleData.metaDescription,
      metaKeywords: articleData.metaKeywords,
      vue: articleData.vue,
      tempsLecture: articleData.tempsLecture,
      featured: articleData.featured,
    }
  }

  /**
   * Transformer les données Payload vers le format Categorie
   */
  private static transformPayloadToCategorie(payloadData: any): Categorie {
    return {
      id: payloadData.id,
      nom: payloadData.nom,
      slug: payloadData.slug,
      description: payloadData.description,
      couleur: payloadData.couleur,
      icone: payloadData.icone,
      createdAt: payloadData.createdAt,
      updatedAt: payloadData.updatedAt,
    }
  }

  /**
   * Transformer les données Payload vers le format Tag
   */
  private static transformPayloadToTag(payloadData: any): Tag {
    return {
      id: payloadData.id,
      nom: payloadData.nom,
      slug: payloadData.slug,
      couleur: payloadData.couleur,
      createdAt: payloadData.createdAt,
      updatedAt: payloadData.updatedAt,
    }
  }
}
