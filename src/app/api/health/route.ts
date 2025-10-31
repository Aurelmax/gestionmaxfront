import { NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/getPayloadClient'

/**
 * GET /api/health
 * Endpoint de santé pour vérifier l'état de l'application et de MongoDB
 */
export async function GET() {
  try {
    const payload = await getPayloadClient()

    // Vérifier l'état de la connexion MongoDB
    const db = payload.db
    const readyState = db?.connection?.readyState

    const statusMap: Record<number, string> = {
      0: 'Déconnecté',
      1: 'Connecté ✅',
      2: 'Connexion en cours...',
      3: 'Déconnexion en cours...',
    }

    const isHealthy = readyState === 1

    return NextResponse.json(
      {
        status: isHealthy ? 'healthy' : 'unhealthy',
        mongodb: {
          connected: isHealthy,
          readyState,
          readyStateLabel: statusMap[readyState || 0] || `État inconnu (${readyState})`,
        },
        timestamp: new Date().toISOString(),
        version: '1.0',
      },
      { status: isHealthy ? 200 : 503 }
    )
  } catch (error: any) {
    console.error('❌ Erreur health check:', error)
    return NextResponse.json(
      {
        status: 'error',
        error: error.message || 'Erreur inconnue',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
