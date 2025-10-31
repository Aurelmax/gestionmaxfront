export interface Article {
  id: string
  titre: string
  slug: string
  contenu: string
  resume: string
  auteur: string
  datePublication?: string // Optional car peut être définie lors de la publication
  dateModification?: string // Optional car calculée automatiquement
  statut: 'brouillon' | 'publie' | 'archive'
  categories: string[]
  tags: string[]
  imagePrincipale?: string
  images?: string[]
  metaDescription: string
  metaKeywords: string[]
  vue: number
  tempsLecture: number // en minutes
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface Categorie {
  id: string
  nom: string
  slug: string
  description: string
  couleur: string
  icone: string
  createdAt: string
  updatedAt: string
}

export interface Tag {
  id: string
  nom: string
  slug: string
  couleur: string
  createdAt: string
  updatedAt: string
}

export interface CreateArticleRequest {
  titre: string
  contenu: string
  resume: string
  auteur: string
  statut: 'brouillon' | 'publie' | 'archive'
  categories: string[]
  tags: string[]
  imagePrincipale?: string
  images?: string[]
  metaDescription: string
  metaKeywords: string[]
  featured: boolean
  datePublication?: string
}

export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {
  id?: string // Optional car déjà passé en paramètre dans updateArticle(id, data)
}

export interface ArticleFilters {
  statut?: 'brouillon' | 'publie' | 'archive'
  categorie?: string
  tag?: string
  auteur?: string
  featured?: boolean
  dateDebut?: string
  dateFin?: string
  recherche?: string
}

export interface ArticleStats {
  total: number
  publies: number
  brouillons: number
  archives: number
  vuesTotal: number
  articlesPopulaires: Article[]
  categoriesPopulaires: { categorie: string; count: number }[]
  auteursActifs: { auteur: string; count: number }[]
}
