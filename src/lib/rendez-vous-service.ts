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

class RendezVousService {
  private rendezVous: RendezVous[] = [...MOCK_RENDEZ_VOUS]

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('gestionmax_rendez_vous')
        if (stored) {
          const parsed = JSON.parse(stored)
          this.rendezVous = [...MOCK_RENDEZ_VOUS, ...parsed]
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error)
    }
  }

  private saveToStorage() {
    try {
      if (typeof window !== 'undefined') {
        const customRendezVous = this.rendezVous.filter(
          rdv => !MOCK_RENDEZ_VOUS.some(mock => mock.id === rdv.id)
        )
        localStorage.setItem('gestionmax_rendez_vous', JSON.stringify(customRendezVous))
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des rendez-vous:', error)
    }
  }

  async getRendezVous(
    filters?: RendezVousFilters
  ): Promise<{ rendezVous: RendezVous[]; total: number; stats: RendezVousStats }> {
    await delay()

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

    // Trier par date et heure
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.heure}`)
      const dateB = new Date(`${b.date}T${b.heure}`)
      return dateA.getTime() - dateB.getTime()
    })

    const stats = this.calculateStats(this.rendezVous)

    return {
      rendezVous: filtered,
      total: filtered.length,
      stats,
    }
  }

  async getRendezVousById(id: string): Promise<RendezVous | undefined> {
    await delay()
    return this.rendezVous.find(rdv => rdv.id === id)
  }

  async createRendezVous(data: CreateRendezVousRequest): Promise<RendezVous> {
    await delay()

    // Récupérer le titre du programme si programmeId est fourni
    let programmeTitre = 'Programme de formation'
    if (data.programmeId) {
      // Ici on pourrait récupérer le titre depuis un service programmes
      // Pour l'instant, on utilise les données fournies
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
    this.saveToStorage()

    return newRendezVous
  }

  async updateRendezVous(id: string, data: UpdateRendezVousRequest): Promise<RendezVous> {
    await delay()

    const index = this.rendezVous.findIndex(rdv => rdv.id === id)
    if (index === -1) {
      throw new Error('Rendez-vous non trouvé')
    }

    this.rendezVous[index] = {
      ...this.rendezVous[index]!,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    this.saveToStorage()
    return this.rendezVous[index]!
  }

  async deleteRendezVous(id: string): Promise<void> {
    await delay()

    const index = this.rendezVous.findIndex(rdv => rdv.id === id)
    if (index === -1) {
      throw new Error('Rendez-vous non trouvé')
    }

    this.rendezVous.splice(index, 1)
    this.saveToStorage()
  }

  async getRendezVousDuJour(): Promise<RendezVous[]> {
    await delay()

    const aujourdhui = new Date().toISOString().split('T')[0] ?? ''
    return this.rendezVous.filter(rdv => rdv.date === aujourdhui)
  }

  async getRendezVousDeLaSemaine(): Promise<RendezVous[]> {
    await delay()

    const aujourdhui = new Date()
    const debutSemaine = new Date(aujourdhui)
    debutSemaine.setDate(aujourdhui.getDate() - aujourdhui.getDay())

    const finSemaine = new Date(debutSemaine)
    finSemaine.setDate(debutSemaine.getDate() + 6)

    const debutStr = debutSemaine.toISOString().split('T')[0] ?? ''
    const finStr = finSemaine.toISOString().split('T')[0] ?? ''

    return this.rendezVous.filter(rdv => rdv.date >= debutStr && rdv.date <= finStr)
  }

  private calculateStats(rendezVous: RendezVous[]): RendezVousStats {
    const aujourdhui = new Date().toISOString().split('T')[0] ?? ''
    const debutSemaine = new Date()
    debutSemaine.setDate(debutSemaine.getDate() - debutSemaine.getDay())
    const finSemaine = new Date(debutSemaine)
    finSemaine.setDate(debutSemaine.getDate() + 6)

    const debutMois = new Date()
    debutMois.setDate(1)
    const finMois = new Date(debutMois.getFullYear(), debutMois.getMonth() + 1, 0)

    return {
      total: rendezVous.length,
      enAttente: rendezVous.filter(rdv => rdv.statut === 'enAttente').length,
      confirmes: rendezVous.filter(rdv => rdv.statut === 'confirme').length,
      annules: rendezVous.filter(rdv => rdv.statut === 'annule').length,
      termines: rendezVous.filter(rdv => rdv.statut === 'termine').length,
      reportes: rendezVous.filter(rdv => rdv.statut === 'reporte').length,
      aujourdhui: rendezVous.filter(rdv => rdv.date === aujourdhui).length,
      cetteSemaine: rendezVous.filter(rdv => {
        const rdvDate = new Date(rdv.date)
        return rdvDate >= debutSemaine && rdvDate <= finSemaine
      }).length,
      ceMois: rendezVous.filter(rdv => {
        const rdvDate = new Date(rdv.date)
        return rdvDate >= debutMois && rdvDate <= finMois
      }).length,
    }
  }
}

export const rendezVousService = new RendezVousService()
export { RendezVousService }
