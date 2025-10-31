import { FormationPersonnalisee } from '@/types/index'
import { validate, formationValidationRules } from '@/lib/validation'

/**
 * Logique métier pour les formations personnalisées
 * Sépare la logique métier de l'interface utilisateur
 */
export class FormationBusinessLogic {
  /**
   * Valide une formation personnalisée
   */
  static validateFormation(formation: Partial<FormationPersonnalisee>): Record<string, string> {
    return validate(formation, formationValidationRules)
  }

  /**
   * Génère un code de formation unique
   */
  static generateFormationCode(clientName?: string): string {
    const timestamp = Date.now().toString().slice(-6)
    const clientPrefix = clientName ? clientName.toUpperCase().slice(0, 3) : 'A'
    return `${clientPrefix}${timestamp}-${clientName?.toUpperCase() || 'CLIENT'}`
  }

  /**
   * Calcule la durée totale d'une formation
   */
  static calculateTotalDuration(
    programmeDetail: FormationPersonnalisee['programmeDetail']
  ): string {
    if (!programmeDetail || programmeDetail.length === 0) {
      return '0h'
    }

    const totalHours = programmeDetail.reduce((total, jour) => {
      const duree = jour.duree || ''
      const hours = parseInt(duree.match(/\d+/)?.[0] || '0')
      return total + hours
    }, 0)

    return `${totalHours}h`
  }

  /**
   * Vérifie si une formation peut être finalisée
   */
  static canFinalizeFormation(formation: FormationPersonnalisee): {
    canFinalize: boolean
    reasons: string[]
  } {
    const reasons: string[] = []

    if (!formation.title?.trim()) {
      reasons.push('Le titre est requis')
    }

    if (!formation.codeFormation?.trim()) {
      reasons.push('Le code formation est requis')
    }

    if (!formation.objectifs || Object.keys(formation.objectifs).length === 0) {
      reasons.push('Les objectifs sont requis')
    }

    if (!formation.programmeDetail || formation.programmeDetail.length === 0) {
      reasons.push('Le programme détaillé est requis')
    }

    if (!formation.contactFormateur?.nom?.trim()) {
      reasons.push('Les informations du formateur sont requises')
    }

    if (!formation.modalitesAcces?.duree?.trim()) {
      reasons.push('La durée est requise')
    }

    if (!formation.modalitesAcces?.tarif || formation.modalitesAcces.tarif <= 0) {
      reasons.push('Le tarif doit être défini')
    }

    return {
      canFinalize: reasons.length === 0,
      reasons,
    }
  }

  /**
   * Prépare les données pour l'envoi
   */
  static prepareFormationForSubmission(formation: FormationPersonnalisee): FormationPersonnalisee {
    return {
      ...formation,
      // Nettoyer les données
      title: formation.title?.trim(),
      codeFormation: formation.codeFormation?.trim(),
      // S'assurer que les dates sont correctement formatées
      createdAt: formation.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Valider les données imbriquées
      contactFormateur: {
        nom: formation.contactFormateur?.nom?.trim() || '',
        email: formation.contactFormateur?.email?.trim() || '',
        telephone: formation.contactFormateur?.telephone?.trim() || '',
        role: formation.contactFormateur?.role?.trim() || '',
        biographie: formation.contactFormateur?.biographie?.trim() || '',
      },
    }
  }

  /**
   * Calcule les statistiques d'une formation
   */
  static calculateFormationStats(formation: FormationPersonnalisee) {
    const programmeDetail = formation.programmeDetail || []
    const totalDays = programmeDetail.length
    const totalModules = programmeDetail.reduce(
      (total, jour) => total + (jour.modules?.length || 0),
      0
    )
    const totalDuration = this.calculateTotalDuration(programmeDetail)

    return {
      totalDays,
      totalModules,
      totalDuration,
      isComplete: this.canFinalizeFormation(formation).canFinalize,
    }
  }

  /**
   * Génère un résumé de formation
   */
  static generateFormationSummary(formation: FormationPersonnalisee): string {
    const stats = this.calculateFormationStats(formation)
    const formateur = formation.contactFormateur?.nom || 'Non défini'
    const tarif = formation.modalitesAcces?.tarif || 0

    return `Formation "${formation.title}" - ${stats.totalDuration} sur ${stats.totalDays} jour(s) - ${stats.totalModules} modules - Formateur: ${formateur} - Tarif: ${tarif}€`
  }

  /**
   * Vérifie les conflits de dates avec d'autres formations
   */
  static checkDateConflicts(
    _formation: FormationPersonnalisee,
    _existingFormations: FormationPersonnalisee[]
  ): { hasConflict: boolean; conflictingFormations: FormationPersonnalisee[] } {
    // Logique de vérification des conflits de dates
    // À implémenter selon les besoins spécifiques
    return {
      hasConflict: false,
      conflictingFormations: [],
    }
  }

  /**
   * Exporte une formation en format structuré
   */
  static exportFormation(
    formation: FormationPersonnalisee,
    format: 'json' | 'pdf' | 'docx' = 'json'
  ) {
    const preparedFormation = this.prepareFormationForSubmission(formation)

    switch (format) {
      case 'json':
        return JSON.stringify(preparedFormation, null, 2)
      case 'pdf':
        // Logique d'export PDF à implémenter
        throw new Error('Export PDF non implémenté')
      case 'docx':
        // Logique d'export DOCX à implémenter
        throw new Error('Export DOCX non implémenté')
      default:
        throw new Error("Format d'export non supporté")
    }
  }
}
