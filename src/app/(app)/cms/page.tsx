'use client'

import { useEffect } from 'react'

export default function CMSPage() {
  useEffect(() => {
    // Redirection directe vers l'interface admin React
    window.location.href = '/dashboard'
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers l'interface d'administration...</p>
      </div>
    </div>
  )
}
