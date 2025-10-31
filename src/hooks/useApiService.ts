/**
 * Hook personnalisé pour gérer le basculement entre services mock et API
 */

import { useMemo } from 'react'
import { MockService } from '@/lib/mock-service'
import { UserService } from '@/lib/user-service'
import { payloadUserService } from '@/lib/payload-user-service'
import { RendezVousService } from '@/lib/rendez-vous-service'
import { BlogService } from '@/lib/blog-service'

export interface UseApiServiceReturn {
  // Services disponibles
  MockService: typeof MockService
  UserService: typeof UserService
  payloadUserService: typeof payloadUserService
  RendezVousService: typeof RendezVousService
  BlogService: typeof BlogService

  // Service actuel (Payload pour les users, mock pour les autres)
  currentService: typeof MockService
  currentUserService: typeof payloadUserService
  currentRendezVousService: typeof RendezVousService
  currentBlogService: typeof BlogService

  // État du mode
  isMockMode: boolean
  isApiMode: boolean
}

export function useApiService(): UseApiServiceReturn {
  // Côté client, utiliser Payload pour les users, mock pour le reste
  const isMockMode = true
  const isApiMode = false

  // Retourner les services appropriés
  return useMemo(
    () => ({
      // Services disponibles
      MockService,
      UserService,
      payloadUserService,
      RendezVousService,
      BlogService,

      // Services actuellement utilisés (Payload pour users, mock pour le reste)
      currentService: MockService,
      currentUserService: payloadUserService,
      currentRendezVousService: RendezVousService,
      currentBlogService: BlogService,

      // État du mode
      isMockMode,
      isApiMode,
    }),
    []
  )
}

// Hook simplifié pour obtenir le service principal
export function useMainService() {
  const { currentService, isMockMode } = useApiService()
  return { service: currentService, isMockMode }
}

// Hook simplifié pour obtenir le service utilisateurs
export function useUserService() {
  const { currentUserService, isMockMode } = useApiService()
  return { service: currentUserService, isMockMode }
}

// Hook simplifié pour obtenir le service rendez-vous
export function useRendezVousService() {
  const { currentRendezVousService, isMockMode } = useApiService()
  return { service: currentRendezVousService, isMockMode }
}

// Hook simplifié pour obtenir le service blog
export function useBlogService() {
  const { currentBlogService, isMockMode } = useApiService()
  return { service: currentBlogService, isMockMode }
}
