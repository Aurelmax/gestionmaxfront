import { getPayload } from 'payload'
import payloadConfig from '../payload.config'
import {
  User,
  UserRole,
  Programme,
  Niveau,
  Modalite,
  ProgrammeStatut,
  Apprenant,
  ApprenantStatut,
  RendezVous,
  RendezVousType,
  RendezVousStatut,
} from '@/types/common'

// Cache pour éviter les appels répétés
let payloadClient: any = null

async function getPayloadClient() {
  if (!payloadClient) {
    payloadClient = await getPayload({ config: payloadConfig })
  }
  return payloadClient
}

// Types pour les réponses Payload
interface PayloadUser {
  id: string
  name: string
  firstName?: string
  lastName?: string
  email: string
  role: string
  status: string
  phone?: string
  address?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

interface PayloadProgramme {
  id: string
  codeFormation: string
  titre: string
  description: string
  duree: number
  niveau: string
  modalites: string
  prix: number
  competences: Array<{ competence: string }>
  statut: string
  eligibleCPF?: boolean
  codeCPF?: string
  objectifs?: string
  prerequis?: string
  programme?: string
  modalitesPedagogiques?: string
  evaluation?: string
  certification?: string
  image?: string
  rating?: number
  students?: number
  createdAt: string
  updatedAt: string
}

interface PayloadApprenant {
  id: string
  nom: string
  prenom: string
  email: string
  telephone?: string
  dateNaissance?: string
  adresse?: string
  statut: string
  programmes?: string[]
  progression?: number
  createdAt: string
  updatedAt: string
}

interface PayloadRendezVous {
  id: string
  programme?: string
  client: {
    nom: string
    prenom: string
    email: string
    telephone?: string
    entreprise?: string
  }
  type: string
  statut: string
  date: string
  heure: string
  duree: number
  lieu: string
  adresse?: string
  lienVisio?: string
  notes?: string
  rappelEnvoye: boolean
  createdBy?: string
  createdAt: string
  updatedAt: string
}

// Mappers pour convertir les données Payload vers les types de l'application
function mapPayloadUserToUser(payloadUser: PayloadUser): User {
  return {
    id: payloadUser.id,
    nom: payloadUser.name,
    prenom: payloadUser.firstName || '',
    email: payloadUser.email,
    role: payloadUser.role.toUpperCase() as UserRole,
    avatar: payloadUser.avatar,
    createdAt: new Date(payloadUser.createdAt),
    updatedAt: new Date(payloadUser.updatedAt),
  }
}

function mapPayloadProgrammeToProgramme(payloadProgramme: PayloadProgramme): Programme {
  return {
    id: payloadProgramme.id,
    codeFormation: payloadProgramme.codeFormation,
    titre: payloadProgramme.titre,
    description: payloadProgramme.description,
    duree: payloadProgramme.duree,
    niveau: payloadProgramme.niveau as Niveau,
    modalites: payloadProgramme.modalites as Modalite,
    prix: payloadProgramme.prix,
    statut: (payloadProgramme.statut.toUpperCase() === 'ACTIF'
      ? 'PUBLIE'
      : payloadProgramme.statut.toUpperCase()) as ProgrammeStatut,
    formateurs: [], // TODO: Implémenter la relation avec les formateurs
    competences: payloadProgramme.competences.map(c => c.competence),
    createdAt: new Date(payloadProgramme.createdAt),
    updatedAt: new Date(payloadProgramme.updatedAt),
  }
}

function mapPayloadApprenantToApprenant(payloadApprenant: PayloadApprenant): Apprenant {
  return {
    id: payloadApprenant.id,
    nom: payloadApprenant.nom || '',
    prenom: payloadApprenant.prenom || '',
    email: payloadApprenant.email || '',
    telephone: payloadApprenant.telephone || '',
    dateNaissance: payloadApprenant.dateNaissance || '',
    adresse: payloadApprenant.adresse || '',
    statut: (payloadApprenant.statut as ApprenantStatut) || 'actif',
    programmes: payloadApprenant.programmes || [],
    progression: payloadApprenant.progression || 0,
    createdAt: new Date(payloadApprenant.createdAt),
    updatedAt: new Date(payloadApprenant.updatedAt),
  }
}

function mapPayloadRendezVousToRendezVous(payloadRdv: PayloadRendezVous): RendezVous {
  return {
    id: payloadRdv.id,
    programmeId: payloadRdv.programme || '',
    programmeTitre: '', // TODO: Récupérer le titre du programme via la relation
    client: payloadRdv.client,
    type: payloadRdv.type as RendezVousType,
    statut: payloadRdv.statut as RendezVousStatut,
    date: payloadRdv.date,
    heure: payloadRdv.heure,
    duree: payloadRdv.duree,
    lieu: payloadRdv.lieu as 'presentiel' | 'visio' | 'telephone',
    adresse: payloadRdv.adresse,
    lienVisio: payloadRdv.lienVisio,
    notes: payloadRdv.notes,
    rappelEnvoye: payloadRdv.rappelEnvoye,
    createdAt: payloadRdv.createdAt,
    updatedAt: payloadRdv.updatedAt,
    createdBy: payloadRdv.createdBy || '',
  }
}

// Service principal Payload
export class PayloadService {
  // === GESTION DES UTILISATEURS ===

