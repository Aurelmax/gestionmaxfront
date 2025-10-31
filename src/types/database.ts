/**
 * Types mappés sur Prisma pour la base de données
 */

// Types de base pour les entités
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

// Types pour les utilisateurs
export interface UserEntity extends BaseEntity {
  email: string
  firstName: string
  lastName: string
  role: UserRole
  isActive: boolean
  lastLogin?: Date
  passwordHash: string
  refreshToken?: string
  refreshTokenExpires?: Date
}

export type UserRole = 'admin' | 'formateur' | 'apprenant' | 'beneficiaire'

// Types pour les programmes
export interface ProgrammeEntity extends BaseEntity {
  titre: string
  description: string
  duree: number
  niveau: string
  modalites: string
  prix: number
  competences: string[]
  prerequis: string[]
  objectifs: string[]
  isActive: boolean
  createdBy: string
  updatedBy?: string
}

// Types pour les apprenants
export interface ApprenantEntity extends BaseEntity {
  nom: string
  prenom: string
  email: string
  telephone?: string
  dateNaissance?: Date
  adresse?: string
  niveauEtude?: string
  experience?: string
  objectifs?: string
  statut: ApprenantStatut
  userId?: string
  createdBy: string
  updatedBy?: string
}

export type ApprenantStatut = 'inscrit' | 'en_cours' | 'termine' | 'abandonne'

// Types pour les rendez-vous
export interface RendezVousEntity extends BaseEntity {
  apprenantId: string
  programmeId: string
  date: Date
  type: RendezVousType
  duree: number
  modalite: RendezVousModalite
  lieu?: string
  notes?: string
  statut: RendezVousStatut
  createdBy: string
  updatedBy?: string
}

export type RendezVousType = 'positionnement' | 'formation' | 'suivi' | 'evaluation'
export type RendezVousModalite = 'presentiel' | 'distanciel' | 'hybride'
export type RendezVousStatut = 'planifie' | 'confirme' | 'en_cours' | 'termine' | 'annule'

// Types pour les inscriptions
export interface InscriptionEntity extends BaseEntity {
  apprenantId: string
  programmeId: string
  dateInscription: Date
  dateDebut?: Date
  dateFin?: Date
  statut: InscriptionStatut
  montant: number
  modePaiement?: string
  notes?: string
  createdBy: string
  updatedBy?: string
}

export type InscriptionStatut = 'en_attente' | 'confirmee' | 'en_cours' | 'terminee' | 'annulee'

// Types pour les évaluations
export interface EvaluationEntity extends BaseEntity {
  apprenantId: string
  programmeId: string
  type: EvaluationType
  note?: number
  commentaires?: string
  competences: CompetenceEvaluation[]
  dateEvaluation: Date
  evaluateur: string
}

export type EvaluationType = 'positionnement' | 'intermediaire' | 'finale'
export interface CompetenceEvaluation {
  competence: string
  niveau: number
  commentaire?: string
}

// Types pour les sessions
export interface SessionEntity extends BaseEntity {
  programmeId: string
  titre: string
  description: string
  dateDebut: Date
  dateFin: Date
  duree: number
  modalite: RendezVousModalite
  lieu?: string
  formateurId: string
  maxParticipants: number
  participants: string[]
  statut: SessionStatut
  createdBy: string
  updatedBy?: string
}

export type SessionStatut = 'planifiee' | 'en_cours' | 'terminee' | 'annulee'

// Types pour les relations
export interface ProgrammeApprenantRelation {
  programmeId: string
  apprenantId: string
  dateInscription: Date
  statut: InscriptionStatut
}

export interface UserPermissionRelation {
  userId: string
  permission: string
  grantedBy: string
  grantedAt: Date
}

// Types pour les logs d'audit
export interface AuditLogEntity extends BaseEntity {
  userId: string
  action: string
  entityType: string
  entityId: string
  oldValues?: Record<string, unknown>
  newValues?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

// Types pour les statistiques
export interface StatisticEntity {
  id: string
  type: string
  value: number
  metadata?: Record<string, unknown>
  date: Date
  createdBy: string
}

// Types pour les exports
export interface ExportEntity extends BaseEntity {
  type: string
  filters: Record<string, unknown>
  status: 'pending' | 'processing' | 'completed' | 'failed'
  filePath?: string
  downloadUrl?: string
  expiresAt?: Date
  createdBy: string
}
