/**
 * Types pour la gestion des utilisateurs et permissions
 * @deprecated Utiliser import depuis '@/types/common' à la place
 * Ce fichier est conservé pour compatibilité backward uniquement
 */

// Réexport de tous les types depuis common.ts (source unique de vérité)
export type {
  User,
  UserRole,
  UserStatus,
  CreateUserRequest,
  UpdateUserRequest,
  LoginRequest,
  LoginResponse,
  ChangePasswordRequest,
  Permission,
} from './common'

export { USER_ROLES, USER_STATUS, ROLE_PERMISSIONS, hasPermission, isUserActive } from './common'

// Permissions disponibles (spécifique à users.ts)
export const PERMISSIONS = {
  // Gestion des utilisateurs
  USERS_READ: 'users:read',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',

  // Gestion des formations
  FORMATIONS_READ: 'formations:read',
  FORMATIONS_CREATE: 'formations:create',
  FORMATIONS_UPDATE: 'formations:update',
  FORMATIONS_DELETE: 'formations:delete',

  // Gestion des apprenants
  APPRENANTS_READ: 'apprenants:read',
  APPRENANTS_CREATE: 'apprenants:create',
  APPRENANTS_UPDATE: 'apprenants:update',
  APPRENANTS_DELETE: 'apprenants:delete',

  // Gestion des rendez-vous
  RENDEZ_VOUS_READ: 'rendez_vous:read',
  RENDEZ_VOUS_CREATE: 'rendez_vous:create',
  RENDEZ_VOUS_UPDATE: 'rendez_vous:update',
  RENDEZ_VOUS_DELETE: 'rendez_vous:delete',

  // Gestion des documents
  DOCUMENTS_READ: 'documents:read',
  DOCUMENTS_CREATE: 'documents:create',
  DOCUMENTS_UPDATE: 'documents:update',
  DOCUMENTS_DELETE: 'documents:delete',

  // Administration
  ADMIN_ACCESS: 'admin:access',
  SYSTEM_SETTINGS: 'system:settings',
  REPORTS_ACCESS: 'reports:access',
} as const

// Import UserRole for hasRole function
import type { UserRole as URoleType } from './common'

// Fonction utilitaire pour vérifier le rôle
export function hasRole(user: { role: URoleType }, role: URoleType): boolean {
  return user.role === role
}
