import {
  RendezVous,
  CreateRendezVousRequest,
  UpdateRendezVousRequest,
  RendezVousFilters,
  RendezVousStats,
} from '@/types/rendez-vous'
import { delay } from '@/lib/utils'

// Mock Data
const MOCK_RENDEZ_VOUS: RendezVous[] = [
  {
    id: '1',
    programmeId: '1',
    programmeTitre: 'Formation WordPress Débutant',
    client: {
      nom: 'Dupont',
      prenom: 'Marie',
      email: 'marie.dupont@email.com',
      telephone: '06 12 34 56 78',
      entreprise: 'Entreprise ABC',
    },
    type: 'positionnement',
    statut: 'confirme',
    date: '2024-01-15',
    heure: '14:00',
    duree: 30,
    lieu: 'visio',
    lienVisio: 'https://meet.google.com/abc-defg-hij',
    notes: 'Client intéressé par la formation WordPress, a déjà une base en développement web.',
    rappelEnvoye: true,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
    createdBy: '1',
  },
  {
    id: '2',
    programmeId: '2',
    programmeTitre: 'Formation SEO Avancé',
    client: {
      nom: 'Martin',
      prenom: 'Pierre',
      email: 'pierre.martin@email.com',
      telephone: '06 98 76 54 32',
    },
    type: 'information',
    statut: 'enAttente',
    date: '2024-01-16',
    heure: '10:30',
    duree: 45,
    lieu: 'presentiel',
    adresse: '123 Rue de la Formation, 75001 Paris',
    notes: 'Premier contact, souhaite des informations sur nos formations SEO.',
    rappelEnvoye: false,
    createdAt: '2024-01-11T14:30:00Z',
    updatedAt: '2024-01-11T14:30:00Z',
    createdBy: '1',
  },
  {
    id: '3',
    programmeId: '1',
    programmeTitre: 'Formation WordPress Débutant',
    client: {
      nom: 'Leroy',
      prenom: 'Sophie',
      email: 'sophie.leroy@email.com',
      telephone: '06 55 44 33 22',
      entreprise: 'Startup XYZ',
    },
    type: 'inscription',
    statut: 'termine',
    date: '2024-01-12',
    heure: '16:00',
    duree: 60,
    lieu: 'telephone',
    notes: 'Inscription confirmée, paiement effectué. Formation prévue pour février.',
    rappelEnvoye: true,
    createdAt: '2024-01-08T09:15:00Z',
    updatedAt: '2024-01-12T16:30:00Z',
    createdBy: '1',
  },
]

// Stockage partagé côté serveur (en mémoire)
let sharedRendezVous: RendezVous[] = [...MOCK_RENDEZ_VOUS]

class RendezVousServiceShared {
  private rendezVous: RendezVous[] = sharedRendezVous

  constructor() {
    // Synchroniser avec le stockage partagé
    this.rendezVous = sharedRendezVous
  }

  private saveToShared() {
    sharedRendezVous = [...this.rendezVous]
  }

  async getRendezVous(
    filters?: RendezVousFilters
  ): Promise<{ rendezVous: RendezVous[]; total: number; stats: RendezVousStats }> {
    await delay()

    // Synchroniser avec le stockage partagé
    this.rendezVous = sharedRendezVous

    let filtered = [...this.rendezVous]

    if (filters) {
      if (filters.statut && filters.statut !== 'all') {
        filtered = filtered.filter(rdv => rdv.statut === filters.statut)
      }
      if (filters.type && filters.type !== 'all') {
        filtered = filtered.filter(rdv => rdv.type === filters.type)
      }
      if (filters.lieu && filters.lieu !== 'all') {
        filtered = filtered.filter(rdv => rdv.lieu === filters.lieu)
      }
      if (filters.programmeId) {
        filtered = filtered.filter(rdv => rdv.programmeId === filters.programmeId)
      }
      if (filters.dateDebut) {
        filtered = filtered.filter(rdv => rdv.date >= filters.dateDebut!)
      }
      if (filters.dateFin) {
        filtered = filtered.filter(rdv => rdv.date <= filters.dateFin!)
      }
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filtered = filtered.filter(
          rdv =>
            rdv.client.nom.toLowerCase().includes(searchTerm) ||
            rdv.client.prenom.toLowerCase().includes(searchTerm) ||
            rdv.client.email.toLowerCase().includes(searchTerm) ||
            rdv.programmeTitre.toLowerCase().includes(searchTerm)
        )
      }
    }

