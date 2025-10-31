/**
 * Types spécifiques au module Apprenants
 */

import { Timestamped } from '../utils'

// Types pour les apprenants
export interface Apprenant extends Timestamped {
  nom: string
  prenom: string
  email: string
  telephone?: string
  dateNaissance?: Date
  adresse?: Adresse
  niveauEtude?: NiveauEtude
  experience?: string
  objectifs?: string
  statut: ApprenantStatut
  userId?: string
  createdBy: string
  updatedBy?: string
  programmes?: ProgrammeApprenant[]
  rendezVous?: RendezVousApprenant[]
  evaluations?: EvaluationApprenant[]
}

export type ApprenantStatut = 'inscrit' | 'enCours' | 'termine' | 'abandonne' | 'suspendu'

// Types pour les adresses
export interface Adresse {
  rue: string
  codePostal: string
  ville: string
  pays: string
  complement?: string
}

// Types pour les niveaux d'étude
export type NiveauEtude =
  | 'aucun'
  | 'primaire'
  | 'college'
  | 'lycee'
  | 'bac'
  | 'bac_plus_2'
  | 'bac_plus_3'
  | 'bac_plus_4'
  | 'bac_plus_5'
  | 'doctorat'

// Types pour les programmes d'apprenants
export interface ProgrammeApprenant {
  programmeId: string
  titre: string
  dateInscription: Date
  dateDebut?: Date
  dateFin?: Date
  statut: InscriptionStatut
  progression: number
  note?: number
}

export type InscriptionStatut = 'enAttente' | 'confirmee' | 'enCours' | 'terminee' | 'abandonnee'

// Types pour les rendez-vous d'apprenants
export interface RendezVousApprenant {
  id: string
  programmeId: string
  titre: string
  date: Date
  type: RendezVousType
  duree: number
  modalite: RendezVousModalite
  lieu?: string
  statut: RendezVousStatut
  notes?: string
}

export type RendezVousType = 'positionnement' | 'formation' | 'suivi' | 'evaluation'
export type RendezVousModalite = 'presentiel' | 'distanciel' | 'hybride'
export type RendezVousStatut = 'planifie' | 'confirme' | 'enCours' | 'termine' | 'annule'

// Types pour les évaluations d'apprenants
export interface EvaluationApprenant {
  id: string
  programmeId: string
  titre: string
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

// Types pour les profils d'apprenants
export interface ProfilApprenant {
  apprenantId: string
  competences: CompetenceProfil[]
  objectifs: ObjectifProfil[]
  preferences: PreferencesApprenant
  historique: HistoriqueApprenant
}

export interface CompetenceProfil {
  competence: string
  niveau: number
  dateAcquisition?: Date
  validee: boolean
}

export interface ObjectifProfil {
  objectif: string
  priorite: 'faible' | 'moyenne' | 'elevee'
  dateObjectif?: Date
  atteint: boolean
}

export interface PreferencesApprenant {
  modalitePreferee: RendezVousModalite
  horairesPreferees: string[]
  joursPreferees: string[]
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

export interface HistoriqueApprenant {
  programmesSuivis: number
  heuresFormation: number
  certificationsObtenues: number
  tauxReussite: number
  satisfactionMoyenne: number
}

// Types pour les statistiques d'apprenants
export interface ApprenantStats {
  apprenantId: string
  totalProgrammes: number
  programmesEnCours: number
  programmesTermines: number
  heuresFormation: number
  tauxReussite: number
  satisfactionMoyenne: number
  derniereActivite: Date
  prochaineSession?: Date
}

// Types pour les filtres d'apprenants
export interface ApprenantFilters {
  search?: string
  statut?: ApprenantStatut
  programmeId?: string
  niveauEtude?: NiveauEtude
  dateInscriptionFrom?: Date
  dateInscriptionTo?: Date
  ville?: string
  ageMin?: number
  ageMax?: number
  createdBy?: string
}

// Types pour les formulaires d'apprenants
export interface ApprenantFormData {
  nom: string
  prenom: string
  email: string
  telephone?: string
  dateNaissance?: string
  adresse?: Adresse
  niveauEtude?: NiveauEtude
  experience?: string
  objectifs?: string
}

// Types pour les actions d'apprenants
export interface ApprenantAction {
  type: 'create' | 'update' | 'delete' | 'activate' | 'deactivate' | 'suspend' | 'unsuspend'
  apprenantId?: string
  data?: Partial<ApprenantFormData>
  reason?: string
  userId: string
  timestamp: Date
}

// Types pour les exports d'apprenants
export interface ApprenantExport {
  format: 'csv' | 'xlsx' | 'pdf'
  filters: ApprenantFilters
  fields: string[]
  includeProgrammes?: boolean
  includeRendezVous?: boolean
  includeEvaluations?: boolean
}

// Types pour les rapports d'apprenants
export interface ApprenantReport {
  apprenantId: string
  periode: {
    debut: Date
    fin: Date
  }
  statistiques: ApprenantStats
  programmes: ProgrammeApprenant[]
  rendezVous: RendezVousApprenant[]
  evaluations: EvaluationApprenant[]
  recommendations: string[]
}

// Types pour les notifications d'apprenants
export interface ApprenantNotification {
  id: string
  apprenantId: string
  type:
    | 'nouveau_programme'
    | 'rendez_vous_planifie'
    | 'evaluation_disponible'
    | 'rapport_disponible'
  titre: string
  message: string
  dateEnvoi: Date
  statut: 'en_attente' | 'envoyee' | 'lue' | 'echec'
}

// Types pour les groupes d'apprenants
export interface GroupeApprenants {
  id: string
  nom: string
  description?: string
  apprenants: string[]
  programmeId?: string
  sessionId?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

// Types pour les suivis d'apprenants
export interface SuiviApprenant {
  id: string
  apprenantId: string
  formateurId: string
  type: 'telephone' | 'email' | 'rendez_vous' | 'formation'
  date: Date
  duree?: number
  notes: string
  actions: string[]
  prochaineAction?: string
  dateProchaineAction?: Date
}
