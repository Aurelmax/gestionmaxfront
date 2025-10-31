/**
 * Service de gestion des rendez-vous via Payload API
 */

import { payloadApi } from './payload-api-service'
import type {
  RendezVous,
  CreateRendezVousRequest,
  UpdateRendezVousRequest,
  RendezVousFilters,
  RendezVousStats,
} from '@/types/rendez-vous'

export class RendezVousApiService {
  /**
   * Récupérer tous les rendez-vous
   */
  static async getRendezVous(filters?: RendezVousFilters): Promise<RendezVous[]> {
    try {
      const where: any = {}

      if (filters) {
        if (filters.statut) {
          where.statut = { equals: filters.statut }
        }
        if (filters.type) {
          where.type = { equals: filters.type }
        }
        if (filters.lieu) {
          where.lieu = { equals: filters.lieu }
        }
        if (filters.programmeId) {
          where.programme = { equals: filters.programmeId }
        }
        if (filters.dateDebut && filters.dateFin) {
          where.date = {
            greaterThanEqual: filters.dateDebut,
            lessThanEqual: filters.dateFin,
          }
        }
        if (filters.search) {
          where.or = [
            { 'client.nom': { contains: filters.search } },
            { 'client.prenom': { contains: filters.search } },
            { 'client.email': { contains: filters.search } },
          ]
        }
      }

      const response = await payloadApi.findAll('rendez-vous', {
        where,
        sort: 'date',
        depth: 1,
      })

      return response.docs.map(this.transformPayloadToRendezVous)
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error)
      throw error
    }
  }

  /**
   * Récupérer un rendez-vous par ID
   */
  static async getRendezVousById(id: string): Promise<RendezVous | null> {
    try {
      const rdv = await payloadApi.findById('rendez-vous', id, { depth: 1 })
      return this.transformPayloadToRendezVous(rdv)
    } catch (error) {
      console.error(`Erreur lors de la récupération du rendez-vous ${id}:`, error)
      return null
    }
  }

  /**
   * Créer un nouveau rendez-vous
   */
  static async createRendezVous(rdvData: CreateRendezVousRequest): Promise<RendezVous> {
    try {
      const payloadData = this.transformRendezVousToPayload(rdvData)
      const rdv = await payloadApi.create('rendez-vous', payloadData, { depth: 1 })
      return this.transformPayloadToRendezVous(rdv)
    } catch (error) {
      console.error('Erreur lors de la création du rendez-vous:', error)
      throw error
    }
  }

  /**
   * Mettre à jour un rendez-vous
   */
  static async updateRendezVous(id: string, rdvData: UpdateRendezVousRequest): Promise<RendezVous> {
    try {
      const payloadData = this.transformRendezVousToPayload(rdvData)
      const rdv = await payloadApi.update('rendez-vous', id, payloadData, { depth: 1 })
      return this.transformPayloadToRendezVous(rdv)
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du rendez-vous ${id}:`, error)
      throw error
    }
  }

  /**
   * Supprimer un rendez-vous
   */
  static async deleteRendezVous(id: string): Promise<void> {
    try {
      await payloadApi.delete('rendez-vous', id)
    } catch (error) {
      console.error(`Erreur lors de la suppression du rendez-vous ${id}:`, error)
      throw error
    }
  }

  /**
   * Récupérer les rendez-vous d'aujourd'hui
   */
  static async getRendezVousAujourdhui(): Promise<RendezVous[]> {
    try {
      const aujourdhui = new Date().toISOString().split('T')[0]

      const response = await payloadApi.findAll('rendez-vous', {
        where: {
          date: { equals: aujourdhui },
        },
        sort: 'heure',
        depth: 1,
      })

      return response.docs.map(this.transformPayloadToRendezVous)
    } catch (error) {
      console.error("Erreur lors de la récupération des rendez-vous d'aujourd'hui:", error)
      throw error
    }
  }

  /**
   * Récupérer les rendez-vous de la semaine
   */
  static async getRendezVousCetteSemaine(): Promise<RendezVous[]> {
    try {
      const aujourdhui = new Date()
      const debutSemaine = new Date(aujourdhui)
      debutSemaine.setDate(aujourdhui.getDate() - aujourdhui.getDay())
      const finSemaine = new Date(debutSemaine)
      finSemaine.setDate(debutSemaine.getDate() + 6)

      const response = await payloadApi.findAll('rendez-vous', {
        where: {
          date: {
            greaterThanEqual: debutSemaine.toISOString().split('T')[0],
            lessThanEqual: finSemaine.toISOString().split('T')[0],
          },
        },
        sort: 'date',
        depth: 1,
      })

      return response.docs.map(this.transformPayloadToRendezVous)
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous de la semaine:', error)
      throw error
    }
  }

  /**
   * Récupérer les statistiques des rendez-vous
   */
  static async getRendezVousStats(): Promise<RendezVousStats> {
    try {
      const response = await payloadApi.findAll('rendez-vous', { depth: 0 })
      const rdvs = response.docs

      const aujourdhui = new Date().toISOString().split('T')[0]
      const debutSemaine = new Date()
      debutSemaine.setDate(debutSemaine.getDate() - debutSemaine.getDay())
      const debutMois = new Date()
      debutMois.setDate(1)

      const stats: RendezVousStats = {
        total: rdvs.length,
        enAttente: rdvs.filter((r: any) => r.statut === 'enAttente').length,
        confirmes: rdvs.filter((r: any) => r.statut === 'confirme').length,
        annules: rdvs.filter((r: any) => r.statut === 'annule').length,
        termines: rdvs.filter((r: any) => r.statut === 'termine').length,
        reportes: rdvs.filter((r: any) => r.statut === 'reporte').length,
        aujourdhui: rdvs.filter((r: any) => r.date === aujourdhui).length,
        cetteSemaine: rdvs.filter((r: any) => {
          const rdvDate = new Date(r.date)
          return rdvDate >= debutSemaine
        }).length,
        ceMois: rdvs.filter((r: any) => {
          const rdvDate = new Date(r.date)
          return rdvDate >= debutMois
        }).length,
      }

      return stats
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques des rendez-vous:', error)
      throw error
    }
  }

  /**
   * Transformer les données Payload vers le format RendezVous
   */
  private static transformPayloadToRendezVous(payloadData: any): RendezVous {
    return {
      id: payloadData.id,
      programmeId: payloadData.programme || '',
      programmeTitre: payloadData.programmeTitre || '',
      client: {
        nom: payloadData.client.nom,
        prenom: payloadData.client.prenom,
        email: payloadData.client.email,
        telephone: payloadData.client.telephone,
        entreprise: payloadData.client.entreprise,
      },
      type: payloadData.type,
      statut: payloadData.statut,
      date: payloadData.date,
      heure: payloadData.heure,
      duree: payloadData.duree,
      lieu: payloadData.lieu,
      adresse: payloadData.adresse,
      lienVisio: payloadData.lienVisio,
      notes: payloadData.notes,
      rappelEnvoye: payloadData.rappelEnvoye || false,
      createdAt: payloadData.createdAt,
      updatedAt: payloadData.updatedAt,
      createdBy: payloadData.createdBy,
    }
  }

  /**
   * Transformer les données RendezVous vers le format Payload
   */
  private static transformRendezVousToPayload(rdvData: any): any {
    return {
      programme: rdvData.programmeId,
      programmeTitre: rdvData.programmeTitre,
      client: {
        nom: rdvData.client.nom,
        prenom: rdvData.client.prenom,
        email: rdvData.client.email,
        telephone: rdvData.client.telephone,
        entreprise: rdvData.client.entreprise,
      },
      type: rdvData.type,
      statut: rdvData.statut,
      date: rdvData.date,
      heure: rdvData.heure,
      duree: rdvData.duree,
      lieu: rdvData.lieu,
      adresse: rdvData.adresse,
      lienVisio: rdvData.lienVisio,
      notes: rdvData.notes,
      rappelEnvoye: rdvData.rappelEnvoye,
      createdBy: rdvData.createdBy,
    }
  }
}
