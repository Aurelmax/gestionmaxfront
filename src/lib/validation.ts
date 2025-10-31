/**
 * Système de validation centralisé
 * Fournit des règles de validation réutilisables et des utilitaires
 */

export type ValidationRule<T = Record<string, unknown>> = (value: T) => string | null

export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T[K]> | ValidationRule<T[K]>[]
}

// Règles de validation de base
export const required =
  (message = 'Ce champ est requis'): ValidationRule<Record<string, unknown>> =>
  value => {
    if (value === null || value === undefined || value === '') {
      return message
    }
    return null
  }

export const minLength =
  (min: number, message?: string): ValidationRule<string> =>
  value => {
    if (typeof value === 'string' && value.length < min) {
      return message || `Minimum ${min} caractères requis`
    }
    return null
  }

export const maxLength =
  (max: number, message?: string): ValidationRule<string> =>
  value => {
    if (typeof value === 'string' && value.length > max) {
      return message || `Maximum ${max} caractères autorisés`
    }
    return null
  }

export const email =
  (message = 'Adresse email invalide'): ValidationRule<string> =>
  value => {
    if (typeof value === 'string' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return message
      }
    }
    return null
  }

export const phone =
  (message = 'Numéro de téléphone invalide'): ValidationRule<string> =>
  value => {
    if (typeof value === 'string' && value) {
      const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        return message
      }
    }
    return null
  }

export const min =
  (minValue: number, message?: string): ValidationRule<number> =>
  value => {
    if (typeof value === 'number' && value < minValue) {
      return message || `La valeur doit être supérieure ou égale à ${minValue}`
    }
    return null
  }

export const max =
  (maxValue: number, message?: string): ValidationRule<number> =>
  value => {
    if (typeof value === 'number' && value > maxValue) {
      return message || `La valeur doit être inférieure ou égale à ${maxValue}`
    }
    return null
  }

export const positive =
  (message = 'La valeur doit être positive'): ValidationRule<number> =>
  value => {
    if (typeof value === 'number' && value <= 0) {
      return message
    }
    return null
  }

export const url =
  (message = 'URL invalide'): ValidationRule<string> =>
  value => {
    if (typeof value === 'string' && value) {
      try {
        new URL(value)
        return null
      } catch {
        return message
      }
    }
    return null
  }

export const oneOf =
  <T>(values: T[], message?: string): ValidationRule<T> =>
  value => {
    if (!values.includes(value)) {
      return message || `La valeur doit être l'une des suivantes : ${values.join(', ')}`
    }
    return null
  }

export const arrayMinLength =
  (min: number, message?: string): ValidationRule<unknown[]> =>
  value => {
    if (Array.isArray(value) && value.length < min) {
      return message || `Minimum ${min} élément(s) requis`
    }
    return null
  }

export const arrayMaxLength =
  (max: number, message?: string): ValidationRule<unknown[]> =>
  value => {
    if (Array.isArray(value) && value.length > max) {
      return message || `Maximum ${max} élément(s) autorisés`
    }
    return null
  }

// Règles spécialisées pour les formations
export const formationCode =
  (message = 'Code formation invalide'): ValidationRule<string> =>
  value => {
    if (typeof value === 'string' && value) {
      const codeRegex = /^[A-Z]{1,3}\d{4,8}-[A-Z]+$/
      if (!codeRegex.test(value)) {
        return message
      }
    }
    return null
  }

export const duration =
  (message = 'Durée invalide'): ValidationRule<string> =>
  value => {
    if (typeof value === 'string' && value) {
      const durationRegex = /^\d+\s*(h|heures?|jours?|semaines?|mois?)$/i
      if (!durationRegex.test(value)) {
        return message
      }
    }
    return null
  }

export const price =
  (message = 'Prix invalide'): ValidationRule<number> =>
  value => {
    if (typeof value === 'number' && (value < 0 || value > 100000)) {
      return message
    }
    return null
  }

// Fonction de validation combinée
export function validate<T>(data: T, rules: ValidationRules<T>): Record<keyof T, string> {
  const errors: Record<keyof T, string> = {} as Record<keyof T, string>

  Object.entries(rules).forEach(([field, rule]) => {
    const value = data[field as keyof T]
    const fieldRules = Array.isArray(rule) ? rule : [rule]

    for (const validationRule of fieldRules) {
      const error = validationRule(value)
      if (error) {
        errors[field as keyof T] = error
        break // Arrêter au premier erreur pour ce champ
      }
    }
  })

  return errors
}

// Fonction de validation d'un champ unique
export function validateField<T>(
  value: T,
  rules: ValidationRule<T> | ValidationRule<T>[]
): string | null {
  const fieldRules = Array.isArray(rules) ? rules : [rules]

  for (const rule of fieldRules) {
    const error = rule(value)
    if (error) {
      return error
    }
  }

  return null
}

// Règles prédéfinies pour les entités communes
export const userValidationRules = {
  email: [required(), email()],
  name: [required(), minLength(2)],
  firstName: [required(), minLength(2)],
  lastName: [required(), minLength(2)],
  phone: [phone()],
  role: [required(), oneOf(['admin', 'formateur', 'gestionnaire', 'apprenant'])],
}

export const formationValidationRules = {
  title: [required(), minLength(5), maxLength(200)],
  code_formation: [required(), formationCode()],
  duree: [required(), duration()],
  prix: [required(), positive(), price()],
  niveau: [required(), oneOf(['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE', 'EXPERT'])],
  modalites: [required(), oneOf(['PRESENTIEL', 'DISTANCIEL', 'HYBRIDE'])],
}

export const programmeValidationRules = {
  codeFormation: [required(), minLength(3), maxLength(20)],
  titre: [required(), minLength(5), maxLength(200)],
  description: [required(), minLength(10)],
  duree: [required(), min(1), max(1000)],
  prix: [required(), positive(), max(50000)],
}
