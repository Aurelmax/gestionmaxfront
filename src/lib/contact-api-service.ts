/**
 * Service API pour la gestion des contacts
 */

export interface Contact {
  id: string
  nom: string
  email: string
  telephone?: string
  type: 'question' | 'reclamation' | 'formation' | 'devis'
  sujet: string
  message: string
  statut: 'nouveau' | 'enCours' | 'traite' | 'ferme'
  priorite: 'basse' | 'normale' | 'haute' | 'urgente'
  reponse?: string
  dateReponse?: string
  createdAt: string
  updatedAt: string
}

export interface ContactFilters {
  page?: number
  limit?: number
  statut?: string
  type?: string
  priorite?: string
  search?: string
}

export interface ContactsResponse {
  success: boolean
  data: Contact[]
  pagination: {
    page: number
    totalPages: number
    totalDocs: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface ContactResponse {
  success: boolean
  data: Contact
  message?: string
}

export interface CreateContactData {
  nom: string
  email: string
  telephone?: string
  type: 'question' | 'reclamation' | 'formation' | 'devis'
  sujet: string
  message: string
  statut?: 'nouveau' | 'enCours' | 'traite' | 'ferme'
  priorite?: 'basse' | 'normale' | 'haute' | 'urgente'
}

export interface UpdateContactData {
  nom?: string
  email?: string
  telephone?: string
  type?: 'question' | 'reclamation' | 'formation' | 'devis'
  sujet?: string
  message?: string
  statut?: 'nouveau' | 'enCours' | 'traite' | 'ferme'
  priorite?: 'basse' | 'normale' | 'haute' | 'urgente'
  reponse?: string
}

class ContactAPIService {
  private baseUrl = '/api/contacts'

  /**
   * Récupère tous les contacts avec filtres optionnels
   */
  async getContacts(filters?: ContactFilters): Promise<ContactsResponse> {
    const params = new URLSearchParams()

    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.statut) params.append('statut', filters.statut)
    if (filters?.type) params.append('type', filters.type)
    if (filters?.priorite) params.append('priorite', filters.priorite)
    if (filters?.search) params.append('search', filters.search)

    const url = `${this.baseUrl}${params.toString() ? `?${params.toString()}` : ''}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Récupère un contact par son ID
   */
  async getContactById(id: string): Promise<ContactResponse> {
    const response = await fetch(`${this.baseUrl}/${id}`)

    if (!response.ok) {
      throw new Error(`Erreur ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Crée un nouveau contact
   */
  async createContact(data: CreateContactData): Promise<ContactResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Erreur ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Met à jour un contact existant
   */
  async updateContact(id: string, data: UpdateContactData): Promise<ContactResponse> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Erreur ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Supprime un contact
   */
  async deleteContact(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || `Erreur ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Marque un contact comme traité avec une réponse
   */
  async repondreContact(id: string, reponse: string): Promise<ContactResponse> {
    return this.updateContact(id, {
      statut: 'traite',
      reponse,
    })
  }

  /**
   * Change le statut d'un contact
   */
  async changeStatut(
    id: string,
    statut: 'nouveau' | 'enCours' | 'traite' | 'ferme'
  ): Promise<ContactResponse> {
    return this.updateContact(id, { statut })
  }

  /**
   * Change la priorité d'un contact
   */
  async changePriorite(
    id: string,
    priorite: 'basse' | 'normale' | 'haute' | 'urgente'
  ): Promise<ContactResponse> {
    return this.updateContact(id, { priorite })
  }
}

// Export d'une instance unique
export const contactAPIService = new ContactAPIService()
