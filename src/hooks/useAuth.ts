/**
 * Hook pour la gestion de l'authentification et des permissions
 */

import { useState, useEffect, useCallback } from 'react'
import { User, Permission, hasPermission, isUserActive } from '@/types/common'
import { useUserService } from '@/hooks/useApiService'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  checkPermission: (permission: Permission) => boolean
  hasRole: (role: string) => boolean
  refreshUser: () => Promise<void>
}

export function useAuth(): AuthState & AuthActions {
  const { service: userService } = useUserService()
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  // Initialiser l'état d'authentification
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // En production, vérifier le token stocké
        let token = localStorage.getItem('auth_token')

        // Pour le développement, créer un token par défaut si aucun n'existe
        if (!token) {
          token = 'dev_token_admin'
          localStorage.setItem('auth_token', token)
        }

        if (token) {
          // Gérer le token de debug
          if (token === 'debug_token_admin') {
            const user = await userService.getUserByEmail('aurelien@gestionmax.fr')
            if (user) {
              setState({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              })
              return
            }
          }

          // Décoder le token et récupérer l'utilisateur
          // Pour le moment, utiliser l'utilisateur réel
          const user = await userService.getUserByEmail('aurelien@gestionmax.fr')
          if (user && isUserActive(user)) {
            setState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } else {
            localStorage.removeItem('auth_token')
            setState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            })
          }
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
        }
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: "Erreur lors de l'initialisation de l'authentification",
        })
      }
    }

    initializeAuth()
  }, [userService])

  // Fonction de connexion
  const login = useCallback(
    async (email: string, password: string) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }))

      try {
        // Pour l'instant, utiliser une authentification simplifiée
        const user = await userService.getUserByEmail(email)

        if (user && user.password === password) {
          // Stocker le token
          const token = `token_${user.id}_${Date.now()}`
          localStorage.setItem('auth_token', token)

          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } else {
          throw new Error('Email ou mot de passe incorrect')
        }
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Erreur de connexion',
        })
      }
    },
    [userService]
  )

  // Fonction de déconnexion
  const logout = useCallback(() => {
    console.log('🚪 Déconnexion en cours...')

    // Supprimer tous les tokens et données d'authentification
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('debug_mode')

    // Réinitialiser l'état
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })

    console.log('✅ Déconnexion terminée')

    // Rediriger vers la page de login du dashboard
    if (typeof window !== 'undefined') {
      window.location.href = '/dashboard/login'
    }
  }, [])

  // Vérifier une permission
  const checkPermission = useCallback(
    (permission: Permission): boolean => {
      if (!state.user || !isUserActive(state.user)) {
        return false
      }
      return hasPermission(state.user, permission)
    },
    [state.user]
  )

  // Vérifier un rôle
  const hasRole = useCallback(
    (role: string): boolean => {
      return state.user?.role === role
    },
    [state.user]
  )

  // Rafraîchir les données utilisateur
  const refreshUser = useCallback(async () => {
    if (!state.user) return

    try {
      const updatedUser = await userService.getUserById(state.user.id)
      if (updatedUser) {
        setState(prev => ({ ...prev, user: updatedUser }))
      }
    } catch (error) {
      console.error("Erreur lors du rafraîchissement de l'utilisateur:", error)
    }
  }, [state.user, userService])

  return {
    ...state,
    login,
    logout,
    checkPermission,
    hasRole,
    refreshUser,
  }
}

// Hook pour vérifier une permission spécifique
export function usePermission(permission: Permission): boolean {
  const { checkPermission } = useAuth()
  return checkPermission(permission)
}

// Hook pour vérifier un rôle spécifique
export function useRole(role: string): boolean {
  const { hasRole } = useAuth()
  return hasRole(role)
}

// Hook pour obtenir l'utilisateur actuel
export function useCurrentUser(): User | null {
  const { user } = useAuth()
  return user
}
