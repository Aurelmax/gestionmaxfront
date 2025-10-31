import { NextResponse } from 'next/server'
import { ApiRouteService } from '@/lib/api-route-service'

export async function GET() {
  try {
    const stats = await ApiRouteService.getStats()

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error('Erreur API statistiques:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}
