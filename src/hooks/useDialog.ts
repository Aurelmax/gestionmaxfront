import { useState, useCallback } from 'react'

/**
 * Hook personnalisé pour gérer l'état des dialogs/modals
 * Gère l'ouverture, fermeture et les données associées
 */
export function useDialog<T = Record<string, unknown>>() {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<T | null>(null)

  const open = useCallback((dialogData?: T) => {
    setData(dialogData || null)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setData(null)
  }, [])

  const toggle = useCallback(
    (dialogData?: T) => {
      if (isOpen) {
        close()
      } else {
        open(dialogData)
      }
    },
    [isOpen, open, close]
  )

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
  }
}
