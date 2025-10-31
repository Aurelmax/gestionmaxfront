/**
 * Service de gestion des utilisateurs connecté à l'API Payload CMS
 */

import {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  LoginRequest,
  LoginResponse,
  UserRole,
  Permission,
  ROLE_PERMISSIONS,
  hasPermission,
  isUserActive,
} from '@/types/common'
import { ID } from '@/types/common'

// ✅ Utiliser les routes natives Payload
// Les routes API Payload sont sous /api car admin route = '/admin'
const API_BASE_URL = '/api'

class PayloadUserService {
  // Authentification via Payload (route native)
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
      credentials: 'include', // Important pour les cookies de session Payload
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erreur de connexion' }))
      throw new Error(error.message || 'Identifiants invalides')
    }

    const data = await response.json()

    // Payload retourne { user, token, exp }
    // Sauvegarder le token dans localStorage pour les requêtes suivantes
    if (data.token) {
      localStorage.setItem('auth_token', data.token)
    }

    return {
      user: this.mapPayloadUserToUser(data.user),
      token: data.token,
      refreshToken: data.token, // Payload utilise le même token
    }
  }

  // Déconnexion (route native)
  async logout(): Promise<void> {
    await fetch(`${API_BASE_URL}/users/logout`, {
      method: 'POST',
      credentials: 'include',
    })

    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  }

  // Récupérer tous les utilisateurs (route native)
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users?limit=1000`, {
      headers: this.getAuthHeaders(),
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des utilisateurs')
    }

    const data = await response.json()
    return data.docs.map((doc: any) => this.mapPayloadUserToUser(doc))
  }

  // Récupérer un utilisateur par ID (route native)
  async getUserById(id: ID): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: this.getAuthHeaders(),
        credentials: 'include',
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return this.mapPayloadUserToUser(data)
    } catch {
      return null
    }
  }

  // Récupérer un utilisateur par email (route native)
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/users?where[email][equals]=${encodeURIComponent(email)}`,
        {
          headers: this.getAuthHeaders(),
          credentials: 'include',
        }
      )

      if (!response.ok) {
        return null
      }

      const data = await response.json()
      return data.docs.length > 0 ? this.mapPayloadUserToUser(data.docs[0]) : null
    } catch {
      return null
    }
  }

  // Créer un nouvel utilisateur (route native)
  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        ...this.getAuthHeaders(),
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
      // Vérifier si la réponse est HTML (non authentifié)
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('text/html')) {
        throw new Error(
          "Vous devez être connecté pour créer un utilisateur. Veuillez vous connecter à l'admin."
        )
      }

      const error = await response.json().catch(() => ({ message: 'Erreur de création' }))
      console.error('Erreur API Payload:', error)

      // Extraire les messages d'erreur de validation Payload
      if (error.errors && Array.isArray(error.errors)) {
        const errorMessages = error.errors.map((e: any) => e.message).join(', ')
        throw new Error(`Erreur de validation: ${errorMessages}`)
      }

      throw new Error(error.message || "Erreur lors de la création de l'utilisateur")
    }

    const data = await response.json()
    return this.mapPayloadUserToUser(data.doc)
  }

  // Mettre à jour un utilisateur (route native)
  async updateUser(id: ID, userData: UpdateUserRequest): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
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
  }

  // Supprimer un utilisateur (route native)
  async deleteUser(id: ID): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      credentials: 'include',
    })

    return response.ok
  }

  // Changer le mot de passe
  async changePassword(id: ID, passwordData: ChangePasswordRequest): Promise<boolean> {
    // Note: Payload ne vérifie pas le mot de passe actuel par défaut
    // Il faut implémenter cette logique si nécessaire
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PATCH',
      headers: {
        ...this.getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: passwordData.newPassword,
      }),
    })

    return response.ok
  }

  // Vérifier les permissions
  async checkPermission(userId: ID, permission: Permission): Promise<boolean> {
    const user = await this.getUserById(userId)
    if (!user || !isUserActive(user)) {
      return false
    }

    return hasPermission(user, permission)
  }

  // Obtenir les permissions d'un utilisateur
  async getUserPermissions(userId: ID): Promise<Permission[]> {
    const user = await this.getUserById(userId)
    return user?.permissions || []
  }

  // Obtenir les utilisateurs par rôle
  async getUsersByRole(role: UserRole): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users?where[role][equals]=${role}&limit=1000`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des utilisateurs')
    }

    const data = await response.json()
    return data.docs.map((doc: any) => this.mapPayloadUserToUser(doc))
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

  // Réinitialiser les permissions d'un utilisateur selon son rôle
  async resetUserPermissions(userId: ID): Promise<User> {
    const user = await this.getUserById(userId)
    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }

    const defaultPermissions = ROLE_PERMISSIONS[user.role] || []
    return this.updateUser(userId, { id: userId, permissions: defaultPermissions })
  }

  // Utilitaires privés

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token')
    return token
      ? {
          Authorization: `JWT ${token}`,
        }
      : {}
  }

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
}

// Instance singleton
export const payloadUserService = new PayloadUserService()
export { PayloadUserService }
export default payloadUserService
