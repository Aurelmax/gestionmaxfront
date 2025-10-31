'use client'

import { Toaster as SonnerToaster } from 'sonner'

/**
 * Composant Toaster global pour les notifications
 * Utilise Sonner pour un affichage élégant et accessible
 *
 * Usage: Placer <Toaster /> dans le layout racine
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast: 'font-sans',
          title: 'text-sm font-medium',
          description: 'text-sm opacity-90',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
          error: 'bg-red-50 text-red-900 border-red-200',
          success: 'bg-green-50 text-green-900 border-green-200',
          warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
          info: 'bg-blue-50 text-blue-900 border-blue-200',
        },
      }}
    />
  )
}
