/**
 * Types pour les réponses API et requêtes HTTP
 */

// Types de méthodes HTTP
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// Configuration de requête
export interface RequestConfig {
  method: HttpMethod
  headers?: Record<string, string>
  body?: unknown
}

// Codes d'erreur API
export enum ApiErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

// Classe d'erreur personnalisée
export class ApiError extends Error {
  constructor(
    message: string,
    public code: ApiErrorCode,
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
