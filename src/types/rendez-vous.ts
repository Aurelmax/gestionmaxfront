export interface RendezVous {
  id: string
  programmeId: string
  programmeTitre: string
  client: {
    nom: string
    prenom: string
    email: string
    telephone?: string
    entreprise?: string
  }
  type: 'positionnement' | 'information' | 'inscription' | 'suivi'
  statut: 'enAttente' | 'confirme' | 'annule' | 'termine' | 'reporte'
  date: string // ISO string
  heure: string // Format HH:MM
  duree: number // en minutes
  lieu: 'presentiel' | 'visio' | 'telephone'
  adresse?: string // Pour présentiel
  lienVisio?: string // Pour visio
  notes?: string
  rappelEnvoye: boolean
  createdAt: string
  updatedAt: string
  createdBy?: string // ID de l'utilisateur qui a créé le RDV
}

export interface CreateRendezVousRequest {
  programmeId: string
  programmeTitre?: string
  client: {
    nom: string
    prenom: string
    email: string
    telephone?: string
    entreprise?: string
  }
  type: 'positionnement' | 'information' | 'inscription' | 'suivi'
  date: string
  heure: string
  duree?: number
  lieu: 'presentiel' | 'visio' | 'telephone'
  adresse?: string
  lienVisio?: string
  notes?: string
}

export interface UpdateRendezVousRequest {
  statut?: 'enAttente' | 'confirme' | 'annule' | 'termine' | 'reporte'
  date?: string
  heure?: string
  duree?: number
  lieu?: 'presentiel' | 'visio' | 'telephone'
  adresse?: string
  lienVisio?: string
  notes?: string
  rappelEnvoye?: boolean
}

export interface RendezVousFilters {
  statut?: string
  type?: string
  lieu?: string
  dateDebut?: string
  dateFin?: string
  programmeId?: string
  search?: string
}

export interface RendezVousStats {
  total: number
  enAttente: number
  confirmes: number
  annules: number
  termines: number
  reportes: number
  aujourdhui: number
  cetteSemaine: number
  ceMois: number
}
