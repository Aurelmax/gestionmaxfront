/**
 * Service côté client pour récupérer les données via les routes API
 */

import type { Programme, Apprenant, User } from '@/types/common'
import type { RendezVous } from '@/types/rendez-vous'
import type { Article } from '@/types/blog'

export class ClientApiService {
  private static baseUrl = process.env['NEXT_PUBLIC_APP_URL'] || 'http://localhost:3000'

  // Programmes
  static async getProgrammes(): Promise<Programme[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/programmes`)
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      return data.success ? data.data : []
    } catch (error) {
      console.error('Erreur lors de la récupération des programmes:', error)
      return []
    }
  }

  static async getProgramme(id: string): Promise<Programme | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/programmes/${id}`)
      if (!response.ok) {
        return null
      }
      const data = await response.json()
      return data.success ? data.data : null
    } catch (error) {
      console.error(`Erreur lors de la récupération du programme ${id}:`, error)
      return null
    }
  }

  // Apprenants
  static async getApprenants(): Promise<Apprenant[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/apprenants`)
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      return data.success ? data.data : []
    } catch (error) {
      console.error('Erreur lors de la récupération des apprenants:', error)
      return []
    }
  }

  static async getApprenant(id: string): Promise<Apprenant | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/apprenants/${id}`)
      if (!response.ok) {
        return null
      }
      const data = await response.json()
      return data.success ? data.data : null
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'apprenant ${id}:`, error)
      return null
    }
  }

  // Utilisateurs
  static async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/users`)
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      return data.success ? data.data : []
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
      return []
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/users/email/${email}`)
      if (!response.ok) {
        return null
      }
      const data = await response.json()
      return data.success ? data.data : null
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${email}:`, error)
      return null
    }
  }

  // Rendez-vous
  static async getRendezVous(): Promise<RendezVous[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/rendez-vous`)
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      return data.success ? data.data : []
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error)
      return []
    }
  }

  // Blog
  static async getArticles(): Promise<Article[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/blog`)
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      return data.success ? data.data.articles : []
    } catch (error) {
      console.error('Erreur lors de la récupération des articles:', error)
      return []
    }
  }

  static async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/blog/${slug}`)
      if (!response.ok) {
        return null
      }
      const data = await response.json()
      return data.success ? data.data : null
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'article ${slug}:`, error)
      return null
    }
  }

  // Statistiques
  static async getStats(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/api/stats`)
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      return data.success
        ? data.data
        : {
            programmes: 0,
            apprenants: 0,
            users: 0,
            rdvs: 0,
            articles: 0,
          }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      return {
        programmes: 0,
        apprenants: 0,
        users: 0,
        rdvs: 0,
        articles: 0,
      }
    }
  }
}