  async getUsers(): Promise<User[]> {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'users',
        limit: 100,
        sort: '-createdAt',
      })

      return result.docs.map(mapPayloadUserToUser)
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
      throw new Error('Impossible de récupérer les utilisateurs')
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const payload = await getPayloadClient()
      const user = await payload.findByID({
        collection: 'users',
        id,
      })

      return mapPayloadUserToUser(user)
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${id}:`, error)
      return null
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: email,
          },
        },
        limit: 1,
      })

      if (result.docs.length === 0) {
        return null
      }

      return mapPayloadUserToUser(result.docs[0])
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur par email ${email}:`, error)
      return null
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    try {
      const payload = await getPayloadClient()
      const created = await payload.create({
        collection: 'users',
        data: {
          name: userData.nom,
          firstName: userData.prenom,
          email: userData.email,
          role: userData.role?.toLowerCase() || 'apprenant',
          status: 'active',
        },
      })

      return mapPayloadUserToUser(created)
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error)
      throw new Error("Impossible de créer l'utilisateur")
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    try {
      const payload = await getPayloadClient()
      const updated = await payload.update({
        collection: 'users',
        id,
        data: {
          name: userData.nom,
          firstName: userData.prenom,
          email: userData.email,
          role: userData.role?.toLowerCase(),
        },
      })

      return mapPayloadUserToUser(updated)
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur ${id}:`, error)
      throw new Error("Impossible de mettre à jour l'utilisateur")
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const payload = await getPayloadClient()
      await payload.delete({
        collection: 'users',
        id,
      })

      return true
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'utilisateur ${id}:`, error)
      return false
    }
  }

  // === GESTION DES PROGRAMMES ===

  async getProgrammes(): Promise<Programme[]> {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'programmes',
        limit: 100,
        sort: '-createdAt',
      })

      return result.docs.map(mapPayloadProgrammeToProgramme)
    } catch (error) {
      console.error('Erreur lors de la récupération des programmes:', error)
      throw new Error('Impossible de récupérer les programmes')
    }
  }

  async getProgrammeById(id: string): Promise<Programme | null> {
    try {
      const payload = await getPayloadClient()
      const programme = await payload.findByID({
        collection: 'programmes',
        id,
      })

      return mapPayloadProgrammeToProgramme(programme)
    } catch (error) {
      console.error(`Erreur lors de la récupération du programme ${id}:`, error)
      return null
    }
  }

  async getProgrammeByCode(codeFormation: string): Promise<Programme | null> {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'programmes',
        where: {
          codeFormation: {
            equals: codeFormation,
          },
        },
        limit: 1,
      })

      if (result.docs.length === 0) {
        return null
      }

      return mapPayloadProgrammeToProgramme(result.docs[0])
    } catch (error) {
      console.error(`Erreur lors de la récupération du programme par code ${codeFormation}:`, error)
      return null
    }
  }

  async createProgramme(programmeData: Partial<Programme>): Promise<Programme> {
    try {
      const payload = await getPayloadClient()
      const created = await payload.create({
        collection: 'programmes',
        data: {
          codeFormation: programmeData.codeFormation,
          titre: programmeData.titre,
          description: programmeData.description,
          duree: programmeData.duree,
          niveau: programmeData.niveau,
          modalites: programmeData.modalites,
          prix: programmeData.prix,
          competences: programmeData.competences?.map(c => ({ competence: c })) || [],
          statut: programmeData.statut?.toLowerCase() || 'actif',
        },
      })

      return mapPayloadProgrammeToProgramme(created)
    } catch (error) {
      console.error('Erreur lors de la création du programme:', error)
      throw new Error('Impossible de créer le programme')
    }
  }

  async updateProgramme(id: string, programmeData: Partial<Programme>): Promise<Programme> {
    try {
      const payload = await getPayloadClient()
      const updated = await payload.update({
        collection: 'programmes',
        id,
        data: {
          codeFormation: programmeData.codeFormation,
          titre: programmeData.titre,
          description: programmeData.description,
          duree: programmeData.duree,
          niveau: programmeData.niveau,
          modalites: programmeData.modalites,
          prix: programmeData.prix,
          competences: programmeData.competences?.map(c => ({ competence: c })) || [],
          statut: programmeData.statut?.toLowerCase(),
        },
      })

      return mapPayloadProgrammeToProgramme(updated)
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du programme ${id}:`, error)
      throw new Error('Impossible de mettre à jour le programme')
    }
  }

  async deleteProgramme(id: string): Promise<boolean> {
    try {
      const payload = await getPayloadClient()
      await payload.delete({
        collection: 'programmes',
        id,
      })

      return true
    } catch (error) {
      console.error(`Erreur lors de la suppression du programme ${id}:`, error)
      return false
    }
  }

  // === GESTION DES APPRENANTS ===

  async getApprenants(): Promise<Apprenant[]> {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'apprenants',
        limit: 100,
        sort: '-createdAt',
      })

      return result.docs.map(mapPayloadApprenantToApprenant)
    } catch (error) {
      console.error('Erreur lors de la récupération des apprenants:', error)
      throw new Error('Impossible de récupérer les apprenants')
    }
  }

  async getApprenantById(id: string): Promise<Apprenant | null> {
    try {
      const payload = await getPayloadClient()
      const apprenant = await payload.findByID({
        collection: 'apprenants',
        id,
      })

      return mapPayloadApprenantToApprenant(apprenant)
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'apprenant ${id}:`, error)
      return null
    }
  }

  async createApprenant(apprenantData: Partial<Apprenant>): Promise<Apprenant> {
    try {
      const payload = await getPayloadClient()
      const created = await payload.create({
        collection: 'apprenants',
        data: {
          nom: apprenantData.nom,
          prenom: apprenantData.prenom,
          email: apprenantData.email,
          telephone: apprenantData.telephone,
          dateNaissance: apprenantData.dateNaissance,
          adresse: apprenantData.adresse,
          statut: apprenantData.statut || 'ACTIF',
          programmes: apprenantData.programmes || [],
          progression: apprenantData.progression || 0,
        },
      })

      return mapPayloadApprenantToApprenant(created)
    } catch (error) {
      console.error("Erreur lors de la création de l'apprenant:", error)
      throw new Error("Impossible de créer l'apprenant")
    }
  }

  async updateApprenant(id: string, apprenantData: Partial<Apprenant>): Promise<Apprenant> {
    try {
      const payload = await getPayloadClient()
      const updated = await payload.update({
        collection: 'apprenants',
        id,
        data: {
          nom: apprenantData.nom,
          prenom: apprenantData.prenom,
          email: apprenantData.email,
          telephone: apprenantData.telephone,
          dateNaissance: apprenantData.dateNaissance,
          adresse: apprenantData.adresse,
          statut: apprenantData.statut,
          programmes: apprenantData.programmes,
          progression: apprenantData.progression,
        },
      })

      return mapPayloadApprenantToApprenant(updated)
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'apprenant ${id}:`, error)
      throw new Error("Impossible de mettre à jour l'apprenant")
    }
  }

  async deleteApprenant(id: string): Promise<boolean> {
    try {
      const payload = await getPayloadClient()
      await payload.delete({
        collection: 'apprenants',
        id,
      })

      return true
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'apprenant ${id}:`, error)
      return false
    }
  }

  // === GESTION DES RENDEZ-VOUS ===

  async getRendezVous(): Promise<RendezVous[]> {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'rendez-vous',
        limit: 100,
        sort: '-createdAt',
      })

      return result.docs.map(mapPayloadRendezVousToRendezVous)
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error)
      throw new Error('Impossible de récupérer les rendez-vous')
    }
  }

  async getRendezVousById(id: string): Promise<RendezVous | null> {
    try {
      const payload = await getPayloadClient()
      const rdv = await payload.findByID({
        collection: 'rendez-vous',
        id,
      })

      return mapPayloadRendezVousToRendezVous(rdv)
    } catch (error) {
      console.error(`Erreur lors de la récupération du rendez-vous ${id}:`, error)
      return null
    }
  }

  async createRendezVous(rdvData: Partial<RendezVous>): Promise<RendezVous> {
    try {
      const payload = await getPayloadClient()
      const created = await payload.create({
        collection: 'rendez-vous',
        data: {
          programme: rdvData.programmeId,
          client: rdvData.client,
          type: rdvData.type,
          statut: rdvData.statut,
          date: rdvData.date,
          heure: rdvData.heure,
          duree: rdvData.duree,
          lieu: rdvData.lieu,
          adresse: rdvData.adresse,
          lienVisio: rdvData.lienVisio,
          notes: rdvData.notes,
          rappelEnvoye: rdvData.rappelEnvoye || false,
          createdBy: rdvData.createdBy,
        },
      })

      return mapPayloadRendezVousToRendezVous(created)
    } catch (error) {
      console.error('Erreur lors de la création du rendez-vous:', error)
      throw new Error('Impossible de créer le rendez-vous')
    }
  }

  async updateRendezVous(id: string, rdvData: Partial<RendezVous>): Promise<RendezVous> {
    try {
      const payload = await getPayloadClient()
      const updated = await payload.update({
        collection: 'rendez-vous',
        id,
        data: {
          programme: rdvData.programmeId,
          client: rdvData.client,
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
        },
      })

      return mapPayloadRendezVousToRendezVous(updated)
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du rendez-vous ${id}:`, error)
      throw new Error('Impossible de mettre à jour le rendez-vous')
    }
  }

  async deleteRendezVous(id: string): Promise<boolean> {
    try {
      const payload = await getPayloadClient()
      await payload.delete({
        collection: 'rendez-vous',
        id,
      })

      return true
    } catch (error) {
      console.error(`Erreur lors de la suppression du rendez-vous ${id}:`, error)
      return false
    }
  }

  // === STATISTIQUES ===

  async getStats() {
    try {
      const payload = await getPayloadClient()

      const [usersCount, programmesCount, apprenantsCount, rdvCount] = await Promise.all([
        payload.count({ collection: 'users' }),
        payload.count({ collection: 'programmes' }),
        payload.count({ collection: 'apprenants' }),
        payload.count({ collection: 'rendez-vous' }),
      ])

      return {
        totalUsers: usersCount.totalDocs,
        totalProgrammes: programmesCount.totalDocs,
        totalApprenants: apprenantsCount.totalDocs,
        totalRendezVous: rdvCount.totalDocs,
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      return {
        totalUsers: 0,
        totalProgrammes: 0,
        totalApprenants: 0,
        totalRendezVous: 0,
      }
    }
  }
}

// Instance singleton
export const payloadService = new PayloadService()
