/**
 * Point d'entrée centralisé pour tous les types
 */

// Types communs (source de vérité - exported first)
export * from './common'

// Types utilisateurs et permissions (re-exports depuis common)
export { PERMISSIONS, hasRole } from './users'

// Types utilitaires
export * from './utils'

// Types API
export * from './api'

// Types blog - utiliser les types de blog.ts (plus détaillés que payload.ts)
export type {
  Article,
  Categorie,
  Tag,
  CreateArticleRequest,
  UpdateArticleRequest,
  ArticleFilters,
  ArticleStats,
} from './blog'

// Types rendez-vous - utiliser les types de rendez-vous.ts (plus détaillés)
export type {
  CreateRendezVousRequest,
  UpdateRendezVousRequest,
  RendezVousFilters,
  RendezVousStats,
} from './rendez-vous'

// Note: RendezVous et Apprenant sont exportés depuis common.ts (source de vérité)
// Note: ApiResponse et PaginatedResponse sont exportés depuis utils.ts
