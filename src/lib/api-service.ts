/**
 * Service unifié pour remplacer MockService avec des appels Payload API
 */

import { ProgrammeService } from './programme-service'
import { ApprenantService } from './apprenant-service'
import { RendezVousApiService } from './rendez-vous-api-service'
import { UserApiService } from './user-api-service'
import { BlogApiService } from './blog-api-service'
import type { Programme, Apprenant, RendezVous, User } from '@/types/common'
import type { Article } from '@/types/blog'

export interface ApiStats {
  programmes: number
  apprenants: number
  rendezVous: number
  articles: number
  utilisateurs: number
}

export class ApiService {
  // Programmes
  static async getProgrammes(): Promise<Programme[]> {
    return ProgrammeService.getProgrammes()
  }

  static async getProgramme(id: string): Promise<Programme | null> {
    return ProgrammeService.getProgramme(id)
  }

  // Apprenants
  static async getApprenants(): Promise<Apprenant[]> {
    return ApprenantService.getApprenants()
  }

  static async getApprenant(id: string): Promise<Apprenant | null> {
    return ApprenantService.getApprenant(id)
  }

  // Rendez-vous
  static async getRendezVous(): Promise<RendezVous[]> {
    return RendezVousApiService.getRendezVous()
  }

  // Utilisateurs
  static async getUsers(): Promise<User[]> {
    return UserApiService.getUsers()
  }

  static async getCurrentUser(): Promise<User> {
    // Pour l'instant, retourner le premier utilisateur admin
    const users = await UserApiService.getUsers()
    const adminUser = users.find(user => user.role === 'ADMIN')
    if (adminUser) {
      return adminUser
    }
    // Fallback vers le premier utilisateur
    return (
      users[0] || {
        id: '1',
        email: 'admin@gestionmax.fr',
        name: 'Admin',
        firstName: 'Admin',
        role: 'admin',
        status: 'active',
        permissions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    )
  }

  // Blog
  static async getArticles(): Promise<Article[]> {
    return BlogApiService.getPublishedArticles()
  }

  // Statistiques
  static async getStats(): Promise<ApiStats> {
    try {
      const [programmes, apprenants, rendezVous, articles, utilisateurs] = await Promise.all([
        ProgrammeService.getProgrammes(),
        ApprenantService.getApprenants(),
        RendezVousApiService.getRendezVous(),
        BlogApiService.getPublishedArticles(),
        UserApiService.getUsers(),
      ])

      return {
        programmes: programmes.length,
        apprenants: apprenants.length,
        rendezVous: rendezVous.length,
        articles: articles.length,
        utilisateurs: utilisateurs.length,
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      return {
        programmes: 0,
        apprenants: 0,
        rendezVous: 0,
        articles: 0,
        utilisateurs: 0,
      }
    }
  }

  // Méthodes de création (pour l'interface admin)
  static async createProgramme(programmeData: Partial<Programme>): Promise<Programme> {
    return ProgrammeService.createProgramme(programmeData)
  }

  static async createApprenant(apprenantData: Partial<Apprenant>): Promise<Apprenant> {
    return ApprenantService.createApprenant(apprenantData)
  }

  static async createUser(userData: any): Promise<User> {
    return UserApiService.createUser(userData)
  }

  // Méthodes de mise à jour
  static async updateProgramme(id: string, programmeData: Partial<Programme>): Promise<Programme> {
    return ProgrammeService.updateProgramme(id, programmeData)
  }

  static async updateApprenant(id: string, apprenantData: Partial<Apprenant>): Promise<Apprenant> {
    return ApprenantService.updateApprenant(id, apprenantData)
  }

  static async updateUser(id: string, userData: any): Promise<User> {
    return UserApiService.updateUser(id, userData)
  }

  // Méthodes de suppression
  static async deleteProgramme(id: string): Promise<void> {
    return ProgrammeService.deleteProgramme(id)
  }

  static async deleteApprenant(id: string): Promise<void> {
    return ApprenantService.deleteApprenant(id)
  }

  static async deleteUser(id: string): Promise<void> {
    return UserApiService.deleteUser(id)
  }

  // Méthodes de recherche
  static async searchProgrammes(query: string): Promise<Programme[]> {
    return ProgrammeService.searchProgrammes(query)
  }

  static async searchApprenants(query: string): Promise<Apprenant[]> {
    return ApprenantService.searchApprenants(query)
  }

  static async searchUsers(query: string): Promise<User[]> {
    return UserApiService.searchUsers(query)
  }

  // Méthodes d'authentification
  static async authenticateUser(email: string, password: string): Promise<any> {
    return UserApiService.authenticateUser({ email, password })
  }

  static async changePassword(userId: string, passwordData: any): Promise<void> {
    return UserApiService.changePassword(userId, passwordData)
  }
}
