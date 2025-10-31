/**
 * Wrapper pour les notifications toast avec Sonner
 * Fournit des helpers typés pour afficher des messages de succès, erreur, etc.
 */

import { toast as sonnerToast } from 'sonner'
import type { ApiError } from './apiClient'

/**
 * Afficher un message de succès
 */
export function showSuccess(message: string, description?: string) {
  return sonnerToast.success(message, {
    description,
  })
}

/**
 * Afficher un message d'erreur
 */
export function showError(message: string, description?: string) {
  return sonnerToast.error(message, {
    description,
  })
}

/**
 * Afficher un message d'information
 */
export function showInfo(message: string, description?: string) {
  return sonnerToast.info(message, {
    description,
  })
}

/**
 * Afficher un message d'avertissement
 */
export function showWarning(message: string, description?: string) {
  return sonnerToast.warning(message, {
    description,
  })
}

/**
 * Afficher une notification de chargement avec promesse
 * Utile pour les opérations asynchrones
 */
export function showPromise<T>(
  promise: Promise<T>,
  {
    loading,
    success,
    error,
  }: {
    loading: string
    success: string | ((data: T) => string)
    error: string | ((error: unknown) => string)
  },
) {
  return sonnerToast.promise(promise, {
    loading,
    success,
    error,
  })
}

/**
 * Afficher une erreur API avec détails
 */
export function showApiError(error: ApiError) {
  const description =
    error.errors && error.errors.length > 0
      ? error.errors.map((e) => `${e.field}: ${e.message}`).join(', ')
      : undefined

  return sonnerToast.error(error.message, {
    description,
  })
}

/**
 * Helper pour afficher des erreurs génériques
 */
export function showGenericError(error: unknown) {
  if (typeof error === 'object' && error !== null && 'message' in error && 'status' in error) {
    return showApiError(error as ApiError)
  }

  const message = error instanceof Error ? error.message : 'Une erreur est survenue'
  return showError(message)
}

// Export du toast de base pour les cas avancés
export { sonnerToast as toast }
