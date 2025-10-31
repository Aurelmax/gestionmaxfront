/**
 * Types globaux partagés dans toute l'application
 */

import { Timestamped } from './utils'

// Re-export Timestamped for external use
export type { Timestamped } from './utils'

// Types de base
export type ID = string
export type UUID = string
export type ISODate = string
// Rôles utilisateur
export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  FORMATEUR: 'FORMATEUR',
  GESTIONNAIRE: 'GESTIONNAIRE',
  APPRENANT: 'APPRENANT',
  BENEFICIAIRE: 'BENEFICIAIRE',
} as const
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

// Statuts utilisateur
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS]

/**
 * Interface User - Source unique de vérité
 * Consolidation de toutes les variantes (common.ts, users.ts, payload.ts)
 * Compatible avec Payload CMS et l'application frontend
 */
export interface User extends Timestamped {
  // Identifiants
  id: ID
  email: string

  // Noms (support des deux conventions)
  nom?: string // Convention française
  prenom?: string // Convention française
  name?: string // Convention Payload/anglaise
  firstName?: string // Convention Payload/anglaise
  lastName?: string // Convention Payload/anglaise

  // Sécurité et permissions
  password?: string // Hashé, jamais en plain text
  role: UserRole
  status?: UserStatus

  // Informations complémentaires
  avatar?: string
  phone?: string
  address?: string
  dateOfBirth?: string
  lastLoginAt?: string

  // Métadonnées
  permissions?: string[]
  metadata?: Record<string, unknown>
}

/**
 * Interface pour la création d'utilisateur
 */
export interface CreateUserRequest {
  email: string
  password: string
  name: string
  firstName?: string
  lastName?: string
  nom?: string
  prenom?: string
  role: UserRole
  status?: UserStatus
  avatar?: string
  phone?: string
  address?: string
  dateOfBirth?: string
  permissions?: string[]
}

/**
 * Interface pour la mise à jour d'utilisateur
 */
export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: ID
}

/**
 * Permissions disponibles dans l'application
 */
export type Permission = string

/**
 * Interface pour les requêtes de connexion
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * Interface pour les réponses de connexion
 */
export interface LoginResponse {
  user: User
  token: string
  refreshToken?: string
}

/**
 * Interface pour le changement de mot de passe
 */
export interface ChangePasswordRequest {
  oldPassword: string
  currentPassword?: string // Alias for backward compatibility
  newPassword: string
  confirmPassword?: string // Optional confirmation field
}

/**
 * Mapping des permissions par rôle
 */
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  SUPER_ADMIN: ['*'],
  ADMIN: ['users:read', 'users:create', 'users:update', 'programmes:*'],
  FORMATEUR: ['programmes:read', 'apprenants:read'],
  APPRENANT: ['programmes:read'],
  GESTIONNAIRE: ['programmes:read', 'apprenants:*'],
  BENEFICIAIRE: ['programmes:read'],
}

/**
 * Vérifie si un utilisateur a une permission
 */
export const hasPermission = (user: User, permission: Permission): boolean => {
  if (!user || !user.role) return false
  const rolePermissions = ROLE_PERMISSIONS[user.role] || []
  return rolePermissions.includes('*') || rolePermissions.includes(permission)
}

/**
 * Vérifie si un utilisateur est actif
 */
export const isUserActive = (user: User): boolean => {
  return user?.status === USER_STATUS.ACTIVE
}

