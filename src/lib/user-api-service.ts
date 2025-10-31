/**
 * Service de gestion des utilisateurs via Payload API
 */

import { payloadApi } from './payload-api-service'
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

export class UserApiService {
  /**
   * Récupérer tous les utilisateurs
   */
  static async getUsers(): Promise<User[]> {
    try {
      const response = await payloadApi.findAll('users', {
        sort: '-createdAt',
        depth: 1,
      })

      return response.docs.map(this.transformPayloadToUser)
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
      throw error
    }
  }

  /**
   * Récupérer un utilisateur par ID
   */
  static async getUserById(id: string): Promise<User | null> {
    try {
      const user = await payloadApi.findById('users', id, { depth: 1 })
      return this.transformPayloadToUser(user)
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error)
      return null
    }
  }

  /**
   * Récupérer un utilisateur par email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const response = await payloadApi.findAll('users', {
        where: {
          email: {
            equals: email,
          },
        },
        limit: 1,
        depth: 1,
      })

      if (response.docs.length > 0) {
        return this.transformPayloadToUser(response.docs[0])
      }
      return null
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${email}:`, error)
      return null
    }
  }

  /**
   * Créer un nouvel utilisateur
   */
  static async createUser(userData: CreateUserRequest): Promise<User> {
    try {
      const payloadData = this.transformUserToPayload(userData)
      const user = await payloadApi.create('users', payloadData, { depth: 1 })
      return this.transformPayloadToUser(user)
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error)
      throw error
    }
  }

  /**
   * Mettre à jour un utilisateur
   */
  static async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    try {
      const payloadData = this.transformUserToPayload(userData)
      const user = await payloadApi.update('users', id, payloadData, { depth: 1 })
      return this.transformPayloadToUser(user)
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error)
      throw error
    }
  }

  /**
   * Supprimer un utilisateur
   */
  static async deleteUser(id: string): Promise<void> {
    try {
      await payloadApi.delete('users', id)
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error)
      throw error
    }
  }

  /**
   * Rechercher des utilisateurs
   */
  static async searchUsers(query: string): Promise<User[]> {
    try {
      const response = await payloadApi.search('users', query, {
        fields: ['name', 'firstName', 'lastName', 'email'],
        sort: '-createdAt',
        depth: 1,
      })

      return response.docs.map(this.transformPayloadToUser)
    } catch (error) {
      console.error("Erreur lors de la recherche d'utilisateurs:", error)
      throw error
    }
  }

  /**
   * Récupérer les utilisateurs par rôle
   */
  static async getUsersByRole(role: UserRole): Promise<User[]> {
    try {
      const response = await payloadApi.findAll('users', {
        where: {
          role: {
            equals: role,
          },
        },
        sort: '-createdAt',
        depth: 1,
      })

      return response.docs.map(this.transformPayloadToUser)
    } catch (error) {
      console.error(`Erreur lors de la récupération des utilisateurs ${role}:`, error)
      throw error
    }
  }

  /**
   * Récupérer les utilisateurs actifs
   */
  static async getActiveUsers(): Promise<User[]> {
    try {
      const response = await payloadApi.findAll('users', {
        where: {
          status: {
            equals: 'active',
          },
        },
        sort: '-createdAt',
        depth: 1,
      })

      return response.docs.map(this.transformPayloadToUser)
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs actifs:', error)
      throw error
    }
  }

  /**
   * Authentifier un utilisateur
   */
  static async authenticateUser(loginData: LoginRequest): Promise<LoginResponse | null> {
    try {
      const user = await this.getUserByEmail(loginData.email)

      if (!user || !user.password) {
        return null
      }

      // Vérifier le mot de passe (en production, utiliser bcrypt)
      if (user.password !== loginData.password) {
        return null
      }

      if (!isUserActive(user)) {
        return null
      }

      // Mettre à jour la dernière connexion
      await this.updateUser(user.id, {
        lastLoginAt: new Date().toISOString(),
      })

      // Générer un token (en production, utiliser JWT)
      const token = this.generateToken(user)
      const refreshToken = this.generateRefreshToken(user)

      return {
        user: this.sanitizeUser(user),
        token,
        refreshToken,
      }
    } catch (error) {
      console.error("Erreur lors de l'authentification:", error)
      return null
    }
  }

  /**
   * Changer le mot de passe d'un utilisateur
   */
  static async changePassword(id: string, passwordData: ChangePasswordRequest): Promise<void> {
    try {
      const user = await this.getUserById(id)
      if (!user) {
        throw new Error('Utilisateur non trouvé')
      }

      // Vérifier l'ancien mot de passe
      if (user.password !== passwordData.currentPassword) {
        throw new Error('Mot de passe actuel incorrect')
      }

      // Vérifier que les nouveaux mots de passe correspondent
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        throw new Error('Les nouveaux mots de passe ne correspondent pas')
      }

      // Mettre à jour le mot de passe
      await this.updateUser(id, {
        password: passwordData.newPassword,
      })
    } catch (error) {
      console.error(`Erreur lors du changement de mot de passe pour l'utilisateur ${id}:`, error)
      throw error
    }
  }

  /**
   * Vérifier les permissions d'un utilisateur
   */
  static async checkUserPermissions(userId: string, permission: Permission): Promise<boolean> {
    try {
      const user = await this.getUserById(userId)
      if (!user) {
        return false
      }

      return hasPermission(user, permission)
    } catch (error) {
      console.error(
        `Erreur lors de la vérification des permissions pour l'utilisateur ${userId}:`,
        error
      )
      return false
    }
  }

  /**
   * Transformer les données Payload vers le format User
   */
  private static transformPayloadToUser(payloadData: any): User {
    return {
      id: payloadData.id,
      email: payloadData.email,
      password: payloadData.password,
      name: payloadData.name,
      firstName: payloadData.firstName,
      lastName: payloadData.lastName,
      role: payloadData.role,
      status: payloadData.status,
      avatar: payloadData.avatar,
      phone: payloadData.phone,
      address: payloadData.address,
      dateOfBirth: payloadData.dateOfBirth,
      lastLoginAt: payloadData.lastLoginAt,
      permissions: payloadData.permissions || ROLE_PERMISSIONS[payloadData.role] || [],
      metadata: payloadData.metadata,
      createdAt: payloadData.createdAt,
      updatedAt: payloadData.updatedAt,
    }
  }

  /**
   * Transformer les données User vers le format Payload
   */
  private static transformUserToPayload(userData: any): any {
    return {
      email: userData.email,
      password: userData.password,
      name: userData.name,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      status: userData.status,
      avatar: userData.avatar,
      phone: userData.phone,
      address: userData.address,
      dateOfBirth: userData.dateOfBirth,
      lastLoginAt: userData.lastLoginAt,
      permissions: userData.permissions,
      metadata: userData.metadata,
    }
  }

  /**
   * Générer un token d'authentification
   */
  private static generateToken(user: User): string {
    // En production, utiliser JWT
    return `token_${user.id}_${Date.now()}`
  }

  /**
   * Générer un refresh token
   */
  private static generateRefreshToken(user: User): string {
    // En production, utiliser JWT
    return `refresh_${user.id}_${Date.now()}`
  }

  /**
   * Nettoyer les données utilisateur (supprimer le mot de passe)
   */
  private static sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...sanitizedUser } = user
    return sanitizedUser
  }
}
