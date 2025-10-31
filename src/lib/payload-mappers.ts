/**
 * Mappers pour convertir les données entre les formats Payload et frontend
 *
 * Ces fonctions permettent de maintenir la cohérence entre :
 * - Les données stockées en base (format Payload avec snake_case)
 * - Les données utilisées dans le frontend (format camelCase)
 */

// Import des types depuis nos définitions personnalisées
import type { User } from '@/types/common'
import type { RendezVous } from '@/types/rendez-vous'
import type { Contacts } from '@/types/payload-generated'
import type { FormationPersonnalisee } from '@/types/payload'

// Alias pour la cohérence
type Contact = Contacts

// ============================================================================
// MAPPINGS DE CONVERSION
// ============================================================================

/**
 * Mapping des rôles utilisateur : frontend → Payload
 */
export const USER_ROLE_TO_PAYLOAD = {
  superAdmin: 'super_admin',
  admin: 'admin',
  formateur: 'formateur',
  gestionnaire: 'gestionnaire',
  apprenant: 'apprenant',
} as const

/**
 * Mapping des rôles utilisateur : Payload → frontend
 */
export const USER_ROLE_TO_FRONTEND = {
  super_admin: 'superAdmin',
  admin: 'admin',
  formateur: 'formateur',
  gestionnaire: 'gestionnaire',
  apprenant: 'apprenant',
} as const

/**
 * Mapping des statuts de rendez-vous : frontend → Payload
 */
export const RENDEZ_VOUS_STATUT_TO_PAYLOAD = {
  enAttente: 'en_attente',
  confirme: 'confirme',
  annule: 'annule',
  termine: 'termine',
  reporte: 'reporte',
} as const

/**
 * Mapping des statuts de rendez-vous : Payload → frontend
 */
export const RENDEZ_VOUS_STATUT_TO_FRONTEND = {
  en_attente: 'enAttente',
  confirme: 'confirme',
  annule: 'annule',
  termine: 'termine',
  reporte: 'reporte',
} as const

/**
 * Mapping des statuts de contact : frontend → Payload
 */
export const CONTACT_STATUT_TO_PAYLOAD = {
  nouveau: 'nouveau',
  enCours: 'en_cours',
  traite: 'traite',
  ferme: 'ferme',
} as const

/**
 * Mapping des statuts de contact : Payload → frontend
 */
export const CONTACT_STATUT_TO_FRONTEND = {
  nouveau: 'nouveau',
  en_cours: 'enCours',
  traite: 'traite',
  ferme: 'ferme',
} as const

// ============================================================================
// FONCTIONS DE MAPPING GÉNÉRIQUES
// ============================================================================

/**
 * Convertit un objet en appliquant un mapping de propriétés
 */
function mapObject<T extends Record<string, any>>(
  obj: T,
  mapping: Record<string, string>,
  direction: 'toPayload' | 'toFrontend'
): T {
  const result = { ...obj }

  Object.entries(mapping).forEach(([sourceKey, targetKey]) => {
    const key = direction === 'toPayload' ? sourceKey : targetKey
    const target = direction === 'toPayload' ? targetKey : sourceKey

    if (key in result) {
      result[target] = result[key]
      if (key !== target) {
        delete result[key]
      }
    }
  })

  return result
}

/**
 * Convertit un tableau d'objets en appliquant un mapping
 */
function mapArray<T extends Record<string, any>>(
  array: T[],
  mapping: Record<string, string>,
  direction: 'toPayload' | 'toFrontend'
): T[] {
  return array.map(item => mapObject(item, mapping, direction))
}

// ============================================================================
// MAPPERS SPÉCIFIQUES
// ============================================================================

/**
 * Convertit un utilisateur du format frontend vers Payload
 */
export function mapUserToPayload(user: User): any {
  return mapObject(user, USER_ROLE_TO_PAYLOAD, 'toPayload')
}

/**
 * Convertit un utilisateur du format Payload vers frontend
 */
export function mapUserToFrontend(user: any): User {
  return mapObject(user, USER_ROLE_TO_FRONTEND, 'toFrontend')
}

/**
 * Convertit un rendez-vous du format frontend vers Payload
 */
export function mapRendezVousToPayload(rdv: RendezVous): any {
  return mapObject(rdv, RENDEZ_VOUS_STATUT_TO_PAYLOAD, 'toPayload')
}

/**
 * Convertit un rendez-vous du format Payload vers frontend
 */
export function mapRendezVousToFrontend(rdv: any): RendezVous {
  return mapObject(rdv, RENDEZ_VOUS_STATUT_TO_FRONTEND, 'toFrontend')
}

