/**
 * Service générique pour les appels Payload API
 */

import { getPayload } from 'payload'
import payloadConfig from '../payload.config'

export interface PayloadApiOptions {
  collection: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  id?: string
  data?: any
  where?: any
  limit?: number
  page?: number
  sort?: string
  depth?: number
  locale?: string
}

export interface PayloadApiResponse<T = any> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

class PayloadApiService {
  private static instance: PayloadApiService
  private payload: any = null

  private constructor() {}

  static getInstance(): PayloadApiService {
    if (!PayloadApiService.instance) {
      PayloadApiService.instance = new PayloadApiService()
    }
    return PayloadApiService.instance
  }

  private async getPayloadInstance() {
    if (!this.payload) {
      this.payload = await getPayload({ config: payloadConfig })
    }
    return this.payload
  }

  /**
   * Exécuter une requête Payload API
   */
  async request<T = any>(options: PayloadApiOptions): Promise<T> {
    try {
      const payload = await this.getPayloadInstance()
      const { collection, method, id, data, where, limit, page, sort, depth, locale } = options

      switch (method) {
        case 'GET':
          if (id) {
            // Récupérer un document par ID
            return await payload.findByID({
              collection,
              id,
              depth,
              locale,
            })
          } else {
            // Récupérer une liste de documents
            return await payload.find({
              collection,
              where,
              limit,
              page,
              sort,
              depth,
              locale,
            })
          }

        case 'POST':
          // Créer un nouveau document
          return await payload.create({
            collection,
            data,
            depth,
            locale,
          })

        case 'PUT':
          // Mettre à jour un document
          if (!id) {
            throw new Error('ID requis pour la mise à jour')
          }
          return await payload.update({
            collection,
            id,
            data,
            depth,
            locale,
          })

        case 'DELETE':
          // Supprimer un document
          if (!id) {
            throw new Error('ID requis pour la suppression')
          }
          return await payload.delete({
            collection,
            id,
            locale,
          })

        default:
          throw new Error(`Méthode HTTP non supportée: ${method}`)
      }
    } catch (error) {
      console.error('Erreur Payload API:', error)
      throw error
    }
  }

  /**
   * Récupérer tous les documents d'une collection
   */
  async findAll<T = any>(
    collection: string,
    options: {
      where?: any
      limit?: number
      page?: number
      sort?: string
      depth?: number
      locale?: string
    } = {}
  ): Promise<PayloadApiResponse<T>> {
    return this.request<PayloadApiResponse<T>>({
      collection,
      method: 'GET',
      ...options,
    })
  }

  /**
   * Récupérer un document par ID
   */
  async findById<T = any>(
    collection: string,
    id: string,
    options: {
      depth?: number
      locale?: string
    } = {}
  ): Promise<T> {
    return this.request<T>({
      collection,
      method: 'GET',
      id,
      ...options,
    })
  }

  /**
   * Créer un nouveau document
   */
  async create<T = any>(
    collection: string,
    data: any,
    options: {
      depth?: number
      locale?: string
    } = {}
  ): Promise<T> {
    return this.request<T>({
      collection,
      method: 'POST',
      data,
      ...options,
    })
  }

  /**
   * Mettre à jour un document
   */
  async update<T = any>(
    collection: string,
    id: string,
    data: any,
    options: {
      depth?: number
      locale?: string
    } = {}
  ): Promise<T> {
    return this.request<T>({
      collection,
      method: 'PUT',
      id,
      data,
      ...options,
    })
  }

  /**
   * Supprimer un document
   */
  async delete(
    collection: string,
    id: string,
    options: {
      locale?: string
    } = {}
  ): Promise<void> {
    return this.request<void>({
      collection,
      method: 'DELETE',
      id,
      ...options,
    })
  }

  /**
   * Compter les documents d'une collection
   */
  async count(
    collection: string,
    where?: any,
    options: {
      locale?: string
    } = {}
  ): Promise<{ totalDocs: number }> {
    const payload = await this.getPayloadInstance()
    return await payload.count({
      collection,
      where,
      ...options,
    })
  }

  /**
   * Rechercher des documents
   */
  async search<T = any>(
    collection: string,
    query: string,
    options: {
      fields?: string[]
      limit?: number
      page?: number
      sort?: string
      depth?: number
      locale?: string
    } = {}
  ): Promise<PayloadApiResponse<T>> {
    const { fields = [], ...otherOptions } = options

    // Construire la requête de recherche
    const where: any = {
      or: fields.map(field => ({
        [field]: {
          contains: query,
        },
      })),
    }

    return this.findAll<T>(collection, {
      where,
      ...otherOptions,
    })
  }
}

// Instance singleton
export const payloadApi = PayloadApiService.getInstance()

// Note: Les types PayloadApiOptions et PayloadApiResponse sont déjà exportés
// individuellement avec "export interface" au début du fichier