// Niveaux de formation
export const NIVEAUX = {
  DEBUTANT: 'DEBUTANT',
  INTERMEDIAIRE: 'INTERMEDIAIRE',
  AVANCE: 'AVANCE',
} as const
export type Niveau = (typeof NIVEAUX)[keyof typeof NIVEAUX]
// Modalités de formation
export const MODALITES = {
  PRESENTIEL: 'PRESENTIEL',
  DISTANCIEL: 'DISTANCIEL',
  HYBRIDE: 'HYBRIDE',
} as const
export type Modalite = (typeof MODALITES)[keyof typeof MODALITES]
// Statuts de programme
export const PROGRAMME_STATUTS = {
  BROUILLON: 'BROUILLON',
  PUBLIE: 'PUBLIE',
  ARCHIVE: 'ARCHIVE',
} as const
export type ProgrammeStatut = (typeof PROGRAMME_STATUTS)[keyof typeof PROGRAMME_STATUTS]
// Interface Programme
export interface Programme extends Timestamped {
  id: ID
  codeFormation: string // Code formation interne (ex: A009-SW-MA)
  titre: string
  description: string
  objectifs?: string // Objectifs pédagogiques
  prerequis?: string // Prérequis
  publicConcerne?: string // Public concerné
  duree: number // heures
  horaires?: string // Horaires de formation
  delaisMiseEnPlace?: string // Délais de mise en place
  niveau: Niveau
  modalites: Modalite
  prix: number
  modalitesReglement?: string // Modalités de règlement
  statut: ProgrammeStatut
  image?: string
  formateurs: ID[] // IDs
  competences: string[]
  ressources?: string[] // Ressources et matériel
  modalitesEvaluation?: string // Modalités d'évaluation
  sanctionFormation?: string // Sanction de la formation
  niveauCertification?: string // Niveau/Certification
  accessibiliteHandicap?: string // Accessibilité handicap
  cessationAbandon?: string // Cessation anticipée/Abandon
  // Informations formateur
  formateurNom?: string
  formateurEmail?: string
  formateurTelephone?: string
  formateurRole?: string
  formateurBiographie?: string
  // Additional properties for compatibility
  programme?: Record<string, unknown> // Programme détaillé
  modalitesPedagogiques?: Record<string, unknown> // Modalités pédagogiques
  evaluation?: string // Évaluation
  certification?: string // Certification
  eligibleCPF?: boolean // Éligible CPF
  codeCPF?: string // Code CPF
}
// Statuts apprenant
export const APPRENANT_STATUTS = {
  ACTIF: 'ACTIF',
  INACTIF: 'INACTIF',
  TERMINE: 'TERMINE',
} as const
export type ApprenantStatut = (typeof APPRENANT_STATUTS)[keyof typeof APPRENANT_STATUTS]
// Interface Apprenant
export interface Apprenant extends Timestamped {
  id: ID
  nom: string
  prenom: string
  email: string
  telephone: string
  dateNaissance: ISODate
  dateInscription?: ISODate // Date d'inscription
  adresse: string
  statut: ApprenantStatut
  programmes: ID[] // Programme IDs
  formations?: ID[] // Formation IDs (alias pour programmes)
  progression: number // 0-100
  avatar?: string
}
// Types de rendez-vous (alignés avec Payload CMS)
export const RENDEZ_VOUS_TYPES = {
  POSITIONNEMENT: 'positionnement',
  INFORMATION: 'information',
  INSCRIPTION: 'inscription',
  SUIVI: 'suivi',
} as const
export type RendezVousType = (typeof RENDEZ_VOUS_TYPES)[keyof typeof RENDEZ_VOUS_TYPES]
// Statuts rendez-vous (alignés avec Payload CMS)
export const RENDEZ_VOUS_STATUTS = {
  EN_ATTENTE: 'enAttente',
  CONFIRME: 'confirme',
  TERMINE: 'termine',
  ANNULE: 'annule',
  REPORTE: 'reporte',
} as const
export type RendezVousStatut = (typeof RENDEZ_VOUS_STATUTS)[keyof typeof RENDEZ_VOUS_STATUTS]
// Interface RendezVous (alignée avec Payload CMS)
export interface RendezVous {
  id: ID
  programmeId: ID
  programmeTitre: string
  client: {
    nom: string
    prenom: string
    email: string
    telephone?: string
    entreprise?: string
  }
  type: RendezVousType
  statut: RendezVousStatut
  date: ISODate
  heure: string // Format HH:MM
  duree: number // en minutes
  lieu: 'presentiel' | 'visio' | 'telephone'
  adresse?: string // Pour présentiel
  lienVisio?: string // Pour visio
  notes?: string
  rappelEnvoye: boolean
  createdAt: ISODate
  updatedAt: ISODate
  createdBy?: ID // ID de l'utilisateur qui a créé le RDV
}
