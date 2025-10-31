/**
 * Service pour les routes API (sans hooks React)
 */

import { mongodbService } from './mongodb-service'
import { BlogService } from './blog-service'
import { MockService } from './mock-service'

// Vérifier si le mode mock est activé
const isMockMode = process.env['NEXT_PUBLIC_USE_MOCK_DATA'] === 'true'

export class ApiRouteService {
  // Blog
  static async getArticles(filters?: any) {
    if (isMockMode) {
      return BlogService.getArticles(filters)
    } else {
      // Utiliser les données MongoDB réelles
      const articles = await mongodbService.getArticles()
      // Appliquer les filtres si nécessaire
      return articles
    }
  }

  static async getArticleBySlug(slug: string) {
    if (isMockMode) {
      return BlogService.getArticleBySlug(slug)
    } else {
      return mongodbService.getArticleBySlug(slug)
    }
  }

  static async getCategories() {
    if (isMockMode) {
      return BlogService.getCategories()
    } else {
      return mongodbService.getCategories()
    }
  }

  static async getTags() {
    if (isMockMode) {
      return BlogService.getTags()
    } else {
      return mongodbService.getTags()
    }
  }

  static async getArticleStats() {
    if (isMockMode) {
      return BlogService.getArticleStats()
    } else {
      return mongodbService.getArticleStats()
    }
  }

  // Programmes
  static async getProgrammes() {
    if (isMockMode) {
      return MockService.getProgrammes()
    } else {
      return mongodbService.getProgrammes()
    }
  }

  // Apprenants
  static async getApprenants() {
    if (isMockMode) {
      return MockService.getApprenants()
    } else {
      return mongodbService.getApprenants()
    }
  }

  // Utilisateurs
  static async getUsers() {
    if (isMockMode) {
      return MockService.getUsers()
    } else {
      return mongodbService.getUsers()
    }
  }

  // Rendez-vous
  static async getRendezVous() {
    if (isMockMode) {
      return MockService.getRendezVous()
    } else {
      return mongodbService.getRendezVous()
    }
  }

  // Statistiques
  static async getStats() {
    if (isMockMode) {
      return MockService.getStats()
    } else {
      return mongodbService.getStats()
    }
  }

  // Méthodes supplémentaires pour les routes API
  static async getProgramme(id: string) {
    if (isMockMode) {
      return MockService.getProgramme(id)
    } else {
      return mongodbService.getProgramme(id)
    }
  }

  static async getApprenant(id: string) {
    if (isMockMode) {
      return MockService.getApprenant(id)
    } else {
      return mongodbService.getApprenant(id)
    }
  }

  static async getUserByEmail(email: string) {
    if (isMockMode) {
      return MockService.getUserByEmail(email)
    } else {
      return mongodbService.getUserByEmail(email)
    }
  }
}
