/**
 * Client API centralisé pour toutes les requêtes vers Payload CMS
 * Gère l'authentification, les erreurs et les headers automatiquement
 */

const API_BASE_URL = process.env['NEXT_PUBLIC_SERVER_URL'] || 'http://localhost:3010'

export interface ApiError {
  message: string
  status: number
  errors?: Array<{ field: string; message: string }>
}

export class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    // Récupérer le token depuis localStorage au démarrage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  /**
   * Définir le token d'authentification
   */
  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  /**
   * Récupérer le token actuel
   */
  getToken(): string | null {
    return this.token
  }

  /**
   * Headers par défaut pour toutes les requêtes
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    return headers
  }

  /**
   * Gérer les erreurs API
   */
  private async handleError(response: Response): Promise<never> {
    let errorMessage = `Erreur ${response.status}: ${response.statusText}`
    let errors: Array<{ field: string; message: string }> | undefined

    try {
      const data = await response.json()
      errorMessage = data.message || data.error || errorMessage
      errors = data.errors
    } catch {
      // Si la réponse n'est pas du JSON, utiliser le message par défaut
    }

    const apiError: ApiError = {
      message: errorMessage,
      status: response.status,
      errors,
    }

    throw apiError
  }

  /**
   * GET - Récupérer des ressources
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include', // Important pour les cookies Payload
    })

    if (!response.ok) {
      return this.handleError(response)
    }

    return response.json()
  }

  /**
   * POST - Créer une ressource
   */
  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      return this.handleError(response)
    }

    return response.json()
  }

  /**
   * PUT - Mettre à jour une ressource (remplacement complet)
   */
  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      return this.handleError(response)
    }

    return response.json()
  }

  /**
   * PATCH - Mettre à jour une ressource (modification partielle)
   */
  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      return this.handleError(response)
    }

    return response.json()
  }

  /**
   * DELETE - Supprimer une ressource
   */
  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include',
    })

    if (!response.ok) {
      return this.handleError(response)
    }

    // Si la réponse est vide (204 No Content), retourner un objet vide
    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  /**
   * Upload de fichier (FormData)
   */
  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const headers: HeadersInit = {}

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    // Ne pas définir Content-Type pour FormData, le navigateur le fait automatiquement

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: formData,
    })

    if (!response.ok) {
      return this.handleError(response)
    }

    return response.json()
  }
}

// Instance singleton du client API
export const apiClient = new ApiClient()

// Helpers pour les endpoints courants
export const api = {
  // Authentification
  auth: {
    login: (email: string, password: string) =>
      apiClient.post('/api/users/login', { email, password }),
    logout: () => apiClient.post('/api/users/logout', {}),
    me: () => apiClient.get('/api/users/me'),
  },

  // Programmes/Formations
  programmes: {
    list: (params?: Record<string, string>) => apiClient.get('/api/programmes', params),
    get: (id: string) => apiClient.get(`/api/programmes/${id}`),
    create: (data: unknown) => apiClient.post('/api/programmes', data),
    update: (id: string, data: unknown) => apiClient.patch(`/api/programmes/${id}`, data),
    delete: (id: string) => apiClient.delete(`/api/programmes/${id}`),
  },

  // Apprenants
  apprenants: {
    list: (params?: Record<string, string>) => apiClient.get('/api/apprenants', params),
    get: (id: string) => apiClient.get(`/api/apprenants/${id}`),
    create: (data: unknown) => apiClient.post('/api/apprenants', data),
    update: (id: string, data: unknown) => apiClient.patch(`/api/apprenants/${id}`, data),
    delete: (id: string) => apiClient.delete(`/api/apprenants/${id}`),
  },

  // Rendez-vous
  rendezVous: {
    list: (params?: Record<string, string>) => apiClient.get('/api/rendez-vous', params),
    get: (id: string) => apiClient.get(`/api/rendez-vous/${id}`),
    create: (data: unknown) => apiClient.post('/api/rendez-vous', data),
    update: (id: string, data: unknown) => apiClient.patch(`/api/rendez-vous/${id}`, data),
    delete: (id: string) => apiClient.delete(`/api/rendez-vous/${id}`),
  },

  // Articles (Blog)
  articles: {
    list: (params?: Record<string, string>) => apiClient.get('/api/articles', params),
    get: (id: string) => apiClient.get(`/api/articles/${id}`),
    create: (data: unknown) => apiClient.post('/api/articles', data),
    update: (id: string, data: unknown) => apiClient.patch(`/api/articles/${id}`, data),
    delete: (id: string) => apiClient.delete(`/api/articles/${id}`),
  },

  // Catégories (pour les articles)
  categories: {
    list: (params?: Record<string, string>) => apiClient.get('/api/categories', params),
    get: (id: string) => apiClient.get(`/api/categories/${id}`),
    create: (data: unknown) => apiClient.post('/api/categories', data),
    update: (id: string, data: unknown) => apiClient.patch(`/api/categories/${id}`, data),
    delete: (id: string) => apiClient.delete(`/api/categories/${id}`),
  },

  // Tags (pour les articles)
  tags: {
    list: (params?: Record<string, string>) => apiClient.get('/api/tags', params),
    get: (id: string) => apiClient.get(`/api/tags/${id}`),
    create: (data: unknown) => apiClient.post('/api/tags', data),
    update: (id: string, data: unknown) => apiClient.patch(`/api/tags/${id}`, data),
    delete: (id: string) => apiClient.delete(`/api/tags/${id}`),
  },

  // Contacts
  contacts: {
    list: (params?: Record<string, string>) => apiClient.get('/api/contacts', params),
    get: (id: string) => apiClient.get(`/api/contacts/${id}`),
    create: (data: unknown) => apiClient.post('/api/contacts', data),
    delete: (id: string) => apiClient.delete(`/api/contacts/${id}`),
  },

  // Media
  media: {
    list: (params?: Record<string, string>) => apiClient.get('/api/media', params),
    get: (id: string) => apiClient.get(`/api/media/${id}`),
    upload: (formData: FormData) => apiClient.upload('/api/media', formData),
    delete: (id: string) => apiClient.delete(`/api/media/${id}`),
  },
}
