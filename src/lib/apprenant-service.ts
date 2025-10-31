/**
 * Service de gestion des apprenants via Payload API
 */

import { payloadApi } from './payload-api-service'
import type { Apprenant } from '@/types/common'

export interface ApprenantStats {
  total: number
  actifs: number
  inactifs: number
  termines: number
  progressionMoyenne: number
}

export class ApprenantService {
  /**
   * Récupérer tous les apprenants
   */
  static async getApprenants(): Promise<Apprenant[]> {
    try {
      const response = await payloadApi.findAll('apprenants', {
        sort: '-createdAt',
        depth: 1,
      })

      return response.docs.map(this.transformPayloadToApprenant)
    } catch (error) {
      console.error('Erreur lors de la récupération des apprenants:', error)
      throw error
    }
  }

  /**
   * Récupérer un apprenant par ID
   */
  static async getApprenant(id: string): Promise<Apprenant | null> {
    try {
      const apprenant = await payloadApi.findById('apprenants', id, { depth: 1 })
      return this.transformPayloadToApprenant(apprenant)
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'apprenant ${id}:`, error)
      return null
    }
  }

  /**
   * Récupérer un apprenant par email
   */
  static async getApprenantByEmail(email: string): Promise<Apprenant | null> {
    try {
      const response = await payloadApi.findAll('apprenants', {
        where: {
          email: {
            equals: email,
          },
        },
        limit: 1,
        depth: 1,
      })

      if (response.docs.length > 0) {
        return this.transformPayloadToApprenant(response.docs[0])
      }
      return null
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'apprenant ${email}:`, error)
      return null
    }
  }

  /**
   * Créer un nouvel apprenant
   */
  static async createApprenant(apprenantData: Partial<Apprenant>): Promise<Apprenant> {
    try {
      const payloadData = this.transformApprenantToPayload(apprenantData)
      const apprenant = await payloadApi.create('apprenants', payloadData, { depth: 1 })
      return this.transformPayloadToApprenant(apprenant)
    } catch (error) {
      console.error("Erreur lors de la création de l'apprenant:", error)
      throw error
    }
  }

  /**
   * Mettre à jour un apprenant
   */
  static async updateApprenant(id: string, apprenantData: Partial<Apprenant>): Promise<Apprenant> {
    try {
      const payloadData = this.transformApprenantToPayload(apprenantData)
      const apprenant = await payloadApi.update('apprenants', id, payloadData, { depth: 1 })
      return this.transformPayloadToApprenant(apprenant)
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'apprenant ${id}:`, error)
      throw error
    }
  }

  /**
   * Supprimer un apprenant
   */
  static async deleteApprenant(id: string): Promise<void> {
    try {
      await payloadApi.delete('apprenants', id)
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'apprenant ${id}:`, error)
      throw error
    }
  }

  /**
   * Rechercher des apprenants
   */
  static async searchApprenants(query: string): Promise<Apprenant[]> {
    try {
      const response = await payloadApi.search('apprenants', query, {
        fields: ['nom', 'prenom', 'email'],
        sort: '-createdAt',
        depth: 1,
      })

      return response.docs.map(this.transformPayloadToApprenant)
    } catch (error) {
      console.error("Erreur lors de la recherche d'apprenants:", error)
      throw error
    }
  }

  /**
   * Récupérer les apprenants par statut
   */
  static async getApprenantsByStatut(statut: string): Promise<Apprenant[]> {
    try {
      const response = await payloadApi.findAll('apprenants', {
        where: {
          statut: {
            equals: statut,
          },
        },
        sort: '-createdAt',
        depth: 1,
      })

      return response.docs.map(this.transformPayloadToApprenant)
    } catch (error) {
      console.error(`Erreur lors de la récupération des apprenants ${statut}:`, error)
      throw error
    }
  }

  /**
   * Mettre à jour la progression d'un apprenant
   */
  static async updateProgression(id: string, progression: number): Promise<Apprenant> {
    try {
      const apprenant = await payloadApi.update('apprenants', id, { progression }, { depth: 1 })
      return this.transformPayloadToApprenant(apprenant)
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la progression de l'apprenant ${id}:`, error)
      throw error
    }
  }

  /**
   * Récupérer les statistiques des apprenants
   */
  static async getApprenantStats(): Promise<ApprenantStats> {
    try {
      const response = await payloadApi.findAll('apprenants', { depth: 0 })
      const apprenants = response.docs

      const stats: ApprenantStats = {
        total: apprenants.length,
        actifs: apprenants.filter((a: any) => a.statut === 'ACTIF').length,
        inactifs: apprenants.filter((a: any) => a.statut === 'INACTIF').length,
        termines: apprenants.filter((a: any) => a.statut === 'TERMINE').length,
        progressionMoyenne: 0,
      }

      // Calculer la progression moyenne
      if (apprenants.length > 0) {
        const totalProgression = apprenants.reduce(
          (sum: number, a: any) => sum + (a.progression || 0),
          0
        )
        stats.progressionMoyenne = Math.round(totalProgression / apprenants.length)
      }

      return stats
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des apprenants:', error)
      throw error
    }
  }

  /**
   * Transformer les données Payload vers le format Apprenant
   */
  private static transformPayloadToApprenant(payloadData: any): Apprenant {
    return {
      id: payloadData.id,
      nom: payloadData.nom,
      prenom: payloadData.prenom,
      email: payloadData.email,
      telephone: payloadData.telephone,
      dateNaissance: payloadData.dateNaissance,
      adresse: payloadData.adresse,
      statut: payloadData.statut,
      programmes: payloadData.programmes || [],
      progression: payloadData.progression || 0,
      avatar: payloadData.avatar,
      createdAt: payloadData.createdAt,
      updatedAt: payloadData.updatedAt,
    }
  }

  /**
   * Transformer les données Apprenant vers le format Payload
   */
  private static transformApprenantToPayload(apprenantData: Partial<Apprenant>): any {
    return {
      nom: apprenantData.nom,
      prenom: apprenantData.prenom,
      email: apprenantData.email,
      telephone: apprenantData.telephone,
      dateNaissance: apprenantData.dateNaissance,
      adresse: apprenantData.adresse,
      statut: apprenantData.statut || 'ACTIF',
      programmes: apprenantData.programmes || [],
      progression: apprenantData.progression || 0,
      avatar: apprenantData.avatar,
    }
  }
}
