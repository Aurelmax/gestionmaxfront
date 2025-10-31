/**
 * Service d'authentification utilisant Payload CMS natif
 * L'authentification se fait via /admin/login
 * Les données sont récupérées via Local API côté serveur
 */

import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserRole,
  ROLE_PERMISSIONS,
} from '@/types/common'
import { ID } from '@/types/common'

const SERVER_API_BASE = '/api/server-users'
const AUTH_API_BASE = '/api/auth'

class PayloadAuthService {
  // Récupérer l'utilisateur connecté
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await fetch(`${AUTH_API_BASE}/me`, {
        credentials: 'include', // Important pour les cookies Payload
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data.success ? this.mapPayloadUserToUser(data.user) : null
    } catch (error) {
      console.error('Erreur getCurrentUser:', error)
      return null
    }
  }

  // Vérifier si l'utilisateur est authentifié
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser()
    return user !== null
  }

  // Rediriger vers le login du dashboard
  redirectToLogin(returnUrl?: string): void {
    const redirect = returnUrl || window.location.pathname
    window.location.href = `/dashboard/login?redirect=${encodeURIComponent(redirect)}`
  }

  // Déconnexion (via Payload)
  async logout(): Promise<void> {
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      })

      // Nettoyer localStorage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_email')

      // Rediriger vers login
      window.location.href = '/dashboard/login'
    } catch (error) {
      console.error('Erreur logout:', error)
    }
  }

  // Récupérer tous les utilisateurs (via server-side API)
  async getUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${SERVER_API_BASE}?limit=1000`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs')
      }

      const data = await response.json()
      return data.docs.map((doc: any) => this.mapPayloadUserToUser(doc))
    } catch (error) {
      console.error('Erreur getUsers:', error)
      throw error
    }
  }

  // Récupérer un utilisateur par ID
  async getUserById(id: ID): Promise<User | null> {
    try {
      const response = await fetch(`${SERVER_API_BASE}/${id}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return this.mapPayloadUserToUser(data.doc)
    } catch (error) {
      console.error('Erreur getUserById:', error)
      return null
    }
  }

  // Créer un nouvel utilisateur
  async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const response = await fetch(`${SERVER_API_BASE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          name: userData.name,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          status: 'active',
          phone: userData.phone,
          address: userData.address,
          dateOfBirth: userData.dateOfBirth,
          permissions: userData.permissions || ROLE_PERMISSIONS[userData.role] || [],
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erreur de création' }))
        throw new Error(error.message || "Erreur lors de la création de l'utilisateur")
      }

      const data = await response.json()
      return this.mapPayloadUserToUser(data.doc)
    } catch (error) {
      console.error('Erreur createUser:', error)
      throw error
    }
  }

  // Mettre à jour un utilisateur
  async updateUser(id: ID, userData: UpdateUserRequest): Promise<User> {
    try {
      const response = await fetch(`${SERVER_API_BASE}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'utilisateur")
      }

      const data = await response.json()
      return this.mapPayloadUserToUser(data.doc)
    } catch (error) {
      console.error('Erreur updateUser:', error)
      throw error
    }
  }

  // Supprimer un utilisateur
  async deleteUser(id: ID): Promise<boolean> {
    try {
      const response = await fetch(`${SERVER_API_BASE}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      return response.ok
    } catch (error) {
      console.error('Erreur deleteUser:', error)
      return false
    }
  }

  // Obtenir les statistiques des utilisateurs
  async getUserStats(): Promise<{
    total: number
    byRole: Record<UserRole, number>
    byStatus: Record<string, number>
    activeUsers: number
  }> {
    const users = await this.getUsers()

    const stats = {
      total: users.length,
      byRole: {
        SUPER_ADMIN: 0,
        ADMIN: 0,
        FORMATEUR: 0,
        GESTIONNAIRE: 0,
        APPRENANT: 0,
        BENEFICIAIRE: 0,
      } as Record<UserRole, number>,
      byStatus: {
        active: 0,
        inactive: 0,
        suspended: 0,
        pending: 0,
      },
      activeUsers: 0,
    }

    users.forEach(user => {
      if (user.role && stats.byRole[user.role as UserRole] !== undefined) {
        stats.byRole[user.role as UserRole]++
      }
      if (user.status) {
        stats.byStatus[user.status]++
      }
      if (user.status === 'active') {
        stats.activeUsers++
      }
    })

    return stats
  }

  // Mapper un utilisateur Payload vers notre format
  private mapPayloadUserToUser(payloadUser: any): User {
    const role = (payloadUser.role || 'apprenant') as UserRole
    return {
      id: payloadUser.id,
      email: payloadUser.email,
      name: payloadUser.name || '',
      firstName: payloadUser.firstName || '',
      lastName: payloadUser.lastName || '',
      role,
      status: payloadUser.status || 'active',
      phone: payloadUser.phone,
      address: payloadUser.address,
      dateOfBirth: payloadUser.dateOfBirth,
      avatar: payloadUser.avatar,
      permissions: payloadUser.permissions || ROLE_PERMISSIONS[role] || [],
      lastLoginAt: payloadUser.lastLoginAt,
      metadata: payloadUser.metadata,
      createdAt: payloadUser.createdAt,
      updatedAt: payloadUser.updatedAt,
    }
  }

  // Note: login() n'existe pas car l'auth se fait via /admin/login
  // Utiliser redirectToLogin() à la place
}

// Instance singleton
export const payloadAuthService = new PayloadAuthService()
export { PayloadAuthService }
export default payloadAuthService
