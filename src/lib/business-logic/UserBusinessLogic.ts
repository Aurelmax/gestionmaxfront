import { User, CreateUserRequest, UserRole } from '@/types/common'
import { validate, userValidationRules } from '@/lib/validation'

/**
 * Logique métier pour la gestion des utilisateurs
 * Sépare la logique métier de l'interface utilisateur
 */
export class UserBusinessLogic {
  /**
   * Valide un utilisateur
   */
  static validateUser(user: Partial<User>): Record<string, string> {
    return validate(user as any, userValidationRules as any) as Record<string, string>
  }

  /**
   * Valide une requête de création d'utilisateur
   */
  static validateCreateUserRequest(request: CreateUserRequest): Record<string, string> {
    return validate(request as any, userValidationRules as any) as Record<string, string>
  }

  /**
   * Génère un nom d'utilisateur à partir du nom et prénom
   */
  static generateUsername(firstName: string, lastName: string): string {
    const cleanFirstName = firstName.toLowerCase().replace(/[^a-z]/g, '')
    const cleanLastName = lastName.toLowerCase().replace(/[^a-z]/g, '')
    return `${cleanFirstName}.${cleanLastName}`
  }

  /**
   * Génère un mot de passe temporaire
   */
  static generateTemporaryPassword(length: number = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''

    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return password
  }

  /**
   * Vérifie si un utilisateur peut être supprimé
   */
  static canDeleteUser(user: User, currentUser: User): { canDelete: boolean; reason?: string } {
    // Un utilisateur ne peut pas se supprimer lui-même
    if (user.id === currentUser.id) {
      return { canDelete: false, reason: 'Vous ne pouvez pas supprimer votre propre compte' }
    }

    // Vérifier les permissions
    if (currentUser.role === 'APPRENANT') {
      return { canDelete: false, reason: 'Permissions insuffisantes' }
    }

    // Un apprenant ne peut pas supprimer un admin ou formateur
    if (currentUser.role === 'GESTIONNAIRE' && ['ADMIN', 'FORMATEUR'].includes(user.role)) {
      return {
        canDelete: false,
        reason: 'Permissions insuffisantes pour supprimer cet utilisateur',
      }
    }

    return { canDelete: true }
  }

  /**
   * Vérifie si un utilisateur peut modifier un autre utilisateur
   */
  static canModifyUser(
    targetUser: User,
    currentUser: User
  ): { canModify: boolean; reason?: string } {
    // Un utilisateur peut toujours se modifier lui-même (sauf le rôle)
    if (targetUser.id === currentUser.id) {
      return { canModify: true }
    }

    // Vérifier les permissions
    if (currentUser.role === 'APPRENANT') {
      return { canModify: false, reason: 'Permissions insuffisantes' }
    }

    // Un gestionnaire ne peut pas modifier un admin ou formateur
    if (currentUser.role === 'GESTIONNAIRE' && ['ADMIN', 'FORMATEUR'].includes(targetUser.role)) {
      return { canModify: false, reason: 'Permissions insuffisantes pour modifier cet utilisateur' }
    }

    return { canModify: true }
  }

  /**
   * Vérifie si un utilisateur peut changer le rôle d'un autre utilisateur
   */
  static canChangeUserRole(
    targetUser: User,
    _newRole: UserRole,
    currentUser: User
  ): { canChange: boolean; reason?: string } {
    // Seuls les admins peuvent changer les rôles
    if (currentUser.role !== 'ADMIN') {
      return { canChange: false, reason: 'Seuls les administrateurs peuvent changer les rôles' }
    }

    // Un utilisateur ne peut pas changer son propre rôle
    if (targetUser.id === currentUser.id) {
      return { canChange: false, reason: 'Vous ne pouvez pas changer votre propre rôle' }
    }

    return { canChange: true }
  }

  /**
   * Calcule les statistiques d'un utilisateur
   */
  static calculateUserStats(user: User) {
    const now = new Date()
    const createdAt = new Date(user.createdAt)
    const daysSinceCreation = Math.floor(
      (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    )

    return {
      daysSinceCreation,
      isActive: user.status === 'active',
      hasCompleteProfile: !!(user.firstName && user.lastName && user.email),
      roleLevel: this.getRoleLevel(user.role),
    }
  }

  /**
   * Obtient le niveau hiérarchique d'un rôle
   */
  private static getRoleLevel(role: UserRole): number {
    const roleLevels: Record<UserRole, number> = {
      APPRENANT: 1,
      BENEFICIAIRE: 1,
      GESTIONNAIRE: 2,
      FORMATEUR: 3,
      ADMIN: 4,
      SUPER_ADMIN: 5,
    }
    return roleLevels[role] || 0
  }

  /**
   * Filtre les utilisateurs selon les permissions
   */
  static filterUsersByPermissions(users: User[], currentUser: User): User[] {
    if (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN') {
      return users
    }

    if (currentUser.role === 'FORMATEUR') {
      return users.filter(user => ['apprenant', 'gestionnaire'].includes(user.role))
    }

    if (currentUser.role === 'GESTIONNAIRE') {
      return users.filter(user => user.role === 'APPRENANT')
    }

    return []
  }

  /**
   * Prépare les données d'utilisateur pour l'affichage
   */
  static prepareUserForDisplay(user: User): User {
    return {
      ...user,
      // Masquer les informations sensibles si nécessaire
      password: undefined,
      // Formater les dates
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt),
    }
  }

  /**
   * Génère un résumé d'utilisateur
   */
  static generateUserSummary(user: User): string {
    const stats = this.calculateUserStats(user)
    const fullName =
      `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || 'Utilisateur'

    return `${fullName} (${user.role}) - ${stats.isActive ? 'Actif' : 'Inactif'} - Créé il y a ${stats.daysSinceCreation} jour(s)`
  }

  /**
   * Vérifie la force d'un mot de passe
   */
  static checkPasswordStrength(password: string): {
    strength: 'weak' | 'medium' | 'strong'
    score: number
    feedback: string[]
  } {
    const feedback: string[] = []
    let score = 0

    if (password.length >= 8) score += 1
    else feedback.push('Au moins 8 caractères')

    if (/[a-z]/.test(password)) score += 1
    else feedback.push('Au moins une minuscule')

    if (/[A-Z]/.test(password)) score += 1
    else feedback.push('Au moins une majuscule')

    if (/[0-9]/.test(password)) score += 1
    else feedback.push('Au moins un chiffre')

    if (/[^A-Za-z0-9]/.test(password)) score += 1
    else feedback.push('Au moins un caractère spécial')

    let strength: 'weak' | 'medium' | 'strong'
    if (score < 3) strength = 'weak'
    else if (score < 5) strength = 'medium'
    else strength = 'strong'

    return { strength, score, feedback }
  }
}
