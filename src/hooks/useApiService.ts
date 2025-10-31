/**
 * Hook personnalisé pour gérer les services API
 * Le frontend communique avec le backend Payload via REST API
 */

import { useMemo } from 'react'
import * as API from '@/lib/api'

export interface UseApiServiceReturn {
  // API disponible
  api: typeof API

  // État du mode
  isMockMode: boolean
  isApiMode: boolean
}

export function useApiService(): UseApiServiceReturn {
  // Le frontend utilise toujours l'API REST du backend
  const isMockMode = false
  const isApiMode = true

  return useMemo(
    () => ({
      api: API,
      isMockMode,
      isApiMode,
    }),
    []
  )
}

// Hook simplifié pour obtenir l'API
export function useAPI() {
  const { api } = useApiService()
  return api
}

// Hooks de compatibilité pour l'ancien code
export function useMainService() {
  const { api, isMockMode } = useApiService()
  return { service: api, isMockMode }
}

export function useUserService() {
  const { api, isMockMode } = useApiService()
  return { service: api, isMockMode }
}

export function useRendezVousService() {
  const { api, isMockMode } = useApiService()
  return { service: api, isMockMode }
}

export function useBlogService() {
  const { api, isMockMode } = useApiService()
  return { service: api, isMockMode }
}