    // Calculer les statistiques
    const stats: RendezVousStats = {
      total: this.rendezVous.length,
      enAttente: this.rendezVous.filter(rdv => rdv.statut === 'enAttente').length,
      confirmes: this.rendezVous.filter(rdv => rdv.statut === 'confirme').length,
      annules: this.rendezVous.filter(rdv => rdv.statut === 'annule').length,
      termines: this.rendezVous.filter(rdv => rdv.statut === 'termine').length,
      reportes: this.rendezVous.filter(rdv => rdv.statut === 'reporte').length,
      aujourdhui: this.rendezVous.filter(rdv => rdv.date === new Date().toISOString().split('T')[0])
        .length,
      cetteSemaine: this.rendezVous.filter(rdv => {
        const today = new Date()
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
        const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6))
        const rdvDate = new Date(rdv.date)
        return rdvDate >= weekStart && rdvDate <= weekEnd
      }).length,
      ceMois: this.rendezVous.filter(rdv => {
        const today = new Date()
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        const rdvDate = new Date(rdv.date)
        return rdvDate >= monthStart && rdvDate <= monthEnd
      }).length,
    }

    return {
      rendezVous: filtered,
      total: filtered.length,
      stats,
    }
  }

  async getRendezVousById(id: string): Promise<RendezVous | undefined> {
    await delay()
    // Synchroniser avec le stockage partagé
    this.rendezVous = sharedRendezVous
    return this.rendezVous.find(rdv => rdv.id === id)
  }

  async createRendezVous(data: CreateRendezVousRequest): Promise<RendezVous> {
    await delay()

    // Synchroniser avec le stockage partagé
    this.rendezVous = sharedRendezVous

    // Récupérer le titre du programme si programmeId est fourni
    let programmeTitre = 'Programme de formation'
    if (data.programmeId) {
      programmeTitre = data.programmeTitre || 'Programme de formation'
    }

    const newRendezVous: RendezVous = {
      id: `rdv_${Date.now()}`,
      programmeTitre,
      statut: 'enAttente',
      duree: data.duree || 30,
      rappelEnvoye: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: '1', // ID de l'utilisateur connecté
      ...data,
    }

    this.rendezVous.push(newRendezVous)
    this.saveToShared()

    return newRendezVous
  }

  async updateRendezVous(id: string, data: UpdateRendezVousRequest): Promise<RendezVous> {
    await delay()

    // Synchroniser avec le stockage partagé
    this.rendezVous = sharedRendezVous

    const index = this.rendezVous.findIndex(rdv => rdv.id === id)
    if (index === -1) {
      throw new Error('Rendez-vous non trouvé')
    }

    this.rendezVous[index] = {
      ...this.rendezVous[index]!,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    this.saveToShared()
    return this.rendezVous[index]!
  }

  async deleteRendezVous(id: string): Promise<void> {
    await delay()

    // Synchroniser avec le stockage partagé
    this.rendezVous = sharedRendezVous

    const index = this.rendezVous.findIndex(rdv => rdv.id === id)
    if (index === -1) {
      throw new Error('Rendez-vous non trouvé')
    }

    this.rendezVous.splice(index, 1)
    this.saveToShared()
  }

  async getRendezVousDuJour(): Promise<RendezVous[]> {
    await delay()

    // Synchroniser avec le stockage partagé
    this.rendezVous = sharedRendezVous

    const aujourdhui = new Date().toISOString().split('T')[0] ?? ''
    return this.rendezVous.filter(rdv => rdv.date === aujourdhui)
  }

  async getRendezVousDeLaSemaine(): Promise<RendezVous[]> {
    await delay()

    // Synchroniser avec le stockage partagé
    this.rendezVous = sharedRendezVous

    const aujourdhui = new Date()
    const debutSemaine = new Date(aujourdhui)
    debutSemaine.setDate(aujourdhui.getDate() - aujourdhui.getDay())

    const finSemaine = new Date(debutSemaine)
    finSemaine.setDate(debutSemaine.getDate() + 6)

    const debutStr = debutSemaine.toISOString().split('T')[0] ?? ''
    const finStr = finSemaine.toISOString().split('T')[0] ?? ''

    return this.rendezVous.filter(rdv => rdv.date >= debutStr && rdv.date <= finStr)
  }

  async getRendezVousDuMois(): Promise<RendezVous[]> {
    await delay()

    // Synchroniser avec le stockage partagé
    this.rendezVous = sharedRendezVous

    const aujourdhui = new Date()
    const debutMois = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth(), 1)
    const finMois = new Date(aujourdhui.getFullYear(), aujourdhui.getMonth() + 1, 0)

    const debutStr = debutMois.toISOString().split('T')[0] ?? ''
    const finStr = finMois.toISOString().split('T')[0] ?? ''

    return this.rendezVous.filter(rdv => rdv.date >= debutStr && rdv.date <= finStr)
  }
}

export const rendezVousServiceShared = new RendezVousServiceShared()
export { RendezVousServiceShared }
