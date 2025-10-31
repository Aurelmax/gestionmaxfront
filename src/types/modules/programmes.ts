/**
 * Types spécifiques au module Programmes
 */

import { Timestamped } from '../utils'

// Types pour les programmes
export interface Programme extends Timestamped {
  titre: string
  description: string
  duree: number
  niveau: ProgrammeNiveau
  modalites: ProgrammeModalite[]
  prix: number
  competences: string[]
  prerequis: string[]
  objectifs: string[]
  isActive: boolean
  createdBy: string
  updatedBy?: string
  sessions?: Session[]
  inscriptions?: Inscription[]
}

export type ProgrammeNiveau = 'debutant' | 'intermediaire' | 'avance' | 'expert'
export type ProgrammeModalite = 'presentiel' | 'distanciel' | 'hybride'

// Types pour les sessions
export interface Session extends Timestamped {
  programmeId: string
  titre: string
  description: string
  dateDebut: Date
  dateFin: Date
  duree: number
  modalite: ProgrammeModalite
  lieu?: string
  formateurId: string
  maxParticipants: number
  participants: string[]
  statut: SessionStatut
  createdBy: string
  updatedBy?: string
}

export type SessionStatut = 'planifiee' | 'en_cours' | 'terminee' | 'annulee'

// Types pour les inscriptions
export interface Inscription extends Timestamped {
  apprenantId: string
  programmeId: string
  sessionId?: string
  dateInscription: Date
  dateDebut?: Date
  dateFin?: Date
  statut: InscriptionStatut
  montant: number
  modePaiement?: ModePaiement
  notes?: string
  createdBy: string
  updatedBy?: string
}

export type InscriptionStatut = 'en_attente' | 'confirmee' | 'en_cours' | 'terminee' | 'annulee'
export type ModePaiement = 'especes' | 'cheque' | 'virement' | 'carte' | 'cpf' | 'opco'

// Types pour les compétences
export interface Competence {
  id: string
  nom: string
  description: string
  niveau: number
  categorie: string
  isActive: boolean
}

// Types pour les objectifs
export interface Objectif {
  id: string
  programmeId: string
  titre: string
  description: string
  ordre: number
  isActive: boolean
}

// Types pour les prérequis
export interface Prerequis {
  id: string
  programmeId: string
  titre: string
  description: string
  niveau: 'obligatoire' | 'recommandé' | 'optionnel'
  isActive: boolean
}

// Types pour les évaluations de programmes
export interface ProgrammeEvaluation {
  id: string
  programmeId: string
  apprenantId: string
  note: number
  commentaires?: string
  competences: CompetenceEvaluation[]
  dateEvaluation: Date
  evaluateur: string
}

export interface CompetenceEvaluation {
  competence: string
  niveau: number
  commentaire?: string
}

// Types pour les statistiques de programmes
export interface ProgrammeStats {
  programmeId: string
  totalInscriptions: number
  inscriptionsActives: number
  inscriptionsTerminees: number
  tauxReussite: number
  satisfactionMoyenne: number
  revenus: number
  couts: number
  benefices: number
}

// Types pour les filtres de programmes
export interface ProgrammeFilters {
  search?: string
  niveau?: ProgrammeNiveau
  modalites?: ProgrammeModalite[]
  prixMin?: number
  prixMax?: number
  dureeMin?: number
  dureeMax?: number
  competences?: string[]
  isActive?: boolean
  createdBy?: string
  dateCreationFrom?: Date
  dateCreationTo?: Date
}

// Types pour les formulaires de programmes
export interface ProgrammeFormData {
  titre: string
  description: string
  duree: number
  niveau: ProgrammeNiveau
  modalites: ProgrammeModalite[]
  prix: number
  competences: string[]
  prerequis: string[]
  objectifs: string[]
  isActive: boolean
}

// Types pour les actions de programmes
export interface ProgrammeAction {
  type: 'create' | 'update' | 'delete' | 'activate' | 'deactivate' | 'duplicate'
  programmeId?: string
  data?: Partial<ProgrammeFormData>
  reason?: string
  userId: string
  timestamp: Date
}

// Types pour les exports de programmes
export interface ProgrammeExport {
  format: 'csv' | 'xlsx' | 'pdf'
  filters: ProgrammeFilters
  fields: string[]
  includeStats?: boolean
  includeSessions?: boolean
  includeInscriptions?: boolean
}

// Types pour les rapports de programmes
export interface ProgrammeReport {
  programmeId: string
  periode: {
    debut: Date
    fin: Date
  }
  statistiques: ProgrammeStats
  sessions: Session[]
  inscriptions: Inscription[]
  evaluations: ProgrammeEvaluation[]
  recommendations: string[]
}

// Types pour les notifications de programmes
export interface ProgrammeNotification {
  id: string
  programmeId: string
  type: 'nouvelle_session' | 'inscription_fermee' | 'evaluation_disponible' | 'rapport_disponible'
  titre: string
  message: string
  destinataires: string[]
  dateEnvoi: Date
  statut: 'en_attente' | 'envoyee' | 'echec'
}
