/**
 * Version améliorée du client API avec notifications toast intégrées
 * Wrapper autour de apiClient pour ajouter automatiquement des feedbacks visuels
 */

import { apiClient, type ApiError } from './apiClient'
import { showSuccess, showError, showApiError, showPromise } from './toast'

interface ToastOptions {
  showSuccess?: boolean
  showError?: boolean
  successMessage?: string
  errorMessage?: string
}

/**
 * Wrapper pour les requêtes GET avec toast
 */
export async function getWithToast<T>(
  endpoint: string,
  params?: Record<string, string>,
  options: ToastOptions = { showError: true },
): Promise<T> {
  try {
    const result = await apiClient.get<T>(endpoint, params)
    if (options.showSuccess && options.successMessage) {
      showSuccess(options.successMessage)
    }
    return result
  } catch (error) {
    if (options.showError) {
      if (options.errorMessage) {
        showError(options.errorMessage)
      } else {
        showApiError(error as ApiError)
      }
    }
    throw error
  }
}

/**
 * Wrapper pour les requêtes POST avec toast
 */
export async function postWithToast<T>(
  endpoint: string,
  data: unknown,
  options: ToastOptions = {
    showSuccess: true,
    showError: true,
    successMessage: 'Création réussie',
  },
): Promise<T> {
  try {
    const result = await apiClient.post<T>(endpoint, data)
    if (options.showSuccess) {
      showSuccess(options.successMessage || 'Création réussie')
    }
    return result
  } catch (error) {
    if (options.showError) {
      if (options.errorMessage) {
        showError(options.errorMessage)
      } else {
        showApiError(error as ApiError)
      }
    }
    throw error
  }
}

/**
 * Wrapper pour les requêtes PATCH avec toast
 */
export async function patchWithToast<T>(
  endpoint: string,
  data: unknown,
  options: ToastOptions = {
    showSuccess: true,
    showError: true,
    successMessage: 'Modification réussie',
  },
): Promise<T> {
  try {
    const result = await apiClient.patch<T>(endpoint, data)
    if (options.showSuccess) {
      showSuccess(options.successMessage || 'Modification réussie')
    }
    return result
  } catch (error) {
    if (options.showError) {
      if (options.errorMessage) {
        showError(options.errorMessage)
      } else {
        showApiError(error as ApiError)
      }
    }
    throw error
  }
}

/**
 * Wrapper pour les requêtes DELETE avec toast
 */
export async function deleteWithToast<T>(
  endpoint: string,
  options: ToastOptions = {
    showSuccess: true,
    showError: true,
    successMessage: 'Suppression réussie',
  },
): Promise<T> {
  try {
    const result = await apiClient.delete<T>(endpoint)
    if (options.showSuccess) {
      showSuccess(options.successMessage || 'Suppression réussie')
    }
    return result
  } catch (error) {
    if (options.showError) {
      if (options.errorMessage) {
        showError(options.errorMessage)
      } else {
        showApiError(error as ApiError)
      }
    }
    throw error
  }
}

/**
 * Wrapper pour les uploads avec toast et promise
 */
export async function uploadWithToast<T>(
  endpoint: string,
  formData: FormData,
  options: ToastOptions = {
    showSuccess: true,
    showError: true,
    successMessage: 'Fichier uploadé avec succès',
  },
): Promise<T> {
  const uploadPromise = apiClient.upload<T>(endpoint, formData)

  // showPromise retourne un objet avec unwrap(), pas directement une Promise
  // On attend la promesse et on gère les toasts manuellement
  try {
    showPromise(uploadPromise, {
      loading: 'Upload en cours...',
      success: options.successMessage || 'Fichier uploadé avec succès',
      error: (err) => {
        const apiError = err as ApiError
        return options.errorMessage || apiError.message || "Erreur lors de l'upload"
      },
    })
    return await uploadPromise
  } catch (error) {
    throw error
  }
}

/**
 * Helpers typés pour les endpoints avec toast automatique
 */