/**
 * Convertit un contact du format frontend vers Payload
 */
export function mapContactToPayload(contact: Contact): any {
  return mapObject(contact, CONTACT_STATUT_TO_PAYLOAD, 'toPayload')
}

/**
 * Convertit un contact du format Payload vers frontend
 */
export function mapContactToFrontend(contact: any): Contact {
  return mapObject(contact, CONTACT_STATUT_TO_FRONTEND, 'toFrontend')
}

/**
 * Convertit un tableau de rendez-vous du format Payload vers frontend
 */
export function mapRendezVousArrayToFrontend(rdvs: any[]): RendezVous[] {
  return mapArray(rdvs, RENDEZ_VOUS_STATUT_TO_FRONTEND, 'toFrontend')
}

/**
 * Convertit un tableau de contacts du format Payload vers frontend
 */
export function mapContactArrayToFrontend(contacts: any[]): Contact[] {
  return mapArray(contacts, CONTACT_STATUT_TO_FRONTEND, 'toFrontend')
}

// ============================================================================
// MAPPERS POUR LES FORMATIONS PERSONNALISÉES
// ============================================================================

/**
 * Mapping des propriétés de formation : frontend → Payload
 */
const FORMATION_TO_PAYLOAD_MAPPING = {
  codeFormation: 'code_formation',
  programmeDetail: 'programme_detail',
  modalitesAcces: 'modalites_acces',
  publicConcerne: 'public_concerne',
  delaisMiseEnPlace: 'delais_mise_en_place',
  modalitesReglement: 'modalites_reglement',
  contactFormateur: 'contact_formateur',
  modalitesPedagogiques: 'modalites_pedagogiques',
  ressourcesDispo: 'ressources_dispo',
  modalitesEvaluation: 'modalites_evaluation',
  typesEvaluation: 'types_evaluation',
  plateformeEvaluation: 'plateforme_evaluation',
  grilleAnalyse: 'grille_analyse',
} as const

/**
 * Mapping des propriétés de formation : Payload → frontend
 */
const FORMATION_TO_FRONTEND_MAPPING = {
  code_formation: 'codeFormation',
  programme_detail: 'programmeDetail',
  modalites_acces: 'modalitesAcces',
  public_concerne: 'publicConcerne',
  delais_mise_en_place: 'delaisMiseEnPlace',
  modalites_reglement: 'modalitesReglement',
  contact_formateur: 'contactFormateur',
  modalites_pedagogiques: 'modalitesPedagogiques',
  ressources_dispo: 'ressourcesDispo',
  modalites_evaluation: 'modalitesEvaluation',
  types_evaluation: 'typesEvaluation',
  plateforme_evaluation: 'plateformeEvaluation',
  grille_analyse: 'grilleAnalyse',
} as const

/**
 * Convertit une formation du format frontend vers Payload
 */
export function mapFormationToPayload(formation: FormationPersonnalisee): any {
  return mapObject(formation, FORMATION_TO_PAYLOAD_MAPPING, 'toPayload')
}

/**
 * Convertit une formation du format Payload vers frontend
 */
export function mapFormationToFrontend(formation: any): FormationPersonnalisee {
  return mapObject(formation, FORMATION_TO_FRONTEND_MAPPING, 'toFrontend')
}

// ============================================================================
// UTILITAIRES DE VALIDATION
// ============================================================================

/**
 * Valide qu'un objet contient les propriétés requises
 */
export function validatePayloadObject(obj: any, requiredFields: string[]): boolean {
  return requiredFields.every(field => field in obj)
}

/**
 * Valide qu'un objet frontend contient les propriétés requises
 */
export function validateFrontendObject(obj: any, requiredFields: string[]): boolean {
  return requiredFields.every(field => field in obj)
}

// ============================================================================
// CONSTANTES POUR LES CHAMPS REQUIS
// ============================================================================

export const REQUIRED_USER_FIELDS = ['name', 'email', 'role', 'status']
export const REQUIRED_RENDEZ_VOUS_FIELDS = ['client', 'date', 'heure', 'statut', 'type', 'lieu']
export const REQUIRED_CONTACT_FIELDS = ['nom', 'email', 'type', 'sujet', 'message', 'statut']
export const REQUIRED_FORMATION_FIELDS = ['title', 'codeFormation', 'statut']

// ============================================================================
// NOTE: Tous les exports sont déjà définis individuellement ci-dessus
// avec "export const". Pas besoin de les ré-exporter ici.
// ============================================================================
