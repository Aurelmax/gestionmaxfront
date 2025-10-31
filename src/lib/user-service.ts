/**
 * Service de gestion des utilisateurs et permissions
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

// Utilisateurs réels du système
const realUsers: User[] = [
  {
    id: '1',
    email: 'aurelien@gestionmax.fr',
    password: 'nw*T/y@_yVjkS?Q', // Mot de passe sécurisé
    name: 'Aurélien',
    firstName: 'Aurélien',
    lastName: 'GestionMax',
    role: 'ADMIN',
    status: 'active',
    permissions: ROLE_PERMISSIONS['ADMIN'],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

class UserService {
  private users: User[] = [...realUsers]

  constructor() {
    // Charger les utilisateurs depuis le localStorage s'ils existent
    this.loadUsersFromStorage()
  }

  private loadUsersFromStorage() {
    // Vérifier si nous sommes côté client (localStorage n'est pas disponible côté serveur)
    if (typeof window === 'undefined') {
      console.log('📁 Côté serveur - Utilisation des utilisateurs par défaut')
      return
    }

    try {
      const storedUsers = localStorage.getItem('gestionmax_users')
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers)
        console.log('📁 Utilisateurs chargés depuis localStorage:', parsedUsers)
        // Fusionner avec les utilisateurs réels (éviter les doublons)
        const existingEmails = this.users.map(u => u.email)
        const newUsers = parsedUsers.filter((u: User) => !existingEmails.includes(u.email))
        this.users = [...this.users, ...newUsers]
        console.log(
          '👥 Utilisateurs finaux après fusion:',
          this.users.map(u => u.email)
        )
      } else {
        console.log(
          '📁 Aucun utilisateur stocké dans localStorage - Utilisation des utilisateurs par défaut'
        )
        // Sauvegarder les utilisateurs par défaut dans localStorage
        this.saveUsersToStorage()
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error)
    }
  }

  private saveUsersToStorage() {
    // Vérifier si nous sommes côté client (localStorage n'est pas disponible côté serveur)
    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.setItem('gestionmax_users', JSON.stringify(this.users))
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des utilisateurs:', error)
    }
  }

  // Récupérer tous les utilisateurs
  async getUsers(): Promise<User[]> {
    return this.users.map(user => this.sanitizeUser(user))
  }

  // Récupérer un utilisateur par ID
  async getUserById(id: ID): Promise<User | null> {
    const user = this.users.find(u => u.id === id)
    return user ? this.sanitizeUser(user) : null
  }

  // Récupérer un utilisateur par email
  async getUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email)
    return user ? this.sanitizeUser(user) : null
  }

  // Créer un nouvel utilisateur
  async createUser(userData: CreateUserRequest): Promise<User> {
    // Vérifier si l'email existe déjà
    const existingUser = this.users.find(u => u.email === userData.email)
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà')
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: userData.email,
      password: userData.password || 'password123', // Mot de passe par défaut
      name: userData.name,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      status: 'active',
      phone: userData.phone,
      address: userData.address,
      dateOfBirth: userData.dateOfBirth,
      permissions: userData.permissions || ROLE_PERMISSIONS[userData.role] || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.users.push(newUser)
    this.saveUsersToStorage() // Sauvegarder dans localStorage
    return this.sanitizeUser(newUser)
  }

  // Mettre à jour un utilisateur
  async updateUser(id: ID, userData: UpdateUserRequest): Promise<User> {
    const userIndex = this.users.findIndex(u => u.id === id)
    if (userIndex === -1) {
      throw new Error('Utilisateur non trouvé')
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: new Date(),
    } as User

    const updatedUser = this.users[userIndex]
    return this.sanitizeUser(updatedUser)
  }

  // Supprimer un utilisateur
  async deleteUser(id: ID): Promise<boolean> {
    const userIndex = this.users.findIndex(u => u.id === id)
    if (userIndex === -1) {
      return false
    }

    this.users.splice(userIndex, 1)
    return true
  }

  // Changer le mot de passe
  async changePassword(id: ID, passwordData: ChangePasswordRequest): Promise<boolean> {
    const user = this.users.find(u => u.id === id)
    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }

    // En production, vérifier le mot de passe actuel
    // if (!await bcrypt.compare(passwordData.currentPassword, user.password)) {
    //   throw new Error('Mot de passe actuel incorrect');
    // }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      throw new Error('Les nouveaux mots de passe ne correspondent pas')
    }

    // En production, hasher le nouveau mot de passe
    // user.password = await bcrypt.hash(passwordData.newPassword, 10);

    user.updatedAt = new Date()
    return true
  }

  // Vérifier les permissions
  async checkPermission(userId: ID, permission: Permission): Promise<boolean> {
    const user = this.users.find(u => u.id === userId)
    if (!user || !isUserActive(user)) {
      return false
    }

    return hasPermission(user, permission)
  }

  // Obtenir les permissions d'un utilisateur
  async getUserPermissions(userId: ID): Promise<Permission[]> {
    const user = this.users.find(u => u.id === userId)
    if (!user) {
      return []
    }

    return user.permissions || []
  }

  // Obtenir les utilisateurs par rôle
  async getUsersByRole(role: UserRole): Promise<User[]> {
    return this.users.filter(u => u.role === role).map(user => this.sanitizeUser(user))
  }

  // Connexion utilisateur
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('🔍 Tentative de connexion:', {
      email: credentials.email,
      password: credentials.password,
      totalUsers: this.users.length,
      usersAvailable: this.users.map(u => ({
        email: u.email,
        hasPassword: !!u.password,
        password: u.password,
      })),
    })

    // Recherche d'abord par email
    const user = this.users.find(u => u.email === credentials.email)

    if (!user) {
      console.log('❌ Email non trouvé:', {
        email: credentials.email,
        availableEmails: this.users.map(u => u.email),
      })
      throw new Error('Email ou mot de passe incorrect')
    }

    // Vérifier le mot de passe
    if (user.password !== credentials.password) {
      console.log('❌ Mot de passe incorrect:', {
        email: credentials.email,
        expectedPassword: user.password,
        providedPassword: credentials.password,
      })
      throw new Error('Email ou mot de passe incorrect')
    }

    if (!isUserActive(user)) {
      throw new Error('Compte désactivé ou suspendu')
    }

    // Mettre à jour la dernière connexion
    user.lastLoginAt = new Date().toISOString()
    user.updatedAt = new Date()

    // Générer un token (en mode mock)
    const token = `mock_token_${user.id}_${Date.now()}`
    const refreshToken = `mock_refresh_${user.id}_${Date.now()}`

    return {
      user: this.sanitizeUser(user),
      token,
      refreshToken,
    }
  }

  // Déconnexion utilisateur
  async logout(): Promise<void> {
    // En mode mock, on ne fait rien de spécial
    // En production, on invaliderait le token côté serveur
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
  }

  // Obtenir les statistiques des utilisateurs
  async getUserStats(): Promise<{
    total: number
    byRole: Record<UserRole, number>
    byStatus: Record<string, number>
    activeUsers: number
  }> {
    const stats = {
      total: this.users.length,
      byRole: {
        SUPER_ADMIN: 0,
        ADMIN: 0,
        FORMATEUR: 0,
        GESTIONNAIRE: 0,
        APPRENANT: 0,
      } as Record<UserRole, number>,
      byStatus: {
        active: 0,
        inactive: 0,
        suspended: 0,
        pending: 0,
      },
      activeUsers: 0,
    }

    this.users.forEach(user => {
      stats.byRole[user.role]++
      if (user.status) {
        stats.byStatus[user.status]++
      }
      if (user.status === 'active') {
        stats.activeUsers++
      }
    })

    return stats
  }

  // Nettoyer les données sensibles de l'utilisateur
  private sanitizeUser(user: User): User {
    const { password, ...sanitizedUser } = user
    return sanitizedUser as User
  }

  // Réinitialiser les permissions d'un utilisateur selon son rôle
  async resetUserPermissions(userId: ID): Promise<User> {
    const user = this.users.find(u => u.id === userId)
    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }

    const defaultPermissions = ROLE_PERMISSIONS[user.role] || []
    return this.updateUser(userId, { permissions: defaultPermissions } as UpdateUserRequest)
  }
}

// Instance singleton
export const userService = new UserService()
export { UserService }
export default userService