export const apiWithToast = {
  // Authentification
  auth: {
    login: async (email: string, password: string) =>
      postWithToast('/api/users/login', { email, password }, {
        showSuccess: true,
        successMessage: 'Connexion réussie',
        showError: true,
        errorMessage: 'Identifiants incorrects',
      }),
    logout: async () =>
      postWithToast('/api/users/logout', {}, {
        showSuccess: true,
        successMessage: 'Déconnexion réussie',
        showError: false,
      }),
  },

  // Programmes/Formations
  programmes: {
    list: (params?: Record<string, string>) =>
      getWithToast('/api/programmes', params, { showError: true }),
    get: (id: string) =>
      getWithToast(`/api/programmes/${id}`, undefined, { showError: true }),
    create: (data: unknown) =>
      postWithToast('/api/programmes', data, {
        showSuccess: true,
        successMessage: 'Formation créée avec succès',
      }),
    update: (id: string, data: unknown) =>
      patchWithToast(`/api/programmes/${id}`, data, {
        showSuccess: true,
        successMessage: 'Formation mise à jour',
      }),
    delete: (id: string) =>
      deleteWithToast(`/api/programmes/${id}`, {
        showSuccess: true,
        successMessage: 'Formation supprimée',
      }),
  },

  // Apprenants
  apprenants: {
    list: (params?: Record<string, string>) =>
      getWithToast('/api/apprenants', params, { showError: true }),
    get: (id: string) =>
      getWithToast(`/api/apprenants/${id}`, undefined, { showError: true }),
    create: (data: unknown) =>
      postWithToast('/api/apprenants', data, {
        showSuccess: true,
        successMessage: 'Apprenant créé avec succès',
      }),
    update: (id: string, data: unknown) =>
      patchWithToast(`/api/apprenants/${id}`, data, {
        showSuccess: true,
        successMessage: 'Apprenant mis à jour',
      }),
    delete: (id: string) =>
      deleteWithToast(`/api/apprenants/${id}`, {
        showSuccess: true,
        successMessage: 'Apprenant supprimé',
      }),
  },

  // Rendez-vous
  rendezVous: {
    list: (params?: Record<string, string>) =>
      getWithToast('/api/rendez-vous', params, { showError: true }),
    get: (id: string) =>
      getWithToast(`/api/rendez-vous/${id}`, undefined, { showError: true }),
    create: (data: unknown) =>
      postWithToast('/api/rendez-vous', data, {
        showSuccess: true,
        successMessage: 'Rendez-vous créé avec succès',
      }),
    update: (id: string, data: unknown) =>
      patchWithToast(`/api/rendez-vous/${id}`, data, {
        showSuccess: true,
        successMessage: 'Rendez-vous mis à jour',
      }),
    delete: (id: string) =>
      deleteWithToast(`/api/rendez-vous/${id}`, {
        showSuccess: true,
        successMessage: 'Rendez-vous supprimé',
      }),
  },

  // Articles (Blog)
  articles: {
    list: (params?: Record<string, string>) =>
      getWithToast('/api/articles', params, { showError: true }),
    get: (id: string) =>
      getWithToast(`/api/articles/${id}`, undefined, { showError: true }),
    create: (data: unknown) =>
      postWithToast('/api/articles', data, {
        showSuccess: true,
        successMessage: 'Article créé avec succès',
      }),
    update: (id: string, data: unknown) =>
      patchWithToast(`/api/articles/${id}`, data, {
        showSuccess: true,
        successMessage: 'Article mis à jour',
      }),
    delete: (id: string) =>
      deleteWithToast(`/api/articles/${id}`, {
        showSuccess: true,
        successMessage: 'Article supprimé',
      }),
  },

  // Catégories (pour les articles)
  categories: {
    list: (params?: Record<string, string>) =>
      getWithToast('/api/categories', params, { showError: true }),
    get: (id: string) =>
      getWithToast(`/api/categories/${id}`, undefined, { showError: true }),
    create: (data: unknown) =>
      postWithToast('/api/categories', data, {
        showSuccess: true,
        successMessage: 'Catégorie créée avec succès',
      }),
    update: (id: string, data: unknown) =>
      patchWithToast(`/api/categories/${id}`, data, {
        showSuccess: true,
        successMessage: 'Catégorie mise à jour',
      }),
    delete: (id: string) =>
      deleteWithToast(`/api/categories/${id}`, {
        showSuccess: true,
        successMessage: 'Catégorie supprimée',
      }),
  },

  // Tags (pour les articles)
  tags: {
    list: (params?: Record<string, string>) =>
      getWithToast('/api/tags', params, { showError: true }),
    get: (id: string) =>
      getWithToast(`/api/tags/${id}`, undefined, { showError: true }),
    create: (data: unknown) =>
      postWithToast('/api/tags', data, {
        showSuccess: true,
        successMessage: 'Tag créé avec succès',
      }),
    update: (id: string, data: unknown) =>
      patchWithToast(`/api/tags/${id}`, data, {
        showSuccess: true,
        successMessage: 'Tag mis à jour',
      }),
    delete: (id: string) =>
      deleteWithToast(`/api/tags/${id}`, {
        showSuccess: true,
        successMessage: 'Tag supprimé',
      }),
  },

  // Contacts
  contacts: {
    list: (params?: Record<string, string>) =>
      getWithToast('/api/contacts', params, { showError: true }),
    get: (id: string) =>
      getWithToast(`/api/contacts/${id}`, undefined, { showError: true }),
    create: (data: unknown) =>
      postWithToast('/api/contacts', data, {
        showSuccess: true,
        successMessage: 'Message envoyé avec succès',
      }),
    delete: (id: string) =>
      deleteWithToast(`/api/contacts/${id}`, {
        showSuccess: true,
        successMessage: 'Contact supprimé',
      }),
  },

  // Media
  media: {
    list: (params?: Record<string, string>) =>
      getWithToast('/api/media', params, { showError: true }),
    get: (id: string) =>
      getWithToast(`/api/media/${id}`, undefined, { showError: true }),
    upload: (formData: FormData) => uploadWithToast('/api/media', formData),
    delete: (id: string) =>
      deleteWithToast(`/api/media/${id}`, {
        showSuccess: true,
        successMessage: 'Média supprimé',
      }),
  },
}
