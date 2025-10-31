'use client'

import { MediaManager } from '@/components/admin/MediaManager'

export default function MediasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion des Médias</h1>
        <p className="text-muted-foreground">
          Gérez vos images et fichiers pour le blog et les articles
        </p>
      </div>

      <MediaManager />
    </div>
  )
}
