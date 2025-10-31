/**
 * Service de gestion des programmes de formation via Payload API
 */

import { payloadApi } from './payload-api-service'
import type { Programme } from '@/types/common'

export interface ProgrammeStats {
  total: number
  actifs: number
  inactifs: number
  parNiveau: Record<string, number>
  parModalite: Record<string, number>
}

export class ProgrammeService {
  /**
   * Récupérer tous les programmes
   */
  static async getProgrammes(): Promise<Programme[]> {
    try {
      const response = await payloadApi.findAll('programmes', {
        sort: '-createdAt',
        depth: 1,
      })

      // Transformer les données Payload vers le format attendu
      return response.docs.map(this.transformPayloadToProgramme)
    } catch (error) {
      console.error('Erreur lors de la récupération des programmes:', error)
      throw error
    }
  }

  /**
   * Récupérer un programme par ID
   */
  static async getProgramme(id: string): Promise<Programme | null> {
    try {
      const programme = await payloadApi.findById('programmes', id, { depth: 1 })
      return this.transformPayloadToProgramme(programme)
    } catch (error) {
      console.error(`Erreur lors de la récupération du programme ${id}:`, error)
      return null
    }
  }

  /**
   * Récupérer un programme par code de formation
   */
  static async getProgrammeByCode(codeFormation: string): Promise<Programme | null> {
    try {
      const response = await payloadApi.findAll('programmes', {
        where: {
          codeFormation: {
            equals: codeFormation,
          },
        },
        limit: 1,
        depth: 1,
      })

      if (response.docs.length > 0) {
        return this.transformPayloadToProgramme(response.docs[0])
      }
      return null
    } catch (error) {
      console.error(`Erreur lors de la récupération du programme ${codeFormation}:`, error)
      return null
    }
  }

  /**
   * Créer un nouveau programme
   */
  static async createProgramme(programmeData: Partial<Programme>): Promise<Programme> {
    try {
      const payloadData = this.transformProgrammeToPayload(programmeData)
      const programme = await payloadApi.create('programmes', payloadData, { depth: 1 })
      return this.transformPayloadToProgramme(programme)
    } catch (error) {
      console.error('Erreur lors de la création du programme:', error)
      throw error
    }
  }

  /**
   * Mettre à jour un programme
   */
  static async updateProgramme(id: string, programmeData: Partial<Programme>): Promise<Programme> {
    try {
      const payloadData = this.transformProgrammeToPayload(programmeData)
      const programme = await payloadApi.update('programmes', id, payloadData, { depth: 1 })
      return this.transformPayloadToProgramme(programme)
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du programme ${id}:`, error)
      throw error
    }
  }

  /**
   * Supprimer un programme
   */
  static async deleteProgramme(id: string): Promise<void> {
    try {
      await payloadApi.delete('programmes', id)
    } catch (error) {
      console.error(`Erreur lors de la suppression du programme ${id}:`, error)
      throw error
    }
  }

  /**
   * Rechercher des programmes
   */
  static async searchProgrammes(query: string): Promise<Programme[]> {
    try {
      const response = await payloadApi.search('programmes', query, {
        fields: ['titre', 'description', 'codeFormation'],
        sort: '-createdAt',
        depth: 1,
      })

      return response.docs.map(this.transformPayloadToProgramme)
    } catch (error) {
      console.error('Erreur lors de la recherche de programmes:', error)
      throw error
    }
  }

  /**
   * Récupérer les statistiques des programmes
   */
  static async getProgrammeStats(): Promise<ProgrammeStats> {
    try {
      const response = await payloadApi.findAll('programmes', { depth: 0 })
      const programmes = response.docs

      const stats: ProgrammeStats = {
        total: programmes.length,
        actifs: programmes.filter((p: any) => p.statut === 'actif').length,
        inactifs: programmes.filter((p: any) => p.statut === 'inactif').length,
        parNiveau: {},
        parModalite: {},
      }

      // Compter par niveau
      programmes.forEach((programme: any) => {
        const niveau = programme.niveau || 'Non défini'
        stats.parNiveau[niveau] = (stats.parNiveau[niveau] || 0) + 1
      })

      // Compter par modalité
      programmes.forEach((programme: any) => {
        const modalite = programme.modalites || 'Non défini'
        stats.parModalite[modalite] = (stats.parModalite[modalite] || 0) + 1
      })

      return stats
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  }

  /**
   * Transformer les données Payload vers le format Programme
   */
  private static transformPayloadToProgramme(payloadData: any): Programme {
    return {
      id: payloadData.id,
      codeFormation: payloadData.codeFormation,
      titre: payloadData.titre,
      description: payloadData.description,
      duree: payloadData.duree,
      niveau: payloadData.niveau,
      modalites: payloadData.modalites,
      prix: payloadData.prix,
      statut: payloadData.statut === 'actif' ? 'PUBLIE' : 'BROUILLON',
      image: payloadData.image,
      formateurs: payloadData.formateurs || [],
      competences: payloadData.competences?.map((c: any) => c.competence) || [],
      createdAt: payloadData.createdAt,
      updatedAt: payloadData.updatedAt,
    }
  }

  /**
   * Transformer les données Programme vers le format Payload
   */
  private static transformProgrammeToPayload(programmeData: Partial<Programme>): any {
    return {
      codeFormation: programmeData.codeFormation,
      titre: programmeData.titre,
      description: programmeData.description,
      duree: programmeData.duree,
      niveau: programmeData.niveau,
      modalites: programmeData.modalites,
      prix: programmeData.prix,
      statut: programmeData.statut === 'PUBLIE' ? 'actif' : 'inactif',
      image: programmeData.image,
      formateurs: programmeData.formateurs,
      competences: programmeData.competences?.map(competence => ({ competence })) || [],
      objectifs:
        programmeData.objectifs ||
        `Formation ${programmeData.niveau?.toLowerCase()} de ${programmeData.duree} heures sur ${programmeData.titre}`,
      prerequis:
        programmeData.prerequis ||
        (programmeData.niveau === 'DEBUTANT'
          ? 'Aucun prérequis technique'
          : 'Connaissances de base en informatique'),
      programme:
        programmeData.programme || `Programme détaillé de la formation ${programmeData.titre}`,
      modalitesPedagogiques:
        programmeData.modalitesPedagogiques ||
        `Formation en ${programmeData.modalites?.toLowerCase()} avec approche pratique`,
      evaluation: programmeData.evaluation || 'Évaluation continue et projet final',
      certification: programmeData.certification || 'Attestation de formation délivrée',
      eligibleCPF: programmeData.eligibleCPF || true,
      codeCPF: programmeData.codeCPF || `RS${Math.floor(Math.random() * 10000)}`,
    }
  }
}
