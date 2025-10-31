/**
 * Service unifié qui remplace MockService avec des données MongoDB réelles
 */

import { mongodbService } from './mongodb-service'
import type { Programme, Apprenant, RendezVous, User } from '@/types/common'
import type { Article } from '@/types/blog'

export class UnifiedService {
  // Programmes
  static async getProgrammes(): Promise<Programme[]> {
    return mongodbService.getProgrammes()
  }

  static async getProgramme(id: string): Promise<Programme | null> {
    return mongodbService.getProgramme(id)
  }

  // Apprenants
  static async getApprenants(): Promise<Apprenant[]> {
    return mongodbService.getApprenants()
  }

  static async getApprenant(id: string): Promise<Apprenant | null> {
    return mongodbService.getApprenant(id)
  }

  // Rendez-vous
  static async getRendezVous(): Promise<RendezVous[]> {
    return mongodbService.getRendezVous()
  }

  // Utilisateurs
  static async getUsers(): Promise<User[]> {
    return mongodbService.getUsers()
  }

  static async getCurrentUser(): Promise<User> {
    return mongodbService.getCurrentUser()
  }

  // Articles
  static async getArticles(): Promise<Article[]> {
    return mongodbService.getArticles()
  }

  // Statistiques
  static async getStats(): Promise<any> {
    return mongodbService.getStats()
  }

  // Méthodes de création (pour l'interface admin)
  static async createUser(userData: any): Promise<User> {
    // Pour l'instant, retourner un utilisateur mock
    // TODO: Implémenter la création réelle
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: userData.email,
      name: userData.name,
      firstName: userData.firstName,
      role: userData.role || 'apprenant',
      status: 'active',
      permissions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return newUser
  }

  static async updateUser(userId: string, userData: any): Promise<User> {
    // Pour l'instant, retourner l'utilisateur modifié
    // TODO: Implémenter la mise à jour réelle
    const users = await this.getUsers()
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex === -1) {
      throw new Error('Utilisateur non trouvé')
    }

    const updatedUser = {
      ...users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    }

    return updatedUser
  }

  static async deleteUser(userId: string): Promise<void> {
    // TODO: Implémenter la suppression réelle
    console.log(`Suppression de l'utilisateur ${userId}`)
  }

  static async changePassword(userId: string, _passwordData: any): Promise<void> {
    // TODO: Implémenter le changement de mot de passe
    console.log(`Changement de mot de passe pour l'utilisateur ${userId}`)
  }
}
