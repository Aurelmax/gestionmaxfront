/**
 * Types générés automatiquement depuis payload.config.ts
 * ⚠️ NE PAS MODIFIER MANUELLEMENT - Utiliser le script sync-payload-types.ts
 *
 * Généré le: 2025-10-14T02:10:13.442Z
 */

export interface Users {
  id: string
  createdAt: string
  updatedAt: string
  name: string
  firstName: string | undefined
  lastName: string | undefined
  role: 'superAdmin' | 'admin' | 'formateur' | 'gestionnaire' | 'apprenant'
  status: 'active' | 'inactive' | 'pending'
  email: string
  password: string
}

export interface FormationProgrammes {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  codeFormation: string
  statut: 'EN_COURS' | 'FINALISEE' | 'LIVREE' | 'ARCHIVE'
  objectifs: Record<string, unknown> | undefined
}

export interface Contacts {
  id: string
  createdAt: string
  updatedAt: string
  nom: string
  email: string
  telephone: string | undefined
  type: 'question' | 'reclamation' | 'formation' | 'devis'
  sujet: string
  message: string
  statut: 'nouveau' | 'enCours' | 'traite' | 'ferme'
  priorite: 'basse' | 'normale' | 'haute' | 'urgente'
  dateReception: string
  dateReponse: string | undefined
  reponse: string | undefined
}
