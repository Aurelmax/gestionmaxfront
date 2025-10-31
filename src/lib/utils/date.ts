/**
 * Utilities pour manipulation safe des dates
 */

/**
 * Parse une valeur inconnue en Date de manière sûre
 * @param value - Valeur à parser (string, number, Date, ou unknown)
 * @returns Date valide ou Date actuelle en fallback
 */
export function safeDate(value: unknown): Date {
  // Si déjà une Date
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? new Date() : value
  }

  // Si string
  if (typeof value === 'string') {
    const parsed = new Date(value)
    return isNaN(parsed.getTime()) ? new Date() : parsed
  }

  // Si number (timestamp)
  if (typeof value === 'number') {
    const parsed = new Date(value)
    return isNaN(parsed.getTime()) ? new Date() : parsed
  }

  // Fallback: date actuelle
  return new Date()
}

/**
 * Formate une date en string ISO safe
 * @param value - Valeur à formater
 * @returns String ISO ou empty string si invalide
 */
export function safeISOString(value: unknown): string {
  const date = safeDate(value)
  try {
    return date.toISOString()
  } catch {
    return new Date().toISOString()
  }
}

/**
 * Formate une date pour affichage (YYYY-MM-DD)
 * @param value - Valeur à formater
 * @returns String formatée ou empty string
 */
export function safeDateString(value: unknown): string {
  const date = safeDate(value)
  try {
    return date.toISOString().split('T')[0] || ''
  } catch {
    return ''
  }
}

/**
 * Vérifie si une valeur est une date valide
 * @param value - Valeur à vérifier
 * @returns true si date valide
 */
export function isValidDate(value: unknown): value is Date {
  if (!(value instanceof Date)) return false
  return !isNaN(value.getTime())
}
