import { useState, useCallback } from 'react'
import { toast } from 'sonner'

interface AsyncOperationState {
  isLoading: boolean
  error: string | null
  isSuccess: boolean
}

/**
 * Hook personnalisé pour gérer les opérations asynchrones
 * Gère les états de chargement, erreurs et succès
 */
export function useAsyncOperation() {
  const [state, setState] = useState<AsyncOperationState>({
    isLoading: false,
    error: null,
    isSuccess: false,
  })

  const execute = useCallback(
    async <T>(
      operation: () => Promise<T>,
      options?: {
        onSuccess?: (result: T) => void
        onError?: (error: Error) => void
        successMessage?: string
        errorMessage?: string
        showToast?: boolean
      }
    ): Promise<T | null> => {
      setState({
        isLoading: true,
        error: null,
        isSuccess: false,
      })

      try {
        const result = await operation()

        setState({
          isLoading: false,
          error: null,
          isSuccess: true,
        })

        if (options?.onSuccess) {
          options.onSuccess(result)
        }

        if (options?.successMessage && options?.showToast !== false) {
          toast.success(options.successMessage)
        }

        return result
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue'

        setState({
          isLoading: false,
          error: errorMessage,
          isSuccess: false,
        })

        if (options?.onError) {
          options.onError(error instanceof Error ? error : new Error(errorMessage))
        }

        if (options?.errorMessage && options?.showToast !== false) {
          toast.error(options.errorMessage)
        } else if (options?.showToast !== false) {
          toast.error(errorMessage)
        }

        return null
      }
    },
    []
  )

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      isSuccess: false,
    })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}
