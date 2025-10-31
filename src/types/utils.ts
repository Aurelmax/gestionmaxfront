/**
 * Types utilitaires réutilisables
 */

// Rendre tous les champs optionnels sauf certains
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>
// Rendre certains champs requis
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>
// Type nullable
export type Nullable<T> = T | null
// Type optionnel
export type Optional<T> = T | undefined
// Extraire les clés d'un type donné
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]
// Type avec timestamps
export interface Timestamped {
  createdAt: Date
  updatedAt: Date
}
// Type avec soft delete
export interface SoftDeletable {
  deletedAt: Date | null
}
// Réponse API
export interface ApiSuccessResponse<T> {
  success: true
  data: T
}
export interface ApiErrorResponse {
  success: false
  error: {
    message: string
    code: string
    details?: unknown
  }
}
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse
// Pagination
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
